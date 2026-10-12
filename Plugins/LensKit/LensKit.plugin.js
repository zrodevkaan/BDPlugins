/**
 * @name LensKit
 * @author kaan
 * @version 1.0.0
 * @description More utilities regarding images/videos.
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/LensKit/LensKit.plugin.js
 * @invite t3zMgv7Nvb
 * @stable 634304
 * @canary 635660
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

// src/LensKit/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => LensKit
});
module.exports = __toCommonJS(index_exports);

// helpers/webpack.ts
var { Webpack } = BdApi;
function queryToFilter(query) {
  if ("filter" in query) return query.filter;
  if ("keys" in query) return Webpack.Filters.byKeys(...query.keys);
  if ("prototypeKeys" in query) return Webpack.Filters.byPrototypeKeys(...query.prototypeKeys);
  if ("strings" in query) return Webpack.Filters.byStrings(...query.strings);
  if ("source" in query) return Webpack.Filters.bySource(...query.source);
  if ("regex" in query) return Webpack.Filters.byRegex(query.regex);
  if ("displayName" in query) return Webpack.Filters.byDisplayName(query.displayName);
  return Webpack.Filters.byStoreName(query.storeName);
}
function resolveModule(filter, options) {
  const opts = options ?? {};
  if (opts.declaration) {
    const { declaration, key, raw, ...rest } = opts;
    const result = Webpack.getMangled(filter, { __value: declaration }, {
      ...rest,
      mapDeclarations: true
    });
    return result?.__value ?? null;
  }
  const mod = Webpack.getModule(filter, opts);
  if (mod == null) return null;
  return opts.key ? mod[opts.key] : mod;
}
async function resolveModuleAsync(filter, options) {
  const opts = options ?? {};
  if (opts.declaration) {
    const { declaration, raw, ...rest } = opts;
    await Webpack.waitForModule(filter, rest);
    return resolveModule(filter, opts);
  }
  return await Webpack.waitForModule(filter, opts) ?? null;
}
function resolveQuery(query) {
  if ("map" in query) {
    const q = query;
    const newModule = {};
    const foundModule = Webpack.getModule(q.filter);
    if (foundModule) {
      const remaining = new Map(Object.entries(q.map));
      for (const value of Object.values(foundModule)) {
        for (const [queryKey, queryValue] of remaining) {
          if (queryValue(value)) {
            newModule[queryKey] = value;
            remaining.delete(queryKey);
            break;
          }
        }
        if (remaining.size === 0) break;
      }
    }
    return newModule;
  }
  return resolveModule(queryToFilter(query), query.options);
}
function wpGet(filter, options) {
  return resolveModule(filter, options);
}
function wpGetBulkKeyed(queries) {
  return Object.fromEntries(
    Object.entries(queries).map(([key, query]) => [key, resolveQuery(query)])
  );
}
async function wpWait(filter, options) {
  return resolveModuleAsync(filter, options);
}

// helpers/index.tsx
var { Webpack: Webpack2, React, ContextMenu, Hooks } = BdApi;
var { createElement, forwardRef } = React;
function styledBase(tag, cssOrFn) {
  const Styled = (props) => {
    const style = typeof cssOrFn === "function" ? cssOrFn(props) : cssOrFn;
    return createElement(tag, { ...props, style: { ...style, ...props.style } });
  };
  Styled.displayName = `styled.${String(tag)}`;
  return Styled;
}
var styled = new Proxy(styledBase, {
  get: (target, p) => (css) => target(p, css)
});
function getKey(module3, fn) {
  for (const key in module3) {
    if (fn(module3[key])) return { key, module: module3 };
  }
}
function lazyExport(getter) {
  let cached;
  const resolve = () => cached ??= getter();
  return new Proxy({}, {
    get: (_, key) => resolve()?.[key],
    set: (_, key, value) => {
      const target = resolve();
      if (target) target[key] = value;
      return true;
    },
    has: (_, key) => {
      const t = resolve();
      return t ? key in t : false;
    },
    ownKeys: () => {
      const t = resolve();
      return t ? Reflect.ownKeys(t) : [];
    },
    getOwnPropertyDescriptor: (_, key) => {
      const t = resolve();
      const desc = t ? Reflect.getOwnPropertyDescriptor(t, key) : void 0;
      return desc && { ...desc, configurable: true };
    }
  });
}
function lazyStore(name) {
  return lazyExport(() => Webpack2.getStore(name));
}
var Stores = {
  User: lazyStore("UserStore"),
  Guild: lazyStore("GuildStore"),
  Channel: lazyStore("ChannelStore"),
  GuildMember: lazyStore("GuildMemberStore"),
  SelectedGuild: lazyStore("SelectedGuildStore"),
  SelectedChannel: lazyStore("SelectedChannelStore"),
  Message: lazyStore("MessageStore")
};

// src/Arven/modules/webpack.tsx
var LazyChunkRegex = /Promise\.all\(\[((?:\w\.e\("?\d+"?\),?)+)\]\)\.then\(\w(?:\.\w)?\.bind\(\w,\s*"?(\d+)"?\)\)/g;
var ChunkIdRegex = /\w\.e\("?(\d+)"?\)/g;
var DepRegex = /\w\((\d+)\)/g;
var __webpack_require__;
var strip = (str) => str.replace(/\s+/g, "");
var Webpack3 = class {
  require;
  limiter = this.createLimiter(50);
  _loading = false;
  constructor() {
    webpackChunkdiscord_app.push([
      [Symbol("Arven")],
      {},
      (e) => {
        if (typeof e.b == "string") {
          this.require = e;
          __webpack_require__ = e;
          const n = ((id2, raw) => {
            return raw ? __webpack_require__.c[id2] : __webpack_require__(id2);
          });
          for (const key of Object.getOwnPropertyNames(__webpack_require__)) {
            Object.defineProperty(n, key, {
              get: () => __webpack_require__[key],
              set: (val) => {
                __webpack_require__[key] = val;
              },
              enumerable: true,
              configurable: true
            });
          }
          window.n = new Proxy(n, {
            get: (target, prop) => prop in target ? target[prop] : __webpack_require__[prop],
            set: (target, prop, val) => {
              if (prop in target) target[prop] = val;
              else __webpack_require__[prop] = val;
              return true;
            }
          });
        }
      }
    ]);
  }
  chunkMap() {
    const sym = Symbol();
    let v = null;
    Object.defineProperty(Object.prototype, sym, {
      get() {
        v = this;
        return "";
      },
      configurable: true
    });
    this.require.u(sym);
    delete Object.prototype[sym];
    return v;
  }
  async loadAllBackwash() {
    for (const id2 in this.require.m) {
      for (const [, rawChunkIds, entry] of String(this.require.m[id2]).matchAll(LazyChunkRegex)) {
        const chunkIds = Array.from(rawChunkIds.matchAll(ChunkIdRegex), (m) => m[1]);
        if (!chunkIds.length) continue;
        try {
          await Promise.all(chunkIds.map((cid) => this.limiter(() => this.require.e(cid))));
          if (this.require.m[entry]) this.require(entry);
        } catch {
        }
      }
    }
  }
  createLimiter(concurrency) {
    let active = 0;
    const queue = [];
    return function limit(fn) {
      return new Promise((resolve, reject) => {
        const run = () => {
          active++;
          fn().then(resolve, reject).finally(() => {
            active--;
            queue.shift()?.();
          });
        };
        active < concurrency ? run() : queue.push(run);
      });
    };
  }
  get isLoading() {
    return this._loading;
  }
  toggleLoading() {
    this._loading = !this._loading;
    return this._loading;
  }
  unloadTree(entryId) {
    const seen = /* @__PURE__ */ new Set();
    const walk = (id2) => {
      if (seen.has(id2)) return;
      seen.add(id2);
      this.getStaticDeps(id2).forEach(walk);
    };
    walk(entryId);
    seen.forEach((id2) => {
      delete this.require.c[id2];
      delete this.require.m[id2];
    });
  }
  async loadAll() {
    const validChunks = /* @__PURE__ */ new Set();
    const invalidChunks = /* @__PURE__ */ new Set();
    this.toggleLoading();
    for (const id2 in this.require.m) {
      const factoryCode = String(this.require.m[id2]);
      const matches2 = factoryCode.matchAll(LazyChunkRegex);
      for (const [, rawChunkIds, entryPoint] of matches2) {
        const chunkIds = Array.from(rawChunkIds.matchAll(ChunkIdRegex), (m) => m[1]);
        if (chunkIds.length === 0) continue;
        let invalidGroup = false;
        await Promise.all(chunkIds.map((chunkId) => this.limiter(async () => {
          const path = this.require.u(chunkId);
          if (path == null || path.includes("undefined.js")) return;
          try {
            const content = await fetch(this.require.p + path).then((r) => r.text());
            if (/importScripts\(|self\.postMessage/.test(content)) {
              invalidChunks.add(chunkId);
              invalidGroup = true;
              return;
            }
            validChunks.add(chunkId);
          } catch (e) {
            BetterDiscord.Logger.error(e);
          }
        })));
        if (invalidGroup) continue;
        try {
          await Promise.all(chunkIds.map((cid) => this.limiter(() => this.require.e(cid))));
          if (this.require.m[entryPoint]) {
            this.require(entryPoint);
          }
        } catch (e) {
          BetterDiscord.Logger.error(e);
        }
      }
    }
    const chunkMap = this.chunkMap();
    if (!chunkMap) return;
    const leftover = Object.keys(chunkMap).filter((id2) => !validChunks.has(id2) && !invalidChunks.has(id2));
    await Promise.all(leftover.map((id2) => this.limiter(async () => {
      try {
        const path = this.require.u(id2);
        if (path == null || path.includes("undefined.js")) return;
        const content = await fetch(this.require.p + path).then((r) => r.text());
        if (/importScripts\(|self\.postMessage/.test(content)) return;
        await this.require.e(id2);
      } catch (e) {
        BetterDiscord.Logger.error(e);
      } finally {
        this.toggleLoading();
      }
    })));
  }
  getStaticDeps(id2) {
    const src = String(this.require.m[id2]);
    return Array.from(src.matchAll(DepRegex), (m) => m[1]);
  }
  findDependents(targetId) {
    const dependents = [];
    for (const id2 in this.require.m) {
      if (String(this.require.m[id2]).includes(`(${targetId})`)) {
        dependents.push(id2);
      }
    }
    return dependents;
  }
  lazyModule(filter) {
    let resolved;
    return new Proxy({}, {
      get(_, prop) {
        if (!resolved) resolved = wpGet(filter);
        return resolved?.[prop];
      }
    });
  }
  async loadEntry(string) {
    if (!string) return null;
    const start = String(string);
    if (!start) return null;
    const end = strip(start);
    const chunks = end.matchAll(LazyChunkRegex);
    if (!chunks) return null;
    let entries = [];
    for (const [, rawChunkIds, entryPoint] of chunks) {
      const chunkIds = Array.from(rawChunkIds.matchAll(ChunkIdRegex), (m) => m[1]);
      if (chunkIds.length === 0) continue;
      await Promise.all(chunkIds.map(async (id2) => {
        const path = this.require.u(id2);
        if (path == null || path.includes("undefined.js")) return;
        try {
          const content = await fetch(this.require.p + path).then((r) => r.text());
          if (/importScripts\(|self\.postMessage/.test(content)) return;
          await this.require.e(id2);
        } catch (e) {
          BetterDiscord.Logger.error(e);
        }
      })).then(() => {
        if (this.require.m[entryPoint]) {
          this.require(entryPoint);
          entries.push(entryPoint);
        }
      });
    }
    return entries.map((x) => this.require(x));
  }
};

// src/Arven/modules/utils.tsx
var Utils = class {
  withTimeout(signal, ms) {
    const timeoutSignal = AbortSignal.timeout(ms);
    if (!signal) return timeoutSignal;
    return AbortSignal.any([signal, timeoutSignal]);
  }
};

// src/Arven/shared/index.tsx
var BetterDiscord = new BdApi("ArvenLib");
var PATCHER_GLOBAL_NAME = String(Date.now());
var PatchesPatcher = new BdApi(PATCHER_GLOBAL_NAME);
var DefaultOptions = {
  options: {
    searchExports: true
  }
};
var GlobalModules = wpGetBulkKeyed({
  Typing: {
    filter: BetterDiscord.Webpack.Filters.byKeys("startTyping"),
    ...DefaultOptions
  },
  Endpoints: {
    filter: (x) => x.STORE_LAYOUT && x.USER_ACTIVITY_SUBSCRIBE,
    ...DefaultOptions
  },
  Dispatcher: {
    filter: BetterDiscord.Webpack.Filters.byStoreName("UserStore"),
    // A is faster than UserStore
    ...DefaultOptions,
    options: {
      key: "_dispatcher"
    }
  },
  HTTP: {
    filter: (m) => typeof m === "object" && m.del && m.put,
    ...DefaultOptions
  },
  Gateway: {
    filter: BetterDiscord.Webpack.Filters.byStoreName("GatewayConnectionStore")
  },
  Flux: {
    filter: BetterDiscord.Webpack.Filters.bySource("OfflineCacheStore"),
    options: {
      key: "Ay"
    }
  },
  Intl: {
    filter: BetterDiscord.Webpack.Filters.byKeys("intl")
  },
  ModalModule: {
    filter: BetterDiscord.Webpack.Filters.byKeys("openModal")
  },
  SimpleMarkdownWrapper: {
    filter: (m) => m.reactParserFor
  },
  AssetModule: {
    filter: BetterDiscord.Webpack.Filters.bySource("ApplicationAssetUtils"),
    map: {
      getAssetImage: BetterDiscord.Webpack.Filters.byStrings(".TWITCH?null"),
      getAssetImageId: BetterDiscord.Webpack.Filters.byStrings(".serialize(t)"),
      fetchApplicationAssets: BetterDiscord.Webpack.Filters.byStrings("APPLICATION_ASSETS_UPDATE"),
      getAssetImages: BetterDiscord.Webpack.Filters.byStrings(`.startsWith("http:")`)
    }
  },
  Lodash: {
    filter: BetterDiscord.Webpack.Filters.bySource('="Expected a function",')
  }
});
var DiscordComponents = wpGetBulkKeyed({
  Header: {
    filter: BetterDiscord.Webpack.Filters.bySource(".Ay.Masks.HEADER_BAR_BADGE_BOTTOM,"),
    ...DefaultOptions,
    options: {
      key: "Ay"
    }
  },
  Modal: {
    filter: BetterDiscord.Webpack.Filters.byStrings("actionBarInputLayout"),
    ...DefaultOptions
  }
});
var id = wpGet(BetterDiscord.Webpack.Filters.bySource("disableDoubleTap:"), { raw: true }).id;
var text = BetterDiscord.Webpack.modules[id].toString();
var REGEX = /(\w+)\s?=\s?.\("(\w+)",\s?"(\w+)/g;
var matches = [...text.matchAll(REGEX)];
var module2 = BetterDiscord.Webpack.getById(id, { raw: true }).declarations;
var EverySettingsImaginable = {};
matches.map((x) => {
  const delc = x[1], _ = x[2], key = x[3];
  EverySettingsImaginable[_] = {
    ...EverySettingsImaginable[_],
    [key]: module2[delc]
  };
  return EverySettingsImaginable;
});
var LayerManager = {
  pushLayer(component) {
    GlobalModules.Dispatcher.dispatch({
      type: "LAYER_PUSH",
      component
    });
  },
  popLayer() {
    GlobalModules.Dispatcher.dispatch({
      type: "LAYER_POP"
    });
  },
  popAllLayers() {
    GlobalModules.Dispatcher.dispatch({
      type: "LAYER_POP_ALL"
    });
  }
};
GlobalModules.LayoutManager = LayerManager;
GlobalModules.Settings = EverySettingsImaginable;
function StoreProxy() {
  const Stores2 = GlobalModules.Flux.Store.getAll();
  const StoreNames = {};
  for (let i = 0; i < Stores2.length; i++) {
    const store = Stores2[i];
    if (!store) return null;
    const name = store.getName();
    if (!StoreNames[name]) {
      Object.defineProperty(StoreNames, name, {
        value: store
      });
    }
  }
  return new Proxy(StoreNames, {
    get(target, prop, receiver) {
      return StoreNames[prop] || Stores2.find((x) => x.getName() === prop) || null;
    },
    set(target, p, newValue, receiver) {
      BetterDiscord.Logger.error(new Error("Cannot replace value on Stores"));
      return false;
    }
  });
}
var GlobalStores = StoreProxy();
var GlobalWebpack = new Webpack3();
var GlobalUtils = new Utils();
var ArvenGlobal2 = {};
ArvenGlobal2.Stores = GlobalStores;
ArvenGlobal2.Webpack = GlobalWebpack;
ArvenGlobal2.Modules = GlobalModules;
ArvenGlobal2.Utils = GlobalUtils;
ArvenGlobal2.Components = DiscordComponents;
window.dash = GlobalModules.Lodash;

// src/LensKit/shared.ts
var { Webpack: Webpack4, Patcher, React: React2, Data, Utils: Utils2, Hooks: Hooks2, Net, ContextMenu: ContextMenu2, ReactUtils } = new BdApi("LensKit");
var ProfileModalHelpers = Webpack4.getMangled("user_profile_avatar", {
  openProfilePicture: (x) => String(x).includes("user_profile_avatar"),
  resolveUserProfilePicture: (x) => String(x).includes("renderWindow")
}, { raw: true, mapDeclarations: true });
var FetchUser = getKey(Webpack4.getModule(Webpack4.Filters.combine(Webpack4.Filters.bySource("UserProfileModalActionCreators"), Webpack4.Filters.bySource("CURRENT_USER_UPDATE"))), (x) => String(x).includes("USER_UPDATE") && !String(x).includes("USER_PROFILE_FETCH_START") && String(x).includes("Promise.resolve"));
Patcher.instead(ProfileModalHelpers, "resolveUserProfilePicture", (_, args, __) => {
  const user = args[0].user;
  const data = __(...args);
  if (data.alt === "lenskit_secret") {
    const banner = `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=4096`;
    return {
      ...data,
      original: banner,
      url: banner,
      width: 2e3
    };
  }
  return data;
});
var DefaultOptions2 = {
  options: {
    searchExports: true
  }
};
var GlobalModules2 = wpGetBulkKeyed({
  Typing: {
    filter: BetterDiscord.Webpack.Filters.byKeys("startTyping")
  },
  Endpoints: {
    filter: (x) => x.STORE_LAYOUT && x.USER_ACTIVITY_SUBSCRIBE,
    ...DefaultOptions2
  },
  Dispatcher: {
    filter: BetterDiscord.Webpack.Filters.byStoreName("UserStore"),
    // A is faster than UserStore
    ...DefaultOptions2,
    options: {
      key: "_dispatcher"
    }
  },
  HTTP: {
    filter: (m) => typeof m === "object" && m.del && m.put,
    ...DefaultOptions2
  },
  Gateway: {
    filter: BetterDiscord.Webpack.Filters.byStoreName("GatewayConnectionStore")
  },
  Flux: {
    filter: BetterDiscord.Webpack.Filters.bySource("OfflineCacheStore"),
    options: {
      key: "Ay"
    }
  },
  Intl: {
    filter: BetterDiscord.Webpack.Filters.byKeys("intl")
  },
  ModalModule: {
    filter: BetterDiscord.Webpack.Filters.byKeys("openModal")
  },
  SimpleMarkdownWrapper: {
    filter: (m) => m.reactParserFor
  },
  AssetModule: {
    filter: BetterDiscord.Webpack.Filters.bySource("ApplicationAssetUtils"),
    map: {
      getAssetImage: BetterDiscord.Webpack.Filters.byStrings(".TWITCH?null"),
      getAssetImageId: BetterDiscord.Webpack.Filters.byStrings(".serialize(t)"),
      fetchApplicationAssets: BetterDiscord.Webpack.Filters.byStrings("APPLICATION_ASSETS_UPDATE"),
      getAssetImages: BetterDiscord.Webpack.Filters.byStrings(`.startsWith("http:")`)
    }
  },
  Lodash: {
    filter: BetterDiscord.Webpack.Filters.bySource('="Expected a function",')
  }
});
var DiscordComponents2 = wpGetBulkKeyed({
  Header: {
    filter: BetterDiscord.Webpack.Filters.bySource(".Ay.Masks.HEADER_BAR_BADGE_BOTTOM,"),
    ...DefaultOptions2,
    options: {
      key: "Ay"
    }
  },
  Modal: {
    filter: BetterDiscord.Webpack.Filters.byStrings("actionBarInputLayout"),
    options: {
      key: "a"
    }
  }
});

// src/LensKit/Settings.ts
var defaultSettings = {
  "lensSize": 150,
  "lensZoom": 2.5
};
var Settings_default = new class SettingsStore extends Utils2.Store {
  settings = {
    ...defaultSettings,
    ...Data.load("settings") ?? {}
  };
  listeners = /* @__PURE__ */ new Map();
  get(id2) {
    return this.settings[id2];
  }
  set(id2, value) {
    this.settings = { ...this.settings, [id2]: value };
    Data.save("settings", this.settings);
    this.emitChange();
    this.notify(id2, value);
  }
  del(id2) {
    this.settings = { ...this.settings, [id2]: defaultSettings[id2] };
    Data.save("settings", this.settings);
    this.emitChange();
    this.notify(id2, this.settings[id2]);
  }
  getAll() {
    return this.settings;
  }
  subscribe(id2, callback) {
    if (!this.listeners.has(id2)) {
      this.listeners.set(id2, /* @__PURE__ */ new Set());
    }
    this.listeners.get(id2).add(callback);
    return () => {
      this.listeners.get(id2)?.delete(callback);
    };
  }
  notify(id2, value) {
    this.listeners.get(id2)?.forEach((cb) => cb(value));
  }
}();

// src/LensKit/ui/icons.tsx
function HamburgerMenu() {
  return /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24px", height: "24px", viewBox: "0 0 16 16" }, /* @__PURE__ */ BdApi.React.createElement(
    "path",
    {
      fill: "none",
      stroke: "white",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 1.5,
      d: "m2.75 12.25h10.5m-10.5-4h10.5m-10.5-4h10.5"
    }
  ));
}
function LensKitIcon() {
  return /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "22px", height: "22px", viewBox: "0 0 48 48" }, /* @__PURE__ */ BdApi.React.createElement("defs", null, /* @__PURE__ */ BdApi.React.createElement("mask", { id: "SVGZuRgvdWm" }, /* @__PURE__ */ BdApi.React.createElement("g", { fill: "none", strokeWidth: 4 }, /* @__PURE__ */ BdApi.React.createElement("path", { stroke: "#fff", strokeLinejoin: "round", d: "m15 12l3-6h12l3 6z" }), /* @__PURE__ */ BdApi.React.createElement(
    "path",
    {
      fill: "#fff",
      stroke: "#fff",
      strokeLinejoin: "round",
      d: "M41 12H7c-1.657 0-3 1.254-3 2.8v24.4C4 40.746 5.343 42 7 42h34c1.657 0 3-1.254 3-2.8V14.8c0-1.546-1.343-2.8-3-2.8Z"
    }
  ), /* @__PURE__ */ BdApi.React.createElement("path", { stroke: "#000", strokeLinecap: "round", strokeLinejoin: "round", d: "M32 19v8m-16 0v8" }), /* @__PURE__ */ BdApi.React.createElement(
    "path",
    {
      stroke: "#000",
      strokeLinecap: "round",
      d: "M16 27a8 8 0 0 0 11 7.419M32 27a8 8 0 0 0-11-7.419"
    }
  )))), /* @__PURE__ */ BdApi.React.createElement("path", { fill: "currentColor", d: "M0 0h48v48H0z", mask: "url(#SVGZuRgvdWm)" }));
}
var InfoIcon = () => /* @__PURE__ */ BdApi.React.createElement("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2zm0-8h-2V7h2z" }));
var SearchIcon = () => /* @__PURE__ */ BdApi.React.createElement("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    d: "M15.5 14h-.79l-.28-.27a6.5 6.5 0 10-.7.7l.27.28v.79l5 5L20.5 19zm-6 0a4.5 4.5 0 110-9 4.5 4.5 0 010 9z"
  }
));
var CopyIcon = () => /* @__PURE__ */ BdApi.React.createElement("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    d: "M16 1H4a2 2 0 00-2 2v14h2V3h12zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11z"
  }
));
var DownloadIcon = () => /* @__PURE__ */ BdApi.React.createElement("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M5 20h14v-2H5zM19 9h-4V3H9v6H5l7 7z" }));
var LinkIcon = () => /* @__PURE__ */ BdApi.React.createElement("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    d: "M3.9 12a5 5 0 015-5h3v2h-3a3 3 0 000 6h3v2h-3a5 5 0 01-5-5zm6-1h4v2h-4zm4.1-4h3a5 5 0 010 10h-3v-2h3a3 3 0 000-6h-3z"
  }
));
var OpenIcon = () => /* @__PURE__ */ BdApi.React.createElement("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    d: "M14 3v2h3.6l-9.8 9.8 1.4 1.4L19 6.4V10h2V3zM5 5h6V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-6h-2v6H5z"
  }
));
function generateFaviconURL(website, size = 16) {
  const url = new URL("https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL");
  url.searchParams.set("url", `https://${website}`);
  url.searchParams.set("size", String(size));
  return url.href;
}

// src/LensKit/utils/index.tsx
function MenuItemLabel({ title, subtext }) {
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", flexDirection: "column" } }, /* @__PURE__ */ BdApi.React.createElement("span", null, title), subtext && /* @__PURE__ */ BdApi.React.createElement("span", { style: { fontSize: "12px", color: "var(--text-feedback-critical)" } }, subtext));
}

// src/LensKit/contextmenus.tsx
function pushIntoProps(res, item) {
  const children = Array.isArray(res.props.children) ? res.props.children : res.props.children.props.children;
  if (children.some((c) => c?.props?.id === item.props.id)) return;
  children.push(item);
}
function makeItem(x) {
  const id2 = x.id ?? `lenskit-${String(x.icon)}-${typeof x.label === "string" ? x.label : Math.random()}`;
  const extraProps = x.icon ? { leadingAccessory: { type: "icon", icon: () => /* @__PURE__ */ BdApi.React.createElement(x.icon, null) } } : {};
  return x.children ? /* @__PURE__ */ BdApi.React.createElement(ContextMenu2.Item, { ...extraProps, ...x, key: id2, id: id2 }, x.children) : /* @__PURE__ */ BdApi.React.createElement(ContextMenu2.Item, { ...extraProps, ...x, key: id2, id: id2 });
}
function copy(x) {
  return window.navigator.clipboard.writeText(x);
}
function assetExt(hash) {
  return hash?.startsWith("a_") ? "gif" : "png";
}
function getGuildMember(guildId, userId) {
  return guildId ? Webpack4.Stores.GuildMemberStore.getMember(guildId, userId) : null;
}
function getBannerUrl(user, guildId) {
  const member = getGuildMember(guildId, user.id);
  if (member?.banner) return `https://cdn.discordapp.com/guilds/${guildId}/users/${user.id}/banners/${member.banner}.${assetExt(member.banner)}?size=4096`;
  if (user.banner) return `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${assetExt(user.banner)}?size=4096`;
  return null;
}
function parseDataId(parentElement) {
  const data = ReactUtils.getInternalInstance(parentElement);
  const string = data.memoizedProps["data-list-item-id"].split("-");
  return { channelId: string[string.length - 2], messageId: string[string.length - 1] };
}
function buildMessageContext(target) {
  const element = target?.closest('[class^="message"]');
  if (!element) return { channelId: void 0, messageId: void 0, message: void 0 };
  const { channelId, messageId } = parseDataId(element);
  return { channelId, messageId, message: Webpack4.Stores.MessageStore.getMessage(channelId, messageId) };
}
function buildActionContext(props) {
  const guildId = props.channel?.guild_id ?? Webpack4.Stores.SelectedGuildStore.getGuildId();
  return {
    ...props,
    ...buildMessageContext(props.target),
    guildId,
    user: props.user ? Webpack4.Stores.UserStore.getUser(props.user.id) : props.user
  };
}
var REVERSE_SEARCH_ENGINES = {
  "Google Lens": (url) => `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(url)}`,
  "Yandex": (url) => `https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(url)}`,
  "TinEye": (url) => `https://tineye.com/search?url=${encodeURIComponent(url)}`,
  "SauceNAO": (url) => `https://saucenao.com/search.php?url=${encodeURIComponent(url)}`,
  "Bing Visual Search": (u) => `https://www.bing.com/images/search?q=imgurl:${encodeURIComponent(u)}&view=detailv2&iss=sbi`,
  "Trace.moe (anime)": (u) => `https://trace.moe/?url=${encodeURIComponent(u)}`,
  "IQDB (anime)": (u) => `https://iqdb.org/?url=${encodeURIComponent(u)}`,
  "ascii2d": (u) => `https://ascii2d.net/search/url/${encodeURIComponent(u)}`
};
async function fetchAsBlob(url) {
  const res = await fetch(url, { mode: "cors" });
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  return res.blob();
}
async function copyImageToClipboard(url) {
  const blob = await fetchAsBlob(url);
  const target = blob.type === "image/png" ? blob : await convertToPng(blob);
  await navigator.clipboard.write([new ClipboardItem({ [target.type]: target })]);
}
function convertToPng(blob) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objUrl = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
      canvas.toBlob((b) => {
        URL.revokeObjectURL(objUrl);
        b ? resolve(b) : reject(new Error("canvas.toBlob returned null"));
      }, "image/png");
    };
    img.onerror = reject;
    img.src = objUrl;
  });
}
async function downloadImage(url) {
  const blob = await fetchAsBlob(url);
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = url.split("/").pop()?.split("?")[0] || "image";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);
}
var LensKitActions = {
  "Avatar": {
    error: "avatar!",
    condition: (props) => !props.user.getAvatarURL(null, 4096).startsWith("/asset"),
    children: [
      {
        label: "Copy Link",
        action: (props) => copy(props.user.getAvatarURL(props.guildId, 4096))
      },
      {
        label: "Open Image",
        action: (props) => ProfileModalHelpers.openProfilePicture({
          user: props.user,
          guildId: props.guildId
        }, true)
      }
    ]
  },
  "Banner": {
    error: "banner!",
    condition: (props) => !!getBannerUrl(props.user, props.guildId),
    children: [
      {
        label: "Copy Link",
        action: (props) => copy(getBannerUrl(props.user, props.guildId))
      },
      {
        label: "Open Image",
        action: (props) => ProfileModalHelpers.openProfilePicture({
          user: props.user,
          guildId: props.guildId,
          alt: "lenskit_secret"
        }, true)
      }
    ]
  }
};
function buildImageInfoMenu(imageProps) {
  const rows = [
    ["Dimensions", `${imageProps.width} \xD7 ${imageProps.height}`],
    ["Animated", imageProps.srcIsAnimated ? "Yes" : "No"]
  ];
  return makeItem({
    id: "lenskit-image-info",
    label: `${imageProps.alt == void 0 ? "Image" : imageProps.alt.toUpperCase()} Info`,
    icon: InfoIcon,
    children: rows.map(
      ([title, subtext]) => makeItem({
        id: `lenskit-info-${title.toLowerCase().replace(/\s+/g, "-")}`,
        action: () => copy(subtext),
        label: /* @__PURE__ */ BdApi.React.createElement(MenuItemLabel, { title, subtext })
      })
    )
  });
}
function buildReverseSearchMenu(link) {
  return makeItem({
    id: "lenskit-reverse-search",
    label: "Reverse Image Search",
    icon: SearchIcon,
    children: Object.entries(REVERSE_SEARCH_ENGINES).map(
      ([name, buildUrl]) => makeItem({
        label: name,
        icon: () => {
          const decodedLink = buildUrl(link);
          const _link = decodedLink.match(/https:\/\/(.*\/)/);
          return /* @__PURE__ */ BdApi.React.createElement("img", { src: generateFaviconURL(_link[1]) });
        },
        action: () => window.open(buildUrl(link), "_blank")
      })
    )
  });
}
function buildClipboardMenu(link, imageProps) {
  const hasDistinctOriginal = imageProps.original && imageProps.original !== imageProps.src;
  return makeItem({
    id: "lenskit-clipboard",
    label: "Copy",
    icon: CopyIcon,
    children: [
      makeItem({
        label: "Link",
        icon: LinkIcon,
        action: () => copy(link)
      }),
      ...hasDistinctOriginal ? [
        makeItem({
          label: "Original Link",
          icon: LinkIcon,
          action: () => copy(imageProps.original)
        })
      ] : [],
      makeItem({
        label: "Image",
        icon: CopyIcon,
        action: async () => {
          await copyImageToClipboard(link);
        }
      })
    ]
  });
}
var contextmenus_default = {
  "lenskit": [{
    func: (res, props) => {
      const imageProps = res.props.imageProps;
      function menu() {
        const link = imageProps.original || imageProps.src;
        return makeItem({
          label: "LensKit",
          icon: LensKitIcon,
          children: [
            buildImageInfoMenu(imageProps),
            /* @__PURE__ */ BdApi.React.createElement(ContextMenu2.Separator, { key: "lenskit-sep-1" }),
            buildReverseSearchMenu(link),
            buildClipboardMenu(link, imageProps),
            /* @__PURE__ */ BdApi.React.createElement(ContextMenu2.Separator, { key: "lenskit-sep-2" }),
            makeItem({
              label: "Open in Browser",
              icon: OpenIcon,
              action: () => window.open(link, "_blank")
            }),
            makeItem({
              label: "Download",
              icon: DownloadIcon,
              action: async () => {
                await downloadImage(link);
              }
            })
          ]
        });
      }
      Object.defineProperty(res.props, "children", { value: [] });
      const item = menu();
      if (item) pushIntoProps(res, item);
    }
  }],
  "user-context": [
    {
      func: (res, props) => {
        function menu() {
          const context = buildActionContext(props);
          const submenuItems = Object.entries(LensKitActions).map(([menuLabel, value]) => {
            const enabled = value.condition(context);
            return makeItem({
              disabled: !enabled,
              label: !enabled ? /* @__PURE__ */ BdApi.React.createElement(MenuItemLabel, { title: menuLabel, subtext: `No valid ${value.error}` }) : menuLabel,
              children: enabled ? value.children.map(
                (child) => makeItem({
                  label: child.label,
                  action: () => child.action(context)
                })
              ) : void 0
            });
          });
          if (submenuItems.length === 0) return null;
          return makeItem({
            label: "LensKit",
            icon: LensKitIcon,
            children: submenuItems
          });
        }
        const item = menu();
        if (item) pushIntoProps(res, item);
      }
    }
  ]
};

// src/LensKit/index.tsx
var ZOOM_SENSITIVITY = 1e-3;
var SIZE_SENSITIVITY = 0.5;
var IGNORE_ATTR = "data-lenskit-ignore";
function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}
function fuckOffDiscord(e) {
  e.preventDefault();
  e.stopPropagation();
}
function parseDiscordProxyUrl(proxyUrl) {
  const u = new URL(proxyUrl);
  if (!u.hostname.endsWith("discordapp.net")) return null;
  const parts = u.pathname.replace(/^\//, "").split("/");
  if (parts[0] !== "external" || parts.length < 3) return null;
  const scheme = parts[2];
  const rest = parts.slice(3).join("/");
  if (scheme !== "http" && scheme !== "https") return null;
  return `${scheme}://${rest}${u.search}`;
}
function OverrideZoom({ node, props }) {
  const mediaRef = React2.useRef(null);
  const fetchedSrcRef = React2.useRef(null);
  const [videoBgSrc, setVideoBgSrc] = React2.useState(void 0);
  const [lens, setLens] = React2.useState(null);
  const settings = Hooks2.useStateFromStores([Settings_default], () => Settings_default.getAll());
  const [{ size, zoom }, setData] = React2.useState({
    size: settings.lensSize,
    zoom: settings.lensZoom
  });
  const [holding, setHolding] = React2.useState(false);
  React2.useEffect(() => {
    const mediaElement = document.querySelector(
      "[class^=layerContainer] [class^=loadingOverlay] img, [class^=layerContainer] [class^=loadingOverlay] video"
    );
    if (mediaElement) mediaRef.current = mediaElement;
  });
  React2.useEffect(() => {
    const media = mediaRef.current;
    if (media instanceof HTMLVideoElement) {
      const src = props.media.src || props.media.url || props.media.original;
      setVideoBgSrc(parseDiscordProxyUrl(src));
    } else {
      fetchedSrcRef.current = null;
    }
  });
  function updateLensFromClientPos(clientX, clientY, event) {
    const media = mediaRef.current;
    if (!media) return;
    const rect = media.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    const y = clamp(clientY - rect.top, 0, rect.height);
    setLens({
      x: event.clientX - size / 2,
      y: event.clientY - size / 2,
      imgX: x,
      imgY: y,
      rectW: rect.width,
      rectH: rect.height
    });
  }
  function handleMouseMove(e) {
    if (!holding) return;
    updateLensFromClientPos(e.clientX, e.clientY, e);
  }
  function handleMouseDown(e) {
    if (e.button == 2) return;
    const media = mediaRef.current;
    if (!media) return;
    fuckOffDiscord(e);
    setHolding(true);
    updateLensFromClientPos(e.clientX, e.clientY, e);
  }
  function handleMouseUp(e) {
    if (e.button == 2) return;
    fuckOffDiscord(e);
    setHolding(false);
    setLens(null);
  }
  function handleMouseLeave(e) {
    fuckOffDiscord(e);
    setHolding(false);
    setLens(null);
  }
  function handleScrollWheel(e) {
    fuckOffDiscord(e);
    if (!e.shiftKey) {
      setData((prev) => ({
        ...prev,
        zoom: clamp(prev.zoom - e.deltaY * ZOOM_SENSITIVITY, 1, 10)
      }));
    } else {
      setData((prev) => ({
        ...prev,
        size: clamp(prev.size - e.deltaY * SIZE_SENSITIVITY, 1, 400)
      }));
    }
  }
  const bgSrc = mediaRef.current instanceof HTMLImageElement ? mediaRef.current.currentSrc || mediaRef.current.src : mediaRef.current instanceof HTMLVideoElement ? videoBgSrc : void 0;
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      className: "zoom",
      onWheelCapture: handleScrollWheel,
      onMouseMove: handleMouseMove,
      onMouseDownCapture: handleMouseDown,
      onMouseUpCapture: handleMouseUp,
      onMouseLeave: handleMouseLeave
    },
    lens && bgSrc && holding ? /* @__PURE__ */ BdApi.React.createElement(
      "div",
      {
        className: "result",
        style: {
          position: "fixed",
          left: lens.x,
          top: lens.y,
          width: size,
          height: size,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.8)",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          pointerEvents: "none",
          zIndex: 9999,
          backgroundImage: `url(${bgSrc})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${lens.rectW * zoom}px ${lens.rectH * zoom}px`,
          backgroundPosition: `${size / 2 - lens.imgX * zoom}px ${size / 2 - lens.imgY * zoom}px`
        }
      }
    ) : null,
    node
  );
}
function TestImageActionbar({ data, isVideo, isGIF }) {
  const { width, height } = data;
  const inset = 7;
  const MIN_FOR_HAMBURGER = 40;
  if (width < MIN_FOR_HAMBURGER || height < MIN_FOR_HAMBURGER) {
    return null;
  }
  const getStyles = () => {
    return isVideo ? {
      top: isVideo ? inset - 3 : 0,
      left: isVideo ? inset - 3 : 0,
      background: "var(--background-gradient-chat,var(--background-base-lower))",
      width: 30,
      height: 30,
      borderRadius: "5px",
      padding: "6px"
    } : {
      bottom: inset
    };
  };
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      ...{ [IGNORE_ATTR]: true },
      onMouseDown: fuckOffDiscord,
      onMouseUp: fuckOffDiscord,
      onMouseUpCapture: fuckOffDiscord,
      onDoubleClick: fuckOffDiscord,
      onWheel: fuckOffDiscord,
      onDragStart: fuckOffDiscord,
      onClick: (e) => {
        fuckOffDiscord(e);
        ContextMenu2.open(e, () => /* @__PURE__ */ BdApi.React.createElement(
          ContextMenu2.Menu,
          {
            navId: "lenskit",
            onClose: () => GlobalModules2.Dispatcher.dispatch({ type: "CONTEXT_MENU_CLOSE" }),
            imageProps: data
          }
        ));
      },
      style: {
        padding: "2px",
        position: "absolute",
        left: inset,
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--opacity-black-60)",
        borderRadius: "5px",
        boxSizing: "border-box",
        zIndex: 9999,
        ...getStyles()
      }
    },
    /* @__PURE__ */ BdApi.React.createElement(HamburgerMenu, null)
  );
}
var LensKit = class {
  async start() {
    const ZoomModule = await wpWait(Webpack4.Filters.bySource(".ZOOM_IN_IMAGE_PRESSED),")).then((x) => x);
    Patcher.after(ZoomModule.Ay, "type", (_, __, node) => {
      return /* @__PURE__ */ BdApi.React.createElement(OverrideZoom, { props: __[0], node });
    });
    const ImageMemo = Webpack4.getModule((x) => x.displayName == "Image", { searchExports: true });
    Patcher.after(ImageMemo, "render", (a, b, c) => {
      const childrenNode = c.props.children.props.children;
      childrenNode.push(/* @__PURE__ */ BdApi.React.createElement(TestImageActionbar, { data: b[0], isVideo: b[0].alt == "Video", isGIF: b[0].alt == "GIF" }));
    });
    this.unpatches = Object.entries(contextmenus_default).map(([navId, value]) => {
      return Object.values(value).map((x) => {
        return {
          navId,
          unpatch: ContextMenu2.patch(navId, x.func)
        };
      });
    });
  }
  _settings = Settings_default;
  stop() {
    Patcher.unpatchAll();
    Object.entries(this.unpatches).map(([entry, value]) => {
      Object.values(value).map((x) => {
        x.unpatch();
      });
    });
  }
};
