# 关卡数据配置表索引 (fruits_unpacked)

> 从 `fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js` 反混淆后提取的所有配置表
> 所有 CSV 文件采用中英文双表头格式（第1行英文字段名，第2行中文字段名）
> 参考格式：`d:\project\mp-wxapkg-unpacker\analysis\excel\csv\`

## 配置表清单（共 26 个 CSV 文件）

### 一、关卡数据

| 文件 | 行数 | 说明 |
|------|------|------|
| [LevelData.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/LevelData.csv) | 169 | 关卡数据表（1-169关的目标消除数、水果种类、黑洞、冰块等参数） |
| [LevelConfigStructure.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/LevelConfigStructure.csv) | 9 | 关卡配置对象结构（属性映射） |
| [LevelDataMapping.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/LevelDataMapping.csv) | 15 | 关卡数据属性映射（15个字段的配置） |
| [LevelDifficultyParams.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/LevelDifficultyParams.csv) | 20 | 难度参数标识符（lv2Config~lv9Config、num10Base等） |
| [RankingConfig.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/RankingConfig.csv) | 169 | 排位段位配置（青铜~王者3） |

### 二、水果/元素配置

| 文件 | 行数 | 说明 |
|------|------|------|
| [FruitPhysicsConfig.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/FruitPhysicsConfig.csv) | 64 | 水果物理配置总表（半径、缩放、粒子类型） |
| [PhysicsConfig_small.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/PhysicsConfig_small.csv) | 29 | 小对象物理配置（29种水果） |
| [PhysicsConfig_large.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/PhysicsConfig_large.csv) | 35 | 大对象物理配置（35种水果） |
| [CityFruitConfig.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/CityFruitConfig.csv) | 38 | 城市/水果配置（38组城市-水果映射） |
| [FruitElementNames.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/FruitElementNames.csv) | 428 | 水果/元素名称表（428个名称） |
| [FruitTypeConstants.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/FruitTypeConstants.csv) | 9 | 水果类型常量（别名映射） |

### 三、数值常量表

| 文件 | 行数 | 说明 |
|------|------|------|
| [NumericConstants_ro.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/NumericConstants_ro.csv) | 274 | ro[] 数值常量表（274个常量，含十六进制） |
| [StringTables_to.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/StringTables_to.csv) | 4298 | to[] 字符串表（47个子表，4298个条目） |
| [ShuffleTable.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/ShuffleTable.csv) | 25 | 置换/排序表（11-35的洗牌顺序） |
| [HolePositionCoords.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/HolePositionCoords.csv) | 46 | 黑洞位置坐标（4组坐标，按levelNumber%10选取） |
| [TimeConstants.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/TimeConstants.csv) | 17 | 时间常量（3秒~2小时） |
| [CoordinateConstants.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/CoordinateConstants.csv) | 19 | 坐标与尺寸常量 |
| [PhysicsCollisionParams.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/PhysicsCollisionParams.csv) | 5 | 物理与碰撞参数 |

### 四、系统配置

| 文件 | 行数 | 说明 |
|------|------|------|
| [EnginePhysicsConfig.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/EnginePhysicsConfig.csv) | 21 | 引擎与物理配置（Cocos 3.8.8, Box2D, 碰撞矩阵） |
| [SubpackagesConfig.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/SubpackagesConfig.csv) | 8 | 资源分包配置（8个主题分包） |
| [ApiEndpoints.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/ApiEndpoints.csv) | 10 | 网络接口配置（登录、存档、上报等） |
| [CoreModules.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/CoreModules.csv) | 29 | 核心模块/类配置（29个TS类） |
| [DifficultyRules.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/DifficultyRules.csv) | 5 | 难度算法规则（5条核心规则） |
| [ConfigMapping_group3.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/ConfigMapping_group3.csv) | 21 | 配置映射组3（21个属性映射） |

### 五、反混淆参考

| 文件 | 行数 | 说明 |
|------|------|------|
| [VariableAliases.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/VariableAliases.csv) | 24 | 变量别名映射表（i=ro[1], e=ro[2]等） |
| [OpaquePredicates.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/cfg_csv/OpaquePredicates.csv) | 13 | 不透明谓词求值结果（13个谓词） |

---

## 数据来源说明

### 与参考目录 `analysis/excel/` 的差异

参考目录 `analysis/excel/` 包含 53 个 CSV 文件，来源于第一个 wxapkg 游戏包的 **静态 JSON 配置文件**（`analysis/cfg/*.json`）。

本目录（`fruits_unpacked/cfg_csv/`）的配置数据来源于 `fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js` 中的 **混淆代码**。该游戏使用了 5 层混淆：
1. 字符串反转（Qs 函数）
2. 字符串分块（String.prototype.s）
3. 47 个字符串表（to[]）
4. 不透明谓词（Math 函数混淆）
5. Base-85 编码数值表（ro[]）

因此配置数据需要通过反混淆脚本提取，而非直接读取 JSON 文件。

### 关键反混淆步骤

1. **解码 ro[] 表**：Base-85 编码的 274 个数值常量
2. **解码 to[] 表**：47 个字符串表，按顺序处理 `$s=Qs("...")` 和 `to[N]=$s.s(M)` 语句
3. **提取状态机配置**：从 `case N:t[...]=function(){...}` 模式提取配置对象
4. **解析变量别名**：i=ro[1]=22, e=ro[2]=19, a=ro[3]=11 等
5. **求值不透明谓词**：验证 `Ns=true`, `ls=true` 等，所有 *s 变量 = 1

### 提取脚本

- [extract_all_configs_final.js](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis/extract_all_configs_final.js) - 综合配置提取器（生成所有26个CSV）

---

## 字段说明

### LevelData.csv 字段

| 英文字段 | 中文字段 | 说明 |
|----------|----------|------|
| level | 关卡 | 关卡编号 (1-169) |
| targetCount | 目标消除数 | 本关需要消除的水果数量 |
| fruitTypeCount | 水果种类数 | 本关出现的水果种类数量 |
| downType | 掉落方向 | 0=纵向, 1=向右, 2=向左 |
| quistFlowerCount | 问号花 | 问号花数量 |
| holeCount | 洞口 | 黑洞数量 (最多4个) |
| holeFruit | 洞口水果数 | 黑洞中水果总数 A=random(14,34)+4×(holeCount-2) |
| iceCount | 冰块 | 冰冻水果数量 |
| scatterType | 散布类型 | 散布类型 (0或1) |
| blockCount | 多边形 | 多边形障碍物数量 |
| ropeCount | 绳子数量 | 绳子数量 |
| fireCount | 大火数量 | 大火数量 |
| isWood | 树桩 | 是否有树桩 (0或1) |
| exchangeCount | 交换次数 | 水果交换次数 |

### FruitPhysicsConfig.csv 字段

| 英文字段 | 中文字段 | 说明 |
|----------|----------|------|
| group | 配置组 | small=小对象, large=大对象 |
| caseId | 条件值 | switch-case 的条件值（水果类型ID） |
| arrayIdx | 数组索引 | 配置数组的索引 |
| radius | 半径 | 碰撞半径（像素） |
| scale | 缩放比例 | 显示缩放比例 |
| particleType | 粒子类型 | 粒子效果类型 (0-6) |

### CityFruitConfig.csv 字段

| 英文字段 | 中文字段 | 说明 |
|----------|----------|------|
| caseId | 条件值 | switch-case 的条件值 |
| arrayIdx | 数组索引 | 配置数组的索引 |
| id | 编号 | 城市/水果配置ID |
| simpleName | 简称 | 简单名称 |
| cityCount | 城市数量 | 城市名称数组长度 |
| fruitCount | 水果数量 | 水果名称数组长度 |
| cityNameArr | 城市名称数组 | 关联城市名称列表 |
| cityFruitNameArr | 城市水果名称数组 | 关联水果名称列表 |
