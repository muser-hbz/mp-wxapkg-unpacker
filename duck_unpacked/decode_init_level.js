// 解码关卡初始化函数的完整上下文和所有关键属性名
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/duck_unpacked/_subpackages_main_/subpackages/main/game.js';
const content = fs.readFileSync(srcFile, 'utf8');
const tables = JSON.parse(fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/analysis_rt_tables.json', 'utf8'));

function T(t, s) { return tables[t] && tables[t][s] !== undefined ? tables[t][s] : `rt[${t}][${s}]`; }

// 1. 解码关卡初始化函数中引用的所有属性
console.log('=== 关卡初始化函数属性解码 ===');
const refs = [
    ['a[17][13]', 17, 13], ['a[18][11]', 18, 11], ['a[5][79]', 5, 79], ['a[9][162]', 9, 162],
    ['a[5][376]', 5, 376], ['a[17][300]', 17, 300], ['a[16][459]', 16, 459], ['c[419]', 4, 419],
    ['d[248]', 3, 248], ['a[5][467]', 5, 467], ['a[1][1]', 1, 1], ['d[489]', 3, 489],
    ['a[2][87]', 2, 87], ['c[61]', 4, 61], ['a[42][2]', 42, 2], ['d[349]', 3, 349],
    ['d[124]', 3, 124], ['d[212]', 3, 212], ['d[350]', 3, 350], ['d[351]', 3, 351],
    // 生成函数中的
    ['d[130]', 2, 130], ['d[96]', 2, 96], ['a[3][49]', 3, 49], ['a[0][5]', 0, 5],
    ['d[87]', 2, 87], ['a[4][110]', 4, 110], ['a[5][218]', 5, 218], ['d[74]', 2, 74],
    ['a[5][102]', 5, 102], ['e[219]', 2, 219], ['a[24][124]', 24, 124], ['a[2][7]', 2, 7],
    ['a[2][1]', 2, 1], ['a[4][420]', 4, 420]
];
for (const [name, t, s] of refs) {
    console.log(`  ${name} = "${T(t, s)}"`);
}

// 2. 提取关卡初始化函数完整代码 (1611046前后更大范围)
console.log('\n=== 关卡初始化函数完整代码 (1610800-1614500) ===');
console.log(content.substring(1610800, 1614500));

// 3. 查找 rw 变量 (rw[18] 被用作难度分母)
console.log('\n=== rw 变量定义 ===');
const rwDef = content.match(/var rw=([^;]{10,80})/);
if (rwDef) { console.log(`var rw=${rwDef[1]}`); }
const rwDef2 = content.match(/,rw=([^,;]{10,80})/);
if (rwDef2) { console.log(`,rw=${rwDef2[1]}`); }
