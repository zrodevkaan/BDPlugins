/**
 * @name Helpers
 * @author Kaan
 * @version 1.0.0
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/Helpers/Helpers.plugin.js 
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

// src/Helpers/index.tsx
var index_exports = {};
__export(index_exports, {
  ContextMenuHelper: () => ContextMenuHelper,
  getKey: () => getKey,
  proxyRecache: () => proxyRecache,
  styled: () => styled,
  styledBase: () => styledBase,
  variants: () => variants,
  waitAndPatch: () => waitAndPatch
});
module.exports = __toCommonJS(index_exports);
var { React, ContextMenu, Webpack } = BdApi;
var { createElement, forwardRef } = React;
function styledBase(tag, cssOrFn) {
  return (props) => {
    const style = typeof cssOrFn === "function" ? cssOrFn(props) : cssOrFn;
    return React.createElement(tag, { ...props, style: { ...style, ...props.style } });
  };
}
function variants(type, base, variantDefs) {
  return forwardRef((props, ref) => {
    const { style, ...otherProps } = props;
    const styles = { ...base };
    Object.keys(variantDefs).forEach((key) => {
      if (props[key] && variantDefs[key]?.[props[key]]) {
        Object.assign(styles, variantDefs[key][props[key]]);
      }
    });
    return createElement(type, {
      ...otherProps,
      style: Object.assign({}, styles, style),
      ref
    });
  });
}
var styled = new Proxy(styledBase, {
  get(target, p, receiver) {
    return (cssOrFn) => target(p, cssOrFn);
  }
});
var ContextMenuHelper = (patches) => {
  const unpatches = [];
  patches.forEach((patch) => {
    const unpatch = ContextMenu.patch(patch.navId, patch.patch);
    unpatches.push(unpatch);
  });
  return () => {
    unpatches.forEach((unpatch) => unpatch());
  };
};
function getKey(module2, fn) {
  for (var key in module2) {
    if (fn(module2[key])) {
      return { key, module: module2 };
    }
  }
}
function proxyRecache(module2, filter, interval) {
  const target = { module: void 0 };
  const returnProxy = new Proxy(target, {
    get(t, key) {
      return Reflect.get(t, key, t);
    },
    set(t, key, value) {
      t[key] = value;
      return true;
    }
  });
  const timer = setInterval(() => {
    const result = filter(module2);
    if (result !== void 0) {
      returnProxy.module = result;
      clearInterval(timer);
    }
  }, interval);
  return returnProxy;
}
function waitAndPatch(Patcher, filter, key, callback) {
  Webpack.waitForModule(filter).then((mod) => {
    Patcher.after(mod, key, callback);
  });
}
