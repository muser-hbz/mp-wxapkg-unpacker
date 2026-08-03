// Find level config objects and difficulty calculation functions
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

// The actual gameplay code starts after the alias block (~pos 110900+)
// Search for function definitions that contain difficulty logic
// Functions use to[k][j] for string keys and ro[n] for numeric constants

// 1. Find ALL "function NAME(" definitions in the gameplay region (after pos 110000)
console.log('=== Function definitions in gameplay region ===');
const funcRe = /function\s+(\w+)\s*\(/g;
let fm;
let funcs = [];
while ((fm = funcRe.exec(content)) !== null) {
    if (fm.index > 110000) funcs.push({ name: fm[1], pos: fm.index });
}
console.log(`Total functions after pos 110000: ${funcs.length}`);
// Show first 60
for (let i = 0; i < Math.min(60, funcs.length); i++) {
    console.log(`  ${funcs[i].name} @ ${funcs[i].pos}`);
}

// 2. Find config object literals - patterns like {to[k][j]:ro[n],to[k][j]:ro[n],...}
// These define the level configs and difficulty parameters
console.log('\n=== Config object literals (to[k][j]:val patterns) ===');
const cfgRe = /\{to\[\d+\]\[\d+\]:(?:ro\[\d+\]|\d+|"[^"]*")(?:,to\[\d+\]\[\d+\]:(?:ro\[\d+\]|\d+|"[^"]*")){2,}\}/g;
let cm;
let cfgCount = 0;
while ((cm = cfgRe.exec(content)) !== null && cfgCount < 20) {
    console.log(`\n[Config ${cfgCount}] pos=${cm.index}:`);
    console.log(`  ${cm[0].substring(0, 500)}`);
    cfgCount++;
}

// 3. Find the fruit generation / black hole algorithm functions
// Look for patterns that reference multiple to[] lookups in arithmetic
console.log('\n=== Functions with heavy to[]/ro[] usage (difficulty calc) ===');
// Search for blocks with 5+ to[] references
const blockRe = /(\w+)\s*=\s*function\s*\([^)]*\)\s*\{[^}]{200,2000}?\}/g;
let bm;
let bcount = 0;
while ((bm = blockRe.exec(content)) !== null && bcount < 30) {
    const body = bm[0];
    const toCount = (body.match(/to\[\d+\]\[\d+\]/g) || []).length;
    const roCount = (body.match(/ro\[\d+\]/g) || []).length;
    if (toCount + roCount >= 4 && bm.index > 110000) {
        console.log(`\n[${bm[1]}] pos=${bm.index} to[]refs=${toCount} ro[]refs=${roCount}`);
        console.log(`  ${body.substring(0, 400)}`);
        bcount++;
    }
}
