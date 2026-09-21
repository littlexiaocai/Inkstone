# Just Type · 就打个字

## Why

Just Type is an Obsidian Chinese IME for iPad hardware keyboards. It bypasses the long-standing lag of the system Pinyin IME inside Obsidian.

I only wanted to write Chinese with a keyboard on iPad. I ended up writing an input method first. It only improves typing in Obsidian; it cannot fix the system IME. Other iPad apps still have to wait for Apple.

This is the workaround I made for myself. I hope it becomes unnecessary soon.

### 为什么会有这个项目

Just Type 是一个面向 iPad 外接键盘的 Obsidian 中文输入插件，用来绕开长期存在的中文输入卡顿问题。

我本来只是想在 iPad 上用外接键盘，好好写点中文。没想到，写笔记之前，还得先写个输入法。

不过，它只能改善 Obsidian 内的输入体验，无法修复系统输入法。至于 iPad 上的其他应用，还是得继续等——等，等苹果解决。

这是我给自己想的办法。**希望它早日用不上。**

拼音引擎用 [RIME](https://rime.im/)，通过 [My RIME](https://github.com/LibreService/my_rime) 的 WebAssembly 构建。

## How to use

**iPad + hardware keyboard.** That is the problem this plugin exists to solve, and the setup that has been tested on a real device.

1. Switch the system keyboard to **English ABC**. Just Type takes over and you can type Chinese.
2. Switch the system keyboard back to Pinyin, and Just Type steps aside. Keystrokes go to the system IME.
3. Press **Shift** (tap it alone) to toggle Chinese and English inside Just Type. You can change this key in plugin settings.

### 适用范围

**iPad + 外接键盘**。这是它要解决的场景，也是实机验证过的场景。

### 怎么用

**1. 把系统键盘切到英文 ABC** — Just Type 随即接手，可以打中文了。

**2. 系统键盘切回拼音，Just Type 自动让位** — 按键归系统输入法，Just Type 停止工作。

**3. 按 Shift 切中英文** — 单独按一下，中间不夹别的键。切换键可以在插件设置里改成 Control / Option / Command，或者关掉只用命令。

两种状态 Just Type 都会主动告诉你：

- 接手时：「Just Type 已就绪——按 Shift 在中英文之间切换」
- 让位时：「系统键盘切到中文了，Just Type 已停止工作——按键现在归系统输入法」

### 为什么会有「让位」

系统键盘的中英切换（`Ctrl+空格`）和 Just Type 的中英切换（Shift）是**两个独立的开关**。系统键盘一旦切到拼音，按键在到达插件之前就被系统输入法吃掉了，Just Type 在此模式下不工作。

### iPad 屏幕软键盘

可以使用相同的逻辑操作。由于本输入法主要针对外接键盘使用，如果高频使用屏幕软键盘，可以在系统里暂时关闭此输入法。

## Installation

Copy `main.js`, `manifest.json`, and `styles.css` from the GitHub Release into your vault at `.obsidian/plugins/just-type/`. Restart Obsidian, then enable **Just Type IME** under Settings → Community plugins.

The plugin does not use the network at runtime. The RIME engine and dictionaries ship inside `main.js` (about 3 MB).

### 安装

把 Release 里的 `main.js`、`manifest.json`、`styles.css` 放进 Vault 的 `.obsidian/plugins/just-type/`，重启 Obsidian 后在「设置 → 第三方插件」启用 **Just Type IME**。插件内部称「就打个字」。

**运行时不联网。** RIME 引擎、引擎数据和拼音方案全部随 `main.js` 一起分发，首次启动也不需要网络。`main.js` 约 3 MB。

构建期的抓取过程见 `scripts/fetch-assets.mjs`。上游原始字节的 sha256 锁在 `src/assets/assets.lock.json`，抓取记录在 `src/assets/ASSETS.json`。

## Emoji

Use the system 🌐 **globe key** to open the emoji picker. Whether the globe key shows emoji depends on having Emoji enabled in your keyboard list, and on the hardware-keyboard setting: Settings → General → Keyboard → Hardware Keyboard → Press 🌐 to show Emoji.

### 表情

用系统的 🌐 **地球键**调出表情面板。地球键能否调出表情，取决于你的键盘列表里启用了「表情符号」，以及在实体键盘里进行设置（设置 → 通用 → 键盘 → 实体键盘 → 按下 🌐 显示表情符号）。

## Development

```
npm ci
npm run build
```

`npm run build` fetches and verifies bundled assets against `assets.lock.json` (`src/assets/*.gz` are not in git). It re-downloads only when the lock or the fetch script changes.

`npm run build` 会先按 `assets.lock.json` 校验并抓取内嵌资源（`src/assets/*.gz` 不进 git）。锁或脚本变了才会重新下载。

## Commands

Command names include English aliases, so they are searchable while the system keyboard is in English.

命令名都带英文别名，系统键盘是英文时也搜得到。

| Command | What it does | 作用 |
|---|---|---|
| 切换中英文 (toggle) | Same as Shift | 与 Shift 等价 |
| 切换表情模式 (emoji) | Built-in offline emoji input | 插件内置的离线表情输入 |
| 诊断报告 (report) | Environment, init timing, key capture stats, recent trace | 环境、初始化耗时、按键捕获统计、最近事件轨迹 |
| 诊断：把报告存进 Vault (save report) | Write a note, syncs with Obsidian Sync | 写成笔记，随 Obsidian Sync 到别的设备排查 |
| 诊断：开始/停止记录按键事件 (trace) | Tracing is off by default | 事件轨迹默认关闭，需要排查时才开 |
| 诊断：记录原始按键内容 敏感 (trace raw) | Records actual keys only when this is on | 单独开启才会记录你实际敲了什么 |

Default traces are **redacted**: `key=<letter>` / `code=<letter key>` / `kc=<content>`. Named keys (`Shift`, `Escape`, `Unidentified`) and signals (`keyCode=229`, `code=""`) are kept as-is, enough to judge keyboard behavior without reconstructing what you typed. Redaction happens at write time; turning on sensitive mode later does not expose keys already recorded.

默认记录是**脱敏**的：`key=<字母>` / `code=<字母键>` / `kc=<内容>`。具名键（`Shift`、`Escape`、`Unidentified`）和关键信号（`keyCode=229`、`code=""`）原样保留，足以判断键盘行为，但还原不出输入内容。脱敏发生在写入时刻，事后开启敏感模式不会回溯暴露已记录的按键。

## Tested

Device: iPad Pro 11-inch (M1), iPadOS 27.0, Obsidian 1.13.7, Magic Keyboard.

Verified:

- Chinese input with a hardware keyboard is smooth; the core assumption holds
- iPad on-screen software keyboard: verified
- Takeover / step-aside notices when switching the system keyboard
- Globe-key emoji lands in the document reliably

实测环境：iPad Pro 11 英寸（M1）、iPadOS 27.0、Obsidian 1.13.7、妙控键盘。

已验证：

- iPad 外接键盘下中文输入流畅，核心假设成立
- iPad 屏幕软键盘：已经验证
- 系统键盘切换时的接手 / 让位提示
- 地球键调出的表情稳定进入文档

## Known limits

- Key capture is on the `document` capture phase, which bypasses CodeMirror extension priority and may conflict with other plugins' hotkeys.
- Moving the caret with a mouse click inside the same editor does not yet reset composition. Blur, switching notes, and switching panes cancel composition and drop in-flight results.
- Not all Markdown shortcuts, candidate-page buttons, or a full settings UI are handled yet.

- 输入拦截挂在 `document` 捕获层，绕开了 CodeMirror 的扩展优先级体系，可能与其他插件的快捷键冲突。
- 同一编辑器内用鼠标点选移动光标时，组合态尚未重置。失焦、切笔记、切窗格会取消组合并作废在途结果。
- 暂未处理所有 Markdown 快捷键、候选翻页按钮和用户设置界面。

## 上游项目与许可

- My RIME: https://github.com/LibreService/my_rime
- RIME: https://rime.im/

就打个字以 **AGPL-3.0-or-later** 发布，与其内嵌的 My RIME 一致。

运行时不联网意味着仓库和每个 Release 都在再分发第三方作品。完整清单、版本与许可证见 `THIRD_PARTY_NOTICES.md`；构建期的抓取过程见 `UPSTREAM.md`。主要的两块：

| 组件 | 许可证 |
|---|---|
| My RIME 0.10.9（Worker、引擎、引擎数据） | AGPL-3.0-or-later |
| rime-pinyin-simp 方案（已裁掉笔画反查） | Apache-2.0 |
