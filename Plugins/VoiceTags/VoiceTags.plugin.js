/**
 * @name VoiceTags
 * @description Displays if someone is in your current voice channel.
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

// src/VoiceTags/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => index_default2
});
module.exports = __toCommonJS(index_exports);

// src/VoiceTags/index.css?raw
var index_default = ".top-badge {\n    display: inline-flex;\n    align-items: center;\n    align-self: center;\n    margin-left: 8px;\n    vertical-align: middle;\n}\n\n.badge-holder {\n    background: var(--background-brand);\n    color: var(--white);\n    border-radius: 4px;\n    padding: 0 4px;\n    font-size: 0.625rem;\n    font-weight: 500;\n    text-transform: uppercase;\n    line-height: 16px;\n    height: 16px;\n    align-items: center;\n}\n\n.badge-holder > svg {\n    display: inline-block;\n    margin-inline-start: -2px;\n    vertical-align: middle;\n}";

// src/VoiceTags/index.tsx
var { Webpack, Hooks, Utils, Patcher, DOM, Components, Data } = new BdApi("VoiceTags");
var { Stores } = Webpack;
var { SortedVoiceStateStore, SelectedChannelStore, UserStore, ChannelStore } = Stores;
var MessageHeader = Webpack.getModule(Webpack.Filters.byStrings("decorations", "withMentionPrefix"), { raw: true }).exports;
var SVG = () => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "12", height: "12", viewBox: "0 0 24 24" }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "currentColor",
    d: "M8 24q-.425 0-.712-.288T7 23t.288-.712T8 22t.713.288T9 23t-.288.713T8 24m4 0q-.425 0-.712-.288T11 23t.288-.712T12 22t.713.288T13 23t-.288.713T12 24m4 0q-.425 0-.712-.288T15 23t.288-.712T16 22t.713.288T17 23t-.288.713T16 24m-4-10q-1.25 0-2.125-.875T9 11V5q0-1.25.875-2.125T12 2t2.125.875T15 5v6q0 1.25-.875 2.125T12 14m-1 6v-2.1q-2.3-.3-3.937-1.925t-1.988-3.95q-.05-.425.225-.725T6 11t.713.288T7.1 12q.35 1.75 1.738 2.875T12 16q1.8 0 3.175-1.137T16.9 12q.1-.425.388-.712T18 11t.7.3t.225.725q-.35 2.275-1.975 3.925T13 17.9V20q0 .425-.288.713T12 21t-.712-.288T11 20"
  }
));
function BotHeader({ text }) {
  return /* @__PURE__ */ BdApi.React.createElement("span", { className: "top-badge" }, /* @__PURE__ */ BdApi.React.createElement("span", { className: "badge-holder" }, /* @__PURE__ */ BdApi.React.createElement(SVG, null), text));
}
var DataStore = new Proxy({}, {
  get: (target, key) => {
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
});
var VoiceSettingStore = new class VoiceSettingStore2 extends Utils.Store {
  text = DataStore.text || "In Voice";
  setText(string) {
    this.text = string;
    DataStore.text = this.text;
    this.emitChange();
  }
  getText() {
    return this.text;
  }
}();
function BotTagInVoice({ message }) {
  const selectedChannel = Hooks.useStateFromStores([SelectedChannelStore], () => SelectedChannelStore.getVoiceChannelId());
  const client = Hooks.useStateFromStores([UserStore], () => UserStore.getCurrentUser());
  const channel = Hooks.useStateFromStores([ChannelStore], () => SelectedChannelStore.getVoiceChannelId() ? ChannelStore.getChannel(selectedChannel) : null);
  const voiceStates = Hooks.useStateFromStores([SortedVoiceStateStore], () => channel ? SortedVoiceStateStore.getVoiceStatesForChannel(channel) : {});
  const updatedText = Hooks.useStateFromStores([VoiceSettingStore], () => VoiceSettingStore.getText());
  if (!selectedChannel) return null;
  if (client.id === message.author.id) return null;
  const values = Object.values(voiceStates);
  return values.findIndex((x) => x.user?.id === message.author.id) !== -1 && /* @__PURE__ */ BdApi.React.createElement(BotHeader, { text: updatedText });
}
var index_default2 = class {
  start() {
    DOM.addStyle("VoiceTags", index_default);
    Patcher.after(MessageHeader, "Z", (a, [props], res) => {
      try {
        const d = props.decorations = props.decorations || [];
        const targets = Array.isArray(d) ? [d] : [d[0] ||= [], d[1] ||= []];
        targets.forEach((arr) => arr.unshift(/* @__PURE__ */ BdApi.React.createElement(BotTagInVoice, { ...props })));
      } catch (e) {
      }
    });
  }
  getSettingsPanel() {
    return () => {
      return /* @__PURE__ */ BdApi.React.createElement("div", null, /* @__PURE__ */ BdApi.React.createElement(Components.Text, { size: "bd-text-16" }, "Set Voice Text"), /* @__PURE__ */ BdApi.React.createElement(Components.TextInput, { value: VoiceSettingStore.getText(), onChange: (e) => VoiceSettingStore.setText(e) }));
    };
  }
  stop() {
    Patcher.unpatchAll();
    DOM.removeStyle("VoiceTags");
  }
};
