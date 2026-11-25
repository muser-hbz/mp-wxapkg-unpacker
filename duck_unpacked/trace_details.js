// 精确定位关卡相关字符串的rt索引，追踪关键引用（修正版）
const fs = require('fs');
const game = fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/_subpackages_main_/subpackages/main/game.js', 'utf8');
const rtObj = JSON.parse(fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/analysis_rt_tables.json', 'utf8'));

// rt结构: { chunkIndex: { subIndex: string } }
const keywords = ['关卡编辑', '关卡编辑器', '义父关卡编辑', '测试关卡', '关卡数据', '关卡号', '总行数', '总列数', '初始x', '初始y', '间隔距离', 'gameLevel', '当前关卡', '下一关', '过关', '难度', '关卡'];
console.log('=== 关键词所在 rt 表项 ===');
const found = [];
for (const n of Object.keys(rtObj)) {
  const chunk = rtObj[n];
  for (const m of Object.keys(chunk)) {
    const s = chunk[m];
    if (typeof s === 'string' && s.length < 15) {
      for (const kw of keywords) {
        if (s === kw || s.includes(kw)) {
          console.log(`rt[${n}][${m}] = "${s}"`);
          found.push([+n, +m, s]);
          break;
        }
      }
    }
  }
}

// 在game.js中搜索精确 [N][M] 引用
function searchRefs(n, m, label, limit = 8) {
  const re = new RegExp(`\\[\\w+\\[${n}\\]\\[${m}\\]\\]`, 'g');
  const results = [];
  let match;
  while ((match = re.exec(game)) !== null) {
    results.push({ pos: match.index, ctx: game.slice(Math.max(0, match.index - 80), match.index + 160).replace(/\n/g, ' ') });
  }
  console.log(`\n=== ${label} rt[${n}][${m}] 共${results.length}处 ===`);
  results.slice(0, limit).forEach(r => console.log(`@${r.pos}: ...${r.ctx}...`));
  return results;
}

// 对每个找到的关卡编辑类字符串搜索引用
console.log('\n\n########## 引用搜索 ##########');
const seen = new Set();
for (const [n, m, s] of found) {
  const key = `${n},${m}`;
  if (seen.has(key)) continue;
  seen.add(key);
  if (/编辑|测试|关卡数据|gameLevel|下一关/.test(s)) {
    searchRefs(n, m, s);
  }
}
