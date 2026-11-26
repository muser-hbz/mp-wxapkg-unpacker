// 深入分析 duck main 分包关卡数据来源
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/duck_unpacked/_subpackages_main_/subpackages/main/game.js';
const content = fs.readFileSync(srcFile, 'utf8');
const tables = JSON.parse(fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/analysis_rt_tables.json', 'utf8'));

function rr4(t) {
    const b = Array.from(t);
    for (let c = 0, d = t.length - 1; c < d; c++, d--) { const a = b[c]; b[c] = b[d]; b[d] = a; }
    return b.join('');
}

// 1. 找到关键关卡字符串的 rt[N][M] 索引
console.log('=== 关键关卡标识符的表索引 ===');
const keyTargets = ['_levels', '_level2', '_level3', '_level4', '_level5', 'levelNo', 'levelId',
    '关卡编辑', '关卡编辑器', '义父关卡编辑', 'level_max', 'l2_level', '关卡', '当前关卡', '测试关卡'];
const keyIndices = {};
for (const [tIdx, arr] of Object.entries(tables)) {
    for (let si = 0; si < arr.length; si++) {
        for (const kt of keyTargets) {
            if (arr[si] === kt) {
                const key = `${kt}@rt[${tIdx}][${si}]`;
                if (!keyIndices[kt]) keyIndices[kt] = [];
                keyIndices[kt].push(`rt[${tIdx}][${si}]`);
            }
        }
    }
}
for (const [k, v] of Object.entries(keyIndices)) {
    console.log(`  "${k}" -> ${v.join(', ')}`);
}

// 2. 在代码中查找这些 rt[N][M] 引用的上下文
console.log('\n=== 代码中关卡标识符使用上下文 ===');
function findRefs(ref, maxShow = 4) {
    const re = new RegExp(ref.replace(/\[/g, '\\[').replace(/\]/g, '\\]'), 'g');
    let m;
    const results = [];
    while ((m = re.exec(content)) !== null) {
        const ctxStart = Math.max(0, m.index - 120);
        const ctxEnd = Math.min(content.length, m.index + 180);
        results.push({ pos: m.index, ctx: content.substring(ctxStart, ctxEnd) });
        if (results.length > maxShow) break;
    }
    return results;
}

// 找 levelNo 和 levelId 的引用
for (const keyName of ['levelNo', 'levelId', '_levels', '_level2', '关卡编辑器', '义父关卡编辑', 'level_max']) {
    if (!keyIndices[keyName]) continue;
    for (const ref of keyIndices[keyName].slice(0, 2)) {
        console.log(`\n--- ${keyName} (${ref}) ---`);
        const refs = findRefs(ref);
        refs.forEach(r => {
            console.log(`  @${r.pos}:`);
            console.log(`    ${r.ctx}`);
        });
    }
}
