/**
 * @name UnhideSpam
 * @author Kaan
 * @version 1.0.0
 * @description you love spam :)
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/UnhideSpam/UnhideSpam.plugin.js 
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

// src/UnhideSpam/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => UnhideSpam
});
module.exports = __toCommonJS(index_exports);
var { Webpack } = new BdApi("UnhideSpam");
var originalGetUser = Webpack.getStore("UserStore").getUser;
var UnhideSpam = class {
  start() {
    Object.defineProperty(Webpack.getStore("UserStore"), "getUser", {
      value: function(id) {
        const user = originalGetUser.call(this, id);
        if (user && user.hasFlag) {
          if (user.hasFlag(1 << 20)) {
            const modifiedUser = Object.create(Object.getPrototypeOf(user));
            Object.assign(modifiedUser, user);
            const originalHasFlag = user.hasFlag.bind(user);
            modifiedUser.hasFlag = function(flag) {
              if (flag === 1 << 20) {
                return false;
              }
              return originalHasFlag(flag);
            };
            return modifiedUser;
          }
        }
        return user;
      },
      writable: true,
      configurable: true
    });
  }
  stop() {
    Webpack.getStore("UserStore").getUser = originalGetUser;
  }
};
