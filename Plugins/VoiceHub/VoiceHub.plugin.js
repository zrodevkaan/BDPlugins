/**
 * @name VoiceHub
 * @author Kaan
 * @version 1.0.9
 * @description Wanna know what people are in VCs? Here ya go.
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
var { Patcher, Webpack, React, DOM, Data } = new BdApi("VoiceHub");
var Module = Webpack.getBySource(".Z.CONTACTS_LIST");
var [VoiceIcon, ModalRoot, openModal, SearchIcon, VideoIcon, LiveStream] = BdApi.Webpack.getBulk(
  { filter: BdApi.Webpack.Filters.byStrings('"M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z'), searchExports: true },
  { filter: BdApi.Webpack.Filters.byStrings('.ImpressionTypes.MODAL,"aria-labelledby":'), searchExports: true },
  { filter: BdApi.Webpack.Filters.byStrings("onCloseRequest", "onCloseCallback", "instant", "backdropStyle"), searchExports: true },
  { filter: BdApi.Webpack.Filters.byStrings('"M15.62 17.03a9 9 0 1 1 1.41-1.41l4.68 4.67a1 1 0 0 1-1.42 1.42l-4.67-4.68ZM17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z'), searchExports: true },
  { filter: BdApi.Webpack.Filters.byStrings('"M4 4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-2.12a1 1 0'), searchExports: true },
  { filter: BdApi.Webpack.Filters.byStrings("dI3q4u"), searchExports: true }
);
var Eye = ({ width, height }) => /* @__PURE__ */ BdApi.React.createElement(
  "svg",
  {
    viewBox: "0 0 24 24",
    width: width ?? "24px",
    height: height ?? "24px",
    color: "color-mix(in oklab, hsl(0 0% 100%/1) 100%, #000 0%)"
  },
  /* @__PURE__ */ BdApi.React.createElement(
    "path",
    {
      fill: "color-mix(in oklab, hsl(0 0% 100%/1) 100%, #000 0%)",
      d: "M12 5C5.648 5 1 12 1 12C1 12 5.648 19 12 19C18.352 19 23 12 23 12C23 12 18.352 5 12 5ZM12 16C9.791 16 8 14.21 8 12C8 9.79 9.791 8 12 8C14.209 8 16 9.79 16 12C16 14.21 14.209 16 12 16Z M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
    }
  )
);
var EyeClose = ({ width, height }) => /* @__PURE__ */ BdApi.React.createElement(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 89.9801 1200 1020",
    color: "color-mix(in oklab, hsl(0 0% 100%/1) 100%, #000 0%)",
    width: width ?? "24px",
    height: height ?? "24px"
  },
  /* @__PURE__ */ BdApi.React.createElement(
    "path",
    {
      d: "M669.727,273.516c-22.891-2.476-46.15-3.895-69.727-4.248c-103.025,0.457-209.823,25.517-310.913,73.536  c-75.058,37.122-148.173,89.529-211.67,154.174C46.232,529.978,6.431,577.76,0,628.74c0.76,44.162,48.153,98.67,77.417,131.764  c59.543,62.106,130.754,113.013,211.67,154.174c2.75,1.335,5.51,2.654,8.276,3.955l-75.072,131.102l102.005,60.286l551.416-960.033  l-98.186-60.008L669.727,273.516z M902.563,338.995l-74.927,129.857c34.47,44.782,54.932,100.006,54.932,159.888  c0,149.257-126.522,270.264-282.642,270.264c-6.749,0-13.29-0.728-19.922-1.172l-49.585,85.84c22.868,2.449,45.99,4.233,69.58,4.541  c103.123-0.463,209.861-25.812,310.84-73.535c75.058-37.122,148.246-89.529,211.743-154.174  c31.186-32.999,70.985-80.782,77.417-131.764c-0.76-44.161-48.153-98.669-77.417-131.763  c-59.543-62.106-130.827-113.013-211.743-154.175C908.108,341.478,905.312,340.287,902.563,338.995L902.563,338.995z   M599.927,358.478c6.846,0,13.638,0.274,20.361,0.732l-58.081,100.561c-81.514,16.526-142.676,85.88-142.676,168.897  c0,20.854,3.841,40.819,10.913,59.325c0.008,0.021-0.008,0.053,0,0.074l-58.228,100.854  c-34.551-44.823-54.932-100.229-54.932-160.182C317.285,479.484,443.808,358.477,599.927,358.478L599.927,358.478z M768.896,570.513  L638.013,797.271c81.076-16.837,141.797-85.875,141.797-168.603C779.81,608.194,775.724,588.729,768.896,570.513L768.896,570.513z",
      fill: "color-mix(in oklab, hsl(0 0% 100%/1) 100%, #000 0%)"
    }
  )
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
var InteractiveModule = Webpack.getByKeys("interactive", "muted", "selected");
var InteractiveAbove = Webpack.getByKeys("channel", "interactiveSystemDM", "interactiveSelected");
var InputModule = Webpack.getByKeys("autocompleteQuerySymbol");
var VoiceStateStore = Webpack.getStore("VoiceStateStore");
var GuildStore = Webpack.getStore("GuildStore");
var ChannelStore = Webpack.getStore("ChannelStore");
var GuildMemberStore = Webpack.getStore("GuildMemberStore");
var UserStore = Webpack.getStore("UserStore");
var VoiceModule = Webpack.getModule((x) => x.Z?.handleVoiceConnect?.toString?.().includes?.("async"));
var UserModal = Webpack.getByKeys("openUserProfileModal");
var UserContextMenu = Webpack.getByStrings(".isGroupDM()", { searchExports: true });
var getAvatar = (id) => Number(BigInt(id) >> 22n) % 6;
var clsx = (...args) => [...args].join(" ");
var SearchBar = ({ value, onChange }) => {
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: { position: "relative", marginBottom: "12px" } }, /* @__PURE__ */ BdApi.React.createElement(
    "input",
    {
      className: clsx(InputModule.input),
      style: { width: "95%" },
      type: "text",
      value,
      onChange: (e) => onChange(e.target.value),
      placeholder: "Search servers, channels, or users..."
    }
  ));
};
var CustomVoiceChannel = ({ channel, voiceStates, guild }) => {
  const users = Object.entries(voiceStates).filter(([_, state]) => state.channelId === channel.id).map(([userId]) => UserStore.getUser(userId));
  const handleChannelClick = () => {
    VoiceModule.Z.handleVoiceConnect({
      channel,
      connected: false,
      needSubscriptionToAccess: false,
      locked: false
    });
  };
  const handleUserClick = (event, user) => {
    const dummyChannel = {
      isGroupDM() {
        return false;
      },
      isDM() {
        return false;
      },
      guild_id: null
    };
    UserContextMenu(event, user, dummyChannel);
  };
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      className: "voice-channel",
      onClick: handleChannelClick,
      style: {
        padding: "6px 8px",
        marginBottom: "2px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        borderLeft: "2px solid var(--border-subtle)",
        transition: "background-color 0.2s ease",
        ":hover": {
          backgroundColor: "var(--background-modifier-hover)"
        }
      }
    },
    /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "6px" } }, /* @__PURE__ */ BdApi.React.createElement(
      VoiceIcon,
      {
        width: "14",
        height: "14",
        color: "var(--interactive-normal)"
      }
    ), /* @__PURE__ */ BdApi.React.createElement("span", { style: {
      color: "var(--header-secondary)",
      fontSize: "13px",
      fontWeight: "500"
    } }, channel.name)),
    /* @__PURE__ */ BdApi.React.createElement("div", { style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "4px",
      paddingLeft: "20px"
    } }, users.map((user) => {
      const member = guild?.id ? GuildMemberStore.getMember(guild.id, user.id) : null;
      const directUser = member?.avatar ? member : user;
      const userState = voiceStates?.[user?.id] || { selfVideo: false, selfStream: false };
      return /* @__PURE__ */ BdApi.React.createElement(
        "div",
        {
          key: user.id,
          onClick: (e) => {
            e.stopPropagation();
            if (e.shiftKey) {
              UserModal.openUserProfileModal({
                userId: user.id,
                channelId: channel.id,
                guildId: guild.id
              });
            } else {
              handleUserClick(e, user);
            }
          },
          style: {
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "2px 6px",
            borderRadius: "3px",
            backgroundColor: "var(--background-base-lower)",
            transition: "background-color 0.2s ease",
            ":hover": {
              backgroundColor: "var(--background-modifier-active)"
            }
          }
        },
        /* @__PURE__ */ BdApi.React.createElement(
          "img",
          {
            src: directUser?.joinedAt && directUser?.avatar ? `https://cdn.discordapp.com/guilds/${guild.id}/users/${directUser.userId}/avatars/${directUser.avatar}.png` : directUser?.avatar ? `https://cdn.discordapp.com/avatars/${directUser?.id}/${directUser?.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${getAvatar(directUser.id)}.png`,
            style: {
              width: "20px",
              height: "20px",
              borderRadius: "50%"
            }
          }
        ),
        /* @__PURE__ */ BdApi.React.createElement("span", { style: {
          color: "var(--interactive-normal)",
          fontSize: "13px"
        } }, user.username),
        userState.selfVideo && /* @__PURE__ */ BdApi.React.createElement(VideoIcon, null),
        userState.selfStream && /* @__PURE__ */ BdApi.React.createElement(LiveStream, null)
      );
    }))
  );
};
var useStateFromStore = Webpack.getModule((m) => m.toString?.().includes("useStateFromStores"), { searchExports: true });
var VoiceChannelList = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");
  const guilds = GuildStore.getGuilds();
  const [dropped, setDropped] = React.useState(DataStore?.hiddenGuilds || []);
  const searchLower = searchQuery.toLowerCase();
  const filteredGuilds = Object.values(guilds).filter((guild) => {
    const voiceStates = VoiceStateStore.getVoiceStates(guild.id);
    if (!Object.keys(voiceStates).length) return false;
    const activeChannels = [...new Set(Object.values(voiceStates).map((state) => state.channelId))].map((channelId) => ChannelStore.getChannel(channelId)).filter(Boolean);
    return guild.name.toLowerCase().includes(searchLower) || activeChannels.some((channel) => channel.name.toLowerCase().includes(searchLower)) || Object.keys(voiceStates).some((userId) => {
      const user = UserStore.getUser(userId);
      return user && user.username.toLowerCase().includes(searchLower);
    });
  });
  const toggleDropped = (guildId) => {
    const yue = {
      ...dropped,
      [guildId]: !dropped[guildId]
    };
    setDropped(yue);
    DataStore.hiddenGuilds = yue;
  };
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: {
    padding: "20px",
    height: "600px",
    display: "flex",
    flexDirection: "column"
  } }, /* @__PURE__ */ BdApi.React.createElement("div", { style: {
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  } }, /* @__PURE__ */ BdApi.React.createElement(
    SearchBar,
    {
      value: searchQuery,
      onChange: setSearchQuery
    }
  ), /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", gap: "8px" } })), /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      className: "voice-modal-scroller",
      style: {
        overflowY: "auto",
        flex: 1
      }
    },
    filteredGuilds.length <= 0 ? /* @__PURE__ */ BdApi.React.createElement("div", { style: {
      flex: "0 1 auto",
      width: 433,
      height: 232,
      backgroundImage: "url(/assets/99ad5845cf7de1c326e2.svg)",
      margin: "auto"
    } }) : filteredGuilds.map((guild) => {
      const voiceStates = VoiceStateStore.getVoiceStates(guild.id);
      const activeChannels = [...new Set(Object.values(voiceStates).map((state) => state.channelId))].map((channelId) => ChannelStore.getChannel(channelId)).filter(Boolean);
      return /* @__PURE__ */ BdApi.React.createElement(
        "div",
        {
          key: guild.id,
          style: { marginBottom: "24px" }
        },
        /* @__PURE__ */ BdApi.React.createElement(
          "div",
          {
            style: { display: "flex", gap: "10px" },
            onClick: () => toggleDropped(guild.id)
          },
          /* @__PURE__ */ BdApi.React.createElement(
            "img",
            {
              src: guild?.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=4096&quality=lossless` : `https://cdn.discordapp.com/embed/avatars/${getAvatar(guild.id)}.png`,
              style: {
                width: "20px",
                height: "20px",
                borderRadius: "50%"
              }
            }
          ),
          /* @__PURE__ */ BdApi.React.createElement("h2", { style: {
            marginBottom: "12px",
            color: "var(--header-primary)",
            fontSize: "16px",
            fontWeight: "600",
            letterSpacing: "0.5px",
            gap: "10px",
            display: "flex",
            alignItems: "center"
          } }, guild.name, dropped[guild.id] ? /* @__PURE__ */ BdApi.React.createElement(EyeClose, { width: "24px", height: "24px" }) : /* @__PURE__ */ BdApi.React.createElement(Eye, { width: "24px", height: "24px" }))
        ),
        !dropped[guild.id] ? activeChannels.map((channel) => {
          return channel && /* @__PURE__ */ BdApi.React.createElement(
            CustomVoiceChannel,
            {
              key: channel.id,
              channel,
              guild,
              voiceStates
            }
          );
        }) : /* @__PURE__ */ BdApi.React.createElement("div", null)
      );
    })
  ));
};
var VoiceHubButton = Webpack.getByStrings("refresh_sm", "linkButtonIcon", { searchExports: true });
var VoiceHub = class {
  start() {
    DOM.addStyle(
      "voiceHub",
      `.voice-modal-scroller::-webkit-scrollbar {
                display: none;
            }`
    );
    Patcher.after(Module, "Z", (_, __, res) => {
      const isExisting = res.props.children.props.children.props.children.find((x) => x?.key === "voice-connect");
      if (isExisting) return;
      res.props.children.props.children.props.children.unshift(
        /* @__PURE__ */ BdApi.React.createElement(
          VoiceHubButton,
          {
            icon: VoiceIcon,
            text: "Voice Hub",
            key: "voice-connect",
            onClick: () => {
              openModal((modalProps) => /* @__PURE__ */ BdApi.React.createElement(
                ModalRoot,
                {
                  ...modalProps,
                  size: "medium",
                  className: "voice-hub-modal"
                },
                /* @__PURE__ */ BdApi.React.createElement(VoiceChannelList, null)
              ));
            }
          }
        )
      );
    });
  }
  stop() {
    DOM.removeStyle("voiceHub");
    Patcher.unpatchAll();
  }
};
var index_default = VoiceHub;
