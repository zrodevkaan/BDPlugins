/**
 * @name InAppNotifications
 * @author kaan
 * @version 1.0.0
 * @description A compact and sleek UI for messages. its for my liking, there is no config besides keywords.
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/InAppNotifications/InAppNotifications.plugin.js 
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

// src/InAppNotifications/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => InAppNotifications
});
module.exports = __toCommonJS(index_exports);
var { Webpack, Utils, Patcher, Hooks, React, Data, Components } = new BdApi("InAppNotifications");
var {
  MessageStore,
  ChannelStore,
  UserStore,
  GuildStore,
  UserGuildSettingsStore,
  GuildMemberStore,
  ReferencedMessageStore,
  PendingReplyStore,
  SelectedChannelStore
} = Webpack.Stores;
var [
  MessageComponent,
  MessageConstructor,
  MessageWrapper,
  Dispatcher,
  MessageActions
] = Webpack.getBulk(
  { filter: Webpack.Filters.byStrings(".mention_everyone??!1"), searchExports: true },
  { filter: Webpack.Filters.byPrototypeKeys("receivePushNotification") },
  { filter: (x) => String(x?.type).includes("Message must not be a thread starter message") },
  { filter: (x) => x?._dispatch, searchExports: true },
  { filter: Webpack.Filters.byKeys("fetchMessage", "deleteMessage") }
);
var NavigationUtils = Webpack.getMangled("transitionTo - Transitioning to", {
  transitionTo: Webpack.Filters.byStrings("transitionTo - Transitioning to"),
  replace: Webpack.Filters.byStrings("Replacing route with"),
  goBack: Webpack.Filters.byStrings(".goBack()"),
  goForward: Webpack.Filters.byStrings(".goForward()"),
  transitionToGuild: Webpack.Filters.byStrings("transitionToGuild - Transitioning to")
});
function injectMessage(rawMessage) {
  let message = MessageStore.getMessage(rawMessage.channel_id, rawMessage.id);
  if (!message) {
    message = MessageComponent(rawMessage);
    const channel = MessageConstructor.getOrCreate(rawMessage.channel_id);
    const updated = channel.mutate((r) => {
      r.ready = true;
      r.cached = true;
      r._map[rawMessage.id] = message;
    });
    MessageConstructor.commit(updated);
  }
  message = MessageStore.getMessage(rawMessage.channel_id, rawMessage.id) ?? MessageComponent(rawMessage);
  message = Object.assign(Object.create(Object.getPrototypeOf(message)), message, { guild_id: rawMessage.guild_id });
  return message;
}
var SettingsStore = new class extends Utils.Store {
  #keywords = Data.load("keywords") ?? [];
  #settings = Data.load("settings") ?? {};
  getKeywords() {
    return [...this.#keywords];
  }
  getSetting(key) {
    return this.#settings[key];
  }
  setSetting(key, value) {
    this.#settings[key] = value;
    Data.save("settings", this.#settings);
    this.emitChange();
  }
  setKeywords(keywords) {
    this.#keywords = keywords;
    Data.save("keywords", this.#keywords);
    this.emitChange();
  }
  flatten = (val) => {
    if (val === null || val === void 0) return "";
    if (typeof val !== "object") return String(val);
    return Object.values(val).map(this.flatten).join(" ");
  };
  getMatchedKeywords(message) {
    if (this.#keywords.length === 0) return [];
    const text = this.flatten(message).toLowerCase();
    return this.#keywords.filter((k) => text.includes(k.toLowerCase()));
  }
  hasKeywordMatch(message) {
    return this.getMatchedKeywords(message).length > 0;
  }
}();
var NotificationStore = new class extends Utils.Store {
  #messages = [];
  #reactions = [];
  getMessages() {
    return [...this.#messages];
  }
  getReactions() {
    return [...this.#reactions];
  }
  addMessage(rawMessage, matchedKeywords) {
    const message = injectMessage(rawMessage);
    this.#messages.push({ message, matchedKeywords });
    this.emitChange();
  }
  removeReaction(messageId) {
    this.#reactions = this.#reactions.filter((m) => m.messageId !== messageId);
    this.emitChange();
  }
  addReaction(obj) {
    const exists = this.#reactions.some((r) => r.messageId === obj.messageId && r.userId === obj.userId);
    if (exists) return;
    this.#reactions.push(obj);
    this.emitChange();
  }
  removeMessage(id) {
    this.#messages = this.#messages.filter((m) => m.message.id !== id);
    this.emitChange();
  }
  clear() {
    this.#messages = [];
    this.emitChange();
  }
}();
var ErrorBoundary = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("[IAN]", error, info);
  }
  render() {
    if (this.state.error) {
      return /* @__PURE__ */ BdApi.React.createElement("div", { style: { padding: "0.5rem", color: "var(--text-feedback-critical)", fontSize: "12px" } }, /* @__PURE__ */ BdApi.React.createElement("strong", null, "Error:"), " ", this.state.error.message, /* @__PURE__ */ BdApi.React.createElement("button", { onClick: () => this.setState({ error: null }) }, "Retry"));
    }
    return this.props.children;
  }
};
function Exit({ onClick }) {
  return /* @__PURE__ */ BdApi.React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: 24,
      height: 24,
      viewBox: "0 0 24 24",
      onClick,
      style: { cursor: "pointer", flexShrink: 0 }
    },
    /* @__PURE__ */ BdApi.React.createElement(
      "path",
      {
        fill: "var(--white)",
        d: "m12 13.4l-2.917 2.925q-.277.275-.704.275t-.704-.275q-.275-.275-.275-.7t.275-.7L10.6 12L7.675 9.108Q7.4 8.831 7.4 8.404t.275-.704q.275-.275.7-.275t.7.275L12 10.625L14.892 7.7q.277-.275.704-.275t.704.275q.3.3.3.713t-.3.687L13.375 12l2.925 2.917q.275.277.275.704t-.275.704q-.3.3-.712.3t-.688-.3z",
        strokeWidth: 0.7,
        stroke: "currentColor"
      }
    )
  );
}
function getChannelInfo(channel) {
  const guild = channel.guild_id ? GuildStore.getGuild(channel.guild_id) : null;
  if (guild) {
    return {
      iconUrl: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=32` : `https://cdn.discordapp.com/embed/avatars/0.png`,
      primaryLabel: guild.name,
      secondaryLabel: `#${channel.name}`,
      isGuild: true
    };
  }
  if (channel.type === 3) {
    const recipients = (channel.recipients ?? []).map((id) => UserStore.getUser(id)).filter(Boolean);
    return {
      iconUrl: channel.icon ? `https://cdn.discordapp.com/channel-icons/${channel.id}/${channel.icon}.png?size=32` : `https://cdn.discordapp.com/embed/avatars/0.png`,
      primaryLabel: channel.name || recipients.map((u) => u.globalName ?? u.username).join(", "),
      secondaryLabel: "Group DM",
      isGuild: false
    };
  }
  const recipient = UserStore.getUser((channel.recipients ?? [])[0]);
  return {
    iconUrl: recipient?.avatar ? `https://cdn.discordapp.com/avatars/${recipient.id}/${recipient.avatar}.png?size=32` : `https://cdn.discordapp.com/embed/avatars/0.png`,
    primaryLabel: recipient?.globalName ?? recipient?.username ?? "Direct Message",
    secondaryLabel: "Direct Message",
    isGuild: false
  };
}
function CardHeader({ channel, onRemove }) {
  const guild = channel.guild_id ? GuildStore.getGuild(channel.guild_id) : null;
  const { iconUrl, primaryLabel, secondaryLabel } = getChannelInfo(channel);
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "8px",
    paddingBottom: "8px",
    borderBottom: "1px solid var(--border-strong)",
    minWidth: 0
  } }, /* @__PURE__ */ BdApi.React.createElement(
    "img",
    {
      src: iconUrl,
      style: {
        width: "16px",
        height: "16px",
        borderRadius: guild ? "4px" : "50%",
        flexShrink: 0
      }
    }
  ), /* @__PURE__ */ BdApi.React.createElement("span", { style: {
    fontSize: "12px",
    fontWeight: 700,
    color: "var(--white)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    flexShrink: 1,
    minWidth: 0
  } }, primaryLabel), /* @__PURE__ */ BdApi.React.createElement("span", { style: { fontSize: "20px", color: "white" } }, "\xB7"), /* @__PURE__ */ BdApi.React.createElement("span", { style: {
    fontSize: "12px",
    color: "var(--text-muted)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    flexShrink: 1,
    minWidth: 0
  } }, secondaryLabel), /* @__PURE__ */ BdApi.React.createElement("span", { style: { marginLeft: "auto" } }, /* @__PURE__ */ BdApi.React.createElement(Exit, { onClick: onRemove })));
}
function KeywordBadges({ keywords }) {
  if (keywords.length === 0) return null;
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    marginTop: "6px"
  } }, keywords.map((k) => /* @__PURE__ */ BdApi.React.createElement("span", { key: k, style: {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--white)",
    borderRadius: "4px",
    padding: "1px 6px"
  } }, k)));
}
function NotificationCard({ message: initialMessage, matchedKeywords }) {
  const DURATION = Hooks.useStateFromStores(SettingsStore, () => SettingsStore.getSetting("duration") ?? 15 * 1e3);
  const message = Hooks.useStateFromStores(
    [MessageStore],
    () => MessageStore.getMessage(initialMessage.channel_id, initialMessage.id) ?? initialMessage
  );
  const [getText, setText] = React.useState("");
  const channel = ChannelStore.getChannel(message.channel_id);
  const [progress, setProgress] = React.useState(100);
  const isHoveredRef = React.useRef(false);
  const elapsedRef = React.useRef(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (isHoveredRef.current) return;
      elapsedRef.current += 50;
      const remaining = Math.max(0, 100 - elapsedRef.current / DURATION * 100);
      setProgress(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        NotificationStore.removeMessage(message.id);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [message.id]);
  if (!channel) return null;
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      onMouseEnter: () => {
        isHoveredRef.current = true;
      },
      onMouseLeave: () => {
        isHoveredRef.current = false;
      },
      onDoubleClick: () => {
        NavigationUtils.transitionTo(
          `/channels/${initialMessage.guild_id ?? "@me"}/${message.channel_id}/${message.id}`
        );
        NotificationStore.removeMessage(message.id);
      },
      onContextMenu: () => {
        NotificationStore.removeMessage(message.id);
      },
      style: {
        backgroundColor: "var(--background-base-low)",
        borderRadius: "8px",
        padding: "0.75rem",
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        overflow: "hidden",
        flexShrink: 0,
        maxHeight: "500px",
        position: "relative"
      }
    },
    /* @__PURE__ */ BdApi.React.createElement("div", null, /* @__PURE__ */ BdApi.React.createElement(CardHeader, { channel, onRemove: () => NotificationStore.removeMessage(message.id) }), /* @__PURE__ */ BdApi.React.createElement(ErrorBoundary, null, /* @__PURE__ */ BdApi.React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0 } }, /* @__PURE__ */ BdApi.React.createElement(
      MessageWrapper,
      {
        id: `${message.id}-${message.id}`,
        groupId: message.id,
        message,
        channel,
        compact: false,
        renderContentOnly: false,
        __ian: true
      }
    ))), /* @__PURE__ */ BdApi.React.createElement(KeywordBadges, { keywords: matchedKeywords }), /* @__PURE__ */ BdApi.React.createElement("div", { style: {
      position: "absolute",
      bottom: 0,
      left: 0,
      height: "3px",
      width: `${progress}%`,
      backgroundColor: "var(--youtube)",
      borderRadius: "0 0 4px 4px",
      transition: "width 50ms linear"
    } })),
    /* @__PURE__ */ BdApi.React.createElement("div", { style: { padding: "10px" } }, /* @__PURE__ */ BdApi.React.createElement(Components.TextInput, { value: getText, onChange: (e) => setText(e), placeholder: "Reply to user?", onKeyDown: (e) => {
      if (e.key === "Enter") {
        upload(initialMessage?.guild_id ? initialMessage.guild_id : void 0, message.channel_id, message.id, getText);
        NotificationStore.removeMessage(message.id);
      }
    } }))
  );
}
function NotificationContainer() {
  const entries = Hooks.useStateFromStores(
    [NotificationStore],
    () => NotificationStore.getMessages()
  );
  if (entries.length === 0) return null;
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      id: "ian-container",
      style: {
        position: "fixed",
        bottom: "5px",
        right: "5px",
        width: "420px",
        zIndex: 1002,
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxHeight: "100vh",
        overflowY: "auto",
        backgroundColor: "transparent",
        scrollbarWidth: "none"
      }
    },
    entries.map(({ message, matchedKeywords }) => /* @__PURE__ */ BdApi.React.createElement(NotificationCard, { key: message.id, message, matchedKeywords }))
  );
}
var timestampToSnowflake = (timestamp) => {
  const DISCORD_EPOCH = BigInt(14200704e5);
  const SHIFT = BigInt(22);
  const ms = BigInt(timestamp) - DISCORD_EPOCH;
  return ms <= BigInt(0) ? "0" : (ms << SHIFT).toString();
};
async function upload(guildId, channelId, messageId, text) {
  const useReply = SettingsStore.getSetting("shouldReply");
  MessageActions.sendMessage(channelId, {
    content: text,
    tts: false,
    invalidEmojis: [],
    validNonShortcutEmojis: []
  }, true, {
    nonce: timestampToSnowflake(Date.now()),
    ...useReply ? {
      messageReference: {
        guild_id: guildId,
        channel_id: channelId,
        message_id: messageId
      }
    } : {},
    location: "chat_input"
  });
}
function ForceUpdateRoot() {
  Dispatcher.dispatch({ type: "DOMAIN_MIGRATION_START" });
  requestIdleCallback(() => Dispatcher.dispatch({ type: "DOMAIN_MIGRATION_SKIP" }));
}
var InAppNotifications = class {
  isAllowed(message, guildId) {
    const currentUser = UserStore.getCurrentUser();
    if (!message?.channel_id) return false;
    if (message?.channel_id == SelectedChannelStore.getChannelId()) return false;
    if (message.author?.id === currentUser?.id) return false;
    if (!guildId) return true;
    if (SettingsStore.hasKeywordMatch(message)) return true;
    if (UserGuildSettingsStore.isChannelMuted(guildId, message.channel_id)) return false;
    if (UserGuildSettingsStore.isMuted(guildId)) return false;
    const channelNotifLevel = UserGuildSettingsStore.getChannelMessageNotifications(guildId, message.channel_id);
    const guildNotifLevel = UserGuildSettingsStore.getMessageNotifications(guildId);
    const effectiveLevel = channelNotifLevel === 3 || channelNotifLevel == null ? guildNotifLevel : channelNotifLevel;
    if (effectiveLevel === 2) return false;
    if (effectiveLevel === 1) {
      const suppressEveryone = UserGuildSettingsStore.isSuppressEveryoneEnabled(guildId);
      const suppressRoles = UserGuildSettingsStore.isSuppressRolesEnabled(guildId);
      const mentionsMe = message.mentions?.some((u) => u.id === currentUser.id);
      const mentionsEveryone = !suppressEveryone && message.mention_everyone;
      const myRoles = GuildMemberStore.getMember(guildId, currentUser.id)?.roles ?? [];
      const mentionsMyRole = !suppressRoles && message.mention_roles?.some((roleId) => myRoles.includes(roleId));
      if (!mentionsMe && !mentionsEveryone && !mentionsMyRole) return false;
    }
    return true;
  }
  #messageHandler = async ({ message, guildId }) => {
    if (!this.isAllowed(message, guildId)) return;
    const raw = Object.assign(MessageComponent(message), { guild_id: guildId });
    const matchedKeywords = SettingsStore.getMatchedKeywords(message);
    NotificationStore.addMessage(raw, matchedKeywords);
  };
  #reactionHandler = async ({ userId, channelId, messageId, guildId, emoji }) => {
    const currentUser = UserStore.getCurrentUser();
    if (!currentUser) return;
    if (document.visibilityState === "hidden") return;
    let message = MessageStore.getMessage(channelId, messageId);
    if (!message) {
      message = await MessageActions.fetchMessage({ channelId, messageId }).catch(() => null);
    }
    if (!message) return;
    const raw = Object.assign(MessageComponent(message), { guild_id: guildId });
    NotificationStore.addReaction({ emoji, messageId, userId, channelId, message: raw });
  };
  load() {
    const servers = GuildStore.getGuildsArray();
    Dispatcher.dispatch({
      type: "GUILD_SUBSCRIPTIONS_FLUSH",
      subscriptions: servers.reduce((acc, v) => {
        acc[v.id] = { typing: true, activities: true, threads: true };
        return acc;
      }, {})
    });
  }
  start() {
    BdApi.DOM.addStyle("IAN", `
            #ian-container::-webkit-scrollbar { display: none; }
            #ian-container input[type="text"] { width: 100% !important; box-sizing: border-box !important; }
        `);
    Patcher.after(Webpack.getModule(Webpack.Filters.bySource("Shakeable")).A, "type", (_, __, res) => {
      res.props.children.push(/* @__PURE__ */ BdApi.React.createElement(ErrorBoundary, null, /* @__PURE__ */ BdApi.React.createElement(NotificationContainer, null)));
    });
    Patcher.after(MessageWrapper, "type", (a, [b], c) => {
      const loc = Utils.findInTree(c, (x) => x.childrenAccessories, { walkable: ["props", "children"] });
      if (b.__ian) loc.childrenButtons = void 0;
      return c;
    });
    Dispatcher.subscribe("MESSAGE_CREATE", this.#messageHandler);
    ForceUpdateRoot();
  }
  stop() {
    BdApi.DOM.removeStyle("IAN");
    Patcher.unpatchAll();
    Dispatcher.unsubscribe("MESSAGE_CREATE", this.#messageHandler);
    NotificationStore.clear();
  }
  getSettingsPanel() {
    return () => {
      const [value, setValue] = React.useState(
        SettingsStore.getKeywords().join(";")
      );
      const duration = Hooks.useStateFromStores(SettingsStore, () => SettingsStore.getSetting("duration") ?? 15e3);
      const shouldReply = Hooks.useStateFromStores(SettingsStore, () => SettingsStore.getSetting("shouldReply") ?? true);
      return /* @__PURE__ */ BdApi.React.createElement("div", null, /* @__PURE__ */ BdApi.React.createElement(
        Components.SettingItem,
        {
          id: "keywords",
          name: "Keywords",
          note: "Semicolon-separated list of keywords to always show notifications for.",
          inline: false
        },
        /* @__PURE__ */ BdApi.React.createElement(
          Components.TextInput,
          {
            value,
            placeholder: "keyword1;keyword2;keyword3",
            onChange: (v) => {
              setValue(v);
              const keywords = v.split(";").map((k) => k.trim()).filter((k) => k.length > 0);
              SettingsStore.setKeywords(keywords);
            }
          }
        )
      ), /* @__PURE__ */ BdApi.React.createElement(
        Components.SettingItem,
        {
          id: "duration",
          name: "Notification Duration",
          note: `How long notifications stay on screen. Currently: ${(duration / 1e3).toFixed(1)}s`,
          inline: false
        },
        /* @__PURE__ */ BdApi.React.createElement(
          Components.SliderInput,
          {
            min: 3e3,
            max: 6e4,
            step: 1e3,
            value: duration,
            units: "ms",
            onChange: (v) => {
              SettingsStore.setSetting("duration", v);
            }
          }
        )
      ), /* @__PURE__ */ BdApi.React.createElement(
        Components.SettingItem,
        {
          id: "duration",
          name: "Reply to Message",
          note: `Should you reply to the message.`,
          inline: true
        },
        /* @__PURE__ */ BdApi.React.createElement(
          Components.SwitchInput,
          {
            value: shouldReply,
            onChange: (v) => {
              SettingsStore.setSetting("shouldReply", v);
            }
          }
        )
      ));
    };
  }
};
