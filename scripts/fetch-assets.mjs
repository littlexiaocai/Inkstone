/**
 * 把 RIME 引擎与词库抓到本地，供构建期内嵌。
 *
 * 砚台运行时不联网：引擎（rime.js / rime.wasm / rime.data）和方案文件全部
 * 随 main.js 一起分发。这个脚本是「上游包 → 内嵌资源」这一步的可复现过程。
 *
 *   node scripts/fetch-assets.mjs
 *
 * 二进制一律 gzip（esbuild 以 binary loader 内嵌，运行时用 DecompressionStream
 * 解开）。rime.js 保持原文不压缩——它是可执行 JS，压成不透明串只省几十 KB，
 * 却会让人工审核无从判断内容。
 *
 * 每个文件的 sha256 记入 ASSETS.json；构建时会比对，对不上直接失败。
 */
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MY_RIME = "0.10.9";
const SCHEMA_PKGS = {
  // pinyin_simp 依赖 stroke（笔画反查），两套都要带上
  "pinyin-simp": "0.1.1",
  stroke: "0.1.3"
};

const OUT = path.join(import.meta.dirname, "..", "src", "assets");

/** @type {{url: string, out: string, gzip: boolean}[]} */
const TARGETS = [
  { file: "rime.js", gzip: false, as: "rime.js.txt" },
  { file: "rime.wasm", gzip: true },
  { file: "rime.data", gzip: true }
].map((t) => ({
  url: `https://cdn.jsdelivr.net/npm/@libreservice/my-rime@${MY_RIME}/dist/${t.file}`,
  out: t.as ?? t.file + (t.gzip ? ".gz" : ""),
  gzip: t.gzip
}));

for (const [pkg, version] of Object.entries(SCHEMA_PKGS)) {
  const stem = pkg.replace("-", "_");
  for (const file of [`${stem}.schema.yaml`, `${stem}.prism.bin`, `${stem}.table.bin`, `${stem}.reverse.bin`]) {
    TARGETS.push({
      url: `https://cdn.jsdelivr.net/npm/@rime-contrib/${pkg}@${version}/${file}`,
      out: file + ".gz",
      gzip: true
    });
  }
}

await mkdir(OUT, { recursive: true });

const manifest = { myRime: MY_RIME, schemas: SCHEMA_PKGS, files: {} };
let rawTotal = 0;
let outTotal = 0;

for (const target of TARGETS) {
  const res = await fetch(target.url);
  if (!res.ok) throw new Error(`下载失败 ${res.status} ${target.url}`);
  const raw = Buffer.from(await res.arrayBuffer());
  const body = target.gzip ? gzipSync(raw, { level: 9 }) : raw;

  await writeFile(path.join(OUT, target.out), body);

  manifest.files[target.out] = {
    url: target.url,
    bytes: raw.length,
    stored: body.length,
    sha256: createHash("sha256").update(raw).digest("hex")
  };

  rawTotal += raw.length;
  outTotal += body.length;
  const mb = (n) => (n / 1024 / 1024).toFixed(2);
  console.log(`  ${target.out.padEnd(28)} ${mb(raw.length).padStart(6)}M → ${mb(body.length).padStart(6)}M`);
}

await writeFile(path.join(OUT, "ASSETS.json"), JSON.stringify(manifest, null, 2) + "\n");

const mb = (n) => (n / 1024 / 1024).toFixed(2);
console.log(`\n  合计 ${mb(rawTotal)}M → 内嵌 ${mb(outTotal)}M（base64 后约 ${mb((outTotal * 4) / 3)}M）`);
