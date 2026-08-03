const fs = require('fs');
const c = fs.readFileSync('d:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js', 'utf8');
const idx = c.indexOf('to=new Array(47)');
// Find the first Qs(" after to=new Array(47)
const qsStart = c.indexOf('Qs("', idx);
const strStart = qsStart + 4;
// Scan for closing quote
let i = strStart;
while (i < c.length) {
    if (c[i] === '\\') { i += 2; continue; }
    if (c[i] === '"') break;
    i++;
}
console.log('First Qs string: pos', qsStart, 'to', i);
console.log('After closing quote (60 chars):');
console.log(JSON.stringify(c.substring(i, i + 60)));
// Check pattern: " ,N),to[K]=$s.s(N)
console.log('\n--- Pattern analysis ---');
const after = c.substring(i, i + 80);
console.log('Raw after:', after);
