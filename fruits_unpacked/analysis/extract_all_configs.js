// 在完整 content 上提取所有 case 配置数据
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

// 找所有状态机区域及其变量定义
const smPattern = /for\(var t,n,r=to,i=ro,([^;]+);D<i\[(\d+)\];\)switch\(\+\+D,N\)/g;
const stateMachines = [];
let smm;
while ((smm = smPattern.exec(content)) !== null) {
    const varDefsStr = smm[1];
    const limitIdx = parseInt(smm[2]);
    const varDefs = {};
    const vp = /(\w+)=i\[(\d+)\]/g;
    let vm;
    while ((vm = vp.exec(varDefsStr)) !== null) {
        varDefs[vm[1]] = roArr[parseInt(vm[2])];
    }
    stateMachines.push({ pos: smm.index, limit: roArr[limitIdx], varDefs });
    console.log(`状态机 @ ${smm.index} | 上限=${roArr[limitIdx]} | 变量数=${Object.keys(varDefs).length}`);
}
console.log(`共 ${stateMachines.length} 个状态机\n`);

// 提取所有 case
const casePattern = /case\s+(\S+?):n\[([^\]]+)\]=function/g;
const allConfigs = [];
let cm;
while ((cm = casePattern.exec(content)) !== null) {
    const casePos = cm.index;
    const condRaw = cm[1];
    const idxRaw = cm[2];

    // 找到最近的状态机
    let sm = null;
    for (const s of stateMachines) {
        if (s.pos < casePos && (!sm || s.pos > sm.pos)) sm = s;
    }

    const afterCase = content.substring(casePos, casePos + 600);
    const lengthMatch = afterCase.match(/\[n\[4\]\[1\]\]=([^,]+)/);
    const ratioMatch = afterCase.match(/t\[r\[1\]\]=([^,]+)/);
    const countMatch = afterCase.match(/t\[n\[10\]\[1\]\]=([^,]+)/);
    const nextMatch = afterCase.match(/N=([^;]+);/);

    if (lengthMatch && ratioMatch && countMatch) {
        // 解码 radius
        let radiusRaw = lengthMatch[1].trim();
        let radius = radiusRaw;
        const roM = radiusRaw.match(/^ro\[(\d+)\]$/);
        if (roM) radius = roArr[parseInt(roM[1])];
        else if (/^[\d.]+$/.test(radiusRaw)) radius = parseFloat(radiusRaw);
        else {
            // 表达式，尝试计算
            try { radius = radiusRaw.replace(/ro\[(\d+)\]/g, (m, i) => roArr[parseInt(i)]); } catch(e) {}
        }

        // 解码 case 条件
        let cond;
        if (/^\d+$/.test(condRaw)) cond = parseInt(condRaw);
        else if (sm && sm.varDefs[condRaw] !== undefined) cond = sm.varDefs[condRaw];
        else cond = condRaw;

        // 解码 next
        let nextRaw = nextMatch ? nextMatch[1].trim() : '?';
        let next;
        if (/^\d+$/.test(nextRaw)) next = parseInt(nextRaw);
        else if (sm && sm.varDefs[nextRaw] !== undefined) next = sm.varDefs[nextRaw];
        else next = nextRaw;

        allConfigs.push({
            pos: casePos,
            smPos: sm ? sm.pos : -1,
            cond, condRaw, idxRaw,
            radius, radiusRaw,
            scale: ratioMatch[1].trim(),
            particleType: countMatch[1].trim(),
            next, nextRaw
        });
    }
}

console.log(`=== 共提取 ${allConfigs.length} 个配置项 ===\n`);

// 按状态机分组
const bySM = {};
for (const c of allConfigs) {
    const key = c.smPos;
    if (!bySM[key]) bySM[key] = [];
    bySM[key].push(c);
}

for (const [smPos, configs] of Object.entries(bySM)) {
    console.log(`\n=== 状态机 @ ${smPos} (${configs.length} 项) ===`);
    console.log('case条件 | n索引 | radius | scale | particleType | next');
    for (const c of configs) {
        console.log(`  ${String(c.cond).padEnd(8)} | n[${c.idxRaw.padEnd(3)}] | ${String(c.radius).padEnd(18)} | ${c.scale.padEnd(18)} | ${c.particleType.padEnd(5)} | ${c.next}`);
    }
}

fs.writeFileSync('d:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis/all_particle_configs.json',
    JSON.stringify(allConfigs, null, 2), 'utf8');
console.log(`\n保存到 all_particle_configs.json`);
