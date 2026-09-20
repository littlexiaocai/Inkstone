import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  platform: "browser",
  target: "es2020",
  format: "cjs",
  external: ["obsidian", "electron", "@codemirror/*", "@lezer/*"],
  loader: { ".txt": "text" },
  // 发布产物不带 sourcemap：内联会把全部源码 base64 塞进 main.js，
  // 插件要装到 iPad 上，体积直接翻倍不值当。调试时加 --dev。
  sourcemap: process.argv.includes("--dev") ? "inline" : false,
  outfile: "dist/main.js",
  logLevel: "info"
});
