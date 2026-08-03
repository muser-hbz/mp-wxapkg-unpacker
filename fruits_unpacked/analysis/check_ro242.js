// 检查 ro[242] 的解码问题，并生成所有配置的 CSV
const fs = require('fs');
const path = require('path');
const content = fs.readFileSync('d:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js', 'utf8');

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
    for (let o = 1; o < a.length; ++o) {
        const token = a[o];
        if (token === '') { s.push(NaN); continue; }
        s.push(e(token) + u);
    }
    return s;
}
const noMarker = ";var no='";
const noStart = content.indexOf(noMarker) + noMarker.length;
let ni = noStart; while (content[ni] !== "'") ni++;
const noStr = content.substring(noStart, ni);
const roArr = decodeRo(noStr);

// 检查 ro[242] 附近的原始 token
const tokens = noStr.split(',');
console.log('ro[] token count:', tokens.length - 1);
console.log('tokens[242] (raw):', JSON.stringify(tokens[242])); // 索引242 = tokens[243] (因为 tokens[0] 是基数)
console.log('tokens[243] (raw):', JSON.stringify(tokens[243]));
console.log('ro[240]:', roArr[240], '| ro[241]:', roArr[241], '| ro[242]:', roArr[242], '| ro[243]:', roArr[243]);
console.log('ro[244]:', roArr[244], '| ro[245]:', roArr[245], '| ro[246]:', roArr[246], '| ro[247]:', roArr[247]);
console.log('ro[248]:', roArr[248], '| ro[249]:', roArr[249], '| ro[250]:', roArr[250]);

// ro[242] 可能是空 token 或特殊值。让我查看原始 token
// tokens[0] 是基数 u, tokens[1] 对应 ro[0], ..., tokens[N+1] 对应 ro[N]
// 所以 ro[242] = tokens[243]
console.log('\nro[242] 对应 tokens[243]:', JSON.stringify(tokens[243]));
console.log('ro[243] 对应 tokens[244]:', JSON.stringify(tokens[244]));
