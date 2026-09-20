import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  platform: "browser",
  target: "es2020",
  format: "cjs",
  external: ["obsidian", "electron", "@codemirror/*", "@lezer/*"],
  loader: { ".txt": "text" },
  sourcemap: "inline",
  outfile: "dist/main.js",
  logLevel: "info"
});
