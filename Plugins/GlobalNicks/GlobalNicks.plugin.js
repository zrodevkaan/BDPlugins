/**
 * @name GlobalNicks
 * @author Kaan
 * @version 1.0.0
 * @description Overrides non-friend users name with a global nickname
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/GlobalNicks/GlobalNicks.plugin.js 
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

// src/GlobalNicks/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => GlobalNicks
});
module.exports = __toCommonJS(index_exports);
var { Patcher, React, Webpack, DOM, ContextMenu, UI, Net, Utils, Data } = new BdApi("GlobalNicks");
var UserStore = Webpack.getStore("UserStore");
var RelationshipStore = Webpack.getStore("RelationshipStore");
var GlobalNicks = class {
  start() {
    Patcher.after(UserStore, "getUser", (_, args, ret) => {
      if (!ret || !ret.username) return;
      const oriName = ret.username;
      const hasNick = RelationshipStore.getNickname(args[0]);
      if (Object.hasOwn(ret, "username")) {
        ret.username = hasNick || oriName;
      }
    });
  }
  stop() {
    Patcher.unpatchAll();
  }
};
