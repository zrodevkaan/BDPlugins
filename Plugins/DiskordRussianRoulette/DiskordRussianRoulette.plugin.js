/**
 * @name DiskordRussianRoulette
 * @author Kaan
 * @version x.x.x
 * @description cedrick sucks lol
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

// src/DiskordRussianRoulette/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Signal
});
module.exports = __toCommonJS(index_exports);
var { Webpack, Data, Utils, Components, Patcher } = new BdApi("DiskordRussianRoulette");
var SendMessageModule = Webpack.getByKeys("sendMessage");
function is15Percent() {
  return Math.random() < 0.15;
}
var Signal = class {
  start() {
    Patcher.after(SendMessageModule, "_sendMessage", (a, args, res) => {
      if (is15Percent()) {
        DiscordErrors.softCrash({ message: "You've been coconut malled! :coconut:", stack: { error: "omegalullulullulul troll", message: "omegalullulullulul troll" } });
        window.open("https://youtu.be/dQw4w9WgXcQ", "_blank");
      }
    });
  }
  stop() {
    Patcher.unpatchAll();
  }
};
