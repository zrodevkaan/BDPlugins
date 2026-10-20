/**
 * @name StreamingChannels
 * @author Kaan
 * @version 1.0.0
 * @description When screensharing or live streaming, selected channels will hide and not load any messages visually.  **Credit:** atomictyler give me this idea at a whopping 8am.
 * @credits atomic
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/StreamingChannels/StreamingChannels.plugin.js
 * @invite t3zMgv7Nvb
 * @stable 643186
 * @canary 644391
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

// src/StreamingChannels/index.tsx
var index_exports = {};
__export(index_exports, {
  Datastore: () => Datastore,
  default: () => StreamingChannels
});
module.exports = __toCommonJS(index_exports);

// helpers/webpack.ts
var { Webpack } = BdApi;

// helpers/index.tsx
var { Webpack: Webpack2, React, ContextMenu, Hooks, Utils, Data } = BdApi;
var { createElement, forwardRef } = React;
function lazyStore(name) {
  return lazyExport(() => Webpack2.getStore(name));
}
var Stores = {
  User: lazyStore("UserStore"),
  Guild: lazyStore("GuildStore"),
  Channel: lazyStore("ChannelStore"),
  GuildMember: lazyStore("GuildMemberStore"),
  SelectedGuild: lazyStore("SelectedGuildStore"),
  SelectedChannel: lazyStore("SelectedChannelStore"),
  Message: lazyStore("MessageStore")
};
function ContextMenuHelper(patches) {
  const unpatches = patches.map((p) => ContextMenu.patch(p.navId, p.patch));
  return () => unpatches.forEach((unpatch) => unpatch());
}
function styledBase(tag, cssOrFn) {
  const Styled = (props) => {
    const style = typeof cssOrFn === "function" ? cssOrFn(props) : cssOrFn;
    return createElement(tag, { ...props, style: { ...style, ...props.style } });
  };
  Styled.displayName = `styled.${String(tag)}`;
  return Styled;
}
var styled = new Proxy(styledBase, {
  get: (target, p) => (css) => target(p, css)
});
var SettingsStore = class extends BdApi.Utils.Store {
  constructor(defaults, dataKey = "settings") {
    super();
    this.defaults = defaults;
    this.dataKey = dataKey;
    const saved = BdApi.Data.load("StreamingChannels", dataKey);
    this.settings = { ...defaults, ...saved };
  }
  settings;
  get(key) {
    return this.settings[key];
  }
  set(key, value) {
    this.settings = { ...this.settings, [key]: value };
    this.persist();
  }
  del(key) {
    this.set(key, this.defaults[key]);
  }
  all() {
    return this.settings;
  }
  reset() {
    this.settings = { ...this.defaults };
    this.persist();
  }
  use(key) {
    return BdApi.Hooks.useStateFromStores(this, () => this.get(key), [key]);
  }
  persist() {
    BdApi.Data.save("StreamingChannels", this.dataKey, this.settings);
    this.emitChange();
  }
};
function lazyExport(getter) {
  let cached;
  const resolve = () => cached ??= getter();
  return new Proxy({}, {
    get: (_, key) => resolve()?.[key],
    set: (_, key, value) => {
      const target = resolve();
      if (target) target[key] = value;
      return true;
    },
    has: (_, key) => {
      const t = resolve();
      return t ? key in t : false;
    },
    ownKeys: () => {
      const t = resolve();
      return t ? Reflect.ownKeys(t) : [];
    },
    getOwnPropertyDescriptor: (_, key) => {
      const t = resolve();
      const desc = t ? Reflect.getOwnPropertyDescriptor(t, key) : void 0;
      return desc && { ...desc, configurable: true };
    }
  });
}

// src/StreamingChannels/index.tsx
var {
  Webpack: Webpack3,
  Patcher,
  Webpack: { Stores: Stores2 },
  React: { useEffect, useState },
  Components: { Button },
  Hooks: { useStateFromStores },
  ContextMenu: ContextMenu2,
  UI,
  Utils: Utils2
} = new BdApi("StreamingChannels");
var ChannelRender = Webpack3.getModule((x) => x && String(x.A).includes(".button||(") && String(x.A).includes(".metaKey||"));
var ChannelModule = Webpack3.getBySource(`name:"Channel",renderLoader`, {
  mapDeclarations: true,
  map: {
    ChatRender: Webpack3.Filters.byStrings("ChannelRenderer")
  }
});
var Datastore = new SettingsStore({
  channels: [],
  hiddenCategories: []
});
var Screen = styled.div({
  boxSizing: "border-box",
  flex: 1,
  minHeight: 0,
  width: "100%",
  height: "100%",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  padding: 32,
  textAlign: "center",
  color: "var(--text-muted)",
  background: "var(--background-base-lower, var(--background-primary))"
});
var Header = styled.h2({
  margin: 0,
  fontFamily: "var(--font-primary)",
  fontSize: "24px",
  fontWeight: 500,
  lineHeight: 1.3333,
  color: "var(--header-primary)"
});
var Body = styled.p({
  maxWidth: 360,
  margin: 0,
  color: "var(--text-default, var(--text-normal))"
});
var Actions = styled.div({
  display: "flex",
  gap: 8,
  marginTop: 8
});
function ByeByeIcon({ size = 160, accent = false }) {
  return /* @__PURE__ */ BdApi.React.createElement(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: accent ? "var(--channel-icon)" : "currentColor",
      strokeWidth: "1.25",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: { flexShrink: 0 }
    },
    /* @__PURE__ */ BdApi.React.createElement(
      "path",
      {
        d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
      }
    ),
    /* @__PURE__ */ BdApi.React.createElement("line", { x1: "1", y1: "1", x2: "23", y2: "23" })
  );
}
function findHiddenCategory(channelId, hidden) {
  if (!hidden.length) return null;
  const channel = Stores2.ChannelStore.getChannel(channelId);
  if (!channel?.guild_id) return null;
  const categories = Stores2.GuildCategoryStore.getCategories(channel.guild_id);
  if (!categories) return null;
  for (const { channel: category } of categories._categories ?? []) {
    if (!hidden.includes(category.id)) continue;
    const children = categories[category.id] ?? [];
    if (children.some((child) => child.channel.id === channelId)) return category.id;
  }
  return null;
}
function useIsSharing() {
  return useStateFromStores(
    [Stores2.StreamerModeStore, Stores2.ApplicationStreamingStore, Stores2.UserStore],
    () => {
      const userId = Stores2.UserStore.getCurrentUser()?.id;
      const streamerMode = Stores2.StreamerModeStore.getState()?.[userId]?.enabled ?? false;
      const streaming = Stores2.ApplicationStreamingStore.getCurrentUserActiveStream() != null;
      return streamerMode || streaming;
    }
  );
}
function MiddleScreen({ channel, onLoad, onUnmark }) {
  const name = channel.name ? `#${channel.name}` : "This channel";
  return /* @__PURE__ */ BdApi.React.createElement(Screen, null, /* @__PURE__ */ BdApi.React.createElement(ByeByeIcon, null), /* @__PURE__ */ BdApi.React.createElement(Header, null, name, " is hidden"), /* @__PURE__ */ BdApi.React.createElement(Body, null, "This channel is marked as a streaming channel, so it won't load automatically."), /* @__PURE__ */ BdApi.React.createElement(Actions, null, /* @__PURE__ */ BdApi.React.createElement(Button, { look: "bd-button-outlined", onClick: onLoad }, "Load Anyway"), /* @__PURE__ */ BdApi.React.createElement(Button, { look: "bd-button-link", onClick: onUnmark }, "Unmark")));
}
function PreventOverlay({ ret, channel }) {
  const channels = Datastore.use("channels");
  const hiddenCategories = Datastore.use("hiddenCategories");
  const [loadAnyway, setLoadAnyway] = useState(false);
  const isSharing = useIsSharing();
  const isMarked = channels.includes(channel.id);
  const hiddenCategoryId = findHiddenCategory(channel.id, hiddenCategories);
  const shouldPrevent = (isMarked || hiddenCategoryId != null) && isSharing;
  useEffect(() => {
    if (!shouldPrevent) setLoadAnyway(false);
  }, [shouldPrevent]);
  if (!shouldPrevent || loadAnyway) return ret;
  return /* @__PURE__ */ BdApi.React.createElement(
    MiddleScreen,
    {
      channel,
      onLoad: () => setLoadAnyway(true),
      onUnmark: () => {
        if (isMarked) {
          Datastore.set("channels", channels.filter((id) => id !== channel.id));
        } else if (hiddenCategoryId) {
          Datastore.set("hiddenCategories", hiddenCategories.filter((id) => id !== hiddenCategoryId));
        }
        UI.showToast("Unmarked", { type: "info" });
      }
    }
  );
}
function PrivateBlur({ channelId, children }) {
  const hiddenCategories = Datastore.use("hiddenCategories");
  const isSharing = useIsSharing();
  if (!isSharing || !findHiddenCategory(channelId, hiddenCategories)) return children;
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: { filter: "blur(4px)" } }, children);
}
function patchMenu(res, props) {
  const channel = props?.channel;
  if (!channel?.id) return res;
  if (!Array.isArray(res?.props?.children)) return res;
  const isCategory = channel.type === 4;
  const key = isCategory ? "hiddenCategories" : "channels";
  const noun = isCategory ? "category" : "channel";
  res.props.children.push(
    ...ContextMenu2.buildMenuChildren([
      { type: "separator" },
      {
        type: "group",
        items: [{
          id: "streaming-channels-toggle",
          label: isCategory ? "Streaming Category" : "Streaming Channel",
          type: "toggle",
          checked: Datastore.get(key).includes(channel.id),
          action: () => {
            const current = Datastore.get(key);
            const marked = current.includes(channel.id);
            Datastore.set(
              key,
              marked ? current.filter((id) => id !== channel.id) : [...current, channel.id]
            );
            UI.showToast(
              marked ? `Unmarked ${noun}` : `Marked ${noun} as streaming`,
              { type: marked ? "info" : "success" }
            );
          }
        }]
      }
    ])
  );
  return res;
}
var StreamingChannels = class {
  dispose;
  start() {
    Patcher.after(ChannelModule, "ChatRender", (_this, args, returnValue) => {
      const channelId = args[0]?.match?.params?.channelId;
      if (!channelId) return returnValue;
      const channel = Stores2.ChannelStore.getChannel(channelId);
      if (!channel) return returnValue;
      return /* @__PURE__ */ BdApi.React.createElement(PreventOverlay, { key: channel.id, ret: returnValue, channel });
    });
    Patcher.after(ChannelRender, "A", (_this, _args, returnValue) => {
      const found = Utils2.findInTree(
        returnValue,
        (m) => m?.props?.channel,
        { walkable: ["props", "children"] }
      );
      const channel = found?.props?.channel;
      if (!channel) return returnValue;
      if (Datastore.get("channels").includes(channel.id)) {
        const linkTop = Utils2.findInTree(
          returnValue,
          (m) => typeof m?.className === "string" && m.className.startsWith("linkTop"),
          { walkable: ["props", "children"] }
        );
        const children = linkTop?.children;
        if (Array.isArray(children)) {
          const index = children[1]?.props?.channel ? 1 : 0;
          children[index] = /* @__PURE__ */ BdApi.React.createElement(ByeByeIcon, { accent: true, size: 16 });
        }
      }
      return /* @__PURE__ */ BdApi.React.createElement(PrivateBlur, { channelId: channel.id }, returnValue);
    });
    this.dispose = ContextMenuHelper([
      {
        navId: "channel-context",
        patch: (res, props) => patchMenu(res, props)
      },
      {
        navId: "user-context",
        patch: (res, props) => patchMenu(res, props)
      }
    ]);
  }
  isStreamingChannel(channelId) {
    return Datastore.get("channels").includes(channelId) || findHiddenCategory(channelId, Datastore.get("hiddenCategories")) != null;
  }
  stop() {
    this.dispose?.();
    this.dispose = void 0;
    Patcher.unpatchAll();
  }
};
