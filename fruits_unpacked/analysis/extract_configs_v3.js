// Comprehensive configuration extractor v3 - fixed patterns
const fs = require('fs');
const path = require('path');

const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');
const outDir = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// ========== Decode ro[] ==========
function decodeRo(noStr) {
    const n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+./:;<=>?@[]^_`{|}~';
    const r = {};
    for (let i = 0; i < n.length; ++i) r[n[i]] = i;
    function e(t) {
        const i = n.length; let e = 0, a = 1;
        for (let u = t.length - 1; u >= 0; u--) {
            if (r[t[u]] === undefined) return NaN;
            e += r[t[u]] * a; a *= i;
        }
        return e;
    }
    const a = noStr.split(','); const u = Number(a[0]); const s = [];
    for (let o = 1; o < a.length; ++o) { const val = e(a[o]); s.push(isNaN(val) ? 0 : val + u); }
    return s;
}
const noMarker = ";var no='";
const noStart = content.indexOf(noMarker) + noMarker.length;
let ni = noStart;
while (content[ni] !== "'") ni++;
const roArr = decodeRo(content.substring(noStart, ni));

// ========== Decode to[] ==========
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
console.log(`ro[]: ${roArr.length} elements, to[]: ${Object.keys(toTables).length} tables`);

// Helpers
function toName(t, s) { return toTables[t] && toTables[t][s] !== undefined ? toTables[t][s] : `to[${t}][${s}]`; }
function roVal(i) { return roArr[i] !== undefined ? roArr[i] : `ro[${i}]`; }
function evalExpr(expr) {
    if (typeof expr !== 'string') return expr;
    if (/^-?[\d.]+$/.test(expr)) return parseFloat(expr);
    const roM = expr.match(/^ro\[(\d+)\]$/);
    if (roM) return roVal(parseInt(roM[1]));
    if (/^[-\d.]+(?:[*/][-ro\d.\[\]]+)+$/.test(expr)) {
        try {
            const resolved = expr.replace(/ro\[(\d+)\]/g, (m, n) => roVal(parseInt(n)));
            return Math.round(eval(resolved) * 1000000) / 1000000;
        } catch(e) { return expr; }
    }
    return expr;
}

// ========== 1. Extract physics configs ==========
console.log('\n=== Extracting Physics Configs ===');
const physicsConfigs = [];
// Find all: case COND:n[ID]=function(){var t,n=to,r=n[3];
const physStartPattern = /case\s+(\S+?):n\[([^\]]+)\]=function\(\)\{var t,n=to,r=n\[3\];/g;
let pm;
while ((pm = physStartPattern.exec(content)) !== null) {
    const condRaw = pm[1].trim();
    const idxRaw = pm[2].trim();
    // Get the case body up to break;
    const afterMatch = content.substring(pm.index + pm[0].length, pm.index + pm[0].length + 1000);
    const breakIdx = afterMatch.indexOf('break;');
    const caseBody = breakIdx >= 0 ? afterMatch.substring(0, breakIdx) : afterMatch.substring(0, 500);

    // Extract values: [n[4][1]]=VAL, t[r[1]]=RATIO, t[n[10][1]]=TYPE
    const radiusMatch = caseBody.match(/\[n\[4\]\[1\]\]=([^,]+)/);
    const scaleMatch = caseBody.match(/t\[r\[1\]\]=([^,]+)/);
    const typeMatch = caseBody.match(/t\[n\[10\]\[1\]\]=([^,]+)/);

    if (radiusMatch && scaleMatch && typeMatch) {
        physicsConfigs.push({
            cond: condRaw,
            idx: idxRaw,
            pos: pm.index,
            radius: evalExpr(radiusMatch[1].trim()),
            radiusRaw: radiusMatch[1].trim(),
            scale: evalExpr(scaleMatch[1].trim()),
            scaleRaw: scaleMatch[1].trim(),
            particleType: evalExpr(typeMatch[1].trim()),
            particleTypeRaw: typeMatch[1].trim()
        });
    }
}
console.log(`Found ${physicsConfigs.length} physics config entries`);

// ========== 2. Extract config objects ==========
console.log('\n=== Extracting Config Objects ===');
const configObjects = [];
// Pattern: this[PROP]=function(){for(var t,n=to,r=ro,VARDECLS;
const configFuncPattern = /this\[([^\]]+)\]=function\(\)\{for\(var t,n=to,r=ro,([^;]+);/g;
let cm;
while ((cm = configFuncPattern.exec(content)) !== null) {
    const propRaw = cm[1];
    const varDeclsStr = cm[2];

    // Parse variable declarations: i=n[11],e=n[9],a=n[7],u=n[8],s=n[6],o=r[0],c=r[37],f=r[24],h=r[23]
    // n=to, r=ro
    const varMap = {}; // varName -> {source: 'to'|'ro', idx: N}
    const varDeclRe = /(\w+)=([nr])\[(\d+)\]/g;
    let vdm;
    while ((vdm = varDeclRe.exec(varDeclsStr)) !== null) {
        varMap[vdm[1]] = { source: vdm[2] === 'n' ? 'to' : 'ro', idx: parseInt(vdm[3]) };
    }

    // Get function body
    const funcStart = cm.index;
    const funcBody = content.substring(funcStart, Math.min(content.length, funcStart + 20000));

    // Find the matching closing brace
    let braceCount = 0;
    let funcEnd = funcBody.length;
    let inStr = false; let strCh = '';
    for (let bi = cm[0].length; bi < funcBody.length; bi++) {
        const ch = funcBody[bi];
        if (inStr) {
            if (ch === '\\') { bi++; continue; }
            if (ch === strCh) inStr = false;
            continue;
        }
        if (ch === '"' || ch === "'") { inStr = true; strCh = ch; continue; }
        if (ch === '{') braceCount++;
        if (ch === '}') { if (braceCount === 0) { funcEnd = bi; break; } braceCount--; }
    }
    const fullFunc = funcBody.substring(0, funcEnd + 1);

    // Extract all t[PROP]=VAL assignments
    const assignments = [];

    // Pattern A: case N:t[PROP]=VAL;break;
    const caseRe = /case\s+([^:]+):t\[([^\]]+)\]\s*=\s*([^;]+?);break/g;
    let am;
    while ((am = caseRe.exec(fullFunc)) !== null) {
        assignments.push({ type: 'case', case: am[1].trim(), propRaw: am[2].trim(), valRaw: am[3].trim() });
    }

    // Pattern B: if(N==l){t[PROP]=VAL;continue}
    const ifRe = /if\((\d+)==l\)\{t\[([^\]]+)\]\s*=\s*([^;]+?);continue\}/g;
    while ((am = ifRe.exec(fullFunc)) !== null) {
        assignments.push({ type: 'if', case: am[1], propRaw: am[2].trim(), valRaw: am[3].trim() });
    }

    // Pattern C: if(i[N]==l){t[PROP]=VAL;continue}
    const ifRoRe = /if\(i\[(\d+)\]==l\)\{t\[([^\]]+)\]\s*=\s*([^;]+?);continue\}/g;
    while ((am = ifRoRe.exec(fullFunc)) !== null) {
        assignments.push({ type: 'ifRo', case: `ro[${am[1]}]=${roVal(parseInt(am[1]))}`, propRaw: am[2].trim(), valRaw: am[3].trim() });
    }

    // Pattern D: Conditional ternary: i[N]!=l?i[M]!=l?...||(t[PROP]=VAL):t[PROP2]=VAL:t[PROP3]=VAL
    const ternaryRe = /(\w+)\[(\d+)\]!=l\?(\w+)\[(\d+)\]!=l\?(\w+)\[(\d+)\]!=l\?(\w+)\[(\d+)\]!=l\|\|\(t\[([^\]]+)\]\s*=\s*([^)]+)\):t\[([^\]]+)\]\s*=\s*([^)]+):t\[([^\]]+)\]\s*=\s*([^)]+):t\[([^\]]+)\]\s*=\s*([^)]+)/g;
    while ((am = ternaryRe.exec(fullFunc)) !== null) {
        // Complex ternary - extract all branches
        assignments.push({ type: 'ternary', case: 'conditional', propRaw: am[7].trim(), valRaw: am[8].trim() });
        assignments.push({ type: 'ternary', case: 'conditional', propRaw: am[9].trim(), valRaw: am[10].trim() });
        assignments.push({ type: 'ternary', case: 'conditional', propRaw: am[11].trim(), valRaw: am[12].trim() });
        assignments.push({ type: 'ternary', case: 'conditional', propRaw: am[13].trim(), valRaw: am[14].trim() });
    }

    // Resolve property names and values
    const resolvedProps = [];
    const seen = new Set();
    for (const a of assignments) {
        let propName = a.propRaw;
        const propMatch = a.propRaw.match(/^(\w+)\[(\d+)\](?:\[(\d+)\])?$/);
        if (propMatch) {
            const vn = propMatch[1];
            const idx1 = parseInt(propMatch[2]);
            const idx2 = propMatch[3] ? parseInt(propMatch[3]) : null;
            if (varMap[vn]) {
                const vt = varMap[vn];
                if (vt.source === 'to') {
                    propName = idx2 !== null ? toName(vt.idx, idx2) : toName(vt.idx, idx1);
                } else {
                    propName = roVal(vt.idx);
                }
            } else if (vn === 'n') {
                propName = idx2 !== null ? toName(idx1, idx2) : `to[${idx1}]`;
            } else if (vn === 'r') {
                propName = roVal(idx1);
            }
        }
        // Handle r[N][M] = to[N][M]
        const propMatch2 = a.propRaw.match(/^r\[(\d+)\]\[(\d+)\]$/);
        if (propMatch2) propName = toName(parseInt(propMatch2[1]), parseInt(propMatch2[2]));
        // Handle n[N][M] = to[N][M]
        const propMatch3 = a.propRaw.match(/^n\[(\d+)\]\[(\d+)\]$/);
        if (propMatch3) propName = toName(parseInt(propMatch3[1]), parseInt(propMatch3[2]));
        // Handle n[10][N] = to[10][N]
        const propMatch4 = a.propRaw.match(/^n\[(\d+)\]\[(\d+)\]$/);
        if (propMatch4) propName = toName(parseInt(propMatch4[1]), parseInt(propMatch4[2]));

        // Resolve value
        let val = evalExpr(a.valRaw);
        if (typeof val === 'string') {
            const valVarMatch = val.match(/^(\w+)$/);
            if (valVarMatch && varMap[valVarMatch[1]]) {
                const vt = varMap[valVarMatch[1]];
                val = vt.source === 'ro' ? roVal(vt.idx) : val;
            }
        }

        const key = `${propName}`;
        if (!seen.has(key)) {
            seen.add(key);
            resolvedProps.push({ case: a.case, prop: propName, propRaw: a.propRaw, val, valRaw: a.valRaw });
        }
    }

    if (resolvedProps.length >= 3) {
        // Resolve config name
        let configName = propRaw;
        const nameMatch = propRaw.match(/r\[(\d+)\]/);
        if (nameMatch) configName = roVal(parseInt(nameMatch[1]));
        const nameMatch2 = propRaw.match(/n\[(\d+)\]\[(\d+)\]/);
        if (nameMatch2) configName = toName(parseInt(nameMatch2[1]), parseInt(nameMatch2[2]));

        configObjects.push({
            pos: funcStart,
            configName: String(configName),
            thisProp: propRaw,
            varMap,
            props: resolvedProps
        });
    }
}
console.log(`Found ${configObjects.length} config objects`);

// ========== Print summary ==========
console.log('\n=== Config Objects Summary ===');
for (let i = 0; i < configObjects.length; i++) {
    const c = configObjects[i];
    console.log(`\n[${i}] name="${c.configName}" pos=${c.pos} props=${c.props.length}`);
    for (const p of c.props.slice(0, 25)) {
        console.log(`  ${p.prop} = ${p.val} ${p.case ? '(case ' + p.case + ')' : ''}`);
    }
    if (c.props.length > 25) console.log(`  ... and ${c.props.length - 25} more`);
}

// Save raw data
fs.writeFileSync(path.join(outDir, '_raw_physics_configs.json'), JSON.stringify(physicsConfigs, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, '_raw_config_objects.json'), JSON.stringify(configObjects.map(c => ({
    pos: c.pos, configName: c.configName, thisProp: c.thisProp, props: c.props
})), null, 2), 'utf8');
console.log(`\nRaw data saved.`);
