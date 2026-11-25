// dump 游戏难度设置函数完整代码 + 查找总行数/总列数赋值
const fs = require('fs');
const game = fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/_subpackages_main_/subpackages/main/game.js', 'utf8');

// 1. 找到 游戏难度设置 函数定义（rt[5][376]，通过 L[...] 或类似模式）
// 关键字：函数体含 rw[13](70), rw[17](180), rw[55](110), rw[198](130)
// 先定位 @1614500 附近（摘要中难度函数位置）
console.log('=== @1614400-1615100 区域 (难度设置函数) ===');
console.log(game.slice(1614400, 1615100));
