/**
 * @name CMPT
 * @description * @author Kaan
 * @version 1.0.0
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/CMPT/CMPT.plugin.js 
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

// src/Helpers/index.tsx
var { React, ContextMenu } = BdApi;
var { createElement, forwardRef } = React;
function styledBase(tag, cssOrFn) {
  return (props) => {
    const style = typeof cssOrFn === "function" ? cssOrFn(props) : cssOrFn;
    return React.createElement(tag, { ...props, style: { ...style, ...props.style } });
  };
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
