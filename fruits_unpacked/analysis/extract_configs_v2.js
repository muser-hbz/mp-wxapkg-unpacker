// Comprehensive configuration extractor v2 - fixed regex patterns
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

// Helper: resolve to[N][M] -> string name
function toName(tableIdx, subIdx) {
    if (toTables[tableIdx] && toTables[tableIdx][subIdx] !== undefined) return toTables[tableIdx][subIdx];
    return `to[${tableIdx}][${subIdx}]`;
}

// Helper: resolve ro[N] -> number
function roVal(idx) {
    return roArr[idx] !== undefined ? roArr[idx] : `ro[${idx}]`;
}

// Helper: evaluate expression
function evalExpr(expr) {
    if (typeof expr === 'number') return expr;
    if (typeof expr !== 'string') return expr;
    if (/^-?[\d.]+$/.test(expr)) return parseFloat(expr);
    // ro[N] reference
    const roM = expr.match(/^ro\[(\d+)\]$/);
    if (roM) return roVal(parseInt(roM[1]));
    // Simple arithmetic: .65*ro[93]/2, .77*.9*.695
    if (/^[-\d.]+(?:[*/][-ro\d.\[\]]+)+$/.test(expr)) {
        try {
            // Replace ro[N] with values
            const resolved = expr.replace(/ro\[(\d+)\]/g, (m, n) => roVal(parseInt(n)));
            const result = eval(resolved);
            return Math.round(result * 1000000) / 1000000;
        } catch(e) { return expr; }
    }
    return expr;
}

// ========== 1. Extract ALL physics configs (state machine case patterns) ==========
console.log('\n=== Extracting Physics Configs ===');
const physicsConfigs = [];
// Pattern: case COND:n[ID]=function(){var t,n=to,r=n[3];...}[r[0]]())[n[4][1]]=RADIUS,t[r[1]]=SCALE,t[n[10][1]]=TYPE,t}[VAR]();break;
const physCasePattern = /case\s+(\S+?):n\[([^\]]+)\]=function\(\)\{var t,n=to,r=n\[3\];return\(t=function\(\)\{[^}]*\}\[r\[0\]\]\(\)\)\[n\[4\]\[1\]\]=([^,]+),t\[r\[1\]\]=([^,]+),t\[n\[10\]\[1\]\]=([^,]+),t\}/g;
let pm;
while ((pm = physCasePattern.exec(content)) !== null) {
    const condRaw = pm[1].trim();
    const idxRaw = pm[2].trim();
    const radiusRaw = pm[3].trim();
    const scaleRaw = pm[4].trim();
    const typeRaw = pm[5].trim();

    physicsConfigs.push({
        cond: condRaw,
        idx: idxRaw,
        radius: evalExpr(radiusRaw),
        radiusRaw,
        scale: evalExpr(scaleRaw),
        scaleRaw,
        particleType: evalExpr(typeRaw),
        particleTypeRaw: typeRaw,
        pos: pm.index
    });
}
console.log(`Found ${physicsConfigs.length} physics config entries`);

// ========== 2. Extract config objects (this[...]=function with for-loop) ==========
console.log('\n=== Extracting Config Objects ===');
const configObjects = [];
// Pattern: this[PROP]=function(){for(var t,n,r=to,r=ro,VARDECLS;VARPRE;...){switch(...){case N:t[PROP]=VAL;break;...}}
// Or: this[PROP]=function(){var t,n,r=to,i=ro,VARDECLS;...for(var V=0,L=ARR;V<L.length;V++){switch(L[V]){...}}
const configFuncPattern = /this\[([^\]]+)\]=function\(\)\{(?:for\(var|var) t,n,r=to,r=ro,([^;]+);/g;
let cm;
while ((cm = configFuncPattern.exec(content)) !== null) {
    const propName = cm[1];
    const varDeclsStr = cm[2];

    // Parse variable declarations: i=n[11],e=n[9],a=n[7],u=n[8],s=n[6],o=r[0],c=r[37],...
    const varMap = {}; // varName -> {source: 'to'|'ro', idx: N, subIdx: M|null}
    // r=to, so r[N] = to[N], r[N][M] = to[N][M]
    // r=ro (overridden), so r[N] = ro[N]
    // n=to (from r=to initially, but n is declared as var, so n is undefined unless assigned)
    // Actually: r=to,r=ro means r is first assigned to, then to ro. So r=ro.
    // But n is not assigned in the var declaration. n might be assigned later or from outer scope.
    // Wait - looking at the actual code: "var t,n,r=to,r=ro,i=n[11],..."
    // n is undefined here! Unless... this is inside a function where n is a parameter or outer var.
    // Actually, looking more carefully at the pattern, it seems like:
    // r=to first (so r points to to[]), then r=ro (r is reassigned to ro[])
    // But i=n[11] uses n, which was set to to from the first r=to... no, n is a separate variable.
    //
    // Actually I think the pattern is: r=to (r is to), then immediately r=ro (r is reassigned to ro)
    // But n is never assigned! Unless n comes from outer scope.
    //
    // Looking at SM#7 context: "this[r[14]]=function(){for(var t,n,r=to,r=ro,i=n[11],e=n[9],..."
    // Here, the outer function has "r=to" so inside the for loop, n is still from the outer scope.
    // Wait, no - "var t,n" declares n as a local variable. It would be undefined.
    //
    // I think the key insight is that "r=to,r=ro" is actually "r=to" followed by ",r=ro" as a
    // comma expression, not two separate declarations. In JavaScript:
    // var t, n, r=to, r=ro, i=n[11]
    // This declares: t=undefined, n=undefined, r=to (then r=ro, last wins), i=n[11] (n is undefined!)
    //
    // But that would make i=n[11] throw an error. Unless n is NOT undefined...
    // Actually, in strict mode, accessing undefined.n would throw. But in non-strict mode, it also throws.
    //
    // I think the actual code might be different from what I'm reading. Let me look at the raw bytes.

    // Actually, let me just look at the context and extract the patterns empirically.
    // The key is to find t[PROP]=VAL patterns within the function body.

    // Get function body (up to 20000 chars)
    const funcStart = cm.index;
    const funcBody = content.substring(funcStart, Math.min(content.length, funcStart + 20000));

    // Find the matching closing brace of the function
    let braceCount = 0;
    let funcEnd = -1;
    let inString = false;
    let stringChar = '';
    for (let bi = cm.index + cm[0].length; bi < funcBody.length && bi < funcStart + 20000; bi++) {
        const ch = funcBody[bi];
        if (inString) {
            if (ch === '\\') { bi++; continue; }
            if (ch === stringChar) inString = false;
            continue;
        }
        if (ch === '"' || ch === "'") { inString = true; stringChar = ch; continue; }
        if (ch === '{') braceCount++;
        if (ch === '}') {
            if (braceCount === 0) { funcEnd = bi; break; }
            braceCount--;
        }
    }

    const fullFunc = funcEnd > 0 ? funcBody.substring(0, funcEnd + 1) : funcBody.substring(0, 15000);

    // Parse variable declarations more carefully
    // Pattern: i=n[11],e=n[9],a=n[7],u=n[8],s=n[6],o=r[0],c=r[37],f=r[24],h=r[23]
    // Here n is from the outer scope where n=to, and r=ro (after r=to,r=ro)
    // But wait - r=to first, so when we see i=n[11], n hasn't been assigned yet...
    // Unless n is assigned to `to` somewhere in the outer scope.

    // Let me just look at the outer context to find what n and r are
    const outerContext = content.substring(Math.max(0, funcStart - 500), funcStart);

    // In the outer context, find n=to or n=ro pattern
    const nAssign = outerContext.match(/n=to(?=\W)/);
    const rAssign = outerContext.match(/r=to(?=\W)/);

    // Actually, let me look at the full var declaration including the function signature
    // The pattern is: this[PROP]=function(){for(var t,n,r=to,r=ro,i=n[11],e=n[9],...)
    // OR: this[PROP]=function(){var t,n,r=to,i=ro,e=n[11],...)
    //
    // In the first case: r=to then r=ro (r=ro wins), n is from outer scope (n=to)
    // In the second case: r=to, i=ro, n is from outer scope (n=to)
    //
    // Actually, I think the key is that the OUTER function (enclosing this) has:
    // function(VAR){var t,n,r=to,i=ro,...; ... this[PROP]=function(){for(var t,n,r=to,r=ro,...)
    // So the inner function redeclares t,n,r but the n=to from the outer scope is shadowed.
    //
    // But wait - "var t,n,r=to,r=ro" means n is declared as undefined in the inner scope.
    // Then i=n[11] would fail...
    //
    // Unless the code is actually: "var t,n,r=to,i=ro,r=n[11]" (no, that doesn't make sense either)
    //
    // Let me just look at the raw code to see the actual pattern.

    // For now, let's extract the t[PROP]=VAL patterns and try to resolve them
    const assignments = [];

    // Pattern 1: case N:t[PROP]=VAL;break;
    const caseAssignPattern = /case\s+([^:]+):t\[([^\]]+)\]\s*=\s*([^;]+?);break/g;
    let am;
    while ((am = caseAssignPattern.exec(fullFunc)) !== null) {
        const caseVal = am[1].trim();
        const propRaw = am[2].trim();
        const valRaw = am[3].trim();
        assignments.push({ type: 'case', case: caseVal, propRaw, valRaw });
    }

    // Pattern 2: if(N==l){t[PROP]=VAL;continue}
    const ifAssignPattern = /if\((\d+)==l\)\{t\[([^\]]+)\]\s*=\s*([^;]+?);continue\}/g;
    while ((am = ifAssignPattern.exec(fullFunc)) !== null) {
        assignments.push({ type: 'if', case: am[1], propRaw: am[2].trim(), valRaw: am[3].trim() });
    }

    // Pattern 3: if(i[N]==l){t[PROP]=VAL;continue}
    const ifRoAssignPattern = /if\(i\[(\d+)\]==l\)\{t\[([^\]]+)\]\s*=\s*([^;]+?);continue\}/g;
    while ((am = ifRoAssignPattern.exec(fullFunc)) !== null) {
        assignments.push({ type: 'ifRo', case: `ro[${am[1]}]=${roVal(parseInt(am[1]))}`, propRaw: am[2].trim(), valRaw: am[3].trim() });
    }

    // Pattern 4: Direct assignments t[PROP]=VAL (not in case/if)
    const directAssignPattern = /(?:^|[;{])t\[([^\]]+)\]\s*=\s*([^;,}]+)/g;
    while ((am = directAssignPattern.exec(fullFunc)) !== null) {
        const propRaw = am[1].trim();
        const valRaw = am[2].trim();
        // Skip if already captured in case/if
        if (!assignments.some(a => a.propRaw === propRaw && a.valRaw === valRaw)) {
            assignments.push({ type: 'direct', case: '', propRaw, valRaw });
        }
    }

    // Now resolve property names and values
    // We need to know the var mappings. Let's parse them from the function body.
    // The var declaration is: r=to,r=ro,i=n[11],e=n[9],a=n[7],u=n[8],s=n[6],o=r[0],c=r[37],f=r[24],h=r[23]
    // Where:
    // - r=ro (after r=to,r=ro), so r[N] = ro[N]
    // - n=to (from outer scope), so n[N] = to[N], n[N][M] = to[N][M]
    // - i=n[11] means i=to[11], so i[N] = to[11][N]
    // - e=n[9] means e=to[9], so e[N] = to[9][N]
    // - a=n[7] means a=to[7], so a[N] = to[7][N]
    // - u=n[8] means u=to[8], so u[N] = to[8][N]
    // - s=n[6] means s=to[6], so s[N] = to[6][N]
    // - o=r[0] means o=ro[0]
    // - c=r[37] means c=ro[37]
    // - f=r[24] means f=ro[24]
    // - h=r[23] means h=ro[23]

    const varToTable = {}; // varName -> {tableType: 'to'|'ro', tableIdx: N}
    // Parse: varName=n[tableIdx] or varName=r[tableIdx]
    const varDeclRe = /(\w+)=([nr])\[(\d+)\]/g;
    let vdm;
    while ((vdm = varDeclRe.exec(varDeclsStr)) !== null) {
        const vn = vdm[1];
        const source = vdm[2]; // n=to, r=ro (after r=to,r=ro)
        const tIdx = parseInt(vdm[3]);
        varToTable[vn] = { source, tableIdx: tIdx };
    }

    // Also check the broader function context for more var declarations
    const broaderVarDecl = /(\w+)=([nr])\[(\d+)\]/g;
    while ((vdm = broaderVarDecl.exec(fullFunc.substring(0, 2000))) !== null) {
        const vn = vdm[1];
        const source = vdm[2];
        const tIdx = parseInt(vdm[3]);
        if (!varToTable[vn]) {
            varToTable[vn] = { source, tableIdx: tIdx };
        }
    }

    // Resolve assignments
    const resolvedProps = [];
    for (const a of assignments) {
        // Resolve property name
        let propName = a.propRaw;
        const propMatch = a.propRaw.match(/^(\w+)\[(\d+)\](?:\[(\d+)\])?$/);
        if (propMatch) {
            const vn = propMatch[1];
            const idx1 = parseInt(propMatch[2]);
            const idx2 = propMatch[3] ? parseInt(propMatch[3]) : null;

            if (varToTable[vn]) {
                const vt = varToTable[vn];
                if (vt.source === 'n') {
                    // n=to, so vn=to[vt.tableIdx], and prop=vn[idx1] or vn[idx1][idx2]
                    if (idx2 !== null) {
                        propName = toName(vt.tableIdx, idx2);
                    } else {
                        propName = toName(vt.tableIdx, idx1);
                    }
                } else if (vt.source === 'r') {
                    // r=ro, so vn=ro[vt.tableIdx], and prop=vn[idx1] = ro[vt.tableIdx]
                    // This would be a numeric index, not a string property
                    propName = `ro[${vt.tableIdx}]`;
                }
            } else if (vn === 'n' || vn === 'r') {
                // Direct n[N] or r[N] reference
                if (vn === 'n') {
                    // n=to, n[N][M] = to[N][M], n[N] is to[N] (an array)
                    if (idx2 !== null) {
                        propName = toName(idx1, idx2);
                    } else {
                        propName = `to[${idx1}]`;
                    }
                } else {
                    // r=ro, r[N] = ro[N]
                    propName = roVal(idx1);
                }
            } else if (vn === 'i') {
                // i=ro
                propName = roVal(idx1);
            }
        }

        // Also handle r[N][M] pattern (to[N][M])
        const propMatch2 = a.propRaw.match(/^r\[(\d+)\]\[(\d+)\]$/);
        if (propMatch2) {
            propName = toName(parseInt(propMatch2[1]), parseInt(propMatch2[2]));
        }

        // Resolve value
        let val = evalExpr(a.valRaw);
        // Also handle variable references in values
        if (typeof val === 'string') {
            const valVarMatch = val.match(/^(\w+)$/);
            if (valVarMatch && varToTable[valVarMatch[1]]) {
                const vt = varToTable[valVarMatch[1]];
                if (vt.source === 'r') {
                    val = roVal(vt.tableIdx);
                }
            }
        }

        resolvedProps.push({
            case: a.case,
            prop: propName,
            propRaw: a.propRaw,
            val: val,
            valRaw: a.valRaw
        });
    }

    if (resolvedProps.length >= 3) {
        // Also resolve the this[prop] name
        let configName = propName;
        const nameMatch = propName.match(/r\[(\d+)\]/);
        if (nameMatch) {
            configName = roVal(parseInt(nameMatch[1]));
        }
        const nameMatch2 = propName.match(/n\[(\d+)\]\[(\d+)\]/);
        if (nameMatch2) {
            configName = toName(parseInt(nameMatch2[1]), parseInt(nameMatch2[2]));
        }

        configObjects.push({
            pos: funcStart,
            configName: String(configName),
            thisProp: propName,
            varMap: varToTable,
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
    for (const p of c.props.slice(0, 20)) {
        console.log(`  ${p.prop} = ${p.val} ${p.case ? '(case ' + p.case + ')' : ''} [raw: ${p.propRaw}=${p.valRaw}]`);
    }
    if (c.props.length > 20) console.log(`  ... and ${c.props.length - 20} more`);
}

// ========== Save raw data ==========
fs.writeFileSync(path.join(outDir, '_raw_physics_configs.json'), JSON.stringify(physicsConfigs, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, '_raw_config_objects.json'), JSON.stringify(configObjects.map(c => ({
    pos: c.pos,
    configName: c.configName,
    thisProp: c.thisProp,
    props: c.props
})), null, 2), 'utf8');
console.log(`\nRaw data saved to ${outDir}/_raw_*.json`);
