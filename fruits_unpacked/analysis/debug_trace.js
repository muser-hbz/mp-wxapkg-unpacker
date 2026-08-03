// Debug: test regex directly
const fs = require('fs');
const content = fs.readFileSync('d:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js', 'utf8');

// Test the marker
const funcMarker = ']=function(){for(var t,n=to,r=ro,';
console.log('Marker:', JSON.stringify(funcMarker));
console.log('Marker length:', funcMarker.length);

// Find first occurrence
const idx = content.indexOf(funcMarker);
console.log('First occurrence at pos:', idx);
if (idx >= 0) {
    console.log('Context:', content.substring(idx - 20, idx + 50));

    // Look backwards for this[
    const before = content.substring(Math.max(0, idx - 100), idx);
    console.log('\nBefore marker (100 chars):');
    console.log(before);
    console.log('\nthis[ position in before:', before.lastIndexOf('this['));
    console.log('before.length:', before.length);
    console.log('before.length - 50:', before.length - 50);
}

// Count all occurrences
let count = 0;
let pos = 0;
while (true) {
    const i = content.indexOf(funcMarker, pos);
    if (i < 0) break;
    count++;
    pos = i + 1;
}
console.log('\nTotal occurrences:', count);

// Try regex approach
const regex = /this\[((?:[^\[\]]|\[[^\]]*\])+)\]=function\(\)\{for\(var t,n=to,r=ro,/g;
let m;
let rCount = 0;
while ((m = regex.exec(content)) !== null) {
    rCount++;
    if (rCount <= 20) {
        console.log(`\nRegex match ${rCount}: this[${m[1]}] at pos ${m.index}`);
    }
}
console.log('\nTotal regex matches:', rCount);
