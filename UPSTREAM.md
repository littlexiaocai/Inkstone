# Upstream components

Just Type IME (就打个字) does not fetch anything at runtime. The RIME engine and the
pinyin schemas are bundled into `main.js` at build time, which means this
repository and every release **redistribute** the upstream artifacts listed below.

- Project: My RIME
- Version: 0.10.9
- Source: https://github.com/LibreService/my_rime/tree/c73ea172d28f07031ba87a1d71c4d2e1c8ba82a3
- Package: https://www.npmjs.com/package/@libreservice/my-rime/v/0.10.9
- License: AGPL-3.0-or-later

The unmodified production Worker is `src/vendor/my-rime-worker.txt`, copied from
the npm package's `dist/worker.js`. Its engine files (`rime.js`, `rime.wasm`,
`rime.data`) and the schema packages are fetched at build time by
`scripts/fetch-assets.mjs`; their source URLs and sha256 digests are recorded in
`src/assets/ASSETS.json`.

The Worker is embedded verbatim. Just Type IME does not patch it: a resolver injected
ahead of it rewrites the two resource entry points (`importScripts` and `fetch`)
to local Blob URLs, and fails loudly rather than falling back to the network.

For the full list of bundled third-party works and their licenses — including the
Apache-2.0 pinyin-simp schema and the LGPL-3.0 stroke schema — see
`THIRD_PARTY_NOTICES.md`.
