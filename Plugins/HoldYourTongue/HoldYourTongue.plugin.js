/**
 * @name HoldYourTongue
 * @description Stop yourself from saying things in chat!
 * @version 1.0.0
 * @author Kaan
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

// src/HoldYourTongue/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => HoldYourTongue
});
module.exports = __toCommonJS(index_exports);
var { Webpack, Hooks, Utils, Data, Components, React } = new BdApi("HoldYourTongue");
var { useStateFromStores } = Hooks;
var CheckFilters = Webpack.getBySource("Everyone Warning");
var InteractiveButton = Webpack.getByKeys("Icon").Icon;
var TextArea = Webpack.getByStrings(`"text-input"`, { searchExports: true });
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
var KeywordStore = new class KeywordStoreClass extends Utils.Store {
  keywords = DataStore.keywords || [
    { id: this.generateId(), keyword: "lipton green tea citrus" }
  ];
  body = DataStore.body || `Woah there! You are about to send some keywords you don't want to send. e.g. {words}`;
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  addKeyword(keyword) {
    this.keywords.push({
      id: this.generateId(),
      keyword
    });
    DataStore.keywords = this.keywords;
    this.emitChange();
  }
  removeKeyword(id) {
    this.keywords = this.keywords.filter((x) => x.id !== id);
    DataStore.keywords = this.keywords;
    this.emitChange();
  }
  editKeyword(id, newKeyword) {
    const keyword = this.keywords.find((x) => x.id === id);
    if (keyword) {
      keyword.keyword = newKeyword;
      DataStore.keywords = this.keywords;
      this.emitChange();
    }
  }
  getKeywords() {
    return this.keywords;
  }
  setBody(body) {
    this.body = body;
    DataStore.body = body;
    this.emitChange();
  }
  getBodyMessage() {
    return this.body;
  }
  startChecking = (e) => {
    const lowerMessage = e.toLowerCase();
    let foundWords = [];
    this.getKeywords().forEach((item) => {
      const lowerKeyword = item.keyword.toLowerCase();
      if (lowerMessage.includes(lowerKeyword)) {
        foundWords.push(item.keyword);
      }
    });
    if (foundWords.length > 0) {
      return {
        body: this.getBodyMessage().replace("{words}", foundWords.join(", "))
      };
    }
    return false;
  };
}();
var EditIcon = () => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 24, height: 24, viewBox: "0 0 24 24" }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "#c8ffd8",
    d: "M10.808 14q-.348 0-.578-.23t-.23-.578v-1.136q0-.323.13-.628q.132-.305.349-.522l8.465-8.465q.166-.166.348-.23t.385-.063q.189 0 .368.064t.326.21L21.483 3.5q.16.166.242.365t.083.4t-.061.382q-.06.18-.226.345l-8.523 8.524q-.217.217-.522.35q-.305.134-.628.134zm8.658-8.354l1.347-1.361l-1.111-1.17l-1.387 1.381zM5.615 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h6.442q.273 0 .46.146q.186.146.273.364q.086.217.058.444t-.22.419L8.094 9.908q-.217.217-.348.522t-.13.628v3.711q0 .672.472 1.144t1.143.472h3.61q.323 0 .627-.131t.523-.348l4.636-4.637q.192-.192.42-.22q.226-.028.444.059q.217.086.363.273q.146.186.146.46v6.544q0 .69-.462 1.153T18.384 20z"
  }
));
var DeleteIcon = () => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 24, height: 24, viewBox: "0 0 24 24" }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "var(--notice-background-critical)",
    d: "m9.4 15.808l2.6-2.6l2.6 2.6l.708-.708l-2.6-2.6l2.6-2.6l-.708-.708l-2.6 2.6l-2.6-2.6l-.708.708l2.6 2.6l-2.6 2.6zM7.616 20q-.691 0-1.153-.462T6 18.384V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.153T16.384 20z"
  }
));
function KeywordDisplayer({ data }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [newKeyword, setNewKeyword] = React.useState(data.keyword);
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", alignItems: "center", alignContent: "center" } }, isEditing ? /* @__PURE__ */ BdApi.React.createElement(BdApi.React.Fragment, null, /* @__PURE__ */ BdApi.React.createElement(Components.TextInput, { onChange: setNewKeyword, value: newKeyword }), /* @__PURE__ */ BdApi.React.createElement(Components.Button, { onClick: () => {
    setIsEditing(false);
    KeywordStore.editKeyword(data.id, newKeyword);
  } }, "Save")) : /* @__PURE__ */ BdApi.React.createElement("span", null, data.keyword), /* @__PURE__ */ BdApi.React.createElement(InteractiveButton, { onClick: () => setIsEditing(true), tooltip: "Edit Keyword", icon: EditIcon }), /* @__PURE__ */ BdApi.React.createElement(
    InteractiveButton,
    {
      onClick: () => KeywordStore.removeKeyword(data.id),
      tooltip: "Delete Keyword",
      icon: DeleteIcon
    }
  ));
}
var HoldYourTongue = class {
  start() {
    const boundCheck = KeywordStore.startChecking.bind(KeywordStore);
    const existingFilter = Object.values(CheckFilters.$).find((x) => x.analyticsType?.includes("nacho"));
    if (existingFilter) {
      existingFilter.check = boundCheck;
    } else {
      CheckFilters.$.push({
        analyticsType: "nacho-businezz",
        check: boundCheck
      });
    }
  }
  getSettingsPanel() {
    return () => {
      const keywords = useStateFromStores([KeywordStore], () => KeywordStore.getKeywords());
      const [isAdding, setIsAdding] = React.useState(false);
      const [newKeyword, setNewKeyword] = React.useState("");
      const bodyMessage = useStateFromStores([KeywordStore], () => KeywordStore.getBodyMessage());
      const handleAdd = () => {
        if (newKeyword.trim()) {
          KeywordStore.addKeyword(newKeyword.trim());
          setNewKeyword("");
          setIsAdding(false);
        }
      };
      return /* @__PURE__ */ BdApi.React.createElement("div", null, /* @__PURE__ */ BdApi.React.createElement(Components.Text, { size: "bd-text-20" }, /* @__PURE__ */ BdApi.React.createElement("bold", null, "Flagged Keywords")), keywords.map((item) => /* @__PURE__ */ BdApi.React.createElement(KeywordDisplayer, { key: item.id, data: item })), isAdding ? /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", gap: "8px", marginTop: "8px" } }, /* @__PURE__ */ BdApi.React.createElement(
        Components.TextInput,
        {
          value: newKeyword,
          onChange: setNewKeyword,
          placeholder: "Enter keyword...",
          autoFocus: true,
          onKeyDown: (e) => e.key === "Enter" && handleAdd()
        }
      ), /* @__PURE__ */ BdApi.React.createElement(Components.Button, { onClick: handleAdd }, "Save"), /* @__PURE__ */ BdApi.React.createElement(Components.Button, { onClick: () => {
        setIsAdding(false);
        setNewKeyword("");
      } }, "Cancel")) : /* @__PURE__ */ BdApi.React.createElement(Components.Button, { onClick: () => setIsAdding(true), style: { marginTop: "8px" } }, "Add Keyword"), /* @__PURE__ */ BdApi.React.createElement(Components.Text, { size: "bd-text-20" }, /* @__PURE__ */ BdApi.React.createElement("bold", null, "Body Message")), /* @__PURE__ */ BdApi.React.createElement(Components.Text, null, "Set your own custom halt message! use ", `"{words}"`, " to define the words being flagged."), /* @__PURE__ */ BdApi.React.createElement(TextArea, { style: {}, value: bodyMessage, onChange: (e) => KeywordStore.setBody(e) }));
    };
  }
  stop() {
    const index = CheckFilters.$.findIndex((x) => x.analyticsType === "nacho-businezz");
    if (index !== -1) {
      CheckFilters.$.splice(index, 1);
    }
  }
};
