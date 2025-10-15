/**
 * @name LinkConverter
 * @description Converts all links into a configurable embed link
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

// src/LinkConverter/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => LinkConverter
});
module.exports = __toCommonJS(index_exports);
var { Webpack, Patcher, Data, React, Components, DOM, ContextMenu, Plugins } = new BdApi("LinkConverter");
var { useState } = React;
var { Button } = Components;
var SelectableSearch = Webpack.getByStrings("customMatchSorter", { searchExports: true });
var Textarea = Webpack.getByStrings("setShouldValidate", "trailingContent", { searchExports: true });
var Sanitize = Webpack.getByKeys("sanitizeUrl");
var LinkWrapper = Webpack.getModule((x) => x.Z.type.toString().includes("sanitizeUrl"));
var MessageActions = Webpack.getByKeys("_sendMessage");
var Modal = Webpack.getModule((x) => x.Modal).Modal;
var ModalSystem = Webpack.getMangled(".modalKey?", {
  openModalLazy: Webpack.Filters.byStrings(".modalKey?"),
  openModal: Webpack.Filters.byStrings(",instant:"),
  closeModal: Webpack.Filters.byStrings(".onCloseCallback()"),
  closeAllModals: Webpack.Filters.byStrings(".getState();for")
});
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
var defaultLinks = [
  {
    type: "reddit",
    replacements: ["https://rxddit.com"],
    selected: 0
  },
  {
    type: "twitter",
    replacements: ["https://stupidpenisx.com", "https://girlcockx.com"],
    selected: 0
  },
  {
    type: "instagram",
    replacements: ["https://vxinstagram.com"],
    selected: 0
  }
];
var replacementsToSelectable = (linkObject) => (linkObject?.replacements || []).map((x) => ({ label: x, value: x }));
var getReplacementsByDomain = (domain) => DataStore.settings.find((x) => x.type == domain);
function generateFaviconURL(website) {
  const domain = website.includes(".") ? website : `${website}.com`;
  const url = new URL(`https://twenty-icons.com/${domain}`);
  return url.href;
}
function DomainCard({ domainObj, onChange }) {
  const [editing, setEditing] = useState(false);
  const [didError, setDidError] = useState(false);
  const [newReplacement, setNewReplacement] = useState("");
  const [replacementError, setReplacementError] = useState("");
  const linkObject = getReplacementsByDomain(domainObj.type);
  const replacements = linkObject?.replacements || [];
  const setDefault = (index) => {
    const org = DataStore.settings;
    const i = org.findIndex((a) => a.type == domainObj.type);
    if (i === -1) return;
    org[i].selected = index;
    DataStore.settings = org;
    onChange();
  };
  const addReplacement = () => {
    if (!newReplacement) return;
    if (!newReplacement.startsWith("https://")) {
      setReplacementError("URL must start with https://");
      return;
    }
    const org = DataStore.settings;
    const i = org.findIndex((a) => a.type == domainObj.type);
    if (i === -1) return;
    org[i].replacements.push(newReplacement);
    DataStore.settings = org;
    setNewReplacement("");
    setReplacementError("");
    onChange();
    setEditing((e) => !e);
  };
  const removeReplacement = (r) => {
    const org = DataStore.settings;
    const i = org.findIndex((a) => a.type == domainObj.type);
    if (i === -1) return;
    org[i].replacements = org[i].replacements.filter((x) => x !== r);
    if (org[i].selected >= org[i].replacements.length) org[i].selected = 0;
    if (org[i].replacements.length === 0) {
      DataStore.settings = org.filter((x) => x.type !== domainObj.type);
    } else {
      DataStore.settings = org;
    }
    onChange();
  };
  const deleteDomain = () => {
    const settings = DataStore.settings;
    DataStore.settings = settings.filter((item) => item.type !== domainObj.type);
    onChange();
  };
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: {
    border: "1px solid #2c2f33",
    borderRadius: 8,
    marginBottom: "12px",
    width: "100%",
    padding: 12,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 8
  } }, /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ BdApi.React.createElement("div", { style: { width: 36, height: 36, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" } }, !didError ? /* @__PURE__ */ BdApi.React.createElement("img", { style: { width: "24px" }, onError: () => setDidError((prev) => !prev), src: generateFaviconURL(domainObj.type) }) : /* @__PURE__ */ BdApi.React.createElement("span", null, domainObj.type.substring(0, 1).toUpperCase())), /* @__PURE__ */ BdApi.React.createElement("div", { style: { fontWeight: 600 } }, domainObj.type)), /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ BdApi.React.createElement(Button, { onClick: () => setEditing((e) => !e), size: Button.Sizes.SMALL }, editing ? "Done" : "Edit"), /* @__PURE__ */ BdApi.React.createElement(Button, { color: Button.Colors.RED, onClick: deleteDomain, size: Button.Sizes.SMALL }, "Delete"))), /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", gap: 8, flexDirection: "column" } }, /* @__PURE__ */ BdApi.React.createElement("div", { style: { width: "100%" } }, /* @__PURE__ */ BdApi.React.createElement(
    SelectableSearch,
    {
      placeholder: replacements.length ? "Select default replacement" : "No replacements yet",
      onChange: (e) => {
        const index = replacements.findIndex((r) => r === e);
        if (index !== -1) setDefault(index);
      },
      options: replacementsToSelectable(linkObject),
      value: replacementsToSelectable(linkObject)[linkObject?.selected],
      isDisabled: replacements.length === 0
    }
  )), editing && /* @__PURE__ */ BdApi.React.createElement(BdApi.React.Fragment, null, /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 8 }, className: "discor-moment" }, /* @__PURE__ */ BdApi.React.createElement(
    Textarea,
    {
      placeholder: "https://replacement.com",
      value: newReplacement,
      onChange: (e) => setNewReplacement(e),
      error: replacementError
    }
  ), /* @__PURE__ */ BdApi.React.createElement(Button, { onClick: addReplacement }, "Add")), /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4, marginTop: 8 } }, replacements.map((replacement, index) => /* @__PURE__ */ BdApi.React.createElement("div", { key: replacement, style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px", borderRadius: 4 } }, /* @__PURE__ */ BdApi.React.createElement("span", { style: { wordBreak: "break-all" } }, replacement), /* @__PURE__ */ BdApi.React.createElement(
    Button,
    {
      color: Button.Colors.RED,
      size: Button.Sizes.SMALL,
      onClick: () => removeReplacement(replacement)
    },
    "Remove"
  )))))));
}
function SettingsPanel() {
  const [, forceUpdate] = useState({});
  const refresh = () => forceUpdate({});
  const handleAddDomain = (type, replacement) => {
    if (!type) return;
    const settings = DataStore.settings;
    const existing = settings.find((x) => x.type === type);
    if (existing) {
      if (replacement) existing.replacements.push(replacement);
    } else {
      settings.push({
        type,
        replacements: replacement ? [replacement] : [],
        selected: 0
      });
    }
    DataStore.settings = settings;
    refresh();
  };
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: { maxWidth: 720, margin: "0 auto", padding: 6, display: "flex", flexDirection: "column", gap: 12 } }, /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginTop: 8 } }, DataStore.settings.length === 0 && /* @__PURE__ */ BdApi.React.createElement("div", { style: { color: "#888" } }, "No domains configured yet. Add one above."), DataStore.settings.map((d) => /* @__PURE__ */ BdApi.React.createElement(DomainCard, { key: d.type, domainObj: d, onChange: refresh }))), /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", gap: 12, flexWrap: "wrap" } }, /* @__PURE__ */ BdApi.React.createElement(AddDomainInline, { onAdd: handleAddDomain })));
}
function AddDomainInline({ onAdd }) {
  const [type, setType] = useState("");
  const [replacement, setReplacement] = useState("");
  const [error, setError] = useState("");
  const handleAdd = () => {
    if (!type) return;
    if (!replacement.startsWith("https://")) {
      setError("URL must start with https://");
      return;
    }
    onAdd(type.trim().toLowerCase(), replacement.trim());
    setType("");
    setReplacement("");
    setError("");
  };
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", width: "100%" } }, /* @__PURE__ */ BdApi.React.createElement("div", { style: { flex: 2 } }, /* @__PURE__ */ BdApi.React.createElement(
    Textarea,
    {
      placeholder: "Domain (e.g. reddit or reddit.com)",
      value: type,
      onChange: (e) => setType(e),
      style: { marginBottom: 0 }
    }
  )), /* @__PURE__ */ BdApi.React.createElement("div", { style: { flex: 3 } }, /* @__PURE__ */ BdApi.React.createElement(
    Textarea,
    {
      placeholder: "Replacement URL (e.g. https://rxddit.com)",
      value: replacement,
      onChange: (e) => setReplacement(e),
      style: { marginBottom: 0 },
      error
    }
  )), /* @__PURE__ */ BdApi.React.createElement(
    Button,
    {
      onClick: handleAdd,
      disabled: !type.trim(),
      size: Button.Sizes.MEDIUM,
      style: { height: 36 }
    },
    "Add"
  ));
}
var LinkConverter = class {
  load() {
    DataStore.settings ??= defaultLinks;
  }
  start() {
    DOM.addStyle("link-convert", ".discor-moment textarea {max-height: 36px !important; min-height: 36x !important;}");
    ContextMenu.patch("textarea-context", this.PTAC);
    Patcher.before(MessageActions, "sendMessage", (a, b, c) => {
      const obj = b[1];
      obj.content = obj.content.replace(/https?:\/\/([^\s/]+)/gi, (url, domain) => {
        let s = DataStore.settings.find((x) => x.type === domain);
        if (!s) {
          const seralizedDomain = domain.split(".")[0];
          s = DataStore.settings.find((x) => x.type === seralizedDomain);
        }
        return s ? s.replacements[s.selected] : url;
      });
    });
    Patcher.before(LinkWrapper.Z, "type", (_, b, original) => {
      const originalUrl = b[0].href;
      const urlObj = new URL(originalUrl);
      let data = DataStore.settings.find((x) => x.type === urlObj.host);
      if (!data) {
        const domain = urlObj.host.split(".")[0];
        data = DataStore.settings.find((x) => x.type === domain);
      }
      if (!data) return;
      const replacementDomain = new URL(data.replacements[data.selected]).host;
      const newUrl = originalUrl.replace(urlObj.host, replacementDomain);
      b[0].href = newUrl;
      b[0].title = newUrl;
      b[0].children = [/* @__PURE__ */ BdApi.React.createElement("span", null, newUrl)];
      return b;
    });
    Patcher.instead(Sanitize, "sanitizeUrl", (_, [props], original) => {
      if (!props) return original;
      const urlObj = new URL(props);
      let data = DataStore.settings.find((x) => x.type === urlObj.host);
      if (!data) {
        const domain = urlObj.host.split(".")[0];
        data = DataStore.settings.find((x) => x.type === domain);
      }
      if (!data) return props;
      const replacementDomain = new URL(data.replacements[data.selected]).host;
      return props.replace(urlObj.host, replacementDomain);
    });
  }
  PTAC(res, props) {
    res.props.children.push(
      ContextMenu.buildItem({
        label: "LinkConverter",
        id: "link-converter-settings",
        action: () => ModalSystem.openModal((props2) => /* @__PURE__ */ BdApi.React.createElement(Modal, { ...props2, title: "LinkConverter Settings" }, /* @__PURE__ */ BdApi.React.createElement(SettingsPanel, null)))
      })
    );
  }
  stop() {
    DOM.removeStyle("link-convert");
    ContextMenu.unpatch("textarea-context", this.PTAC);
    Patcher.unpatchAll();
  }
  getSettingsPanel() {
    return /* @__PURE__ */ BdApi.React.createElement(SettingsPanel, null);
  }
};
