// Debug: test exact regex against exact code snippet
const fs = require('fs');
const content = fs.readFileSync('d:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js', 'utf8');

// Extract a known physics config case
const snippet = content.substring(667161, 667500);
console.log('=== Physics config snippet ===');
console.log(snippet);
console.log('\nLength:', snippet.length);

// Test regex step by step
console.log('\n=== Regex tests ===');

// Test 1: case pattern
const test1 = snippet.match(/case\s+(\S+?):n\[([^\]]+)\]=function\(\)\{var t,n=to,r=n\[3\];/);
console.log('Test 1 (case + function start):', test1 ? `MATCH: case ${test1[1]} n[${test1[2]}]` : 'NO MATCH');

// Test 2: full case with [r[0]]()
const test2 = snippet.match(/case\s+(\S+?):n\[([^\]]+)\]=function\(\)\{var t,n=to,r=n\[3\];return\(t=function\(\)\{[^}]*\}\[r\[0\]\]\(\)\)/);
console.log('Test 2 (with [r[0]]()):', test2 ? 'MATCH' : 'NO MATCH');

// Test 3: value extraction
const test3 = snippet.match(/\[n\[4\]\[1\]\]=([^,]+)/);
console.log('Test 3 ([n[4][1]]=VAL):', test3 ? `MATCH: ${test3[1]}` : 'NO MATCH');

// Test 4: full pattern
const test4 = snippet.match(/case\s+(\S+?):n\[([^\]]+)\]=function\(\)\{var t,n=to,r=n\[3\];return\(t=function\(\)\{[^}]*\}\[r\[0\]\]\(\)\)\[n\[4\]\[1\]\]=([^,]+),t\[r\[1\]\]=([^,]+),t\[n\[10\]\[1\]\]=([^,]+),t\}/);
console.log('Test 4 (full pattern):', test4 ? `MATCH: radius=${test4[3]}, scale=${test4[4]}, type=${test4[5]}` : 'NO MATCH');

// Test 5: simpler approach - just find all [n[4][1]]= patterns
const test5 = snippet.match(/\[n\[4\]\[1\]\]/g);
console.log('Test 5 (find [n[4][1]]):', test5 ? `${test5.length} matches` : 'NO MATCH');

// Let me look at the exact bytes around [n[4][1]]
const idx = snippet.indexOf('[n[4][1]]');
if (idx >= 0) {
    console.log('\n=== Context around [n[4][1]] ===');
    console.log(`Found at index ${idx}`);
    console.log(`Before: ...${snippet.substring(Math.max(0, idx - 30), idx)}`);
    console.log(`Match: ${snippet.substring(idx, idx + 20)}`);
    console.log(`After: ${snippet.substring(idx + 12, idx + 30)}`);

    // Check exact characters
    const exact = snippet.substring(idx, idx + 15);
    console.log(`\nExact string: "${exact}"`);
    console.log('Char codes:', [...exact].map(c => c.charCodeAt(0)));
}

// Test the config function pattern
console.log('\n=== Config function pattern test ===');
const configSnippet = content.substring(612581, 612900);
console.log('Config snippet:', configSnippet);

// Test: this[...]=function(){for(var t,n,r=to,r=ro,
const cfgTest = configSnippet.match(/this\[([^\]]+)\]=function\(\)\{for\(var t,n,r=to,r=ro,/);
console.log('Config pattern test:', cfgTest ? `MATCH: this[${cfgTest[1]}]` : 'NO MATCH');

// Try alternative: this[...]=function(){for(var
const cfgTest2 = configSnippet.match(/this\[([^\]]+)\]=function\(\)\{for\(var/);
console.log('Alt config pattern:', cfgTest2 ? `MATCH: this[${cfgTest2[1]}]` : 'NO MATCH');

// Try: find where "r=to,r=ro" appears
const rPattern = /r=to,r=ro/g;
let rm;
let rCount = 0;
while ((rm = rPattern.exec(content)) !== null) {
    rCount++;
    if (rCount <= 5) {
        const ctx = content.substring(Math.max(0, rm.index - 50), rm.index + 50);
        console.log(`\n"r=to,r=ro" at pos ${rm.index}: ...${ctx}...`);
    }
}
console.log(`Total "r=to,r=ro" occurrences: ${rCount}`);

// Try: find "r=to,i=ro" pattern
const riPattern = /r=to,i=ro/g;
let riCount = 0;
while (rPattern.exec(content) !== null) riCount++; // already counted above

const riPattern2 = /this\[([^\]]+)\]=function\(\)\{for\(var t,n,r=to,i=ro/g;
let riCount2 = 0;
while (riPattern2.exec(content) !== null) {
    riCount2++;
    if (riCount2 <= 5) {
        const m = riPattern2.exec(content);
        // Actually this won't work because we already consumed the match
    }
}
// Reset and count properly
const riPattern3 = /this\[([^\]]+)\]=function\(\)\{for\(var t,n,r=to,i=ro/g;
let riMatches = [];
let rm3;
while ((rm3 = riPattern3.exec(content)) !== null) {
    riMatches.push({ pos: rm3.index, prop: rm3[1] });
}
console.log(`\n"this[...]=function(){for(var t,n,r=to,i=ro" matches: ${riMatches.length}`);
for (const m of riMatches.slice(0, 10)) {
    console.log(`  this[${m.prop}] at pos ${m.pos}`);
}
