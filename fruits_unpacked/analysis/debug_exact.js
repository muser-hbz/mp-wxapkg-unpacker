// Debug: check exact text at SM#7 position
const fs = require('fs');
const content = fs.readFileSync('d:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js', 'utf8');

// Check text around pos 612581
console.log('=== Text at pos 612581 ===');
const snippet = content.substring(612500, 613000);
console.log(snippet);

// Check if ,n=to,r=ro, exists near here
const marker = ',n=to,r=ro,';
const idx = content.indexOf(marker, 612000);
console.log(`\nMarker ",n=to,r=ro," found at pos: ${idx}`);
if (idx >= 0) {
    console.log(`Context: ...${content.substring(idx - 50, idx + 50)}...`);
}

// Also check for n=to,r=ro without leading comma
const marker2 = 'n=to,r=ro';
const idx2 = content.indexOf(marker2, 612000);
console.log(`\n"n=to,r=ro" found at pos: ${idx2}`);
if (idx2 >= 0) {
    console.log(`Context: ...${content.substring(idx2 - 50, idx2 + 50)}...`);
}

// List ALL marker positions near 612000
console.log('\n=== All ,n=to,r=ro, positions in range 610000-620000 ===');
let pos = 610000;
while (true) {
    const idx = content.indexOf(marker, pos);
    if (idx < 0 || idx > 620000) break;
    console.log(`  pos ${idx}: ...${content.substring(idx - 30, idx + 30)}...`);
    pos = idx + 1;
}

// List ALL "this[" positions in range 612000-613000
console.log('\n=== All this[ positions in range 612000-613000 ===');
let p = 612000;
while (true) {
    const idx = content.indexOf('this[', p);
    if (idx < 0 || idx > 613000) break;
    console.log(`  pos ${idx}: ${content.substring(idx, idx + 80)}`);
    p = idx + 1;
}

// Check the exact pattern: does "this[r[14]]=function(){for(var t,n=to,r=ro," exist?
const exactPattern = 'this[r[14]]=function(){for(var t,n=to,r=ro,';
const exactIdx = content.indexOf(exactPattern);
console.log(`\nExact pattern "this[r[14]]=function(){for(var t,n=to,r=ro," found at: ${exactIdx}`);

// Try without the r[14] part - just search for "=function(){for(var t,n=to,r=ro,"
const partialPattern = '=function(){for(var t,n=to,r=ro,';
let pp = 0;
let ppCount = 0;
while (true) {
    const idx = content.indexOf(partialPattern, pp);
    if (idx < 0) break;
    ppCount++;
    if (ppCount <= 20) {
        // Show what comes before =
        const before = content.substring(Math.max(0, idx - 50), idx);
        console.log(`\n  [${ppCount}] pos ${idx}: ...${before}=function(){for(var t,n=to,r=ro,`);
    }
    pp = idx + 1;
}
console.log(`\nTotal "=function(){for(var t,n=to,r=ro," occurrences: ${ppCount}`);

// Also check for "]=function(){for(var t,n=to,r=ro,"
const partialPattern2 = ']=function(){for(var t,n=to,r=ro,';
let pp2 = 0;
let pp2Count = 0;
while (true) {
    const idx = content.indexOf(partialPattern2, pp2);
    if (idx < 0) break;
    pp2Count++;
    if (pp2Count <= 20) {
        const before = content.substring(Math.max(0, idx - 80), idx + 1);
        console.log(`\n  [${pp2Count}] pos ${idx}: ...${before}`);
    }
    pp2 = idx + 1;
}
console.log(`\nTotal "]=function(){for(var t,n=to,r=ro," occurrences: ${pp2Count}`);
