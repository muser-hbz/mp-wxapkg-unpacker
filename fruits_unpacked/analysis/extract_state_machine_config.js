// 提取 game.js 中状态机式 switch-case 的配置数据
// 每个 case 定义一个配置对象: {length: ro[N], 比例: float, 数量: int}
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

// 解码 ro[] 表
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
    for (let o = 1; o < a.length; ++o) { s.push(e(a[o]) + u); }
    return s;
}
const noMarker = ";var no='";
const noStart = content.indexOf(noMarker) + noMarker.length;
let ni = noStart;
while (content[ni] !== "'") ni++;
const roArr = decodeRo(content.substring(noStart, ni));

// 解码 to[] 表
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

// 字段名
const fieldName1 = toTables[4] ? toTables[4][1] : '?'; // to[4][1] = "length"
const fieldName2 = toTables[3] ? toTables[3][1] : '?'; // to[3][1] = "key"
const fieldName3 = toTables[10] ? toTables[10][1] : '?'; // to[10][1] = ?
console.log(`字段1: to[4][1] = "${fieldName1}"`);
console.log(`字段2: to[3][1] = "${fieldName2}"`);
console.log(`字段3: to[10][1] = "${fieldName3}"`);

// 找到配置函数区域 (this[i[142]]=function 或类似)
// 搜索 for(var t,n,r=to,i=ro,...D=0,N=w;D<i[104]; 模式
const stateMachinePattern = /for\(var t,n,r=to,i=ro,([^;]+);D<i\[(\d+)\];\)switch\(\+\+D,N\)/g;
let smMatch;
const configs = [];

while ((smMatch = stateMachinePattern.exec(content)) !== null) {
    const varDefsStr = smMatch[1];
    const limitIdx = parseInt(smMatch[2]);
    const limit = roArr[limitIdx];
    console.log(`\n=== 状态机 @ pos ${smMatch.index} | 循环上限 i[${limitIdx}]=${limit} ===`);
    console.log(`变量定义: ${varDefsStr.substring(0, 200)}...`);

    // 解析变量定义: e=i[19],a=i[12],u=i[20],...
    const varDefs = {};
    const varPattern = /(\w+)=i\[(\d+)\]/g;
    let vm;
    while ((vm = varPattern.exec(varDefsStr)) !== null) {
        varDefs[vm[1]] = roArr[parseInt(vm[2])];
    }
    console.log(`变量映射:`, varDefs);

    // 提取这个状态机区域的所有 case
    // 从 smMatch.index 开始，找到对应的代码块
    const regionStart = smMatch.index;
    // 找到这个函数的结束（大致搜索 5000 字符）
    const regionEnd = Math.min(content.length, regionStart + 8000);
    const region = content.substring(regionStart, regionEnd);

    // 提取 case 模式: case <cond>:n[<idx>]=function(){...}[n[4][1]]=<val>,t[r[1]]=<ratio>,t[n[10][1]]=<count>,t}[E](),N=<next>;
    const casePattern = /case\s+([^:]+):n\[(\d+)\]=function\(\)\{var t,n=to,r=n\[3\];return\(t=function\(\)\{[^}]+\}\[r\[0\]\]\(\)\)\[n\[4\]\[1\]\]\]=([^,]+),t\[r\[1\]\]=([^,]+),t\[n\[10\]\[1\]\]=([^,]+),t\}\[([^)]+)\]\(\),N=([^;]+);/g;
    let cm;
    let caseCount = 0;
    while ((cm = casePattern.exec(region)) !== null) {
        const condRaw = cm[1].trim();
        const idx = cm[2];
        const lengthVal = cm[3].trim();
        const ratioVal = cm[4].trim();
        const countVal = cm[5].trim();
        const funcName = cm[6];
        const nextRaw = cm[7].trim();

        // 解码 case 条件
        let condDecoded;
        if (/^\d+$/.test(condRaw)) {
            condDecoded = parseInt(condRaw);
        } else if (varDefs[condRaw] !== undefined) {
            condDecoded = varDefs[condRaw];
        } else {
            condDecoded = condRaw; // 变量名
        }

        // 解码 length 值
        let lengthDecoded = lengthVal;
        const roMatch = lengthVal.match(/^ro\[(\d+)\]/);
        if (roMatch) {
            lengthDecoded = roArr[parseInt(roMatch[1])];
        } else if (/^[\d.]+$/.test(lengthVal)) {
            lengthDecoded = parseFloat(lengthVal);
        }

        // 解码 next 状态
        let nextDecoded;
        if (/^\d+$/.test(nextRaw)) {
            nextDecoded = parseInt(nextRaw);
        } else if (varDefs[nextRaw] !== undefined) {
            nextDecoded = varDefs[nextRaw];
        } else {
            nextDecoded = nextRaw;
        }

        configs.push({
            smPos: smMatch.index,
            cond: condDecoded,
            condRaw,
            idx,
            length: lengthDecoded,
            lengthRaw: lengthVal,
            ratio: parseFloat(ratioVal),
            count: parseInt(countVal),
            funcName,
            next: nextDecoded,
            nextRaw
        });
        caseCount++;
    }
    console.log(`提取到 ${caseCount} 个 case`);
}

console.log(`\n\n=== 共提取 ${configs.length} 个配置项 ===\n`);
for (const c of configs) {
    console.log(`case ${c.cond} (raw:${c.condRaw}) | n[${c.idx}] | length=${c.length} (raw:${c.lengthRaw}) | ratio=${c.ratio} | count=${c.count} | next=${c.next} (raw:${c.nextRaw}) | func=${c.funcName}`);
}

// 保存到 JSON 供后续生成 CSV
const outDir = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis';
fs.writeFileSync(outDir + '/config_items_raw.json', JSON.stringify(configs, null, 2), 'utf8');
console.log(`\n原始数据已保存到 config_items_raw.json`);
