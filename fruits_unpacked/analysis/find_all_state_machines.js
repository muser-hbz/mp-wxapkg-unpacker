// Find ALL state machine patterns and configuration definitions in game.js
const fs = require('fs');
const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js';
const content = fs.readFileSync(srcFile, 'utf8');

// 1. Find all state machine patterns (for...switch patterns)
console.log('=== All state machine patterns (for(var...switch) ===');
const smPattern = /for\(var t,n,r=to,i=ro,[^;]+;[A-Za-z]+<i\[(\d+)\];\)switch\(\+\+[A-Za-z]+,[A-Za-z]+\)/g;
let m;
let smCount = 0;
while ((m = smPattern.exec(content)) !== null) {
    smCount++;
    // Get surrounding context (200 chars before and after)
    const start = Math.max(0, m.index - 100);
    const end = Math.min(content.length, m.index + 300);
    console.log(`\n[SM#${smCount}] pos=${m.index} | limit=i[${m[1]}]`);
    console.log(`  Context: ...${content.substring(start, end)}...`);
}
console.log(`\nTotal state machines found: ${smCount}`);

// 2. Find all "case" patterns with function definitions that assign config values
console.log('\n\n=== All case patterns with config assignments ===');
const casePattern = /case\s+(\S+?):n\[([^\]]+)\]=function/g;
let cm;
let caseCount = 0;
const casePositions = [];
while ((cm = casePattern.exec(content)) !== null) {
    caseCount++;
    casePositions.push({
        pos: cm.index,
        cond: cm[1],
        idx: cm[2],
        preview: content.substring(cm.index, Math.min(content.length, cm.index + 200))
    });
}
console.log(`Total case patterns found: ${caseCount}`);

// Group by position clusters
if (casePositions.length > 0) {
    let clusterStart = casePositions[0].pos;
    let clusterEnd = casePositions[0].pos;
    let clusterCount = 1;
    console.log('\n--- Case clusters (grouped by proximity < 10000 chars) ---');
    for (let i = 1; i < casePositions.length; i++) {
        if (casePositions[i].pos - clusterEnd < 10000) {
            clusterEnd = casePositions[i].pos;
            clusterCount++;
        } else {
            console.log(`Cluster @ ${clusterStart}-${clusterEnd}: ${clusterCount} cases`);
            // Show first 3 cases in cluster
            const cluster = casePositions.filter(c => c.pos >= clusterStart && c.pos <= clusterEnd);
            for (const c of cluster.slice(0, 3)) {
                console.log(`  case ${c.cond}: n[${c.idx}] => ${c.preview.substring(0, 150)}...`);
            }
            if (cluster.length > 3) console.log(`  ... and ${cluster.length - 3} more`);
            clusterStart = casePositions[i].pos;
            clusterEnd = casePositions[i].pos;
            clusterCount = 1;
        }
    }
    // Last cluster
    console.log(`Cluster @ ${clusterStart}-${clusterEnd}: ${clusterCount} cases`);
    const cluster = casePositions.filter(c => c.pos >= clusterStart && c.pos <= clusterEnd);
    for (const c of cluster.slice(0, 3)) {
        console.log(`  case ${c.cond}: n[${c.idx}] => ${c.preview.substring(0, 150)}...`);
    }
    if (cluster.length > 3) console.log(`  ... and ${cluster.length - 3} more`);
}

// 3. Find large object literal patterns with many numeric properties
console.log('\n\n=== Large object literals (potential config data) ===');
// Pattern: {key:val,key:val,...} with 10+ properties
const objPattern = /\{((?:[\w$]+:\s*[\d.]+,){10,}[\w$]+:\s*[\d.]+)\}/g;
let om;
let objCount = 0;
while ((om = objPattern.exec(content)) !== null && objCount < 30) {
    const props = om[1].split(',');
    console.log(`\n[OBJ#${objCount}] pos=${om.index} | ${props.length} properties`);
    console.log(`  ${om[0].substring(0, 200)}${om[0].length > 200 ? '...' : ''}`);
    objCount++;
}

// 4. Find array-of-objects patterns (like [{...},{...},...])
console.log('\n\n=== Array of objects (potential table data) ===');
const arrObjPattern = /\[\{((?:[^{}]+,[^{}]+){5,})\}(?:,\{[^\}]+\}){3,}\]/g;
let am;
let arrCount = 0;
while ((am = arrObjPattern.exec(content)) !== null && arrCount < 10) {
    console.log(`\n[ARR#${arrCount}] pos=${am.index} | preview: ${am[0].substring(0, 300)}...`);
    arrCount++;
}
