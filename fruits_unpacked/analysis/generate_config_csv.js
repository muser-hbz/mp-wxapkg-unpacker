// 生成所有已提取配置的 CSV（双行表头格式，与 analysis/excel/csv 一致）
const fs = require('fs');
const path = require('path');

const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');
const outDir = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis/cfg_csv';
fs.mkdirSync(outDir, { recursive: true });

// 解码 ro[] 表
function decodeRo(noStr) {
    const n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+./:;<=>?@[]^_`{|}~';
    const r = {};
    for (let i = 0; i < n.length; ++i) r[n[i]] = i;
    function e(t) {
        if (!t) return 0;
        const i = n.length; let e = 0, a = 1;
        for (let u = t.length - 1; u >= 0; u--) {
            if (r[t[u]] === undefined) return NaN;
            e += r[t[u]] * a; a *= i;
        }
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

// 解码 to[] 表
function Qs(t){const n=Array.from(t);for(let r=0,i=t.length-1;r<i;r++,i--){const e=n[r];n[r]=n[i];n[i]=e}return n.join('')}
const toTables={};
const qsPattern=/\$s=Qs\("/g;let qm;
while((qm=qsPattern.exec(content))!==null){
    const qsStart=qm.index+qm[0].length;let qi=qsStart;
    while(qi<content.length){if(content[qi]==='\\'){qi+=2;continue}if(content[qi]==='"')break;qi++}
    const rev=content.substring(qsStart,qi);
    const aq=content.substring(qi+1,qi+200);
    const am=aq.match(/^,(\d+)\),to\[(\d+)\]=\$s\.s\((\d+)\)/);
    if(am){const cs=parseInt(am[1]);const ti=parseInt(am[2]);
        let f;try{f=JSON.parse('"'+rev+'"')}catch(e){f=rev}
        const r=Qs(f);const ch=[];
        for(let i=0;i<r.length;i+=cs)ch.push(r.substring(i,i+cs));
        toTables[ti]=ch;
    }
}

// ========== 提取两组配置 ==========
// 第一组变量定义: e=ro, a=ro[15], u=ro[3], s=ro[24], o=ro[0], c=ro[9], f=ro[23], h=ro[22], v=ro[4], l=ro[16], b=ro[2], d=ro[19], k=ro[6], m=ro[1], p=ro[14], g=ro[18], y=ro[8], w=ro[20], M=ro[7]
const varDefs1 = {
    e: roArr, // e 是 ro 的别名
    a: roArr[15], u: roArr[3], s: roArr[24], o: roArr[0], c: roArr[9],
    f: roArr[23], h: roArr[22], v: roArr[4], l: roArr[16], b: roArr[2],
    d: roArr[19], k: roArr[6], m: roArr[1], p: roArr[14], g: roArr[18],
    y: roArr[8], w: roArr[20], M: roArr[7]
};

// 第二组变量定义（状态机 @ 674468）
const varDefs2 = {
    e: roArr[19], a: roArr[12], u: roArr[20], s: roArr[8], o: roArr[5],
    c: roArr[16], f: roArr[17], h: roArr[7], v: roArr[13], l: roArr[6],
    b: roArr[2], d: roArr[9], k: roArr[247], m: roArr[0], p: roArr[24],
    g: roArr[14], y: roArr[23], _: roArr[26], M: roArr[3], S: roArr[1],
    A: roArr[11], C: roArr[22], x: roArr[4], T: roArr[15], L: roArr[18],
    I: roArr[21], R: roArr[10]
};

// 提取所有 case
const casePattern = /case\s+(\S+?):n\[([^\]]+)\]=function/g;
const allConfigs = [];
let cm;
while ((cm = casePattern.exec(content)) !== null) {
    const casePos = cm.index;
    const condRaw = cm[1];
    const idxRaw = cm[2];
    const afterCase = content.substring(casePos, casePos + 600);
    const lengthMatch = afterCase.match(/\[n\[4\]\[1\]\]=([^,]+)/);
    const ratioMatch = afterCase.match(/t\[r\[1\]\]=([^,]+)/);
    const countMatch = afterCase.match(/t\[n\[10\]\[1\]\]=([^,]+)/);

    if (lengthMatch && ratioMatch && countMatch) {
        // 判断属于哪组（667000 之前是第一组，之后是第二组）
        const group = casePos < 674000 ? 1 : 2;
        const vd = group === 1 ? varDefs1 : varDefs2;

        // 解码 radius
        let radiusRaw = lengthMatch[1].trim();
        let radius = radiusRaw;
        const roM = radiusRaw.match(/^ro\[(\d+)\]$/);
        if (roM) radius = roArr[parseInt(roM[1])];
        else if (/^[\d.]+$/.test(radiusRaw)) radius = parseFloat(radiusRaw);
        else if (radiusRaw.includes('ro[')) {
            radius = radiusRaw.replace(/ro\[(\d+)\]/g, (m, i) => roArr[parseInt(i)] || 0);
        }

        // 解码 case 条件
        let cond;
        if (/^\d+$/.test(condRaw)) cond = parseInt(condRaw);
        else if (condRaw.startsWith('e[')) {
            const eIdx = parseInt(condRaw.match(/\[(\d+)\]/)[1]);
            cond = roArr[eIdx];
        }
        else if (vd[condRaw] !== undefined) cond = typeof vd[condRaw] === 'object' ? condRaw : vd[condRaw];
        else cond = condRaw;

        // 解码 scale（计算表达式）
        let scaleRaw = ratioMatch[1].trim();
        let scale = scaleRaw;
        if (/^[\d.]+$/.test(scaleRaw)) scale = parseFloat(scaleRaw);
        else if (scaleRaw.includes('*')) {
            try { scale = scaleRaw.replace(/ro\[(\d+)\]/g, (m, i) => roArr[parseInt(i)] || 0); } catch(e) {}
        }

        allConfigs.push({
            group, casePos, cond, condRaw, idxRaw,
            radius, radiusRaw,
            scale, scaleRaw,
            particleType: parseInt(countMatch[1].trim())
        });
    }
}

console.log(`共提取 ${allConfigs.length} 个配置项`);
console.log(`  第一组: ${allConfigs.filter(c => c.group === 1).length} 项`);
console.log(`  第二组: ${allConfigs.filter(c => c.group === 2).length} 项`);

// ========== 生成 CSV ==========
function writeCsv(filename, headers, cnHeaders, rows) {
    const csvPath = path.join(outDir, filename);
    let csv = '\ufeff';
    csv += headers.map(h => `"${h}"`).join(',') + '\r\n';
    csv += headers.map(h => `"${cnHeaders[h] || h}"`).join(',') + '\r\n';
    for (const row of rows) {
        csv += headers.map(h => {
            const v = row[h];
            return `"${v == null ? '' : v}"`;
        }).join(',') + '\r\n';
    }
    fs.writeFileSync(csvPath, csv, 'utf8');
    console.log(`生成: ${filename} (${rows.length} 行)`);
}

// 第一组配置 CSV
const group1 = allConfigs.filter(c => c.group === 1).sort((a, b) => {
    if (typeof a.cond === 'number' && typeof b.cond === 'number') return a.cond - b.cond;
    return String(a.cond).localeCompare(String(b.cond));
});
writeCsv('PhysicsConfig_small.csv',
    ['id', 'radius', 'scale', 'particleType'],
    { id: '编号', radius: '半径', scale: '缩放比例', particleType: '粒子类型' },
    group1.map(c => ({ id: c.cond, radius: c.radius, scale: c.scale, particleType: c.particleType }))
);

// 第二组配置 CSV
const group2 = allConfigs.filter(c => c.group === 2).sort((a, b) => {
    if (typeof a.cond === 'number' && typeof b.cond === 'number') return a.cond - b.cond;
    return String(a.cond).localeCompare(String(b.cond));
});
writeCsv('PhysicsConfig_large.csv',
    ['id', 'radius', 'scale', 'particleType'],
    { id: '编号', radius: '半径', scale: '缩放比例', particleType: '粒子类型' },
    group2.map(c => ({ id: c.cond, radius: c.radius, scale: c.scale, particleType: c.particleType }))
);

console.log('\n配置 CSV 已生成到:', outDir);
