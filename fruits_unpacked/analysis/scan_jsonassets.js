// 扫描 fruits_unpacked 中所有 cc.JsonAsset 文件，提取配置名称和数据
const fs = require('fs');
const path = require('path');

const root = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked';
const assets = [];

function walk(dir) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
    catch (e) { return; }
    for (const ent of entries) {
        const full = path.join(dir, ent.name);
        if (ent.name === 'analysis' || ent.name === 'images' || ent.name === 'node_modules') continue;
        if (ent.isDirectory()) { walk(full); continue; }
        if (!ent.name.endsWith('.json')) continue;
        let raw;
        try { raw = fs.readFileSync(full, 'utf8'); } catch (e) { continue; }
        if (!raw.includes('JsonAsset')) continue;
        let data;
        try { data = JSON.parse(raw); } catch (e) { continue; }
        // Cocos JsonAsset 格式: [1,0,0,[[ "cc.JsonAsset",["_name","json"],1 ]],[[0,0,1,3]],[[0,"NAME",{JSON}],...],0,0,[],[],[]]
        // 配置数据在 data[5]
        if (Array.isArray(data) && data.length >= 6) {
            // 尝试多个可能的索引（5 或 6）
            for (const idx of [5, 6]) {
                const arr = data[idx];
                if (!Array.isArray(arr)) continue;
                for (const item of arr) {
                    if (Array.isArray(item) && item.length >= 3 && item[0] === 0 && typeof item[1] === 'string' && typeof item[2] === 'object') {
                        assets.push({
                            file: path.relative(root, full),
                            name: item[1],
                            jsonSize: JSON.stringify(item[2]).length,
                            jsonType: Array.isArray(item[2]) ? 'array' : 'object',
                            jsonKeys: typeof item[2] === 'object' && !Array.isArray(item[2]) ? Object.keys(item[2]).slice(0, 30) : (Array.isArray(item[2]) ? `array[${item[2].length}]` : typeof item[2])
                        });
                    }
                }
            }
        }
    }
}

walk(root);
console.log(`\n=== 找到 ${assets.length} 个 JsonAsset 配置 ===\n`);
for (const a of assets) {
    console.log(`[${a.name}] size=${a.jsonSize} type=${a.jsonType}`);
    console.log(`  file: ${a.file}`);
    console.log(`  keys: ${Array.isArray(a.jsonKeys) ? a.jsonKeys.join(', ') : a.jsonKeys}`);
    console.log('');
}
