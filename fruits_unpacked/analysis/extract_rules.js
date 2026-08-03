// Extract complete gameplay rule strings and decode the ro numeric constant table
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

// 1. Decode the ro() function to get numeric constants
// Find the no='...' string
const noStart = content.indexOf(";var no='") + ";var no='".length;
let ni = noStart;
while (content[ni] !== "'") ni++;
const noStr = content.substring(noStart, ni);
console.log('=== no string length:', noStr.length, '===');

// Replicate the ro function
function ro(t) {
    const n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+./:;<=>?@[]^_`{|}~"';
    const r = {};
    for (let i = 0; i < n.length; ++i) r[n[i]] = i;
    function e(t) {
        const i = n.length;
        let e = 0, a = 1;
        for (let u = t.length - 1; u >= 0; u--) { e += r[t[u]] * a; a *= i; }
        return e;
    }
    const a = t.split(',');
    const u = Number(a[0]);
    const s = [];
    for (let o = 1; o < a.length; ++o) {
        const c = e(a[o]);
        s.push(c + u);
    }
    return s;
}
const roArr = ro(noStr);
console.log('=== Decoded ro[] array (numeric constants) ===');
console.log('Length:', roArr.length);
console.log(JSON.stringify(roArr));

// 2. Find ALL rule text strings (Chinese text assignments like Kt="...", Yt="...", etc.)
// These are variable assignments: VARNAME="中文规则..."
const ruleRe = /([A-Za-z_$][\w$]*)\s*=\s*"([\u4e00-\u9fff【】\d\.\-\s,，。：；()（）/\n+=*×A-Z]{10,})"/g;
console.log('\n=== All gameplay rule text strings ===');
let rm;
let rules = [];
while ((rm = ruleRe.exec(content)) !== null) {
    const txt = rm[2];
    if (txt.length > 15 && /[\u4e00-\u9fff]/.test(txt)) {
        rules.push({ var: rm[1], text: txt, pos: rm.index });
    }
}
for (const r of rules) {
    console.log(`\n[${r.var}] (pos ${r.pos}):`);
    console.log(r.text);
}

// 3. Find the variable alias block: Fs&&(t=to[4][61],n=2,...)
const aliasStart = content.indexOf('Fs&&(t=');
if (aliasStart >= 0) {
    // Find matching close paren - it's a long statement
    let depth = 0;
    let ai = aliasStart;
    let end = aliasStart;
    while (ai < content.length) {
        if (content[ai] === '(') depth++;
        else if (content[ai] === ')') { depth--; if (depth === 0) { end = ai; break; } }
        ai++;
    }
    const aliasBlock = content.substring(aliasStart, end + 1);
    console.log('\n=== Variable alias block (Fs&&(t=...) ) length:', aliasBlock.length, '===');
    // Print first 5000 chars
    console.log(aliasBlock.substring(0, 5000));
    if (aliasBlock.length > 5000) console.log('...[truncated]...');
}
