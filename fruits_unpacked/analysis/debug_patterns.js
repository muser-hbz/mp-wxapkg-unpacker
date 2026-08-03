// Debug: examine actual code patterns at specific positions
const fs = require('fs');
const content = fs.readFileSync('d:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js', 'utf8');

// SM#7 region - look at the this[...]=function pattern
console.log('=== Around pos 612919 (SM#7) ===');
// Find the this[...]=function pattern before this position
let searchStart = 612000;
let searchEnd = 614000;
let region = content.substring(searchStart, searchEnd);

// Find "this[" patterns
const thisPattern = /this\[([^\]]+)\]=function\(\)\{var t,n,r=to,i=ro,/g;
let m;
while ((m = thisPattern.exec(region)) !== null) {
    console.log(`\nFound this[${m[1]}]=function at pos ${searchStart + m.index}`);
    // Show the var declarations
    const afterMatch = region.substring(m.index + m[0].length, m.index + m[0].length + 500);
    console.log(`Var decls: ${afterMatch.substring(0, 400)}`);

    // Show the for-loop pattern
    const forMatch = afterMatch.match(/for\(var (\w+)=0,(\w+)=([a-zA-Z_]\w*);/);
    if (forMatch) {
        console.log(`For loop: for(var ${forMatch[1]}=0,${forMatch[2]}=${forMatch[3]};`);
    } else {
        console.log('No standard for loop found, looking for alternative...');
        const altFor = afterMatch.match(/for\(var[^;]{0,100};[^;]{0,100};[^)]{0,50}\)/);
        if (altFor) console.log(`Alt for: ${altFor[0]}`);
    }

    // Show first few case patterns
    const casePattern = /case\s+([^:]+):t\[([^\]]+)\]=([^;]+);break/g;
    let cm;
    let caseCount = 0;
    while ((cm = casePattern.exec(afterMatch)) !== null && caseCount < 5) {
        console.log(`  case ${cm[1]}: t[${cm[2]}] = ${cm[3]}`);
        caseCount++;
    }
}

// Also look at SM#11 region
console.log('\n\n=== Around pos 674468 (SM#11) ===');
searchStart = 673500;
searchEnd = 676000;
region = content.substring(searchStart, searchEnd);

// Find the this[...]=function pattern
const thisPattern2 = /this\[([^\]]+)\]=function\(\)\{for\(var t,n,r=to,i=ro,/g;
while ((m = thisPattern2.exec(region)) !== null) {
    console.log(`\nFound this[${m[1]}]=function at pos ${searchStart + m.index}`);
    const afterMatch = region.substring(m.index + m[0].length, m.index + m[0].length + 1000);
    console.log(`After: ${afterMatch.substring(0, 800)}`);
}

// Also look at the physics config case patterns
console.log('\n\n=== Physics config cases (pos 667161) ===');
const physRegion = content.substring(667000, 670000);
const physCasePattern = /case\s+(\S+?):n\[([^\]]+)\]=function\(\)\{/g;
while ((m = physCasePattern.exec(physRegion)) !== null) {
    const caseStart = physRegion.indexOf(m[0], m.index);
    const caseEnd = physRegion.indexOf('break;', caseStart + m[0].length);
    const fullCase = physRegion.substring(m.index, caseEnd + 6);
    console.log(`\nCase ${m[1]}: n[${m[2]}]`);
    console.log(`  ${fullCase.substring(0, 300)}`);
}

// Look at the exact pattern for "this[" before SM#7
console.log('\n\n=== Searching for this[...]=function patterns near SM#7 ===');
const searchRegion = content.substring(611000, 614000);
const allThisPatterns = [];
const thisRe = /this\[([^\]]+)\]/g;
let tm;
while ((tm = thisRe.exec(searchRegion)) !== null) {
    allThisPatterns.push({ pos: 611000 + tm.index, prop: tm[1] });
}
for (const p of allThisPatterns) {
    const ctx = content.substring(p.pos, Math.min(content.length, p.pos + 100));
    console.log(`  this[${p.prop}] at pos ${p.pos}: ${ctx.substring(0, 80)}...`);
}
