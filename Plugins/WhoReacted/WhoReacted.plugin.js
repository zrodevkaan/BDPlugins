/**
 * @name WhoReacted
 * @author Kaan
 * @version 1.0.0
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/WhoReacted/WhoReacted.plugin.js
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

// src/WhoReacted/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => WhoReacted
});
module.exports = __toCommonJS(index_exports);

// helpers/webpack.ts
var { Webpack } = BdApi;
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
function wpGetBySource(source, options) {
  return resolveModule(Webpack.Filters.bySource(...source), options);
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

// src/WhoReacted/index.tsx
var { Webpack: Webpack3, Patcher } = new BdApi("WhoReacted");
var WhoReacted = class {
  start() {
    const ReactionType = wpGetBySource(["getReactionPickerAnimation"], {
      searchDefault: false,
      declarationFilter: (x) => String(x.type).includes("getReactionPickerAnimation")
    });
    Patcher.after(ReactionType, "type", (a, b, c) => {
      console.log(a, b, c);
      return;
      const data = b[0];
      const message = data.message;
      const emoji = data.emoji;
      console.log(c.props.children);
      c.props.children[1].push(
        /* @__PURE__ */ BdApi.React.createElement("div", null, "hi owo")
      );
    });
  }
  stop() {
    Patcher.unpatchAll();
  }
};
