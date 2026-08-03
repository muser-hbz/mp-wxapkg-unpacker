// Find all JsonAsset configuration files in fruits_unpacked
const fs = require('fs');
const path = require('path');

const root = 'd:\\project\\mp-wxapkg-unpacker\\fruits_unpacked';
const results = [];

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
            walk(full);
        } else if (e.isFile() && e.name.endsWith('.json')) {
            try {
                const content = fs.readFileSync(full, 'utf8');
                if (content.includes('cc.JsonAsset')) {
                    // Find all _name fields
                    const nameMatches = [...content.matchAll(/"_name"\s*,\s*"([^"]+)"/g)];
                    const names = nameMatches.map(m => m[1]);
                    results.push({
                        path: full,
                        size: fs.statSync(full).size,
                        names: names,
                        preview: content.substring(0, 200)
                    });
                }
            } catch (err) {
                // skip
            }
        }
    }
}

walk(root);
console.log('Total JsonAsset files found:', results.length);
console.log('='.repeat(80));
for (const r of results) {
    console.log('Path:', r.path);
    console.log('Size:', r.size, 'bytes');
    console.log('Names:', r.names.join(', '));
    console.log('Preview:', r.preview.substring(0, 150));
    console.log('-'.repeat(80));
}
