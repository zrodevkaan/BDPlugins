/**
 * @name LinkCleaner
 * @author kaan
 * @description Clean URLs automatically every time you send a message.
 * @version 1.0.0
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/LinkCleaner/LinkCleaner.plugin.js 
 * @invite t3zMgv7Nvb
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

// src/LinkCleaner/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Cleaner
});
module.exports = __toCommonJS(index_exports);
var { Webpack, Patcher, Utils, Net } = new BdApi("LinkCleaner");
var MessageActions = Webpack.getByKeys("sendMessage");
var CleanStore = new class CleanStore2 extends Utils.Store {
  rules = null;
  async init() {
    const res = await Net.fetch("https://rules2.clearurls.xyz/data.minify.json");
    this.rules = (await res.json()).providers;
  }
  cleanURL(url) {
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return url;
    }
    for (const provider of Object.values(this.rules)) {
      if (!new RegExp(provider.urlPattern, "i").test(url)) continue;
      if (provider.exceptions?.some((e) => new RegExp(e, "i").test(url))) continue;
      for (const [key] of [...parsed.searchParams]) {
        if (provider.rules?.some((r) => new RegExp(r, "i").test(key)))
          parsed.searchParams.delete(key);
      }
      let href = parsed.toString();
      for (const raw of provider.rawRules ?? [])
        href = href.replace(new RegExp(raw, "i"), "");
      return href;
    }
    return parsed.toString();
  }
}();
var Cleaner = class {
  start() {
    CleanStore.init();
    Patcher.before(MessageActions, "sendMessage", (_, args) => {
      args[1].content = args[1].content.replace(/https?:\/\/\S+/g, (url) => CleanStore.cleanURL(url));
    });
  }
  stop() {
    Patcher.unpatchAll();
  }
};
