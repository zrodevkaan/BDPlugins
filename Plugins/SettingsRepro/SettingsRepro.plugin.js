/**
 * @name SettingsRepro
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

// src/SettingsRepro/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => SettingsRepro
});
module.exports = __toCommonJS(index_exports);
var { Webpack, Patcher, React } = new BdApi("SettingsRepro");
var RootSectionModule = Webpack.getModule((x) => x.E?.key == "$Root");
var layoutUtils = Webpack.getMangled(
  Webpack.Filters.bySource("$Root", ".ACCORDION"),
  {
    Pane: (x) => String(x).includes(".PANE,"),
    Panel: (x) => String(x).includes(".PANEL,"),
    Button: (x) => String(x).includes(".SIDEBAR_ITEM,"),
    Section: (x) => String(x).includes(".SECTION,")
  }
);
var TestPane = layoutUtils.Pane("test_pane", {
  StronglyDiscouragedCustomComponent: () => React.createElement("div", {}, "hi"),
  buildLayout: () => [],
  render: () => /* @__PURE__ */ BdApi.React.createElement("div", null, "hi ;3")
});
var TestPanel = layoutUtils.Panel("test_panel", {
  useTitle: () => "Test Settings",
  useBadge: () => 3,
  buildLayout: () => [TestPane]
});
var TestSettingsItem = layoutUtils.Button("test_sidebar_item", {
  icon: () => /* @__PURE__ */ BdApi.React.createElement("div", null, "X"),
  useTitle: () => "Test Settings",
  legacySearchKey: "test_settings",
  buildLayout: () => [TestPanel],
  type: 2
});
var NewTestSection = layoutUtils.Section("test_section", {
  type: 1,
  useLabel: () => "Test Settings",
  key: "test_section",
  buildLayout: () => [TestSettingsItem]
});
var SettingsRepro = class {
  start() {
    console.log(layoutUtils);
    Patcher.after(RootSectionModule.E, "buildLayout", (_, args, returnValue) => {
      returnValue.push(NewTestSection);
      console.log(returnValue);
      return returnValue;
    });
  }
  stop() {
    Patcher.unpatchAll();
  }
};
