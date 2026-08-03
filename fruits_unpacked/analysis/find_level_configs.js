// Comprehensive search for configuration data in game.js
// Looking for: lv2Config~lv9Config, LevelData, FruitData, large arrays, config objects
const fs = require('fs');

const gameJsPath = 'd:\\project\\mp-wxapkg-unpacker\\fruits_unpacked\\__WITHOUT_MULTI_PLUGINCODE__\\game.js';
const content = fs.readFileSync(gameJsPath, 'utf8');

console.log('File size:', content.length, 'chars');

// 1. Search for config name identifiers in decoded strings
// The to[] string tables contain identifiers - search for config-related ones
const configKeywords = [
    'Config', 'Level', 'Fruit', 'Data', 'Adventure', 'Strategy',
    'Reward', 'Item', 'Drop', 'Block', 'Theme', 'Sound', 'Task',
    'Guide', 'Novice', 'Expert', 'Classic', 'Puzzle', 'Tetris',
    'Point', 'Area', 'Atlas', 'Mapping', 'mechanism', 'MoreRemove',
    'Normal', 'StayDay', 'Views', 'ABTest', 'Action', 'Activity',
    'Ad', 'City', 'peachblossom', 'Reward', 'Rank', 'ranking'
];

console.log('\n=== Searching for config keywords in string literals ===');
for (const kw of configKeywords) {
    // Search in reversed strings (the obfuscation reverses strings)
    const reversed = kw.split('').reverse().join('');
    const reversedPattern = `"${reversed}"`;
    const count = (content.match(new RegExp(reversedPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    if (count > 0) {
        console.log(`  "${kw}" (reversed: "${reversed}") found ${count} times`);
    }
}

// 2. Search for lv2Config~lv9Config in reversed form
console.log('\n=== Searching for lv*NConfig identifiers (reversed) ===');
for (let i = 2; i <= 9; i++) {
    const kw = `lv${i}Config`;
    const reversed = kw.split('').reverse().join('');
    const pattern = `"${reversed}"`;
    const matches = [];
    let idx = 0;
    while ((idx = content.indexOf(pattern, idx)) !== -1) {
        matches.push(idx);
        idx += pattern.length;
    }
    if (matches.length > 0) {
        console.log(`  ${kw}: found at positions ${matches.slice(0, 5).join(', ')}${matches.length > 5 ? '...' : ''}`);
    }
}

// 3. Search for "targetCount", "fruitTypeCount", "holeCount" etc (reversed)
console.log('\n=== Searching for level data field names (reversed) ===');
const fieldNames = ['targetCount', 'fruitTypeCount', 'downType', 'quistFlowerCount', 'holeCount', 'holeFruit', 'iceCount', 'scatterType', 'blockCount', 'ropeCount', 'fireCount', 'isWood', 'exchangeCount'];
for (const fn of fieldNames) {
    const reversed = fn.split('').reverse().join('');
    const pattern = `"${reversed}"`;
    const matches = [];
    let idx = 0;
    while ((idx = content.indexOf(pattern, idx)) !== -1) {
        matches.push(idx);
        idx += pattern.length;
    }
    if (matches.length > 0) {
        console.log(`  ${fn}: found ${matches.length} times, first at pos ${matches[0]}`);
    }
}

// 4. Search for large numeric arrays (potential level data)
console.log('\n=== Searching for large numeric arrays (100+ elements) ===');
const arrayPattern = /\[(-?\d+(?:\.\d+)?(?:,-?\d+(?:\.\d+)?){99,})\]/g;
let match;
let arrayCount = 0;
while ((match = arrayPattern.exec(content)) !== null && arrayCount < 20) {
    const nums = match[1].split(',');
    console.log(`  Array at pos ${match.index}: ${nums.length} elements, first 10: [${nums.slice(0, 10).join(',')}...]`);
    arrayCount++;
}

// 5. Search for "FruitData" or "LevelData" in any form
console.log('\n=== Searching for LevelData/FruitData references ===');
const dataNames = ['LevelData', 'FruitData', 'LevelBData', 'LevelCData', 'LevelCowData', 'LevelSliceData', 'LevelCond', 'AdventureLevel', 'AdventureArea', 'AdventureSeason', 'FruitConfig', 'GameConfig'];
for (const dn of dataNames) {
    const reversed = dn.split('').reverse().join('');
    // Search as substring in any string
    const pattern1 = new RegExp(`"${reversed}"`, 'g');
    const count1 = (content.match(pattern1) || []).length;
    if (count1 > 0) {
        console.log(`  "${dn}" (reversed): found ${count1} times as exact reversed string`);
    }
    // Also search direct
    const pattern2 = new RegExp(dn, 'g');
    const count2 = (content.match(pattern2) || []).length;
    if (count2 > 0 && count2 !== count1) {
        console.log(`  "${dn}" (direct): found ${count2} times`);
    }
}
