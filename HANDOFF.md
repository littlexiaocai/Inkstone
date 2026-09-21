# Just Type · 就打个字 / Just Type IME —— 交接文档

写给接手这个项目的人（或 AI）。截至 2026-09-21，`main` 在 `fcc14c2`，Release **0.7.11** 已发布。版本按 0.01 递增（用户明确要求，不跳大版本）。

本文档的组织原则：**区分「已验证」和「写完了但没验」**。这个项目里绝大多数坑，
都来自把后者当成前者。下面每一条都标了验证方式。

---

## 1. 这是什么，为什么存在

Obsidian 插件。在编辑器内部接管按键，用本地 RIME 引擎完成拼音转换和上屏，
**绕开系统中文输入法**。

要解决的现象：在特定 iPadOS 环境下，系统拼音配合外接键盘打字有可见延迟。

> **不要在文档里断言延迟的根因。** 早期用 `log show --signpost` 采到的键盘埋点
> 曾指向自动改正环节（`generateAutocorrections.async`，中位 100ms+），但后续
> 对照测试没能复现稳定因果。README 现在只陈述可观察现象，请保持这个口径。

目标场景：**iPad + 外接键盘**。桌面版能加载（开发期间一直在 macOS 上验证），
但那个延迟问题只在 iPad 上存在。

---

## 2. 当前状态

| 项 | 值 |
|---|---|
| 工作分支 | `main`（`fcc14c2`，已推送）。历史分支名 `offline-0.8.0` 已合入 |
| 版本 | **0.7.11** |
| GitHub `main` | `fcc14c2`（已推送） |
| 最新 Release | **0.7.11**（离线版；目录名 Just Type IME） |
| `dist/main.js` | 6.6 MB（完全内嵌引擎与词库） |
| 对外名称 | Just Type · 就打个字（目录名 `Just Type IME`）。插件 id 是 `just-type` |
| 仓库 | https://github.com/littlexiaocai/just-type （公开，AGPL-3.0-or-later） |

**版本号规则**：每次按 **0.01** 递增，`0.7.9 → 0.7.10 → 0.7.11`，不要跳 0.8 之类的大版本
（这是用户明确要求的）。四处要同步：`manifest.json`、`package.json`、
`src/main.ts` 的 `PLUGIN_VERSION`、`versions.json`。

---

## 3. 架构与关键决策

### 3.1 输入拦截

`document` 上的 `keydown` 捕获层（`registerDomEvent(document, "keydown", ..., true)`）。
命中就 `preventDefault` + `stopImmediatePropagation`，再把按键喂给 RIME Worker，
结果用 `editor.replaceSelection()` 写入。

> 这绕开了 CodeMirror 的扩展优先级体系，可能与其他插件的快捷键冲突。
> 迁移到 `Prec.highest(EditorView.domEventHandlers(...))` 是个待办，但**不要轻易动**：
> 这是整个插件唯一被实机验证过的关键路径。

### 3.2 三种输入模式

`chinese | english | emoji`。

- **Shift**（可在设置里改成 Control / Option / Command / 关闭）只在 **中 ↔ 英** 之间切。
  表情**不在**这个循环里——三态循环要按两下才回到中文，与其他输入法的肌肉记忆冲突。
- **英文模式下插件完全透明**：不拦截任何按键，打出什么取决于系统输入源。
- 表情模式由独立命令进入，在表情模式下按切换键直接回中文。

### 3.3 完全离线（0.7.11 的核心改动）

引擎与词库在构建期内嵌进 `main.js`，**运行时不发任何网络请求**。

```
scripts/fetch-assets.mjs   从固定版本的上游包抓 11 个文件 → src/assets/
                           二进制 gzip；rime.js 保持原文（见下）
                           来源 URL 与 sha256 记入 src/assets/ASSETS.json
esbuild                    .gz → binary loader，.txt → text loader
src/assets.ts              运行时用 DecompressionStream 解压
buildLocalResolver()       注入 Worker 的本地资源解析器
```

**解析器怎么工作**（`src/main.ts` 里的 `buildLocalResolver`）：

主线程先解压资源、为每个资源建 Blob URL，把「文件名 → Blob URL」的映射**写死进
Worker 源码**。Worker 里的 shim 只做一件事：把上游拼出的 CDN 地址换成对应的本地
Blob URL，然后调**原生**的 `importScripts` / `fetch`。

三条必须保持的约束：

1. **映射里没有就立刻抛错，绝不回落网络。** 留回落等于远程代码路径还在，
   Obsidian 的自动审核针对的就是这个；而且失败会变成难查的静默降级。
2. **不用消息传递。** 最初实现成「主线程 postMessage 送资源」，踩了竞态：
   `importScripts` 是同步的，资源还没落地就被调用。Blob URL 方案没有先后顺序，
   也就没有竞态。
3. **`rime.js` 保持原文，不压缩。** 一大段 gzip+base64 的可执行 JS 在人工审核眼里
   就是混淆代码，为省 80 KB 换来解释成本不划算。

`main.js` 里**仍然能 grep 到 jsDelivr 字样**——那是内嵌的上游 worker 原文里的字符串，
我们没有改第三方代码。它们是死的：两个出口都被接管。审核者可以自己读
`buildLocalResolver` 验证。

### 3.4 内嵌了什么，多大

| | 原始 | 内嵌 |
|---|---:|---:|
| `rime.js`（原文） | 0.11 MB | 0.11 MB |
| `rime.wasm` + `rime.data` | 3.81 MB | 1.37 MB |
| `pinyin_simp` 四件套 | 1.58 MB | 0.72 MB |
| `stroke` 四件套 | 6.01 MB | 2.71 MB |
| **合计** | **11.52 MB** | **4.91 MB** → base64 后 `main.js` 6.6 MB |

**`pinyin_simp` 依赖 `stroke`**（反引号笔画反查），这是 Worker 里硬编码的依赖表
（`pinyin_simp: ["stroke"]`）。`stroke` 占了内嵌体积一半以上。

删掉它能把 `main.js` 压到约 3.1 MB，但要同时改两处：Worker 里那张**压缩过的**
依赖表（变量名是 `bi` 这种），以及给 `pinyin_simp.schema.yaml` 打构建期补丁删掉
`reverse_lookup` 相关块。用户**明确选择保留**笔画反查（方案 C），所以这条没做。
如果将来要做，补丁必须带断言：打不上就让构建失败，而不是悄悄产出一个会联网的包。

---

## 4. 已完成且已验证

「验证」= 在真机上看到了预期结果，不是读代码推断的。

### iPad 实机（M1 iPad Pro / iPadOS 27.0 / Obsidian 1.13.7 / 妙控键盘）

- 外接键盘下中文输入流畅，核心产品假设成立
- **0.7.11 离线版冷启动 178ms**（解压 35ms）。比 Mac 的 305ms 还快——
  6.6 MB 的体积代价在 M1 iPad 上实测不存在
- `引擎就绪 = true`、`初始化错误 =（无）`、`截获 222` 次真实按键
- 地球键调出的系统表情面板能稳定进入文档（0.7.7 起由插件接管）

### 桌面（macOS）

- 候选栏跟随光标；空间不足时翻到光标上方
- 空格上屏一次，不重复（字符数 +2 核对过）
- 数字 1-7 选词、点击候选上屏、无匹配空状态
- 表情模式关键词搜索：`xiao` → 😀😄😁，`huo` → 🔥🚀
- Shift 循环：中 → 英 → 中；从表情模式按 Shift 回中文
- 系统输入法接管时的提示；切回英文后的「已就绪」提示
- **0.7.11 离线路径**：解析器只解析出本地资源、零网络请求、零报错，
  `yanchi` 出候选、空格上屏「延迟」一次

### 工程

- `npm ci` / `tsc --noEmit` / 生产构建 全部通过
- 诊断报告可写入 Vault，随 Obsidian Sync 跨设备（这是 iPad 排查的**主要工具**，
  见 §7）

---

## 5. 已完成但**未**验证

接手后若要动这些区域，先补验证。

| 项 | 为什么没验 |
|---|---|
| **iPad 飞行模式冷启动** | 用户报告同步成功并给了报告，但**没确认当时是否开了飞行模式** |
| **干净环境首装** | Worker 会把方案文件缓存在 IndexedDB。iPad 上跑过旧版，缓存存在，可能替内嵌词库兜底。要彻底排除需要一台没装过就打个字的设备 |
| **设置页下拉框的实际渲染** | Obsidian 设置窗口截图被工具拒绝，只做了静态核对 |
| **中英切换键改成 Control / Option / Command** | 只验了默认的 Shift |
| **表情模式在 iPad 上** | 只在 macOS 验过 |
| **退格改表情查询** | `app_key` 的退格走 AX 通道，在该元素上失败，测不了 |

---

## 6. 未完成（按建议顺序）

### P0 —— 上架前必须做

1. **修两个数据正确性边界**（来自 Codex 审核第 6 项）— **代码已改；桌面已验切笔记不写入、空格上屏一次；iPad 地球键表情未复测**
   - 异步结果带着按键时的 `editorGeneration`。`active-leaf-change`、`file-open`、
     编辑器 `focusout`（焦点不是候选栏）会 `invalidateEditorContext`：generation +1、
     取消组合、作废在途结果。`applyResult` 对不上 generation 就丢弃。
   - `isPickerChar()` 改为 Unicode 表情属性（`Extended_Pictographic` / 国旗 / 键帽），
     并显式排除 CJK 和 `\p{L}`（含 é ü）。Node 侧用例过了；iPad 地球键表情未复测。

2. **摘掉解析器里的两行 `console.log`** — **已做**（`buildLocalResolver` 的
   `importScripts` / `fetch` 不再打印）。

3. **合上 `main` 并发布 0.7.11** — **已做**（`fcc14c2`，tag `0.7.11`，无 `v` 前缀）。
   Release：https://github.com/littlexiaocai/just-type/releases/tag/0.7.11
   资产含独立文件 `main.js` / `manifest.json` / `styles.css`，以及 zip。

### P1 —— 提交社区目录

提交入口是 **community.obsidian.md**（登录后关联 GitHub 账号），**不再是**给
`obsidian-releases` 提 PR。仓库侧已就绪（id/name 在 7877 个已上架插件里不撞名，
Release `0.7.11` 资产齐全）。剩下的是作者用 Obsidian 账号登录并提交仓库
https://github.com/littlexiaocai/just-type 。

已经满足的硬性要求（都核过）：

- `manifest.name` 必须是 Basic Latin → 已改为 `Just Type IME`（中文名「就打个字」用于 README、
  设置页、命令、提示文案）
- `description` ≤250 字符且以 ASCII 句号结尾 → 已改
- `id` 不含 `obsidian`、不以 `plugin` 结尾 → `just-type`
- 命令 id 不含插件 id → 符合
- 不用 `innerHTML` / `outerHTML` / 全局 `app` → 符合
- 不给命令设默认快捷键 → 0.7.11 已移除
- `isDesktopOnly: false` 且未用 Node/Electron API → 符合
- 根目录有 README / LICENSE / manifest.json → 齐全

**最大的历史风险已解除**：0.7.x 在运行时从 jsDelivr 下载并执行 `rime.js` 和
`rime.wasm`，这是审核明确针对的远程代码执行。0.7.11 完全内嵌后不再有这条路径。

### P2 —— 工程化

- GitHub Actions：`npm ci` + 类型检查 + 可复现构建 + Release 资产
- 自动化测试：断网冷启动、`yanchi` 首候选含「延迟」、空格只上屏一次、
  切笔记不写入旧编辑器、各种切换键
- 迁移到 CodeMirror 原生事件层（`Prec.highest`），**先建回归测试再动**
- 组合态生命周期：失焦、切笔记、鼠标移动光标、切窗格时的重置

### P3 —— 产品决策，需要用户拍板

- 是否给「切换表情模式」绑快捷键（目前只能从命令面板进）
- 是否保留内嵌表情模式。用户的口径是**不强调**它（日常用系统地球键），但功能保留
- 是否删掉 `stroke` 换取体积（见 §3.4）

---

## 7. 血的教训（**这一节最值钱，请读完**）

### 7.1 排查方法

**iPad 上的问题，不要靠用户转述。** 插件有命令「诊断：把报告存进 Vault
(save report)」，报告写成笔记后随 Obsidian Sync 回到电脑，可以直接读。这是这个
项目最有用的工具，是被逼出来的——在它之前，隔着设备根本没有可读的对象
（诊断数据只存在于运行时内存，不落盘、不进系统日志）。

**猜测的代价很高。** 本项目里我连续猜错两次：先归因于「装了两份插件」，
再归因于「iOS 自动改正」，都错了。真相都是诊断报告直接给出的。
**先取数据，再下结论。**

### 7.2 具体陷阱

- **两个独立的中英开关**：系统输入源（`Ctrl+空格` / 🌐）和就打个字模式（Shift）。
  系统键盘一旦是中文，按键在到达插件前就被吃掉，就打个字**在任何模式下都不工作**。
  用户报的「只有英文模式有问题」几乎都是这个。

- **iOS 上 composition ≠ 中文输入法**。自动改正、预测输入打普通英文时同样走
  composition。0.7.2 拿「有 composition 事件」当判据，在 iPad 上疯狂误报。
  现在的判据是 **`compositionend` 且提交内容含汉字**——自动改正提交 ASCII，
  中文输入法提交汉字。

- **不要做「凭记忆」的提醒**。0.7.2 有一条「切进英文模式时，若 10 分钟内见过中文
  输入法就提前提醒」，输入源随时会变，记忆必然过期，必然误报。0.7.8 删掉了。
  **只在当下真的发生时提醒。**

- **上游 `Module.printErr` 有 bug**，会吞掉真正的引擎错误：它用不带锚点的
  `match(/[EWID]\S+ \S+ \S+ (.*)/)` 再取 `{E,W,I,D}[msg[0]]`，消息不以这四个字母
  开头时取到 `undefined` 直接抛。解析器里已包了一层堵住。**这个坑让我多花了两轮
  才看到真错误。**

- **`rime.wasm` 的 Blob 必须是 `application/wasm`**，否则 `compileStreaming` 报
  MIME 错并退回较慢的 ArrayBuffer 路径。

- **命令名必须带 ASCII 别名**。排查时系统键盘是英文，打不出中文就在命令面板里
  搜不到纯中文命令名。现在每条命令都带 `(toggle)` `(report)` `(trace)` 这样的后缀。

- **提示文案要围绕「就打个字还工作吗」，不是「你在哪个模式」**。用户需要知道工具灵不灵，
  不是自己处在哪一档。只有两种状态值得说：系统键盘是中文（就打个字被架空）、
  系统键盘是英文（就打个字正常，切模式不该夹带任何叮嘱）。

### 7.3 自动化测试环境的坑（用 computer-use 驱动 Obsidian 时）

- **`AXPress` 只聚焦，不移动光标**。「点某一行再打字」实际会打在文档原光标处。
  要移动光标得用键盘（`Cmd+↓` 之类）。
- 点击候选栏按钮会让焦点离开编辑器（AX 点击绕过了按钮上的 `pointerdown`
  `preventDefault`），随后的按键会被 `isEditorTarget` 挡掉。真人用鼠标/触摸没这问题。
- `app_key` 发不出「只有修饰键」的组合，所以 **Shift 切换测不了**，只能让用户按。
- Obsidian 设置窗口截图会被拒绝。

---

## 8. 构建与测试

```bash
npm ci
node scripts/fetch-assets.mjs   # 抓取引擎与词库到 src/assets/（已 gitignore）
npx tsc --noEmit -p tsconfig.json
npm run build                   # → dist/main.js
npm run build -- --dev          # 需要 sourcemap 时（发布版默认不带，见下）
```

> `esbuild.config.mjs` 默认**不生成 sourcemap**。曾经是 `inline`，把全部源码
> base64 塞进产物，体积直接翻倍——对 iPad 是纯负担。

安装到 Vault 测试：把 `dist/main.js`、`manifest.json`、`styles.css` 拷进
`<vault>/.obsidian/plugins/just-type/`，然后在 Obsidian 里重新加载。

**桌面测试前务必确认系统输入法是英文 ABC**，否则按键会被系统输入法吃掉，
你会得到一堆莫名其妙的现象（本项目在这上面浪费了好几轮）。

---

## 9. 文件地图

```
src/main.ts                  插件主体。输入拦截、模式、候选栏、诊断、设置页、
                             buildLocalResolver（本地资源解析器）
src/assets.ts                内嵌资源的 import 与解压
src/emoji.ts                 269 条内置表情词库（英文 + 拼音关键词）
src/vendor/my-rime-worker.txt  上游 Worker 原文，**不要修改**
src/assets/ASSETS.json       内嵌资源的来源 URL 与 sha256（入库）
src/assets/*.gz, *.txt       构建期生成（已 gitignore）
scripts/fetch-assets.mjs     资源抓取管线
THIRD_PARTY_NOTICES.md       第三方组件与许可证清单
UPSTREAM.md                  上游归属与内嵌说明
```

**许可证**：就打个字以 AGPL-3.0-or-later 发布。内嵌的三块各不相同——
My RIME（AGPL-3.0-or-later）、rime-pinyin-simp（Apache-2.0）、
rime-stroke（**LGPL-3.0-only**）。完全内嵌意味着每个 Release 都在再分发它们，
动内嵌内容时必须同步更新 `THIRD_PARTY_NOTICES.md`。
