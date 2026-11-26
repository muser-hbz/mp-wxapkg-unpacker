const { readFileSync } = require('node:fs');
const { join } = require('node:path');

function readPackageFile(path) {
  return readFileSync(join(__dirname, '../dec', path), 'utf8');
}

const startScene = JSON.parse(readPackageFile('assets/start-scene/import/0a/0ad82a5fe.648c5.json'));
const levelData = JSON.parse(readPackageFile('subpackages/LvData/import/22/226f8b27-f8e9-4e46-95bb-a7cd4285ba8b.8a88e.json'));
const laterLayouts = levelData[5][0][2];
const tables = new Map();
for (const entry of startScene[5]) {
  const asset = entry[0]?.[0];
  if (Array.isArray(asset) && typeof asset[1] === 'string' && Array.isArray(asset[2])) {
    tables.set(asset[1], asset[2]);
  }
}

const game = readPackageFile('game.js');
const holeConfig = game.match(/\bplateHoleConfig=(\[[\d,\[\]\s]+\])/);
if (!holeConfig) throw new Error('找不到 GameCfg.plateHoleConfig');
const plateHoles = new Map();
JSON.parse(holeConfig[1]).forEach((ids, holeCount) => {
  for (const id of ids) plateHoles.set(id, holeCount);
});

const modes = {
  normal: { suffix: '', layouts: [...tables.get('totalLv1'), ...laterLayouts] },
  challenge: { suffix: '_Challenge', layouts: tables.get('totalChallLv') },
  transparent: { suffix: '_Transparent', layouts: [] },
};

function readMode(mode) {
  const { suffix, layouts } = modes[mode];
  const layoutsByLevel = new Map(layouts.map(layout => [Number(layout.name), layout.plates]));
  const difficulty = tables.get(`levelDiffConfig${suffix}`);
  const levels = tables.get(`levelConfig${suffix}`).map(config => {
    const plates = layoutsByLevel.get(config.lv);
    if (!plates) return { config, layout: null };

    const groups = new Set();
    let holes = 0;
    for (const { id, g } of plates) {
      if (!plateHoles.has(id)) throw new Error(`关卡 ${config.lv} 的板 ${id} 没有孔数配置`);
      holes += plateHoles.get(id);
      groups.add(g);
    }
    return { config, layout: { plates: plates.length, layers: groups.size, holes } };
  });
  return { difficulty, levels };
}

function range(values) {
  return values.length ? [Math.min(...values), Math.max(...values)] : null;
}

function summarize(mode) {
  const { difficulty, levels } = readMode(mode);
  const layouts = levels.map(level => level.layout).filter(Boolean);
  return {
    levelCount: levels.length,
    levelRange: range(levels.map(({ config }) => config.lv)),
    difficultyRowCount: difficulty.length,
    configuredScrewRange: range(levels.map(({ config }) => config.screw)),
    layoutCount: layouts.length,
    totalPlates: layouts.reduce((sum, layout) => sum + layout.plates, 0),
    platesPerLayout: range(layouts.map(layout => layout.plates)),
    layersPerLayout: range(layouts.map(layout => layout.layers)),
    holeMismatches: levels.filter(({ config, layout }) => layout && layout.holes !== config.screw),
  };
}

function screwStages(mode, config, difficulty) {
  if (mode === 'normal' && config.lv === 1) {
    return [2, 2, 2].map((screws, index) => ({ stage: index + 1, screws }));
  }

  const progress = difficulty.progress.split(',').map(Number);
  const colorCounts = difficulty.type.split(',').map(Number);
  let assigned = 0;
  return colorCounts.map((candidateColors, index) => {
    const previousProgress = progress[index - 1] ?? 0;
    const screws = index === colorCounts.length - 1
      ? config.screw - assigned
      : Math.floor((progress[index] - previousProgress) * config.screw / 100);
    assigned += screws;
    return { stage: index + 1, screws, candidateColors };
  });
}

function inspect(mode, levelArg) {
  if (!mode) return Object.fromEntries(Object.keys(modes).map(key => [key, summarize(key)]));
  if (!Object.hasOwn(modes, mode)) throw new Error(`未知模式 ${mode}`);
  const result = readMode(mode);
  if (levelArg === undefined) return result;

  const levelId = Number(levelArg);
  const level = result.levels.find(({ config }) => config.lv === levelId);
  if (!level) throw new Error(`${mode} 没有编号为 ${levelArg} 的本地配置`);
  const difficulty = result.difficulty.find(row => row.id === level.config.difficulty);
  return { ...level, difficulty, stages: screwStages(mode, level.config, difficulty) };
}

try {
  const args = process.argv.slice(2);
  if (args.length > 2) throw new Error('参数过多');
  console.log(JSON.stringify(inspect(...args), null, 2));
} catch (error) {
  console.error(error.message);
  console.error('用法：node inspect-levels.js [normal|challenge|transparent] [配置编号]');
  process.exitCode = 1;
}
