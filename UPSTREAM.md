# Upstream components

Inkstone (砚台输入法) embeds the unmodified production Worker from:

- Project: My RIME
- Version: 0.10.9
- Source: https://github.com/LibreService/my_rime/tree/c73ea172d28f07031ba87a1d71c4d2e1c8ba82a3
- Package: https://www.npmjs.com/package/@libreservice/my-rime/v/0.10.9
- License: AGPL-3.0-or-later

The embedded file is `src/vendor/my-rime-worker.txt`, copied from the npm package's `dist/worker.js`. At runtime it downloads the matching RIME JavaScript, WebAssembly data, and the selected schema from the URLs defined by that upstream Worker.
