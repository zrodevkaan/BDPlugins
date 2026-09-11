/**
 * @name DeepTranslate
 * @author kaan
 * @version 1.0.0
 * @description Allow translations from DeepL, the best translator in existence. You can autotranslate selected users
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/DeepTranslate/DeepTranslate.plugin.js
 * @invite t3zMgv7Nvb
 * @stable 611316
 * @canary 611599
 */
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/DeepTranslate/index.tsx
var index_exports = {};
__export(index_exports, {
  SepWithText: () => SepWithText,
  default: () => DeepTranslate
});
module.exports = __toCommonJS(index_exports);

// src/DeepTranslate/global.ts
var { Webpack, Patcher, Net, Utils, Hooks, React, ContextMenu, Components } = new BdApi("DeepTranslate");

// src/DeepTranslate/translate.ts
var TARGET_LANG_MAP = {
  "AR": "ar",
  "BG": "bg",
  "CS": "cs",
  "DA": "da",
  "DE": "de",
  "DE-CH": "de-CH",
  "EL": "el",
  "EN-GB": "en-GB",
  "EN-US": "en-US",
  "ES": "es",
  "ES-419": "es-419",
  "ET": "et",
  "FI": "fi",
  "FR": "fr",
  "FR-CA": "fr-CA",
  "HE": "he",
  "HU": "hu",
  "ID": "id",
  "IT": "it",
  "JA": "ja",
  "KO": "ko",
  "LT": "lt",
  "LV": "lv",
  "NB": "nb",
  "NL": "nl",
  "PL": "pl",
  "PT-BR": "pt-BR",
  "PT-PT": "pt-PT",
  "RO": "ro",
  "RU": "ru",
  "SK": "sk",
  "SL": "sl",
  "SV": "sv",
  "TR": "tr",
  "UK": "uk",
  "VI": "vi",
  "ZH": "zh-Hans",
  "ZH-HANS": "zh-Hans",
  "ZH-HANT": "zh-Hant",
  "EN": "en-US",
  // convenience alias
  "PT": "pt-BR"
  // convenience alias
};
var SOURCE_LANG_MAP = {
  ...TARGET_LANG_MAP,
  "EN": "en",
  "PT": "pt",
  "auto": "auto"
};
var COMMON_TARGET_LANGS = [
  "EN-US",
  "ES",
  "FR",
  "DE",
  "JA",
  "KO",
  "ZH-HANS",
  "PT-BR",
  "RU"
];
var ALL_TARGET_LANGS = Object.keys(TARGET_LANG_MAP).filter((code) => code !== "EN" && code !== "PT");
var displayNames = new Intl.DisplayNames(["en"], { type: "language" });
function getLanguageName(code) {
  return displayNames?.of(code) ?? code;
}
var TranslateError = class extends Error {
  code;
  constructor(message, code) {
    super(message);
    this.name = "TranslateError";
    this.code = code;
  }
};
async function translate(text, targetLang, sourceLang = "auto", signal) {
  const target = TARGET_LANG_MAP[targetLang.toUpperCase()] || targetLang;
  const source = sourceLang === "auto" ? void 0 : TARGET_LANG_MAP[sourceLang.toUpperCase()] || sourceLang;
  const body = {
    text: [text],
    target_lang: target,
    usage_type: "translate",
    // the DeepL mobile app AND chrome extension both use this weird api.
    // it doesnt need an authorization if the iOS or user agent is a whitelisted string.
    // for anon requests, 1500 character limit.
    // im assuming that the requests per minute is 50?
    // the oneshot api is way more loose (heh) than the public api or the web version?
    app_information: {
      os: "iOS",
      os_version: "26.0",
      app_version: "26.42",
      app_build: "5443737",
      // look familiar?
      instance_id: crypto.randomUUID?.() || "00000000-0000-4000-8000-000000000000"
      // uuidv4
    }
    // they also support the following:
    // instance_id: e,
    // app_build: a,
    // os: t,
    // app_version: 'any',
    // os_version: 'any'
  };
  if (source) body.source_lang = source;
  const response = await Net.fetch("https://oneshot-free.www.deepl.com/v1/translate", {
    // https://oneshot-pro.www.deepl.com/v1/translate also exists but this requires a bearer.
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "None",
      "User-Agent": "DeepL/26.42 CFNetwork/3826.600.41 Darwin/25.0.0",
      "x-app-os-version": "26.0",
      "x-app-instance-id": crypto.randomUUID?.() || "00000000-0000-4000-8000-000000000000",
      "x-app-session-id": crypto.randomUUID?.() || "00000000-0000-4000-8000-000000000000"
    },
    body: JSON.stringify(body),
    signal
  });
  const data = await response.json();
  if (response.status === 429 /* TOO_MANY_REQUESTS */) {
    throw new TranslateError("Rate limited - too many requests", 429 /* TOO_MANY_REQUESTS */);
  }
  if (response.status === 401 /* AUTH_FAILED */) {
    throw new TranslateError(
      "Authorization failed. This could mean the `app_information` parameter is invalid. Which is kinda bad.",
      401 /* AUTH_FAILED */
    );
  }
  if (response.status !== 200) {
    throw new TranslateError(data.message || `HTTP ${response.status}`, response.status || 0 /* UNKNOWN */);
  }
  return {
    _rawData: data,
    text: data.translations?.[0]?.text || "",
    detectedSource: data.translations?.[0]?.detected_source_language || "",
    resolvedTarget: target
  };
}
var MAX_ERROR_LOG = 20;
var AUTO_TRANSLATE_MIN_INTERVAL_MS = 1500;
var TextAreaParentClasses = Webpack.getByKeys("channelBottomBarArea");
function reRender(selector) {
  const target = document.querySelector(selector)?.parentElement;
  if (!target) return;
  const instance = BdApi.ReactUtils.getOwnerInstance(target);
  const unpatch = Patcher.instead(instance, "render", () => unpatch());
  instance.forceUpdate(() => instance.forceUpdate());
}
var DeepTranslateStore = new class DeepTranslateStore2 extends Utils.Store {
  _cache = /* @__PURE__ */ new Map();
  // global log for letting us know if they hit some weird error.
  _errorLog = [];
  // why so serious
  _pending = /* @__PURE__ */ new Set();
  _lastTargetLang = /* @__PURE__ */ new Map();
  _autoTranslateUsers = /* @__PURE__ */ new Set();
  _outgoingTranslateLang = /* @__PURE__ */ new Map();
  _autoControllers = /* @__PURE__ */ new Map();
  _autoQueue = [];
  _autoQueueRunning = false;
  _lastAutoTranslateAt = 0;
  _isCurrentlyTranslating = false;
  _pendingKey(userId, messageId) {
    return `${userId}:${messageId}`;
  }
  async storeTranslate(userId, messageId, text, targetLang, sourceLang = "auto", signal) {
    const key = this._pendingKey(userId, messageId);
    this._pending.add(key);
    this.emitChange();
    try {
      const data = await translate(text, targetLang, sourceLang);
      let userMessages = this._cache.get(userId);
      if (!userMessages) {
        userMessages = /* @__PURE__ */ new Map();
        this._cache.set(userId, userMessages);
      }
      const entry = {
        translatedText: data.text,
        detectedSource: data.detectedSource,
        targetLang: data.resolvedTarget,
        lastTranslated: Date.now()
      };
      userMessages.set(messageId, entry);
      this._lastTargetLang.set(userId, targetLang.toUpperCase());
      return entry;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        throw err;
      }
      this._logError(userId, messageId, err);
      throw err;
    } finally {
      this._pending.delete(key);
      this.emitChange();
    }
  }
  queueAutoTranslate(userId, messageId, text, targetLang, sourceLang = "auto") {
    const key = this._pendingKey(userId, messageId);
    if (this.getCached(userId, messageId)) return;
    if (this._pending.has(key)) return;
    if (this._autoQueue.some((job) => job.userId === userId && job.messageId === messageId)) return;
    const controller = new AbortController();
    this._autoControllers.set(key, controller);
    this._autoQueue.push({
      userId,
      messageId,
      text,
      targetLang,
      sourceLang,
      controller
    });
    this._runAutoQueue();
  }
  async _runAutoQueue() {
    if (this._autoQueueRunning) return;
    this._autoQueueRunning = true;
    try {
      while (this._autoQueue.length > 0) {
        const wait = AUTO_TRANSLATE_MIN_INTERVAL_MS - (Date.now() - this._lastAutoTranslateAt);
        if (wait > 0) {
          await new Promise((resolve) => setTimeout(resolve, wait));
        }
        const job = this._autoQueue.shift();
        if (!job) continue;
        const key = this._pendingKey(job.userId, job.messageId);
        if (job.controller.signal.aborted) {
          this._autoControllers.delete(key);
          continue;
        }
        this._lastAutoTranslateAt = Date.now();
        try {
          await this.storeTranslate(
            job.userId,
            job.messageId,
            job.text,
            job.targetLang,
            job.sourceLang,
            job.controller.signal
          );
        } catch (err) {
          if (!(err instanceof DOMException && err.name === "AbortError")) {
          }
        } finally {
          this._autoControllers.delete(key);
        }
        if (this.isRateLimited()) {
          this._autoQueue = [];
          break;
        }
      }
    } finally {
      this._autoQueueRunning = false;
    }
  }
  cancelAutoTranslate(userId, messageId) {
    const key = this._pendingKey(userId, messageId);
    const oldLength = this._autoQueue.length;
    this._autoQueue = this._autoQueue.filter(
      (job) => !(job.userId === userId && job.messageId === messageId)
    );
    const wasQueued = this._autoQueue.length !== oldLength;
    const controller = this._autoControllers.get(key);
    if (controller) {
      controller.abort();
      this._autoControllers.delete(key);
    }
    if (wasQueued || controller) {
      this.emitChange();
      return true;
    }
    return false;
  }
  cancelAll() {
    this._autoControllers.values().map((job) => {
      job.abort();
    });
    this.emitChange();
  }
  _logError(userId, messageId, err) {
    const isTranslateError = err instanceof TranslateError;
    this._errorLog.push({
      code: isTranslateError ? err.code : 0 /* UNKNOWN */,
      message: err instanceof Error ? err.message : String(err),
      timestamp: Date.now(),
      userId,
      messageId
    });
    if (this._errorLog.length > MAX_ERROR_LOG) this._errorLog.shift();
  }
  getCached(userId, messageId) {
    return this._cache.get(userId)?.get(messageId);
  }
  getIsPending(userId, messageId) {
    return this._pending.has(this._pendingKey(userId, messageId));
  }
  getLastTargetLang(userId) {
    return this._lastTargetLang.get(userId);
  }
  getOutgoingTranslateLang(channelId) {
    return this._outgoingTranslateLang.get(channelId);
  }
  setOutgoingTranslateLang(channelId, targetLang) {
    if (targetLang) this._outgoingTranslateLang.set(channelId, targetLang);
    else this._outgoingTranslateLang.delete(channelId);
    this.emitChange();
  }
  async translateOutgoing(text, targetLang, sourceLang = "auto") {
    try {
      this._isCurrentlyTranslating = true;
      reRender(`.${TextAreaParentClasses.channelBottomBarArea}`);
      return await translate(text, targetLang, sourceLang).finally((err) => {
        this._isCurrentlyTranslating = false;
        reRender(`.${TextAreaParentClasses.channelBottomBarArea}`);
      });
    } catch (err) {
      this._logError("__outgoing__", "__outgoing__", err);
      this.emitChange();
      throw err;
    }
  }
  isCurrentlyTranslating() {
    return this._isCurrentlyTranslating;
  }
  isAutoTranslate(userId) {
    return this._autoTranslateUsers.has(userId);
  }
  toggleAutoTranslate(userId) {
    if (this._autoTranslateUsers.has(userId)) {
      this._autoTranslateUsers.delete(userId);
      this._autoQueue = this._autoQueue.filter((job) => job.userId !== userId);
    } else {
      this._autoTranslateUsers.add(userId);
    }
    this.emitChange();
  }
  getErrorLog() {
    return this._errorLog;
  }
  getLastError() {
    return this._errorLog[this._errorLog.length - 1];
  }
  isRateLimited(withinMs = 6e4) {
    const last = this.getLastError();
    return !!last && last.code === 429 /* TOO_MANY_REQUESTS */ && Date.now() - last.timestamp < withinMs;
  }
  clearUser(userId) {
    this._cache.delete(userId);
    this.emitChange();
  }
  clearMessage(userId, messageId) {
    this._cache.get(userId)?.delete(messageId);
    this.emitChange();
  }
}();

// src/DeepTranslate/deepl.tsx
function DeepL({ on }) {
  return /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "22", height: "22", viewBox: "0 0 24 24" }, /* @__PURE__ */ BdApi.React.createElement("path", { fill: on ? "var(--icon-status-online)" : "var(--interactive-text-default)", d: "M20.907 4.94L12.685.186a1.36 1.36 0 0 0-1.37 0l-8.222 4.77a1.38 1.38 0 0 0-.686 1.183v9.526a1.38 1.38 0 0 0 .686 1.194l8.222 4.76l.062.035L15.425 24l-.011-2.061l.008-1.145l.003.02v-.385a.69.69 0 0 1 .296-.56l.264-.151l.127-.07h-.008l4.803-2.78a1.38 1.38 0 0 0 .686-1.195V6.135a1.38 1.38 0 0 0-.686-1.195m-9.853 9.688a1.43 1.43 0 0 1-.4 1.384a1.41 1.41 0 0 1-1.97 0a1.42 1.42 0 0 1 0-2.063a1.41 1.41 0 0 1 2.042.076l3.328-1.916l.687.386zm5.77-2.414a1.41 1.41 0 0 1-1.97 0a1.43 1.43 0 0 1-.37-1.478l-.013.008L10.72 8.57l-.057.057a1.41 1.41 0 0 1-1.97 0a1.42 1.42 0 0 1 0-2.063a1.41 1.41 0 0 1 1.972 0c.394.377.524.918.39 1.407l3.781 2.2l.019-.019a1.41 1.41 0 0 1 1.972 0a1.427 1.427 0 0 1 0 2.061z" }));
}

// helpers/webpack.ts
var { Webpack: Webpack2 } = BdApi;

// helpers/index.tsx
var { Webpack: Webpack3, React: React3, ContextMenu: ContextMenu2, Hooks: Hooks2 } = BdApi;
var { createElement, forwardRef } = React3;
function styledBase(tag, cssOrFn) {
  return (props) => {
    const style = typeof cssOrFn === "function" ? cssOrFn(props) : cssOrFn;
    return React3.createElement(tag, { ...props, style: { ...style, ...props.style } });
  };
}
var styled = new Proxy(styledBase, {
  get(target, p) {
    return (cssOrFn) => target(p, cssOrFn);
  }
});
function getKey(module2, fn) {
  for (const key in module2) {
    if (fn(module2[key])) return { key, module: module2 };
  }
}

// src/DeepTranslate/index.tsx
var MAX_CHARS = 1500;
var DEFAULT_TARGET_LANG = navigator.language.split("-")[0].toUpperCase() ?? "EN";
var Buttons = Webpack.getBySource("isSubmitButtonEnabled", ".A.getActiveOption(");
var HeaderComponents = Webpack.getModule((x) => x.Icon && x.Title);
var ScrollerClassNames = Webpack.getByKeys("scrollbarGutterStable");
var SelectedChannelStore = Webpack.Stores.SelectedChannelStore;
var StackedBarsModule = Webpack.getBySource("xU4pF1,{", { raw: true }).declarations;
var Popout = Webpack.getModule((m) => m?.Animation, { searchExports: true, raw: true })?.exports?.Y;
function Translate() {
  return /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "22", height: "22", viewBox: "0 0 24 24" }, /* @__PURE__ */ BdApi.React.createElement(
    "path",
    {
      fill: "white",
      d: "M17 11c-.4 0-.75.23-.91.59l-4 9l1.83.81l1.07-2.41h4.03l1.07 2.41l1.83-.81l-4-9a1 1 0 0 0-.91-.59Zm-1.13 6L17 14.46L18.13 17zm-3.62-2.03l.49-1.94c-.13-.03-1.6-.43-3.17-1.42c1.4-1.41 2.49-3.26 2.74-5.61h1.68V4h-5V2h-2v2H2v2h8.3c-.25 1.91-1.19 3.34-2.31 4.4C7.3 9.75 6.68 8.96 6.25 8H4.12c.5 1.44 1.33 2.63 2.3 3.61c-1.57.99-3.04 1.39-3.17 1.42l.49 1.94c1.18-.3 2.76-.96 4.26-2.02c1.49 1.06 3.08 1.72 4.25 2.02"
    }
  ));
}
function MenuItemLabel({ title, subtext }) {
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", flexDirection: "column" } }, /* @__PURE__ */ BdApi.React.createElement("span", null, title), subtext && /* @__PURE__ */ BdApi.React.createElement("span", { style: { fontSize: "12px", color: "var(--text-danger)" } }, subtext));
}
function TCM({ user, message }) {
  const isRateLimited = Hooks.useStateFromStores([DeepTranslateStore], () => DeepTranslateStore.isRateLimited());
  const cached = Hooks.useStateFromStores([DeepTranslateStore], () => DeepTranslateStore.getCached(user.id, message.id));
  const isAutoTranslate = Hooks.useStateFromStores([DeepTranslateStore], () => DeepTranslateStore.isAutoTranslate(user.id));
  const isTooLong = message.content.length > MAX_CHARS;
  const disabled = isRateLimited || isTooLong;
  function translateTo(targetLang) {
    return () => DeepTranslateStore.storeTranslate(user.id, message.id, message.content, targetLang, "auto");
  }
  const quickTargetLang = DeepTranslateStore.getLastTargetLang(user.id) ?? DEFAULT_TARGET_LANG;
  const subtext = isRateLimited ? "Rate limited, try again shortly" : isTooLong ? `Message exceeds ${MAX_CHARS} characters` : void 0;
  async function copyTranslation() {
    await navigator.clipboard.writeText(cached.translatedText);
  }
  return /* @__PURE__ */ BdApi.React.createElement(ContextMenu.Item, { leadingAccessory: {
    type: "icon",
    icon: DeepL
  }, id: "dp-tr", label: "DeepTranslate" }, /* @__PURE__ */ BdApi.React.createElement(
    ContextMenu.Item,
    {
      id: "dr-tr-ts",
      color: disabled ? "danger" : void 0,
      disabled,
      label: /* @__PURE__ */ BdApi.React.createElement(
        MenuItemLabel,
        {
          title: `Translate to ${getLanguageName(quickTargetLang)}`,
          subtext
        }
      ),
      action: translateTo(quickTargetLang),
      leadingAccessory: {
        type: "icon",
        icon: Translate
      }
    }
  ), /* @__PURE__ */ BdApi.React.createElement(ContextMenu.Item, { id: "dr-tr-lang", disabled, label: "Translate to..." }, COMMON_TARGET_LANGS.map((code) => /* @__PURE__ */ BdApi.React.createElement(
    ContextMenu.Item,
    {
      key: code,
      id: `dr-tr-lang-${code}`,
      label: getLanguageName(code),
      action: translateTo(code)
    }
  )), /* @__PURE__ */ BdApi.React.createElement(ContextMenu.Item, { id: "dr-tr-lang-more", label: "More languages" }, ALL_TARGET_LANGS.filter((code) => !COMMON_TARGET_LANGS.includes(code)).map((code) => /* @__PURE__ */ BdApi.React.createElement(
    ContextMenu.Item,
    {
      key: code,
      id: `dr-tr-lang-${code}`,
      label: getLanguageName(code),
      action: translateTo(code)
    }
  )))), cached && /* @__PURE__ */ BdApi.React.createElement(
    ContextMenu.Item,
    {
      id: "dr-tr-refresh",
      disabled,
      label: "Refresh Translation",
      action: translateTo(cached.targetLang)
    }
  ), cached && /* @__PURE__ */ BdApi.React.createElement(ContextMenu.Item, { id: "dr-tr-copy", label: "Copy Translation", action: copyTranslation }), /* @__PURE__ */ BdApi.React.createElement(
    ContextMenu.Item,
    {
      id: "dr-tr-auto",
      color: isAutoTranslate ? "brand" : void 0,
      label: isAutoTranslate ? "Disable Auto-Translate" : `Auto-Translate to ${getLanguageName(quickTargetLang)}`,
      action: () => DeepTranslateStore.toggleAutoTranslate(user.id)
    }
  ), /* @__PURE__ */ BdApi.React.createElement(
    ContextMenu.Item,
    {
      id: "dr-tr-rm-ts",
      color: "danger",
      label: "Delete Translation",
      disabled: !cached,
      action: () => DeepTranslateStore.clearMessage(user.id, message.id)
    }
  ));
}
function TranslateComponent({ original, message, author }) {
  const translateData = Hooks.useStateFromStores([DeepTranslateStore], () => DeepTranslateStore.getCached(author.id, message.id));
  const isPending = Hooks.useStateFromStores([DeepTranslateStore], () => DeepTranslateStore.getIsPending(author.id, message.id));
  const isAutoTranslate = Hooks.useStateFromStores([DeepTranslateStore], () => DeepTranslateStore.isAutoTranslate(author.id));
  const isRateLimited = Hooks.useStateFromStores([DeepTranslateStore], () => DeepTranslateStore.isRateLimited());
  React.useEffect(() => {
    if (!isAutoTranslate || translateData || isPending || isRateLimited) return;
    if (message.content.length === 0 || message.content.length > MAX_CHARS) return;
    const targetLang = DeepTranslateStore.getLastTargetLang(author.id) ?? DEFAULT_TARGET_LANG;
    DeepTranslateStore.queueAutoTranslate(author.id, message.id, message.content, targetLang, "auto");
  }, [isAutoTranslate, translateData, isPending, isRateLimited, author.id, message.id, message.content]);
  if (!translateData && !isPending) return original;
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", flexDirection: "column" } }, original, isPending ? /* @__PURE__ */ BdApi.React.createElement("span", { style: { maxWidth: "100px !important" } }, /* @__PURE__ */ BdApi.React.createElement(Components.Spinner, null)) : /* @__PURE__ */ BdApi.React.createElement("span", { style: { fontSize: "16px", color: "var(--text-muted)" } }, translateData.translatedText, " \xB7 Translated from ", getLanguageName(translateData.detectedSource), " to ", getLanguageName(translateData.targetLang)));
}
var Wrapper = styled.div({
  display: "flex",
  alignItems: "center",
  margin: "10px 0"
});
var Line = styled.div({
  flex: 1,
  height: "2px",
  borderRadius: "100%",
  background: "var(--border-subtle)"
});
var Label = styled.span({
  margin: "0 10px",
  color: "var(--text-muted)",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  whiteSpace: "nowrap"
});
function SepWithText({ children }) {
  return /* @__PURE__ */ BdApi.React.createElement(Wrapper, null, /* @__PURE__ */ BdApi.React.createElement(Line, null), /* @__PURE__ */ BdApi.React.createElement(Label, null, children), /* @__PURE__ */ BdApi.React.createElement(Line, null));
}
function DeepLChatPopout({ channelId }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef(null);
  const selectedLang = Hooks.useStateFromStores([DeepTranslateStore], () => DeepTranslateStore.getOutgoingTranslateLang(channelId));
  function pick(lang) {
    DeepTranslateStore.setOutgoingTranslateLang(channelId, lang);
    setIsOpen(false);
  }
  function LangRow({ label, active, onClick }) {
    const [hovered, setHovered] = React.useState(false);
    return /* @__PURE__ */ BdApi.React.createElement(
      "div",
      {
        onClick,
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          padding: "6px 8px",
          borderRadius: "4px",
          fontSize: "14px",
          fontWeight: 500,
          lineHeight: "18px",
          cursor: "pointer",
          background: active ? "var(--interactive-accent-background-selected)" : hovered ? "var(--interactive-background-hover)" : "transparent",
          color: active ? "white" : "var(--interactive-text-default)"
        }
      },
      /* @__PURE__ */ BdApi.React.createElement("span", null, label),
      active && /* @__PURE__ */ BdApi.React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24" }, /* @__PURE__ */ BdApi.React.createElement(
        "path",
        {
          fill: "currentColor",
          d: "M21.7 5.3a1 1 0 0 1 0 1.4l-12 12a1 1 0 0 1-1.4 0l-6-6a1 1 0 1 1 1.4-1.4L9 16.6L20.3 5.3a1 1 0 0 1 1.4 0Z"
        }
      ))
    );
  }
  return /* @__PURE__ */ BdApi.React.createElement("div", { ref }, /* @__PURE__ */ BdApi.React.createElement(
    Popout,
    {
      shouldShow: isOpen,
      onRequestClose: () => setIsOpen(false),
      position: "top",
      clickTrap: true,
      targetElementRef: ref,
      renderPopout: () => /* @__PURE__ */ BdApi.React.createElement(
        "div",
        {
          className: Utils.className(ScrollerClassNames.container, ScrollerClassNames.scrollbarGutterStable, ScrollerClassNames.thin, ScrollerClassNames.scrollerBase, ScrollerClassNames.fade),
          style: {
            // container_d02962 scrollbarGutterStable__99f8c thin__99f8c scrollerBase__99f8c fade__99f8c
            background: "var(--background-surface-high)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--elevation-high)",
            padding: "6px",
            width: "400px",
            maxHeight: "280px",
            overflowY: "auto",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "2px"
          }
        },
        /* @__PURE__ */ BdApi.React.createElement("div", { style: {
          padding: "6px 8px 4px",
          fontSize: "12px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: ".02em",
          color: "var(--text-muted)"
        } }, "Auto-Translate Sent Messages"),
        /* @__PURE__ */ BdApi.React.createElement(LangRow, { label: "Off", active: !selectedLang, onClick: () => pick(null) }),
        /* @__PURE__ */ BdApi.React.createElement(SepWithText, null, "Common Languages"),
        COMMON_TARGET_LANGS.map((code) => /* @__PURE__ */ BdApi.React.createElement(
          LangRow,
          {
            key: code,
            label: getLanguageName(code),
            active: selectedLang === code,
            onClick: () => pick(code)
          }
        )),
        /* @__PURE__ */ BdApi.React.createElement(SepWithText, null, "All Languages"),
        ALL_TARGET_LANGS.map((code) => /* @__PURE__ */ BdApi.React.createElement(
          LangRow,
          {
            key: code,
            label: getLanguageName(code),
            active: selectedLang === code,
            onClick: () => pick(code)
          }
        ))
      )
    },
    (_props, { isShown }) => /* @__PURE__ */ BdApi.React.createElement(
      "div",
      {
        key: "rere-dern",
        ..._props,
        onClick: (e) => {
          setIsOpen((o) => !o);
        },
        style: {
          cursor: "pointer",
          display: "flex",
          color: selectedLang || isShown ? "var(--icon-brand)" : "var(--interactive-icon-default)"
        }
      },
      /* @__PURE__ */ BdApi.React.createElement(HeaderComponents.Icon, { icon: () => /* @__PURE__ */ BdApi.React.createElement(DeepL, { on: !!selectedLang }) })
    )
  ));
}
function FloatingBarTeller() {
  const isOutgoing = Hooks.useStateFromStores(
    [DeepTranslateStore],
    () => DeepTranslateStore.isCurrentlyTranslating()
  );
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      key: "floating-bar",
      style: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        ...isOutgoing ? { padding: "6px 10px" } : {},
        marginBottom: "6px",
        justifyContent: "flex-start",
        width: "100%",
        boxSizing: "border-box",
        borderBottom: "1px solid var(--border-subtle)"
      }
    },
    isOutgoing ? /* @__PURE__ */ BdApi.React.createElement(BdApi.React.Fragment, null, /* @__PURE__ */ BdApi.React.createElement(DeepL, null), /* @__PURE__ */ BdApi.React.createElement("span", { style: { color: "var(--text-default)" } }, "Currently translating...")) : null
  );
}
var DeepTranslate = class {
  async start() {
    const MessageContent = await Webpack.waitForModule(Webpack.Filters.bySource('VOICE_HANGOUT_INVITE?""'));
    const MessageActions = Webpack.getByKeys("_sendMessage");
    Patcher.instead(MessageActions, "_sendMessage", async (_this, methodArgs, originalFunc) => {
      const channelId = SelectedChannelStore.getChannelId();
      const content = methodArgs[1].content;
      const targetLang = channelId ? DeepTranslateStore.getOutgoingTranslateLang(channelId) : void 0;
      const canTranslate = targetLang && content && content.length > 0 && content.length <= MAX_CHARS && !DeepTranslateStore.isRateLimited();
      if (canTranslate) {
        try {
          const result = await DeepTranslateStore.translateOutgoing(content, targetLang);
          methodArgs[1].content = result.text;
        } catch (err) {
          throw new TranslateError("Failed to translate; Rate limit?", 0);
        }
      }
      return originalFunc.apply(_this, methodArgs);
    });
    Patcher.after(Buttons.A, "type", (_, buttonArgs, returnValue) => {
      const [props] = buttonArgs;
      const channelId = props?.channel?.id;
      if (!channelId) return returnValue;
      returnValue.props.children.unshift(/* @__PURE__ */ BdApi.React.createElement(DeepLChatPopout, { channelId, key: "deep-translate-outgoing" }));
    });
    Patcher.after(MessageContent.Ay, "type", (_this, args, returnValue) => {
      const message = args[0].message;
      if (!message) return returnValue;
      return /* @__PURE__ */ BdApi.React.createElement(TranslateComponent, { original: returnValue, message, author: message.author });
    });
    const module2 = getKey(StackedBarsModule, Webpack.Filters.byRegex(/0===.{1}.length&&0===.{1}.length/));
    Patcher.instead(module2?.module, module2?.key, (a, b, c) => {
      const data = c(...b);
      !Object.values(b[0].bars.floating).find((x) => x.type.name.includes("FloatingBarTeller")) && b[0].bars.floating.push(
        /* @__PURE__ */ BdApi.React.createElement(FloatingBarTeller, null)
      );
      return data;
    });
    this.unpatch = ContextMenu.patch("message", (res, props) => {
      res.props.children.props.children.splice(
        6,
        0,
        TCM({ user: props.message.author, message: props.message })
      );
    });
  }
  stop() {
    Patcher.unpatchAll();
    this.unpatch?.();
  }
};
