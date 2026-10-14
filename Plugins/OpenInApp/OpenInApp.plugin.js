/**
 * @name OpenInApp
 * @author Kaan
 * @version 1.0.0
 * @description Open links in the app instead of the browser
 * @changelog 1.0.0: Initial release; Initial release of OpenInApp
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/OpenInApp/OpenInApp.plugin.js
 * @invite t3zMgv7Nvb
 * @stable 636431
 * @canary 637121
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

// src/OpenInApp/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => OpenInApp
});
module.exports = __toCommonJS(index_exports);

// <define:__PLUGIN_CHANGELOG__>
var define_PLUGIN_CHANGELOG_default = [{ version: "1.0.0", title: "Initial release", type: "added", items: ["Initial release of OpenInApp"] }];

// helpers/webpack.ts
var { Webpack } = BdApi;
function queryToFilter(query) {
  if ("filter" in query) return query.filter;
  if ("keys" in query) return Webpack.Filters.byKeys(...query.keys);
  if ("prototypeKeys" in query) return Webpack.Filters.byPrototypeKeys(...query.prototypeKeys);
  if ("strings" in query) return Webpack.Filters.byStrings(...query.strings);
  if ("source" in query) return Webpack.Filters.bySource(...query.source);
  if ("regex" in query) return Webpack.Filters.byRegex(query.regex);
  if ("displayName" in query) return Webpack.Filters.byDisplayName(query.displayName);
  return Webpack.Filters.byStoreName(query.storeName);
}
function resolveModule(filter, options) {
  const opts = options ?? {};
  if (opts.declaration) {
    const { declaration, key, raw, ...rest } = opts;
    const result = Webpack.getMangled(filter, { __value: declaration }, {
      ...rest,
      mapDeclarations: true
    });
    return result?.__value ?? null;
  }
  const mod = Webpack.getModule(filter, opts);
  if (mod == null) return null;
  return opts.key ? mod[opts.key] : mod;
}
function resolveQuery(query) {
  if ("map" in query) {
    const q = query;
    const newModule = {};
    const foundModule = Webpack.getModule(q.filter);
    if (foundModule) {
      const remaining = new Map(Object.entries(q.map));
      for (const value of Object.values(foundModule)) {
        for (const [queryKey, queryValue] of remaining) {
          if (queryValue(value)) {
            newModule[queryKey] = value;
            remaining.delete(queryKey);
            break;
          }
        }
        if (remaining.size === 0) break;
      }
    }
    return newModule;
  }
  return resolveModule(queryToFilter(query), query.options);
}
function wpGetBulkKeyed(queries) {
  return Object.fromEntries(
    Object.entries(queries).map(([key, query]) => [key, resolveQuery(query)])
  );
}

// helpers/index.tsx
var { Webpack: Webpack2, React, ContextMenu, Hooks, Utils, Data } = BdApi;
var { createElement, forwardRef } = React;
function parseVersion(version) {
  const match = version.match(
    /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/
  );
  if (!match) throw new Error(`Invalid semantic version "${version}"`);
  const prerelease = match[4] ? match[4].split(".").map((identifier) => {
    if (/^\d+$/.test(identifier)) {
      if (identifier.length > 1 && identifier.startsWith("0")) {
        throw new Error(`Invalid numeric prerelease identifier in "${version}"`);
      }
      return Number(identifier);
    }
    return identifier;
  }) : [];
  return { numbers: [Number(match[1]), Number(match[2]), Number(match[3])], prerelease };
}
function compareVersions(left, right) {
  const a = parseVersion(left);
  const b = parseVersion(right);
  for (let index = 0; index < a.numbers.length; index++) {
    const leftNumber = a.numbers[index];
    const rightNumber = b.numbers[index];
    if (leftNumber !== void 0 && rightNumber !== void 0 && leftNumber !== rightNumber) {
      return leftNumber > rightNumber ? 1 : -1;
    }
  }
  if (!a.prerelease.length || !b.prerelease.length) {
    if (a.prerelease.length === b.prerelease.length) return 0;
    return a.prerelease.length ? -1 : 1;
  }
  const length = Math.max(a.prerelease.length, b.prerelease.length);
  for (let index = 0; index < length; index++) {
    const leftIdentifier = a.prerelease[index];
    const rightIdentifier = b.prerelease[index];
    if (leftIdentifier === void 0 || rightIdentifier === void 0) {
      return leftIdentifier === rightIdentifier ? 0 : leftIdentifier === void 0 ? -1 : 1;
    }
    if (leftIdentifier === rightIdentifier) continue;
    if (typeof leftIdentifier === "number" && typeof rightIdentifier !== "number") return -1;
    if (typeof leftIdentifier !== "number" && typeof rightIdentifier === "number") return 1;
    return leftIdentifier > rightIdentifier ? 1 : -1;
  }
  return 0;
}
function ChangeLog(entries = define_PLUGIN_CHANGELOG_default) {
  const api = new BdApi("OpenInApp");
  const savedVersion = api.Data.load("lastVersion");
  if (savedVersion != null && typeof savedVersion !== "string") {
    throw new Error(`[${"OpenInApp"}] saved changelog version is not a string`);
  }
  const latestSeenVersion = typeof savedVersion === "string" ? savedVersion : null;
  parseVersion("1.0.0");
  for (let index = 1; index < entries.length; index++) {
    const newer = entries[index - 1];
    const older = entries[index];
    if (newer && older && compareVersions(newer.version, older.version) <= 0) {
      throw new Error(
        `[${"OpenInApp"}] changelog entries must be ordered newest to oldest`
      );
    }
  }
  if (latestSeenVersion === "1.0.0") return false;
  const availableEntries = entries.filter(
    (entry) => compareVersions(entry.version, "1.0.0") <= 0
  );
  const changes = availableEntries.filter(
    (entry) => latestSeenVersion ? compareVersions(entry.version, latestSeenVersion) > 0 : entry === availableEntries[0]
  );
  if (changes.length) {
    api.UI.showChangelogModal({
      title: "OpenInApp",
      subtitle: "1.0.0",
      changes: changes.map(({ version: _version, ...change }) => change)
    });
  }
  api.Data.save("lastVersion", "1.0.0");
  return changes.length > 0;
}
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
    const saved = BdApi.Data.load("OpenInApp", dataKey);
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
    BdApi.Data.save("OpenInApp", this.dataKey, this.settings);
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

// src/OpenInApp/index.tsx
var { Components } = new BdApi("OpenInApp");
var { Tooltip } = Components;
var ICON_SIZE = 24;
var GITHUB_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fff'%3E%3Cpath d='M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943'/%3E%3C/svg%3E";
var Modules = wpGetBulkKeyed({
  "SimpleMarkdown": {
    filter: (m) => m.reactParserFor
  }
});
var open = (url) => {
  console.log(`OpenInApp: protocol: ${url}`);
  (0, eval)('require("electron")').shell.openExternal(url);
};
function generateFaviconURL(website, size = ICON_SIZE) {
  const url = new URL("https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL");
  url.searchParams.set("url", `https://${website}`);
  url.searchParams.set("size", String(size));
  return url.href;
}
var escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var protocolRegex = (protocol) => new RegExp(`^${escapeRegex(protocol)}(?:[^\\s<>]*[^\\s<>.,;:!?)\\]'"])?`);
var app = (protocol, site, trusted = false, execute = open) => ({
  protocol,
  icon: generateFaviconURL(site),
  trusted,
  execute
});
var Protocols = {
  // OMG, MOM GET THE CAMERA, I NEED TO TAKE A PICTURE OF THIS PROTOCOL
  BetterDiscord: {
    protocol: "betterdiscord://",
    icon: "https://betterdiscord.app/resources/branding/logo_small.svg",
    execute: (url) => window.open(url),
    trusted: true
  },
  // Communication / social
  Spotify: app("spotify://", "spotify.com", true),
  Skype: app("skype://", "skype.com"),
  Teams: app("msteams://", "teams.microsoft.com"),
  Zoom: app("zoommtg://", "zoom.us"),
  Zoomus: app("zoomus://", "zoom.us"),
  Twitch: app("twitch://", "twitch.tv", true),
  YouTube: app("youtube://", "youtube.com", true),
  VLC: app("vlc://", "videolan.org", true),
  WhatsApp: app("whatsapp://", "whatsapp.com"),
  Telegram: app("tg://", "telegram.org"),
  Signal: app("sgnl://", "signal.org"),
  Messenger: app("fb-messenger://", "messenger.com"),
  Slack: app("slack://", "slack.com"),
  Element: app("element://", "element.io"),
  Viber: app("viber://", "viber.com"),
  Line: app("line://", "line.me"),
  Webex: app("webex://", "webex.com"),
  // Games / launchers
  Steam: app("steam://", "steampowered.com", true),
  Epic: app("com.epicgames.launcher://", "epicgames.com"),
  GOG: app("goggalaxy://", "gog.com"),
  Battlenet: app("battlenet://", "battle.net"),
  Origin: app("origin2://", "ea.com"),
  Minecraft: app("minecraft://", "minecraft.net"),
  Roblox: app("roblox://", "roblox.com", true),
  Riot: app("riotclient://", "riotgames.com"),
  // Dev tools / productivity
  VSCode: app("vscode://", "code.visualstudio.com", true),
  Cursor: app("cursor://", "cursor.com"),
  "Github Desktop": { ...app("x-github-client://", "desktop.github.com"), icon: GITHUB_ICON },
  Postman: app("postman://", "postman.com"),
  Notion: app("notion://", "notion.so"),
  Obsidian: app("obsidian://", "obsidian.md"),
  Figma: app("figma://", "figma.com"),
  Linear: app("linear://", "linear.app"),
  Zotero: app("zotero://", "zotero.org"),
  // Media
  "Apple Music": app("music://", "music.apple.com"),
  Tidal: app("tidal://", "tidal.com"),
  Plex: app("plex://", "plex.tv"),
  // Maps / mail / misc
  Maps: app("maps://", "maps.apple.com"),
  Mailto: app("mailto:", "mail.google.com", true),
  Tel: app("tel:", "google.com")
};
var Settings = new SettingsStore({
  trusted: [],
  compact: false
});
var ProtocolMention = styled.span({
  background: "var(--mention-background)",
  borderRadius: 4,
  color: "var(--mention-foreground)",
  fontWeight: "var(--font-weight-medium)",
  padding: "2px 2px",
  unicodeBidi: "plaintext",
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  verticalAlign: "bottom",
  cursor: "pointer"
});
var TRUSTED_COLOR = "hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%)";
var UNTRUSTED_COLOR = "hsl(0, calc(var(--saturation-factor, 1) * 100%), 50%)";
var ProtocolContainer = styled.div(({ protocol, trusted }) => {
  const isTrusted = trusted ?? Settings.get("trusted").includes(protocol);
  return {
    background: "var(--background-surface-high)",
    border: "1px solid var(--border-subtle)",
    borderInlineStart: `4px solid ${isTrusted ? TRUSTED_COLOR : UNTRUSTED_COLOR}`,
    borderRadius: 4,
    padding: 8,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    width: "100%",
    maxWidth: 200,
    boxSizing: "border-box",
    cursor: "pointer"
  };
});
var Header = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 6,
  color: "var(--text-default)",
  fontWeight: "var(--font-weight-semibold)"
});
var Name = styled.span({
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
});
var Icon = styled.img(({ size }) => {
  return {
    width: size ?? ICON_SIZE,
    height: size ?? ICON_SIZE,
    objectFit: "contain",
    flexShrink: 0
    // borderRadius: "50%",
  };
});
var Footer = styled.div({
  fontSize: 11,
  lineHeight: "14px",
  color: "var(--text-muted)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
});
var OpenIcon = () => /* @__PURE__ */ BdApi.React.createElement("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: "currentColor", style: { flexShrink: 0 } }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    d: "M14 3v2h3.6l-9.8 9.8 1.4 1.4L19 6.4V10h2V3zM5 5h6V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-6h-2v6H5z"
  }
));
function ReactiveParent({ node, protocol, icon, name, trusted, execute }) {
  const isCompact = Settings.use("compact");
  return isCompact ? /* @__PURE__ */ BdApi.React.createElement(Tooltip, { text: node.content }, (x) => /* @__PURE__ */ BdApi.React.createElement(ProtocolMention, { ...x, className: "mention interactive" }, /* @__PURE__ */ BdApi.React.createElement(Icon, { size: "16px", src: icon }), /* @__PURE__ */ BdApi.React.createElement("span", { onClick: (e) => {
    e.preventDefault();
    execute(node.content);
  } }, name))) : /* @__PURE__ */ BdApi.React.createElement(
    ProtocolEmbed,
    {
      protocol,
      trusted,
      icon,
      name,
      url: node.content,
      execute
    }
  );
}
function ProtocolEmbed({ protocol, icon, name, url, execute, trusted }) {
  return /* @__PURE__ */ BdApi.React.createElement(ProtocolContainer, { trusted, protocol, onClick: (e) => {
    e.preventDefault();
    e.stopPropagation();
    execute(url);
  } }, /* @__PURE__ */ BdApi.React.createElement(Header, null, /* @__PURE__ */ BdApi.React.createElement(Icon, { src: icon, alt: "" }), /* @__PURE__ */ BdApi.React.createElement(Name, null, name), /* @__PURE__ */ BdApi.React.createElement(OpenIcon, null)), /* @__PURE__ */ BdApi.React.createElement(Tooltip, { text: url }, (props) => /* @__PURE__ */ BdApi.React.createElement(Footer, { ...props }, url)));
}
function SettingsPanel() {
  return /* @__PURE__ */ BdApi.React.createElement(Components.SettingGroup, { name: "Embed Options" }, /* @__PURE__ */ BdApi.React.createElement(
    Components.SettingItem,
    {
      id: "openinapp-compact",
      name: "Compact Mentions",
      note: "Use a compact mention style instead of a full embed."
    },
    /* @__PURE__ */ BdApi.React.createElement(Components.SwitchInput, { defaultValue: Settings.get("compact"), onChange: (v) => Settings.set("compact", v) })
  ));
}
var OpenInApp = class {
  start() {
    ChangeLog();
    for (const [name, { protocol, icon, execute, trusted }] of Object.entries(Protocols)) {
      const regex = protocolRegex(protocol);
      Modules.SimpleMarkdown.defaultRules[name.toLowerCase()] = {
        order: 0,
        match: (src) => regex.exec(src),
        parse: (capture) => ({ content: capture[0] }),
        react: (node) => /* @__PURE__ */ BdApi.React.createElement(
          ReactiveParent,
          {
            node,
            protocol,
            icon,
            name,
            trusted,
            execute
          }
        )
      };
    }
    Modules.SimpleMarkdown.parse = Modules.SimpleMarkdown.reactParserFor(Modules.SimpleMarkdown.defaultRules);
  }
  stop() {
    for (const name of Object.keys(Protocols)) {
      delete Modules.SimpleMarkdown.defaultRules[name.toLowerCase()];
    }
    Modules.SimpleMarkdown.parse = Modules.SimpleMarkdown.reactParserFor(Modules.SimpleMarkdown.defaultRules);
  }
  getSettingsPanel() {
    return /* @__PURE__ */ BdApi.React.createElement(SettingsPanel, null);
  }
};
