// 深挖关卡生成算法: 定位生成数据/生成方块/生成石头总数等属性的类和使用
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/duck_unpacked/_subpackages_main_/subpackages/main/game.js';
const content = fs.readFileSync(srcFile, 'utf8');
const tables = JSON.parse(fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/analysis_rt_tables.json', 'utf8'));

function findAll(ref, max = 8, ctxBefore = 150, ctxAfter = 250) {
    const re = new RegExp(ref.replace(/\[/g, '\\[').replace(/\]/g, '\\]'), 'g');
    let m; const results = [];
    while ((m = re.exec(content)) !== null) {
        const s = Math.max(0, m.index - ctxBefore);
        const e = Math.min(content.length, m.index + ctxAfter);
        results.push({ pos: m.index, ctx: content.substring(s, e) });
        if (results.length >= max) break;
    }
    return results;
}

// 1. 生成石头总数 rt[5][102] — 找到定义处
console.log('=== rt[5][102]="s生成石头总数" 使用处 ===');
findAll('rt[5][102]', 4).forEach(r => {
    console.log(`\n@${r.pos}:\n${r.ctx}\n`);
});

// 2. 生成数据 / 生成方块 rt[3][350] rt[3][351]
console.log('=== rt[3][350]="s生成数据" 使用处 ===');
findAll('rt[3][350]', 3).forEach(r => {
    console.log(`\n@${r.pos}:\n${r.ctx}\n`);
});

// 3. 游戏难度设置 rt[5][376]
console.log('=== rt[5][376]="y游戏难度设置" 使用处 ===');
findAll('rt[5][376]', 3).forEach(r => {
    console.log(`\n@${r.pos}:\n${r.ctx}\n`);
});

// 4. 测试关卡 rt[2][419] — 常用于读取测试关卡配置
console.log('=== rt[2][419]="测试关卡" 使用处 ===');
findAll('rt[2][419]', 3).forEach(r => {
    console.log(`\n@${r.pos}:\n${r.ctx}\n`);
});
