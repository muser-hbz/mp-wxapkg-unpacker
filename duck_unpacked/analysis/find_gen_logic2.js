// 通用搜索 [N][M] 引用模式（变量别名无关）
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/duck_unpacked/_subpackages_main_/subpackages/main/game.js';
const content = fs.readFileSync(srcFile, 'utf8');
const tables = JSON.parse(fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/analysis_rt_tables.json', 'utf8'));

function findAllIdx(tIdx, sIdx, max = 6, before = 130, after = 260) {
    const re = new RegExp(`\\[${tIdx}\\]\\[${sIdx}\\]`, 'g');
    let m; const results = [];
    while ((m = re.exec(content)) !== null) {
        // 确认前面是变量名(字母)即表引用
        const pre = content.substring(Math.max(0, m.index - 8), m.index);
        if (!/[a-zA-Z_$][\w$]*$/.test(pre)) continue;
        const s = Math.max(0, m.index - before);
        const e = Math.min(content.length, m.index + after);
        results.push({ pos: m.index, ctx: content.substring(s, e) });
        if (results.length >= max) break;
    }
    return results;
}

// 关键: 生成石头总数 rt[5][102]
console.log('### [5][102] "s生成石头总数" / [5][102]引用 ###');
findAllIdx(5, 102, 5).forEach(r => console.log(`\n@${r.pos}:\n${r.ctx}\n`));

// 生成数据 rt[3][350]
console.log('### [3][350] "s生成数据" ###');
findAllIdx(3, 350, 3).forEach(r => console.log(`\n@${r.pos}:\n${r.ctx}\n`));

// 测试关卡 rt[2][419]
console.log('### [2][419] "测试关卡" ###');
findAllIdx(2, 419, 4).forEach(r => console.log(`\n@${r.pos}:\n${r.ctx}\n`));

// 游戏难度 rt[5][376]
console.log('### [5][376] "y游戏难度设置" ###');
findAllIdx(5, 376, 3).forEach(r => console.log(`\n@${r.pos}:\n${r.ctx}\n`));
