// Find exact module boundaries and locate obfuscated gameplay region
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

const defineRe = /define\("([^"]+)",\s*function\s*\([^)]*\)\s*\{/g;
const modules = [];
let m;
while ((m = defineRe.exec(content)) !== null) {
    modules.push({ name: m[1], start: m.index });
}
// compute end positions
for (let i = 0; i < modules.length; i++) {
    modules[i].end = (i + 1 < modules.length) ? modules[i + 1].start : content.length;
    modules[i].size = modules[i].end - modules[i].start;
}

// Which module contains the obfuscation at position 59712-61096?
const obfStart = 59712;
for (const mod of modules) {
    if (obfStart >= mod.start && obfStart < mod.end) {
        console.log(`Obfuscation region (pos ${obfStart}) is in module: ${mod.name}`);
        console.log(`  Module range: ${mod.start} - ${mod.end} (size ${mod.size})`);
        console.log(`  Offset into module: ${obfStart - mod.start}`);
        break;
    }
}

// Focus on assets/start-scene/index.js - find its actual gameplay portion
const startScene = modules.find(x => x.name === 'assets/start-scene/index.js');
console.log(`\n=== assets/start-scene/index.js ===`);
console.log(`Range: ${startScene.start} - ${startScene.end} (size ${startScene.size})`);

// Extract the region around the obfuscation setup (59000 - 65000)
const obfRegion = content.substring(59000, 66000);
console.log(`\n=== Obfuscation setup region (59000-66000) ===`);
console.log(obfRegion.substring(0, 3000));
