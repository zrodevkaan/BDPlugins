/**
 * @name Helpers
 * @author Kaan
 * @version 1.0.0
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
  styled: () => styled,
  styledBase: () => styledBase,
  variants: () => variants
});
module.exports = __toCommonJS(index_exports);
var { React, ContextMenu } = BdApi;
var { createElement, forwardRef } = React;
function styledBase(type, css) {
  return forwardRef((props, ref) => {
    return createElement(type, {
      ...props,
      style: Object.assign({}, css, props.style),
      ref
    });
  });
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
    return (css) => target(p, css);
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
