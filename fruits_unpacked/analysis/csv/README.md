# game.js 配置表 CSV 索引

> 由 `generate_csv.js` 自动生成，所有 CSV 均含 UTF-8 BOM，可直接用 Excel/WPS 打开。
> 数据来源：`fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js` 反混淆解码

## CSV 文件列表

| 序号 | 文件名 | 行数 | 内容说明 |
|------|--------|------|----------|
| 01 | [01_ro_numeric_constants.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis/csv/01_ro_numeric_constants.csv) | 274 | ro[] 数值常量表（坐标/尺寸/时间/MD5常量等） |
| 02 | [02_to_string_tables.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis/csv/02_to_string_tables.csv) | 3894 | to[] 字符串标识符表（41张表，全部解码标识符） |
| 03 | [03_difficulty_config_identifiers.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis/csv/03_difficulty_config_identifiers.csv) | 66 | 难度配置标识符表（关卡配置/数值基准/缩放/黑洞等） |
| 04 | [04_variable_alias_mapping.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis/csv/04_variable_alias_mapping.csv) | 51 | 变量别名映射表（单字母变量 → ro[n]/to[k][j]） |
| 05 | [05_opaque_predicates.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis/csv/05_opaque_predicates.csv) | 19 | 不透明谓词求值表（混淆表达式 → 实际布尔值） |
| 06 | [06_gameplay_rules.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis/csv/06_gameplay_rules.csv) | 10 | 玩法规则表（队列/障碍/冰冻/黑洞算法） |
| 07 | [07_core_classes.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis/csv/07_core_classes.csv) | 30 | 核心类/模块表（GameMgr/FruitConfig等） |
| 08 | [08_api_endpoints.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis/csv/08_api_endpoints.csv) | 10 | 网络接口表（登录/存档/上报等API） |
| 09 | [09_physics_engine_config.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis/csv/09_physics_engine_config.csv) | 30 | 物理与引擎配置表（分辨率/重力/碰撞矩阵等） |
| 10 | [10_resource_bundles.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis/csv/10_resource_bundles.csv) | 11 | 资源分包表（8个主题分包） |
| 11 | [11_fruit_element_names.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis/csv/11_fruit_element_names.csv) | 105 | 水果/元素名称表（水果/蔬菜/甜品/动物/海洋/特殊） |
| 12 | [12_module_structure.csv](file:///d:/project/mp-wxapkg-unpacker/fruits_unpacked/analysis/csv/12_module_structure.csv) | 36 | 模块结构表（36个模块的名称/大小/分类） |

## 各表字段说明

### 01_ro_numeric_constants.csv
| 字段 | 说明 |
|------|------|
| 索引 | ro[] 数组下标（0-273） |
| 值 | 解码后的数值 |
| 用途推测 | 根据值大小和上下文推测的用途 |

### 02_to_string_tables.csv
| 字段 | 说明 |
|------|------|
| 表号to[k] | 字符串表编号（0-46） |
| 索引j | 表内索引 |
| 分块长度 | 该表使用的分块大小（2/3/9/10/12/13...） |
| 标识符 | 解码后的标识符（属性名/方法名/类名等） |

### 03_difficulty_config_identifiers.csv
| 字段 | 说明 |
|------|------|
| 分类 | 关卡配置/数值基准/水果缩放/随机化/黑洞系统等 |
| 标识符 | 配置键名（如 lv2Config, num100Base） |
| 说明 | 该配置项的作用 |

### 06_gameplay_rules.csv
| 字段 | 说明 |
|------|------|
| 规则编号 | 规则在源码中的变量名（Kt/Yt/Xt/Zt） |
| 名称 | 规则中文名 |
| 原始文本 | 从源码解码出的完整中文规则文本 |
| 算法解析 | 规则的算法公式/要点提炼 |
| 分类 | 队列随机化/障碍物布局/冰冻难度/黑洞布局等 |

## 重新生成

如需重新生成所有 CSV，运行：

```bash
node fruits_unpacked/analysis/generate_csv.js
```

输出目录：`fruits_unpacked/analysis/csv/`
