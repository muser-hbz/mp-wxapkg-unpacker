// Extract actual gameplay logic after the string table, find difficulty algorithms
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

// The string table setup ends around pos 108200 (after to[46] and var no=...)
// Find the end of the to[] initialization
const to46Idx = content.indexOf('to[46]=$s.s(50)');
const afterTable = content.indexOf(';var no=', to46Idx);
console.log('String table ends at pos:', afterTable);

// Extract the "no" identifier map (maps short codes to to[k][j] lookups)
const noRegion = content.substring(afterTable, afterTable + 5000);
console.log('\n=== "no" identifier map (first 3000 chars) ===');
console.log(noRegion.substring(0, 3000));

// Find where actual function/class bodies begin (after the no= map)
// Look for patterns like: function, prototype, cc_class, _decorator
console.log('\n\n=== Searching for gameplay function patterns ===\n');

// Search for key difficulty config access patterns
// The code uses to[k][j] to get strings. Find patterns like to[7][n] which contains lv configs
// Also find where num100Base, lv2Config etc are used as object keys

// Find all "num" + digit patterns that indicate difficulty numbers
const numPatRe = /num\d{2,3}(?:Base|Add|Reduce|Scale)/g;
console.log('Forward num* patterns (rare in source):');
let nm;
let cnt = 0;
while ((nm = numPatRe.exec(content)) !== null && cnt < 10) {
    console.log(`  pos=${nm.index}: ${nm[0]}`);
    cnt++;
}

// Find the level config object definitions
// lv2Config..lv9Config are in to[7] (chunk size 9)
// Search for patterns where these are assigned as properties with numeric values
// Pattern: to[7][n] followed by :number or =number
console.log('\n=== Searching for config object literals with numeric values ===');
// Look for object patterns like {key:val,key:val} where keys come from to[] lookups
const objLitRe = /\{(?:to\[\d+\]\[\d+\]:[^,}]+,?){2,}/g;
let om;
cnt = 0;
while ((om = objLitRe.exec(content)) !== null && cnt < 5) {
    console.log(`\npos=${om.index}: ${om[0].substring(0, 400)}`);
    cnt++;
}

// Find functions that reference level/game_level and do arithmetic
console.log('\n=== Functions referencing game level + arithmetic ===');
// game_level is in to[] somewhere. Find "level_emag" (reversed game_level) usage
const gameLevelRe = /level_emag/g;
cnt = 0;
while ((nm = gameLevelRe.exec(content)) !== null && cnt < 8) {
    const ctx = content.substring(Math.max(0, nm.index - 150), nm.index + 200);
    console.log(`\npos=${nm.index}: ...${ctx}...`);
    cnt++;
}
