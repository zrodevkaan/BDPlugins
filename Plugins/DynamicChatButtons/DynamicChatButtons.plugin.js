/**
 * @name DynamicChatButtons
 * @author Kaan
 * @version 0.1.0
 * @description Customize which chat buttons are visible in Discord by right clicking the chat area and forget that breakable css filter that only supports aria-label :)
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
var { Patcher, React, Webpack, DOM, ContextMenu, Data, Utils, Hooks } = new BdApi("DynamicChatButtons");
var { useStateFromStores } = Hooks;
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
    }
  }
);
var Buttons = Webpack.getBySource("isSubmitButtonEnabled", ".A.getActiveOption(");
var ButtonStore = new class ButtonStoreClass extends Utils.Store {
  allKnownButtons = DataStore.allKnownButtons || [];
  hiddenStates = {};
  setButtons(buttons) {
    this.allKnownButtons = buttons;
    this.emitChange();
  }
  getButtons() {
    return this.allKnownButtons;
  }
  toggleButton(key) {
    DataStore[key] = !DataStore[key];
    this.hiddenStates = { ...this.hiddenStates };
    this.emitChange();
  }
  isHidden(key) {
    return DataStore[key] === true;
  }
  getHiddenStates() {
    return this.hiddenStates;
  }
}();
function ChatButtonsWrapper({ originalResult }) {
  useStateFromStores([ButtonStore], () => ButtonStore.getHiddenStates());
  const buttons = [...originalResult.props.children];
  const currentKeys = buttons.map((button) => {
    const isAppButton = String(button.type?.type)?.includes?.("entryPointCommandButtonRef");
    const key = isAppButton ? "app_launcher" : button.key;
    if (isAppButton && button.key === null) {
      button.key = "app_launcher";
    }
    return key;
  });
  React.useEffect(() => {
    ButtonStore.setButtons(currentKeys);
  }, [currentKeys.join(",")]);
  const filteredButtons = buttons.filter((button) => {
    const key = String(button.type?.type)?.includes?.("entryPointCommandButtonRef") ? "app_launcher" : button.key;
    return !ButtonStore.isHidden(key);
  });
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "dynamic-chat-buttons", style: { display: "flex", alignItems: "center" } }, filteredButtons);
}
var DynamicChatButtons = class {
  start() {
    Patcher.after(Buttons.A, "type", (_, [props], originalResult) => {
      if (!originalResult?.props?.children) {
        return originalResult;
      }
      return /* @__PURE__ */ BdApi.React.createElement(ChatButtonsWrapper, { originalResult });
    });
    ContextMenu.patch("textarea-context", this.patchSlate);
  }
  patchSlate = (contextMenu, props) => {
    const buttonKeys = ButtonStore.getButtons();
    if (!buttonKeys || buttonKeys.length === 0) {
      return;
    }
    const menuItems = buttonKeys.map((key) => {
      if (key) {
        return {
          type: "toggle",
          id: key,
          label: key,
          checked: ButtonStore.isHidden(key),
          action: () => {
            ButtonStore.toggleButton(key);
          }
        };
      }
    }).filter((x) => x);
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
