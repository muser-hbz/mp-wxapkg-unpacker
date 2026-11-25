// 追踪生成数据函数中的总行数引用 + 关卡号递增/持久化
const fs = require('fs');
const game = fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/_subpackages_main_/subpackages/main/game.js', 'utf8');
const rtObj = JSON.parse(fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/analysis_rt_tables.json', 'utf8'));

function searchRefs(n, m, label, limit = 10, ctxLen = 250) {
  const re = new RegExp(`([a-zA-Z_$][\\w$]*)\\[${n}\\]\\[${m}\\]`, 'g');
  const results = [];
  let match;
  while ((match = re.exec(game)) !== null) {
    if (match[1].length > 4) continue;
    results.push({ pos: match.index, vname: match[1], ctx: game.slice(Math.max(0, match.index - 120), match.index + ctxLen).replace(/\n/g, ' ') });
  }
  console.log(`\n=== ${label} rt[${n}][${m}] 有效${results.length}处 ===`);
  results.slice(0, limit).forEach(r => console.log(`@${r.pos} (${r.vname}): ...${r.ctx}...`));
  return results;
}

// 生成数据/生成方块/难度设置函数引用
searchRefs(3, 350, '生成数据', 6);
searchRefs(3, 351, '生成方块', 6);
searchRefs(5, 376, '游戏难度设置', 6);
searchRefs(5, 102, '生成石头总数', 10);
searchRefs(4, 110, 'writeq类型数', 10);
searchRefs(5, 218, '方块排列难度', 10);

// 查找"总行数"在其他chunk中的重复条目
console.log('\n=== 搜索所有含"总行数"的rt条目 ===');
for (const n of Object.keys(rtObj)) {
  for (const m of Object.keys(rtObj[n])) {
    const s = rtObj[n][m];
    if (typeof s === 'string' && s.includes('总行数')) console.log(`rt[${n}][${m}] = "${s}"`);
  }
}
