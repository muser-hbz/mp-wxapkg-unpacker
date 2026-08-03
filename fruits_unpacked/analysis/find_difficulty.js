// Search for key gameplay identifiers (reversed in source) and extract difficulty algorithm context
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

function rev(s) { return s.split('').reverse().join(''); }

// Key gameplay terms to find (these appear REVERSED in source after Qs decoding, but the
// runtime reverses them. However the source also contains them as part of $s table lookups.
// More useful: search for the FORWARD identifiers that appear in object literals / property
// access after the Qs decode. Actually the code uses $s.s(n)[to[k]] to get strings.
// Let's instead find numeric difficulty patterns and class definitions.

// 1. Find all class-like definitions: cc_class, _decorator patterns
console.log('=== Searching for difficulty-related code patterns ===\n');

// The opaque-predicate vars (Fs, Bs, zs, Us, Hs, Vs, Ws, Js, js, qs, Ks, Ys, Xs, Zs) all = 1
// They appear in arithmetic like: someVar*Fs, someVar+Bs, etc.
// Find assignments that use these as multipliers in numeric contexts
const opaqueVars = ['Fs','Bs','zs','Us','Hs','Vs','Ws','Js','js','qs','Ks','Ys','Xs','Zs'];

// 2. Find the to[] array - it maps indices to offset in the split string table
const toArrayStart = content.indexOf('to=new Array(47)');
if (toArrayStart >= 0) {
    // Extract the next ~3000 chars to see the initialization
    const region = content.substring(toArrayStart, toArrayStart + 4000);
    console.log('=== to[] array region ===');
    console.log(region.substring(0, 2500));
    console.log('...\n');
}

// 3. Search for level config patterns - lv2Config..lv9Config, num100Base etc.
// These strings are in the decoded $s table. The code accesses them via index.
// But the CONFIG OBJECTS themselves use these as property keys.
// Search for reversed "Config" = "fignoC" and "Base" = "esaB"
const configRe = /(\w+)\s*=\s*\{[^}]*?fignoC\w*/g;
console.log('=== Searching for Config objects ===');

// 4. Better approach: find all occurrences of key reversed strings and show context
const keyTerms = ['num100Base','num30Base','num10Base','lv2Config','fruitScale',
    'randomMin','randomMax','lastMultiple','lastTypeScale','holeItemTypeArr',
    'calculatedInfo','fruitType','challengeCount','dayAdNumDatas',
    'squeezeCircle','halfGameWidth','MoveDirection','fruitCollider',
    'contrastServerLevelData','FruitPositionCalculator'];

console.log('=== Reversed key terms found in source ===');
for (const term of keyTerms) {
    const r = rev(term);
    const idx = content.indexOf(r);
    if (idx >= 0) {
        console.log(`\n[${term}] reversed="${r}" found at pos ${idx}`);
        // show surrounding 200 chars
        const ctx = content.substring(Math.max(0, idx - 100), idx + r.length + 100);
        console.log(`  context: ...${ctx}...`);
    }
}

// 5. Find the "黑洞" (black hole) rule text and surrounding config
const holeTerm = '黑洞最多生成 4 个';
const holeIdx = content.indexOf(rev(holeTerm));
console.log(`\n=== Black hole rule (reversed) found at: ${holeIdx} ===`);
if (holeIdx >= 0) {
    const ctx = content.substring(Math.max(0, holeIdx - 300), holeIdx + 600);
    console.log(ctx);
}
