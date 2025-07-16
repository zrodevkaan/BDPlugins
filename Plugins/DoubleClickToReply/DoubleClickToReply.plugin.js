/**
 * @name DoubleClickToReply
 * @author Kaan
 * @description Allows you to double click an message and reply to it :)
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

// src/DoubleClickToReply/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => DoubleClickToReply
});
module.exports = __toCommonJS(index_exports);
var { ContextMenu, UI, Data, Webpack, React, Components: { Tooltip }, Patcher, DOM } = new BdApi("WebTranslator");
var MessageContent = Webpack.waitForModule(Webpack.Filters.bySource('VOICE_HANGOUT_INVITE?""'));
var StartEdit = Webpack.getByStrings("showMentionToggle", "FOCUS_CHANNEL_TEXT_AREA", { searchExports: true });
var ChannelStore = Webpack.getStore("ChannelStore");
var DoubleClickToReply = class {
  async start() {
    const yes = await MessageContent;
    Patcher.after(yes.ZP, "type", (_, args, ret) => {
      Object.defineProperty(ret.props, "onDoubleClick", {
        value: () => {
          StartEdit(ChannelStore.getChannel(args[0].message.channel_id), args[0].message, { shiftKey: false });
        }
      });
    });
  }
  stop() {
    Patcher.unpatchAll();
  }
};
