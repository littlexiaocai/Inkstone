/**
 * 把 RIME 引擎与拼音方案抓到本地，供构建期内嵌。
 *
 * 就打个字运行时不联网。这个脚本是「上游包 → 内嵌资源」的可复现过程。
 *
 *   node scripts/fetch-assets.mjs
 *
 * 下载到的原始字节必须与 src/assets/assets.lock.json 的 sha256 一致，
 * 对不上直接失败。锁文件不会被本脚本改写。
 *
 * pinyin_simp 会裁掉笔画反查（stroke / luna_pinyin 传递依赖），因为产品
 * 只用拼音。补丁必须对原文精确命中一次，上游变了就失败。
 *
 * 二进制 gzip 后内嵌；rime.js 保持原文不压缩，方便审核阅读。
 */
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const OUT = path.join(ROOT, "src", "assets");
const LOCK_PATH = path.join(OUT, "assets.lock.json");
const STAMP_PATH = path.join(OUT, ".lock-applied");

const lock = JSON.parse(await readFile(LOCK_PATH, "utf8"));

/** @type {{url: string, out: string, gzip: boolean, patch?: (raw: Buffer) => Buffer}[]} */
const TARGETS = [
  { file: "rime.js", gzip: false, as: "rime.js.txt" },
  { file: "rime.wasm", gzip: true },
  { file: "rime.data", gzip: true }
].map((t) => ({
  url: `https://cdn.jsdelivr.net/npm/@libreservice/my-rime@${lock.myRime}/dist/${t.file}`,
  out: t.as ?? t.file + (t.gzip ? ".gz" : ""),
  gzip: t.gzip
}));

for (const [pkg, version] of Object.entries(lock.schemas)) {
  const stem = pkg.replace("-", "_");
  for (const file of [`${stem}.schema.yaml`, `${stem}.prism.bin`, `${stem}.table.bin`, `${stem}.reverse.bin`]) {
    TARGETS.push({
      url: `https://cdn.jsdelivr.net/npm/@rime-contrib/${pkg}@${version}/${file}`,
      out: file + ".gz",
      gzip: true,
      patch: file.endsWith(".schema.yaml") ? patchPinyinSimpSchema : undefined
    });
  }
}

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

function replaceOnce(haystack, needle, replacement, label) {
  const n = haystack.split(needle).length - 1;
  if (n !== 1) {
    throw new Error(`pinyin_simp.schema.yaml 补丁「${label}」应命中 1 次，实际 ${n}`);
  }
  return haystack.replace(needle, replacement);
}

function patchPinyinSimpSchema(raw) {
  let yaml = raw.toString("utf8");
  yaml = replaceOnce(yaml, "    - reverse_lookup_translator\n", "", "reverse_lookup_translator");
  yaml = replaceOnce(yaml, '    reverse_lookup: "`[a-z]*\'?$"\n', "", "recognizer reverse_lookup");
  yaml = replaceOnce(
    yaml,
    [
      "reverse_lookup:",
      "  dictionary: stroke",
      "  enable_completion: true",
      "  preedit_format:",
      '    - "xlit/hspnz/一丨丿丶乙/"',
      '  prefix: "`"',
      '  suffix: "\'"',
      '  tips: "〔笔画〕"',
      ""
    ].join("\n"),
    "",
    "reverse_lookup block"
  );
  yaml = replaceOnce(yaml, "  dependencies:\n    - stroke\n", "", "schema.dependencies");
  if (yaml.includes("stroke") || yaml.includes("reverse_lookup")) {
    throw new Error("裁剪后的 pinyin_simp.schema.yaml 仍含 stroke 或 reverse_lookup");
  }
  return Buffer.from(yaml, "utf8");
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

const scriptSource = await readFile(new URL(import.meta.url), "utf8");
const stamp = sha256(Buffer.concat([await readFile(LOCK_PATH), Buffer.from(scriptSource)]));
const outputs = TARGETS.map((t) => t.out);
const haveAll = (await Promise.all(outputs.map((f) => exists(path.join(OUT, f))))).every(Boolean);
const prevStamp = (await exists(STAMP_PATH)) ? (await readFile(STAMP_PATH, "utf8")).trim() : "";

if (haveAll && prevStamp === stamp && !process.env.JUST_TYPE_FORCE_FETCH) {
  console.log("assets lock 未变，跳过抓取");
  process.exit(0);
}

await mkdir(OUT, { recursive: true });

const manifest = { myRime: lock.myRime, schemas: lock.schemas, files: {} };
let rawTotal = 0;
let outTotal = 0;

for (const target of TARGETS) {
  const expected = lock.files[target.out];
  if (!expected) throw new Error(`assets.lock.json 缺少 ${target.out}`);
  if (expected.url !== target.url) {
    throw new Error(`${target.out} 的 URL 与锁不一致\n锁：${expected.url}\n脚本：${target.url}`);
  }

  const res = await fetch(target.url);
  if (!res.ok) throw new Error(`下载失败 ${res.status} ${target.url}`);
  const raw = Buffer.from(await res.arrayBuffer());
  const digest = sha256(raw);
  if (digest !== expected.sha256) {
    throw new Error(`${target.out} sha256 与锁不一致\n锁：${expected.sha256}\n得：${digest}`);
  }

  const patched = target.patch ? target.patch(raw) : raw;
  const body = target.gzip ? gzipSync(patched, { level: 9 }) : patched;
  await writeFile(path.join(OUT, target.out), body);

  manifest.files[target.out] = {
    url: target.url,
    bytes: patched.length,
    stored: body.length,
    sha256: digest,
    patched: Boolean(target.patch)
  };

  rawTotal += patched.length;
  outTotal += body.length;
  const mb = (n) => (n / 1024 / 1024).toFixed(2);
  console.log(`  ${target.out.padEnd(28)} ${mb(patched.length).padStart(6)}M → ${mb(body.length).padStart(6)}M`);
}

await writeFile(path.join(OUT, "ASSETS.json"), JSON.stringify(manifest, null, 2) + "\n");
await writeFile(STAMP_PATH, stamp + "\n");

const mb = (n) => (n / 1024 / 1024).toFixed(2);
console.log(`\n  合计 ${mb(rawTotal)}M → 内嵌 ${mb(outTotal)}M（base64 后约 ${mb((outTotal * 4) / 3)}M）`);
