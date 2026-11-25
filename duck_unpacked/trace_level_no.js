// 追踪关卡号来源和行列数设置
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/duck_unpacked/_subpackages_main_/subpackages/main/game.js';
const content = fs.readFileSync(srcFile, 'utf8');
const tables = JSON.parse(fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/analysis_rt_tables.json', 'utf8'));
const rw = JSON.parse(fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/analysis_rw_table.json', 'utf8'));

function T(t, s) { return tables[t] && tables[t][s] !== undefined ? tables[t][s] : `rt[${t}][${s}]`; }

// 1. A 全局对象的定义（查找 A= 的赋值，A是单字母全局）
console.log('=== A 全局对象定义搜索 ===');
// 在 var 声明列表中找 A
const varBlockMatch = content.match(/(?:^|[,;])(?:var\s+)?([A-Z](?:,[A-Z])*)[,;]/g);
// 更简单：搜索 "A= " 模式（A被赋值）
const aAssign = [];
let searchPos = 0;
while (aAssign.length < 10) {
    const idx = content.indexOf('A=', searchPos);
    if (idx < 0) break;
    const pre = content.substring(Math.max(0, idx - 3), idx);
    const post = content.substring(idx + 2, idx + 60);
    if (/[\w$]/.test(content[idx - 1] || '') === false) {
        aAssign.push(`@${idx} [${pre}] A= ${post}`);
    }
    searchPos = idx + 2;
}
aAssign.slice(0, 6).forEach(x => console.log('  ' + x));

// 2. 关卡号 rt[9][162]="anarRootset" — 实际上这可能是多字符chunk。检查A上带[9][162]的引用
console.log('\n=== [9][162] "anarRootset" 引用 ===');
const re9162 = /\[9\]\[162\]/g;
let m;
let count = 0;
while ((m = re9162.exec(content)) !== null) {
    const pre = content.substring(Math.max(0, m.index - 120), m.index);
    const post = content.substring(m.index, Math.min(content.length, m.index + 120));
    console.log(`@${m.index}: ...${pre}【${post}】...`);
    count++;
    if (count >= 6) break;
}

// 3. 查找总行数/总列数的赋值处 [2][130]/[2][96]
console.log('\n=== 总行数 [2][130] / 总列数 [2][96] 赋值 ===');
const re130 = /\[2\]\[130\]/g;
count = 0;
while ((m = re130.exec(content)) !== null) {
    const ctx = content.substring(Math.max(0, m.index - 100), m.index + 150);
    console.log(`@${m.index}: ...${ctx}...`);
    count++;
    if (count >= 5) break;
}

// 4. 查找 writeq [4][110] 的赋值（方块类型数）
console.log('\n=== writeq [4][110] 引用 ===');
const re110 = /\[4\]\[110\]/g;
count = 0;
while ((m = re110.exec(content)) !== null) {
    const ctx = content.substring(Math.max(0, m.index - 80), m.index + 100);
    console.log(`@${m.index}: ...${ctx}...`);
    count++;
    if (count >= 6) break;
}
