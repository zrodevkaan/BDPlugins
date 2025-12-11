/**
 * @name GuildChannels
 * @author Kaan
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

// src/GuildChannels/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => GuildChannels
});
module.exports = __toCommonJS(index_exports);
var { Webpack, Patcher, Utils, React } = new BdApi("GuildChannels");
var { Filters } = Webpack;
var GuildTooltip = Webpack.getModule(Filters.byStrings("listItemTooltip", "guild"), { raw: true }).exports;
var Popout = Webpack.getModule((m) => m?.Animation, { searchExports: true, raw: true }).exports.y;
var useStateFromStores = Webpack.getByStrings("useStateFromStores", { searchExports: true });
var GuildMaybe = n(327496).L;
var GuildChannelStore = Webpack.getStore("GuildChannelStore");
var ReadStateStore = Webpack.getStore("ReadStateStore");
var Animated = Webpack.getModule((x) => x.animated.div);
var BadgeBrhu = Webpack.getByKeys("aRk").aRk;
var GuildChannels = class {
  start() {
    console.log("gi");
  }
  stop() {
    Patcher.unpatchAll();
  }
};
