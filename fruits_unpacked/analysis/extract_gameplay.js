// Extract gameplay code regions and find difficulty algorithms by context
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

// 1. Find the code region right after the alias block (pos ~111000+)
// Look for the first substantial function definitions
const aliasEnd = content.indexOf('Zt="【黑洞水果类型分配规则】');
const afterRules = content.indexOf(';var ', aliasEnd + 100);
console.log('=== Code after rules block (pos', afterRules, ') ===');
console.log(content.substring(afterRules, afterRules + 4000));

// 2. Search for the black hole count formula: A=(14,34), A+=4*(holes-2)
// In code this would be something like: var A = random(14,34); A += 4*(holeNum-2)
// Look for patterns with ro[36]=200, ro[37]=174... or the values 14, 34
// Actually 14 and 34 might be ro indices or direct values
// ro[0]=13, so 14=ro[0]+1? Or direct. Let's search for "14,34" or arithmetic producing it

// 3. Find where level number is used with modulo 10 (black hole position selection)
console.log('\n\n=== Searching for level % 10 patterns (black hole position) ===');
const modRe = /(\w+)%(\d+)/g;
let mm;
let modCount = 0;
while ((mm = modRe.exec(content)) !== null && modCount < 30) {
    if (mm.index > 110000 && mm[2] === '10') {
        const ctx = content.substring(Math.max(0, mm.index - 120), mm.index + 120);
        // Only show if it looks like gameplay (not just any modulo)
        if (/level|game|hole|fruit|config/i.test(ctx) || /to\[\d+\]/.test(ctx)) {
            console.log(`\npos=${mm.index}: ${ctx}`);
            modCount++;
        }
    }
}

// 4. Find fruit generation - search for "random" + "type" patterns
// The code uses to[k][j] for "randomMin", "randomMax", "fruitType"
// After aliasing, these become short var names. Search for array push/splice patterns
console.log('\n\n=== Array generation patterns (push/splice with random) ===');
const genRe = /(\w+)\.push\((?:\w+\.)*\w+\([^)]*\)\)/g;
let gm2;
let genCount = 0;
while ((gm2 = genRe.exec(content)) !== null && genCount < 15) {
    if (gm2.index > 110000) {
        const ctx = content.substring(Math.max(0, gm2.index - 80), gm2.index + gm2[0].length + 80);
        if (/random|Math|floor/i.test(ctx) || /to\[\d+\]/.test(ctx)) {
            console.log(`\npos=${gm2.index}: ${ctx}`);
            genCount++;
        }
    }
}
