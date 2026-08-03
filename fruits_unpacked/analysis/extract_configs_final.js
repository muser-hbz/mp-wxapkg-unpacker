// Final comprehensive configuration extractor
// Searches for "]=function(){for(var t,n=to,r=ro," patterns and extracts all config data
const fs = require('fs');
const path = require('path');

const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');
const outDir = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// ========== Decode ro[] and to[] ==========
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

// Resolve a property reference like r[14], n[11][6], to[7][3] to a readable name
function resolvePropName(propStr, varMap) {
    // Try r[N] -> ro[N]
    let m = propStr.match(/^r\[(\d+)\]$/);
    if (m) return roVal(parseInt(m[1]));
    // Try n[N][M] -> to[N][M]
    m = propStr.match(/^n\[(\d+)\]\[(\d+)\]$/);
    if (m) return toName(parseInt(m[1]), parseInt(m[2]));
    // Try n[N] -> to[N] (array)
    m = propStr.match(/^n\[(\d+)\]$/);
    if (m) return `to[${m[1]}]`;
    // Try t[N][M] -> to[N][M] (t is sometimes used instead of n)
    m = propStr.match(/^t\[(\d+)\]\[(\d+)\]$/);
    if (m) return toName(parseInt(m[1]), parseInt(m[2]));
    // Try var[N] or var[N][M] using varMap
    m = propStr.match(/^(\w+)\[(\d+)\](?:\[(\d+)\])?$/);
    if (m && varMap && varMap[m[1]]) {
        const vt = varMap[m[1]];
        const idx1 = parseInt(m[2]);
        const idx2 = m[3] ? parseInt(m[3]) : null;
        if (vt.source === 'to') return idx2 !== null ? toName(vt.idx, idx2) : toName(vt.idx, idx1);
        else return roVal(vt.idx);
    }
    return propStr;
}

// ========== 1. Extract physics configs ==========
console.log('\n=== Extracting Physics Configs ===');
const physicsConfigs = [];
const physStartPattern = /case\s+(\S+?):n\[([^\]]+)\]=function\(\)\{var t,n=to,r=n\[3\];/g;
let pm;
while ((pm = physStartPattern.exec(content)) !== null) {
    const condRaw = pm[1].trim();
    const idxRaw = pm[2].trim();
    const afterMatch = content.substring(pm.index + pm[0].length, pm.index + pm[0].length + 1000);
    const breakIdx = afterMatch.indexOf('break;');
    const caseBody = breakIdx >= 0 ? afterMatch.substring(0, breakIdx) : afterMatch.substring(0, 500);
    const radiusMatch = caseBody.match(/\[n\[4\]\[1\]\]=([^,]+)/);
    const scaleMatch = caseBody.match(/t\[r\[1\]\]=([^,]+)/);
    const typeMatch = caseBody.match(/t\[n\[10\]\[1\]\]=([^,]+)/);
    if (radiusMatch && scaleMatch && typeMatch) {
        physicsConfigs.push({
            cond: condRaw, idx: idxRaw, pos: pm.index,
            radius: evalExpr(radiusMatch[1].trim()),
            scale: evalExpr(scaleMatch[1].trim()),
            particleType: evalExpr(typeMatch[1].trim())
        });
    }
}
console.log(`Found ${physicsConfigs.length} physics config entries`);

// ========== 2. Extract config objects from "]=function(){for(var t,n=to,r=ro," patterns ==========
console.log('\n=== Extracting Config Objects ===');
const configObjects = [];

const funcMarker = ']=function(){for(var t,n=to,r=ro,';
let searchPos = 0;
while (true) {
    const markerIdx = content.indexOf(funcMarker, searchPos);
    if (markerIdx < 0) break;
    searchPos = markerIdx + 1;

    // Look backwards to find the property name
    // The pattern is: PROP]=function(){for(var t,n=to,r=ro,
    // PROP can be: this[r[14]], this[n[9]], this[t[11][6]], this[n[14]], etc.
    // Or just: r[14], n[9], etc. (without this[)
    const beforeMarker = content.substring(Math.max(0, markerIdx - 100), markerIdx);

    // Find the start of the property reference
    // Look for "this[" or a variable name before the ]
    let propStart = -1;
    let propStr = '';

    const thisIdx = beforeMarker.lastIndexOf('this[');
    if (thisIdx >= 0 && thisIdx >= beforeMarker.length - 50) {
        // Found this[ within 50 chars of the marker
        propStart = Math.max(0, markerIdx - 100) + thisIdx;
        // Extract everything between this[ and the ]=function
        propStr = 'this[' + content.substring(propStart + 5, markerIdx) + ']';
    } else {
        // Not a this[ pattern - skip for now
        continue;
    }

    // Get var declarations after the marker
    const afterMarker = content.substring(markerIdx + funcMarker.length, markerIdx + funcMarker.length + 1000);
    const varDeclsStr = afterMarker.split(';')[0];

    // Parse variable declarations: i=n[11],e=n[9],a=n[7],u=n[8],s=n[6],o=r[0],c=r[37],f=r[24],h=r[23]
    const varMap = {};
    const varDeclRe = /(\w+)=([nr])\[(\d+)\]/g;
    let vdm;
    while ((vdm = varDeclRe.exec(varDeclsStr)) !== null) {
        varMap[vdm[1]] = { source: vdm[2] === 'n' ? 'to' : 'ro', idx: parseInt(vdm[3]) };
    }

    // Get function body
    const funcStart = propStart;
    const funcBody = content.substring(funcStart, Math.min(content.length, funcStart + 20000));

    // Find matching closing brace of the outer function
    let braceCount = 0;
    let funcEnd = funcBody.length;
    let inStr = false; let strCh = '';
    // Start from after "function(){"
    const funcBodyStart = funcBody.indexOf('function(){') + 11;
    for (let bi = funcBodyStart; bi < funcBody.length; bi++) {
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

    // Pattern D: ternary t[PROP]=VAL (in conditional expressions)
    const ternaryRe = /(?:\|\||:)\s*t\[([^\]]+)\]\s*=\s*([^;,)}]+)/g;
    while ((am = ternaryRe.exec(fullFunc)) !== null) {
        const propRaw = am[1].trim();
        const valRaw = am[2].trim();
        if (!assignments.some(a => a.propRaw === propRaw && a.valRaw === valRaw)) {
            assignments.push({ type: 'ternary', case: 'conditional', propRaw, valRaw });
        }
    }

    // Resolve property names and values
    const resolvedProps = [];
    const seen = new Set();
    for (const a of assignments) {
        const propName = resolvePropName(a.propRaw, varMap);

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
        // Extract the this[prop] name
        const propMatch = propStr.match(/^this\[(.+)\]$/);
        const innerProp = propMatch ? propMatch[1] : propStr;
        const configName = resolvePropName(innerProp, varMap);

        configObjects.push({
            pos: funcStart,
            configName: String(configName),
            thisProp: propStr,
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
    for (const p of c.props.slice(0, 30)) {
        console.log(`  ${p.prop} = ${p.val} ${p.case ? '(case ' + p.case + ')' : ''}`);
    }
    if (c.props.length > 30) console.log(`  ... and ${c.props.length - 30} more`);
}

// Save raw data
fs.writeFileSync(path.join(outDir, '_raw_physics_configs.json'), JSON.stringify(physicsConfigs, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, '_raw_config_objects.json'), JSON.stringify(configObjects.map(c => ({
    pos: c.pos, configName: c.configName, thisProp: c.thisProp, props: c.props
})), null, 2), 'utf8');
console.log('\nRaw data saved.');
