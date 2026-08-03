// Search ALL decoded strings for level data field names
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

// Decode ALL Qs strings
function Qs(t) {
    const n = Array.from(t);
    for (let r = 0, i = t.length - 1; r < i; r++, i--) { const e = n[r]; n[r] = n[i]; n[i] = e; }
    return n.join('');
}

const allDecoded = [];
const qsMarker = 'Qs("';
let qpos = 0;
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
        const fwd = Qs(dec);
        allDecoded.push({ pos: idx, str: fwd });
    } catch(e) {}
    qpos = j + 1;
}

console.log(`Total decoded Qs strings: ${allDecoded.length}`);

// Concatenate ALL decoded strings into one big text for searching
const allText = allDecoded.map(d => d.str).join('');

// Search for level data field names
const fields = [
    'targetCount', 'fruitTypeCount', 'downType', 'quistFlowerCount',
    'holeCount', 'holeFruit', 'iceCount', 'scatterType', 'blockCount',
    'ropeCount', 'fireCount', 'isWood', 'exchangeCount',
    'LevelData', 'FruitData', 'AdventureLevel', 'AdventureArea',
    'ClassicDifficulty', 'DropDifficulty', 'ExpertChallenge',
    'GuideLevelMap', 'LevelCond', 'LevelCowData', 'LevelSliceData',
    'NoviceGuide', 'PointArea', 'PuzzleMap', 'RewardPuzzle',
    'TetrisBlock', 'TetrisCountRate', 'TetrisPointArea', 'TetrisPuzzleGroup',
    'TetrisSpecial', 'ThemeData', 'ABTest', 'Action', 'ActivityList',
    'ActivityModule', 'Ad', 'CityConfig', 'Classic', 'Drop', 'DropMap',
    'Game', 'Item', 'MappingKeyName', 'mechanism', 'MoreRemove',
    'Normal', 'Sound', 'StayDay', 'Strategy', 'Task', 'Views',
    'peachblossom', 'AtlasPhoto', 'AtlasTitle', 'BlockColor',
    'Puzzle', 'TetrisBlockGroup', 'TetrisBlockGroup2',
    'holeItemTypeArr', 'fruitRemnantNum', 'woodenObsEasy',
    'calculatedInfo', 'contrastServerLevelData', 'isServerArchive',
    'mergeStorageKey', 'arrangeType', 'fruitCollider', 'fruitRigidbody',
    'squeezeCircle', 'jointGearMgr', 'halfGameWidth', 'halfGameHeight',
    'fruitTotalNum', 'game_level', 'fakeGame_level', 'curCollectCount',
    'stopFruitDownY_day', 'AdNumDatas_day', 'woodenObsBase', 'woodenObsMax',
    'firstLevelBg', 'curThemeType', 'shuffleArray', 'woodenObsEasyLv2',
    'lvoneTypeStartNum', 'lastTypeMin', 'lastTypeScale', 'lastMultiple',
    'lastTypeMinTwoNumScale', 'onsNumScale', 'num30reduce', 'num100reduce',
    'num100Add', 'randomBase', 'randomMax', 'randomN', 'randomScale',
    'fruitComp', 'fruitsComp', 'useSkinId', 'typeStage', 'num10Base',
    'num30Base', 'num100Base', 'EventType', 'halfGameW', 'halfGameH',
    'oneTypeEndNum', 'fallStartPos_', 'setItemActive', 'num100Base1_2',
    'num100Base3_2', 'startViewTime', 'linearDamping', 'MoveDirection',
    'lv2_3_5Config', 'btnSecondWall', 'btnFirstWall', 'game_vibrate',
    'holeCompBind', 'audioSource', 'challengeCount', 'dayAdNumDatas',
    'dayShareNum', 'fruitConfig', 'FruitConfig', 'dropLeft', 'dropRight',
    'stakeRoot', 'obstaclesRoot', 'boundaryLine', 'leftAndRightBoxWidth',
    'num100Base1', 'num100Base2', 'num100Base3', 'num100Base4',
    'num100Add1', 'num100Add2', 'num100Reduce', 'num100Reduce1', 'num100Reduce2',
    'num30Reduce', 'num100reduce1', 'num100reduce2',
    'lv2Config', 'lv3Config', 'lv4Config', 'lv5Config', 'lv6Config',
    'lv7Config', 'lv8Config', 'lv9Config',
    'cityNameArr', 'cityFruitNameArr', 'ad_video_id', 'ad_inter_id', 'ad_banner_id',
    'platformApi', 'platformApiUrl', 'secret_key', 'game_music', 'game_sound',
    'GAME_CLICK', 'level_id', 'nameStrs', 'bg_color', 'bg_music',
    'appKey', 'appid', 'openid', 'openID'
];

console.log('\n=== Field name search results ===');
for (const f of fields) {
    if (allText.includes(f)) {
        // Find which Qs string contains it
        for (const d of allDecoded) {
            if (d.str.includes(f)) {
                const pos = d.str.indexOf(f);
                const context = d.str.substring(Math.max(0, pos - 20), Math.min(d.str.length, pos + f.length + 20));
                console.log(`  "${f}" found in Qs string @ pos ${d.pos}, context: ...${context}...`);
                break;
            }
        }
    }
}

// Also show ALL to[] table entries grouped by table
console.log('\n=== ALL to[] tables ===');
const toTables = {};
const qsPattern2 = /\$s=Qs\("/g;
let qm;
while ((qm = qsPattern2.exec(content)) !== null) {
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

// Print all tables
for (const idx of Object.keys(toTables).sort((a,b) => parseInt(a) - parseInt(b))) {
    const t = toTables[idx];
    console.log(`\nto[${idx}] (${t.length} entries, chunkSize from $s.s):`);
    // Print entries with index
    for (let i = 0; i < t.length; i++) {
        process.stdout.write(`  [${i}]=${t[i]}`);
        if ((i + 1) % 5 === 0) process.stdout.write('\n');
    }
    process.stdout.write('\n');
}
