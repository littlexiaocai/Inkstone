# 第三方组件声明

砚台（Inkstone）运行时不联网，RIME 引擎与拼音方案全部随 `main.js` 一起分发。
也就是说，本仓库和每一个 Release 都在**再分发**下列第三方作品，此文件记录它们的
出处与许可证。

构建期的抓取过程见 `scripts/fetch-assets.mjs`；每个文件的来源 URL 与 sha256
记录在 `src/assets/ASSETS.json`。

## 直接内嵌的文件

| 内嵌文件 | 来源 | 版本 | 许可证 |
|---|---|---|---|
| `src/vendor/my-rime-worker.txt` | [`@libreservice/my-rime`](https://www.npmjs.com/package/@libreservice/my-rime) 的 `dist/worker.js` | 0.10.9 | AGPL-3.0-or-later |
| `rime.js`、`rime.wasm`、`rime.data` | 同上，`dist/` | 0.10.9 | AGPL-3.0-or-later |
| `pinyin_simp.{schema.yaml,prism.bin,table.bin,reverse.bin}` | [`@rime-contrib/pinyin-simp`](https://www.npmjs.com/package/@rime-contrib/pinyin-simp)，源自 [rime/rime-pinyin-simp](https://github.com/rime/rime-pinyin-simp) | 0.1.1 | Apache-2.0 |
| `stroke.{schema.yaml,prism.bin,table.bin,reverse.bin}` | [`@rime-contrib/stroke`](https://www.npmjs.com/package/@rime-contrib/stroke)，源自 [rime/rime-stroke](https://github.com/rime/rime-stroke) | 0.1.3 | **LGPL-3.0-only** |

许可证全文随仓库分发：

- `THIRD_PARTY_LICENSE_My_RIME.txt`（AGPL-3.0）
- `THIRD_PARTY_LICENSE_rime-pinyin-simp.txt`（Apache-2.0）
- `THIRD_PARTY_LICENSE_rime-stroke.txt`（LGPL-3.0）

> `stroke` 是 `pinyin_simp` 的依赖，用于反引号触发的笔画反查。它是砚台内嵌体积
> 最大的一块（原始 6.01 MB）。若将来决定去掉笔画反查，这一项及其许可证声明
> 应一并移除。

## 通过 rime.wasm / rime.data 间接包含的组件

`rime.js`、`rime.wasm` 和 `rime.data` 是 [My RIME](https://github.com/LibreService/my_rime)
项目的 WebAssembly 构建产物，其中静态包含了下列上游库。砚台没有单独获取或修改
它们，只是原样再分发 My RIME 的构建结果：

- [librime](https://github.com/rime/librime) —— RIME 输入法引擎本体
- [OpenCC](https://github.com/BYVoid/OpenCC) —— 简繁转换
- [Lua](https://www.lua.org/) 与 [librime-lua](https://github.com/hchunhui/librime-lua) —— 方案脚本扩展
- [Boost](https://www.boost.org/)
- [LevelDB](https://github.com/google/leveldb)
- [marisa-trie](https://github.com/s-yata/marisa-trie)
- [yaml-cpp](https://github.com/jbeder/yaml-cpp)

这些组件各自的许可证以其上游项目的声明为准。My RIME 以 AGPL-3.0-or-later 分发
其构建产物，砚台随之以同一许可证再分发。

## 砚台自身

砚台以 **AGPL-3.0-or-later** 发布，与其内嵌的 My RIME 一致。完整文本见 `LICENSE`。
