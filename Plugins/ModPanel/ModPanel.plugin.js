/**
 * @name ModPanel
 * @author Kaan
 * @description its a bunch of self botting but oh well. its for moderators.
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

// src/ModPanel/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => ModPanel
});
module.exports = __toCommonJS(index_exports);
var { Webpack, Patcher, Utils, ContextMenu, React, Data, Components } = new BdApi("ModPanel");
var ManaButtonTooltip = Webpack.getModule((x) => String(x.Z.render).includes("positionKeyStemOverride")).Z;
var CTb = Webpack.getByKeys("CTb");
var ChatMessageDecorators = Webpack.getModule((x) => String(x.Z).includes(".colorRoleId?nul"));
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
var addUser = (id, reason, timestamp = Date.now()) => {
  const newObject = DataStore.watchlist || {};
  newObject[id] = { reason, timestamp };
  DataStore.watchlist = newObject;
};
var WarningIcon = () => {
  return /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 12 12" }, /* @__PURE__ */ BdApi.React.createElement("path", { fill: "#f5f11dff", d: "M5.214 1.459a.903.903 0 0 1 1.572 0l4.092 7.169c.348.61-.089 1.372-.787 1.372H1.91c-.698 0-1.135-.762-.787-1.372l4.092-7.17ZM5.5 4.5v1a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0ZM6 6.75a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5Z" }));
};
var Element = ({ data }) => {
  return /* @__PURE__ */ BdApi.React.createElement(Components.Tooltip, { position: "top", text: data.reason }, (props) => {
    return /* @__PURE__ */ BdApi.React.createElement("span", { ...props, style: { position: "relative", top: "4px" } }, /* @__PURE__ */ BdApi.React.createElement(WarningIcon, null));
  });
};
var ModalSystem = Webpack.getMangled(".modalKey?", {
  openModalLazy: Webpack.Filters.byStrings(".modalKey?"),
  openModal: Webpack.Filters.byStrings(",instant:"),
  closeModal: Webpack.Filters.byStrings(".onCloseCallback()"),
  closeAllModals: Webpack.Filters.byStrings(".getState();for")
});
var Modal = Webpack.getModule((x) => x.Modal).Modal;
var TextInput = Webpack.getByStrings("setShouldValidate", { searchExports: true });
var ModPanelStuff = ({ a, user }) => {
  const [text, setText] = React.useState("Add Reason");
  return /* @__PURE__ */ BdApi.React.createElement(
    Modal,
    {
      ...a,
      title: "Watchlist",
      subtitle: `Add ${user.username} to Watchlist`,
      actions: [{
        text: `Add ${user.username}`,
        onClick: () => {
          a.onClose();
          addUser(user.id, text, Date.now());
        }
      }]
    },
    /* @__PURE__ */ BdApi.React.createElement(TextInput, { placeholder: text, onChange: setText })
  );
};
var CTMPA = (res, props) => {
  const { user } = props;
  res.props.children.push(ContextMenu.buildItem({
    type: "button",
    label: "Add User",
    action: () => {
      ModalSystem.openModal(
        (a) => /* @__PURE__ */ BdApi.React.createElement(ModPanelStuff, { a, user })
      );
    }
  }));
};
var ModPanel = class {
  start() {
    Patcher.after(ChatMessageDecorators, "Z", (a, b, res) => {
      const user = b[0].message.author;
      const data = DataStore.watchlist?.[user.id];
      if (data != null) {
        b[0].decorations[1].push(/* @__PURE__ */ BdApi.React.createElement(Element, { data }));
      }
    });
    ContextMenu.patch("user-context", CTMPA);
  }
  stop() {
    Patcher.unpatchAll();
    ContextMenu.unpatch("user-context", CTMPA);
  }
};
