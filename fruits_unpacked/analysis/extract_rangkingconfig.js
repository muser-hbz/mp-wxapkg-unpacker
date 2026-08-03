// 从 fruits_unpacked 的 JsonAsset 中提取 rangkingConfig 配置表，生成双行表头 CSV
// 格式与 analysis/excel/csv/ 一致：第1行英文字段名，第2行中文表头，第3行起数据
const fs = require('fs');
const path = require('path');

const srcFile = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/_subpackages_game_/subpackages/game/import/9d/9d46f4cc-bb04-4a8d-9767-70d1381abf3e.json';
const outDir = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis/cfg_csv';
fs.mkdirSync(outDir, { recursive: true });

const raw = fs.readFileSync(srcFile, 'utf8');
const data = JSON.parse(raw);

// Cocos JsonAsset: data[5] = [[0, "rangkingConfig", [...config...]]]
let config = null;
for (const idx of [5, 6]) {
    const arr = data[idx];
    if (!Array.isArray(arr)) continue;
    for (const item of arr) {
        if (Array.isArray(item) && item.length >= 3 && item[0] === 0 && typeof item[1] === 'string' && Array.isArray(item[2])) {
            config = { name: item[1], rows: item[2] };
            break;
        }
    }
    if (config) break;
}

if (!config) {
    console.log('未找到 rangkingConfig 配置数据');
    process.exit(1);
}

console.log(`配置表名: ${config.name}`);
console.log(`数据行数: ${config.rows.length}`);
console.log(`字段: ${Object.keys(config.rows[0]).join(', ')}`);

// 字段中文名映射
const cnHeaders = {
    'minLevel': '最小关卡',
    'maxLevel': '最大关卡',
    'rankStr': '段位名称'
};

const fields = Object.keys(config.rows[0]);

function writeCsv(filename, headers, cnHeaders, rows) {
    const csvPath = path.join(outDir, filename);
    let csv = '\ufeff'; // UTF-8 BOM
    // 第1行：英文字段名
    csv += headers.map(h => `"${h}"`).join(',') + '\r\n';
    // 第2行：中文表头
    csv += headers.map(h => `"${cnHeaders[h] || h}"`).join(',') + '\r\n';
    // 数据行
    for (const row of rows) {
        csv += headers.map(h => {
            const v = row[h];
            return `"${v == null ? '' : v}"`;
        }).join(',') + '\r\n';
    }
    fs.writeFileSync(csvPath, csv, 'utf8');
    console.log(`生成: ${filename} (${rows.length} 行)`);
}

writeCsv('rangkingConfig.csv', fields, cnHeaders, config.rows);

// ========== 同时提取原始 JSON 到 cfg 目录 ==========
const cfgDir = 'd:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg';
fs.mkdirSync(cfgDir, { recursive: true });
fs.writeFileSync(path.join(cfgDir, 'rangkingConfig.json'),
    JSON.stringify(config.rows, null, 2), 'utf8');
console.log(`\n原始 JSON 已保存到: cfg/rangkingConfig.json`);
