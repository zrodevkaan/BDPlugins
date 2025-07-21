/**
 * @name UsernameDB
 * @author Kaan
 * @description Colors or names ;p
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

// src/UsernameDB/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => UsernameDB
});
module.exports = __toCommonJS(index_exports);
var { Webpack, Patcher, Data, React, Net } = new BdApi("UsernameDB");
var UsernameHeader = Webpack.getBySource("subscribeToGroupId", "renderRemixTag", "decorations");
var UserStore = Webpack.getStore("UserStore");
var FontIDs = Webpack.getModule((x) => x.BANGERS, { searchExports: true });
var EffectIDs = Webpack.getModule((x) => x.NEON && x.GRADIENT, { searchExports: true });
var InternalStore = class _InternalStore {
  static stores = /* @__PURE__ */ new Set();
  static idSymbol = Symbol("id");
  static id = 0;
  static getStore(name) {
    for (const store of _InternalStore.stores) {
      if (_InternalStore.prototype.getName.call(store) === name) return store;
    }
  }
  static getStoreId(store) {
    return store[_InternalStore.idSymbol];
  }
  constructor() {
    this[_InternalStore.idSymbol] = _InternalStore.id++;
    _InternalStore.stores.add(this);
  }
  initialize() {
  }
  static displayName;
  displayName;
  getName() {
    if (this.displayName) return this.displayName;
    const constructor = this.constructor;
    if (constructor.displayName) return constructor.displayName;
    return constructor.name;
  }
  #listeners = /* @__PURE__ */ new Set();
  addChangeListener(callback) {
    this.#listeners.add(callback);
  }
  removeChangeListener(callback) {
    this.#listeners.delete(callback);
  }
  emit() {
    for (const listener of this.#listeners) {
      listener();
    }
  }
  getClass() {
    return this.constructor;
  }
  getId() {
    return _InternalStore.getStoreId(this);
  }
};
var ColorDatastore = class extends InternalStore {
  UserColors = {};
  async GatherColors() {
    this.UserColors = await this.fetchUserData();
    this.emit();
    return this.UserColors;
  }
  async fetchUserData() {
    const AllColors = await (await Net.fetch("https://raw.githubusercontent.com/zrodevkaan/UsernameDB/refs/heads/main/users.json")).json();
    this.UserColors = AllColors;
    this.emit();
    return this.UserColors;
  }
  GrabFromCache(userId) {
    this.emit();
    return this.UserColors[userId];
  }
};
var UserColorDatastore = new ColorDatastore();
var UsernameDB = class {
  constructor() {
    UserColorDatastore.GatherColors();
  }
  ColorStore = UserColorDatastore;
  start() {
    Patcher.before(UsernameHeader, "Z", (a, args) => {
      const author = args[0].author;
      const userId = args[0].message.author.id;
      author.displayNameStyles = UserColorDatastore.GrabFromCache(userId);
    });
    Patcher.after(UserStore, "getUser", (_, [userId], res) => {
      if (!res || typeof res !== "object") return;
      const cache = UserColorDatastore.GrabFromCache(userId) || res.displayNameStyles;
      if (!Object.prototype.hasOwnProperty.call(res, "displayNameStyles")) {
        Object.defineProperty(res, "displayNameStyles", {
          value: cache,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        res.displayNameStyles = cache;
      }
    });
  }
  stop() {
    Patcher.unpatchAll();
  }
};
