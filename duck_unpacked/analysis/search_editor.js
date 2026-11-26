// 搜索关卡编辑器逻辑: [501]关卡编辑 [478]关卡编辑器 [398]义父关卡编辑
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/duck_unpacked/_subpackages_main_/subpackages/main/game.js';
const content = fs.readFileSync(srcFile, 'utf8');
const tables = JSON.parse(fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/analysis_rt_tables.json', 'utf8'));
function T(t, s) { return tables[t] && tables[t][s] !== undefined ? tables[t][s] : `rt[${t}][${s}]`; }

// 通用搜索: 找 [501] 且对应rt[2][501]="关卡编辑"的引用
function searchIdx(sIdx, max = 5) {
    const re = new RegExp(`\\[${sIdx}\\]`, 'g');
    let m; const results = [];
    while ((m = re.exec(content)) !== null) {
        const ctx = content.substring(Math.max(0, m.index - 100), Math.min(content.length, m.index + 200));
        results.push({ pos: m.index, ctx });
        if (results.length >= max * 3) break;
    }
    return results;
}

console.log('=== [501] "关卡编辑" 引用 ===');
searchIdx(501, 4).forEach((r, i) => {
    // 只显示可能是rt引用的（前面是字母变量名[数字][501]形式）
    if (r.ctx.match(/\w\[\d+\]\[501\]/)) {
        console.log(`\n@${r.pos}:\n${r.ctx}`);
    }
});

console.log('\n=== [478] "关卡编辑器" 引用 ===');
searchIdx(478, 4).forEach(r => {
    if (r.ctx.match(/\w\[\d+\]\[478\]/)) {
        console.log(`\n@${r.pos}:\n${r.ctx}`);
    }
});

console.log('\n=== [398] "义父关卡编辑" 引用 ===');
searchIdx(398, 4).forEach(r => {
    if (r.ctx.match(/\w\[\d+\]\[398\]/)) {
        console.log(`\n@${r.pos}:\n${r.ctx}`);
    }
});

// 搜索Cocos编辑器属性定义: 含"总行数"键名的类定义 (@property装饰器)
// Cocos 3.x 属性定义: {总行数:{default:N,...}}
console.log('\n=== 搜索类属性定义模式 ===');
// rt[2][130] = "z总行数" — 查找 {xxx[rt[2][130]]:... 或 [rt[2][130]]:{ 模式
const reProp = /\{\[\w\[\d+\]\[130\]\]:/g;
let m;
while ((m = reProp.exec(content)) !== null) {
    console.log(`@${m.index}: ${content.substring(m.index, m.index + 250)}`);
}
// 另一种: [b[2][130]]:{default:...}
const reProp2 = /\[\w\[2\]\[130\]\]:\{/g;
while ((m = reProp2.exec(content)) !== null) {
    console.log(`@${m.index}: ${content.substring(Math.max(0,m.index-30), m.index + 250)}`);
}
