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

首次启动需要联网下载 RIME 运行资源和简体拼音词库，之后词库数据会缓存在 Obsidian 的 WebView 数据中。

## 原型限制

- 这是用于实机验证输入延迟的原型，当前 0.3.0。桌面端（macOS + 外接键盘）已验证：候选、选词、上屏一次、诊断报告。
- **iPad 尚未验证。** 插件只挂 `keydown`；iPadOS 屏幕键盘在 WebView 里是否给出可用的 `key` 值还没上机测过。
  0.3.0 加了被动事件探针，会把 `keydown` / `beforeinput` / `composition*` 的原始字段记进诊断报告，用来在 iPad 上判定这件事。探针只记录，不改变任何行为。
- 暂未处理所有 Markdown 快捷键、鼠标移动光标后的组合态、翻页按钮和用户设置界面。
- 插件依赖 My RIME 0.10.9 的 WebAssembly Worker。源项目采用 AGPL-3.0-or-later 许可，本插件也以同一许可发布。

## 上游项目

- My RIME: https://github.com/LibreService/my_rime
- RIME: https://rime.im/
