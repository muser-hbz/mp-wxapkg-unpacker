// Comprehensive configuration extractor for game.js
// Extracts ALL configuration data from obfuscated state machines and config definitions
// Outputs CSV files matching the reference format in analysis/excel/csv/

const fs = require('fs');
const path = require('path');

const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');
const outDir = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv';

// Ensure output directory exists
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// ========== 1. Decode ro[] numeric constant table ==========
function decodeRo(noStr) {
    const n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+./:;<=>?@[]^_`{|}~';
    const r = {};
    for (let i = 0; i < n.length; ++i) r[n[i]] = i;
    function e(t) {
        const i = n.length;
        let e = 0, a = 1;
        for (let u = t.length - 1; u >= 0; u--) {
            if (r[t[u]] === undefined) return NaN;
            e += r[t[u]] * a; a *= i;
        }
        return e;
    }
    const a = noStr.split(',');
    const u = Number(a[0]);
    const s = [];
    for (let o = 1; o < a.length; ++o) {
        const val = e(a[o]);
        s.push(isNaN(val) ? 0 : val + u);
    }
    return s;
}
const noMarker = ";var no='";
const noStart = content.indexOf(noMarker) + noMarker.length;
let ni = noStart;
while (content[ni] !== "'") ni++;
const roArr = decodeRo(content.substring(noStart, ni));
console.log(`ro[] decoded: ${roArr.length} elements`);

// ========== 2. Decode to[] string tables ==========
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
console.log(`to[] decoded: ${Object.keys(toTables).length} tables`);

// Helper: resolve a to[][] reference string to actual name
function resolveToRef(refStr) {
    // Patterns: r[3][1], n[4][1], to[3][1], e[5], a[3], etc.
    // First check if it's a direct to[N][M] reference
    let m = refStr.match(/^to\[(\d+)\]\[(\d+)\]$/);
    if (m) {
        const t = parseInt(m[1]), s = parseInt(m[2]);
        return toTables[t] && toTables[t][s] !== undefined ? toTables[t][s] : refStr;
    }
    return refStr;
}

// Helper: resolve ro[N] reference to value
function resolveRoVal(refStr) {
    const m = refStr.match(/^ro\[(\d+)\]$/);
    if (m) {
        const idx = parseInt(m[1]);
        return roArr[idx] !== undefined ? roArr[idx] : refStr;
    }
    return refStr;
}

// Helper: evaluate simple arithmetic expressions like .77*.9*.695
function evalExpr(expr) {
    if (typeof expr === 'number') return expr;
    if (/^[\d.]+$/.test(expr)) return parseFloat(expr);
    // Try to evaluate simple multiplication/division
    if (/^[\d.]+(?:[*/][\d.]+)+$/.test(expr)) {
        try { return eval(expr); } catch(e) { return expr; }
    }
    return expr;
}

// ========== 3. Extract physics config from state machine cases ==========
// Pattern: case N:n[idx]=function(){var t,n=to,r=n[3];return(t=function(){...}[r[0]]())[n[4][1]]=VAL,t[r[1]]=RATIO,t[n[10][1]]=COUNT,t}[S]();break;
function extractPhysicsConfigs() {
    const configs = [];
    const casePattern = /case\s+(\S+?):n\[([^\]]+)\]=function\(\)\{var t,n=to,r=n\[3\];return\(t=function\(\)\{var t,n,r=to,i=r\[4\]\[1\],e=r\[3\]\[1\],a=r\[10\]\[1\];return Pu\(t=\{\},i,0\),Pu\(t,e,0\),Pu\(t,a,0\),\(n=t\)\[i\]=0,n\[e\]=0,n\[a\]=0,n\}\[r\[0\]\]\(\)\)\[n\[4\]\[1\]\]\]=([^,]+),t\[r\[1\]\]=([^,]+),t\[n\[10\]\[1\]\]\]=([^,]+),t\}\[([^\]]+)\]\(\);break/g;
    let cm;
    while ((cm = casePattern.exec(content)) !== null) {
        const condRaw = cm[1].trim();
        const idx = cm[2];
        const radiusRaw = cm[3].trim();
        const scaleRaw = cm[4].trim();
        const typeRaw = cm[5].trim();

        // Decode radius
        let radius = radiusRaw;
        const roM = radiusRaw.match(/^ro\[(\d+)\]$/);
        if (roM) radius = roArr[parseInt(roM[1])];
        else if (/^[\d.]+$/.test(radiusRaw)) radius = parseFloat(radiusRaw);

        // Decode scale
        let scale = evalExpr(scaleRaw);

        // Decode particleType
        let pType = typeRaw;
        const ptM = typeRaw.match(/^ro\[(\d+)\]$/);
        if (ptM) pType = roArr[parseInt(ptM[1])];
        else if (/^\d+$/.test(typeRaw)) pType = parseInt(typeRaw);

        configs.push({
            cond: condRaw,
            idx: idx,
            radius: radius,
            radiusRaw: radiusRaw,
            scale: typeof scale === 'number' ? scale : scaleRaw,
            scaleRaw: scaleRaw,
            particleType: pType,
            particleTypeRaw: typeRaw
        });
    }
    return configs;
}

// ========== 4. Extract level config parameters from for-loop patterns ==========
// Pattern: this[...]=function(){var t,n,r=to,i=ro,...;var v=0,l=ARRAY;for(v=0;v<l.length;v++){switch(l[v]){case N:t[PROP]=VAL;break;...}}}
function extractLevelConfigs() {
    const configs = [];

    // Find all this[...]=function patterns that contain r=to,i=ro and for(v=0...switch
    const funcPattern = /this\[([^\]]+)\]=function\(\)\{var t,n,r=to,i=ro,([^;]+);([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
    // This regex is too complex - let's use a simpler approach

    // Find all patterns: for(var ...=0,l=VARNAME;l.length;...){switch(l[...]){case ...:t[...]=...;break;
    const loopPattern = /for\(var (\w+)=0,(\w+)=([a-zA-Z_]\w*);(\w+)<(\w+)\.length;(\w+)\+\+\)\{switch\(\w+\[(\w+)\]\)\{/g;
    let lm;
    while ((lm = loopPattern.exec(content)) !== null) {
        const loopVar = lm[1];
        const arrVar = lm[2];
        const arrSource = lm[3];
        const loopRegion = content.substring(lm.index, Math.min(content.length, lm.index + 10000));

        // Extract case assignments: case N:t[PROP]=VAL;break;
        const caseAssignPattern = /case\s+([^:]+):t\[([^\]]+)\]=([^;]+);break/g;
        const assignments = [];
        let cam;
        while ((cam = caseAssignPattern.exec(loopRegion)) !== null) {
            const caseVal = cam[1].trim();
            const propRaw = cam[2].trim();
            const valRaw = cam[3].trim();

            // Resolve property name
            // Pattern: e[5], a[3], i[8], n[10][2], r[10][2], etc.
            let propName = propRaw;
            const propMatch = propRaw.match(/^([a-zA-Z_]\w*)\[(\d+)\](?:\[(\d+)\])?$/);
            if (propMatch) {
                const varName = propMatch[1];
                const idx1 = parseInt(propMatch[2]);
                const idx2 = propMatch[3] ? parseInt(propMatch[3]) : null;
                // Need to find what varName maps to in the function's var declarations
                // This requires looking at the function context before this loop
                const funcContext = content.substring(Math.max(0, lm.index - 2000), lm.index);
                const varDeclPattern = new RegExp(`${varName}=(r|i)\\[(\\d+)\\]`);
                const vdm = varDeclPattern.exec(funcContext);
                if (vdm) {
                    const tableType = vdm[1]; // r=to, i=ro
                    const tableIdx = parseInt(vdm[2]);
                    if (tableType === 'r' && idx2 !== null) {
                        // r[tableIdx][idx2] = to[tableIdx][idx2]
                        propName = toTables[tableIdx] && toTables[tableIdx][idx2] !== undefined ? toTables[tableIdx][idx2] : `to[${tableIdx}][${idx2}]`;
                    } else if (tableType === 'i') {
                        // i[tableIdx] = ro[tableIdx]
                        propName = roArr[tableIdx];
                    } else if (tableType === 'r') {
                        // r[tableIdx][idx1] = to[tableIdx][idx1] (single index means var=r[tableIdx], prop=var[idx1])
                        propName = toTables[tableIdx] && toTables[tableIdx][idx1] !== undefined ? toTables[tableIdx][idx1] : `to[${tableIdx}][${idx1}]`;
                    }
                }
            }

            // Resolve value
            let val = valRaw;
            const valRoMatch = valRaw.match(/^i\[(\d+)\]$/);
            if (valRoMatch) {
                val = roArr[parseInt(valRoMatch[1])];
            } else if (/^[\d.]+$/.test(valRaw)) {
                val = parseFloat(valRaw);
            } else {
                val = evalExpr(valRaw);
            }

            assignments.push({ case: caseVal, prop: propName, propRaw, val, valRaw });
        }

        if (assignments.length > 0) {
            // Get the function context to find the property name
            const funcContext = content.substring(Math.max(0, lm.index - 500), lm.index);
            const thisMatch = funcContext.match(/this\[([^\]]+)\]/g);
            configs.push({
                pos: lm.index,
                arrSource: arrSource,
                thisProp: thisMatch ? thisMatch[thisMatch.length - 1] : '(unknown)',
                assignments: assignments
            });
        }
    }
    return configs;
}

// ========== 5. Extract ALL this[prop]=function config definitions ==========
// These define config objects with multiple properties
function extractAllConfigObjects() {
    const configs = [];

    // Find patterns: this[PROP]=function(){var t,n,r=to,i=ro,...;for(var ...=0,...;...<....length;...++){switch(...){
    // Look for the broader pattern
    const broaderPattern = /this\[([^\]]+)\]=function\(\)\{var t,n,r=to,i=ro,([^;]+);/g;
    let bm;
    while ((bm = broaderPattern.exec(content)) !== null) {
        const propName = bm[1];
        const varDecls = bm[2];

        // Parse variable declarations: e=r[11],a=r[9],u=r[8],s=r[6],o=i[0],c=i[37],...
        const varMap = {}; // varName -> {type: 'to'|'ro', idx: N}
        const declPattern = /(\w+)=(r|i)\[(\d+)\]/g;
        let dm;
        while ((dm = declPattern.exec(varDecls)) !== null) {
            varMap[dm[1]] = { type: dm[2] === 'r' ? 'to' : 'ro', idx: parseInt(dm[3]) };
        }

        // Get the function body (up to 15000 chars)
        const funcBody = content.substring(bm.index, Math.min(content.length, bm.index + 15000));

        // Extract all t[PROP]=VAL assignments (both in switch cases and direct if/else)
        const assignPattern = /t\[([^\]]+)\]\s*=\s*([^;,\n}]+)/g;
        const props = [];
        let am;
        while ((am = assignPattern.exec(funcBody)) !== null) {
            const propRaw = am[1].trim();
            const valRaw = am[2].trim();

            // Skip function assignments and complex expressions
            if (valRaw.startsWith('function') || valRaw.includes('{')) continue;
            if (valRaw.length > 100) continue;

            // Resolve property name
            let propNameResolved = propRaw;
            const pm = propRaw.match(/^(\w+)\[(\d+)\](?:\[(\d+)\])?$/);
            if (pm) {
                const vn = pm[1];
                const i1 = parseInt(pm[2]);
                const i2 = pm[3] ? parseInt(pm[3]) : null;
                if (varMap[vn]) {
                    if (varMap[vn].type === 'to') {
                        if (i2 !== null) {
                            propNameResolved = toTables[varMap[vn].idx] && toTables[varMap[vn].idx][i2] !== undefined ?
                                toTables[varMap[vn].idx][i2] : `to[${varMap[vn].idx}][${i2}]`;
                        } else {
                            propNameResolved = toTables[varMap[vn].idx] && toTables[varMap[vn].idx][i1] !== undefined ?
                                toTables[varMap[vn].idx][i1] : `to[${varMap[vn].idx}][${i1}]`;
                        }
                    } else {
                        propNameResolved = roArr[varMap[vn].idx];
                    }
                }
            }

            // Resolve value
            let valResolved = valRaw;
            const vm = valRaw.match(/^(\w+)$/);
            if (vm && varMap[vm[1]]) {
                if (varMap[vm[1]].type === 'ro') {
                    valResolved = roArr[varMap[vm[1]].idx];
                }
            }
            const vrom = valRaw.match(/^i\[(\d+)\]$/);
            if (vrom) valResolved = roArr[parseInt(vrom[1])];
            else if (/^[\d.]+$/.test(valRaw)) valResolved = parseFloat(valRaw);
            else valResolved = evalExpr(valRaw);

            // Check for duplicates
            const existing = props.find(p => p.prop === propNameResolved);
            if (!existing) {
                props.push({ prop: propNameResolved, propRaw, val: valResolved, valRaw });
            }
        }

        if (props.length >= 3) {
            configs.push({
                pos: bm.index,
                thisProp: propName,
                varMap: varMap,
                props: props
            });
        }
    }
    return configs;
}

// ========== Run extractions ==========
console.log('\n=== Extracting Physics Configs ===');
const physicsConfigs = extractPhysicsConfigs();
console.log(`Found ${physicsConfigs.length} physics config entries`);

console.log('\n=== Extracting Level Configs (for-loop patterns) ===');
const levelConfigs = extractLevelConfigs();
console.log(`Found ${levelConfigs.length} level config patterns`);

console.log('\n=== Extracting ALL Config Objects ===');
const allConfigs = extractAllConfigObjects();
console.log(`Found ${allConfigs.length} config objects`);

// ========== Generate CSV files ==========

// Helper: write CSV with dual headers (English/Chinese)
function writeCSV(filename, headers, cnHeaders, rows) {
    const lines = [];
    lines.push(headers.map(h => `"${h}"`).join(','));
    lines.push(cnHeaders.map(h => `"${h}"`).join(','));
    for (const row of rows) {
        lines.push(row.map(v => `"${v}"`).join(','));
    }
    const csvContent = '\ufeff' + lines.join('\n');
    fs.writeFileSync(path.join(outDir, filename), csvContent, 'utf8');
    console.log(`  Written: ${filename} (${rows.length} rows)`);
}

// --- PhysicsConfig CSV ---
console.log('\n=== Generating PhysicsConfig CSV ===');
if (physicsConfigs.length > 0) {
    // Determine groups based on position clustering
    const sorted = [...physicsConfigs].sort((a, b) => {
        const posA = content.indexOf(`case ${a.cond}:n[${a.idx}]=function`);
        const posB = content.indexOf(`case ${b.cond}:n[${b.idx}]=function`);
        return posA - posB;
    });

    const rows = sorted.map((c, i) => [i, c.radius, c.scale, c.particleType]);
    writeCSV('PhysicsConfig.csv',
        ['id', 'radius', 'scale', 'particleType'],
        ['编号', '半径', '缩放比例', '粒子类型'],
        rows);
}

// --- LevelConfig CSV (difficulty parameters) ---
console.log('\n=== Generating LevelConfig CSV ===');
if (allConfigs.length > 0) {
    // Find config objects with level-related properties
    const levelRelatedConfigs = allConfigs.filter(c => {
        return c.props.some(p =>
            typeof p.prop === 'string' &&
            (p.prop.includes('num') || p.prop.includes('Base') ||
             p.prop.includes('Config') || p.prop.includes('fruit') ||
             p.prop.includes('random') || p.prop.includes('lv') ||
             p.prop.includes('hole') || p.prop.includes('Scale') ||
             p.prop.includes('Multiple') || p.prop.includes('Type') ||
             p.prop.includes('Count') || p.prop.includes('Obs'))
        );
    });

    console.log(`  Level-related configs: ${levelRelatedConfigs.length}`);

    // Generate a combined CSV with all config objects
    // Each config object becomes a row, with columns = union of all property names
    const allProps = new Set();
    for (const c of levelRelatedConfigs) {
        for (const p of c.props) {
            if (typeof p.prop === 'string') allProps.add(p.prop);
        }
    }
    const propList = [...allProps].sort();

    const rows = levelRelatedConfigs.map((c, i) => {
        const row = [i];
        for (const prop of propList) {
            const found = c.props.find(p => p.prop === prop);
            row.push(found ? found.val : '');
        }
        return row;
    });

    writeCSV('LevelDifficultyConfig.csv',
        ['configId', ...propList],
        ['配置编号', ...propList.map(p => p)],
        rows);
}

// --- Individual config object CSVs ---
console.log('\n=== Generating individual config CSVs ===');
for (let i = 0; i < allConfigs.length; i++) {
    const c = allConfigs[i];
    // Resolve the this[prop] name
    let configName = `Config_${i}`;
    const propMatch = c.thisProp.match(/(?:i|r)\[(\d+)\]/);
    if (propMatch) {
        const idx = parseInt(propMatch[1]);
        const isRo = c.thisProp.startsWith('i');
        if (isRo) {
            configName = `ro_${idx}`;
        } else {
            // It's a to[] reference - find the actual name
            configName = `to_${idx}`;
        }
    }

    // Only generate CSV for configs with meaningful properties
    const meaningfulProps = c.props.filter(p => typeof p.prop === 'string' && !p.prop.startsWith('to[') && !p.prop.startsWith('ro['));
    if (meaningfulProps.length >= 3) {
        const rows = meaningfulProps.map(p => [p.prop, p.val, p.valRaw]);
        writeCSV(`${configName}.csv`,
            ['property', 'value', 'rawValue'],
            ['属性名', '值', '原始值'],
            rows);
    }
}

// --- Print summary ---
console.log('\n=== SUMMARY ===');
console.log(`Physics configs: ${physicsConfigs.length}`);
console.log(`Level config patterns: ${levelConfigs.length}`);
console.log(`All config objects: ${allConfigs.length}`);
console.log(`\nConfig objects with properties:`);
for (let i = 0; i < allConfigs.length; i++) {
    const c = allConfigs[i];
    console.log(`  [${i}] pos=${c.pos} thisProp=${c.thisProp} props=${c.props.length}`);
    for (const p of c.props.slice(0, 10)) {
        console.log(`      ${p.prop} = ${p.val} (raw: ${p.valRaw})`);
    }
    if (c.props.length > 10) console.log(`      ... and ${c.props.length - 10} more`);
}
