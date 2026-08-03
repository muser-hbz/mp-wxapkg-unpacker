// Analyze state machines SM#7-10 which define config objects with many properties
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

// Decode ro[] table
function decodeRo(noStr) {
    const n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+./:;<=>?@[]^_`{|}~';
    const r = {};
    for (let i = 0; i < n.length; ++i) r[n[i]] = i;
    function e(t) {
        const i = n.length;
        let e = 0, a = 1;
        for (let u = t.length - 1; u >= 0; u--) { e += r[t[u]] * a; a *= i; }
        return e;
    }
    const a = noStr.split(',');
    const u = Number(a[0]);
    const s = [];
    for (let o = 1; o < a.length; ++o) {
        const val = e(a[o]);
        s.push(isNaN(val) ? 0 : val + u);
    }
    return s;
}
const noMarker = ";var no='";
const noStart = content.indexOf(noMarker) + noMarker.length;
let ni = noStart;
while (content[ni] !== "'") ni++;
const roArr = decodeRo(content.substring(noStart, ni));
console.log('ro[] decoded:', roArr.length, 'elements');
console.log('ro[104]=', roArr[104], 'ro[142]=', roArr[142]);

// Decode to[] tables
function Qs(t) {
    const n = Array.from(t);
    for (let r = 0, i = t.length - 1; r < i; r++, i--) { const e = n[r]; n[r] = n[i]; n[i] = e; }
    return n.join('');
}
const toTables = {};
const qsPattern = /\$s=Qs\("/g;
let qm;
while ((qm = qsPattern.exec(content)) !== null) {
    const qsStart = qm.index + qm[0].length;
    let qi = qsStart;
    while (qi < content.length) {
        if (content[qi] === '\\') { qi += 2; continue; }
        if (content[qi] === '"') break;
        qi++;
    }
    const reversedStr = content.substring(qsStart, qi);
    const afterQuote = content.substring(qi + 1, qi + 200);
    const afterMatch = afterQuote.match(/^,(\d+)\),to\[(\d+)\]=\$s\.s\((\d+)\)/);
    if (afterMatch) {
        const chunkSize = parseInt(afterMatch[1]);
        const tableIdx = parseInt(afterMatch[2]);
        let forwardStr;
        try { forwardStr = JSON.parse('"' + reversedStr + '"'); }
        catch(e) { forwardStr = reversedStr; }
        const reversed = Qs(forwardStr);
        const chunks = [];
        for (let i = 0; i < reversed.length; i += chunkSize) chunks.push(reversed.substring(i, i + chunkSize));
        toTables[tableIdx] = chunks;
    }
}
console.log('to[] decoded:', Object.keys(toTables).length, 'tables');

// Helper: resolve to[idx][subidx] reference
function resolveTo(refStr) {
    const m = refStr.match(/to\[(\d+)\]\[(\d+)\]/);
    if (m) {
        const t = parseInt(m[1]);
        const s = parseInt(m[2]);
        if (toTables[t] && toTables[t][s]) return toTables[t][s];
    }
    return refStr;
}

// Helper: resolve ro[idx] reference
function resolveRo(refStr) {
    const m = refStr.match(/ro\[(\d+)\]/);
    if (m) {
        const idx = parseInt(m[1]);
        return roArr[idx];
    }
    return refStr;
}

// Look at SM#7 (pos 612919) - this defines config objects
console.log('\n=== SM#7 region (pos 612919) ===');
const sm7Region = content.substring(612000, 614000);
console.log(sm7Region);

// Look at SM#8 (pos 620479)
console.log('\n=== SM#8 region (pos 620479) ===');
const sm8Region = content.substring(619500, 622000);
console.log(sm8Region);

// Look at SM#11 (pos 674468) - the big one with 37 iterations
console.log('\n=== SM#11 region (pos 674468) ===');
const sm11Region = content.substring(674000, 676000);
console.log(sm11Region);

// Extract key to[] table entries for understanding
console.log('\n=== Key to[] table entries ===');
for (const t of [3, 4, 6, 7, 9, 10, 11]) {
    if (toTables[t]) {
        console.log(`to[${t}] (${toTables[t].length} entries): ${toTables[t].slice(0, 20).join(' | ')}`);
    }
}
