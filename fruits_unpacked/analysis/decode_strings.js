// Decode the reversed string table and analyze obfuscation helpers
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

// Qs reverses a string. Find the big $s=Qs("...") assignment by locating "$s=Qs(" then scanning for the closing quote
const marker = '$s=Qs("';
const startIdx = content.indexOf(marker);
if (startIdx < 0) { console.log('No $s=Qs assignment found'); process.exit(1); }
const strStart = startIdx + marker.length;
// Scan to find the closing unescaped quote
let i = strStart;
while (i < content.length) {
    if (content[i] === '\\') { i += 2; continue; }
    if (content[i] === '"') break;
    i++;
}
const reversedBig = content.substring(strStart, i);
console.log('Raw reversed $s length:', reversedBig.length);
// Decode JS string escapes
let decoded;
try { decoded = JSON.parse('"' + reversedBig + '"'); }
catch(e) { decoded = reversedBig; }
const forward = decoded.split('').reverse().join('');
console.log('=== Decoded $s string (forward) length:', forward.length, '===');
console.log(forward);

// Now find the to=new Array(47) initialization that follows
const toArrayRe = /to=new Array\(47\);([\s\S]{0,4000}?)(?:var |function|;var)/;
const tm = toArrayRe.exec(content.substring(startIdx));
if (tm) {
    console.log('\n=== to[] array initialization (first 3000 chars) ===');
    console.log(tm[1].substring(0, 3000));
}

// Verify opaque predicates: Ns = Uu(2*Ou(zu(5094)))<=Uu(Ou(2276)+Ou(11402))
// Ou=Math.log, zu=Math.abs, Uu=Math.round
const Ou = Math.log, Fu = Math.floor, Bu = Math.exp, zu = Math.abs, Uu = Math.round;
function evalPredicate(expr) {
    // Just demonstrate a few
}
const Ns = Uu(2*Ou(zu(5094)))<=Uu(Ou(2276)+Ou(11402));
console.log('\n=== Opaque predicate verification ===');
console.log('Ns =', Ns, '(expected true, so Fs=+Ns=1)');
const ls = Uu(2*Ou(zu(12987)))<=Uu(Ou(10733)+Ou(16218));
console.log('ls =', ls);
const vs = Fu(78)<Fu(Bu((Ou(85)+Ou(79)+Ou(70))/3));
console.log('vs =', vs);
// All the *s=+Ns vars
console.log('Fs=Bs=zs=...=Zs = +Ns =', +Ns);

// Count how many times Qs( is called in the file (decoded string literals)
const qsCallRe = /Qs\("/g;
let count = 0;
let qm;
while ((qm = qsCallRe.exec(content)) !== null) count++;
console.log('\n=== Qs() call count:', count, '===');

// Extract and decode ALL Qs("...") string literals using manual scanning (handles very long strings)
console.log('\n=== All decoded Qs strings ===');
const qsMarker = 'Qs("';
let qpos = 0;
let qi = 0;
while (true) {
    const idx = content.indexOf(qsMarker, qpos);
    if (idx < 0) break;
    const s = idx + qsMarker.length;
    let j = s;
    while (j < content.length) {
        if (content[j] === '\\') { j += 2; continue; }
        if (content[j] === '"') break;
        j++;
    }
    const raw = content.substring(s, j);
    try {
        const dec = JSON.parse('"' + raw + '"');
        const fwd = dec.split('').reverse().join('');
        if (fwd.length > 0) {
            console.log(`[${qi}] pos=${idx} len=${fwd.length}: ${fwd.substring(0, 150)}${fwd.length>150?'...':''}`);
            qi++;
        }
    } catch(e) {}
    qpos = j + 1;
}
console.log(`Total decoded: ${qi}`);
