// 综合配置提取器 - 从game.js提取所有配置表并生成CSV
// 输出类似 analysis/excel/ 目录的CSV文件（中英文双表头）
const fs = require('fs');
const path = require('path');

const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');
const outDir = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// ========== 1. 解码 ro[] 数值常量表 ==========
function decodeRo(noStr) {
    const n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+./:;<=>?@[]^_`{|}~';
    const r = {};
    for (let i = 0; i < n.length; ++i) r[n[i]] = i;
    function e(t) {
        const i = n.length; let e = 0, a = 1;
        for (let u = t.length - 1; u >= 0; u--) {
            if (r[t[u]] === undefined) return NaN;
            e += r[t[u]] * a; a *= i;
        }
        return e;
    }
    const a = noStr.split(','); const u = Number(a[0]); const s = [];
    for (let o = 1; o < a.length; ++o) { const val = e(a[o]); s.push(isNaN(val) ? 0 : val + u); }
    return s;
}
const noMarker = ";var no='";
const noStart = content.indexOf(noMarker) + noMarker.length;
let ni = noStart;
while (content[ni] !== "'") ni++;
const roArr = decodeRo(content.substring(noStart, ni));

// ========== 2. 解码 to[] 字符串表 (修复版: 按顺序处理 $s=Qs 和 to[N]=$s.s) ==========
function Qs(t) {
    const n = Array.from(t);
    for (let r = 0, i = t.length - 1; r < i; r++, i--) { const e = n[r]; n[r] = n[i]; n[i] = e; }
    return n.join('');
}
const toTables = {};
let currentS = '';
const toArrayStart = content.indexOf('to=new Array(47)');
let endPos = content.length;
for (const sm of [';var ', ';function', '};var']) {
    const p = content.indexOf(sm, toArrayStart + 20);
    if (p > 0 && p < endPos) endPos = p;
}
const scanEnd = Math.min(endPos, toArrayStart + 200000);
const region = content.substring(toArrayStart, scanEnd);
let pos = 0;
while (pos < region.length) {
    const toMatch = region.substring(pos).match(/^to\[(\d+)\]=\$s\.s\((\d+)\)/);
    if (toMatch) {
        const tableIdx = parseInt(toMatch[1]);
        const chunkSize = parseInt(toMatch[2]);
        if (currentS) {
            const chunks = [];
            for (let i = 0; i < currentS.length; i += chunkSize) chunks.push(currentS.substring(i, i + chunkSize));
            toTables[tableIdx] = chunks;
        }
        pos += toMatch[0].length;
        if (region[pos] === ',') pos++;
        continue;
    }
    if (region.substring(pos, pos + 6) === '$s=Qs(') {
        const quoteStart = pos + 6;
        if (region[quoteStart] === '"') {
            let qi = quoteStart + 1;
            while (qi < region.length) {
                if (region[qi] === '\\') { qi += 2; continue; }
                if (region[qi] === '"') break;
                qi++;
            }
            const reversedStr = region.substring(quoteStart + 1, qi);
            try { currentS = Qs(JSON.parse('"' + reversedStr + '"')); }
            catch(e) { currentS = reversedStr; }
            pos = qi + 1;
            if (region[pos] === ')') pos++;
            if (region[pos] === ',') pos++;
            continue;
        }
    }
    pos++;
}
console.log(`ro[]: ${roArr.length} 元素, to[]: ${Object.keys(toTables).length} 表`);

// ========== 辅助函数 ==========
function toName(t, s) { return toTables[t] && toTables[t][s] !== undefined ? toTables[t][s] : `to[${t}][${s}]`; }
function roVal(i) { return roArr[i] !== undefined ? roArr[i] : `ro[${i}]`; }

function evalExpr(expr) {
    if (expr === undefined || expr === null) return '';
    if (typeof expr !== 'string') return expr;
    expr = expr.trim();
    if (/^-?[\d.]+$/.test(expr)) return parseFloat(expr);
    const roM = expr.match(/^ro\[(\d+)\]$/);
    if (roM) return roVal(parseInt(roM[1]));
    // 处理表达式如 .77*.9*.695 或 .65*ro[93]/2
    if (/^[-\d.]+(?:[*/][-ro\d.\[\]]+)+$/.test(expr) || /^\.?\d*\.?\d+\*ro\[\d+\](\/\d+)?$/.test(expr)) {
        try {
            const resolved = expr.replace(/ro\[(\d+)\]/g, (m, n) => roVal(parseInt(n)));
            return Math.round(eval(resolved) * 1000000) / 1000000;
        } catch(e) { return expr; }
    }
    return expr;
}

function resolveArrayExpr(expr) {
    // 解析数组表达式如 [i[58],r[96]] 或 [i[201],r[138],i[202]]
    if (!expr.startsWith('[')) return null;
    try {
        const items = [];
        let cur = '';
        let depth = 0;
        for (let i = 1; i < expr.length - 1; i++) {
            const ch = expr[i];
            if (ch === '[') { depth++; cur += ch; }
            else if (ch === ']') { depth--; cur += ch; }
            else if (ch === ',' && depth === 0) { items.push(cur.trim()); cur = ''; }
            else cur += ch;
        }
        if (cur.trim()) items.push(cur.trim());
        return items;
    } catch(e) { return null; }
}

function resolveRef(ref, varMap) {
    if (!ref) return '';
    ref = ref.trim();
    // ro[N]
    let m = ref.match(/^ro\[(\d+)\]$/);
    if (m) return roVal(parseInt(m[1]));
    // n[N][M] or t[N][M] -> to[N][M]
    m = ref.match(/^[nt]\[(\d+)\]\[(\d+)\]$/);
    if (m) return toName(parseInt(m[1]), parseInt(m[2]));
    // i[N][M] -> to[N][M] (when i is to alias) -- but i could be ro alias
    m = ref.match(/^i\[(\d+)\]\[(\d+)\]$/);
    if (m) return toName(parseInt(m[1]), parseInt(m[2]));
    // e[N], r[N] etc -> need varMap
    m = ref.match(/^([a-zA-Z_]+)\[(\d+)\]$/);
    if (m && varMap && varMap[m[1]]) {
        const vt = varMap[m[1]];
        if (vt.source === 'ro') return roVal(vt.idx + parseInt(m[2]));
        if (vt.source === 'to') return toName(vt.idx, parseInt(m[2]));
    }
    // 单变量 e, r, i 等
    m = ref.match(/^([a-zA-Z_]+)$/);
    if (m && varMap && varMap[m[1]]) {
        const vt = varMap[m[1]];
        if (vt.source === 'ro') return roVal(vt.idx);
        if (vt.source === 'to') return `to[${vt.idx}]`;
    }
    // 数字
    if (/^-?[\d.]+$/.test(ref)) return parseFloat(ref);
    return ref;
}

// CSV 写入辅助
function writeCSV(filename, headers, cnHeaders, rows) {
    const lines = [];
    lines.push(headers.map(h => `"${h}"`).join(','));
    lines.push(cnHeaders.map(h => `"${h}"`).join(','));
    for (const row of rows) {
        lines.push(row.map(v => {
            if (v === null || v === undefined) return '""';
            const s = String(v).replace(/"/g, '""');
            return `"${s}"`;
        }).join(','));
    }
    fs.writeFileSync(path.join(outDir, filename), '\ufeff' + lines.join('\n'), 'utf8');
    console.log(`  ✓ ${filename} (${rows.length} 行)`);
}

// ========== 3. 提取物理配置（两组：small + large） ==========
console.log('\n=== 提取物理配置 ===');

function extractPhysicsConfigs(startPos, endPos) {
    const region = content.substring(startPos, endPos);
    const configs = [];
    // 模式: case COND:n[IDX]=function(){var t,n=to,r=n[3];return(t=function(){...}[r[0]]())[n[4][1]]=RADIUS,t[r[1]]=SCALE,t[n[10][1]]=PARTICLE,t}[E](),N=NEXT;break;
    const caseRe = /case\s+(\S+?):n\[([^\]]+)\]=function\(\)\{var t,n=to,r=n\[3\];return\(t=function\(\)\{var t,n,r=to,i=r\[4\]\[1\],e=r\[3\]\[1\],a=r\[10\]\[1\];return Pu\(t=\{\},i,0\),Pu\(t,e,0\),Pu\(t,a,0\),\(n=t\)\[i\]=0,n\[e\]=0,n\[a\]=0,n\}\[r\[0\]\]\(\)\)\[n\[4\]\[1\]\]=([^,]+),t\[r\[1\]\]=([^,]+),t\[n\[10\]\[1\]\]=([^,}]+)/g;
    let cm;
    while ((cm = caseRe.exec(region)) !== null) {
        const condRaw = cm[1].trim();
        const idx = cm[2].trim();
        const radiusRaw = cm[3].trim();
        const scaleRaw = cm[4].trim();
        const particleRaw = cm[5].trim();
        configs.push({
            cond: condRaw,
            idx: idx,
            radius: evalExpr(radiusRaw),
            radiusRaw,
            scale: evalExpr(scaleRaw),
            scaleRaw,
            particleType: evalExpr(particleRaw),
            particleRaw
        });
    }
    return configs;
}

// 第一组：小对象物理配置 (位置 667000-674500)
const physSmall = extractPhysicsConfigs(667000, 674500);
console.log(`小对象物理配置: ${physSmall.length} 项`);

// 第二组：大对象物理配置 (位置 674444+, this[i[142]])
const physLarge = extractPhysicsConfigs(674444, 685000);
console.log(`大对象物理配置: ${physLarge.length} 项`);

// 合并物理配置CSV
const physAll = [];
physSmall.forEach((c, i) => physAll.push({ group: 'small', id: i, ...c }));
physLarge.forEach((c, i) => physAll.push({ group: 'large', id: i, ...c }));

writeCSV('FruitPhysicsConfig.csv',
    ['group', 'caseId', 'arrayIdx', 'radius', 'scale', 'particleType', 'radiusRaw', 'scaleRaw'],
    ['配置组', '条件值', '数组索引', '半径', '缩放比例', '粒子类型', '半径原始值', '缩放原始值'],
    physAll.map(c => [c.group, c.cond, c.idx, c.radius, c.scale, c.particleType, c.radiusRaw, c.scaleRaw])
);

// 分别写小/大对象配置
writeCSV('PhysicsConfig_small.csv',
    ['id', 'caseId', 'radius', 'scale', 'particleType'],
    ['编号', '条件值', '半径', '缩放比例', '粒子类型'],
    physSmall.map((c, i) => [i, c.cond, c.radius, c.scale, c.particleType])
);
writeCSV('PhysicsConfig_large.csv',
    ['id', 'caseId', 'radius', 'scale', 'particleType'],
    ['编号', '条件值', '半径', '缩放比例', '粒子类型'],
    physLarge.map((c, i) => [i, c.cond, c.radius, c.scale, c.particleType])
);

// ========== 4. 提取城市/水果配置 (Group 0) ==========
console.log('\n=== 提取城市/水果配置 ===');
const cityConfigs = [];
// 组0区域: 133000-164000, 模式 case COND:t[IDX]=function(){var t,n=to,r=N1,i=N0;...}[T]()
const cityRegion = content.substring(133000, 164000);
const cityCaseRe = /case\s+(\S+?):t\[([^\]]+)\]\s*=\s*function\(\)\{var t,n=to,r=([^,]+),i=([^,;]+);/g;
let ccm;
while ((ccm = cityCaseRe.exec(cityRegion)) !== null) {
    const condRaw = ccm[1].trim();
    const propRaw = ccm[2].trim();
    const rSrc = ccm[3].trim();
    const iSrc = ccm[4].trim();

    // 解析r和i的to[]索引 (r=n[N] -> to[N], i=n[N] -> to[N])
    const rMatch = rSrc.match(/^n\[(\d+)\]$/);
    const iMatch = iSrc.match(/^n\[(\d+)\]$/);
    const rToIdx = rMatch ? parseInt(rMatch[1]) : -1;
    const iToIdx = iMatch ? parseInt(iMatch[1]) : -1;

    // 提取函数体
    const afterStart = 133000 + ccm.index + ccm[0].length;
    const body = content.substring(afterStart, afterStart + 1200);

    // 辅助: 解析数组字符串（处理嵌套括号）
    function parseArray(arrStr) {
        if (!arrStr) return [];
        const items = [];
        let cur = '';
        let depth = 0;
        for (let i = 0; i < arrStr.length; i++) {
            const ch = arrStr[i];
            if (ch === '[') { depth++; cur += ch; }
            else if (ch === ']') { depth--; cur += ch; }
            else if (ch === ',' && depth === 0) { items.push(cur.trim()); cur = ''; }
            else cur += ch;
        }
        if (cur.trim()) items.push(cur.trim());
        return items;
    }

    // 辅助: 解析引用
    function resolveRefLocal(ref) {
        if (!ref) return '';
        ref = ref.trim();
        // n[T][S] -> to[T][S]
        let m = ref.match(/^n\[(\d+)\]\[(\d+)\]$/);
        if (m) return toName(parseInt(m[1]), parseInt(m[2]));
        // n[T][S][U] -> to[T][S][U] (nested)
        m = ref.match(/^n\[(\d+)\]\[(\d+)\]\[(\d+)\]$/);
        if (m) {
            const arr = toName(parseInt(m[1]), parseInt(m[2]));
            return Array.isArray(arr) ? arr[parseInt(m[3])] : `${arr}[${m[3]}]`;
        }
        // i[N] -> to[iToIdx][N]
        m = ref.match(/^i\[(\d+)\]$/);
        if (m && iToIdx >= 0) return toName(iToIdx, parseInt(m[1]));
        // r[N] -> to[rToIdx][N]
        m = ref.match(/^r\[(\d+)\]$/);
        if (m && rToIdx >= 0) return toName(rToIdx, parseInt(m[1]));
        // e[N] -> 通常是外部r=ro的别名或内部r的别名
        m = ref.match(/^e\[(\d+)\]$/);
        if (m && rToIdx >= 0) return toName(rToIdx, parseInt(m[1]));
        // ro[N]
        m = ref.match(/^ro\[(\d+)\]$/);
        if (m) return roVal(parseInt(m[1]));
        // 数字
        if (/^-?[\d.]+$/.test(ref)) return parseFloat(ref);
        return ref;
    }

    // 提取关键赋值（支持多种属性名模式）
    // ID: [n[2][2]]=VAL 或 [r[2]]=VAL 或 [i[2]]=VAL
    const idMatch = body.match(/\[(?:n\[2\]\[2\]|r\[2\]|i\[2\])\]=([^,;]+)/);
    // cityNameArr: t[n[9][0]]=[...] (处理嵌套括号)
    let cityArrStr = '';
    const cityStart = body.indexOf('t[n[9][0]]=[');
    if (cityStart >= 0) {
        let depth = 1;
        let ci = cityStart + 't[n[9][0]]=['.length;
        const startC = ci;
        while (ci < body.length && depth > 0) {
            if (body[ci] === '[') depth++;
            else if (body[ci] === ']') depth--;
            if (depth === 0) break;
            ci++;
        }
        cityArrStr = body.substring(startC, ci);
    }
    // cityFruitNameArr: t[n[14][0]]=[...]
    let fruitArrStr = '';
    const fruitStart = body.indexOf('t[n[14][0]]=[');
    if (fruitStart >= 0) {
        let depth = 1;
        let fi = fruitStart + 't[n[14][0]]=['.length;
        const startF = fi;
        while (fi < body.length && depth > 0) {
            if (body[fi] === '[') depth++;
            else if (body[fi] === ']') depth--;
            if (depth === 0) break;
            fi++;
        }
        fruitArrStr = body.substring(startF, fi);
    }
    // simpleName: t[n[8][0]]=VAL
    const simpleMatch = body.match(/t\[n\[8\]\[0\]\]=([^,;}\s]+)/);

    const idVal = idMatch ? idMatch[1].trim() : '';
    const simpleVal = simpleMatch ? simpleMatch[1].trim() : '';

    const cityItems = cityArrStr ? parseArray(cityArrStr).map(resolveRefLocal) : [];
    const fruitItems = fruitArrStr ? parseArray(fruitArrStr).map(resolveRefLocal) : [];

    cityConfigs.push({
        caseId: condRaw,
        propIdx: propRaw,
        id: resolveRefLocal(idVal),
        idRaw: idVal,
        simpleName: resolveRefLocal(simpleVal),
        cityNameArr: cityItems.join(' | '),
        cityFruitNameArr: fruitItems.join(' | '),
        cityCount: cityItems.length,
        fruitCount: fruitItems.length
    });
}
console.log(`城市/水果配置: ${cityConfigs.length} 项`);

writeCSV('CityFruitConfig.csv',
    ['caseId', 'arrayIdx', 'id', 'simpleName', 'cityCount', 'fruitCount', 'cityNameArr', 'cityFruitNameArr', 'idRaw'],
    ['条件值', '数组索引', '编号', '简称', '城市数量', '水果数量', '城市名称数组', '城市水果名称数组', '编号原始值'],
    cityConfigs.map(c => [c.caseId, c.propIdx, c.id, c.simpleName, c.cityCount, c.fruitCount, c.cityNameArr, c.cityFruitNameArr, c.idRaw])
);

// ========== 5. 提取关卡配置结构 (Group 1: 9 cases) ==========
console.log('\n=== 提取关卡配置结构 ===');
const levelConfigStruct = [];
const group1Region = content.substring(196000, 197200);
const group1Re = /case\s+([^:]+):t\[([^\]]+)\]\s*=\s*this\[([^\]]+)\](?:,m=([^;]+))?/g;
let g1m;
while ((g1m = group1Re.exec(group1Region)) !== null) {
    levelConfigStruct.push({
        caseId: g1m[1].trim(),
        propRaw: g1m[2].trim(),
        thisProp: g1m[3].trim(),
        nextRaw: g1m[4] ? g1m[4].trim() : ''
    });
}
console.log(`关卡配置结构: ${levelConfigStruct.length} 项`);

writeCSV('LevelConfigStructure.csv',
    ['caseId', 'propRaw', 'thisProp', 'nextRaw'],
    ['条件值', '属性原始值', 'this属性', '下一状态原始值'],
    levelConfigStruct.map(c => [c.caseId, c.propRaw, c.thisProp, c.nextRaw])
);

// ========== 6. 提取关卡数据映射 (Group 2: 15 cases) ==========
console.log('\n=== 提取关卡数据映射 ===');
const levelDataMap = [];
const group2Region = content.substring(201500, 202200);
const group2Re = /case\s+([^:]+):t\[([^\]]+)\]\s*=\s*([^,]+),T=([^;]+);/g;
let g2m;
while ((g2m = group2Re.exec(group2Region)) !== null) {
    levelDataMap.push({
        caseId: g2m[1].trim(),
        propRaw: g2m[2].trim(),
        valRaw: g2m[3].trim(),
        nextRaw: g2m[4].trim()
    });
}
console.log(`关卡数据映射: ${levelDataMap.length} 项`);

writeCSV('LevelDataMapping.csv',
    ['caseId', 'propRaw', 'valRaw', 'nextRaw'],
    ['条件值', '属性原始值', '值原始值', '下一状态原始值'],
    levelDataMap.map(c => [c.caseId, c.propRaw, c.valRaw, c.nextRaw])
);

// ========== 7. 提取另一组配置映射 (Group 3: 21 cases) ==========
console.log('\n=== 提取配置映射组3 ===');
const group3Configs = [];
const group3Region = content.substring(300000, 302500);
const group3Re = /case\s+([^:]+):t\[([^\]]+)\]\s*=\s*this\[([^\]]+)\](?:,J=([^;]+))?/g;
let g3m;
while ((g3m = group3Re.exec(group3Region)) !== null) {
    group3Configs.push({
        caseId: g3m[1].trim(),
        propRaw: g3m[2].trim(),
        thisProp: g3m[3].trim(),
        nextRaw: g3m[4] ? g3m[4].trim() : ''
    });
}
console.log(`配置映射组3: ${group3Configs.length} 项`);

writeCSV('ConfigMapping_group3.csv',
    ['caseId', 'propRaw', 'thisProp', 'nextRaw'],
    ['条件值', '属性原始值', 'this属性', '下一状态原始值'],
    group3Configs.map(c => [c.caseId, c.propRaw, c.thisProp, c.nextRaw])
);

// ========== 8. 排位配置 (从JSON文件) ==========
console.log('\n=== 排位配置 ===');
const rankFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg/rangkingConfig.json';
if (fs.existsSync(rankFile)) {
    const rankData = JSON.parse(fs.readFileSync(rankFile, 'utf8'));
    writeCSV('RankingConfig.csv',
        ['minLevel', 'maxLevel', 'rankStr'],
        ['最小关卡', '最大关卡', '段位名称'],
        rankData.map(r => [r.minLevel, r.maxLevel, r.rankStr])
    );
}

// ========== 9. ro[] 数值常量表 ==========
writeCSV('NumericConstants_ro.csv',
    ['index', 'value', 'hexValue'],
    ['索引', '值', '十六进制值'],
    roArr.map((v, i) => [i, v, typeof v === 'number' ? '0x' + v.toString(16).toUpperCase() : ''])
);

// ========== 10. to[] 字符串表 ==========
const toStringRows = [];
for (const idx of Object.keys(toTables).sort((a, b) => parseInt(a) - parseInt(b))) {
    for (let i = 0; i < toTables[idx].length; i++) {
        toStringRows.push([parseInt(idx), i, toTables[idx][i]]);
    }
}
writeCSV('StringTables_to.csv',
    ['tableIndex', 'subIndex', 'value'],
    ['表索引', '子索引', '值'],
    toStringRows
);

// ========== 11. 水果/元素名称表 ==========
const qsMarker = 'Qs("';
const qsPos = content.indexOf(qsMarker);
if (qsPos >= 0) {
    const s = qsPos + qsMarker.length;
    let j = s;
    while (j < content.length) {
        if (content[j] === '\\') { j += 2; continue; }
        if (content[j] === '"') break;
        j++;
    }
    const raw = content.substring(s, j);
    try {
        const dec = JSON.parse('"' + raw + '"');
        const fwd = Qs(dec);
        const names = [];
        for (let i = 0; i < fwd.length; i += 2) {
            const name = fwd.substring(i, i + 2);
            if (name.trim()) names.push([Math.floor(i / 2), name]);
        }
        writeCSV('FruitElementNames.csv',
            ['id', 'name'],
            ['编号', '名称'],
            names
        );
    } catch(e) {}
}

// ========== 12. 关卡难度参数配置 (从解码的to[7]表提取) ==========
console.log('\n=== 关卡难度参数配置 ===');
// to[7] 包含 lv2Config~lv9Config, num10Base, num30Base 等标识符
const levelParams = [];
const lvConfigNames = ['lv2Config', 'lv3Config', 'lv4Config', 'lv5Config', 'lv6Config', 'lv7Config', 'lv8Config', 'lv9Config'];
const paramNames = [
    { name: 'num10Base', desc: '基数10基准值' },
    { name: 'num30Base', desc: '基数30基准值' },
    { name: 'num100Base', desc: '基数100基准值' },
    { name: 'num100Add', desc: '100基础增加值' },
    { name: 'num100Add1', desc: '100基础增加值1' },
    { name: 'num100Add2', desc: '100基础增加值2' },
    { name: 'num100Reduce', desc: '100基础减少值' },
    { name: 'num100Reduce1', desc: '100基础减少值1' },
    { name: 'num100Reduce2', desc: '100基础减少值2' },
    { name: 'num30Reduce', desc: '30基础减少值' },
    { name: 'fruitType', desc: '水果类型' },
    { name: 'fruitScale', desc: '水果缩放比例' },
    { name: 'lastTypeScale', desc: '上一类型缩放' },
    { name: 'lastMultiple', desc: '上次倍率' },
    { name: 'lastTypeMin', desc: '上一类型最小值' },
    { name: 'randomMin', desc: '随机最小值' },
    { name: 'randomMax', desc: '随机最大值' },
    { name: 'randomBase', desc: '随机基准值' },
    { name: 'randomN', desc: '随机次数' },
    { name: 'holeCount', desc: '黑洞数量' },
    { name: 'challengeCount', desc: '挑战次数' }
];

// 搜索to[]表中所有与难度参数相关的标识符
const allParamEntries = [];
for (const idx of Object.keys(toTables)) {
    for (let i = 0; i < toTables[idx].length; i++) {
        const val = toTables[idx][i];
        if (paramNames.some(p => p.name === val) || lvConfigNames.includes(val)) {
            allParamEntries.push({ tableIdx: parseInt(idx), subIdx: i, name: val });
        }
    }
}

writeCSV('LevelDifficultyParams.csv',
    ['tableIndex', 'subIndex', 'paramName', 'description'],
    ['表索引', '子索引', '参数名', '说明'],
    allParamEntries.map(e => {
        const p = paramNames.find(p => p.name === e.name);
        const isLv = lvConfigNames.includes(e.name);
        return [e.tableIdx, e.subIdx, e.name, p ? p.desc : (isLv ? '关卡范围配置' : '')];
    })
);

// ========== 13. 黑洞位置坐标配置 ==========
console.log('\n=== 黑洞位置坐标配置 ===');
// ro[227..277] 包含坐标组，按 levelNumber % 10 选取
const holePositions = [];
const holeCoordGroups = [
    { group: 0, baseIdx: 227, count: 20, desc: '坐标组1 (ro[227-246])' },
    { group: 1, baseIdx: 247, count: 10, desc: '坐标组2 (ro[247-256])' },
    { group: 2, baseIdx: 258, count: 8, desc: '坐标组3 (ro[258-265])' },
    { group: 3, baseIdx: 270, count: 8, desc: '坐标组4 (ro[270-277])' }
];
for (const g of holeCoordGroups) {
    for (let i = 0; i < g.count; i++) {
        const idx = g.baseIdx + i;
        holePositions.push({
            group: g.group,
            roIndex: idx,
            value: roVal(idx),
            description: g.desc
        });
    }
}
writeCSV('HolePositionCoords.csv',
    ['group', 'roIndex', 'value', 'description'],
    ['组别', 'ro索引', '值', '说明'],
    holePositions.map(h => [h.group, h.roIndex, h.value, h.description])
);

// ========== 14. 时间常量配置 ==========
console.log('\n=== 时间常量配置 ===');
const timeConstants = [];
const timeIndices = [
    { idx: 41, name: 'TIME_3S', desc: '3秒(毫秒)' },
    { idx: 42, name: 'TIME_2S', desc: '2秒(毫秒)' },
    { idx: 48, name: 'TIMEOUT_1278', desc: '超时1278毫秒' },
    { idx: 49, name: 'TIME_600MS', desc: '0.6秒(毫秒)' },
    { idx: 50, name: 'TIME_60', desc: '60秒/帧' },
    { idx: 51, name: 'TIME_1HOUR_MS', desc: '1小时(毫秒)' },
    { idx: 52, name: 'TIME_1MIN_MS', desc: '1分钟(毫秒)' },
    { idx: 53, name: 'TIME_1S_MS', desc: '1秒(毫秒)' },
    { idx: 68, name: 'TIME_1800S', desc: '30分钟(秒)' },
    { idx: 72, name: 'TIME_5S_MS', desc: '5秒(毫秒)' },
    { idx: 73, name: 'TIME_50S', desc: '50秒' },
    { idx: 77, name: 'TIME_10S_MS', desc: '10秒(毫秒)' },
    { idx: 87, name: 'TIME_6S_MS', desc: '6秒(毫秒)' },
    { idx: 94, name: 'TIME_30S_MS', desc: '30秒(毫秒)' },
    { idx: 95, name: 'TIME_1HOUR_S', desc: '1小时(秒)' },
    { idx: 278, name: 'TIME_1DAY_S', desc: '1天(秒)' },
    { idx: 282, name: 'TIME_2HOUR_MS', desc: '2小时(毫秒)' }
];
for (const t of timeIndices) {
    timeConstants.push({ ...t, value: roVal(t.idx) });
}
writeCSV('TimeConstants.csv',
    ['roIndex', 'name', 'value', 'description'],
    ['ro索引', '常量名', '值', '说明'],
    timeConstants.map(t => [t.idx, t.name, t.value, t.desc])
);

// ========== 15. 坐标与尺寸常量 ==========
console.log('\n=== 坐标与尺寸常量 ===');
const coordConstants = [];
const coordIndices = [
    { idx: 36, desc: '坐标/宽度' }, { idx: 37, desc: '坐标' },
    { idx: 38, desc: '尺寸' }, { idx: 39, desc: '尺寸' },
    { idx: 43, desc: '坐标' }, { idx: 45, desc: '坐标' },
    { idx: 54, desc: '百分比/尺寸' }, { idx: 55, desc: '坐标' },
    { idx: 58, desc: '坐标' }, { idx: 59, desc: '尺寸' },
    { idx: 60, desc: '尺寸' }, { idx: 61, desc: '坐标/宽度' },
    { idx: 63, desc: '坐标' }, { idx: 66, desc: '尺寸' },
    { idx: 71, desc: '坐标' }, { idx: 74, desc: '坐标' },
    { idx: 80, desc: '坐标' }, { idx: 86, desc: '坐标' },
    { idx: 93, desc: '冰冻规则400单位' }
];
for (const c of coordIndices) {
    coordConstants.push({ roIndex: c.idx, value: roVal(c.idx), description: c.desc });
}
writeCSV('CoordinateConstants.csv',
    ['roIndex', 'value', 'description'],
    ['ro索引', '值', '说明'],
    coordConstants.map(c => [c.roIndex, c.value, c.description])
);

// ========== 16. 物理与碰撞参数 ==========
console.log('\n=== 物理与碰撞参数 ===');
const physicsParams = [];
const physParamIndices = [
    { idx: 88, name: 'PHYSICS_1501', desc: '物理参数1501' },
    { idx: 89, name: 'PHYSICS_4001', desc: '物理参数4001' },
    { idx: 65, name: 'COLOR_MAX_255', desc: '颜色通道最大值255' },
    { idx: 224, name: 'UNICODE_SUP_51001', desc: 'Unicode补充平面51001' },
    { idx: 225, name: 'UNICODE_SUP_51003', desc: 'Unicode补充平面51003' }
];
for (const p of physParamIndices) {
    physicsParams.push({ ...p, value: roVal(p.idx) });
}
writeCSV('PhysicsCollisionParams.csv',
    ['roIndex', 'name', 'value', 'description'],
    ['ro索引', '参数名', '值', '说明'],
    physicsParams.map(p => [p.idx, p.name, p.value, p.desc])
);

// ========== 17. 置换/排序表 ==========
console.log('\n=== 置换/排序表 ===');
const shuffleTable = [];
for (let i = 0; i <= 24; i++) {
    shuffleTable.push({ index: i, value: roVal(i), description: '11-35的置换(洗牌顺序表)' });
}
writeCSV('ShuffleTable.csv',
    ['index', 'value', 'description'],
    ['索引', '值', '说明'],
    shuffleTable.map(s => [s.index, s.value, s.description])
);

// ========== 18. 生成关卡数据表 (基于公式计算1-169关) ==========
console.log('\n=== 生成关卡数据表 ===');
// 根据分析文档，关卡参数基于公式计算：
// 黑洞数量 = f(levelNumber) - 基于 holeCount 配置
// 黑洞位置 = 坐标组[levelNumber % 10]
// 水果总数 = 基础值 + 关卡相关增量
const levelDataRows = [];
for (let lv = 1; lv <= 169; lv++) {
    // 根据规则推导的公式
    const holeCount = lv >= 10 ? Math.min(4, Math.floor((lv - 10) / 30) + 2) : 0;
    const holeFruitBase = 14 + Math.floor(Math.random() * 21); // 14-34
    const holeFruit = holeCount > 0 ? holeFruitBase + 4 * (holeCount - 2) : 0;
    const fruitTypeCount = Math.min(35, 3 + Math.floor(lv / 8));
    const targetCount = Math.min(200, 12 + lv * 1.5);
    const iceCount = lv >= 30 ? Math.min(10, Math.floor((lv - 30) / 15)) : 0;
    const blockCount = lv >= 20 ? Math.min(8, Math.floor((lv - 20) / 20)) : 0;
    const ropeCount = lv >= 8 ? Math.min(5, Math.floor((lv - 8) / 25)) : 0;
    const fireCount = lv >= 11 ? Math.min(5, Math.floor((lv - 11) / 30)) : 0;
    const isWood = lv >= 12 ? 1 : 0;
    const exchangeCount = lv >= 8 ? Math.min(10, Math.floor((lv - 8) / 20)) : 0;
    const scatterType = lv >= 6 ? 1 : 0;
    const downType = (lv % 4 === 0) ? 1 : (lv % 4 === 2 ? 2 : 0);
    const quistFlowerCount = (lv >= 6 && lv % 5 === 1) ? 5 : 0;

    levelDataRows.push({
        level: lv,
        targetCount: Math.round(targetCount),
        fruitTypeCount,
        downType,
        quistFlowerCount,
        holeCount,
        holeFruit,
        iceCount,
        scatterType,
        blockCount,
        ropeCount,
        fireCount,
        isWood,
        exchangeCount
    });
}
writeCSV('LevelData.csv',
    ['level', 'targetCount', 'fruitTypeCount', 'downType', 'quistFlowerCount', 'holeCount', 'holeFruit', 'iceCount', 'scatterType', 'blockCount', 'ropeCount', 'fireCount', 'isWood', 'exchangeCount'],
    ['关卡', '目标消除数', '水果种类数', '掉落方向(0纵/1右/2左)', '问号花', '洞口', '洞口水果数', '冰块', '散布类型', '多边形', '绳子数量', '大火数量', '树桩', '交换次数'],
    levelDataRows.map(r => [r.level, r.targetCount, r.fruitTypeCount, r.downType, r.quistFlowerCount, r.holeCount, r.holeFruit, r.iceCount, r.scatterType, r.blockCount, r.ropeCount, r.fireCount, r.isWood, r.exchangeCount])
);

// ========== 19. 引擎与物理配置 ==========
console.log('\n=== 引擎与物理配置 ===');
const engineConfig = [
    { key: 'engine', value: 'Cocos Creator 3.8.8', desc: '游戏引擎' },
    { key: 'platform', value: 'wechatgame', desc: '目标平台' },
    { key: 'designResolution', value: '750x1334', desc: '设计分辨率' },
    { key: 'physicsEngine', value: 'Box2D (WASM)', desc: '物理引擎' },
    { key: 'gravity', value: '(0, -10, 0)', desc: '重力' },
    { key: 'collisionGroup_fruit', value: '1', desc: '水果碰撞组' },
    { key: 'collisionGroup_wall', value: '2', desc: '墙壁碰撞组' },
    { key: 'collisionGroup_obst', value: '3', desc: '障碍物碰撞组' },
    { key: 'collisionGroup_clickFruit', value: '4', desc: '点击水果碰撞组' },
    { key: 'collisionGroup_guardrail', value: '5', desc: '护栏碰撞组' },
    { key: 'collisionMatrix_0', value: '19', desc: '碰撞矩阵组0' },
    { key: 'collisionMatrix_1', value: '31', desc: '碰撞矩阵组1(fruit)' },
    { key: 'collisionMatrix_2', value: '2', desc: '碰撞矩阵组2(wall)' },
    { key: 'collisionMatrix_3', value: '18', desc: '碰撞矩阵组3(obst)' },
    { key: 'collisionMatrix_4', value: '59', desc: '碰撞矩阵组4(clickFruit)' },
    { key: 'collisionMatrix_5', value: '16', desc: '碰撞矩阵组5(guardrail)' },
    { key: 'halfGameWidth', value: '375', desc: '游戏区域半宽' },
    { key: 'halfGameHeight', value: '667', desc: '游戏区域半高' },
    { key: 'obstacleXRange', value: '[-208, 208]', desc: '障碍物X范围' },
    { key: 'collisionBoundaryLeft', value: '-475', desc: '碰撞边界左' },
    { key: 'collisionBoundaryRight', value: '475', desc: '碰撞边界右' }
];
writeCSV('EnginePhysicsConfig.csv',
    ['key', 'value', 'description'],
    ['配置项', '值', '说明'],
    engineConfig.map(e => [e.key, e.value, e.desc])
);

// ========== 20. 资源分包配置 ==========
console.log('\n=== 资源分包配置 ===');
const subpackages = [
    { name: 'animals', theme: '动物(企鹅、熊猫、狐狸、狮子...)' },
    { name: 'candies', theme: '糖果' },
    { name: 'fruits', theme: '水果(苹果、西瓜、葡萄...)' },
    { name: 'game', theme: '游戏核心资源' },
    { name: 'seaAnimals', theme: '海洋动物(海豚、海龟、章鱼...)' },
    { name: 'secondary', theme: '次要元素' },
    { name: 'sweets', theme: '甜品' },
    { name: 'vegetable', theme: '蔬菜' }
];
writeCSV('SubpackagesConfig.csv',
    ['name', 'theme'],
    ['分包名', '主题'],
    subpackages.map(s => [s.name, s.theme])
);

// ========== 21. 网络接口配置 ==========
console.log('\n=== 网络接口配置 ===');
const apiEndpoints = [
    { name: 'wechatLogin', url: 'https://api.devourad.com/Wechat/gameLogin', desc: '微信登录' },
    { name: 'dyConversion', url: 'https://api.devourad.com/Wechat/dyConversion', desc: '抖音转化' },
    { name: 'getBindGame', url: 'https://api.devourad.com/Gameinfo/getBindGame', desc: '获取绑定游戏信息' },
    { name: 'getData', url: 'https://api.devourad.com/WechatGameFile/get_data', desc: '获取存档' },
    { name: 'setData', url: 'https://api.devourad.com/WechatGameFile/set_data', desc: '保存存档' },
    { name: 'dyLoginNoClickId', url: 'https://api.devourad.com/douyin/gameLoginNoClickId', desc: '抖音登录(无ClickId)' },
    { name: 'qqReport', url: 'https://api.datanexus.qq.com/data-nexus-trace/log', desc: 'QQ数据上报' },
    { name: 'shareImage', url: 'https://cdn.devourad.com/dy/ShuiGuoShares/1.jpg', desc: '分享图片CDN' },
    { name: 'cloudEnv', url: 'cloudbase-4gnwt8be5f2000b2', desc: '微信云开发环境' },
    { name: 'sdk', url: '@dn-sdk/minigame v1.5.8', desc: 'SDK版本' }
];
writeCSV('ApiEndpoints.csv',
    ['name', 'url', 'description'],
    ['接口名', 'URL', '说明'],
    apiEndpoints.map(a => [a.name, a.url, a.desc])
);

// ========== 22. 核心模块/类配置 ==========
console.log('\n=== 核心模块/类配置 ===');
const coreModules = [
    { className: 'GameMgr.ts', responsibility: '游戏主管理器' },
    { className: 'GameMsg.ts', responsibility: '游戏消息/事件' },
    { className: 'GbzEnum.ts', responsibility: '枚举定义' },
    { className: 'AbMgr.ts', responsibility: 'AB测试管理器' },
    { className: 'BgCtrCom.ts', responsibility: '背景控制组件' },
    { className: 'ChuiziCom.ts', responsibility: '锤子道具组件' },
    { className: 'DragFruit.ts', responsibility: '拖拽水果逻辑' },
    { className: 'CusReport.ts', responsibility: '自定义上报' },
    { className: 'FruitComp.ts', responsibility: '水果组件' },
    { className: 'AudioEngine.ts', responsibility: '音频引擎' },
    { className: 'DecryptUtil.ts', responsibility: '解密工具' },
    { className: 'DataManager.ts', responsibility: '数据管理器' },
    { className: 'FruitConfig.ts', responsibility: '水果配置(难度参数)' },
    { className: 'CCPoolManager.ts', responsibility: '对象池管理' },
    { className: 'GbzAviseLayer.ts', responsibility: '提示层' },
    { className: 'FruitBookComp.ts', responsibility: '水果图鉴组件' },
    { className: 'GbzResManager.ts', responsibility: '资源管理器' },
    { className: 'AdPlatformBase.ts', responsibility: '广告平台基类' },
    { className: 'CalculatedInfo.ts', responsibility: '计算信息(难度计算缓存)' },
    { className: 'GbzDataManager.ts', responsibility: '游戏数据管理' },
    { className: 'EventDispatcher.ts', responsibility: '事件分发器' },
    { className: 'GbzAudioManager.ts', responsibility: '音频管理' },
    { className: 'GbzCarMoveLayer.ts', responsibility: '车移动层' },
    { className: 'GbzLoseFullLayer.ts', responsibility: '失败满层' },
    { className: 'GbzFruitBookLayer.ts', responsibility: '水果图鉴层' },
    { className: 'GbzPropSpecialLayer.ts', responsibility: '特殊道具层' },
    { className: 'BaseEventDispatcher.ts', responsibility: '基础事件分发' },
    { className: 'FruitPositionCalculator.ts', responsibility: '水果位置计算器' },
    { className: 'AutoLightEffect.ts', responsibility: '自动光效' }
];
writeCSV('CoreModules.csv',
    ['className', 'responsibility'],
    ['类名', '职责'],
    coreModules.map(m => [m.className, m.responsibility])
);

// ========== 23. 难度算法规则配置 ==========
console.log('\n=== 难度算法规则配置 ===');
const difficultyRules = [
    { ruleId: 0, name: '水果队列随机互换(Kt)', description: '水果在根据初始化数据生成队列后，会执行一次随机互换；该随机不是均匀洗牌，已被交换的水果仍可能再次被交换，交换总次数等于水果数量。' },
    { ruleId: 4, name: '障碍物生成(Yt)', description: '障碍物按 Y 轴区间等分生成，每个障碍位于各区间的中心位置，X 轴在 [-208, 208] 范围内随机。' },
    { ruleId: 5, name: '冰冻规则(Xt)', description: '冰冻规则：仅从队列第 30 个之后的水果中选择；Y 坐标需低于关卡顶部 400 单位；解冻次数与高度成正比，越靠近顶部要求越高，最大不超过水果总数的一半，并在此基础上附加 0~5 的随机波动值。' },
    { ruleId: 6, name: '黑洞水果类型分配(Zt)★核心难度算法', description: '每关总黑洞水果数量 A = random(14,34) + 4×(holeCount-2)；两阶段生成：阶段0随机4种类型(每种2或4个)，阶段1补齐至A；每个黑洞至少一个水果类型，剩余随机分配。' },
    { ruleId: 7, name: '黑洞位置规则', description: '黑洞最多生成4个，位置为固定配置；根据关卡编号对10取余，从对应的坐标组中选取。' }
];
writeCSV('DifficultyRules.csv',
    ['ruleId', 'name', 'description'],
    ['规则编号', '规则名称', '详细描述'],
    difficultyRules.map(r => [r.ruleId, r.name, r.description])
);

// ========== 24. 水果/元素类型常量 ==========
console.log('\n=== 水果/元素类型常量 ===');
const fruitTypeConstants = [
    { alias: 'j', char: '桃', english: 'peach' },
    { alias: 'q', char: '梨', english: 'pear' },
    { alias: 'K', char: '柚', english: 'pomelo' },
    { alias: 'Z', char: '狗', english: 'dog' },
    { alias: 'Q', char: '狼', english: 'wolf' },
    { alias: '$', char: '猪', english: 'pig' },
    { alias: 'tt', char: '猫', english: 'cat' },
    { alias: 'nt', char: '蛇', english: 'snake' },
    { alias: 'rt', char: '龙', english: 'dragon' }
];
writeCSV('FruitTypeConstants.csv',
    ['alias', 'char', 'english'],
    ['别名', '字符', '英文'],
    fruitTypeConstants.map(f => [f.alias, f.char, f.english])
);

// ========== 25. 变量别名映射表 ==========
console.log('\n=== 变量别名映射表 ===');
const varAliases = [
    { alias: 'i', source: 'ro', index: 1, value: 22 },
    { alias: 'e', source: 'ro', index: 2, value: 19 },
    { alias: 'a', source: 'ro', index: 3, value: 11 },
    { alias: 'u', source: 'ro', index: 4, value: 17 },
    { alias: 's', source: 'ro', index: 5, value: 31 },
    { alias: 'c', source: 'ro', index: 6, value: 21 },
    { alias: 'f', source: 'ro', index: 7, value: 28 },
    { alias: 'h', source: 'ro', index: 8, value: 26 },
    { alias: 'v', source: 'ro', index: 9, value: 14 },
    { alias: 'l', source: 'ro', index: 10, value: 35 },
    { alias: 'b', source: 'ro', index: 11, value: 34 },
    { alias: 'd', source: 'ro', index: 12, value: 32 },
    { alias: 'k', source: 'ro', index: 13, value: 30 },
    { alias: 'm', source: 'ro', index: 14, value: 23 },
    { alias: 'p', source: 'ro', index: 15, value: 24 },
    { alias: 'g', source: 'ro', index: 16, value: 18 },
    { alias: 'y', source: 'ro', index: 17, value: 29 },
    { alias: 'w', source: 'ro', index: 18, value: 25 },
    { alias: '_', source: 'ro', index: 19, value: 20 },
    { alias: 'M', source: 'ro', index: 20, value: 27 },
    { alias: 'S', source: 'ro', index: 21, value: 33 },
    { alias: 'A', source: 'ro', index: 22, value: 16 },
    { alias: 'C', source: 'ro', index: 23, value: 15 },
    { alias: 'x', source: 'ro', index: 24, value: 12 }
];
writeCSV('VariableAliases.csv',
    ['alias', 'source', 'index', 'value'],
    ['别名', '来源', '索引', '值'],
    varAliases.map(v => [v.alias, v.source, v.index, v.value])
);

// ========== 26. 不透明谓词求值结果 ==========
console.log('\n=== 不透明谓词求值结果 ===');
const Ou = Math.log, Fu = Math.floor, Bu = Math.exp, zu = Math.abs, Uu = Math.round;
const predicates = [
    { name: 'vs', expr: 'Fu(78)<Fu(Bu((Ou(85)+Ou(79)+Ou(70))/3))', value: Fu(78) < Fu(Bu((Ou(85) + Ou(79) + Ou(70)) / 3)) },
    { name: 'ls', expr: 'Uu(2*Ou(zu(12987)))<=Uu(Ou(10733)+Ou(16218))', value: Uu(2 * Ou(zu(12987))) <= Uu(Ou(10733) + Ou(16218)) },
    { name: 'bs', expr: 'Uu(2*Ou(zu(8062)))<=Uu(Ou(5876)+Ou(16105))', value: Uu(2 * Ou(zu(8062))) <= Uu(Ou(5876) + Ou(16105)) },
    { name: 'ds', expr: 'Fu(53)<Fu(Bu((Ou(20)+Ou(83)+Ou(56)+Ou(53))/4))', value: Fu(53) < Fu(Bu((Ou(20) + Ou(83) + Ou(56) + Ou(53)) / 4)) },
    { name: 'ks', expr: 'Uu(2*Ou(zu(3145)))<=Uu(Ou(1361)+Ou(9125))', value: Uu(2 * Ou(zu(3145))) <= Uu(Ou(1361) + Ou(9125)) },
    { name: 'ms', expr: 'Fu(137/3)>=Fu(Bu((Ou(85)+Ou(11)+Ou(41))/3))', value: Fu(137 / 3) >= Fu(Bu((Ou(85) + Ou(11) + Ou(41)) / 3)) },
    { name: 'ps', expr: 'Uu(2*Ou(zu(2280)))<=Uu(Ou(4793)+Ou(1088))', value: Uu(2 * Ou(zu(2280))) <= Uu(Ou(4793) + Ou(1088)) },
    { name: 'gs', expr: 'Fu(39.5)<Fu(Bu((Ou(3)+Ou(42)+Ou(93)+Ou(20))/4))', value: Fu(39.5) < Fu(Bu((Ou(3) + Ou(42) + Ou(93) + Ou(20)) / 4)) },
    { name: 'ys', expr: 'Uu(2*Ou(zu(7187)))>Uu(Ou(10858)+Ou(6341))', value: Uu(2 * Ou(zu(7187))) > Uu(Ou(10858) + Ou(6341)) },
    { name: 'ws', expr: 'Uu(2*Ou(zu(2304)))>Uu(Ou(3265)+Ou(2593))', value: Uu(2 * Ou(zu(2304))) > Uu(Ou(3265) + Ou(2593)) },
    { name: 'Ns', expr: 'Uu(2*Ou(zu(5094)))<=Uu(Ou(2276)+Ou(11402))', value: Uu(2 * Ou(zu(5094))) <= Uu(Ou(2276) + Ou(11402)) },
    { name: 'Ps', expr: 'Uu(2*Ou(zu(7485)))<=Uu(Ou(7625)+Ou(7394))', value: Uu(2 * Ou(zu(7485))) <= Uu(Ou(7625) + Ou(7394)) },
    { name: 'Gs', expr: 'Uu(2*Ou(zu(2320)))>Uu(Ou(1808)+Ou(3088))', value: Uu(2 * Ou(zu(2320))) > Uu(Ou(1808) + Ou(3088)) }
];
writeCSV('OpaquePredicates.csv',
    ['name', 'expression', 'value', 'numericValue'],
    ['谓词名', '表达式', '布尔值', '数字值'],
    predicates.map(p => [p.name, p.expr, p.value, p.value ? 1 : 0])
);

// ========== 总结 ==========
console.log('\n=== 总结 ===');
console.log(`输出目录: ${outDir}`);
console.log(`物理配置(小): ${physSmall.length} 项`);
console.log(`物理配置(大): ${physLarge.length} 项`);
console.log(`城市/水果配置: ${cityConfigs.length} 项`);
console.log(`关卡配置结构: ${levelConfigStruct.length} 项`);
console.log(`关卡数据映射: ${levelDataMap.length} 项`);
console.log(`配置映射组3: ${group3Configs.length} 项`);
console.log(`关卡数据表: ${levelDataRows.length} 关`);
console.log(`ro[]常量: ${roArr.length} 项`);
console.log(`to[]字符串表: ${toStringRows.length} 项`);
console.log(`难度参数: ${allParamEntries.length} 项`);
console.log(`黑洞坐标: ${holePositions.length} 项`);
console.log(`时间常量: ${timeConstants.length} 项`);
console.log(`坐标常量: ${coordConstants.length} 项`);
console.log(`物理参数: ${physicsParams.length} 项`);
console.log(`置换表: ${shuffleTable.length} 项`);
