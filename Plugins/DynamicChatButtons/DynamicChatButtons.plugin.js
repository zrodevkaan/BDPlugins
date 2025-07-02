/**
 * @name DynamicChatButtons
 * @author Kaan
 * @version 0.0.1
 * @description Customize which chat buttons are visible in Discord by right clicking the chat area.
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

// src/DynamicChatButtons/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => DynamicChatButtons
});
module.exports = __toCommonJS(index_exports);
var { Patcher, React, Webpack, DOM, ContextMenu, Data } = new BdApi("DynamicChatButtons");
var DataStore = new Proxy(
  {},
  {
    get: (_, key) => {
      return Data.load(key);
    },
    set: (_, key, value) => {
      Data.save(key, value);
      return true;
    },
    deleteProperty: (_, key) => {
      Data.delete(key);
      return true;
    }
  }
);
var Buttons = Webpack.getBySource("type", "channel", "showAllButtons");
var DynamicChatButtons = class {
  constructor() {
    this.allKnownButtons = DataStore.allKnownButtons || [];
  }
  start() {
    Patcher.after(Buttons.Z, "type", (_, __, res) => {
      const buttons = res.props.children;
      const originalButtons = [...buttons];
      const currentKeys = originalButtons.map((button) => {
        const isAppButton = String(button.type?.type)?.includes?.("entryPointCommandButtonRef");
        const key = isAppButton ? "app_launcher" : button.key;
        if (isAppButton && button.key === null) {
          button.key = "app_launcher";
        }
        return key;
      });
      this.updateKnownButtons(currentKeys);
      for (let i = buttons.length - 1; i >= 0; i--) {
        const button = buttons[i];
        const key = String(button.type?.type)?.includes?.("entryPointCommandButtonRef") ? "app_launcher" : button.key;
        if (DataStore[key] === true) {
          buttons.splice(i, 1);
        }
      }
    });
    ContextMenu.patch("textarea-context", this.patchSlate);
  }
  updateKnownButtons(currentKeys) {
    currentKeys.forEach((key) => {
      if (!this.allKnownButtons.includes(key)) {
        this.allKnownButtons.push(key);
      }
    });
    DataStore.allKnownButtons = this.allKnownButtons;
  }
  patchSlate = (contextMenu, props) => {
    const buttonKeys = this.allKnownButtons;
    if (!buttonKeys || buttonKeys.length === 0) {
      return;
    }
    const menuItems = buttonKeys.map((key) => ({
      type: "toggle",
      id: key,
      label: key,
      checked: DataStore[key] === true,
      action: () => {
        DataStore[key] = !DataStore[key];
      }
    }));
    contextMenu.props.children.push(
      ContextMenu.buildItem({
        type: "submenu",
        label: "Dynamic Chat Buttons",
        items: menuItems
      })
    );
  };
  stop() {
    Patcher.unpatchAll();
    ContextMenu.unpatch("textarea-context", this.patchSlate);
  }
};
