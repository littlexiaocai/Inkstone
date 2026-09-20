# RIME 中文输入（Obsidian 插件原型）

这个插件在 Obsidian 编辑器内部运行独立的 RIME 拼音引擎，用于绕过 iPadOS 27 系统中文拼音输入的延迟。

## 当前功能

- iPad 和桌面版 Obsidian 均可加载（不是桌面专用插件）
- 全拼简体中文
- 候选词栏跟随光标；空格/数字选词、退格和方向键
- 中英切换三条路：单独按一下 Shift（外接键盘）、`Cmd/Ctrl+Shift+Space`、点击状态栏的“RIME 中”
- 命令面板中的“切换 RIME 中文输入”命令
- 命令面板中的“诊断报告”：环境、初始化耗时、按键捕获统计和最近事件轨迹

## iPad 上怎么切英文

屏幕键盘的 Shift 一般不把事件发给网页，所以软键盘下用 Obsidian 自己的出口：

**设置 → 移动端 → 管理工具栏选项**，把「切换 RIME 中文输入」加进去，键盘正上方就有一键切换。

外接键盘直接按 Shift。

## 安装

将发布包中的 `main.js`、`manifest.json`、`styles.css` 放入 Vault 的：

`.obsidian/plugins/rime-input/`

然后重启 Obsidian，在“设置 → 第三方插件”中启用“RIME 中文输入”。iPad 系统键盘必须切换到英文 ABC。

首次启动需要联网下载 RIME 运行资源和简体拼音词库（来自 jsDelivr CDN），之后词库数据会缓存在 Obsidian 的 WebView 数据中。离线首次安装目前不可用。

## 验证状态（0.4.0）

已实机验证：

- **iPad**：M1 iPad Pro / iPadOS 27 / 外接键盘 / 系统输入源为英文 ABC，中文输入流畅。核心产品假设成立——在编辑器内拦截硬件键盘事件、用独立 RIME 引擎出候选，可以绕开系统拼音路径的卡顿。
- **桌面（macOS）**：候选栏跟随光标、空间不足时翻到上方、空格上屏一次不重复、Shift 中英切换、诊断报告。

尚未验证：

- iPad **屏幕键盘**。插件只挂 `keydown`，而 iOS 软键盘未必给出可用的 `key` 值。软键盘下的中英切换目前只能靠 Obsidian 移动端工具栏按钮。
- 冷启动无网络 / CDN 不可达时的表现。

## 已知限制

- 启动前有一次网络探测，会重复下载引擎脚本，拖慢冷启动。
- 诊断报告的事件轨迹会记录真实按键字符，复制外发前请自行检查。
- 输入拦截挂在 `document` 捕获层，绕开了 CodeMirror 的扩展优先级体系，可能与其他插件的快捷键冲突。
- 失焦、切换笔记、鼠标移动光标、切换窗格时的组合态重置尚不完整。
- 暂未处理所有 Markdown 快捷键、候选翻页按钮和用户设置界面。
- 插件依赖 My RIME 0.10.9 的 WebAssembly Worker。源项目采用 AGPL-3.0-or-later 许可，本插件也以同一许可发布。

## 上游项目

- My RIME: https://github.com/LibreService/my_rime
- RIME: https://rime.im/
