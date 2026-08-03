// Final search: find level configs, difficulty scaling, and black hole algorithm
const fs = require('fs');
const path = require('path');
const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

// 1. Search for the level config data in import JSON files
const gamePkgDir = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/_subpackages_game_/subpackages/game';
function findJsonFiles(dir, maxDepth=3, depth=0) {
    let results = [];
    if (depth > maxDepth) return results;
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const e of entries) {
            const full = path.join(dir, e.name);
            if (e.isDirectory()) results = results.concat(findJsonFiles(full, maxDepth, depth+1));
            else if (e.name.endsWith('.json')) results.push(full);
        }
    } catch(err) {}
    return results;
}

console.log('=== Game subpackage JSON files ===');
const jsonFiles = findJsonFiles(gamePkgDir);
for (const f of jsonFiles.slice(0, 30)) {
    const stat = fs.statSync(f);
    console.log(`  ${f} (${stat.size})`);
}

// 2. Search for level config patterns in the code
// The configs lv2Config...lv9Config are in to[7] (chunk size 9)
// to[7] contains: num10Base, num30Base, Component, GameEventType, lv7Config, fruitType,
//   randomMin, fruitComp, lv4Config, lv8Config, lv9Config, ...
// Find where to[7] is accessed with config indices
console.log('\n=== to[7] access patterns (level configs) ===');
const to7Re = /to\[7\]\[(\d+)\]/g;
let tm;
const to7Accesses = {};
while ((tm = to7Re.exec(content)) !== null) {
    const idx = tm[1];
    if (!to7Accesses[idx]) to7Accesses[idx] = [];
    to7Accesses[idx].push(tm.index);
}
for (const k of Object.keys(to7Accesses).sort((a,b)=>+a-+b)) {
    console.log(`  to[7][${k}]: ${to7Accesses[k].length} accesses, first at ${to7Accesses[k][0]}`);
}

// 3. Find the actual level config object definitions
// These would be like: {to[7][4]:ro[n], to[7][8]:ro[m], ...} = {lv4Config:val, lv8Config:val}
// But with aliasing, they use the aliased names. Let me find where multiple config keys
// are assigned together in an object literal
console.log('\n=== Searching for config definition blocks ===');
// Look for patterns where 3+ properties are set with numeric values near level/game keywords
const cfgBlockRe = /\{[^{}]{0,800}?\}/g;
let bm;
let cfgFound = 0;
while ((bm = cfgBlockRe.exec(content)) !== null && cfgFound < 10) {
    const block = bm[0];
    // Check if this block has 3+ numeric assignments and is in the gameplay region
    if (bm.index > 110000 && bm.index < 780000) {
        const numAssigns = (block.match(/:\s*(?:ro\[\d+\]|\d+\.?\d*)\s*[,}]/g) || []).length;
        if (numAssigns >= 5 && numAssigns <= 20) {
            // Check if it references config-like patterns
            const hasConfig = /to\[\d+\]\[\d+\]/.test(block);
            if (hasConfig) {
                console.log(`\n[Config block] pos=${bm.index} numAssigns=${numAssigns}:`);
                console.log(`  ${block.substring(0, 500)}`);
                cfgFound++;
            }
        }
    }
}

// 4. Find the fruit type selection / black hole algorithm
// Search for code that references both "hole" and "fruit" related to[]
console.log('\n=== Black hole / fruit generation algorithm ===');
// The black hole rule says: A=(14,34), A+=4*(holes-2)
// Search for arithmetic patterns with these specific values
// ro[36]=200, ro[37]=174, ro[38]=86, ro[39]=64, ro[40]=50
// 14 and 34 might be direct or derived. Let's search for "4*(" pattern
const fourTimesRe = /4\*\s*\(/g;
let fm2;
let fourCount = 0;
while ((fm2 = fourTimesRe.exec(content)) !== null && fourCount < 10) {
    if (fm2.index > 110000) {
        const ctx = content.substring(Math.max(0, fm2.index - 80), fm2.index + 200);
        if (/to\[\d+\]|ro\[\d+\]/.test(ctx)) {
            console.log(`\npos=${fm2.index}: ${ctx.substring(0, 280)}`);
            fourCount++;
        }
    }
}

// 5. Find the "randomMin/randomMax" usage - difficulty randomization
console.log('\n=== randomMin/randomMax config access ===');
// to[7] indices: search the decoded to[7] content
// From decoded strings: to[7] chunk size 9 contains:
// "simpleNameenumerablenum100Add2num100Add1_decoratorfruitsCompGAME_CLICKgame_levelscrollViewrandomBasegame_musicgame_soundsecret_keyfruitScalesetRigType..."
// Wait, that's to[8] (chunk size 10). Let me recheck.
// to[7] = $s.s(9) - chunk size 9
// The decoded [6] string (pos 71258) was: "prototypetypeStageRandomIntnum10Basenum30BaseComponentstringifyhalfGameWEventTypelv7ConfigfruitTyperandomMinfruitComplv4Configlv8Configlv9ConfiguseSki..."
// Split into chunks of 9: "prototype", "typeStage", "RandomInt", "num10Base", "num30Base", "Component", "stringify", "halfGameW", "EventType", "lv7Config", "fruitType", "randomMin", "fruitComp", "lv4Config", "lv8Config", "lv9Config", "useSki..."
// So to[7][3]="num10Base", to[7][4]="num30Base", to[7][9]="lv7Config", to[7][11]="randomMin", to[7][13]="lv4Config", to[7][14]="lv8Config", to[7][15]="lv9Config"

console.log('to[7] decoded indices (chunk size 9):');
const to7str = "prototypetypeStageRandomIntnum10Basenum30BaseComponentstringifyhalfGameWEventTypelv7ConfigfruitTyperandomMinfruitComplv4Configlv8Configlv9ConfiguseSki";
const chunkSize = 9;
for (let i = 0; i < to7str.length; i += chunkSize) {
    console.log(`  to[7][${i/chunkSize}] = "${to7str.substring(i, i+chunkSize)}"`);
}
