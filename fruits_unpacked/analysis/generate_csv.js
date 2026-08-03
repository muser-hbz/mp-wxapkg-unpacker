// 解码全部47张to[]字符串表 + ro[]数值常量，生成多个CSV文件
const fs = require('fs');
const path = require('path');

const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');
const outDir = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis/csv';
fs.ensureDirSync ? fs.ensureDirSync(outDir) : fs.mkdirSync(outDir, { recursive: true });

// ========== 1. 解码 Qs 反转函数 ==========
function Qs(t) {
    const n = Array.from(t);
    for (let r = 0, i = t.length - 1; r < i; r++, i--) {
        const e = n[r]; n[r] = n[i]; n[i] = e;
    }
    return n.join('');
}

// ========== 2. 解码 ro() 数值常量表 ==========
function decodeRo(noStr) {
    const n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+./:;<=>?@[]^_`{|}~"';
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
        const c = e(a[o]);
        s.push(c + u);
    }
    return s;
}

// 找到 no='...' 并解码
const noMarker = ";var no='";
const noStart = content.indexOf(noMarker) + noMarker.length;
let ni = noStart;
while (content[ni] !== "'") ni++;
const noStr = content.substring(noStart, ni);
const roArr = decodeRo(noStr);
console.log(`ro[] 解码完成: ${roArr.length} 项`);

// ========== 3. 解码全部 47 张 to[] 表 ==========
// 模式: $s=Qs("..."),N),to[K]=$s.s(N)
// 需要手动扫描每个 Qs("...") 并提取分块长度
const toTables = [];
const toMarker = 'to[';
let scanPos = content.indexOf('to=new Array(47)');

// 扫描所有 to[K]=$s.s(N) 赋值，同时追踪对应的 $s=Qs("...")
// 实际模式: $s=Qs("REVERSED_STRING"),CHUNK_SIZE),to[K]=$s.s(CHUNK_SIZE)
// 我们直接找所有 Qs(" 开头，然后找紧跟的 ),数字),to[数字]=$s.s(数字)
const qsPattern = /\$s=Qs\("/g;
let qm;
let tableCount = 0;
while ((qm = qsPattern.exec(content)) !== null) {
    const qsStart = qm.index + qm[0].length;
    // 找到闭合引号
    let qi = qsStart;
    while (qi < content.length) {
        if (content[qi] === '\\') { qi += 2; continue; }
        if (content[qi] === '"') break;
        qi++;
    }
    const reversedStr = content.substring(qsStart, qi);
    // 引号后模式: ,数字),to[数字]=$s.s(数字)
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
        for (let i = 0; i < reversed.length; i += chunkSize) {
            chunks.push(reversed.substring(i, i + chunkSize));
        }
        toTables.push({ index: tableIdx, chunkSize, raw: reversed, items: chunks });
        tableCount++;
    }
}
toTables.sort((a, b) => a.index - b.index);
console.log(`to[] 解码完成: ${tableCount} 张表`);

// ========== 4. 生成 CSV 文件 ==========

function writeCsv(filename, headers, rows) {
    const csvPath = path.join(outDir, filename);
    // 加 UTF-8 BOM 让 Excel 正确显示中文
    let csv = '\ufeff' + headers.join(',') + '\r\n';
    for (const row of rows) {
        csv += row.map(cell => {
            const s = String(cell == null ? '' : cell);
            // 含逗号/引号/换行的字段用双引号包裹
            if (/[",\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
            return s;
        }).join(',') + '\r\n';
    }
    fs.writeFileSync(csvPath, csv, 'utf8');
    console.log(`  生成: ${filename} (${rows.length} 行)`);
}

// --- CSV 1: ro[] 数值常量表 ---
console.log('\n=== 生成 CSV ===');
const roPurpose = {
    0: '置换表元素(11-35的置换)', 25: '常量45', 26: '常量36',
    36: '坐标/宽度200', 37: '坐标174', 38: '尺寸86', 39: '尺寸64', 40: '尺寸50',
    41: '时间3000ms', 42: '时间2000ms', 43: '坐标340', 44: '常量91', 45: '坐标560',
    46: '常量42', 47: '常量56', 48: '超时1278ms', 49: '时间600ms', 50: '常量60',
    51: '1小时ms', 52: '1分钟ms', 53: '1秒ms', 54: '百分比100', 55: '坐标180',
    56: '常量90', 57: '常量40', 58: '坐标201', 59: '尺寸80', 60: '尺寸120',
    61: '坐标300', 62: '常量99', 63: '坐标250', 64: '坐标2500', 65: '颜色255',
    66: '尺寸125', 67: '常量65', 68: '时间1800s', 69: '坐标345', 70: '常量70',
    71: '坐标500', 72: '时间5000ms', 73: '时间50000ms', 74: '坐标1050', 75: '尺寸150',
    76: '常量139', 77: '时间10000ms', 78: '常量55', 79: '常量95', 80: '坐标260',
    81: '常量78', 82: '常量61', 83: '坐标175', 84: '坐标578', 85: '常量102',
    86: '坐标202', 87: '时间6000ms', 88: '物理参数1501', 89: '物理参数4001',
    90: '坐标226', 91: '常量69', 92: '常量109', 93: '冰冻400单位', 94: '时间30000ms',
    95: '时间3600s', 96: '常量97', 97: '时间戳/号码',
    224: 'Unicode51001(emoji)', 225: 'Unicode51003', 226: '常量101',
    227: '坐标组开始', 257: '零值', 278: '1天86400s',
    282: '2小时ms', 290: '常量8000', 291: '常量320'
};
// MD5 常量范围
for (let i = 98; i <= 223; i++) {
    if (i === 98) roPurpose[i] = 'MD5常量区开始';
    else if (i === 1726675200000 && false) {}
}
// 坐标组标注
const coordGroups = [
    [227, 246, '坐标组A(障碍/水果位置)'],
    [247, 256, '坐标组B'],
    [258, 265, '坐标组C'],
    [266, 269, '坐标组D'],
    [270, 277, '坐标组E'],
];
for (const [s, e, label] of coordGroups) {
    for (let i = s; i <= e; i++) roPurpose[i] = label;
}

const roRows = roArr.map((val, idx) => [
    idx, val, roPurpose[idx] || (idx >= 98 && idx <= 223 ? 'MD5算法常量' : '')
]);
writeCsv('01_ro_numeric_constants.csv',
    ['索引', '值', '用途推测'], roRows);

// --- CSV 2: to[] 字符串标识符表（全部47张表） ---
const toRows = [];
for (const table of toTables) {
    for (let i = 0; i < table.items.length; i++) {
        toRows.push([table.index, i, table.chunkSize, table.items[i]]);
    }
}
writeCsv('02_to_string_tables.csv',
    ['表号to[k]', '索引j', '分块长度', '标识符'], toRows);

// --- CSV 3: 难度配置标识符表 ---
const difficultyConfig = [
    ['关卡配置', 'lv2Config', '第2关参数配置'],
    ['关卡配置', 'lv3Config', '第3关参数配置'],
    ['关卡配置', 'lv4Config', '第4关参数配置'],
    ['关卡配置', 'lv5Config', '第5关参数配置'],
    ['关卡配置', 'lv6Config', '第6关参数配置'],
    ['关卡配置', 'lv7Config', '第7关参数配置'],
    ['关卡配置', 'lv8Config', '第8关参数配置'],
    ['关卡配置', 'lv9Config', '第9关参数配置'],
    ['关卡配置', 'lv2_3_5Config', '第2/3/5关组合配置'],
    ['数值基准', 'num10Base', '基数10基准值'],
    ['数值基准', 'num30Base', '基数30基准值'],
    ['数值基准', 'num100Base', '基数100基准值'],
    ['数值基准', 'num100Add', '100基础增加值'],
    ['数值基准', 'num100Add1', '100基础增加值1'],
    ['数值基准', 'num100Add2', '100基础增加值2'],
    ['数值基准', 'num100Reduce', '100基础减少值'],
    ['数值基准', 'num100Reduce1', '100基础减少值1'],
    ['数值基准', 'num100Reduce2', '100基础减少值2'],
    ['数值基准', 'num30Reduce', '30基础减少值'],
    ['水果缩放', 'fruitScale', '水果缩放比例'],
    ['水果缩放', 'lastTypeScale', '上一类型缩放'],
    ['水果缩放', 'lastMultiple', '上次倍率'],
    ['水果缩放', 'lastTypeMin', '上一类型最小值'],
    ['水果缩放', 'lastTypeMinTwoNumScale', '双数值缩放'],
    ['水果属性', 'fruitType', '水果类型'],
    ['水果属性', 'fruitComp', '水果组件'],
    ['水果属性', 'fruitsComp', '水果组件集合'],
    ['水果属性', 'fruitCollider', '水果碰撞体'],
    ['水果属性', 'fruitRigidbody', '水果刚体'],
    ['水果属性', 'fruitRemnantNum', '水果剩余数量'],
    ['水果属性', 'fruitTotalNum', '水果总数'],
    ['随机化', 'randomMin', '随机范围下限'],
    ['随机化', 'randomMax', '随机范围上限'],
    ['随机化', 'randomBase', '随机基准值'],
    ['随机化', 'randomN', '随机次数/数量'],
    ['随机化', 'RandomInt', '随机整数生成函数'],
    ['黑洞系统', 'holeItemTypeArr', '黑洞水果类型数组'],
    ['黑洞系统', 'holeCount', '黑洞数量'],
    ['黑洞系统', 'holeCollider', '黑洞碰撞体'],
    ['黑洞系统', 'blackhole', '黑洞对象'],
    ['黑洞系统', 'holePosStart', '黑洞位置起始'],
    ['挑战系统', 'challengeCount', '挑战次数'],
    ['挑战系统', 'dayAdNumDatas', '每日广告次数数据'],
    ['挑战系统', 'dayShareNum', '每日分享次数'],
    ['挑战系统', 'challengeData', '挑战数据'],
    ['关卡进度', 'game_level', '当前游戏关卡'],
    ['关卡进度', 'fakeGame_level', '伪关卡号(显示用)'],
    ['关卡进度', 'curCollectCount', '当前收集数'],
    ['关卡进度', 'curHoleFruitType', '当前黑洞水果类型'],
    ['关卡进度', 'stopFruitDownY_day', '日常模式水果停止下落Y坐标'],
    ['关卡进度', 'AdNumDatas_day', '日常模式广告数据'],
    ['障碍物', 'woodenObsEasy', '简单木障碍配置'],
    ['障碍物', 'woodenObsEasyLv2', '简单木障碍Lv2配置'],
    ['障碍物', 'lvoneTypeStartNum', '初始类型起始数量'],
    ['计算缓存', 'calculatedInfo', '计算信息(难度缓存)'],
    ['计算缓存', 'contrastServerLevelData', '服务器关卡数据对比'],
    ['计算缓存', 'isServerArchive', '是否服务器存档'],
    ['计算缓存', 'mergeStorageKey', '合并存储键'],
    ['计算缓存', 'uploadLocalToServer', '本地数据上传服务器'],
    ['游戏尺寸', 'halfGameWidth', '游戏区域半宽(375)'],
    ['游戏尺寸', 'halfGameHeight', '游戏区域半高(667)'],
    ['游戏尺寸', 'leftAndRightBoxWidth', '左右盒子宽度'],
    ['游戏尺寸', 'squeezeCircle', '挤压圆(碰撞挤压效果)'],
    ['游戏尺寸', 'MoveDirection', '移动方向'],
    ['游戏尺寸', 'linearDamping', '线性阻尼'],
    ['游戏尺寸', 'fruitColliders', '水果碰撞器集合'],
];
writeCsv('03_difficulty_config_identifiers.csv',
    ['分类', '标识符', '说明'], difficultyConfig);

// --- CSV 4: 变量别名映射表 ---
const aliasRows = [
    ['ro[1]', 'i', '22', '置换表/排序'],
    ['ro[2]', 'e', '19', '置换表/排序'],
    ['ro[3]', 'a', '11', '置换表/排序'],
    ['ro[4]', 'u', '17', '置换表/排序'],
    ['ro[5]', 's', '31', '置换表/排序'],
    ['ro[6]', 'c', '21', '置换表/排序'],
    ['ro[7]', 'f', '28', '置换表/排序'],
    ['ro[8]', 'h', '26', '置换表/排序'],
    ['ro[9]', 'v', '14', '置换表/排序'],
    ['ro[10]', 'l', '35', '置换表/排序'],
    ['ro[11]', 'b', '34', '置换表/排序'],
    ['ro[12]', 'd', '32', '置换表/排序'],
    ['ro[13]', 'k', '30', '置换表/排序'],
    ['ro[14]', 'm', '23', '置换表/排序'],
    ['ro[15]', 'p', '24', '置换表/排序'],
    ['ro[16]', 'g', '18', '置换表/排序'],
    ['ro[17]', 'y', '29', '置换表/排序'],
    ['ro[18]', 'w', '25', '置换表/排序'],
    ['ro[19]', '_', '20', '置换表/排序'],
    ['ro[20]', 'M', '27', '置换表/排序'],
    ['ro[21]', 'S', '33', '置换表/排序'],
    ['ro[22]', 'A', '16', '置换表/排序'],
    ['ro[23]', 'C', '15', '置换表/排序'],
    ['ro[24]', 'x', '12', '置换表/排序'],
    ['字面量', 'j', '"桃"', '水果类型-桃'],
    ['字面量', 'q', '"梨"', '水果类型-梨'],
    ['字面量', 'K', '"柚"', '水果类型-柚'],
    ['字面量', 'Z', '"狗"', '动物类型-狗'],
    ['字面量', 'Q', '"狼"', '动物类型-狼'],
    ['字面量', '$', '"猪"', '动物类型-猪'],
    ['字面量', 'tt', '"猫"', '动物类型-猫'],
    ['字面量', 'nt', '"蛇"', '动物类型-蛇'],
    ['字面量', 'rt', '"龙"', '动物类型-龙'],
    ['字面量', 'n', '2', '数字常量'],
    ['字面量', 'r', '"6"', '字符串常量'],
    ['to[6][3]', 'T', '-', '标识符别名'],
    ['to[25][3]', 'L', '-', '标识符别名'],
    ['to[0][3]', 'I', '-', '标识符别名'],
    ['to[29][1]', 'R', '-', '标识符别名'],
    ['to[32][0]', 'E', '-', '标识符别名'],
    ['to[17][1]', 'D', '-', '标识符别名'],
    ['to[34][0]', 'N', '-', '标识符别名'],
    ['to[31][0]', 'P', '-', '标识符别名'],
    ['to[10][90]', 'G', '-', '标识符别名'],
    ['to[11][4]', 'O', '-', '标识符别名'],
    ['to[34][1]', 'F', '-', '标识符别名'],
    ['to[28][4]', 'B', '-', '标识符别名'],
    ['to[17][0]', 'z', '-', '标识符别名'],
    ['to[8][153]', 'U', '-', '标识符别名'],
    ['to[30][4]', 'H', '-', '标识符别名'],
    ['to[0][229]', 'V', '-', '标识符别名'],
];
writeCsv('04_variable_alias_mapping.csv',
    ['来源', '别名', '值', '说明'], aliasRows);

// --- CSV 5: 不透明谓词求值表 ---
const opaqueRows = [
    ['vs', 'Fu(78)<Fu(Bu((Ou(85)+Ou(79)+Ou(70))/3))', 'Math.floor(78)<Math.floor(Math.exp((Math.log(85)+Math.log(79)+Math.log(70))/3))', 'false', '不使用'],
    ['ls', 'Uu(2*Ou(zu(12987)))<=Uu(Ou(10733)+Ou(16218))', 'Math.round(2*Math.log(Math.abs(12987)))<=Math.round(Math.log(10733)+Math.log(16218))', 'true', '启用(条件分支)'],
    ['bs', 'Uu(2*Ou(zu(8062)))<=Uu(Ou(5876)+Ou(16105))', 'round(2*log(abs(8062)))<=round(log(5876)+log(16105))', 'true', '启用'],
    ['ds', 'Fu(53)<Fu(Bu((Ou(20)+Ou(ts)+Ou(56)+Ou(fs))/4))', 'floor(53)<floor(exp((log(20)+log(83)+log(56)+log(53))/4))', 'true', '启用'],
    ['ks', 'Uu(2*Ou(zu(3145)))<=Uu(Ou(1361)+Ou(9125))', 'round(2*log(abs(3145)))<=round(log(1361)+log(9125))', 'true', '启用'],
    ['ms', 'Fu(137/3)>=Fu(Bu((Ou(85)+Ou(11)+Ou(41))/3))', 'floor(137/3)>=floor(exp((log(85)+log(11)+log(41))/3))', 'false', '不使用'],
    ['ps', 'Uu(2*Ou(zu(2280)))<=Uu(Ou(4793)+Ou(1088))', 'round(2*log(abs(2280)))<=round(log(4793)+log(1088))', 'true', '启用'],
    ['gs', 'Fu(39.5)<Fu(Bu((Ou(3)+Ou(42)+Ou(93)+Ou(20))/4))', 'floor(39.5)<floor(exp((log(3)+log(42)+log(93)+log(20))/4))', 'true', '启用'],
    ['ys', 'Uu(2*Ou(zu(7187)))>Uu(Ou(10858)+Ou(6341))', 'round(2*log(abs(7187)))>round(log(10858)+log(6341))', 'false', '不使用'],
    ['ws', 'Uu(2*Ou(zu(2304)))>Uu(Ou(3265)+Ou(2593))', 'round(2*log(abs(2304)))>round(log(3265)+log(2593))', 'false', '不使用'],
    ['_s', 'Fu(89/3)<Fu(Bu((Ou(as)+Ou(8)+Ou(42))/3))', 'floor(89/3)<floor(exp((log(39)+log(8)+log(42))/3))', 'true', '启用'],
    ['Ms', 'Fu(122/3)<Fu(Bu((Ou(60)+Ou(20)+Ou(42))/3))', 'floor(122/3)<floor(exp((log(60)+log(20)+log(42))/3))', 'true', '启用'],
    ['Ss', 'Fu(140/3)<Fu(Bu((Ou(20)+Ou(74)+Ou(46))/3))', 'floor(140/3)<floor(exp((log(20)+log(74)+log(46))/3))', 'true', '启用'],
    ['As', 'Fu(164/3)>=Fu(Bu((Ou(as)+Ou(85)+Ou(40))/3))', 'floor(164/3)>=floor(exp((log(39)+log(85)+log(40))/3))', 'false', '不使用'],
    ['Cs', 'Fu(56.5)>=Fu(Bu((Ou(Yu)+Ou(96)+Ou(28)+Ou(46))/4))', 'floor(56.5)>=floor(exp((log(56)+log(96)+log(28)+log(46))/4))', 'false', '不使用'],
    ['Ns', 'Uu(2*Ou(zu(5094)))<=Uu(Ou(2276)+Ou(11402))', 'round(2*log(abs(5094)))<=round(log(2276)+log(11402))', 'true', '★关键(Fs=+Ns=1)'],
    ['Ps', 'Uu(2*Ou(zu(7485)))<=Uu(Ou(7625)+Ou(7394))', 'round(2*log(abs(7485)))<=round(log(7625)+log(7394))', 'true', '启用'],
    ['Gs', 'Uu(2*Ou(zu(2320)))>Uu(Ou(1808)+Ou(3088))', 'round(2*log(abs(2320)))>round(log(1808)+log(3088))', 'false', '不使用'],
    ['Fs=+Ns', 'Fs=Bs=zs=Us=Hs=Vs=Ws=Js=js=qs=Ks=Ys=Xs=Zs', '全部=Ns转换数字', '1', '算术乘数(恒等于1)'],
];
writeCsv('05_opaque_predicates.csv',
    ['变量名', '混淆表达式', '等价JS表达式', '求值结果', '作用'], opaqueRows);

// --- CSV 6: 玩法规则表 ---
const ruleRows = [
    ['规则0-Kt', '水果队列随机互换', '水果在根据初始化数据生成队列后，会执行一次随机互换；该随机不是均匀洗牌，已被交换的水果仍可能再次被交换，交换总次数等于水果数量。', '队列生成后执行N次随机两两交换(N=水果数量)；非均匀洗牌，同一水果可多次交换', '队列随机化'],
    ['规则4-Yt', '障碍物生成', '障碍物按 Y 轴区间等分生成，每个障碍位于各区间的中心位置，X 轴在 [-208, 208] 范围内随机。', 'Y轴等距分布(区间=总高/障碍数)；Y=区间中心；X=random(-208,208)', '障碍物布局'],
    ['规则5-Xt', '冰冻规则', '冰冻规则：仅从队列第 30 个之后的水果中选择；Y 坐标需低于关卡顶部 400 单位；解冻次数与高度成正比，越靠近顶部要求越高，最大不超过水果总数的一半，并在此基础上附加 0~5 的随机波动值。', '仅影响队列第30+水果；Y<顶部-400；解冻次数=f(高度)≤总数/2+random(0,5)', '冰冻难度'],
    ['规则Zt-1', '黑洞总数计算', '每关总黑洞水果数量：A=(14,34),随关黑洞越多/卡数变化,A+=4*(黑洞数量-2)。', 'A=random(14,34)+4*(holeCount-2)', '黑洞数量公式'],
    ['规则Zt-2', '黑洞水果生成阶段0', '随机四种类型插入，每种数量随机为 2 或 4。', '随机选4种类型，每种数量=random(2,4)', '水果生成-阶段0'],
    ['规则Zt-2', '黑洞水果生成阶段1', '剩余类型随机挑选，数量随机，保证总数不超过A。', '剩余类型随机选，数量随机，总数≤A', '水果生成-阶段1'],
    ['规则Zt-3', '黑洞水果补齐', '不足A时随机补齐，每种随机类型放2个，保证池中总数=A。', '若不足A则补齐，每类放2个，总数=A', '水果补齐'],
    ['规则Zt-4', '黑洞分配', '每个黑洞先保证至少一个水果类型，按排序顺序依次分配；剩余水果随机分配到各黑洞。', '每黑洞≥1类型(按序)；剩余随机分配', '黑洞分配'],
    ['规则Zt-5', '黑洞最终效果', '黑洞总数固定，每个黑洞至少一个水果类型；高关卡水果总数更多、种类更多。', '高关卡=更多水果+更多种类', '难度递增'],
    ['规则-黑洞位置', '黑洞位置选取', '黑洞最多生成4个，位置为固定配置；根据关卡编号对10取余，从对应的坐标组中选取。', 'max 4个黑洞；位置=坐标组[levelNumber%10]', '黑洞布局'],
];
writeCsv('06_gameplay_rules.csv',
    ['规则编号', '名称', '原始文本', '算法解析', '分类'], ruleRows);

// --- CSV 7: 核心类/模块表 ---
const classRows = [
    ['GameMgr.ts', '游戏主管理器', '核心', '管理游戏生命周期、关卡切换、全局状态'],
    ['GameMsg.ts', '游戏消息/事件', '核心', '定义游戏事件类型和消息常量'],
    ['GbzEnum.ts', '枚举定义', '核心', '游戏枚举(类型、状态、模式等)'],
    ['AbMgr.ts', 'AB测试管理器', '运营', 'A/B Test 分组与配置'],
    ['FruitConfig.ts', '水果配置', '★难度', '水果类型、缩放、数量等参数配置'],
    ['CalculatedInfo.ts', '计算信息', '★难度', '难度计算结果缓存与存档'],
    ['FruitPositionCalculator.ts', '水果位置计算器', '★布局', '根据关卡参数动态计算水果生成位置'],
    ['DataManager.ts', '数据管理器', '数据', '本地/服务器数据管理'],
    ['GbzDataManager.ts', '游戏数据管理', '数据', '关卡进度、存档同步'],
    ['GbzResManager.ts', '资源管理器', '资源', '资源加载与缓存'],
    ['CCPoolManager.ts', '对象池管理', '资源', '节点/对象复用池'],
    ['GbzAudioManager.ts', '音频管理', '音频', '音效与背景音乐'],
    ['AudioEngine.ts', '音频引擎', '音频', '底层音频播放'],
    ['EventDispatcher.ts', '事件分发器', '系统', '全局事件监听与分发'],
    ['BaseEventDispatcher.ts', '基础事件分发', '系统', '事件分发基类'],
    ['BgCtrCom.ts', '背景控制组件', '表现', '背景图切换与动画'],
    ['ChuiziCom.ts', '锤子道具组件', '道具', '锤子敲击道具逻辑'],
    ['DragFruit.ts', '拖拽水果逻辑', '交互', '水果拖拽操作处理'],
    ['FruitComp.ts', '水果组件', '实体', '单个水果实体组件'],
    ['FruitBookComp.ts', '水果图鉴组件', 'UI', '水果图鉴展示'],
    ['GbzFruitBookLayer.ts', '水果图鉴层', 'UI', '图鉴界面'],
    ['GbzFruitDownLa...', '水果下落层', '★布局', '水果下落容器与生成'],
    ['GbzAviseLayer.ts', '提示层', 'UI', '弹窗提示'],
    ['GbzLoseFullLayer.ts', '失败满层', 'UI', '游戏失败界面'],
    ['GbzPropSpecialLayer.ts', '特殊道具层', '道具', '特殊道具效果'],
    ['GbzCarMoveLayer.ts', '车移动层', '表现', '车辆移动动画'],
    ['AutoLightEffect.ts', '自动光效', '表现', '自动播放的光效'],
    ['AdPlatformBase.ts', '广告平台基类', '广告', '广告统一接口'],
    ['CusReport.ts', '自定义上报', '运营', '数据上报'],
    ['DecryptUtil.ts', '解密工具', '安全', '数据加解密'],
];
writeCsv('07_core_classes.csv',
    ['类名', '职责', '分类', '说明'], classRows);

// --- CSV 8: 网络接口表 ---
const apiRows = [
    ['登录', 'https://api.devourad.com/Wechat/gameLogin', 'POST', '微信小游戏登录'],
    ['抖音转化', 'https://api.devourad.com/Wechat/dyConversion', 'POST', '抖音广告转化上报'],
    ['绑定游戏', 'https://api.devourad.com/Gameinfo/getBindGame', 'GET', '获取绑定游戏信息'],
    ['获取存档', 'https://api.devourad.com/WechatGameFile/get_data', 'GET/POST', '拉取玩家存档'],
    ['保存存档', 'https://api.devourad.com/WechatGameFile/set_data', 'POST', '上传玩家存档'],
    ['抖音登录', 'https://api.devourad.com/douyin/gameLoginNoClickId', 'POST', '抖音登录(无ClickId)'],
    ['QQ上报', 'https://api.datanexus.qq.com/data-nexus-trace/log', 'POST', 'QQ数据上报'],
    ['分享图片CDN', 'https://cdn.devourad.com/dy/ShuiGuoShares/1.jpg', 'GET', '分享图片资源'],
    ['云开发环境', 'cloudbase-4gnwt8be5f2000b2', '-', '微信云开发环境ID'],
    ['SDK版本', '@dn-sdk/minigame v1.5.8', '-', '数据上报SDK'],
];
writeCsv('08_api_endpoints.csv',
    ['功能', 'URL/标识', '方法', '说明'], apiRows);

// --- CSV 9: 物理与引擎配置表 ---
const physicsRows = [
    ['引擎', 'CocosEngine', '3.8.8', 'Cocos Creator 引擎版本'],
    ['平台', 'platform', 'wechatgame', '微信小游戏平台'],
    ['设计分辨率-宽', 'designResolution.width', '750', '设计分辨率宽度'],
    ['设计分辨率-高', 'designResolution.height', '1334', '设计分辨率高度'],
    ['设计分辨率-策略', 'designResolution.policy', '4', '分辨率适配策略'],
    ['物理引擎', 'physicsEngine', 'Box2D(WASM)', '2D物理引擎'],
    ['重力-X', 'gravity.x', '0', 'X轴重力'],
    ['重力-Y', 'gravity.y', '-10', 'Y轴重力(向下)'],
    ['重力-Z', 'gravity.z', '0', 'Z轴重力'],
    ['允许休眠', 'allowSleep', 'true', '物理体允许休眠'],
    ['休眠阈值', 'sleepThreshold', '0.1', '进入休眠的速度阈值'],
    ['自动模拟', 'autoSimulation', 'true', '自动物理模拟'],
    ['固定时间步长', 'fixedTimeStep', '0.0166667', '物理步长(≈1/60秒)'],
    ['最大子步数', 'maxSubSteps', '1', '物理子步数'],
    ['碰撞组-fruit', 'collisionGroups[1]', 'fruit', '水果碰撞组(索引1)'],
    ['碰撞组-wall', 'collisionGroups[2]', 'wall', '墙壁碰撞组(索引2)'],
    ['碰撞组-obst', 'collisionGroups[3]', 'obst', '障碍物碰撞组(索引3)'],
    ['碰撞组-clickFruit', 'collisionGroups[4]', 'clickFruit', '可点击水果组(索引4)'],
    ['碰撞组-guardrail', 'collisionGroups[5]', 'guardrail', '护栏碰撞组(索引5)'],
    ['碰撞矩阵-默认', 'collisionMatrix[0]', '19', '默认组碰撞掩码(二进制10011)'],
    ['碰撞矩阵-fruit', 'collisionMatrix[1]', '31', '水果组(二进制11111=与wall/obst/clickFruit/guardrail碰撞)'],
    ['碰撞矩阵-wall', 'collisionMatrix[2]', '2', '墙壁组(二进制00010=仅与fruit碰撞)'],
    ['碰撞矩阵-obst', 'collisionMatrix[3]', '18', '障碍组(二进制10010=与fruit/clickFruit碰撞)'],
    ['碰撞矩阵-clickFruit', 'collisionMatrix[4]', '59', '可点击水果(二进制111011)'],
    ['碰撞矩阵-guardrail', 'collisionMatrix[5]', '16', '护栏组(二进制10000)'],
    ['预加载包', 'preloadBundles', 'start-scene,main', '启动时预加载的资源包'],
    ['下载并发数', 'downloadMaxConcurrency', '15', '最大并发下载数'],
    ['启动场景', 'launchScene', 'gameNew.scene', '游戏启动场景'],
    ['JS插件', 'jsList', 'crypto-md5.js', '引擎加载的JS插件'],
    ['脚本包', 'scriptPackages', 'bundle.js', '项目脚本入口包'],
];
writeCsv('09_physics_engine_config.csv',
    ['配置项', '键名', '值', '说明'], physicsRows);

// --- CSV 10: 资源分包表 ---
const bundleRows = [
    ['animals', '动物', '企鹅、熊猫、狐狸、狮子、老虎、猴子等', '是'],
    ['candies', '糖果', '各类糖果元素', '是'],
    ['fruits', '水果', '苹果、西瓜、葡萄、石榴、荔枝、香蕉等', '是'],
    ['game', '游戏核心资源', '场景、预制体、UI、配置', '是'],
    ['seaAnimals', '海洋动物', '海豚、海龟、章鱼、鲨鱼、鲸鱼等', '是'],
    ['secondary', '次要元素', '补充元素资源', '是'],
    ['sweets', '甜品', '甜品类元素', '是'],
    ['vegetable', '蔬菜', '南瓜、土豆、花菜、茄子等', '是'],
    ['start-scene', '开始场景', '首屏场景资源', '否(预加载)'],
    ['main', '主包', '主逻辑与核心资源', '否(预加载)'],
    ['internal', '内部资源', '引擎内置资源', '否'],
];
writeCsv('10_resource_bundles.csv',
    ['分包名', '主题', '内容示例', '是否主题包'], bundleRows);

// --- CSV 11: 水果/元素名称表 ---
const fruitRows = [
    [1, '水果', '苹果', 'fruits', '基础水果'],
    [2, '水果', '西瓜', 'fruits', '基础水果'],
    [3, '水果', '葡萄', 'fruits', '基础水果'],
    [4, '水果', '石榴', 'fruits', '基础水果'],
    [5, '水果', '荔枝', 'fruits', '基础水果'],
    [6, '水果', '香蕉', 'fruits', '基础水果'],
    [7, '水果', '黄桃', 'fruits', '基础水果'],
    [8, '水果', '草莓', 'fruits', '基础水果'],
    [9, '水果', '大枣', 'fruits', '基础水果'],
    [10, '水果', '芒果', 'fruits', '基础水果'],
    [11, '水果', '椰子', 'fruits', '基础水果'],
    [12, '水果', '蜜瓜', 'fruits', '基础水果'],
    [13, '水果', '蓝莓', 'fruits', '基础水果'],
    [14, '水果', '枇杷', 'fruits', '基础水果'],
    [15, '水果', '脐橙', 'fruits', '基础水果'],
    [16, '水果', '冬枣', 'fruits', '基础水果'],
    [17, '水果', '柠檬', 'fruits', '基础水果'],
    [18, '水果', '榴莲', 'fruits', '基础水果'],
    [19, '水果', '杨梅', 'fruits', '基础水果'],
    [20, '水果', '蜜桃', 'fruits', '基础水果'],
    [21, '水果', '桑葚', 'fruits', '基础水果'],
    [22, '水果', '樱桃', 'fruits', '基础水果'],
    [23, '水果', '雪梨', 'fruits', '基础水果'],
    [24, '水果', '桂圆', 'fruits', '基础水果'],
    [25, '水果', '山楂', 'fruits', '基础水果'],
    [26, '水果', '柿子', 'fruits', '基础水果'],
    [27, '水果', '树莓', 'fruits', '基础水果'],
    [28, '水果', '桃子', 'fruits', '基础水果'],
    [29, '水果', '橘子', 'fruits', '基础水果'],
    [30, '水果', '菠萝', 'fruits', '基础水果'],
    [31, '水果', '柚子', 'fruits', '基础水果'],
    [32, '水果', '猕猴桃', 'fruits', '基础水果'],
    [33, '水果', '哈密瓜', 'fruits', '基础水果'],
    [34, '水果', '水蜜桃', 'fruits', '基础水果'],
    [35, '水果', '苹果梨', 'fruits', '基础水果'],
    [36, '水果', '车厘子', 'fruits', '基础水果'],
    [37, '水果', '火龙果', 'fruits', '基础水果'],
    [38, '水果', '人参果', 'fruits', '基础水果'],
    [39, '蔬菜', '包菜', 'vegetable', '蔬菜类'],
    [40, '蔬菜', '南瓜', 'vegetable', '蔬菜类'],
    [41, '蔬菜', '土豆', 'vegetable', '蔬菜类'],
    [42, '蔬菜', '花菜', 'vegetable', '蔬菜类'],
    [43, '蔬菜', '茄子', 'vegetable', '蔬菜类'],
    [44, '蔬菜', '冬瓜', 'vegetable', '蔬菜类'],
    [45, '蔬菜', '大蒜', 'vegetable', '蔬菜类'],
    [46, '蔬菜', '山竹', 'vegetable', '蔬菜类'],
    [47, '蔬菜', '洋葱', 'vegetable', '蔬菜类'],
    [48, '蔬菜', '玉米', 'vegetable', '蔬菜类'],
    [49, '蔬菜', '生姜', 'vegetable', '蔬菜类'],
    [50, '蔬菜', '生菜', 'vegetable', '蔬菜类'],
    [51, '蔬菜', '竹笋', 'vegetable', '蔬菜类'],
    [52, '蔬菜', '苦瓜', 'vegetable', '蔬菜类'],
    [53, '蔬菜', '荸荠', 'vegetable', '蔬菜类'],
    [54, '蔬菜', '莲藕', 'vegetable', '蔬菜类'],
    [55, '蔬菜', '菜心', 'vegetable', '蔬菜类'],
    [56, '蔬菜', '菜瓜', 'vegetable', '蔬菜类'],
    [57, '蔬菜', '黄瓜', 'vegetable', '蔬菜类'],
    [58, '蔬菜', '西红柿', 'vegetable', '蔬菜类'],
    [59, '蔬菜', '红甘蓝', 'vegetable', '蔬菜类'],
    [60, '蔬菜', '黄彩椒', 'vegetable', '蔬菜类'],
    [61, '甜品', '葡挞', 'sweets', '甜品类'],
    [62, '甜品', '泡芙', 'sweets', '甜品类'],
    [63, '甜品', '曲奇', 'sweets', '甜品类'],
    [64, '甜品', '可颂', 'sweets', '甜品类'],
    [65, '动物', '企鹅', 'animals', '动物类'],
    [66, '动物', '小鸡', 'animals', '动物类'],
    [67, '动物', '熊猫', 'animals', '动物类'],
    [68, '动物', '狐狸', 'animals', '动物类'],
    [69, '动物', '狮子', 'animals', '动物类'],
    [70, '动物', '老虎', 'animals', '动物类'],
    [71, '动物', '兔子', 'animals', '动物类'],
    [72, '动物', '刺猬', 'animals', '动物类'],
    [73, '动物', '博美', 'animals', '动物类(狗品种)'],
    [74, '动物', '奶牛', 'animals', '动物类'],
    [75, '动物', '松鼠', 'animals', '动物类'],
    [76, '动物', '棕熊', 'animals', '动物类'],
    [77, '动物', '橘猫', 'animals', '动物类'],
    [78, '海洋', '水母', 'seaAnimals', '海洋动物'],
    [79, '海洋', '河豚', 'seaAnimals', '海洋动物'],
    [80, '海洋', '海象', 'seaAnimals', '海洋动物'],
    [81, '海洋', '海兔', 'seaAnimals', '海洋动物'],
    [82, '海洋', '海星', 'seaAnimals', '海洋动物'],
    [83, '海洋', '海胆', 'seaAnimals', '海洋动物'],
    [84, '海洋', '海螺', 'seaAnimals', '海洋动物'],
    [85, '海洋', '海豚', 'seaAnimals', '海洋动物'],
    [86, '海洋', '海贝', 'seaAnimals', '海洋动物'],
    [87, '海洋', '海马', 'seaAnimals', '海洋动物'],
    [88, '海洋', '海龟', 'seaAnimals', '海洋动物'],
    [89, '海洋', '猴子', 'seaAnimals', '海洋动物(分类存疑)'],
    [90, '海洋', '白鲸', 'seaAnimals', '海洋动物'],
    [91, '海洋', '章鱼', 'seaAnimals', '海洋动物'],
    [92, '海洋', '绵羊', 'seaAnimals', '海洋动物(分类存疑)'],
    [93, '海洋', '羊驼', 'seaAnimals', '海洋动物(分类存疑)'],
    [94, '海洋', '虎鲸', 'seaAnimals', '海洋动物'],
    [95, '海洋', '螃蟹', 'seaAnimals', '海洋动物'],
    [96, '海洋', '锦鲤', 'seaAnimals', '海洋动物'],
    [97, '海洋', '青蛙', 'seaAnimals', '海洋动物'],
    [98, '海洋', '鲨鱼', 'seaAnimals', '海洋动物'],
    [99, '海洋', '鹦鹉', 'seaAnimals', '海洋动物(分类存疑)'],
    [100, '海洋', '黄牛', 'seaAnimals', '海洋动物(分类存疑)'],
    [101, '海洋', '龙虾', 'seaAnimals', '海洋动物'],
    [102, '特殊', '黑洞', '-', '特殊消除元素'],
    [103, '特殊', '空位', '-', '空位占位'],
    [104, '特殊', '复活', '-', '复活道具'],
    [105, '特殊', '未知', '-', '未知/占位类型'],
];
writeCsv('11_fruit_element_names.csv',
    ['编号', '分类', '名称', '所属分包', '备注'], fruitRows);

// --- CSV 12: 模块结构表 ---
const moduleRows = [
    ['0', '@babel/runtime/helpers/Arrayincludes.js', '481', 'Babel运行时', 'Array.includes polyfill'],
    ['1', '@babel/runtime/helpers/Objectentries.js', '234', 'Babel运行时', 'Object.entries polyfill'],
    ['2', '@babel/runtime/helpers/arrayLikeToArray.js', '261', 'Babel运行时', '类数组转数组'],
    ['3', '@babel/runtime/helpers/createForOfIteratorHelper.js', '920', 'Babel运行时', 'for...of 辅助'],
    ['4', '@babel/runtime/helpers/defineProperty.js', '331', 'Babel运行时', 'Object.defineProperty 辅助'],
    ['5', '@babel/runtime/helpers/regeneratorRuntime.js', '6880', 'Babel运行时', 'async/await 运行时'],
    ['6', '@babel/runtime/helpers/toPrimitive.js', '444', 'Babel运行时', '转原始值'],
    ['7', '@babel/runtime/helpers/toPropertyKey.js', '299', 'Babel运行时', '转属性键'],
    ['8', '@babel/runtime/helpers/typeof.js', '382', 'Babel运行时', 'typeof 辅助'],
    ['9', '@babel/runtime/helpers/unsupportedIterableToArray.js', '552', 'Babel运行时', '不可迭代转数组'],
    ['10', 'application.js', '1710', '应用入口', '应用初始化'],
    ['11', 'assets/internal/index.js', '44930', '资源包', '内部资源索引'],
    ['12', 'assets/main/index.js', '429', '资源包', '主包索引'],
    ['13', 'assets/start-scene/index.js', '722420', '★核心玩法', '游戏主逻辑(含混淆)'],
    ['14', 'cocos-js/affine-transform.js', '1865', '引擎', '仿射变换'],
    ['15', 'cocos-js/animation-component-BnqP5StL.js', '69482', '引擎', '动画组件'],
    ['16', 'cocos-js/animation.js', '174694', '引擎', '动画系统'],
    ['17', 'cocos-js/box2d.release.asm-D6DRr2VU.js', '371980', '引擎', 'Box2D物理(WASM asm)'],
    ['18', 'cocos-js/box2d.release.wasm-BXZod5eD.js', '234', '引擎', 'Box2D WASM加载'],
    ['19', 'cocos-js/box2d.release.wasm-CHf_yir5.js', '31529', '引擎', 'Box2D WASM辅助'],
    ['20', 'cocos-js/cc.js', '2416', '引擎', 'CC命名空间'],
    ['21', 'cocos-js/collision-matrix-C-tmFF1b.js', '2108', '引擎', '碰撞矩阵'],
    ['22', 'cocos-js/custom-pipeline.js', '870', '引擎', '自定义渲染管线'],
    ['23', 'cocos-js/index-Xk0wdnHY.js', '196869', '引擎', '引擎主模块'],
    ['24', 'cocos-js/physics-2d-box2d-wasm.js', '36548', '引擎', '2D物理Box2D WASM'],
    ['25', 'cocos-js/physics-2d-framework-CVNkMl3f.js', '41390', '引擎', '2D物理框架'],
    ['26', 'cocos-js/physics-2d-framework.js', '1264', '引擎', '2D物理框架入口'],
    ['27', 'engine-adapter.js', '20397', '适配层', '引擎适配'],
    ['28', 'first-screen.js', '6195', '首屏', '首屏加载'],
    ['29', 'src/assets/md5/crypto-md5.js', '5461', '工具', 'MD5加密'],
    ['30', 'src/chunks/bundle.js', '4780', '系统', '打包块'],
    ['31', 'src/import-map.js', '3536', '系统', '导入映射'],
    ['32', 'src/polyfills.bundle.js', '8593', '系统', 'Polyfill'],
    ['33', 'src/system.bundle.js', '8672', '系统', 'SystemJS'],
    ['34', 'web-adapter.js', '88382', '适配层', 'Web适配'],
    ['35', 'game.js', '1643', '入口', '启动入口'],
];
writeCsv('12_module_structure.csv',
    ['序号', '模块名', '大小(字符)', '分类', '说明'], moduleRows);

console.log('\n=== 全部CSV生成完成 ===');
console.log(`输出目录: ${outDir}`);
