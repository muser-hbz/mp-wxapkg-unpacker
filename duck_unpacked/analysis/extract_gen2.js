// 提取生成数据函数之后的生成方块函数
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/duck_unpacked/_subpackages_main_/subpackages/main/game.js';
const content = fs.readFileSync(srcFile, 'utf8');
const tables = JSON.parse(fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/analysis_rt_tables.json', 'utf8'));
function T(t, s) { return tables[t] && tables[t][s] !== undefined ? tables[t][s] : `rt[${t}][${s}]`; }

console.log('rt[1][2] =', JSON.stringify(T(1, 2)));
console.log('rt[2][84] =', JSON.stringify(T(2, 84)));
console.log('rw[561] =', JSON.parse(fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/analysis_rw_table.json', 'utf8'))[561]);

// 生成数据函数在 @1613800 附近结束，后面是生成方块 [3][351]
// 先找 e[351] 的模式: 在类方法定义 L[e[351]]=function 或 [d[351]]=function
const idx350 = content.indexOf('[e[350]]=function');
if (idx350 > 0) {
    console.log('\n=== 生成数据函数起始 @', idx350, '===');
    // 生成数据函数体 + 后续函数（提取2500字符）
    console.log(content.substring(idx350, idx350 + 3000));
}
