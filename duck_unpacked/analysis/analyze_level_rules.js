// 搜索关卡难度/生成规则相关字符串及其代码上下文
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/duck_unpacked/_subpackages_main_/subpackages/main/game.js';
const content = fs.readFileSync(srcFile, 'utf8');
const tables = JSON.parse(fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/analysis_rt_tables.json', 'utf8'));

// 1. 搜索难度/生成/关卡规则相关字符串
console.log('=== 难度/生成/规则相关字符串 ===');
const searchKws = ['难度', '生成', '数量', '水果', '槽位', '鸭子', '掉落', '下落', '随机', '种子', 'seed',
    'difficult', 'random', 'generate', 'create', 'duck', 'fruit', 'slot', 'drop', 'fall',
    '救救', '救鸭', '瓶子', '飞刀', '主线', '每日一关', '关卡配置', '关卡数据', 'count', 'Count', 'max', 'min',
    '难度飙升', '章节', 'chapter', '无限', '无尽', 'endless', 'challenge', '挑战'];
const hits = {};
for (const [tIdx, arr] of Object.entries(tables)) {
    for (let si = 0; si < arr.length; si++) {
        const s = arr[si];
        if (!s || s.length < 2) continue;
        for (const kw of searchKws) {
            if (s.includes(kw) && s.length < 40) {
                if (!hits[kw]) hits[kw] = [];
                if (hits[kw].length < 12) hits[kw].push(`rt[${tIdx}][${si}]="${s}"`);
            }
        }
    }
}
// 只显示信息量大的
for (const kw of ['难度', '种子', 'seed', '章节', 'chapter', '无限', '无尽', 'endless', '难度飙升', '关卡配置', '关卡数据', '主线', '每日一关', '救救', '生成']) {
    if (hits[kw]) {
        console.log(`\n--- ${kw} ---`);
        hits[kw].forEach(x => console.log('  ' + x));
    }
}

// 2. 查找游戏主场景和入口逻辑
console.log('\n=== 主玩法/场景字符串 ===');
for (const [tIdx, arr] of Object.entries(tables)) {
    for (let si = 0; si < arr.length; si++) {
        const s = arr[si];
        if (s && (s.includes('gameScene') || s.includes('GameScene') || s.includes('mainScene') || s === 'game' || s === 'main')) {
            console.log(`  rt[${tIdx}][${si}]="${s}"`);
        }
    }
}

// 3. 关键: 搜索"每日一关"和"主线"的用法（这是两种关卡模式）
console.log('\n=== levelNo/levelId 相关上下文(全文引用) ===');
// levelNo在rt[5][310]，代码中引用形式可能是 rt[5][310] 或通过变量别名
// 先直接搜索
for (const ref of ['rt[5][310]', 'rt[5][502]']) {
    const re = new RegExp(ref.replace(/\[/g, '\\[').replace(/\]/g, '\\]'), 'g');
    let m; let count = 0;
    while ((m = re.exec(content)) !== null) count++;
    console.log(`  ${ref}: ${count} 次引用`);
}

// 4. 搜索核心类定义: 通过 b[9][9]( 这种模式找存储函数
// rt[4][108] 是什么属性名
console.log('\n=== 关键索引解码 ===');
console.log(`rt[4][108] = "${tables[4][108]}"`);
console.log(`rt[7][473] = "${tables[7][473]}"`);
console.log(`rt[8][420] = "${tables[8][420]}"`);
console.log(`rt[3][140] = "${tables[3][140]}"`);
console.log(`rt[11][181] = "${tables[11][181]}"`);
console.log(`rt[4][60] = "${tables[4][60]}"`);

// 5. 查找大的数据数组定义（关卡数据可能硬编码在JS中）
console.log('\n=== 大数字数组搜索（关卡数据特征） ===');
// 搜索形如 [1,2,3,4,...] 的长数字数组（>30个元素）
const arrRe = /\[((?:\d+[,;]?){30,})\]/g;
let am;
let found = 0;
while ((am = arrRe.exec(content)) !== null && found < 10) {
    const nums = am[1].split(',').filter(x => x.length > 0).map(Number);
    if (nums.length >= 30 && nums.length <= 300) {
        const ctxStart = Math.max(0, am.index - 80);
        console.log(`@${am.index}: ${nums.length}个数字 [${nums.slice(0, 20).join(',')}...]`);
        console.log(`  上下文: ...${content.substring(ctxStart, am.index + 60)}...`);
        found++;
    }
}
