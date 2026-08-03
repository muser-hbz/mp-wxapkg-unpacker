// 从 game.js 中提取所有大的数值数组（>=20 个元素），可能是关卡配置数据
const fs = require('fs');
const path = require('path');

const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

// 正则匹配数值数组字面量 [n1,n2,n3,...] 或 [n1, n2, n3, ...]
// 匹配 [ 后跟至少 20 个数字（用逗号分隔）
const pattern = /\[((?:\d+(?:\.\d+)?)(?:,(?:\s*)(?:\d+(?:\.\d+)?)){19,})\]/g;
const bigArrays = [];
let m;
while ((m = pattern.exec(content)) !== null) {
    const numsStr = m[1];
    const nums = numsStr.split(',').map(s => parseInt(s.trim(), 10));
    bigArrays.push({
        pos: m.index,
        count: nums.length,
        first10: nums.slice(0, 10),
        last5: nums.slice(-5),
        // 检查是否含特征值 12, 174, 100, 112, 120, 130 (前6关 targetCount)
        hasLevelData: nums.includes(12) && nums.includes(174) && nums.includes(100)
    });
}

console.log(`\n=== 找到 ${bigArrays.length} 个大数值数组 (>=20 元素) ===\n`);
// 按元素数排序
bigArrays.sort((a, b) => b.count - a.count);
for (const arr of bigArrays.slice(0, 30)) {
    console.log(`Pos ${arr.pos} | count=${arr.count} | hasLevelData=${arr.hasLevelData}`);
    console.log(`  first10: ${arr.first10.join(', ')}`);
    console.log(`  last5:   ${arr.last5.join(', ')}`);
    console.log('');
}
