/**
 * @name Signal
 * @author Kaan
 * @version 1.0.1
 * @description doggy sucks ;p
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

// src/Signal/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Signal
});
module.exports = __toCommonJS(index_exports);
var { Webpack, Data, Utils, Components } = new BdApi("Signal");
var [settings, setSettings] = Utils.createSignal(Data.load("settings") || [{
  id: "dick",
  value: "what?"
}, { id: "dick2", value: true }], { equals: false });
var SettingsComp = () => {
  const staticSettings = settings();
  return staticSettings.map((x) => {
    return /* @__PURE__ */ BdApi.React.createElement(
      "input",
      {
        type: "checkbox",
        checked: x.value,
        onChange: (newValue) => {
          x.value = newValue.currentTarget.checked;
          setSettings(settings());
        }
      }
    );
  });
};
var Signal = class {
  start() {
  }
  stop() {
  }
  getSettingsPanel() {
    return /* @__PURE__ */ BdApi.React.createElement(SettingsComp, null);
  }
};
