// 搜索 game.js 中类似 ro[] 的 Base-85 编码数据块
// ro[] 格式: no='base85num,base85num,...'
// 寻找其他 var='...' 形式的长编码字符串
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

// Base-85 字符集（来自之前的解码）
const b85 = new Set('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+./:;<=>?@[]^_`{|}~'.split(''));

// 搜索模式: 变量名='长字符串' 或 变量名="长字符串"
// 关注那些字符串内容主要是 Base-85 字符 + 逗号的（编码数据）
const pattern = /(\w+)=(['"])([A-Za-z0-9!#$%&()*+.\/:;<=>?@\[\]^_`{|}~,]{500,})\2/g;
let m;
const found = [];
while ((m = pattern.exec(content)) !== null) {
    const varName = m[1];
    const data = m[3];
    // 统计逗号数量
    const commaCount = (data.match(/,/g) || []).length;
    // 检查是否是 Base-85 编码（逗号分隔的 token）
    const tokens = data.split(',');
    const avgLen = data.length / tokens.length;
    found.push({
        pos: m.index,
        varName,
        dataLen: data.length,
        commaCount,
        tokenCount: tokens.length,
        avgTokenLen: avgLen.toFixed(1),
        sample: data.substring(0, 100)
    });
}

found.sort((a, b) => b.dataLen - a.dataLen);
console.log(`\n=== 找到 ${found.length} 个 Base-85 编码数据块 ===\n`);
for (const f of found.slice(0, 15)) {
    console.log(`Pos ${f.pos} | var=${f.varName} | dataLen=${f.dataLen} | tokens=${f.tokenCount} | avgLen=${f.avgTokenLen}`);
    console.log(`  sample: ${f.sample}...`);
    console.log('');
}

// 也搜索 no= 这个已知的变量
const noIdx = content.indexOf("var no='");
if (noIdx >= 0) {
    console.log(`\n=== 已知 ro[] 表 (var no) 位置: ${noIdx} ===`);
}
