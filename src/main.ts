import { App, MarkdownView, Modal, Notice, Platform, Plugin, requestUrl, setIcon } from "obsidian";
import workerSource from "./vendor/my-rime-worker.txt";
import { searchEmoji, type EmojiEntry } from "./emoji";

const PLUGIN_VERSION = "0.7.9";
const PROBE_URL = "https://cdn.jsdelivr.net/npm/@libreservice/my-rime@0.10.9/dist/rime.js";
const INIT_TIMEOUT_MS = 45000;
const MAX_TRACE = 60;
const REPORT_FOLDER = "砚台诊断";
// 同一条提醒的最短间隔，以及「系统输入法刚才在工作」这条证据的有效期。
const IME_WARN_COOLDOWN_MS = 30 * 1000;
const CJK = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;
const EMOJI_PAGE = 7;

type Candidate = { text: string; comment?: string };
type RimeResult = {
  state: 0 | 1 | 2 | 3;
  committed?: string;
  head?: string;
  body?: string;
  tail?: string;
  page?: number;
  isLastPage?: boolean;
  highlighted?: number;
  selectLabels?: string[];
  candidates?: Candidate[];
  updatedSchema?: string;
};

type PendingCall = {
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
};

type Logger = (message: string) => void;

function timeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} 超时（${Math.round(ms / 1000)} 秒无响应）`)), ms);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (error) => { clearTimeout(timer); reject(error); }
    );
  });
}

class RimeWorkerClient {
  private worker: Worker;
  private workerUrl: string;
  private pending?: PendingCall;
  private chain: Promise<unknown> = Promise.resolve();
  private fatal?: Error;

  constructor(source: string, private log: Logger) {
    // Electron exposes Node's `process` inside workers. Emscripten then tries to
    // read the CDN URL with Node's fs module. Hide Node markers so the same
    // upstream bundle takes its tested Web Worker/fetch path on desktop and iOS.
    const browserWorkerSource = "self.process=undefined;self.require=undefined;\n" + source;
    const blob = new Blob([browserWorkerSource], { type: "text/javascript" });
    this.workerUrl = URL.createObjectURL(blob);
    this.worker = new Worker(this.workerUrl);

    this.worker.addEventListener("message", (event: MessageEvent) => {
      const message = event.data;
      if (message?.type === "control") {
        this.log(`worker control: ${JSON.stringify(message.args ?? message.name ?? "")}`.slice(0, 200));
        return;
      }
      const pending = this.pending;
      this.pending = undefined;
      if (!pending) return;
      if (message?.type === "success") pending.resolve(message.result);
      else pending.reject(new Error(message?.error?.message ?? "RIME Worker 调用失败"));
    });

    this.worker.addEventListener("error", (event: ErrorEvent) => {
      // A blob worker that fails inside importScripts reports here, often with an
      // empty message, so record every field the event carries.
      const detail = [
        event.message || "(无错误文本)",
        event.filename ? `文件 ${event.filename}` : "",
        event.lineno ? `行 ${event.lineno}:${event.colno ?? 0}` : ""
      ].filter(Boolean).join(" · ");
      const error = new Error(`RIME Worker 启动失败：${detail}`);
      this.fatal = error;
      this.log(`worker error → ${detail}`);
      const pending = this.pending;
      this.pending = undefined;
      pending?.reject(error);
    });

    this.worker.addEventListener("messageerror", () => {
      this.log("worker messageerror：消息无法反序列化");
    });
  }

  call<T>(name: string, ...args: unknown[]): Promise<T> {
    if (this.fatal) return Promise.reject(this.fatal);
    const run = () => new Promise<T>((resolve, reject) => {
      this.pending = {
        resolve: (value) => resolve(value as T),
        reject
      };
      this.worker.postMessage({ name, args, transferableIndices: [] });
    });
    const result = this.chain.then(run, run);
    this.chain = result.catch(() => undefined);
    return result;
  }

  destroy(): void {
    this.worker.terminate();
    URL.revokeObjectURL(this.workerUrl);
  }
}

const KEY_MAP: Record<string, string> = {
  Escape: "Escape",
  Backspace: "BackSpace",
  Delete: "Delete",
  Tab: "Tab",
  Enter: "Return",
  ArrowUp: "Up",
  ArrowRight: "Right",
  ArrowDown: "Down",
  ArrowLeft: "Left",
  PageUp: "Page_Up",
  PageDown: "Page_Down",
  " ": "space",
  ",": "comma",
  ".": "period",
  "?": "question",
  "!": "exclam",
  ";": "semicolon",
  ":": "colon",
  "'": "apostrophe"
};

const START_PUNCTUATION = new Set([",", ".", "?", "!", ";", ":"]);

type InputMode = "chinese" | "english" | "emoji";

const MODE_LABEL: Record<InputMode, string> = { chinese: "砚台 中", english: "砚台 英", emoji: "砚台 😀" };
const MODE_NOTICE: Record<InputMode, string> = {
  chinese: "中文",
  english: "英文",
  emoji: "表情 — 打关键词搜索，如 xiao / smile / huo。按 Shift 回中文"
};

type SkipReason =
  | "未启用"
  | "引擎未就绪"
  | "焦点不在编辑器"
  | "带修饰键"
  | "系统输入法组合中"
  | "非拼音按键";

class DiagnosticsModal extends Modal {
  constructor(app: App, private report: string, private sensitive = false) {
    super(app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.addClass("inkstone-diag");
    contentEl.createEl("h3", { text: "砚台输入法 · 诊断报告" });
    contentEl.createEl("p", {
      cls: "inkstone-diag-hint",
      text: this.sensitive
        ? "⚠️ 本次记录包含你实际敲下的按键内容。外发前请先通读一遍。"
        : "可以把这份报告发给协助排查的人。按键内容已脱敏，只保留类别（字母/数字/符号）。"
    });
    const area = contentEl.createEl("textarea", { cls: "inkstone-diag-text" });
    area.value = this.report;
    area.readOnly = true;
    area.rows = 18;

    const actions = contentEl.createDiv({ cls: "inkstone-diag-actions" });
    const copyButton = actions.createEl("button", { text: "复制报告", cls: "mod-cta" });
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(this.report);
        copyButton.setText("已复制");
      } catch {
        area.select();
        const ok = document.execCommand("copy");
        copyButton.setText(ok ? "已复制" : "复制失败，请手动选中");
      }
      setTimeout(() => copyButton.setText("复制报告"), 1600);
    });
    actions.createEl("button", { text: "关闭" }).addEventListener("click", () => this.close());
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

export default class InkstonePlugin extends Plugin {
  private client?: RimeWorkerClient;
  private mode: InputMode = "chinese";
  private emojiQuery = "";
  private emojiHits: EmojiEntry[] = [];
  private ready = false;
  private composing = false;
  private panel?: HTMLDivElement;
  private preedit?: HTMLDivElement;
  private candidates?: HTMLDivElement;
  private status?: HTMLElement;
  private ribbon?: HTMLElement;
  private inputSequence = 0;
  private discardThrough = 0;

  private startedAt = Date.now();
  private diagnostics: string[] = [];
  private initError?: string;
  private keydownSeen = 0;
  private keydownCaptured = 0;
  private skipCounts: Partial<Record<SkipReason, number>> = {};
  private lastKeyNote = "(尚未按键)";
  private eventTrace: string[] = [];
  private eventCounts: Record<string, number> = {};
  private pendingTrace = -1;
  private shiftArmed = false;
  private imeConflictStreak = 0;
  private lastImeWarnAt = 0;
  private traceEnabled = false;
  private traceRawKeys = false;

  async onload(): Promise<void> {
    this.log(`插件 ${PLUGIN_VERSION} 载入`);
    this.log(this.environmentLine());

    this.createPanel();
    this.registerCommands();
    this.createControls();
    this.registerDomEvent(document, "keydown", (event) => this.onKeydown(event), true);
    this.registerDomEvent(document, "keyup", (event) => this.onKeyup(event), true);
    this.registerInputProbes();
    this.updateStatus("正在加载…");

    try {
      const t0 = Date.now();
      this.client = new RimeWorkerClient(workerSource, (message) => this.log(message));
      this.log(`Worker 已创建（${Date.now() - t0}ms）`);

      const t1 = Date.now();
      await timeout(this.client.call<void>("setIME", "pinyin_simp"), INIT_TIMEOUT_MS, "加载 RIME 引擎与词库");
      this.log(`setIME(pinyin_simp) 完成（${Date.now() - t1}ms）`);

      await timeout(this.client.call<void>("setPageSize", 7), 10000, "设置候选页大小");
      this.log("setPageSize(7) 完成");

      this.ready = true;
      this.updateStatus();
      this.log(`就绪，总耗时 ${Date.now() - this.startedAt}ms`);
      new Notice("砚台输入法已就绪");
    } catch (error) {
      const message = this.errorMessage(error);
      this.initError = message;
      this.log(`初始化失败：${message}`);
      console.error("RIME initialization failed", error);
      this.updateStatus("加载失败");
      new Notice(`砚台加载失败：${message}\n运行命令「诊断报告 (report)」查看详情`, 15000);
    }
  }

  onunload(): void {
    this.client?.destroy();
    this.panel?.remove();
  }

  /* ---------------- diagnostics ---------------- */

  private log(message: string): void {
    const stamp = String(Date.now() - this.startedAt).padStart(6, " ");
    this.diagnostics.push(`[+${stamp}ms] ${message}`);
  }

  private environmentLine(): string {
    const kind = Platform.isIosApp ? "iOS/iPadOS App"
      : Platform.isAndroidApp ? "Android App"
      : Platform.isMacOS ? "macOS 桌面"
      : Platform.isWin ? "Windows 桌面"
      : "其它";
    return `环境：${kind}｜mobile=${Platform.isMobile}｜Obsidian ${(this.app as unknown as { appVersion?: string }).appVersion ?? "?"}`;
  }

  /** Separates "the CDN is unreachable" from "the page context is not allowed to fetch it". */
  private async probeNetwork(): Promise<void> {
    this.log(`navigator.onLine = ${navigator.onLine}`);
    try {
      const res = await timeout(requestUrl({ url: PROBE_URL, method: "GET" }), 15000, "网络探测(requestUrl)");
      this.log(`requestUrl 探测 → HTTP ${res.status}，${res.arrayBuffer.byteLength} 字节`);
    } catch (error) {
      this.log(`requestUrl 探测失败 → ${this.errorMessage(error)}`);
    }
    try {
      const res = await timeout(fetch(PROBE_URL, { method: "GET" }), 15000, "网络探测(fetch)");
      this.log(`fetch 探测 → HTTP ${res.status} ${res.ok ? "ok" : "not ok"}`);
    } catch (error) {
      this.log(`fetch 探测失败 → ${this.errorMessage(error)}（若 requestUrl 成功而此处失败，说明是页面安全策略拦截，不是网络问题）`);
    }
  }

  /* 被动事件探针：只记录，不改变任何行为。用于在 iPad 上看清系统键盘到底发什么事件。 */

  private registerInputProbes(): void {
    const types = ["beforeinput", "input", "compositionstart", "compositionupdate", "compositionend"];
    for (const type of types) {
      const handler = (event: Event): void => {
        if (!this.isEditorTarget(event.target)) return;
        this.noteSystemIme(event);
        this.trace(type, `${this.describeEvent(event)} @${this.targetTag(event.target)}`);
      };
      document.addEventListener(type, handler, true);
      this.register(() => document.removeEventListener(type, handler, true));
    }
  }

  /* 英文模式下砚台完全放行按键，打出中文还是英文取决于系统输入源。插件查不到
     系统输入源（网页环境没有这个 API），只能从事件反推。

     注意：不能拿「有 composition 事件」当判据。macOS 上那确实意味着输入法在转换，
     但 iOS 的自动改正和预测输入在打普通英文时也走 composition，照那么判会在英文
     键盘下疯狂误报（0.7.2 就是这么错的）。

     真正可靠的判据是 compositionend 提交了汉字：自动改正提交的是 ASCII，中文输入
     法提交的是汉字。代价是提醒要等到第一个词上屏之后才出现，可以接受。

     只在「当下真的发生了」时提醒。0.7.2 还做过一条「切换到英文模式时，若 10 分钟内
     见过中文输入法就提前提醒」，那是凭记忆猜——输入源随时会变，记忆必然过期，
     必然误报，0.7.8 已删除。 */
  private noteSystemIme(event: Event): void {
    if (event.type !== "compositionend") return;
    if (!CJK.test((event as CompositionEvent).data ?? "")) return;
    this.warnSystemImeTookOver();
  }

  /* 系统键盘切到中文时，砚台在任何模式下都不工作——按键在到达插件之前就被系统
     输入法吃掉了。所以话要说「砚台停了」，不是「你在某某模式」：用户需要知道的是
     工具还灵不灵，不是自己处在哪一档。

     两条触发路径共用这一条文案：中文模式下按键被 229 连续跳过，以及任何模式下
     系统输入法上屏了汉字。同一种处境，不该有两种说法。 */
  private warnSystemImeTookOver(): void {
    if (Date.now() - this.lastImeWarnAt < IME_WARN_COOLDOWN_MS) return;
    this.lastImeWarnAt = Date.now();
    new Notice("系统键盘切到中文了，砚台已停止工作——按键现在归系统输入法。要继续用砚台，请把系统键盘切回英文 ABC。", 8000);
  }

  private describeEvent(event: Event): string {
    const input = event as InputEvent;
    if (typeof input.inputType === "string") {
      return `inputType="${input.inputType}" data=${this.redactData(input.data)} comp=${input.isComposing}`;
    }
    const composition = event as CompositionEvent;
    if (typeof composition.data === "string") return `data=${this.redactData(composition.data)}`;
    return "";
  }

  /* 默认只吐类别，不吐用户敲了什么。诊断 iPad 软键盘要的是「key 是不是 Unidentified」，
     而不是「用户打了什么字」——类别足够回答前者。 */
  private redactKey(key: string): string {
    if (this.traceRawKeys) return JSON.stringify(key);
    if (key.length !== 1) return JSON.stringify(key); // Shift / Unidentified / ArrowDown 等具名键不是内容
    if (/[a-z]/i.test(key)) return "<字母>";
    if (/[0-9]/.test(key)) return "<数字>";
    if (/\s/.test(key)) return "<空白>";
    return "<符号>";
  }

  /* code 和 keyCode 同样会泄露按了哪个键（keyCode 81 就是 Q）。但 code="" 和 keyCode=229
     是判定 iOS 软键盘行为的关键信号，不能一刀切抹掉——只把「能还原出字符」的那部分换成类别。 */
  private redactCode(code: string): string {
    if (this.traceRawKeys) return JSON.stringify(code);
    if (/^Key[A-Z]$/.test(code)) return "<字母键>";
    if (/^Digit[0-9]$/.test(code)) return "<数字键>";
    if (/^Numpad[0-9]$/.test(code)) return "<小键盘数字>";
    return JSON.stringify(code); // ""、"Space"、"Escape"、"ArrowDown" 等
  }

  private redactKeyCode(keyCode: number): string {
    if (this.traceRawKeys) return String(keyCode);
    // 229 = 系统输入法组合中，0 = 未提供；这两个必须原样保留
    if (keyCode === 229 || keyCode === 0) return String(keyCode);
    const isContent = (keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90);
    return isContent ? "<内容>" : String(keyCode);
  }

  private redactData(data: string | null): string {
    if (data === null) return "null";
    if (this.traceRawKeys) return JSON.stringify(data);
    return `<${[...data].length} 字符>`;
  }

  /* shouldCapture 里模式判断排在焦点判断前面，英文模式下所有按键都记成「未启用」，
     焦点信息就丢了。轨迹里单独带一份，排查时才看得出按键到底落在哪。 */
  private targetTag(target: EventTarget | null): string {
    if (!(target instanceof Element)) return "none";
    if (this.isEditorTarget(target)) return "editor";
    const cls = target.className?.toString().trim().split(/\s+/)[0] ?? "";
    return cls || target.tagName.toLowerCase();
  }

  private trace(kind: string, detail: string): number {
    if (!this.traceEnabled) return -1;
    this.eventCounts[kind] = (this.eventCounts[kind] ?? 0) + 1;
    const stamp = String(Date.now() - this.startedAt).padStart(6, " ");
    this.eventTrace.push(`[+${stamp}ms] ${kind} ${detail}`);
    if (this.eventTrace.length > MAX_TRACE) this.eventTrace.shift();
    return this.eventTrace.length - 1;
  }

  private markTrace(index: number, marker: string): void {
    if (index < 0 || index >= this.eventTrace.length) return;
    this.eventTrace[index] += ` → ${marker}`;
  }

  /* 报告本来只在内存里，iPad 上排查只能靠手抄。写成 Vault 笔记后可以随
     Obsidian Sync 到别的设备，两头都能直接读。脱敏规则与屏幕上的报告一致。 */
  private async saveReport(): Promise<void> {
    const d = new Date();
    const pad = (n: number): string => String(n).padStart(2, "0");
    const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
    const path = `${REPORT_FOLDER}/${stamp}.md`;
    try {
      if (!this.app.vault.getAbstractFileByPath(REPORT_FOLDER)) {
        await this.app.vault.createFolder(REPORT_FOLDER);
      }
      const file = await this.app.vault.create(path, "```\n" + this.buildReport() + "\n```\n");
      new Notice(`诊断报告已存到 ${path}`, 8000);
      await this.app.workspace.getLeaf(true).openFile(file);
    } catch (error) {
      new Notice(`保存诊断报告失败：${this.errorMessage(error)}`, 8000);
    }
  }

  private buildReport(): string {
    const skips = Object.entries(this.skipCounts)
      .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
      .map(([reason, count]) => `    ${reason}: ${count}`)
      .join("\n") || "    (无)";

    const counts = Object.entries(this.eventCounts)
      .map(([kind, n]) => `  ${kind}: ${n}`)
      .join("\n") || "  (无)";

    const traceState = !this.traceEnabled
      ? "关（运行命令「诊断：开始/停止记录按键事件」开启）"
      : this.traceRawKeys
        ? "开 — ⚠️ 含原始按键内容"
        : "开 — 已脱敏";

    const trace = this.eventTrace.length
      ? this.eventTrace.map((line) => `  ${line}`).join("\n")
      : "  (无)";

    return [
      "砚台输入法 · 诊断报告",
      `生成时间：${new Date().toLocaleString()}`,
      `插件版本：${PLUGIN_VERSION}`,
      this.environmentLine(),
      `UA：${navigator.userAgent}`,
      "",
      "--- 当前状态 ---",
      `  引擎就绪 ready = ${this.ready}`,
      `  输入模式 mode = ${this.mode}`,
      `  组合中 composing = ${this.composing}`,
      `  初始化错误 = ${this.initError ?? "(无)"}`,
      "",
      "--- 按键捕获 ---",
      `  收到 keydown：${this.keydownSeen}`,
      `  被砚台截获：${this.keydownCaptured}`,
      `  最近一次按键：${this.lastKeyNote}`,
      "  未截获原因统计：",
      skips,
      "",
      "--- 事件计数 ---",
      counts,
      "",
      `--- 最近事件轨迹（最多 ${MAX_TRACE} 条）---`,
      `  记录状态：${traceState}`,
      trace,
      "",
      "--- 初始化过程 ---",
      ...this.diagnostics
    ].join("\n");
  }

  /* ---------------- UI ---------------- */

  private registerCommands(): void {
    this.addCommand({
      id: "toggle-chinese-english",
      name: "切换中英文 (toggle)",
      hotkeys: [{ modifiers: ["Mod", "Shift"], key: "Space" }],
      callback: () => this.toggle()
    });
    this.addCommand({
      id: "toggle-emoji",
      name: "切换表情模式 (emoji)",
      callback: () => this.toggleEmoji()
    });
    this.addCommand({
      id: "diagnostics",
      name: "诊断报告 (report)",
      callback: () => new DiagnosticsModal(this.app, this.buildReport(), this.traceRawKeys).open()
    });
    this.addCommand({
      id: "toggle-trace",
      name: "诊断：开始/停止记录按键事件 (trace)",
      callback: () => {
        this.traceEnabled = !this.traceEnabled;
        if (this.traceEnabled) {
          this.eventTrace = [];
          this.eventCounts = {};
        } else {
          this.traceRawKeys = false;
        }
        new Notice(this.traceEnabled
          ? "按键事件记录：开（内容已脱敏）。复现问题后运行「诊断报告 (report)」。"
          : "按键事件记录：关。");
      }
    });
    this.addCommand({
      id: "toggle-trace-raw",
      name: "诊断：记录原始按键内容 敏感 (trace raw)",
      callback: () => {
        this.traceRawKeys = !this.traceRawKeys;
        if (this.traceRawKeys && !this.traceEnabled) {
          this.traceEnabled = true;
          this.eventTrace = [];
          this.eventCounts = {};
        }
        new Notice(this.traceRawKeys
          ? "⚠️ 记录已包含你实际敲下的按键内容，报告外发前请通读。再运行一次此命令可关闭。"
          : "已恢复脱敏记录。", 8000);
      }
    });
    this.addCommand({
      id: "save-report",
      name: "诊断：把报告存进 Vault (save report)",
      callback: () => void this.saveReport()
    });
    this.addCommand({
      id: "probe-network",
      name: "诊断：网络探测 (network)",
      callback: () => {
        void this.probeNetwork().then(() =>
          new DiagnosticsModal(this.app, this.buildReport(), this.traceRawKeys).open());
      }
    });
  }

  private createControls(): void {
    // Obsidian mobile has no status bar, so the ribbon carries the state there.
    this.ribbon = this.addRibbonIcon("languages", "砚台：切换中英文", () => this.toggle());
    if (!Platform.isMobile) {
      this.status = this.addStatusBarItem();
      this.status.addClass("inkstone-status");
      this.status.addEventListener("click", () => this.toggle());
    }
  }

  /* Shift、状态栏、ribbon 都只管中/英——和其他输入法的习惯一致。
     在表情模式下按 Shift 直接回中文，规则简单，不用记之前在哪。
     表情模式改由独立命令进入：iPad 上用系统地球键更顺手，这条留作后路。 */
  private toggle(): void {
    this.setMode(this.mode === "chinese" ? "english" : "chinese");
  }

  private toggleEmoji(): void {
    this.setMode(this.mode === "emoji" ? "chinese" : "emoji");
  }

  private setMode(next: InputMode): void {
    this.cancelComposition();
    this.clearEmoji();
    this.mode = next;
    this.updateStatus();
    if (next === "emoji") {
      const view = this.activeEditor();
      if (view) this.renderEmojiPanel(view);
    }
    new Notice(`砚台：${MODE_NOTICE[next]}`);
  }

  private updateStatus(override?: string): void {
    const active = this.mode !== "english" && this.ready;
    const label = override ?? MODE_LABEL[this.mode];
    if (this.status) {
      this.status.setText(label);
      this.status.toggleClass("is-enabled", active);
    }
    if (this.ribbon) {
      this.ribbon.toggleClass("is-enabled", active);
      this.ribbon.setAttribute("aria-label", `砚台：${MODE_NOTICE[this.mode]}`);
      setIcon(this.ribbon, this.mode === "emoji" ? "smile" : this.mode === "chinese" && this.ready ? "languages" : "type");
    }
  }

  private createPanel(): void {
    this.panel = document.body.createDiv({ cls: "inkstone-panel" });
    this.panel.setAttribute("aria-live", "polite");
    this.preedit = this.panel.createDiv({ cls: "inkstone-preedit" });
    this.candidates = this.panel.createDiv({ cls: "inkstone-candidates" });
  }

  /* ---------------- input ---------------- */

  private isEditorTarget(target: EventTarget | null): boolean {
    return target instanceof Element && Boolean(target.closest(".markdown-source-view .cm-content"));
  }

  private activeEditor(): MarkdownView | null {
    return this.app.workspace.getActiveViewOfType(MarkdownView);
  }

  private skip(reason: SkipReason): false {
    this.skipCounts[reason] = (this.skipCounts[reason] ?? 0) + 1;
    // 插件开着、键却被系统输入法吃掉时，沉默看起来就像插件坏了。连续几次就说一声。
    if (reason === "系统输入法组合中") {
      this.imeConflictStreak += 1;
      if (this.imeConflictStreak === 3 && this.mode === "chinese") {
        this.warnSystemImeTookOver();
      }
    }
    this.markTrace(this.pendingTrace, reason);
    this.pendingTrace = -1;
    return false;
  }

  private shouldCapture(event: KeyboardEvent): boolean {
    if (this.mode !== "chinese") return this.skip("未启用");
    if (!this.ready || !this.client) return this.skip("引擎未就绪");
    if (!this.isEditorTarget(event.target)) return this.skip("焦点不在编辑器");
    // The system IME is still composing (it was left on a Chinese layout). Letting
    // RIME also consume the key commits the same word twice.
    if (event.isComposing || event.keyCode === 229) return this.skip("系统输入法组合中");
    if (event.metaKey || event.ctrlKey || event.altKey) return this.skip("带修饰键");
    if (event.shiftKey && event.key.length !== 1) return this.skip("带修饰键");
    if (this.composing) {
      return /^[a-z0-9]$/i.test(event.key) || event.key in KEY_MAP ? true : this.skip("非拼音按键");
    }
    if (event.shiftKey) return this.skip("带修饰键");
    return /^[a-z]$/i.test(event.key) || START_PUNCTUATION.has(event.key) ? true : this.skip("非拼音按键");
  }

  /* 单独按下并松开 Shift（中间没有别的键）＝ 中/英切换，沿用 RIME 的习惯。 */
  private onKeyup(event: KeyboardEvent): void {
    if (event.key !== "Shift" || !this.shiftArmed) return;
    this.shiftArmed = false;
    if (!this.ready || !this.isEditorTarget(event.target)) return;
    this.toggle();
  }

  /* iPadOS 把「点系统表情面板」发成 keydown：key 是那个表情本身，code="Unidentified"，
     keyCode=0。实测它有时不会跟上 beforeinput/input，表情就插不进文档（诊断报告
     2026-09-20-214712 里 🥳 失败、🤩 成功，同样的动作两种结果）。

     既然按键送到了，就由砚台自己写进文档，不再看系统脸色。preventDefault 掐掉系统
     那条不稳的插入路径，所以不会重复上屏。
     判据刻意收窄：keyCode 必须为 0、code 未识别、key 含非 ASCII——正常打字碰不到。 */
  private isPickerChar(event: KeyboardEvent): boolean {
    if (event.metaKey || event.ctrlKey || event.altKey) return false;
    if (event.keyCode !== 0) return false;
    if (event.code !== "" && event.code !== "Unidentified") return false;
    const key = event.key;
    if (!key) return false;
    if (/^[A-Z][A-Za-z]+$/.test(key)) return false; // Enter / Shift / Unidentified 这类具名键
    return /[^\x00-\x7F]/.test(key);
  }

  private insertPickerChar(event: KeyboardEvent): void {
    if (!this.isEditorTarget(event.target)) return void this.skip("焦点不在编辑器");
    const view = this.activeEditor();
    if (!view) return void this.skip("焦点不在编辑器");

    if (this.composing) this.cancelComposition();
    if (this.mode === "emoji") this.clearEmoji();

    event.preventDefault();
    event.stopImmediatePropagation();
    view.editor.replaceSelection(event.key);
    this.keydownCaptured += 1;
    this.markTrace(this.pendingTrace, "表情直接上屏");
    this.pendingTrace = -1;
  }

  private onKeydown(event: KeyboardEvent): void {
    this.shiftArmed = event.key === "Shift" && !event.ctrlKey && !event.metaKey && !event.altKey;
    this.keydownSeen += 1;
    const target = event.target instanceof Element ? event.target.className.toString().slice(0, 60) : String(event.target);
    this.lastKeyNote = `key=${this.redactKey(event.key)} code=${this.redactCode(event.code)} keyCode=${this.redactKeyCode(event.keyCode)} isComposing=${event.isComposing} target=[${target}]`;
    this.pendingTrace = this.trace("keydown", `key=${this.redactKey(event.key)} code=${this.redactCode(event.code)} kc=${this.redactKeyCode(event.keyCode)} comp=${event.isComposing} @${this.targetTag(event.target)}`);

    if (this.isPickerChar(event)) {
      this.insertPickerChar(event);
      return;
    }

    if (this.mode === "emoji") {
      this.handleEmojiMode(event);
      return;
    }

    if (!this.shouldCapture(event)) return;
    const view = this.activeEditor();
    if (!view) return this.skip("焦点不在编辑器") as unknown as void;

    const rimeKey = this.toRimeKey(event);
    if (!rimeKey) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    this.keydownCaptured += 1;
    this.imeConflictStreak = 0;
    this.markTrace(this.pendingTrace, "截获");
    this.pendingTrace = -1;

    const sequence = ++this.inputSequence;
    void this.client!.call<RimeResult>("process", rimeKey)
      .then((result) => this.applyResult(result, event.key, view, sequence))
      .catch((error) => {
        console.error("RIME input failed", error);
        this.log(`process("${rimeKey}") 失败：${this.errorMessage(error)}`);
        this.cancelComposition();
        new Notice(`砚台输入失败：${this.errorMessage(error)}\n可运行命令「诊断报告 (report)」查看详情`, 8000);
      });
  }

  private handleEmojiMode(event: KeyboardEvent): void {
    if (!this.isEditorTarget(event.target)) return void this.skip("焦点不在编辑器");
    if (event.metaKey || event.ctrlKey || event.altKey) return void this.skip("带修饰键");
    if (event.isComposing || event.keyCode === 229) return void this.skip("系统输入法组合中");

    const view = this.activeEditor();
    if (!view) return void this.skip("焦点不在编辑器");
    if (!this.handleEmojiKey(event, view)) return void this.skip("非拼音按键");

    event.preventDefault();
    event.stopImmediatePropagation();
    this.keydownCaptured += 1;
    this.imeConflictStreak = 0;
    this.markTrace(this.pendingTrace, "截获");
    this.pendingTrace = -1;
  }

  private toRimeKey(event: KeyboardEvent): string | undefined {
    if (/^[a-z0-9]$/i.test(event.key)) return event.key.toLowerCase();
    const mapped = KEY_MAP[event.key];
    return mapped ? `{${mapped}}` : undefined;
  }

  private applyResult(result: RimeResult, originalKey: string, view: MarkdownView, sequence: number): void {
    if (sequence <= this.discardThrough) return;
    if (result.state === 0) {
      this.composing = false;
      if (result.committed) view.editor.replaceSelection(result.committed);
      this.hidePanel();
      return;
    }
    if (result.state === 1) {
      this.composing = true;
      if (result.committed) view.editor.replaceSelection(result.committed);
      this.renderPanel(result, view);
      return;
    }
    this.composing = false;
    this.hidePanel();
    if (result.state === 3 && originalKey.length === 1) view.editor.replaceSelection(originalKey);
  }

  /* ---------------- 表情模式 ---------------- */

  /* 返回 true 表示这个键归表情模式管，调用方负责 preventDefault。
     查询为空时只吃字母，其余键一律放行，免得表情模式下连空格退格都动不了。 */
  private handleEmojiKey(event: KeyboardEvent, view: MarkdownView): boolean {
    const key = event.key;

    if (/^[a-z]$/i.test(key)) {
      this.emojiQuery += key.toLowerCase();
      this.renderEmojiPanel(view);
      return true;
    }

    if (key === "Backspace") {
      if (!this.emojiQuery) return false;
      this.emojiQuery = this.emojiQuery.slice(0, -1);
      this.renderEmojiPanel(view);
      return true;
    }

    if (!this.emojiQuery) return false;

    if (key === "Escape") {
      this.clearEmoji();
      return true;
    }

    if (key === " ") {
      this.commitEmoji(0, view);
      return true;
    }

    if (/^[1-9]$/.test(key)) {
      this.commitEmoji(Number(key) - 1, view);
      return true;
    }

    return false;
  }

  private commitEmoji(index: number, view: MarkdownView): void {
    const hit = this.emojiHits[index];
    if (!hit) return;
    view.editor.replaceSelection(hit.e);
    this.emojiQuery = "";
    this.renderEmojiPanel(view);
  }

  private clearEmoji(): void {
    this.emojiQuery = "";
    this.emojiHits = [];
    this.hidePanel();
  }

  private renderEmojiPanel(view: MarkdownView): void {
    if (!this.panel || !this.preedit || !this.candidates) return;
    this.emojiHits = searchEmoji(this.emojiQuery, EMOJI_PAGE);

    this.preedit.setText(this.emojiQuery ? `😀 ${this.emojiQuery}` : "😀 打关键词搜索表情（xiao / smile / huo）");
    this.candidates.empty();

    if (!this.emojiHits.length) {
      this.candidates.createEl("button", { text: "没有匹配的表情", attr: { type: "button", disabled: "true" } });
    }

    this.emojiHits.forEach((hit, index) => {
      const button = this.candidates!.createEl("button", {
        cls: index === 0 ? "is-highlighted" : "",
        text: `${index + 1} ${hit.e}`,
        attr: { type: "button" }
      });
      button.addEventListener("pointerdown", (event) => event.preventDefault());
      button.addEventListener("click", () => this.commitEmoji(index, view));
    });

    this.positionPanel(view);
    this.panel.addClass("is-visible");
  }

  /* 候选栏跟随光标。取不到光标位置时退回底部居中。 */
  private caretRect(view: MarkdownView): { left: number; top: number; bottom: number } | null {
    const cm = (view.editor as unknown as {
      cm?: {
        coordsAtPos?(pos: number): { left: number; top: number; bottom: number } | null;
        state?: { selection: { main: { head: number } } };
      };
    }).cm;
    const head = cm?.state?.selection.main.head;
    if (cm?.coordsAtPos && typeof head === "number") {
      const coords = cm.coordsAtPos(head);
      if (coords) return coords;
    }
    const selection = window.getSelection();
    if (selection?.rangeCount) {
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      if (rect.top || rect.left) return { left: rect.left, top: rect.top, bottom: rect.bottom };
    }
    return null;
  }

  private positionPanel(view: MarkdownView): void {
    const panel = this.panel;
    if (!panel) return;
    const caret = this.caretRect(view);
    if (!caret) {
      panel.removeClass("is-anchored");
      panel.style.removeProperty("left");
      panel.style.removeProperty("top");
      return;
    }

    panel.addClass("is-anchored");
    // visualViewport 在 iPadOS 上会随软键盘收缩，用它才能避开被键盘盖住。
    const vv = window.visualViewport;
    const minX = vv ? vv.offsetLeft : 0;
    const minY = vv ? vv.offsetTop : 0;
    const maxX = minX + (vv ? vv.width : window.innerWidth);
    const maxY = minY + (vv ? vv.height : window.innerHeight);
    const gap = 6;
    const margin = 8;

    const width = panel.offsetWidth;
    const height = panel.offsetHeight;

    let left = caret.left;
    if (left + width > maxX - margin) left = maxX - margin - width;
    if (left < minX + margin) left = minX + margin;

    let top = caret.bottom + gap;
    if (top + height > maxY - margin) top = caret.top - gap - height;
    if (top < minY + margin) top = minY + margin;

    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
  }

  private renderPanel(result: RimeResult, view: MarkdownView): void {
    if (!this.panel || !this.preedit || !this.candidates) return;
    const head = result.head ?? "";
    const body = result.body ?? "";
    const tail = result.tail ?? "";
    this.preedit.setText(`${head}${body}${tail}`);
    this.candidates.empty();
    (result.candidates ?? []).forEach((candidate, index) => {
      const label = result.selectLabels?.[index] ?? String(index + 1);
      const button = this.candidates!.createEl("button", {
        cls: index === result.highlighted ? "is-highlighted" : "",
        text: `${label} ${candidate.text}${candidate.comment ? ` ${candidate.comment}` : ""}`,
        attr: { type: "button" }
      });
      button.addEventListener("pointerdown", (event) => event.preventDefault());
      button.addEventListener("click", () => {
        void this.client!.call<string>("selectCandidateOnCurrentPage", index)
          .then((raw) => this.applyResult(JSON.parse(raw) as RimeResult, "", view, ++this.inputSequence));
      });
    });
    this.positionPanel(view);
    this.panel.addClass("is-visible");
  }

  private cancelComposition(): void {
    this.composing = false;
    this.discardThrough = this.inputSequence;
    this.hidePanel();
    if (this.ready && this.client) void this.client.call<RimeResult>("process", "{Escape}");
  }

  private hidePanel(): void {
    this.panel?.removeClass("is-visible");
    this.preedit?.setText("");
    this.candidates?.empty();
  }

  private errorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === "object" && error !== null) {
      const maybe = error as { message?: string; status?: number };
      if (maybe.message) return maybe.message;
      if (maybe.status) return `HTTP ${maybe.status}`;
    }
    return String(error);
  }
}
