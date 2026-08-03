// Parse game.js module structure and identify obfuscation patterns
const fs = require('fs');
const path = require('path');

const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

// Extract all define("module.name", function...) entries
const defineRe = /define\("([^"]+)",\s*function\s*\([^)]*\)\s*\{/g;
const modules = [];
let m;
let idx = 0;
while ((m = defineRe.exec(content)) !== null) {
    modules.push({ name: m[1], start: m.index, bodyStart: m.index + m[0].length });
    idx++;
}

console.log(`Total modules found: ${modules.length}`);
console.log('\n=== Module List (with size) ===');
for (let i = 0; i < modules.length; i++) {
    const mod = modules[i];
    const nextStart = (i + 1 < modules.length) ? modules[i + 1].start : content.length;
    const approxSize = nextStart - mod.start;
    console.log(`[${i}] ${mod.name}  (~${approxSize} chars)`);
}

// Look for the string reversal function pattern: var X=function(t){for(var n=Array.from(t)...
const reverseFnRe = /var\s+(\w+)\s*=\s*function\s*\(\s*\w+\s*\)\s*\{\s*for\s*\(\s*var\s+\w+\s*=\s*Array\.from\(/g;
console.log('\n=== String Reversal Functions ===');
while ((m = reverseFnRe.exec(content)) !== null) {
    const ctx = content.substring(m.index, Math.min(m.index + 300, content.length));
    console.log(`Found at ${m.index}: ${m[1]}`);
    console.log(`  Context: ${ctx.substring(0, 200)}...`);
}

// Look for the String.prototype.s=function pattern (chunking)
const protoRe = /String\.prototype\.(\w+)\s*=\s*function/g;
console.log('\n=== String.prototype extensions ===');
while ((m = protoRe.exec(content)) !== null) {
    const ctx = content.substring(m.index, Math.min(m.index + 250, content.length));
    console.log(`Found: String.prototype.${m[1]} at ${m.index}`);
    console.log(`  ${ctx.substring(0, 200)}`);
}

// Look for opaque predicate pattern: Uu(2*Ou(zu(...))) etc
const opaqueRe = /(\w+)\s*=\s*(\w+)\(\s*(\d+)\s*\*\s*(\w+)\(\s*(\w+)\(\s*(\d+)\s*\)\s*\)\s*\)/g;
console.log('\n=== Opaque Predicates (sample) ===');
let count = 0;
while ((m = opaqueRe.exec(content)) !== null && count < 5) {
    const ctx = content.substring(m.index, Math.min(m.index + 200, content.length));
    console.log(`At ${m.index}: ${ctx.substring(0, 180)}`);
    count++;
}

// Count long reversed string literals (strings > 40 chars that look reversed)
const strLitRe = /"([A-Za-z0-9_\/\.\-]{40,})"/g;
console.log('\n=== Long string literals (reversed candidates, first 20) ===');
count = 0;
const candidates = [];
while ((m = strLitRe.exec(content)) !== null) {
    const s = m[1];
    // Heuristic: contains reversed common words like "tnemel", "eci", "retlif"
    const reversed = s.split('').reverse().join('');
    if (/[a-z][A-Z]/.test(s) || /el|tnem|retlif|eci|noitcnuf|tneitap/.test(reversed)) {
        candidates.push({ orig: s, reversed, pos: m.index });
        if (count < 20) {
            console.log(`pos=${m.index}`);
            console.log(`  orig: ${s.substring(0, 60)}${s.length > 60 ? '...' : ''}`);
            console.log(`  rev:  ${reversed.substring(0, 60)}${reversed.length > 60 ? '...' : ''}`);
            count++;
        }
    }
}
console.log(`\nTotal reversed-string candidates: ${candidates.length}`);
