/**
 * @name RelationshipAlerts
 * @author kaan
 * @version 1.0.0
 * @description Logs when someone is added or removed as a friend
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/RelationshipAlerts/RelationshipAlerts.plugin.js
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

// src/RelationshipAlerts/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => RelationshipAlerts
});
module.exports = __toCommonJS(index_exports);
var { Webpack, Utils, Data, UI } = new BdApi("RelationshipAlerts");
var UserStore = Webpack.Stores.UserStore;
var Dispatcher = UserStore._dispatcher;
var FRIEND = 1;
var events = ["RELATIONSHIP_ADD", "RELATIONSHIP_UPDATE", "RELATIONSHIP_REMOVE"];
var DataStore = new class RelationshipStore extends Utils.Store {
  history = Data.load("history") ?? { added: [], removed: [] };
  get(type) {
    return this.history[type];
  }
  getAll() {
    return this.history;
  }
  add(type, entry) {
    const list = this.history[type];
    const last = list[list.length - 1];
    if (last && last.id === entry.id && entry.time - last.time < 5e3) return false;
    this.history = { ...this.history, [type]: [...list, entry] };
    Data.save("history", this.history);
    this.emitChange();
    return true;
  }
  remove(type, id, time) {
    this.history = {
      ...this.history,
      [type]: this.history[type].filter((e) => !(e.id === id && e.time === time))
    };
    Data.save("history", this.history);
    this.emitChange();
  }
}();
var RelationshipAlerts = class {
  handle = (e) => {
    const rel = e.relationship ?? e;
    const id = rel?.id ?? rel?.user?.id;
    if (!id) return;
    const user = UserStore.getUser(id);
    const username = user?.globalName ?? user?.username ?? id;
    let type = null;
    if (e.type === "RELATIONSHIP_REMOVE") {
      if (rel.type === FRIEND) type = "removed";
    } else if (rel.type === FRIEND) {
      type = "added";
    }
    if (!type) return;
    const logged = DataStore.add(type, { id, username, time: Date.now() });
  };
  start() {
    events.forEach((t) => Dispatcher.subscribe(t, this.handle));
  }
  stop() {
    events.forEach((t) => Dispatcher.unsubscribe(t, this.handle));
  }
};
