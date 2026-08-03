// 搜索 game.js 中配置定义模式：对象属性赋值引用 ro[] 常量
// 模式: Xn[to[K][i]]=ro[j] 或 Xn[to[K][i]]=数值
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

// 找到 assets/start-scene/index.js 模块范围
const modStart = content.indexOf('define("assets/start-scene/index.js"');
// 找下一个 define 或文件末尾
let modEnd = content.indexOf('define("', modStart + 10);
if (modEnd < 0) modEnd = content.length;

console.log(`Module range: ${modStart} - ${modEnd} (size: ${modEnd - modStart})`);
const modCode = content.substring(modStart, modEnd);

// 模式1: 变量[to[K][i]]=ro[j]  (配置属性赋值，值来自ro表)
const pattern1 = /(\w+)\[to\[(\d+)\]\[(\d+)\]\]\s*=\s*ro\[(\d+)\]/g;
// 模式2: 变量[to[K][i]]=数字
const pattern2 = /(\w+)\[to\[(\d+)\]\[(\d+)\]\]\s*=\s*(\d+(?:\.\d+)?)/g;
// 模式3: 变量[to[K][i]+to[K][j]...]=ro[j]  (拼接键名)
const pattern3 = /(\w+)\[to\[(\d+)\]\[(\d+)\]\+to\[(\d+)\]\[(\d+)\]\]\s*=\s*ro\[(\d+)\]/g;

const assignments = [];
let m;

// 收集模式1
while ((m = pattern1.exec(modCode)) !== null) {
    assignments.push({ type: 'ro', var: m[1], tk: m[2], ti: m[3], val: `ro[${m[4]}]`, pos: m.index });
}
// 收集模式2
while ((m = pattern2.exec(modCode)) !== null) {
    assignments.push({ type: 'num', var: m[1], tk: m[2], ti: m[3], val: m[4], pos: m.index });
}
// 收集模式3
while ((m = pattern3.exec(modCode)) !== null) {
    assignments.push({ type: 'concat', var: m[1], tk1: m[2], ti1: m[3], tk2: m[4], ti2: m[5], val: `ro[${m[6]}]`, pos: m.index });
}

console.log(`\n=== 找到 ${assignments.length} 个配置属性赋值 ===`);
// 按变量名分组统计
const byVar = {};
for (const a of assignments) {
    if (!byVar[a.var]) byVar[a.var] = [];
    byVar[a.var].push(a);
}
console.log(`\n=== 按变量名分组 (${Object.keys(byVar).length} 个变量) ===`);
for (const [v, arr] of Object.entries(byVar)) {
    if (arr.length >= 3) {  // 只显示有3个以上赋值的变量（可能是配置对象）
        console.log(`\n${v} (${arr.length} 个属性):`);
        for (const a of arr.slice(0, 20)) {
            console.log(`  [to[${a.tk}][${a.ti}]] = ${a.val}`);
        }
        if (arr.length > 20) console.log(`  ... 还有 ${arr.length - 20} 个`);
    }
}
