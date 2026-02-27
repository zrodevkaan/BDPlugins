/**
 * @name LiveTyping
 * @author Kaan
 * @version 2.0.9
 * @description Typing status per user on servers, channels or threads.
 * @keyframes pulse {
 */
"use strict";

// src/LiveTyping/index.tsx
var { Webpack, Patcher, React, Components, Data, UI, Utils, DOM, ContextMenu } = new BdApi("LiveTyping");
var {
  getStore,
  getByStrings,
  getByPrototypeKeys,
  getBySource,
  getBulk,
  Filters
} = Webpack;
var getBulkStore = /* @__PURE__ */ (() => {
  const storeCache = /* @__PURE__ */ new Map();
  return (storeNames, options = {}) => {
    const { throwOnMissing = false, cache = true } = options;
    const result = {};
    if (!Array.isArray(storeNames)) {
      storeNames = [storeNames];
    }
    for (const name of storeNames) {
      if (cache && storeCache.has(name)) {
        result[name] = storeCache.get(name);
        continue;
      }
      try {
        const store = getStore(name);
        if (!store && throwOnMissing) {
          throw new Error(`Store '${name}' not found`);
        }
        if (cache && store) {
          storeCache.set(name, store);
        }
        result[name] = store;
      } catch (e) {
        if (throwOnMissing) {
          throw e;
        }
        result[name] = null;
      }
    }
    return storeNames.length === 1 ? result[storeNames[0]] : result;
  };
})();
var {
  UserStore,
  TypingStore,
  PrivateChannelSortStore,
  GuildChannelStore,
  SelectedGuildStore,
  ChannelStore,
  UserGuildSettingsStore
} = getBulkStore([
  "UserStore",
  "TypingStore",
  "PrivateChannelSortStore",
  "GuildChannelStore",
  "SelectedGuildStore",
  "ChannelStore",
  "UserGuildSettingsStore"
]);
var [ChannelElement, Popout, useStateFromStores] = getBulk({ filter: (x) => x && String(x.A?.render).includes(".charCode===") && String(x.A?.render).includes("onKeyPress") }, {
  filter: Filters.byStrings("Unsupported animation config:"),
  searchExports: true
}, { filter: Filters.byStrings("useStateFromStores"), searchExports: true });
var Spinner = Components.Spinner;
var scrollersModule = Webpack.getById(599319, { raw: true });
var RenderAvatars = getByPrototypeKeys("renderUsers", "renderMoreUsers");
var GuildObject = getByStrings(".guildbar.AVATAR_SIZE", "backgroundStyle", {
  searchExports: true,
  raw: true
}).exports;
var SPINNER_TYPES = Object.keys(Spinner.Type);
var INDICATOR_DIRECTIONS = ["left", "right"];
var DEFAULT_INDICATOR_TYPE = "PULSING_ELLIPSIS";
var DEFAULT_INDICATOR_LOCATION = "right";
var CONFIG = {
  defaultConfig: [
    {
      id: "indicatorType",
      name: "Indicator Type",
      note: "Allows you to select which indicator you'd like.",
      type: "dropdown",
      value: DEFAULT_INDICATOR_TYPE,
      options: SPINNER_TYPES.map((type) => ({ label: type, value: type })),
      disabled: false
    },
    {
      id: "indicatorLocation",
      name: "Indicator Location",
      note: "Allows you to display the indicator on the left or right of channels.",
      type: "dropdown",
      value: DEFAULT_INDICATOR_LOCATION,
      options: INDICATOR_DIRECTIONS.map((dir) => ({ label: dir, value: dir })),
      disabled: false
    },
    {
      id: "ignoreDMs",
      name: "Ignore All DMs",
      note: "Disable typing indicators in all direct messages",
      type: "switch",
      value: false,
      disabled: false
    },
    {
      id: "ignoreServers",
      name: "Ignore All Servers",
      note: "Disable typing indicators in all servers",
      type: "switch",
      value: false,
      disabled: false
    },
    {
      id: "ignoreChannels",
      name: "Ignore All Channels",
      note: "Disable typing indicators in all channels",
      type: "switch",
      value: false,
      disabled: false
    }
  ]
};
var getBlocklists = () => {
  return {
    ignoredChannels: DataStore.ignoredChannels || {},
    ignoredServers: DataStore.ignoredServers || {},
    ignoredDMs: DataStore.ignoredDMs || {}
  };
};
var saveToBlocklist = (type, id, ignore = true) => {
  const blocklists = getBlocklists();
  if (ignore) {
    blocklists[type][id] = true;
  } else {
    delete blocklists[type][id];
  }
  DataStore[type] = blocklists[type];
  return blocklists[type];
};
var isBlocked = (type, id) => {
  const blocklists = getBlocklists();
  return !!blocklists[type][id];
};
var shouldIgnoreItem = (type, id = null) => {
  const settings = DataStore.settings;
  if (settings[type]) return true;
  if (id) {
    switch (type) {
      case "ignoreChannels":
        return isBlocked("ignoredChannels", id);
      case "ignoreServers":
        return isBlocked("ignoredServers", id);
      case "ignoreDMs":
        return isBlocked("ignoredDMs", id);
      default:
        return false;
    }
  }
  return false;
};
var DataStore = new Proxy({}, {
  get: (_, key) => {
    if (key === "settings") {
      const savedSettings = Data.load(key) || {};
      return CONFIG.defaultConfig.reduce((acc, setting) => {
        acc[setting.id] = savedSettings[setting.id] ?? setting.value;
        return acc;
      }, {});
    }
    return Data.load(key) || (key.startsWith("ignored") ? {} : null);
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
var getTypingTooltip = (u) => {
  const n = Object.values(u).map((u2) => u2.username).filter(Boolean);
  return !n.length ? "" : n.length > 7 ? "Oh my? Quite the party, huh." : n.length === 1 ? `${n[0]} is typing!` : n.length === 2 ? `${n[0]} and ${n[1]} are typing!` : n.length === 3 ? `${n[0]}, ${n[1]}, and ${n[2]} are typing!` : `${n.length} members are typing!`;
};
function getTypingUsers(users) {
  const currentUser = UserStore.getCurrentUser?.() ?? { id: null };
  if (!users || !currentUser) return {};
  return Object.entries(users).filter(([id]) => id !== currentUser.id).reduce((acc, [id]) => (UserStore.getUser(id) && (acc[id] = UserStore.getUser(id)), acc), {});
}
function ExtractItemID(link) {
  return link?.substr(link.lastIndexOf("_") + 1);
}
var KeyboardSVG = (props) => React.createElement(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "var(--interactive-icon-default)",
    ...props
  },
  React.createElement("path", {
    d: "M20 5a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3zM6 13a1 1 0 0 0-1 1v.01a1 1 0 0 0 2 0V14a1 1 0 0 0-1-1m12 0a1 1 0 0 0-1 1v.01a1 1 0 0 0 2 0V14a1 1 0 0 0-1-1m-7.998 0a1 1 0 0 0-.004 2l4 .01a1 1 0 0 0 .005-2zM6 9a1 1 0 0 0-1 1v.01a1 1 0 0 0 2 0V10a1 1 0 0 0-1-1m4 0a1 1 0 0 0-1 1v.01a1 1 0 0 0 2 0V10a1 1 0 0 0-1-1m4 0a1 1 0 0 0-1 1v.01a1 1 0 0 0 2 0V10a1 1 0 0 0-1-1m4 0a1 1 0 0 0-1 1v.01a1 1 0 0 0 2 0V10a1 1 0 0 0-1-1"
  })
);
var UserAvatarList = ({ users, guild }) => {
  const SelectedGuild = SelectedGuildStore.getGuildId();
  const users_ = Object.values(users).map((x) => x.id).map((x) => UserStore.getUser(x));
  return React.createElement("div", {
    className: "live-typing-avatar-list",
    key: guild ? "GuildTypingIndicator" : "TypingIndicator",
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "4px",
      marginTop: "8px",
      maxWidth: "200px",
      justifyContent: "left",
      backgroundColor: !guild ? "var(--background-base-lower)" : "transparent"
    }
  }, [guild && React.createElement(KeyboardSVG, { key: "balls" }), React.createElement(RenderAvatars, {
    key: "balls_",
    guildId: SelectedGuild,
    max: 6,
    users: users_
  })]);
};
var isEmpty = (o) => !o || !Object.keys(o).length;
var TypingIndicatorDMBar = React.memo(() => {
  const [showPopout, setShowPopout] = React.useState(false);
  const ref = React.useRef(null);
  const privateChannelIds = useStateFromStores([PrivateChannelSortStore], () => PrivateChannelSortStore.getPrivateChannelIds());
  const currentUserId = useStateFromStores([UserStore], (x) => UserStore.getCurrentUser().id);
  const typingUsersByChannel = useStateFromStores([TypingStore], () => {
    const result = {};
    for (const channelId of privateChannelIds) {
      if (shouldIgnoreItem("ignoreDMs", channelId)) continue;
      const typingUsers2 = TypingStore.getTypingUsers(channelId);
      if (!isEmpty(typingUsers2)) result[channelId] = typingUsers2;
    }
    return result;
  }, [privateChannelIds]);
  if (!currentUserId) return;
  const typingUsers = {};
  Object.values(typingUsersByChannel).forEach((users) => {
    Object.keys(users).forEach((userId) => {
      if (userId !== currentUserId) {
        typingUsers[userId] = UserStore.getUser(userId);
      }
    });
  });
  if (isEmpty(typingUsers) && currentUserId) return null;
  const indicatorType = DataStore.settings.indicatorType || DEFAULT_INDICATOR_TYPE;
  return React.createElement(
    "div",
    { ref },
    React.createElement(Popout, {
      renderPopout: () => React.createElement(UserAvatarList, { users: typingUsers }),
      position: "left",
      shouldShow: showPopout,
      className: "moreCorners",
      targetElementRef: ref,
      onRequestClose: () => setShowPopout(false),
      children: (props) => React.createElement("div", {
        className: "typing-indicator-dm-container",
        onMouseEnter: () => setShowPopout(true),
        onMouseLeave: () => setShowPopout(false),
        onClick: () => setShowPopout((x) => !x),
        ref,
        style: { cursor: "pointer" }
      }, React.createElement(Spinner, {
        ...props,
        type: Spinner.Type[indicatorType],
        animated: true,
        style: { gap: "var(--space-xs)", padding: "var(--space-0)" }
      }))
    })
  );
});
var TypingIndicator = React.memo(({ channelId }) => {
  const ref = React.useRef(null);
  const isMuted = useStateFromStores([UserGuildSettingsStore, SelectedGuildStore], (a, b) => {
    const isMuted2 = UserGuildSettingsStore.isChannelMuted(SelectedGuildStore.getGuildId(), channelId);
    return isMuted2;
  }, [channelId]);
  if (shouldIgnoreItem("ignoreChannels", channelId)) return null;
  const [showPopout, setShowPopout] = React.useState(false);
  const typingUsers = useStateFromStores([TypingStore], () => getTypingUsers(TypingStore.getTypingUsers(channelId)), [channelId]);
  if (isEmpty(typingUsers)) return null;
  const indicatorType = DataStore.settings.indicatorType || DEFAULT_INDICATOR_TYPE;
  return !isMuted && React.createElement(
    "div",
    { ref },
    React.createElement(Popout, {
      renderPopout: () => React.createElement(UserAvatarList, { users: typingUsers }),
      position: "right",
      shouldShow: showPopout,
      className: "moreCorners",
      targetElementRef: ref,
      onRequestClose: () => setShowPopout(false),
      children: (props) => React.createElement("div", {
        onMouseEnter: () => setShowPopout(true),
        onMouseLeave: () => setShowPopout(false),
        onClick: () => setShowPopout((x) => !x),
        style: { cursor: "pointer" },
        ref
      }, React.createElement(
        Components.Tooltip,
        { text: getTypingTooltip(typingUsers) },
        (tooltipProps) => React.createElement(Spinner, {
          ...tooltipProps,
          ...props,
          type: Spinner.Type[indicatorType],
          animated: true,
          style: { width: "16px", height: "16px" }
        })
      ))
    })
  );
});
var GuildTypingIndicator = React.memo(({ guildId }) => {
  if (shouldIgnoreItem("ignoreServers", guildId)) return null;
  const allTypingUsers = useStateFromStores([TypingStore], () => {
    const { VOCAL = {}, SELECTABLE = {} } = GuildChannelStore.getChannels(guildId) || {};
    const allChannels = [...Object.values(VOCAL), ...Object.values(SELECTABLE)];
    return allChannels.reduce((acc, { channel }) => {
      if (shouldIgnoreItem("ignoreChannels", channel.id)) return acc;
      return { ...acc, ...getTypingUsers(TypingStore.getTypingUsers(channel.id)) };
    }, {});
  }, [guildId]);
  if (isEmpty(allTypingUsers)) return null;
  return React.createElement(UserAvatarList, { key: "UserAvatarList_Main", users: allTypingUsers, guild: true });
});
var GuildTypingIndicatorV2 = React.memo(({ guildId }) => {
  if (shouldIgnoreItem("ignoreServers", guildId)) return null;
  const allTypingUsers = useStateFromStores([TypingStore], () => {
    const { VOCAL = {}, SELECTABLE = {} } = GuildChannelStore.getChannels(guildId) || {};
    const allChannels = [...Object.values(VOCAL), ...Object.values(SELECTABLE)];
    return allChannels.reduce((acc, { channel }) => {
      if (shouldIgnoreItem("ignoreChannels", channel.id)) return acc;
      return { ...acc, ...getTypingUsers(TypingStore.getTypingUsers(channel.id)) };
    }, {});
  }, [guildId]);
  if (isEmpty(allTypingUsers)) return null;
  const indicatorType = DataStore.settings.indicatorType || DEFAULT_INDICATOR_TYPE;
  return React.createElement(Spinner, {
    style: {
      position: "absolute",
      zIndex: 2,
      borderRadius: "var(--radius-sm)",
      padding: "2px",
      cursor: "pointer"
    },
    type: Spinner.Type[indicatorType],
    animated: true
  });
});
var LiveTyping = class {
  start() {
    this.patchChannelElement();
    this.patchDMTyping();
    this.injectStyles();
    this.patchContextMenus();
  }
  injectStyles() {
    DOM.addStyle("LiveTyping", `
            .live-typing-avatar-list {
                border-radius: 5px;
            }
            .live-typing-user-item:hover {
                background-color: var(--background-modifier-hover);
                border-radius: 3px;
            }
            .dm-typing-avatar {
                animation: pulse 1.5s infinite;
            }
            
            .moreCorners {
                border-radius: 10px;
                transform-origin: center center;
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
        `);
  }
  patchUserContextMenu(retVal, props) {
    if (!retVal || !props) return;
    const userId = props.user?.id;
    if (!userId) return;
    const dmChannel = Object.values(PrivateChannelSortStore.getPrivateChannelIds()).find((channelId) => {
      const channel = ChannelStore.getChannel(channelId);
      return channel && channel.recipients && channel.recipients.includes(userId);
    });
    if (dmChannel) {
      const isIgnored = isBlocked("ignoredDMs", dmChannel);
      const item = ContextMenu.buildItem({
        type: "toggle",
        label: `${isIgnored ? "Show" : "Hide"} Typing Indicator`,
        checked: isIgnored,
        action: () => {
          saveToBlocklist("ignoredDMs", dmChannel, !isIgnored);
        }
      });
      retVal.props.children.push(item);
    }
  }
  patchChannelContextMenu(retVal, props) {
    if (!retVal || !props) return;
    const channelId = props.channel?.id;
    if (!channelId) return;
    const isIgnored = isBlocked("ignoredChannels", channelId);
    const item = ContextMenu.buildItem({
      type: "toggle",
      label: `${isIgnored ? "Show" : "Hide"} Typing Indicator`,
      checked: isIgnored,
      action: () => {
        saveToBlocklist("ignoredChannels", channelId, !isIgnored);
      }
    });
    retVal.props.children.push(item);
  }
  patchGuildContextMenu(retVal, props) {
    if (!retVal || !props) return;
    const guildId = props.guild?.id;
    if (!guildId) return;
    const isIgnored = isBlocked("ignoredServers", guildId);
    const item = ContextMenu.buildItem({
      type: "toggle",
      label: `${isIgnored ? "Show" : "Hide"} Typing Indicator`,
      checked: isIgnored,
      action: () => {
        saveToBlocklist("ignoredServers", guildId, !isIgnored);
      }
    });
    retVal.props.children.push(item);
  }
  patchContextMenus() {
    ContextMenu.patch("user-context", this.patchUserContextMenu);
    ContextMenu.patch("channel-context", this.patchChannelContextMenu);
    ContextMenu.patch("guild-context", this.patchGuildContextMenu);
    ContextMenu.patch("gdm-context", this.patchChannelContextMenu);
  }
  patchDMTyping() {
    Patcher.after(scrollersModule.zC, "render", (that, [props], res) => {
      if (shouldIgnoreItem("ignoreDMs")) return res;
      const isGuildObject = Utils.findInTree(res, (x) => x?.lurkingGuildIds, { walkable: ["props", "children"] });
      isGuildObject && res.props.children.props.children.unshift(React.createElement("div", {}, React.createElement(TypingIndicatorDMBar)));
    });
  }
  patchChannelElement() {
    Patcher.after(ChannelElement.A, "render", (_, [props], ret) => {
      if (shouldIgnoreItem("ignoreChannels")) return ret;
      const channelId = ExtractItemID(props["data-list-item-id"]);
      if (!channelId) return;
      if (shouldIgnoreItem("ignoreChannels", channelId)) return ret;
      const children = ret.props.children.props.children[0].props.children ?? ret.props.children.props.children;
      const component = React.createElement("div", null, React.createElement(TypingIndicator, { channelId }));
      const location = DataStore.settings.indicatorLocation || DEFAULT_INDICATOR_LOCATION;
      if (location === "left") {
        children.unshift(component);
      } else {
        children.push(component);
      }
    });
  }
  patchGuildObject() {
  }
  stop() {
    Patcher.unpatchAll();
    DOM.removeStyle("LiveTyping");
    ContextMenu.unpatch("user-context", this.patchUserContextMenu);
    ContextMenu.unpatch("channel-context", this.patchChannelContextMenu);
    ContextMenu.unpatch("guild-context", this.patchGuildContextMenu);
    ContextMenu.unpatch("gdm-context", this.patchChannelContextMenu);
  }
  getSettingsPanel() {
    const currentSettings = DataStore.settings;
    const configWithCurrentValues = CONFIG.defaultConfig.map((setting) => ({
      ...setting,
      value: currentSettings[setting.id] ?? setting.value
    }));
    return UI.buildSettingsPanel({
      settings: configWithCurrentValues,
      onChange: (_, id, value) => {
        const settings = { ...DataStore.settings };
        settings[id] = value;
        DataStore.settings = settings;
      }
    });
  }
};
module.exports = LiveTyping;
