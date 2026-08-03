// 深入分析：解码 to[] 和 ro[] 表，搜索代码中所有 ro[] 引用和配置定义模式
const fs = require('fs');
const path = require('path');

const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

// ========== 1. 解码 Qs 反转函数 ==========
function Qs(t) {
    const n = Array.from(t);
    for (let r = 0, i = t.length - 1; r < i; r++, i--) {
        const e = n[r]; n[r] = n[i]; n[i] = e;
    }
    return n.join('');
}

// ========== 2. 解码 ro() 数值常量表 ==========
function decodeRo(noStr) {
    const n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+./:;<=>?@[]^_`{|}~';
    const r = {};
    for (let i = 0; i < n.length; ++i) r[n[i]] = i;
    function e(t) {
        const i = n.length;
        let e = 0, a = 1;
        for (let u = t.length - 1; u >= 0; u--) { e += r[t[u]] * a; a *= i; }
        return e;
    }
    const a = noStr.split(',');
    const u = Number(a[0]);
    const s = [];
    for (let o = 1; o < a.length; ++o) {
        const c = e(a[o]);
        s.push(c + u);
    }
    return s;
}

const noMarker = ";var no='";
const noStart = content.indexOf(noMarker) + noMarker.length;
let ni = noStart;
while (content[ni] !== "'") ni++;
const noStr = content.substring(noStart, ni);
const roArr = decodeRo(noStr);

// ========== 3. 解码全部 to[] 表 ==========
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
        for (let i = 0; i < reversed.length; i += chunkSize) {
            chunks.push(reversed.substring(i, i + chunkSize));
        }
        toTables[tableIdx] = chunks;
    }
}

console.log(`ro[] 表: ${roArr.length} 项`);
console.log(`to[] 表: ${Object.keys(toTables).length} 张`);

// ========== 4. 搜索代码中所有 ro[] 引用 ==========
const roRefs = [];
const roRefPattern = /ro\[(\d+)\]/g;
let rm;
while ((rm = roRefPattern.exec(content)) !== null) {
    const idx = parseInt(rm[1]);
    roRefs.push({ pos: rm.index, idx, val: roArr[idx] !== undefined ? roArr[idx] : '??' });
}
console.log(`\n=== ro[] 引用总数: ${roRefs.length} ===`);
// 统计每个 ro[] 索引被引用次数
const roUsage = {};
for (const r of roRefs) {
    if (!roUsage[r.idx]) roUsage[r.idx] = { count: 0, val: r.val };
    roUsage[r.idx].count++;
}
console.log(`\n=== ro[] 使用频率 (前30) ===`);
const sortedUsage = Object.entries(roUsage).sort((a, b) => b[1].count - a[1].count);
for (const [idx, info] of sortedUsage.slice(0, 30)) {
    console.log(`  ro[${idx}] = ${info.val} (used ${info.count} times)`);
}

// ========== 5. 搜索配置定义模式（更广泛） ==========
// 模式: 变量[to[K][i]] = ro[j] 或 变量[to[K][i]] = 数字 或 变量.x = ro[j]
// 找到 assets/start-scene 模块
const modStart = content.indexOf('define("assets/start-scene/index.js"');
let modEnd = content.indexOf('define("', modStart + 10);
if (modEnd < 0) modEnd = content.length;
const modCode = content.substring(modStart, modEnd);

// 搜索所有 =ro[N] 赋值的上下文
console.log(`\n=== =ro[N] 赋值上下文 (前40) ===`);
const assignPattern = /[=;]([^=;]{0,60})=ro\[(\d+)\]/g;
let am;
let count = 0;
while ((am = assignPattern.exec(modCode)) !== null && count < 40) {
    const lhs = am[1].trim();
    const roIdx = parseInt(am[2]);
    const val = roArr[roIdx] !== undefined ? roArr[roIdx] : '??';
    console.log(`  ${lhs} = ro[${roIdx}] (=${val})`);
    count++;
}
