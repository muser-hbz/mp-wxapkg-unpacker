// 更健壮地提取状态机配置 - 分步解析
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

// 解码 ro[] 表
function decodeRo(noStr) {
    const n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+./:;<=>?@[]^_`{|}~';
    const r = {};
    for (let i = 0; i < n.length; ++i) r[n[i]] = i;
    function e(t) {
        const i = n.length; let e = 0, a = 1;
        for (let u = t.length - 1; u >= 0; u--) { e += r[t[u]] * a; a *= i; }
        return e;
    }
    const a = noStr.split(','); const u = Number(a[0]); const s = [];
    for (let o = 1; o < a.length; ++o) { s.push(e(a[o]) + u); }
    return s;
}
const noMarker = ";var no='";
const noStart = content.indexOf(noMarker) + noMarker.length;
let ni = noStart; while (content[ni] !== "'") ni++;
const roArr = decodeRo(content.substring(noStart, ni));

// 变量映射（从之前输出）
const varDefs = {
    e: 20, a: 32, u: 27, s: 26, o: 31, c: 18, f: 29, h: 28, v: 30, l: 21,
    b: 19, d: 14, k: 66, m: 13, p: 12, g: 23, y: 15, _: 36, M: 11, S: 22,
    A: 34, C: 16, x: 17, T: 24, L: 25, I: 33, R: 35
};

// 状态机区域
const smStart = 674468;
const region = content.substring(smStart, smStart + 12000);

// 分步提取：找所有 "case <cond>:n[<idx>]=function" 然后 "N=<next>;"
const casePattern = /case\s+(\S+?):n\[([^\]]+)\]=function/g;
let cm;
const configs = [];

while ((cm = casePattern.exec(region)) !== null) {
    const casePos = cm.index;
    const condRaw = cm[1].replace(/:$/, '');
    const idx = cm[2];

    // 从 case 位置开始，找 [n[4][1]]=<val>,t[r[1]]=<ratio>,t[n[10][1]]=<count>
    const afterCase = region.substring(casePos, casePos + 600);

    // [n[4][1]]=VALUE  (VALUE 可以是 ro[N], 数字, 或表达式)
    const lengthMatch = afterCase.match(/\[n\[4\]\[1\]\]\]=([^,]+)/);
    // t[r[1]]=RATIO
    const ratioMatch = afterCase.match(/t\[r\[1\]\]=([^,]+)/);
    // t[n[10][1]]=COUNT
    const countMatch = afterCase.match(/t\[n\[10\]\[1\]\]=([^,]+)/);
    // N=NEXT;
    const nextMatch = afterCase.match(/N=([^;]+);/);

    if (lengthMatch && ratioMatch && countMatch) {
        // 解码 length
        let lengthVal = lengthMatch[1].trim();
        let lengthDecoded = lengthVal;
        const roM = lengthVal.match(/^ro\[(\d+)\]$/);
        if (roM) lengthDecoded = roArr[parseInt(roM[1])];
        else if (/^[\d.]+$/.test(lengthVal)) lengthDecoded = parseFloat(lengthVal);
        else if (lengthVal.includes('ro[')) {
            // 表达式如 .65*ro[241]/2
            try { lengthDecoded = lengthVal; } catch(e) {}
        }

        // 解码 case 条件
        let condDecoded;
        if (/^\d+$/.test(condRaw)) condDecoded = parseInt(condRaw);
        else if (varDefs[condRaw] !== undefined) condDecoded = varDefs[condRaw];
        else condDecoded = condRaw;

        // 解码 next
        let nextRaw = nextMatch ? nextMatch[1].trim() : '?';
        let nextDecoded;
        if (/^\d+$/.test(nextRaw)) nextDecoded = parseInt(nextRaw);
        else if (varDefs[nextRaw] !== undefined) nextDecoded = varDefs[nextRaw];
        else nextDecoded = nextRaw;

        configs.push({
            casePos: smStart + casePos,
            cond: condDecoded, condRaw,
            idx,
            radius: lengthDecoded, radiusRaw: lengthVal,
            scale: ratioMatch[1].trim(),
            particleType: countMatch[1].trim(),
            next: nextDecoded, nextRaw
        });
    }
}

console.log(`=== 提取到 ${configs.length} 个配置项 ===\n`);
console.log('case条件 | n索引 | radius | scale | particleType | 下一状态');
console.log('-'.repeat(80));
for (const c of configs) {
    console.log(`${String(c.cond).padEnd(8)} | n[${c.idx.padEnd(3)}] | ${String(c.radius).padEnd(20)} | ${c.scale.padEnd(20)} | ${c.particleType.padEnd(5)} | next=${c.next}`);
}

// 按状态机执行顺序模拟（从初始状态开始）
console.log('\n\n=== 按状态机执行顺序排列 ===');
// 初始状态 N=w，但 w 不在 varDefs 中。让我查找 w 的定义
// 从代码: w 在变量定义中可能是某个 ro[] 值
// 实际上，初始状态可能需要从上下文找
// 先按 case 条件数值排序
const sorted = [...configs].sort((a, b) => {
    if (typeof a.cond === 'number' && typeof b.cond === 'number') return a.cond - b.cond;
    return String(a.cond).localeCompare(String(b.cond));
});
console.log('编号(case条件) | n索引 | radius | scale | particleType');
console.log('-'.repeat(70));
for (const c of sorted) {
    console.log(`${String(c.cond).padEnd(14)} | n[${c.idx.padEnd(3)}] | ${String(c.radius).padEnd(20)} | ${c.scale.padEnd(20)} | ${c.particleType}`);
}

fs.writeFileSync('d:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis/particle_config.json',
    JSON.stringify(configs, null, 2), 'utf8');
console.log(`\n保存到 particle_config.json`);
