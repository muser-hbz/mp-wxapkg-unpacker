// 搜索所有 ]=ro[ 赋值，分析是否集中存在配置定义区域
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

// 搜索所有 ]=ro[ 模式
const pattern = /\]\s*=\s*ro\[(\d+)\]/g;
const refs = [];
let m;
while ((m = pattern.exec(content)) !== null) {
    const pos = m.index;
    const roIdx = parseInt(m[1]);
    // 获取左侧（往前看30字符）
    const lhsStart = Math.max(0, pos - 40);
    const lhs = content.substring(lhsStart, pos + 1);
    refs.push({ pos, roIdx, val: roArr[roIdx], lhs });
}

console.log(`=== 共 ${refs.length} 个 ]=ro[N] 赋值 ===\n`);

// 按位置排序，看是否集中
refs.sort((a, b) => a.pos - b.pos);

// 找出密度最高的区域（每5000字符内的赋值数）
console.log('=== 赋值密度分布（每5000字符） ===');
const density = {};
for (const r of refs) {
    const bucket = Math.floor(r.pos / 5000);
    if (!density[bucket]) density[bucket] = 0;
    density[bucket]++;
}
const denseBuckets = Object.entries(density).sort((a, b) => b[1] - a[1]).slice(0, 10);
for (const [bucket, count] of denseBuckets) {
    console.log(`  位置 ${parseInt(bucket) * 5000}-${parseInt(bucket) * 5000 + 5000}: ${count} 个赋值`);
}

// 显示密度最高区域的详细赋值
if (denseBuckets.length > 0) {
    const topBucket = parseInt(denseBuckets[0][0]);
    const rangeStart = topBucket * 5000;
    const rangeEnd = rangeStart + 5000;
    console.log(`\n=== 密度最高区域 (${rangeStart}-${rangeEnd}) 的赋值 ===`);
    for (const r of refs) {
        if (r.pos >= rangeStart && r.pos < rangeEnd) {
            console.log(`  pos=${r.pos} | lhs: ...${r.lhs}] | = ro[${r.roIdx}] (=${r.val})`);
        }
    }
}

// 也显示前30个赋值
console.log(`\n=== 前30个 ]=ro[N] 赋值 ===`);
for (const r of refs.slice(0, 30)) {
    console.log(`  pos=${r.pos} | lhs: ...${r.lhs}] | = ro[${r.roIdx}] (=${r.val})`);
}
