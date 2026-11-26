// 解码 duck main 分包 game.js 的字符串表并分析关卡配置
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/duck_unpacked/_subpackages_main_/subpackages/main/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

// 1. 解码 rs 主字符串 (rr._4 反转)
function rr4(t) {
    const b = Array.from(t);
    for (let c = 0, d = t.length - 1; c < d; c++, d--) {
        const a = b[c]; b[c] = b[d]; b[d] = a;
    }
    return b.join('');
}

const marker = 'rs=rr._4("';
const start = content.indexOf(marker);
const strStart = start + marker.length;
let i = strStart;
while (i < content.length) {
    if (content[i] === '\\') { i += 2; continue; }
    if (content[i] === '"') break;
    i++;
}
const rawReversed = content.substring(strStart, i);
let decodedStr;
try { decodedStr = JSON.parse('"' + rawReversed + '"'); }
catch (e) { decodedStr = rawReversed; }
const forwardStr = rr4(decodedStr);
console.log(`rs 正序字符串长度: ${forwardStr.length}`);
console.log(`前300字符: ${forwardStr.substring(0, 300)}`);

// 2. 按顺序解析 rt[N]=rs.s(M) 或 rt[N]=<表达式> 定义
// 找到 rt=new Array(49) 之后到代码结束的扫描
const rtStart = content.indexOf('rt=new Array(49)');
// 扫描整个文件中所有 rs=rr._4("...") 与 rt[N]=rs.s(M) 的顺序出现
const tables = {};
let currentRs = '';
let pos = 0;
let outOfRegion = false;
while (pos < content.length) {
    // rt[N]=rs.s(M)
    const rtM = content.substring(pos).match(/^rt\[(\d+)\]=rs\.s\((\d+)\)/);
    if (rtM) {
        const idx = parseInt(rtM[1]);
        const chunk = parseInt(rtM[2]);
        if (currentRs) {
            const chunks = [];
            for (let ci = 0; ci < currentRs.length; ci += chunk) chunks.push(currentRs.substring(ci, ci + chunk));
            tables[idx] = chunks;
        }
        pos += rtM[0].length;
        if (content[pos] === ',') pos++;
        continue;
    }
    // rs=rr._4("...")
    if (content.substring(pos, pos + 9) === 'rs=rr._4(') {
        const qs = pos + 9;
        if (content[qs] === '"') {
            let qi = qs + 1;
            while (qi < content.length) {
                if (content[qi] === '\\') { qi += 2; continue; }
                if (content[qi] === '"') break;
                qi++;
            }
            const rstr = content.substring(qs + 1, qi);
            try { currentRs = rr4(JSON.parse('"' + rstr + '"')); }
            catch (e) { currentRs = rr4(rstr); }
            pos = qi + 1;
            if (content[pos] === ')') pos++;
            if (content[pos] === ',') pos++;
            continue;
        }
    }
    pos++;
}
console.log(`\n解码出 ${Object.keys(tables).length} 个 rt[] 表`);
const totalEntries = Object.values(tables).reduce((s, t) => s + t.length, 0);
console.log(`共 ${totalEntries} 个字符串条目`);

// 3. 在解码后的字符串中搜索关卡相关关键词
console.log('\n=== 关卡/配置相关字符串搜索 ===');
const levelKeywords = ['level', 'Level', '关卡', 'stage', 'checkpoint', 'config', 'Config', '配置',
    'json', 'remote', 'cdn', 'http', 'url', 'Url', 'URL', 'download', 'request', 'load'];
const found = {};
for (const [tIdx, arr] of Object.entries(tables)) {
    for (let si = 0; si < arr.length; si++) {
        const s = arr[si];
        for (const kw of levelKeywords) {
            if (s.includes(kw)) {
                const key = `${kw}`;
                if (!found[key]) found[key] = [];
                if (found[key].length < 30) found[key].push(`rt[${tIdx}][${si}]="${s}"`);
            }
        }
    }
}
for (const [kw, items] of Object.entries(found)) {
    console.log(`\n--- ${kw} (${items.length}+) ---`);
    items.slice(0, 15).forEach(x => console.log('  ' + x));
}

// 4. 保存完整表到文件
fs.writeFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/analysis_rt_tables.json', JSON.stringify(tables, null, 1), 'utf8');
console.log('\n完整表已保存到 duck_unpacked/analysis_rt_tables.json');
