// 扫描 fruits_unpacked 中所有 JSON 文件，识别配置表特征：
// - 顶层是数组
// - 数组元素是对象（含字段）
// - 或者顶层对象包含明显的配置字段
const fs = require('fs');
const path = require('path');

const root = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked';
const results = [];

function walk(dir) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
    catch (e) { return; }
    for (const ent of entries) {
        const full = path.join(dir, ent.name);
        // 跳过 analysis 目录（避免扫描自己生成的文件）
        if (ent.name === 'analysis' || ent.name === 'images' || ent.name === 'node_modules') continue;
        if (ent.isDirectory()) { walk(full); continue; }
        if (!ent.name.endsWith('.json')) continue;
        let stat;
        try { stat = fs.statSync(full); } catch (e) { continue; }
        if (stat.size < 50 || stat.size > 5000000) continue;
        let raw;
        try { raw = fs.readFileSync(full, 'utf8'); } catch (e) { continue; }
        let data;
        try { data = JSON.parse(raw); } catch (e) { continue; }

        let info = null;
        if (Array.isArray(data)) {
            // 找第一个对象元素
            const firstObj = data.find(x => x && typeof x === 'object' && !Array.isArray(x));
            if (firstObj) {
                const keys = Object.keys(firstObj);
                info = { type: 'array', len: data.length, sampleKeys: keys.slice(0, 15) };
            } else if (data.length > 0 && typeof data[0] === 'object') {
                info = { type: 'array-nested', len: data.length };
            }
        } else if (data && typeof data === 'object') {
            const keys = Object.keys(data);
            // 配置表对象通常有多个键且值是数组/对象
            if (keys.length >= 2) {
                const sampleVal = data[keys[0]];
                if (Array.isArray(sampleVal) || (sampleVal && typeof sampleVal === 'object')) {
                    info = { type: 'object', len: keys.length, sampleKeys: keys.slice(0, 15) };
                }
            }
        }
        if (info) {
            results.push({ file: path.relative(root, full), size: stat.size, ...info });
        }
    }
}

walk(root);
results.sort((a, b) => b.size - a.size);
console.log(`\n=== 找到 ${results.length} 个候选配置 JSON ===\n`);
for (const r of results) {
    console.log(`[${r.type}] ${r.file}`);
    console.log(`  size=${r.size} len=${r.len} keys=${(r.sampleKeys || []).join(', ')}`);
    console.log('');
}
