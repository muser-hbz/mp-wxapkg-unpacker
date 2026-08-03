// Debug: trace config object extraction
const fs = require('fs');
const content = fs.readFileSync('d:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js', 'utf8');

// Search for ,n=to,r=ro,
const marker = ',n=to,r=ro,';
let pos = 0;
let count = 0;
while (true) {
    const idx = content.indexOf(marker, pos);
    if (idx < 0) break;
    count++;
    pos = idx + 1;

    if (count <= 10) {
        console.log(`\n[${count}] Marker at pos ${idx}`);
        // Look backwards for this[
        const searchBack = content.substring(Math.max(0, idx - 200), idx);
        const thisIdx = searchBack.lastIndexOf('this[');
        if (thisIdx >= 0) {
            const thisStart = Math.max(0, idx - 200) + thisIdx;
            console.log(`  this[ found at pos ${thisStart}`);
            const afterThis = content.substring(thisStart + 5, thisStart + 105);
            console.log(`  after this[: "${afterThis}"`);

            // Try regex match
            const funcMatch = afterThis.match(/^((?:[^\[\]]|\[[^\]]*\])+)\]=function\(\)\{for\(var t,n=to,r=ro,/);
            if (funcMatch) {
                console.log(`  Regex MATCH! propRaw = "${funcMatch[1]}"`);
            } else {
                console.log(`  Regex NO MATCH`);
                // Try simpler regex
                const simpleMatch = afterThis.match(/^(.+?)\]=function/);
                if (simpleMatch) {
                    console.log(`  Simple match: "${simpleMatch[1]}"`);
                }
            }
        } else {
            console.log(`  this[ NOT found in backward search`);
            // Show what's before the marker
            const before = content.substring(Math.max(0, idx - 100), idx);
            console.log(`  Before marker: "...${before.substring(before.length - 80)}"`);
        }
    }
}
console.log(`\nTotal markers found: ${count}`);

// Also search for "n=to,r=ro" without the leading comma
const marker2 = 'n=to,r=ro';
let pos2 = 0;
let count2 = 0;
while (true) {
    const idx = content.indexOf(marker2, pos2);
    if (idx < 0) break;
    count2++;
    pos2 = idx + 1;
}
console.log(`\nTotal "n=to,r=ro" (without comma): ${count2}`);

// Also search for "n=to,i=ro"
const marker3 = 'n=to,i=ro';
let pos3 = 0;
let count3 = 0;
while (true) {
    const idx = content.indexOf(marker3, pos3);
    if (idx < 0) break;
    count3++;
    pos3 = idx + 1;
}
console.log(`Total "n=to,i=ro": ${count3}`);

// Search for all "this[" followed by "function" within 200 chars
const thisFuncPattern = /this\[/g;
let tfm;
let tfCount = 0;
while ((tfm = thisFuncPattern.exec(content)) !== null) {
    const after = content.substring(tfm.index, tfm.index + 200);
    if (after.includes('function') && after.includes('n=to') && after.includes('r=ro')) {
        tfCount++;
        if (tfCount <= 10) {
            console.log(`\nthis[...function...n=to...r=ro at pos ${tfm.index}:`);
            console.log(`  ${after.substring(0, 150)}`);
        }
    }
}
console.log(`\nTotal this[...function...n=to...r=ro: ${tfCount}`);
