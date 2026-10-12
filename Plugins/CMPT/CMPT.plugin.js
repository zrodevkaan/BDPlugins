/**
 * @name CMPT
 * @version 1.0.0
 * @description * @author Kaan
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/CMPT/CMPT.plugin.js
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

// src/CMPT/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => CMPT
});
module.exports = __toCommonJS(index_exports);

// helpers/webpack.ts
var { Webpack } = BdApi;

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
function ContextMenuHelper(patches) {
  const unpatches = patches.map((p) => ContextMenu.patch(p.navId, p.patch));
  return () => unpatches.forEach((unpatch) => unpatch());
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

// src/CMPT/index.tsx
var CMPT = class {
  unpatchAll = () => {
  };
  start() {
    this.unpatchAll = ContextMenuHelper([
      {
        navId: "message",
        patch: (res, props) => {
          console.log(res, props);
        }
      }
    ]);
  }
  stop() {
    this.unpatchAll();
  }
};
