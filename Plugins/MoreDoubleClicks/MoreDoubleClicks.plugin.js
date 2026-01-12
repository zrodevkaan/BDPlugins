/**
 * @name MoreDoubleClicks
 * @description Allows you to double-click more areas with modifier keys for different actions.
 * @author Kaan
 * @version 2.0.0
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

// src/MoreDoubleClicks/index.tsx
var index_exports = {};
__export(index_exports, {
  MoreDoubleClicks: () => MoreDoubleClicks
});
module.exports = __toCommonJS(index_exports);
var { Webpack, Utils, Patcher, Data, React, Hooks, Components } = new BdApi("MoreDoubleClicks");
var MessageContent = Webpack.getBySource('VOICE_HANGOUT_INVITE?""');
var EditUtils = Webpack.getModule((x) => x.startEditMessageRecord);
var ReplyAction = Webpack.getByStrings("showMentionToggle", "FOCUS_CHANNEL_TEXT_AREA", { searchExports: true });
var addReaction = Webpack.getByStrings("uaUU/g", { searchExports: true });
var Permissions = Webpack.getByKeys("BAN_MEMBERS", { searchExports: true });
var SwitchItem = Webpack.getByStrings('"tooltipText"in');
var Selectable = Webpack.getModule(Webpack.Filters.byStrings('data-mana-component":"select'), { searchExports: true });
var { ChannelStore, UserStore, RawGuildEmojiStore, GuildStore, PermissionStore } = Webpack.Stores;
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
var MoreDoubleClickStore = new class MDCS extends Utils.Store {
  setSetting(key, value) {
    DataStore.settings = { ...DataStore.settings, [key]: value };
    this.emitChange();
  }
  getSetting(key) {
    return DataStore.settings[key];
  }
  settings() {
    return DataStore.settings;
  }
}();
function hasPermission(userId, permission, channelId) {
  if (userId === UserStore.getCurrentUser().id) {
    return PermissionStore.can(permission, channelId);
  }
  return PermissionStore.can(permission, channelId, userId);
}
function StartDoubleClickAction(_, args, ret, event) {
  const message = args[0].message;
  const canEdit = message.author.id == UserStore.getCurrentUser().id;
  const doubleClickEmoji = MoreDoubleClickStore.getSetting("doubleClickEmoji");
  const selection = window.getSelection();
  if (selection && selection.toString().length > 0 && message.content.includes(selection.toString())) {
    return;
  }
  const shiftAction = MoreDoubleClickStore.getSetting("shiftDoubleClickAction");
  const ctrlAction = MoreDoubleClickStore.getSetting("ctrlDoubleClickAction");
  const delAction = MoreDoubleClickStore.getSetting("delDoubleClickAction");
  const normalAction = MoreDoubleClickStore.getSetting("normalDoubleClickAction");
  let actionToTake = normalAction;
  if (event.shiftKey) {
    actionToTake = shiftAction;
  } else if (event.ctrlKey || event.metaKey) {
    actionToTake = ctrlAction;
  } else if (event.key === "Delete" || event.keyCode === 46) {
    actionToTake = delAction;
  }
  if ("EDIT" === actionToTake && canEdit) {
    return EditUtils.startEditMessageRecord(message.channel_id, message, { shiftKey: false });
  }
  if ("REPLY" === actionToTake) {
    return ReplyAction(ChannelStore.getChannel(message.channel_id), message, { shiftKey: false });
  }
  if ("DELETE" === actionToTake && (hasPermission(message.author.id, Permissions.MANAGE_MESSAGES, message.channel_id) || canEdit)) {
    return EditUtils.deleteMessage(message.channel_id, message.id);
  }
  if ("REACT" === actionToTake) {
    return addReaction(
      message.channel_id,
      message.id,
      doubleClickEmoji,
      "Message",
      {
        burst: MoreDoubleClickStore.getSetting("shouldEmojiBurst")
      }
    );
  }
  if ("NONE" === actionToTake) {
    return;
  }
}
function SettingsPanel() {
  const {
    emoji,
    guild,
    normalAction,
    shiftAction,
    ctrlAction,
    delAction,
    shouldBurst
  } = useStateFromStores(MoreDoubleClickStore, () => ({
    emoji: MoreDoubleClickStore.getSetting("doubleClickEmoji"),
    guild: MoreDoubleClickStore.getSetting("selectedGuildForReaction"),
    normalAction: MoreDoubleClickStore.getSetting("normalDoubleClickAction"),
    shiftAction: MoreDoubleClickStore.getSetting("shiftDoubleClickAction"),
    ctrlAction: MoreDoubleClickStore.getSetting("ctrlDoubleClickAction"),
    delAction: MoreDoubleClickStore.getSetting("delDoubleClickAction"),
    shouldBurst: MoreDoubleClickStore.getSetting("shouldEmojiBurst")
  }));
  const actionOptions = [
    { label: "None", value: "NONE" },
    { label: "Edit", value: "EDIT" },
    { label: "Reply", value: "REPLY" },
    { label: "React", value: "REACT" },
    { label: "Delete", value: "DELETE" }
  ];
  const setNewEmoji = (emoji2) => {
    const newEmoji = {
      id: emoji2.id,
      name: emoji2.name,
      animated: emoji2.animated,
      icon: emoji2.id ? `https://cdn.discordapp.com/emojis/${emoji2.id}.${emoji2.animated ? "gif" : "webp"}?size=32` : null
    };
    MoreDoubleClickStore.setSetting("doubleClickEmoji", newEmoji);
  };
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: { minHeight: "500px", padding: "10px" } }, /* @__PURE__ */ BdApi.React.createElement("div", { style: { marginBottom: "15px" } }, /* @__PURE__ */ BdApi.React.createElement("label", { style: { display: "block", marginBottom: "5px", fontWeight: "bold" } }, "Normal Double-Click"), /* @__PURE__ */ BdApi.React.createElement(
    Selectable,
    {
      value: normalAction,
      onSelectionChange: (e) => MoreDoubleClickStore.setSetting("normalDoubleClickAction", e),
      options: actionOptions
    }
  )), /* @__PURE__ */ BdApi.React.createElement("div", { style: { marginBottom: "15px" } }, /* @__PURE__ */ BdApi.React.createElement("label", { style: { display: "block", marginBottom: "5px", fontWeight: "bold" } }, "Shift + Double-Click"), /* @__PURE__ */ BdApi.React.createElement(
    Selectable,
    {
      value: shiftAction,
      onSelectionChange: (e) => MoreDoubleClickStore.setSetting("shiftDoubleClickAction", e),
      options: actionOptions
    }
  )), /* @__PURE__ */ BdApi.React.createElement("div", { style: { marginBottom: "15px" } }, /* @__PURE__ */ BdApi.React.createElement("label", { style: { display: "block", marginBottom: "5px", fontWeight: "bold" } }, "Ctrl/Cmd + Double-Click"), /* @__PURE__ */ BdApi.React.createElement(
    Selectable,
    {
      value: ctrlAction,
      onSelectionChange: (e) => MoreDoubleClickStore.setSetting("ctrlDoubleClickAction", e),
      options: actionOptions
    }
  )), /* @__PURE__ */ BdApi.React.createElement("div", { style: { marginBottom: "15px" } }, /* @__PURE__ */ BdApi.React.createElement("label", { style: { display: "block", marginBottom: "5px", fontWeight: "bold" } }, "DEL + Double-Click"), /* @__PURE__ */ BdApi.React.createElement(
    Selectable,
    {
      value: delAction,
      onSelectionChange: (e) => MoreDoubleClickStore.setSetting("delDoubleClickAction", e),
      options: actionOptions
    }
  )), /* @__PURE__ */ BdApi.React.createElement("h3", { style: { marginTop: "20px", marginBottom: "10px" } }, "Reaction Settings"), /* @__PURE__ */ BdApi.React.createElement(
    SwitchItem,
    {
      onChange: (v) => MoreDoubleClickStore.setSetting("shouldEmojiBurst", v),
      note: "Enable burst/super reactions",
      value: shouldBurst
    },
    "Use Burst Reaction"
  ), /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px", marginTop: "10px", marginBottom: "10px" } }, /* @__PURE__ */ BdApi.React.createElement("span", { style: { fontWeight: "bold" } }, "Currently Selected Emoji:"), emoji?.icon ? /* @__PURE__ */ BdApi.React.createElement("img", { src: emoji.icon, style: { width: "32px", height: "32px" } }) : /* @__PURE__ */ BdApi.React.createElement("span", { style: { fontSize: "32px" } }, emoji?.name)), /* @__PURE__ */ BdApi.React.createElement("div", { style: { marginBottom: "10px" } }, /* @__PURE__ */ BdApi.React.createElement("label", { style: { display: "block", marginBottom: "5px", fontWeight: "bold" } }, "Select Guild for Emojis"), /* @__PURE__ */ BdApi.React.createElement(
    Selectable,
    {
      onSelectionChange: (e) => {
        MoreDoubleClickStore.setSetting("selectedGuildForReaction", e);
      },
      value: GuildStore.getGuild(guild)?.id,
      options: GuildStore.getGuildsArray().map((x) => {
        return {
          label: /* @__PURE__ */ BdApi.React.createElement("div", { style: {
            display: "flex",
            gap: "10px",
            alignItems: "center"
          } }, /* @__PURE__ */ BdApi.React.createElement(
            "img",
            {
              src: `https://cdn.discordapp.com/icons/${x.id}/${x.icon}.png?size=32`,
              style: { width: "20px", height: "20px", borderRadius: "50%" }
            }
          ), x.name),
          value: x.id
        };
      })
    }
  )), /* @__PURE__ */ BdApi.React.createElement("div", { style: { marginTop: "15px" } }, /* @__PURE__ */ BdApi.React.createElement("label", { style: { display: "block", marginBottom: "10px", fontWeight: "bold" } }, "Select Emoji"), /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))", gap: "5px" } }, Object.values(RawGuildEmojiStore.getGuildEmojis(guild)).map((x) => {
    return x?.id ? /* @__PURE__ */ BdApi.React.createElement(
      "img",
      {
        key: x.id,
        onClick: () => setNewEmoji(x),
        src: `https://cdn.discordapp.com/emojis/${x.id}.${x.animated ? "gif" : "webp"}?size=80`,
        style: { width: "40px", height: "40px", cursor: "pointer", borderRadius: "4px" },
        title: x.name
      }
    ) : /* @__PURE__ */ BdApi.React.createElement(
      "span",
      {
        key: x.name,
        onClick: () => setNewEmoji(x),
        style: { fontSize: "40px", cursor: "pointer", textAlign: "center" }
      },
      x.name
    );
  }))));
}
var MoreDoubleClicks = class {
  load() {
    DataStore.settings = {
      normalDoubleClickAction: "REPLY",
      shiftDoubleClickAction: "EDIT",
      ctrlDoubleClickAction: "REACT",
      delDoubleClickAction: "DELETE",
      selectedGuildForReaction: "0",
      doubleClickEmoji: {
        "id": null,
        "name": "\u{1F62D}",
        "animated": false
      },
      shouldEmojiBurst: false,
      ...DataStore.settings
    };
  }
  start() {
    Patcher.after(MessageContent.ZP, "type", (_, args, ret) => {
      const originalOnDoubleClick = ret.props.onDoubleClick;
      Object.defineProperty(ret.props, "onDoubleClick", {
        value: (event) => {
          StartDoubleClickAction(_, args, ret, event);
          if (originalOnDoubleClick) originalOnDoubleClick(event);
        },
        configurable: true,
        enumerable: true
      });
    });
  }
  getSettingsPanel() {
    return /* @__PURE__ */ BdApi.React.createElement(SettingsPanel, null);
  }
  stop() {
    Patcher.unpatchAll();
  }
};
