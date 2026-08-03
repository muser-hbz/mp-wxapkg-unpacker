// 搜索 game.js 中所有长字符串字面量（>200 字符），可能是编码的配置数据
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

// 匹配单引号或双引号包围的长字符串
const results = [];
// 单引号字符串
const pattern1 = /'([^'\\]{200,})'/g;
// 双引号字符串
const pattern2 = /"([^"\\]{200,})"/g;

let m;
while ((m = pattern1.exec(content)) !== null) {
    results.push({ pos: m.index, quote: "'", len: m[1].length, sample: m[1].substring(0, 80) });
}
while ((m = pattern2.exec(content)) !== null) {
    results.push({ pos: m.index, quote: '"', len: m[1].length, sample: m[1].substring(0, 80) });
}

results.sort((a, b) => b.len - a.len);
console.log(`\n=== 找到 ${results.length} 个长字符串 (>200 字符) ===\n`);
for (const r of results.slice(0, 25)) {
    console.log(`Pos ${r.pos} | quote=${r.quote} | len=${r.len}`);
    console.log(`  sample: ${r.sample}...`);
    console.log('');
}
