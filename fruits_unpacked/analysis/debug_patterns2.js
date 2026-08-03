// Debug: test regex patterns against actual code
const fs = require('fs');
const content = fs.readFileSync('d:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js', 'utf8');

// Test 1: Find physics config case patterns
console.log('=== Test 1: Physics config case pattern ===');
const testRegion = content.substring(667000, 670000);
// Simple pattern: case XX:n[XX]=function
const simpleCase = /case\s+(\S+?):n\[([^\]]+)\]=function\(\)\{var t,n=to,r=n\[3\]/g;
let m;
let count = 0;
while ((m = simpleCase.exec(testRegion)) !== null) {
    count++;
    if (count <= 3) {
        console.log(`Match ${count}: case ${m[1]}: n[${m[2]}]`);
        // Get full case body
        const caseStart = m.index;
        const breakIdx = testRegion.indexOf('break;', caseStart);
        const fullCase = testRegion.substring(caseStart, breakIdx + 6);
        console.log(`  Body: ${fullCase.substring(0, 200)}`);

        // Extract values: [n[4][1]]=VAL, t[r[1]]=RATIO, t[n[10][1]]=COUNT
        const valMatch = fullCase.match(/\[n\[4\]\[1\]\]\]=([^,]+)/);
        const ratioMatch = fullCase.match(/t\[r\[1\]\]=([^,]+)/);
        const countMatch = fullCase.match(/t\[n\[10\]\[1\]\]\]=([^,]+)/);
        console.log(`  radius: ${valMatch ? valMatch[1] : 'N/A'}`);
        console.log(`  scale: ${ratioMatch ? ratioMatch[1] : 'N/A'}`);
        console.log(`  type: ${countMatch ? countMatch[1] : 'N/A'}`);
    }
}
console.log(`Total matches: ${count}`);

// Test 2: Find this[...]=function patterns with r=to
console.log('\n=== Test 2: this[...]=function patterns ===');
const testRegion2 = content.substring(611000, 615000);
const thisPattern = /this\[([^\]]+)\]=function\(\)\{for\(var t,n,r=to,/g;
while ((m = thisPattern.exec(testRegion2)) !== null) {
    console.log(`\nFound: this[${m[1]}]=function at pos ${611000 + m.index}`);
    // Get var declarations
    const afterMatch = testRegion2.substring(m.index + m[0].length, m.index + m[0].length + 500);
    console.log(`  Var area: ${afterMatch.substring(0, 400)}`);
}

// Test 3: Find the broader pattern for config objects
console.log('\n=== Test 3: Broader this[...]=function search ===');
const broaderPattern = /this\[([^\]]+)\]=function\(\)\{for\(var t,n,r=to,r=ro,/g;
const testRegion3 = content.substring(610000, 620000);
while ((m = broaderPattern.exec(testRegion3)) !== null) {
    console.log(`Found: this[${m[1]}] at pos ${610000 + m.index}`);
    const afterMatch = testRegion3.substring(m.index + m[0].length, m.index + m[0].length + 600);
    console.log(`  After: ${afterMatch.substring(0, 500)}`);
}

// Test 4: Find ALL this[...]=function patterns in the entire file that contain r=to
console.log('\n=== Test 4: All this[...]=function with to/ro in entire file ===');
const allThisPattern = /this\[([^\]]+)\]=function\(\)\{for\(var t,n,r=to,/g;
let allCount = 0;
while ((m = allThisPattern.exec(content)) !== null) {
    allCount++;
    if (allCount <= 20) {
        console.log(`  [${allCount}] this[${m[1]}] at pos ${m.index}`);
    }
}
console.log(`Total: ${allCount}`);

// Test 5: Find patterns with Gu( (generator/iterator pattern)
console.log('\n=== Test 5: Gu( iterator patterns ===');
const guPattern = /this\[([^\]]+)\]=function\(\)\{var t,n,r=to,i=ro[^}]*?Gu\(/g;
let guCount = 0;
while ((m = guPattern.exec(content)) !== null) {
    guCount++;
    if (guCount <= 10) {
        console.log(`  [${guCount}] this[${m[1]}] at pos ${m.index}`);
        const after = content.substring(m.index + m[0].length, m.index + m[0].length + 200);
        console.log(`    After: ${after.substring(0, 150)}`);
    }
}
console.log(`Total: ${guCount}`);
