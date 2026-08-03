// 在 game.js 中定位反转的配置表名，查看上下文以确定数据存储形式
const fs = require('fs');
const path = require('path');

const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

function reverse(s) { return s.split('').reverse().join(''); }

const targets = ['LevelData', 'Strategy', 'holeFruit', 'Adventure', 'FruitData', 'LevelBData', 'LevelCData', 'Classic', 'Drop', 'Puzzle', 'TetrisBlock', 'PointArea', 'BlockColor', 'ThemeData', 'RewardPuzzle', 'NoviceGuide', 'Sound', 'Task', 'Item', 'Game'];

for (const t of targets) {
    const rev = reverse(t);
    let idx = 0;
    const positions = [];
    while ((idx = content.indexOf(rev, idx)) !== -1) {
        positions.push(idx);
        idx += rev.length;
    }
    if (positions.length > 0) {
        console.log(`\n=== ${t} (reversed: "${rev}") - ${positions.length} hits ===`);
        // 显示第一个位置附近上下文
        const p = positions[0];
        const start = Math.max(0, p - 100);
        const end = Math.min(content.length, p + rev.length + 200);
        console.log(`Pos ${p}: ...${content.substring(start, end)}...`);
    }
}
