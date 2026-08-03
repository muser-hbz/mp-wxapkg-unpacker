# game.js 玩法逻辑深度分析

> 分析对象：`fruits_unpacked/__WITHOUT_MULTI_PLUGINCODE__/game.js`
> 文件大小：1.86 MB（1,859,183 字符），116 行（高度压缩）
> 引擎：Cocos Creator 3.8.8 | 平台：微信小游戏
> 分析日期：2026-08-03

---

## 一、文件整体结构

`game.js` 是一个 webpack 风格的模块打包文件，使用 `define("模块名", function(require, module, exports){...})` 定义 **36 个模块**。模块构成如下：

| # | 模块名 | 大小 | 说明 |
|---|--------|------|------|
| 0-9 | `@babel/runtime/helpers/*` | 小 | Babel 运行时辅助函数 |
| 10 | `application.js` | ~1.7KB | 应用入口 |
| 11 | `assets/internal/index.js` | ~45KB | 内部资源 |
| 12 | `assets/main/index.js` | ~0.4KB | 主包 |
| **13** | **`assets/start-scene/index.js`** | **~722KB** | **★核心玩法逻辑** |
| 14-26 | `cocos-js/*` | 各异 | Cocos 引擎模块（动画、物理 Box2D、渲染等）|
| 17 | `cocos-js/box2d.release.asm-*.js` | ~372KB | Box2D 物理引擎(WASM) |
| 27 | `engine-adapter.js` | ~20KB | 引擎适配层 |
| 28 | `first-screen.js` | ~6KB | 首屏 |
| 29 | `src/assets/md5/crypto-md5.js` | ~5.5KB | MD5 加密 |
| 30-33 | `src/chunks/*`, `src/system.bundle.js` | 各异 | 系统块/填充 |
| 34 | `web-adapter.js` | ~88KB | Web 适配 |
| 35 | `game.js` | ~1.6KB | 启动入口 |

**核心玩法代码全部集中在模块 13 `assets/start-scene/index.js`**（字节范围 57855–780275，约 722KB），以下分析均针对该模块。

---

## 二、代码混淆技术分析

该文件采用了 **多层混淆**，使得直接阅读几乎不可能。以下是识别出的混淆技术及反混淆方法：

### 2.1 字符串反转函数 `Qs`

```javascript
// 位于 pos ~61096
var Qs = function(t) {
    for (var n = Array.from(t), r = 0, i = t.length - 1; r < i; r++, i--) {
        var e = n[r]; n[r] = n[i]; n[i] = e;
    }
    return n.join("");
};
```

**作用**：将字符串整体反转。所有字符串字面量在源码中以**反转形式**存储，运行时通过 `Qs()` 还原。

### 2.2 字符串分块函数 `String.prototype.s`

```javascript
// 位于 pos ~60993
String.prototype.s = function(t) {
    for (var n = [], r = 0; r < this.length; r += t)
        n.push(this.slice(r, r + t));
    return n;
};
```

**作用**：将还原后的长字符串按固定长度 `t` 切分成数组。不同表使用不同分块长度（2、3、9、10、12、13...），使得无法用统一规则拆分。

### 2.3 字符串表 `to[]`（47 张表）

核心反混淆数据结构。初始化模式：

```javascript
to = new Array(47);
$s = Qs("反转的长字符串"), 2),  to[0] = $s.s(2);   // 分块长度 2
$s = Qs("反转的长字符串"), 3),  to[1] = $s.s(3);   // 分块长度 3
// ... 共 47 张表，每张分块长度不同
$s = Qs("反转的长字符串"), 50), to[46] = $s.s(50);
```

**每张表是一组标识符数组**，代码通过 `to[表号][索引]` 访问。例如：

| 表 | 分块长度 | 内容示例 |
|----|---------|---------|
| `to[0]` | 2 | 水果/元素中文名（"苹果""西瓜""葡萄"...）|
| `to[7]` | 9 | `prototype`, `num10Base`, `num30Base`, `lv7Config`, `fruitType`, `randomMin`, `lv4Config`, `lv8Config`, `lv9Config`... |
| `to[10]` | 12 | `lastMultiple`, `configurable`, `banner_ad`... |
| `to[11]` | 13 | `num100reduce1`, `lastTypeScale`, `num100reduce2`, `./DebugLog.ts`... |

### 2.4 不透明谓词（Opaque Predicates）

大量使用 Math 函数构造的**恒真/恒假表达式**，运行时求值为固定布尔值：

```javascript
var Ou = Math.log, Fu = Math.floor, Bu = Math.exp, zu = Math.abs, Uu = Math.round;

// 以下全部求值为 true：
vs = Fu(78) < Fu(Bu((Ou(85)+Ou(79)+Ou(70))/3));        // false (实际)
ls = Uu(2*Ou(zu(12987))) <= Uu(Ou(10733)+Ou(16218));    // true
Ns = Uu(2*Ou(zu(5094))) <= Uu(Ou(2276)+Ou(11402));      // true

// 转为数字 1：
Fs = +Ns;  // = 1
Bs = +Ns;  // = 1
zs = +Ns;  // = 1
// ... Us, Hs, Vs, Ws, Js, js, qs, Ks, Ys, Xs, Zs 全部 = 1
```

**反混淆**：所有 `Fs/Bs/zs/.../Zs` 变量恒等于 `1`，在算术中作为乘数/加数出现时可直接消去（`x*Fs` → `x`，`x+Bs` → `x+1`）。

### 2.5 Base-85 编码数值常量表 `ro[]`

```javascript
var no = '0,N,W,T,L,R,f,V,c,a,O,j,...';  // 972 字符的逗号分隔编码串
var ro = function(t) {
    // 使用 85 字符字母表解码，每个编码值 + 偏移量 u
    var n = 'ABC...xyz0-9!#$%&()*+./:;<=>?@[]^_`{|}~';
    // ... base-85 解码
}(no);
```

**解码结果**：274 个数值常量，包含坐标、尺寸、时间间隔、MD5 初始化向量等。关键值见下文。

### 2.6 变量别名映射

在 `Fs&&(t=to[4][61], n=2, r="6", i=ro[1], ...)` 块中，将所有 `to[k][j]` 和 `ro[n]` 赋值给单字母变量：

```
i=ro[1]=22   e=ro[2]=19   a=ro[3]=11   u=ro[4]=17   s=ro[5]=31
c=ro[6]=21   f=ro[7]=28   h=ro[8]=26   v=ro[9]=14   l=ro[10]=35
b=ro[11]=34  d=ro[12]=32  k=ro[13]=30  m=ro[14]=23  p=ro[15]=24
g=ro[16]=18  y=ro[17]=29  w=ro[18]=25  _=ro[19]=20  M=ro[20]=27
S=ro[21]=33  A=ro[22]=16  C=ro[23]=15  x=ro[24]=12

# 水果类型常量
j="桃"  q="梨"  K="柚"  Z="狗"  Q="狼"  $="猪"  tt="猫"  nt="蛇"  rt="龙"
```

---

## 三、解码出的玩法规则文本

源码中嵌入了 4 段中文规则说明（变量 `Kt`、`Yt`、`Xt`、`Zt`），是游戏核心算法的**自述文档**：

### 规则 0 — 水果队列随机互换（Kt）

> **0.** 水果在根据初始化数据生成队列后，会执行一次随机互换；该随机不是均匀洗牌，已被交换的水果仍可能再次被交换，交换总次数等于水果数量。

**算法要点**：
- 队列生成后执行 `N` 次随机两两交换（`N` = 水果数量）
- 非均匀洗牌：同一水果可被多次交换
- 目的：增加随机性，避免队列过于规律

### 规则 4 — 障碍物生成（Yt）

> **4.** 障碍物按 Y 轴区间等分生成，每个障碍位于各区间的中心位置，X 轴在 [-208, 208] 范围内随机。

**算法要点**：
- 障碍物沿 Y 轴**等距分布**（区间 = 总高度 / 障碍数）
- 每个障碍 Y 坐标 = 区间中心
- X 坐标随机，范围 `[-208, 208]`（对应 `ro[]` 中相关常量）

### 规则 5 — 冰冻规则（Xt）

> **5.** 冰冻规则：仅从队列第 30 个之后的水果中选择；Y 坐标需低于关卡顶部 400 单位；解冻次数与高度成正比，越靠近顶部要求越高，最大不超过水果总数的一半，并在此基础上附加 0~5 的随机波动值。

**算法要点**：
- 冰冻仅作用于队列**第 30 个之后**的水果
- Y 坐标约束：低于关卡顶部 **400** 单位
- 解冻次数 = f(高度)，高度越高要求越多，上限 = 水果总数 / 2
- 附加 **0~5** 的随机波动

### 规则 — 黑洞水果类型分配（Zt）★核心难度算法

> **【黑洞水果类型分配规则】**
> 1. 每关总黑洞水果数量：**A = (14, 34)**，随关黑洞越多/卡数变化，**A += 4 × (黑洞数量 - 2)**
> 2. 水果生成分两个阶段，随机取 5 种水果：
>    - 阶段 0：随机四种类型插入，每种数量随机为 2 或 4
>    - 阶段 1：剩余类型随机挑选，数量随机，保证总数不超过 A
> 3. 完成后把缺少的数量补齐，不足 A 时随机补齐，每种随机类型放 2 个，保证池中总数 = A
> 4. 黑洞分配：
>    - 每个黑洞先保证至少一个水果类型，按排序顺序依次分配
>    - 剩余水果随机分配到各黑洞，增加随机性
> 5. 最终效果：
>    - 黑洞总数固定，每个黑洞至少一个水果类型
>    - 黑洞水果类型数量可能不同，高关卡水果总数更多、种类更多，增加游戏变化与随机性

**另有一条黑洞位置规则（来自 `to[43]`）**：
> 2. 黑洞最多生成 4 个，位置为固定配置；根据关卡编号对 10 取余，从对应的坐标组中选取。

---

## 四、难度调整系统

### 4.1 关卡配置对象

从 `to[7]`（分块长度 9）解码出的关卡配置标识符：

| 标识符 | 说明 |
|--------|------|
| `lv2Config` ~ `lv9Config` | 8 套关卡参数配置 |
| `lv2_3_5Config` | 特定关卡组合配置（第2/3/5关）|
| `num10Base` | 基数 10 的基准值 |
| `num30Base` | 基数 30 的基准值 |
| `num100Base` | 基数 100 的基准值 |
| `num100Add` / `num100Add1` / `num100Add2` | 在 100 基础上的增加值 |
| `num100Reduce` / `num100Reduce1` / `num100Reduce2` | 在 100 基础上的减少值 |
| `num30Reduce` | 在 30 基础上的减少值 |

### 4.2 水果缩放与类型控制

| 标识符 | 说明 |
|--------|------|
| `fruitType` | 水果类型 |
| `fruitScale` | 水果缩放比例 |
| `lastTypeScale` | 上一类型缩放 |
| `lastMultiple` | 上次倍率 |
| `lastTypeMin` | 上一类型最小值 |
| `lastTypeMinTwoNumScale` | 双数值缩放 |
| `fruitComp` / `fruitsComp` | 水果组件 |
| `fruitCollider` | 水果碰撞体 |
| `fruitRigidbody` | 水果刚体 |
| `fruitRemnantNum` | 水果剩余数量 |

### 4.3 随机化参数

| 标识符 | 说明 |
|--------|------|
| `randomMin` / `randomMax` | 随机范围上下限 |
| `randomBase` | 随机基准值 |
| `randomN` | 随机次数/数量 |
| `RandomInt` | 随机整数生成 |

### 4.4 黑洞系统

| 标识符 | 说明 |
|--------|------|
| `holeItemTypeArr` | 黑洞水果类型数组 |
| `holeCount` | 黑洞数量 |
| `holeCollider` | 黑洞碰撞体 |
| `blackhole` | 黑洞对象 |

**黑洞数量公式**（由规则 Zt 推导）：
```
A = random(14, 34)              // 基础数量随机 14~34
A += 4 × (holeCount - 2)        // 随黑洞数增加
黑洞位置 = 坐标组[levelNumber % 10]  // 最多4个，按关卡号取余选位置
```

### 4.5 挑战与日常系统

| 标识符 | 说明 |
|--------|------|
| `challengeCount` | 挑战次数 |
| `dayAdNumDatas` | 每日广告次数数据 |
| `dayShareNum` | 每日分享次数 |
| `contrastServerLevelData` | 服务器关卡数据对比 |
| `calculatedInfo` | 计算信息（难度计算结果缓存）|
| `isServerArchive` | 是否服务器存档 |
| `mergeStorageKey` | 合并存储键 |
| `uploadLocalToServer` | 本地数据上传服务器 |

### 4.6 关卡进度控制

| 标识符 | 说明 |
|--------|------|
| `game_level` | 当前游戏关卡 |
| `fakeGame_level` | 伪关卡号（用于显示/匹配）|
| `curCollectCount` | 当前收集数 |
| `fruitTotalNum` | 水果总数 |
| `woodenObsEasy` / `woodenObsEasyLv2` | 简单木障碍配置 |
| `lvoneTypeStartNum` | 初始类型起始数量 |
| `stopFruitDownY_day` | 日常模式水果停止下落 Y 坐标 |
| `AdNumDatas_day` | 日常模式广告数据 |

---

## 五、核心数值常量表（`ro[]` 解码）

通过反混淆 `ro()` 函数解码出的 **274 个数值常量**，按功能分类：

### 5.1 置换/排序表（ro[0]–ro[24]）

```
[13, 22, 19, 11, 17, 31, 21, 28, 26, 14, 35, 34, 32, 30, 23, 24, 18, 29, 25, 20, 27, 33, 16, 15, 12]
```
这是 11–35 的一个置换，用作水果/元素类型的**洗牌顺序表**。

### 5.2 坐标与尺寸常量

| ro 索引 | 值 | 推测用途 |
|---------|-----|---------|
| 36 | 200 | 坐标/宽度 |
| 37 | 174 | 坐标 |
| 38 | 86 | 尺寸 |
| 39 | 64 | 尺寸 |
| 43 | 340 | 坐标 |
| 45 | 560 | 坐标 |
| 54 | 100 | 百分比/尺寸 |
| 55 | 180 | 坐标 |
| 58 | 201 | 坐标 |
| 59 | 80 | 尺寸 |
| 60 | 120 | 尺寸 |
| 61 | 300 | 坐标/宽度 |
| 63 | 250 | 坐标 |
| 66 | 125 | 尺寸 |
| 71 | 500 | 坐标 |
| 74 | 1050 | 坐标 |
| 80 | 260 | 坐标 |
| 86 | 202 | 坐标 |
| 93 | 400 | 冰冻规则中的"400单位" |

### 5.3 时间常量

| ro 索引 | 值 | 用途 |
|---------|-----|------|
| 41 | 3000 | 3秒（毫秒）|
| 42 | 2000 | 2秒 |
| 48 | 1278 | 超时（毫秒）|
| 49 | 600 | 0.6秒 |
| 50 | 60 | 60秒/帧 |
| 51 | 3600000 | 1小时（毫秒）|
| 52 | 60000 | 1分钟（毫秒）|
| 53 | 1000 | 1秒（毫秒）|
| 68 | 1800 | 30分钟（秒）|
| 72 | 5000 | 5秒 |
| 73 | 50000 | 50秒 |
| 77 | 10000 | 10秒 |
| 87 | 6000 | 6秒 |
| 94 | 30000 | 30秒 |
| 95 | 3600 | 1小时（秒）|
| 278 | 86400 | 1天（秒）|
| 282 | 7200000 | 2小时（毫秒）|

### 5.4 物理与碰撞参数

| ro 索引 | 值 | 用途 |
|---------|-----|------|
| 88 | 1501 | 物理参数 |
| 89 | 4001 | 物理参数 |
| 65 | 255 | 颜色通道最大值 |
| 224 | 51001 | Unicode 补充平面（emoji）|
| 225 | 51003 | Unicode 补充平面 |

### 5.5 坐标组（障碍/水果位置）

```
ro[227..246] = [160, 750, 880, 270, 450, 130, 670, 238, 268, 228, 248, 172, 210, 280, 520, 67, 220, 170, 190, 140]
ro[247..256] = [155, 158, 87, 178, 184, 186, 188, 107, 230, 215]
ro[258..265] = [114, 104, 89, 92, 72, 85, 75, 66]
ro[270..277] = [182, 278, 350, 208, 165, 290, 728, 360]
```
这些值对应游戏中水果/障碍物的**预设坐标位置**，与黑洞位置选取规则（`levelNumber % 10`）配合使用。

### 5.6 MD5 加密常量

`ro[97]`–`ro[210]` 包含标准 MD5 算法的初始化向量和 K 常量表（如 `1732584193`, `271733878`, `3625587860` 等），用于 `crypto-md5.js` 模块的签名/加密。

---

## 六、游戏架构

### 6.1 引擎与物理配置

来自 `src/settings.json`：

```
引擎: Cocos Creator 3.8.8
平台: wechatgame
设计分辨率: 750 × 1334
物理引擎: Box2D (WASM)
重力: (0, -10, 0)
碰撞分组: fruit(1), wall(2), obst(3), clickFruit(4), guardrail(5)
碰撞矩阵: {0:19, 1:31, 2:2, 3:18, 4:59, 5:16}
```

碰撞矩阵含义（哪些组之间会产生碰撞）：
- fruit(1) ↔ wall, obst, clickFruit, guardrail（值31 = 二进制11111）
- clickFruit(4) ↔ fruit, wall, obst, clickFruit, guardrail（值59 = 二进制111011）
- wall(2) ↔ fruit, clickFruit（值2 = 二进制00010）

### 6.2 资源分包

8 个主题分包，每个对应一类水果/元素：

| 分包 | 主题 |
|------|------|
| `animals` | 动物（企鹅、熊猫、狐狸、狮子...）|
| `candies` | 糖果 |
| `fruits` | 水果（苹果、西瓜、葡萄...）|
| `game` | 游戏核心资源 |
| `seaAnimals` | 海洋动物（海豚、海龟、章鱼...）|
| `secondary` | 次要元素 |
| `sweets` | 甜品 |
| `vegetable` | 蔬菜 |

### 6.3 核心类/模块

从解码的 `chunks:///_virtual/*.ts` 路径还原出的源码类：

| 类名 | 职责 |
|------|------|
| `GameMgr.ts` | 游戏主管理器 |
| `GameMsg.ts` | 游戏消息/事件 |
| `GbzEnum.ts` | 枚举定义 |
| `AbMgr.ts` | AB 测试管理器（A/B Test）|
| `BgCtrCom.ts` | 背景控制组件 |
| `ChuiziCom.ts` | 锤子道具组件 |
| `DragFruit.ts` | 拖拽水果逻辑 |
| `CusReport.ts` | 自定义上报 |
| `FruitComp.ts` | 水果组件 |
| `AudioEngine.ts` | 音频引擎 |
| `DecryptUtil.ts` | 解密工具 |
| `DataManager.ts` | 数据管理器 |
| `FruitConfig.ts` | ★水果配置（难度参数）|
| `CCPoolManager.ts` | 对象池管理 |
| `GbzAviseLayer.ts` | 提示层 |
| `FruitBookComp.ts` | 水果图鉴组件 |
| `GbzResManager.ts` | 资源管理器 |
| `AdPlatformBase.ts` | 广告平台基类 |
| `CalculatedInfo.ts` | ★计算信息（难度计算缓存）|
| `GbzDataManager.ts` | 游戏数据管理 |
| `EventDispatcher.ts` | 事件分发器 |
| `GbzAudioManager.ts` | 音频管理 |
| `GbzCarMoveLayer.ts` | 车移动层 |
| `GbzLoseFullLayer.ts` | 失败满层 |
| `GbzFruitBookLayer.ts` | 水果图鉴层 |
| `GbzFruitDownLa...` | 水果下落层 |
| `GbzPropSpecialLayer.ts` | 特殊道具层 |
| `BaseEventDispatcher.ts` | 基础事件分发 |
| `FruitPositionCalculator.ts` | ★水果位置计算器 |
| `AutoLightEffect.ts` | 自动光效 |

### 6.4 网络接口

| 接口 | 用途 |
|------|------|
| `https://api.devourad.com/Wechat/gameLogin` | 微信登录 |
| `https://api.devourad.com/Wechat/dyConversion` | 抖音转化 |
| `https://api.devourad.com/Gameinfo/getBindGame` | 获取绑定游戏信息 |
| `https://api.devourad.com/WechatGameFile/get_data` | 获取存档 |
| `https://api.devourad.com/WechatGameFile/set_data` | 保存存档 |
| `https://api.devourad.com/douyin/gameLoginNoClickId` | 抖音登录(无ClickId) |
| `https://api.datanexus.qq.com/data-nexus-trace/log` | QQ数据上报 |
| `https://cdn.devourad.com/dy/ShuiGuoShares/1.jpg` | 分享图片CDN |
| `cloudbase-4gnwt8be5f2000b2` | 微信云开发环境 |

**SDK**：`@dn-sdk/minigame v1.5.8`

---

## 七、动态布局与位置计算

### 7.1 游戏区域尺寸

```
设计分辨率: 750 × 1334
半宽 halfGameWidth = 375
半高 halfGameHeight = 667
障碍 X 范围: [-208, 208]
碰撞边界: 左 -475, 右 475
```

### 7.2 水果下落与位置

从场景 JSON 和代码标识符还原：
- `FruitDownLayer` — 水果下落层容器
- `dropLeft` / `dropRight` — 左右下落口（旋转角度约 ±14°）
- `pos1`–`pos4` — 水果生成位置点（3排 × 4列网格）
- `stakeRoot` — 桩/支架根节点
- `obstaclesRoot` — 障碍物根节点
- `boundaryLine` — 边界线
- `JointGearMgr` — 关节齿轮管理器（磁铁/连接效果）
- `squeezeCircle` — 挤压圆（水果碰撞挤压效果）

### 7.3 水果位置计算器 `FruitPositionCalculator`

该类负责根据关卡参数动态计算水果的生成位置，结合：
- `halfGameWidth` / `halfGameHeight` — 游戏区域半宽/半高
- `leftAndRightBoxWidth` — 左右盒子宽度
- 关卡配置中的坐标组（`ro[227..277]`）
- 黑洞位置选取（`levelNumber % 10`）

---

## 八、玩法机制总结

综合以上分析，该游戏是一个**水果消除/合并类小游戏**，核心机制：

1. **水果队列生成**：根据关卡配置初始化水果队列，执行非均匀随机互换（交换次数 = 水果数量）
2. **水果下落**：从顶部 `dropLeft`/`dropRight` 下落，受物理引擎（Box2D）驱动
3. **消除规则**：相同水果碰撞消除（"2个相同的水果会消除"），磁铁道具可消除一组水果
4. **黑洞机制**：
   - 每关生成最多 4 个黑洞，位置按 `levelNumber % 10` 从预设坐标组选取
   - 黑洞水果总数 A = random(14,34) + 4×(holeCount-2)
   - 两阶段生成：先随机 4 种类型（每种 2 或 4 个），再补齐至 A
5. **障碍物**：沿 Y 轴等距分布，X 随机 [-208, 208]
6. **冰冻机制**：仅影响队列第 30 个之后的水果，解冻次数与高度成正比（上限 = 水果总数/2 + 0~5 随机）
7. **难度调整**：通过 `lv2Config`~`lv9Config` 分级配置，结合 `num100Base`/`num100Add`/`num100Reduce` 等参数动态调整水果数量、类型、缩放比例
8. **多模式**：支持冒险、挑战、日常等模式（`challengeCount`、`dayAdNumDatas`、`stopFruitDownY_day`）

---

## 九、反混淆脚本

本次分析使用的反混淆脚本保存在 `fruits_unpacked/analysis/` 目录：

| 脚本 | 功能 |
|------|------|
| `parse_modules.js` | 解析 36 个模块结构，定位混淆函数 |
| `find_obf_region.js` | 定位混淆区域所在模块 |
| `decode_strings.js` | 解码 41 个 `Qs()` 反转字符串 |
| `extract_rules.js` | 解码 `ro[]` 数组，提取规则文本 |
| `find_difficulty.js` | 搜索难度相关标识符 |
| `find_config_funcs.js` | 查找配置对象和难度函数 |
| `extract_gameplay.js` | 提取玩法代码区域 |
| `analyze_logic.js` | 分析逻辑结构 |
| `final_search.js` | 最终搜索关卡配置和算法 |

### 反混淆方法总结

1. **字符串还原**：定位 `Qs()` 调用，反转字符串内容
2. **分块还原**：对 `to[k]` 使用对应分块长度 `.s(n)` 还原标识符数组
3. **常量解码**：复制 `ro()` 函数解码 `no` 字符串得到 274 个数值
4. **谓词折叠**：将所有 `Fs`/`Bs`/`zs`/.../`Zs`（=1）代入算术表达式简化
5. **别名还原**：将单字母变量替换回 `to[k][j]` 或 `ro[n]` 形式
6. **完整 Babel 插件**（建议后续实现）：自动执行上述 1-5 步，生成可读代码

---

*本分析基于静态反混淆，部分函数体因深度别名化和控制流混淆未能完全还原。建议后续使用 Babel AST 变换实现自动化反混淆以获取完整可读源码。*
