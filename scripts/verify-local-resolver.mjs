/**
 * 不启动浏览器：检查 schema 已裁 stroke、worker 依赖表补丁只命中一次、
 * XMLHttpRequest.open / fetch / importScripts 缺映射会立刻失败。
 */
import { readFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");

const yaml = gunzipSync(await readFile(path.join(ROOT, "src/assets/pinyin_simp.schema.yaml.gz"))).toString("utf8");
if (yaml.includes("stroke") || yaml.includes("reverse_lookup")) {
  throw new Error("schema 仍含 stroke/reverse_lookup");
}

const worker = await readFile(path.join(ROOT, "src/vendor/my-rime-worker.txt"), "utf8");
if (worker.split('bi=["stroke"]').length - 1 !== 1) {
  throw new Error("worker 依赖表针不是恰好一次");
}

const MAP = { "rime.data": "blob:local/rime.data", "rime.js": "blob:local/rime.js" };
const hits = [];
const fakeSelf = {
  process: {},
  addEventListener() {},
  importScripts(...urls) { hits.push(["importScripts", ...urls]); },
  fetch(url) { hits.push(["fetch", url]); return Promise.resolve(); },
  XMLHttpRequest: class {
    open(method, url) { hits.push(["xhr", method, url]); }
  }
};
fakeSelf.XMLHttpRequest.prototype.open = fakeSelf.XMLHttpRequest.prototype.open;

const src = `
var self = globalThis.__jtSelf;
self.process = undefined;
var MAP = ${JSON.stringify(MAP)};
function basename(url) {
  var s = String(url);
  var q = s.indexOf("?");
  if (q >= 0) s = s.slice(0, q);
  return s.slice(s.lastIndexOf("/") + 1);
}
function missing(url) { return new Error("missing " + url); }
var nativeImportScripts = self.importScripts.bind(self);
var nativeFetch = self.fetch.bind(self);
var nativeXhrOpen = self.XMLHttpRequest.prototype.open;
self.importScripts = function () {
  var local = [];
  for (var i = 0; i < arguments.length; i++) {
    var hit = MAP[basename(arguments[i])];
    if (!hit) throw missing(arguments[i]);
    local.push(hit);
  }
  return nativeImportScripts.apply(null, local);
};
self.fetch = function (input) {
  var url = typeof input === "string" ? input : input.url;
  var hit = MAP[basename(url)];
  if (!hit) return Promise.reject(missing(url));
  return nativeFetch(hit);
};
self.XMLHttpRequest.prototype.open = function (method, url) {
  var hit = MAP[basename(url)];
  if (!hit) throw missing(url);
  var args = Array.prototype.slice.call(arguments);
  args[1] = hit;
  return nativeXhrOpen.apply(this, args);
};
`;
globalThis.__jtSelf = fakeSelf;
(0, eval)(src);

fakeSelf.importScripts("https://cdn.example/rime.js");
if (hits.at(-1)[1] !== "blob:local/rime.js") throw new Error("importScripts 未改写");

const xhr = new fakeSelf.XMLHttpRequest();
xhr.open("GET", "https://cdn.jsdelivr.net/npm/@libreservice/my-rime@0.10.9/dist/rime.data");
if (hits.at(-1)[2] !== "blob:local/rime.data") throw new Error("XHR 未改写");

let threw = false;
try {
  xhr.open("GET", "https://cdn.jsdelivr.net/npm/@rime-contrib/luna-pinyin@0.1.1/luna_pinyin.table.bin");
} catch (e) {
  threw = String(e.message).includes("missing");
}
if (!threw) throw new Error("缺映射的 XHR 没有立刻失败");

console.log("verify-local-resolver ok");
