// 搜索总行数赋值、关卡编辑器、关卡号增长逻辑
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/duck_unpacked/_subpackages_main_/subpackages/main/game.js';
const content = fs.readFileSync(srcFile, 'utf8');
const tables = JSON.parse(fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/analysis_rt_tables.json', 'utf8'));
function T(t, s) { return tables[t] && tables[t][s] !== undefined ? tables[t][s] : `rt[${t}][${s}]`; }

// 1. 找 [130] 总行数赋值: this[X[130]]=N 模式
console.log('=== [130] 引用（找赋值） ===');
const re130 = /\[130\]/g;
let m;
let cnt = 0;
while ((m = re130.exec(content)) !== null) {
    const ctx = content.substring(Math.max(0, m.index - 70), m.index + 90);
    if (ctx.includes(']=') && !ctx.includes(']==')) {
        console.log(`@${m.index}: ...${ctx}...`);
        cnt++;
        if (cnt > 8) break;
    }
}

// 2. 义父关卡编辑 [4][398] 上下文
console.log('\n=== [4][398] "义父关卡编辑" 上下文 ===');
const re398 = /\[4\]\[398\]/g;
cnt = 0;
while ((m = re398.exec(content)) !== null) {
    console.log(`\n@${m.index}:\n${content.substring(Math.max(0, m.index - 200), m.index + 400)}`);
    cnt++;
    if (cnt >= 3) break;
}

// 3. 测试关卡 [2][419] 上下文
console.log('\n=== [2][419] "测试关卡" 上下文 ===');
const re419 = /\[2\]\[419\]/g;
cnt = 0;
while ((m = re419.exec(content)) !== null) {
    console.log(`\n@${m.index}:\n${content.substring(Math.max(0, m.index - 150), m.index + 300)}`);
    cnt++;
    if (cnt >= 4) break;
}

// 4. 解码生成方块函数中的其他关键rt索引
console.log('\n=== 生成方块函数其他属性 ===');
const genRefs = [
    ['rt[20][319]', 20, 319], ['rt[1][46]', 1, 46], ['rt[1][96]', 1, 96], ['rt[1][97]', 1, 97],
    ['rt[1][98]', 1, 98], ['rt[1][121]', 1, 121], ['rt[7][6]', 7, 6], ['rt[22][232]', 22, 232],
    ['rt[19][370]', 19, 370], ['rt[3][106]', 3, 106], ['rt[5][220]', 5, 220], ['rt[3][353]', 3, 353],
    ['rt[2][255]', 2, 255], ['rt[2][256]', 2, 256], ['rt[3][94]', 3, 94], ['rt[2][4]', 2, 4],
    ['rt[4][1]', 4, 1], ['rt[6][3]', 6, 3], ['rt[5][377]', 5, 377], ['rt[3][299]', 3, 299],
    ['rt[1][2]', 1, 2], ['rt[2][1]', 2, 1], ['rt[1][1]', 1, 1]
];
genRefs.forEach(([n, t, s]) => console.log(`  ${n} = "${T(t, s)}"`));
