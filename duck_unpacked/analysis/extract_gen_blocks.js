// 提取生成方块函数 + 总行数赋值 + A对象定义
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/duck_unpacked/_subpackages_main_/subpackages/main/game.js';
const content = fs.readFileSync(srcFile, 'utf8');
const tables = JSON.parse(fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/analysis_rt_tables.json', 'utf8'));
const rw = JSON.parse(fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/analysis_rw_table.json', 'utf8'));
function T(t, s) { return tables[t] && tables[t][s] !== undefined ? tables[t][s] : `rt[${t}][${s}]`; }

// 1. A= b[1][2] @287468 的上下文
console.log('=== A 对象定义上下文 @287468 ===');
console.log(content.substring(287300, 287700));

// 2. 生成方块函数: onReady里 b[d[351]]() 在@1613500附近后。找 L[e[351]] 或含351索引的函数定义
console.log('\n=== 查找 [3][351] "s生成方块" 函数定义 ===');
const re351 = /\[3\]\[351\]/g;
let m;
while ((m = re351.exec(content)) !== null) {
    const ctx = content.substring(Math.max(0, m.index - 60), Math.min(content.length, m.index + 400));
    console.log(`\n@${m.index}: ...${ctx}...`);
}

// 3. 总行数 [2][130] 的所有引用（用变量别名 d[130] 等）
console.log('\n=== [2][130] 所有引用 ===');
const re130 = /\[2\]\[130\]/g;
while ((m = re130.exec(content)) !== null) {
    const ctx = content.substring(Math.max(0, m.index - 80), m.index + 120);
    console.log(`@${m.index}: ...${ctx}...`);
}
