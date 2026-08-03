// Final CSV generator - extracts all config data and generates CSV files
const fs = require('fs');
const path = require('path');

const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');
const outDir = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// ========== Decode ro[] and to[] ==========
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

function Qs(t) {
    const n = Array.from(t);
    for (let r = 0, i = t.length - 1; r < i; r++, i--) { const e = n[r]; n[r] = n[i]; n[i] = e; }
    return n.join('');
}
const toTables = {};
const qsPattern = /\$s=Qs\("/g;
let qm;
while ((qm = qsPattern.exec(content)) !== null) {
    const qsStart = qm.index + qm[0].length;
    let qi = qsStart;
    while (qi < content.length) {
        if (content[qi] === '\\') { qi += 2; continue; }
        if (content[qi] === '"') break;
        qi++;
    }
    const reversedStr = content.substring(qsStart, qi);
    const afterQuote = content.substring(qi + 1, qi + 200);
    const afterMatch = afterQuote.match(/^,(\d+)\),to\[(\d+)\]=\$s\.s\((\d+)\)/);
    if (afterMatch) {
        const chunkSize = parseInt(afterMatch[1]);
        const tableIdx = parseInt(afterMatch[2]);
        let forwardStr;
        try { forwardStr = JSON.parse('"' + reversedStr + '"'); }
        catch(e) { forwardStr = reversedStr; }
        const reversed = Qs(forwardStr);
        const chunks = [];
        for (let i = 0; i < reversed.length; i += chunkSize) chunks.push(reversed.substring(i, i + chunkSize));
        toTables[tableIdx] = chunks;
    }
}
console.log(`ro[]: ${roArr.length} elements, to[]: ${Object.keys(toTables).length} tables`);

// Helpers
function toName(t, s) { return toTables[t] && toTables[t][s] !== undefined ? toTables[t][s] : `to[${t}][${s}]`; }
function roVal(i) { return roArr[i] !== undefined ? roArr[i] : `ro[${i}]`; }
function evalExpr(expr) {
    if (typeof expr !== 'string') return expr;
    if (/^-?[\d.]+$/.test(expr)) return parseFloat(expr);
    const roM = expr.match(/^ro\[(\d+)\]$/);
    if (roM) return roVal(parseInt(roM[1]));
    if (/^[-\d.]+(?:[*/][-ro\d.\[\]]+)+$/.test(expr)) {
        try {
            const resolved = expr.replace(/ro\[(\d+)\]/g, (m, n) => roVal(parseInt(n)));
            return Math.round(eval(resolved) * 1000000) / 1000000;
        } catch(e) { return expr; }
    }
    return expr;
}
function resolvePropName(propStr, varMap) {
    let m = propStr.match(/^r\[(\d+)\]$/); if (m) return roVal(parseInt(m[1]));
    m = propStr.match(/^n\[(\d+)\]\[(\d+)\]$/); if (m) return toName(parseInt(m[1]), parseInt(m[2]));
    m = propStr.match(/^t\[(\d+)\]\[(\d+)\]$/); if (m) return toName(parseInt(m[1]), parseInt(m[2]));
    m = propStr.match(/^n\[(\d+)\]$/); if (m) return `to[${m[1]}]`;
    m = propStr.match(/^t\[(\d+)\]$/); if (m) return `to[${m[1]}]`;
    m = propStr.match(/^(\w+)\[(\d+)\](?:\[(\d+)\])?$/);
    if (m && varMap && varMap[m[1]]) {
        const vt = varMap[m[1]];
        const idx1 = parseInt(m[2]);
        const idx2 = m[3] ? parseInt(m[3]) : null;
        if (vt.source === 'to') return idx2 !== null ? toName(vt.idx, idx2) : toName(vt.idx, idx1);
        else return roVal(vt.idx);
    }
    return propStr;
}

// CSV writer helper
function writeCSV(filename, headers, cnHeaders, rows) {
    const lines = [];
    lines.push(headers.map(h => `"${h}"`).join(','));
    lines.push(cnHeaders.map(h => `"${h}"`).join(','));
    for (const row of rows) {
        lines.push(row.map(v => `"${v}"`).join(','));
    }
    fs.writeFileSync(path.join(outDir, filename), '\ufeff' + lines.join('\n'), 'utf8');
    console.log(`  Written: ${filename} (${rows.length} rows)`);
}

// ========== 1. Extract physics configs ==========
console.log('\n=== 1. Extracting Physics Configs ===');
const physicsConfigs = [];
const physStartPattern = /case\s+(\S+?):n\[([^\]]+)\]=function\(\)\{var t,n=to,r=n\[3\];/g;
let pm;
while ((pm = physStartPattern.exec(content)) !== null) {
    const condRaw = pm[1].trim();
    const afterMatch = content.substring(pm.index + pm[0].length, pm.index + pm[0].length + 1000);
    const breakIdx = afterMatch.indexOf('break;');
    const caseBody = breakIdx >= 0 ? afterMatch.substring(0, breakIdx) : afterMatch.substring(0, 500);
    const radiusMatch = caseBody.match(/\[n\[4\]\[1\]\]=([^,]+)/);
    const scaleMatch = caseBody.match(/t\[r\[1\]\]=([^,]+)/);
    const typeMatch = caseBody.match(/t\[n\[10\]\[1\]\]=([^,]+)/);
    if (radiusMatch && scaleMatch && typeMatch) {
        physicsConfigs.push({
            cond: condRaw,
            radius: evalExpr(radiusMatch[1].trim()),
            scale: evalExpr(scaleMatch[1].trim()),
            particleType: evalExpr(typeMatch[1].trim()),
            pos: pm.index
        });
    }
}

// Split into two groups based on position clustering
const physSorted = [...physicsConfigs].sort((a, b) => a.pos - b.pos);
// Find the gap to split groups
let splitIdx = physSorted.length;
for (let i = 1; i < physSorted.length; i++) {
    if (physSorted[i].pos - physSorted[i - 1].pos > 5000) {
        splitIdx = i;
        break;
    }
}
const physGroup1 = physSorted.slice(0, splitIdx);
const physGroup2 = physSorted.slice(splitIdx);

console.log(`Found ${physicsConfigs.length} physics configs (Group1: ${physGroup1.length}, Group2: ${physGroup2.length})`);

// Generate PhysicsConfig CSV
writeCSV('FruitPhysicsConfig.csv',
    ['id', 'radius', 'scale', 'particleType', 'group'],
    ['编号', '半径', '缩放比例', '粒子类型', '配置组'],
    physSorted.map((c, i) => [i, c.radius, c.scale, c.particleType, c.pos < physGroup2[0]?.pos ? 'small' : 'large'])
);

// ========== 2. Extract config objects ==========
console.log('\n=== 2. Extracting Config Objects ===');
const configObjects = [];
const configRegex = /this\[((?:[^\[\]]|\[[^\]]*\])+)\]=function\(\)\{for\(var t,n=to,r=ro,([^;]+);/g;
let cm;
while ((cm = configRegex.exec(content)) !== null) {
    const propRaw = cm[1];
    const varDeclsStr = cm[2];

    // Parse variable declarations
    const varMap = {};
    const varDeclRe = /(\w+)=([nr])\[(\d+)\]/g;
    let vdm;
    while ((vdm = varDeclRe.exec(varDeclsStr)) !== null) {
        varMap[vdm[1]] = { source: vdm[2] === 'n' ? 'to' : 'ro', idx: parseInt(vdm[3]) };
    }

    // Get function body
    const funcStart = cm.index;
    const funcBody = content.substring(funcStart, Math.min(content.length, funcStart + 20000));

    // Find matching closing brace
    let braceCount = 0;
    let funcEnd = funcBody.length;
    let inStr = false; let strCh = '';
    const funcBodyStart = funcBody.indexOf('function(){') + 11;
    for (let bi = funcBodyStart; bi < funcBody.length; bi++) {
        const ch = funcBody[bi];
        if (inStr) {
            if (ch === '\\') { bi++; continue; }
            if (ch === strCh) inStr = false;
            continue;
        }
        if (ch === '"' || ch === "'") { inStr = true; strCh = ch; continue; }
        if (ch === '{') braceCount++;
        if (ch === '}') { if (braceCount === 0) { funcEnd = bi; break; } braceCount--; }
    }
    const fullFunc = funcBody.substring(0, funcEnd + 1);

    // Extract all t[PROP]=VAL assignments
    const assignments = [];

    // Pattern A: case N:t[PROP]=VAL;break;
    const caseRe = /case\s+([^:]+):t\[([^\]]+)\]\s*=\s*([^;]+?);break/g;
    let am;
    while ((am = caseRe.exec(fullFunc)) !== null) {
        assignments.push({ type: 'case', case: am[1].trim(), propRaw: am[2].trim(), valRaw: am[3].trim() });
    }

    // Pattern B: if(N==l){t[PROP]=VAL;continue}
    const ifRe = /if\((\d+)==l\)\{t\[([^\]]+)\]\s*=\s*([^;]+?);continue\}/g;
    while ((am = ifRe.exec(fullFunc)) !== null) {
        assignments.push({ type: 'if', case: am[1], propRaw: am[2].trim(), valRaw: am[3].trim() });
    }

    // Pattern C: if(i[N]==l){t[PROP]=VAL;continue}
    const ifRoRe = /if\(i\[(\d+)\]==l\)\{t\[([^\]]+)\]\s*=\s*([^;]+?);continue\}/g;
    while ((am = ifRoRe.exec(fullFunc)) !== null) {
        assignments.push({ type: 'ifRo', case: `ro[${am[1]}]=${roVal(parseInt(am[1]))}`, propRaw: am[2].trim(), valRaw: am[3].trim() });
    }

    // Pattern D: ternary expressions
    const ternaryRe = /(?:\|\||:)\s*t\[([^\]]+)\]\s*=\s*([^;,)}]+)/g;
    while ((am = ternaryRe.exec(fullFunc)) !== null) {
        const propRaw = am[1].trim();
        const valRaw = am[2].trim();
        if (!assignments.some(a => a.propRaw === propRaw && a.valRaw === valRaw)) {
            assignments.push({ type: 'ternary', case: 'conditional', propRaw, valRaw });
        }
    }

    // Resolve property names and values
    const resolvedProps = [];
    const seen = new Set();
    for (const a of assignments) {
        const propName = resolvePropName(a.propRaw, varMap);
        let val = evalExpr(a.valRaw);
        if (typeof val === 'string') {
            const valVarMatch = val.match(/^(\w+)$/);
            if (valVarMatch && varMap[valVarMatch[1]]) {
                const vt = varMap[valVarMatch[1]];
                val = vt.source === 'ro' ? roVal(vt.idx) : val;
            }
        }
        const key = `${propName}`;
        if (!seen.has(key)) {
            seen.add(key);
            resolvedProps.push({ case: a.case, prop: propName, val, valRaw: a.valRaw });
        }
    }

    if (resolvedProps.length >= 3) {
        const configName = resolvePropName(propRaw, varMap);
        configObjects.push({
            pos: funcStart,
            configName: String(configName),
            thisProp: propRaw,
            props: resolvedProps
        });
    }
}
console.log(`Found ${configObjects.length} config objects`);

// ========== 3. Generate CSVs ==========
console.log('\n=== 3. Generating CSV Files ===');

// 3a. Individual config object CSVs
for (let i = 0; i < configObjects.length; i++) {
    const c = configObjects[i];
    const rows = c.props.map(p => [p.prop, p.val, p.case || '', p.valRaw]);
    writeCSV(`Config_${i}_${c.configName}.csv`,
        ['property', 'value', 'case', 'rawValue'],
        ['属性名', '值', '条件', '原始值'],
        rows);
}

// 3b. Combined LevelDifficultyConfig CSV
// Collect all unique property names across config objects
const allPropNames = new Set();
for (const c of configObjects) {
    for (const p of c.props) {
        if (typeof p.prop === 'string' && !p.prop.startsWith('to[') && !p.prop.startsWith('ro[')) {
            allPropNames.add(p.prop);
        }
    }
}
const propList = [...allPropNames].sort();
console.log(`\nCombined properties: ${propList.length}`);

if (propList.length > 0) {
    const rows = configObjects.map((c, i) => {
        const row = [i, c.configName];
        for (const prop of propList) {
            const found = c.props.find(p => p.prop === prop);
            row.push(found ? found.val : '');
        }
        return row;
    });
    writeCSV('LevelDifficultyConfig.csv',
        ['configId', 'configName', ...propList],
        ['配置编号', '配置名称', ...propList],
        rows);
}

// 3c. Copy rangkingConfig from existing file
const rankFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg/rangkingConfig.json';
if (fs.existsSync(rankFile)) {
    const rankData = JSON.parse(fs.readFileSync(rankFile, 'utf8'));
    writeCSV('RankingConfig.csv',
        ['minLevel', 'maxLevel', 'rankStr'],
        ['最小关卡', '最大关卡', '段位名称'],
        rankData.map(r => [r.minLevel, r.maxLevel, r.rankStr])
    );
}

// 3d. ro[] numeric constants CSV
writeCSV('NumericConstants_ro.csv',
    ['index', 'value'],
    ['索引', '值'],
    roArr.map((v, i) => [i, v])
);

// 3e. to[] string tables CSV
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

// 3f. Fruit/Element names CSV (from decoded $s string)
// Extract the big fruit name string
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
        // The fruit names are 2-char chunks (Chinese characters)
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

// ========== Summary ==========
console.log('\n=== SUMMARY ===');
console.log(`Physics configs: ${physicsConfigs.length}`);
console.log(`Config objects: ${configObjects.length}`);
console.log(`ro[] constants: ${roArr.length}`);
console.log(`to[] string tables: ${Object.keys(toTables).length} tables, ${toStringRows.length} entries`);
console.log(`\nConfig object names:`);
for (const c of configObjects) {
    console.log(`  ${c.configName} (${c.props.length} props)`);
}
console.log(`\nCSV files written to: ${outDir}`);
