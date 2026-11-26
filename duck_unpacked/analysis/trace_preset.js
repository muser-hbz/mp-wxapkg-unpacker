// 用正确的成员访问模式 var[N][M] 重新搜索关键引用
const fs = require('fs');
const game = fs.readFileSync('d:/project/mp-wxapkg-unpacker/duck_unpacked/_subpackages_main_/subpackages/main/game.js', 'utf8');

function searchRefs(n, m, label, limit = 10, ctxLen = 200) {
  const re = new RegExp(`([a-zA-Z_$][\\w$]*)\\[${n}\\]\\[${m}\\]`, 'g');
  const results = [];
  let match;
  while ((match = re.exec(game)) !== null) {
    // 排除在字符串表数据里的误报：变量名应该短（1-3字符混淆变量）
    const vname = match[1];
    if (vname.length > 4) continue;
    results.push({ pos: match.index, vname, ctx: game.slice(Math.max(0, match.index - 100), match.index + ctxLen).replace(/\n/g, ' ') });
  }
  console.log(`\n=== ${label} rt[${n}][${m}] 有效引用${results.length}处 ===`);
  results.slice(0, limit).forEach(r => console.log(`@${r.pos} (${r.vname}): ...${r.ctx}...`));
  return results;
}

// 核心追踪目标
searchRefs(12, 624, '"=== 关卡预设配置 ==="');
searchRefs(2, 230, '"当前关卡"');
searchRefs(2, 419, '"测试关卡"');
searchRefs(2, 501, '"关卡编辑"');
searchRefs(3, 478, '"关卡编辑器"');
searchRefs(4, 398, '"义父关卡编辑"');
searchRefs(9, 162, '关卡号键anarRootset', 20);
searchRefs(2, 130, '总行数', 20);
searchRefs(2, 255, '初始x', 15);
searchRefs(2, 256, '初始y', 15);
