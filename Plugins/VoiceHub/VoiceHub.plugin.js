/**
 * @name VoiceHub
 * @author Kaan
 * @version 2.0.0
 * @description Wanna know what people are in VCs? Here ya go.
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/VoiceHub/VoiceHub.plugin.js 
 * @invite t3zMgv7Nvb
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

// src/VoiceHub/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);

// src/Helpers/index.tsx
var { React, ContextMenu } = BdApi;
var { createElement, forwardRef } = React;
function styledBase(tag, cssOrFn) {
  return (props) => {
    const style = typeof cssOrFn === "function" ? cssOrFn(props) : cssOrFn;
    return React.createElement(tag, { ...props, style: { ...style, ...props.style } });
  };
}
var styled = new Proxy(styledBase, {
  get(target, p, receiver) {
    return (cssOrFn) => target(p, cssOrFn);
  }
});

// src/VoiceHub/index.tsx
var { Patcher, Webpack, React: React2, DOM, Data, Components, Hooks } = new BdApi("VoiceHub");
var { Tooltip } = Components;
var Module = Webpack.getBySource(".A.CONTACTS_LIST");
var [VoiceIcon, ModalRoot, openModal, SearchIcon, VideoIcon, LiveStream] = BdApi.Webpack.getBulk(
  {
    filter: BdApi.Webpack.Filters.byStrings('"M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z'),
    searchExports: true
  },
  { filter: BdApi.Webpack.Filters.byStrings('.ImpressionTypes.MODAL,"aria-labelledby":'), searchExports: true },
  {
    filter: BdApi.Webpack.Filters.byStrings("onCloseRequest", "onCloseCallback", "instant", "backdropStyle"),
    searchExports: true
  },
  {
    filter: BdApi.Webpack.Filters.byStrings('"M15.62 17.03a9 9 0 1 1 1.41-1.41l4.68 4.67a1 1 0 0 1-1.42 1.42l-4.67-4.68ZM17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z'),
    searchExports: true
  },
  {
    filter: BdApi.Webpack.Filters.byStrings('"M4 4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-2.12a1 1 0'),
    searchExports: true
  },
  { filter: BdApi.Webpack.Filters.byStrings("dI3q4h", "disableColor"), searchExports: true }
);
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
var InputModule = Webpack.getByKeys("autocompleteQuerySymbol");
var VoiceStateStore = Webpack.getStore("VoiceStateStore");
var GuildStore = Webpack.getStore("GuildStore");
var ChannelStore = Webpack.getStore("ChannelStore");
var GuildMemberStore = Webpack.Stores.GuildMemberStore;
var UserStore = Webpack.getStore("UserStore");
var VoiceModule = Webpack.getModule((x) => x.A?.handleVoiceConnect?.toString?.().includes?.("async"));
var UserModal = Webpack.getByKeys("openUserProfileModal");
var UserContextMenu = Webpack.getByStrings(".isGroupDM()", { searchExports: true });
var Trailing = n(71855);
var Clickable = n(189252).A;
var Modal = Webpack.getByKeys("Modal").Modal;
var Popout = Webpack.getModule((m) => m?.Animation, { searchExports: true, raw: true }).exports.Y;
function ForceUpdateRoot() {
  arven.Common.FluxDispatcher.dispatch({ type: "DOMAIN_MIGRATION_START" });
  requestIdleCallback(() => arven.Common.FluxDispatcher.dispatch({ type: "DOMAIN_MIGRATION_SKIP" }));
}
var VoiceHubContainer = styled.div({
  backgroundColor: "var(--background-base-lowest)",
  width: "310px",
  borderRadius: "8px",
  border: "gray",
  borderStyle: "solid",
  borderWidth: "1px",
  overflow: "hidden",
  maxHeight: "600px",
  display: "flex",
  flexDirection: "column"
});
var VoiceHubHeaderContainer = styled.div({
  color: "var(--text-default)",
  borderBottom: "1px solid gray",
  alignItems: "center",
  padding: "12px 16px",
  gap: "8px",
  display: "flex",
  width: "100%",
  boxSizing: "border-box",
  flexShrink: 0
});
var VoiceHubHeaderTitle = styled.span({
  color: "var(--text-default)",
  fontSize: "16px",
  fontWeight: "600",
  lineHeight: "20px"
});
var ScrollContainer = styled.div({
  overflowY: "auto",
  flex: 1,
  padding: "8px 0px"
});
var SectionHeader = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "6px 16px 4px",
  cursor: "pointer",
  userSelect: "none"
});
var SectionHeaderText = styled.span({
  color: "var(--text-muted",
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.02em"
});
var ChevronIcon = styled.span({
  color: "var(--text-muted)",
  fontSize: "10px",
  display: "flex",
  alignItems: "center"
});
var GuildEntry = styled.div({
  paddingBottom: "4px"
});
var GuildRow = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "6px 16px",
  cursor: "pointer"
});
var GuildIcon = styled.img({
  borderRadius: "25%",
  width: "24px",
  height: "24px",
  flexShrink: 0
});
var GuildName = styled.span({
  color: "var(--text-default)",
  fontSize: "14px",
  fontWeight: "600"
});
var ChannelRow = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "1px 16px 1px 50px",
  cursor: "pointer"
});
var ChannelName = styled.span({
  color: "var(--text-muted)",
  fontSize: "13px"
});
var UserRow = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "3px 16px 3px 50px",
  cursor: "pointer",
  borderRadius: "4px",
  margin: "0 4px",
  boxSizing: "border-box"
});
var UserAvatar = styled.img({
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  flexShrink: 0
});
var UserName = styled.span({
  color: "var(--text-default)",
  fontSize: "14px",
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
});
var StatusIcons = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  marginLeft: "auto",
  flexShrink: 0
});
var getAvatarUrl = (user, member, guildId) => {
  if (member?.avatar && guildId) {
    return `https://cdn.discordapp.com/guilds/${guildId}/users/${user.id}/avatars/${member.avatar}.png?size=64`;
  }
  if (user?.avatar) {
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
  }
  const index = Number(BigInt(user.id) >> 22n) % 6;
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
};
var getGuildIconUrl = (guild) => {
  if (guild?.icon) {
    return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=64`;
  }
  const index = Number(BigInt(guild.id) >> 22n) % 6;
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
};
var Chevron = ({ collapsed }) => /* @__PURE__ */ BdApi.React.createElement(
  "svg",
  {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    style: {
      transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
      transition: "transform 0.15s ease",
      color: "var(--channels-default)"
    }
  },
  /* @__PURE__ */ BdApi.React.createElement("path", { d: "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" })
);
var GuildSection = ({ guild, voiceStates }) => {
  const [collapsed, setCollapsed] = React2.useState(false);
  const activeChannels = [...new Set(Object.values(voiceStates).map((s) => s.channelId))].map((channelId) => ChannelStore.getChannel(channelId)).filter(Boolean);
  const handleUserClick = (e, user) => {
    e.stopPropagation();
    if (e.shiftKey) {
      UserModal.openUserProfileModal({ userId: user.id, guildId: guild.id });
    } else {
      const dummyChannel = {
        isGroupDM() {
          return false;
        },
        isDM() {
          return false;
        },
        guild_id: null
      };
      UserContextMenu(e, user, dummyChannel);
    }
  };
  return /* @__PURE__ */ BdApi.React.createElement(GuildEntry, null, /* @__PURE__ */ BdApi.React.createElement(GuildRow, { onClick: () => setCollapsed((c) => !c) }, /* @__PURE__ */ BdApi.React.createElement(GuildIcon, { src: getGuildIconUrl(guild) }), /* @__PURE__ */ BdApi.React.createElement(GuildName, null, guild.name), /* @__PURE__ */ BdApi.React.createElement("div", { style: { marginLeft: "auto" } }, /* @__PURE__ */ BdApi.React.createElement(Chevron, { collapsed }))), !collapsed && activeChannels.map((channel) => {
    const usersInChannel = Object.entries(voiceStates).filter(([_, state]) => state.channelId === channel.id).map(([userId]) => UserStore.getUser(userId)).filter(Boolean);
    return /* @__PURE__ */ BdApi.React.createElement("div", { key: channel.id }, /* @__PURE__ */ BdApi.React.createElement(ChannelRow, null, /* @__PURE__ */ BdApi.React.createElement(VoiceIcon, { width: "14", height: "14" }), /* @__PURE__ */ BdApi.React.createElement(ChannelName, null, channel.name)), usersInChannel.map((user) => {
      const member = guild?.id ? GuildMemberStore.getMember(guild.id, user.id) : null;
      const userState = voiceStates?.[user?.id] || {};
      return /* @__PURE__ */ BdApi.React.createElement(
        UserRow,
        {
          key: user.id,
          onClick: (e) => handleUserClick(e, user)
        },
        /* @__PURE__ */ BdApi.React.createElement(UserAvatar, { src: getAvatarUrl(user, member, guild.id) }),
        /* @__PURE__ */ BdApi.React.createElement(UserName, null, user.globalName ?? user.username),
        /* @__PURE__ */ BdApi.React.createElement(StatusIcons, null, userState.selfMute && /* @__PURE__ */ BdApi.React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "var(--youtube)" }, /* @__PURE__ */ BdApi.React.createElement(
          "path",
          {
            d: "M6.7 11H5C5 14.31 7.39 17.07 10.5 17.5V20H13.5V17.5C13.96 17.44 14.4 17.32 14.82 17.16L6.7 11ZM19 11H17.3L12 7.07V5C12 3.9 11.1 3 10 3S8 3.9 8 5V7.18L19 16.44V11ZM3.27 2L2 3.27L10 9.41V11C10 12.1 10.9 13 12 13C12.16 13 12.31 12.97 12.46 12.94L14.12 14.24C13.47 14.7 12.77 15 12 15C9.79 15 8 13.21 8 11H6C6 14.31 8.39 17.07 11.5 17.5V20H14.5V17.5C15.45 17.28 16.3 16.81 17 16.17L20.73 19.27L22 18L3.27 2Z"
          }
        )), userState.selfDeaf && /* @__PURE__ */ BdApi.React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "var(--youtube)" }, /* @__PURE__ */ BdApi.React.createElement(
          "path",
          {
            d: "M12 1C8.14 1 5 4.14 5 8V15C5 18.86 8.14 22 12 22C15.86 22 19 18.86 19 15V8C19 4.14 15.86 1 12 1ZM17 15C17 17.76 14.76 20 12 20C9.24 20 7 17.76 7 15V8C7 5.24 9.24 3 12 3C14.76 3 17 5.24 17 8V15Z"
          }
        )), userState.selfVideo && /* @__PURE__ */ BdApi.React.createElement(VideoIcon, { width: "14", height: "14" }), userState.selfStream && /* @__PURE__ */ BdApi.React.createElement(LiveStream, { width: "14", height: "14" }))
      );
    }));
  }));
};
function VoiceHubPopout() {
  const [activeNowCollapsed, setActiveNowCollapsed] = React2.useState(false);
  const [recentsCollapsed, setRecentsCollapsed] = React2.useState(false);
  const guildsWithVoice = Hooks.useStateFromStores(
    [GuildStore, VoiceStateStore],
    () => Object.values(GuildStore.getGuilds()).map((guild) => ({ guild, voiceStates: VoiceStateStore.getVoiceStates(guild.id) })).filter(({ voiceStates }) => Object.keys(voiceStates).length > 0)
  );
  const recentGuilds = guildsWithVoice.slice(0, 3);
  return /* @__PURE__ */ BdApi.React.createElement(VoiceHubContainer, null, /* @__PURE__ */ BdApi.React.createElement(VoiceHubHeaderContainer, null, /* @__PURE__ */ BdApi.React.createElement(VoiceIcon, { width: "20", height: "20" }), /* @__PURE__ */ BdApi.React.createElement(VoiceHubHeaderTitle, null, "Voice Hub")), /* @__PURE__ */ BdApi.React.createElement(ScrollContainer, { className: "voice-modal-scroller" }, recentGuilds.length > 0 && /* @__PURE__ */ BdApi.React.createElement("div", null, /* @__PURE__ */ BdApi.React.createElement(SectionHeader, { onClick: () => setRecentsCollapsed((c) => !c) }, /* @__PURE__ */ BdApi.React.createElement(SectionHeaderText, null, "Recents"), /* @__PURE__ */ BdApi.React.createElement(Chevron, { collapsed: recentsCollapsed })), !recentsCollapsed && recentGuilds.map(({ guild, voiceStates }) => {
    const activeChannels = [...new Set(Object.values(voiceStates).map((s) => s.channelId))].map((channelId) => ChannelStore.getChannel(channelId)).filter(Boolean);
    return /* @__PURE__ */ BdApi.React.createElement(GuildEntry, { key: guild.id }, /* @__PURE__ */ BdApi.React.createElement(GuildRow, null, /* @__PURE__ */ BdApi.React.createElement(GuildIcon, { src: getGuildIconUrl(guild) }), /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "1px" } }, /* @__PURE__ */ BdApi.React.createElement(GuildName, null, guild.name), activeChannels[0] && /* @__PURE__ */ BdApi.React.createElement("span", { style: {
      color: "var(--channels-default)",
      fontSize: "12px",
      display: "flex",
      alignItems: "center",
      gap: "4px"
    } }, /* @__PURE__ */ BdApi.React.createElement(VoiceIcon, { width: "12", height: "12" }), activeChannels[0].name))));
  })), guildsWithVoice.length > 0 && /* @__PURE__ */ BdApi.React.createElement("div", null, /* @__PURE__ */ BdApi.React.createElement(SectionHeader, { onClick: () => setActiveNowCollapsed((c) => !c) }, /* @__PURE__ */ BdApi.React.createElement(SectionHeaderText, null, "Active Now"), /* @__PURE__ */ BdApi.React.createElement(Chevron, { collapsed: activeNowCollapsed })), !activeNowCollapsed && guildsWithVoice.map(({ guild, voiceStates }) => /* @__PURE__ */ BdApi.React.createElement(GuildSection, { key: guild.id, guild, voiceStates }))), guildsWithVoice.length === 0 && /* @__PURE__ */ BdApi.React.createElement("div", { style: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    gap: "8px"
  } }, /* @__PURE__ */ BdApi.React.createElement(VoiceIcon, { width: "32", height: "32", color: "var(--text-muted)" }), /* @__PURE__ */ BdApi.React.createElement("span", { style: { color: "var(--text-muted)", fontSize: "14px", textAlign: "center" } }, "No one is in a voice channel"))));
}
function VoiceHubButton() {
  const [isOpen, setIsOpen] = React2.useState(false);
  const ref = React2.useRef(null);
  return /* @__PURE__ */ BdApi.React.createElement("div", { ref }, /* @__PURE__ */ BdApi.React.createElement(
    Popout,
    {
      position: "bottom",
      renderPopout: () => /* @__PURE__ */ BdApi.React.createElement(VoiceHubPopout, null),
      targetElementRef: ref,
      clickTrap: true,
      offset: { x: 50, y: 0 },
      onRequestClose: () => setIsOpen(false),
      shouldShow: isOpen,
      children: () => {
        return /* @__PURE__ */ BdApi.React.createElement(Clickable, { tooltip: "VoiceHub", position: "bottom-left", onClick: () => {
          setIsOpen((prev) => !prev);
        }, icon: VoiceIcon });
      }
    }
  ));
}
var VoiceHub = class {
  start() {
    DOM.addStyle(
      "voiceHub",
      `.voice-modal-scroller::-webkit-scrollbar {
            display: none;
        }
        .voice-modal-scroller {
            scrollbar-width: none;
        }`
    );
    ForceUpdateRoot();
    Patcher.after(Trailing, "cq", (a, b, res) => {
      res.props.children[2].props.children.unshift(
        /* @__PURE__ */ BdApi.React.createElement(VoiceHubButton, null)
      );
    });
  }
  stop() {
    DOM.removeStyle("voiceHub");
    Patcher.unpatchAll();
  }
};
var index_default = VoiceHub;
