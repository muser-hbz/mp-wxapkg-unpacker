// 完整解码 rw[] 数值表 + 关卡难度配置 + 生成算法
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/duck_unpacked/_subpackages_main_/subpackages/main/game.js';
const content = fs.readFileSync(srcFile, 'utf8');
const tables = JSON.parse(fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/analysis_rt_tables.json', 'utf8'));

function T(t, s) { return tables[t] && tables[t][s] !== undefined ? tables[t][s] : `rt[${t}][${s}]`; }

// ===== 1. 解码 rw[] (Base-85) =====
function rv(a) {
    let b = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+./:;<=>?@[]^_`{|}~"';
    let c = {};
    for (let i = 0; i < b.length; ++i) c[b[i]] = i;
    function d(a) {
        let d = b.length, e = 0, f = a.length, g = 1;
        for (let i = f - 1; i >= 0; i--) { let x = c[a[i]]; e += x * g; g *= d; }
        return e;
    }
    let parts = a.split(','), g = Number(parts[0]), h = [];
    for (let i = 1; i < parts.length; ++i) {
        const v = d(parts[i]);
        h.push(v + g);
    }
    return h;
}
const ruStart = content.indexOf("var ru='") + "var ru='".length;
let ruEnd = ruStart;
while (content[ruEnd] !== "'") ruEnd++;
const ruStr = content.substring(ruStart, ruEnd);
const rw = rv(ruStr);
console.log(`rw[] 解码: ${rw.length} 个数值常量`);

// ===== 2. 难度设置函数关键数值 =====
console.log('\n=== rw[] 关键常量 ===');
const rwKeys = [0, 1, 4, 13, 17, 18, 45, 49, 50, 55, 84, 149, 150, 198];
rwKeys.forEach(k => console.log(`  rw[${k}] = ${rw[k]}`));

// ===== 3. 解码难度函数的所有属性名 =====
console.log('\n=== 难度设置函数属性名解码 ===');
const attrRefs = [
    ['k=rt[2][131]', 2, 131], ['r=rt[3][124]', 3, 124], ['o=rt[5][244]', 5, 244],
    ['p=rt[5][245]', 5, 245], ['q=rt[5][219]', 5, 219], ['y=rt[2][37]', 2, 37],
    ['rt[3][490]', 3, 490], ['rt[3][491]', 3, 491], ['rt[4][0]', 4, 0],
    ['rt[3][299]', 3, 299], ['rt[6][290]', 6, 290], ['rt[20][56]', 20, 56],
    ['rt[17][395]', 17, 395], ['rt[6][4]', 6, 4], ['rt[7][4]', 7, 4],
    ['rt[9][1]', 9, 1], ['rt[2][130]', 2, 130], ['rt[2][96]', 2, 96],
    ['rt[3][49]', 3, 49], ['rt[4][110]', 4, 110], ['rt[2][74]', 2, 74],
    ['rt[5][6]', 5, 6], ['rt[4][420]', 4, 420], ['rt[4][61]', 4, 61],
    ['rt[5][247]', 5, 247], ['rt[2][219]', 2, 219], ['rt[6][3]', 6, 3],
    ['rt[4][1]', 4, 1], ['rt[17][13]', 17, 13], ['rt[9][162]', 9, 162]
];
attrRefs.forEach(([name, t, s]) => console.log(`  ${name} = "${T(t, s)}"`));

// ===== 4. 解码 kde/iwz 全局变量（行列坐标键）=====
console.log('\n=== kde/iwz 全局变量定义 ===');
const kdeMatch = content.match(/kde=([^,;]{1,50})/);
const iwzMatch = content.match(/iwz=([^,;]{1,50})/);
if (kdeMatch) console.log(`  kde = ${kdeMatch[1]}`);
if (iwzMatch) console.log(`  iwz = ${iwzMatch[1]}`);

// ===== 5. 查找A[f]关卡号来源 (A[rt[9][162]]="anarRootset") =====
console.log('\n=== A 全局对象定义 ===');
const aDef = content.match(/(?:var|,)A=([^,;]{5,80})/);
if (aDef) console.log(`  A = ${aDef[1]}`);

// 保存rw表
fs.writeFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/analysis_rw_table.json', JSON.stringify(rw), 'utf8');
console.log('\nrw[] 已保存到 analysis_rw_table.json');
