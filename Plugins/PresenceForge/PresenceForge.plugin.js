/**
 * @name PresenceForge
 * @author Kaan
 * @version 1.0.1
 * @description The ultimate rich presence editor for BetterDiscord
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/PresenceForge/PresenceForge.plugin.js
 * @invite t3zMgv7Nvb
 * @stable 657850
 * @canary 659817
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

// src/PresenceForge/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => _
});
module.exports = __toCommonJS(index_exports);

// <define:__PLUGIN_CHANGELOG__>
var define_PLUGIN_CHANGELOG_default = [{ version: "1.0.1", title: "Crash Fix", type: "improved", items: ["Error occurred when trying to open the Edit modal"] }];

// helpers/webpack.ts
var { Webpack } = BdApi;

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
  const api = new BdApi("PresenceForge");
  const savedVersion = api.Data.load("lastVersion");
  if (savedVersion != null && typeof savedVersion !== "string") {
    throw new Error(`[${"PresenceForge"}] saved changelog version is not a string`);
  }
  const latestSeenVersion = typeof savedVersion === "string" ? savedVersion : null;
  parseVersion("1.0.1");
  for (let index = 1; index < entries.length; index++) {
    const newer = entries[index - 1];
    const older = entries[index];
    if (newer && older && compareVersions(newer.version, older.version) <= 0) {
      throw new Error(
        `[${"PresenceForge"}] changelog entries must be ordered newest to oldest`
      );
    }
  }
  if (latestSeenVersion === "1.0.1") return false;
  const availableEntries = entries.filter(
    (entry) => compareVersions(entry.version, "1.0.1") <= 0
  );
  const changes = availableEntries.filter(
    (entry) => latestSeenVersion ? compareVersions(entry.version, latestSeenVersion) > 0 : entry === availableEntries[0]
  );
  if (changes.length) {
    api.UI.showChangelogModal({
      title: "PresenceForge",
      subtitle: "1.0.1",
      changes: changes.map(({ version: _version, ...change }) => change)
    });
  }
  api.Data.save("lastVersion", "1.0.1");
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
    const saved = BdApi.Data.load("PresenceForge", dataKey);
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
  push(key, value) {
    const current = this.settings[key];
    if (!Array.isArray(current)) throw new Error(`Cannot push to non-array setting "${String(key)}"`);
    this.set(key, [...current, value]);
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
  useAll() {
    return BdApi.Hooks.useStateFromStores(this, () => this.all());
  }
  persist() {
    BdApi.Data.save("PresenceForge", this.dataKey, this.settings);
    this.emitChange();
  }
};
function lazyExport(getter) {
  let cached;
  const resolve = () => cached ??= getter();
  return new Proxy({}, {
    get: (_2, key) => resolve()?.[key],
    set: (_2, key, value) => {
      const target = resolve();
      if (target) target[key] = value;
      return true;
    },
    has: (_2, key) => {
      const t = resolve();
      return t ? key in t : false;
    },
    ownKeys: () => {
      const t = resolve();
      return t ? Reflect.ownKeys(t) : [];
    },
    getOwnPropertyDescriptor: (_2, key) => {
      const t = resolve();
      const desc = t ? Reflect.getOwnPropertyDescriptor(t, key) : void 0;
      return desc && { ...desc, configurable: true };
    }
  });
}

// src/PresenceForge/types.ts
var TYPE_LABELS = {
  [0 /* PLAYING */]: "Playing",
  [1 /* STREAMING */]: "Streaming",
  [2 /* LISTENING */]: "Listening",
  [3 /* WATCHING */]: "Watching",
  [5 /* COMPETING */]: "Competing"
};

// src/PresenceForge/index.tsx
var {
  Components: { Button, Flex, SwitchInput, Modal, TextInput, SettingGroup, SettingItem },
  Webpack: Webpack3,
  Webpack: { Stores: Stores2 },
  React: React2,
  Logger
} = new BdApi("PresenceForge");
var ModalActions = Webpack3.getByKeys("openModal");
var Dispatcher = Webpack3.getByKeys("dispatch", "subscribe", { searchExports: true });
var AssetHelpers = Webpack3.getModule(
  Webpack3.Filters.bySource("getAssetImage: size must === [number, number] for Twitch"),
  {
    map: {
      getAsset: Webpack3.Filters.byStrings("APPLICATION_ASSETS_FETCH")
    }
  }
);
async function toPresence({ id, enabled, ...activity }) {
  const assets = { ...activity.assets };
  for (const k of ["large_image", "small_image"]) {
    if (assets[k]) assets[k] = (await AssetHelpers.getAsset(activity.application_id, [assets[k], void 0]))[0];
  }
  if (activity.name == null || activity.name === "") activity.name = "Custom Activity";
  const urls = activity.metadata?.button_urls ?? [];
  const buttons = (activity.buttons ?? []).map((label, i) => ({ label, url: urls[i] })).filter((b) => b.label && b.url).slice(0, 2);
  return {
    ...activity,
    assets,
    buttons: buttons.map((b) => b.label),
    metadata: { ...activity.metadata, button_urls: buttons.map((b) => b.url) }
  };
}
async function setActivity(activity) {
  if (!activity) return;
  const data = await toPresence(activity);
  Dispatcher.dispatch({
    type: "LOCAL_ACTIVITY_UPDATE",
    activity: activity ? data : null
  });
}
var _defaults = {
  activities: [
    {
      id: "gay-queef-juuce",
      name: "Rocket League",
      type: 0 /* PLAYING */,
      application_id: "379286085710381999",
      platform: "desktop",
      status_display_type: 2 /* DETAILS */,
      state: "In a Match",
      state_url: "https://example.com/state",
      details: "Ranked Duos: 2-1",
      details_url: "https://example.com/details",
      flags: 1 /* INSTANCE */ | 2 /* JOIN */ | 64 /* PARTY_PRIVACY_FRIENDS */,
      timestamps: { start: "1695164482423" },
      party: { id: "9dd6594e-81b3-49f6-a6b5-a679e6a060d3", size: [2, 2] },
      assets: {
        large_image: "351371005538729000",
        large_text: "DFH Stadium",
        large_url: "https://example.com/stadium",
        small_image: "351371005538729111",
        small_text: "Silver III",
        small_url: "https://example.com/rank",
        // this is only for external parties like spotify or whatever.
        // discord has an internal method to parse this.
        invite_cover_image: "mp:external/bull/shit.png"
      },
      buttons: ["View Profile", "Watch Live"],
      metadata: { button_urls: ["https://example.com/profile", "https://example.com/live"] },
      secrets: { join: "025ed05c71f639de8bfaa0d679d7c94b2fdce12f", match: "match-secret" },
      supported_platforms: ["desktop", "xbox"],
      // internal
      enabled: false
    }
  ],
  settings: {
    startup: true
  }
};
var _data = new SettingsStore(_defaults);
var ApplicationBackground = styled.div({
  backgroundColor: "var(--background-surface-high)",
  padding: "8px",
  marginBottom: "12px",
  borderRadius: "4px",
  border: "1px solid var(--border-muted)"
});
var ApplicationName = styled.div({
  fontSize: "16px",
  fontWeight: 600,
  color: "var(--text-normal)"
});
var ApplicationDetails = styled.div({
  fontSize: "14px",
  color: "var(--text-muted)"
});
var ApplicationBackgroundPreview = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px",
  borderRadius: "8px",
  backgroundColor: "var(--background-base-lowest)",
  width: "auto"
});
var ApplicationPreviewImage = styled.img({
  width: "56px",
  height: "56px",
  flexShrink: 0,
  borderRadius: "8px",
  backgroundColor: "var(--background-mod-strong)"
});
var ApplicationPreviewText = styled.div({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  flex: 1
});
var PreviewLabel = styled.div({
  fontSize: "14px",
  fontWeight: 600,
  color: "var(--text-normal)"
});
var FLAG_OPTIONS = [
  { label: "Instance", bit: 1 /* INSTANCE */ },
  { label: "Join", bit: 2 /* JOIN */ },
  { label: "Party: Friends", bit: 64 /* PARTY_PRIVACY_FRIENDS */ },
  { label: "Sync", bit: 16 /* SYNC */ },
  { label: "Playable", bit: 32 /* PLAY */ }
];
var PLATFORM_OPTIONS = ["desktop", "xbox", "playstation", "ios", "android"];
var STATUS_DISPLAY = [
  { label: "Name", value: 0 /* NAME */ },
  { label: "State", value: 1 /* STATE */ },
  { label: "Details", value: 2 /* DETAILS */ }
];
function Checkmark() {
  return /* @__PURE__ */ BdApi.React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", "aria-hidden": "true" }, /* @__PURE__ */ BdApi.React.createElement(
    "path",
    {
      fill: "currentColor",
      d: "M8.99991 16.17L4.82991 12L3.40991 13.41L8.99991 19L20.9999 7L19.5899 5.59L8.99991 16.17Z"
    }
  ));
}
function Chip({ label, on, onClick }) {
  const [hover, setHover] = React2.useState(false);
  const [focus, setFocus] = React2.useState(false);
  const background = on ? "var(--brand-500, #5865f2)" : hover ? "var(--background-mod-normal)" : "var(--background-mod-subtle)";
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      role: "checkbox",
      "aria-checked": on,
      tabIndex: 0,
      onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      onFocus: (e) => setFocus(e.currentTarget.matches(":focus-visible")),
      onBlur: () => setFocus(false),
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 12px",
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "20px",
        borderRadius: "8px",
        cursor: "pointer",
        userSelect: "none",
        color: on ? "#fff" : hover ? "var(--text-default)" : "var(--text-muted)",
        backgroundColor: background,
        border: `1px solid ${on ? "transparent" : "var(--border-normal, var(--border-muted))"}`,
        outline: focus ? "2px solid var(--focus-primary, var(--brand-500))" : "none",
        outlineOffset: 1,
        transition: "background-color .15s ease, color .15s ease, border-color .15s ease"
      }
    },
    on && /* @__PURE__ */ BdApi.React.createElement(Checkmark, null),
    label
  );
}
function Section({ label, children }) {
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: { gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 6 } }, /* @__PURE__ */ BdApi.React.createElement("div", { style: { fontSize: "12px", fontWeight: 600, color: "var(--text-normal)" } }, label), /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, children));
}
var gridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
function ButtonsTab({ activity, update }) {
  const labels = activity.buttons ?? [];
  const urls = activity.metadata?.button_urls ?? [];
  const setButton = (i, label, url) => {
    const nextLabels = Array.from({ length: 2 }, (_2, n) => labels[n] ?? "");
    const nextUrls = Array.from({ length: 2 }, (_2, n) => urls[n] ?? "");
    nextLabels[i] = label;
    nextUrls[i] = url;
    update({ buttons: nextLabels, metadata: { ...activity.metadata, button_urls: nextUrls } });
  };
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: gridStyle }, [0, 1].map((i) => /* @__PURE__ */ BdApi.React.createElement(React2.Fragment, { key: i }, /* @__PURE__ */ BdApi.React.createElement(
    TextWithLabel,
    {
      label: `Button ${i + 1} label`,
      value: labels[i],
      onChange: (v) => setButton(i, v, urls[i] ?? "")
    }
  ), /* @__PURE__ */ BdApi.React.createElement(
    TextWithLabel,
    {
      label: `Button ${i + 1} URL`,
      value: urls[i],
      onChange: (v) => setButton(i, labels[i] ?? "", v)
    }
  ))));
}
function PartyTab({ activity, update }) {
  const [current = 0, max = 0] = activity.party?.size ?? [];
  const setSize = (c, m) => update({ party: { ...activity.party, size: [c, m] } });
  const num = (v) => Number(v.replace(/\D/g, "")) || 0;
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: gridStyle }, /* @__PURE__ */ BdApi.React.createElement(
    TextWithLabel,
    {
      label: "Current size",
      value: current ? String(current) : "",
      onChange: (v) => setSize(num(v), max)
    }
  ), /* @__PURE__ */ BdApi.React.createElement(
    TextWithLabel,
    {
      label: "Max size",
      value: max ? String(max) : "",
      onChange: (v) => setSize(current, num(v))
    }
  ), /* @__PURE__ */ BdApi.React.createElement(
    TextWithLabel,
    {
      label: "Party ID",
      value: activity.party?.id,
      onChange: (id) => update({ party: { ...activity.party, id } })
    }
  ), /* @__PURE__ */ BdApi.React.createElement(
    TextWithLabel,
    {
      label: "Start timestamp (ms)",
      value: activity.timestamps?.start,
      onChange: (start) => update({ timestamps: { ...activity.timestamps, start } })
    }
  ), /* @__PURE__ */ BdApi.React.createElement(Section, { label: "Flags" }, FLAG_OPTIONS.map(({ label, bit }) => /* @__PURE__ */ BdApi.React.createElement(
    Chip,
    {
      key: label,
      label,
      on: ((activity.flags ?? 0) & bit) !== 0,
      onClick: () => update({ flags: (activity.flags ?? 0) ^ bit })
    }
  ))));
}
function AdvancedTab({ activity, update }) {
  const platforms = activity.supported_platforms ?? [];
  const togglePlatform = (p) => update({
    supported_platforms: platforms.includes(p) ? platforms.filter((x) => x !== p) : [...platforms, p]
  });
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: gridStyle }, /* @__PURE__ */ BdApi.React.createElement(
    TextWithLabel,
    {
      label: "Application ID",
      value: activity.application_id,
      onChange: (application_id) => update({ application_id })
    }
  ), /* @__PURE__ */ BdApi.React.createElement(TextWithLabel, { label: "Platform", value: activity.platform, onChange: (platform) => update({ platform }) }), /* @__PURE__ */ BdApi.React.createElement(
    TextWithLabel,
    {
      label: "Join secret",
      value: activity.secrets?.join,
      onChange: (join) => update({ secrets: { ...activity.secrets, join } })
    }
  ), /* @__PURE__ */ BdApi.React.createElement(
    TextWithLabel,
    {
      label: "Match secret",
      value: activity.secrets?.match,
      onChange: (match) => update({ secrets: { ...activity.secrets, match } })
    }
  ), /* @__PURE__ */ BdApi.React.createElement("div", { style: { gridColumn: "1 / -1" } }, /* @__PURE__ */ BdApi.React.createElement(
    TextWithLabel,
    {
      label: "Invite cover image",
      value: activity.assets?.invite_cover_image,
      onChange: (v) => update({ assets: { ...activity.assets, invite_cover_image: v } })
    }
  )), /* @__PURE__ */ BdApi.React.createElement(Section, { label: "Show in status" }, STATUS_DISPLAY.map(({ label, value }) => /* @__PURE__ */ BdApi.React.createElement(
    Chip,
    {
      key: label,
      label,
      on: activity.status_display_type === value,
      onClick: () => update({ status_display_type: value })
    }
  ))), /* @__PURE__ */ BdApi.React.createElement(Section, { label: "Supported platforms" }, PLATFORM_OPTIONS.map((p) => /* @__PURE__ */ BdApi.React.createElement(Chip, { key: p, label: p, on: platforms.includes(p), onClick: () => togglePlatform(p) }))), /* @__PURE__ */ BdApi.React.createElement(Section, { label: "Activity Type", value: activity.type }, Object.entries(TYPE_LABELS).map(([type, label]) => /* @__PURE__ */ BdApi.React.createElement(
    Chip,
    {
      key: type,
      label,
      on: activity.type === Number(type),
      onClick: () => update({ type: Number(type) })
    }
  ))));
}
function Tab({ label, selected, onClick }) {
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      role: "tab",
      "aria-selected": selected,
      tabIndex: 0,
      onClick,
      style: {
        padding: "8px 12px",
        fontSize: "14px",
        fontWeight: 600,
        borderRadius: "4px",
        cursor: "pointer",
        color: selected ? "var(--text-normal)" : "var(--text-muted)",
        backgroundColor: selected ? "var(--background-mod-strong)" : "var(--background-mod-low)"
      }
    },
    label
  );
}
function Tabs({ tabs, selected, onSelect }) {
  return /* @__PURE__ */ BdApi.React.createElement("div", { role: "tablist", style: { display: "flex", gap: 8, flexWrap: "wrap" } }, tabs.map((tab, index) => /* @__PURE__ */ BdApi.React.createElement(Tab, { key: tab, label: tab, selected: index === selected, onClick: () => onSelect(index) })));
}
function TextWithLabel({ label, value, onChange, placeholder }) {
  return /* @__PURE__ */ BdApi.React.createElement(Flex, { direction: "bd-flex-vertical", align: "bd-flex-align-stretch", style: { gap: 4 } }, /* @__PURE__ */ BdApi.React.createElement("div", { style: { fontSize: "12px", fontWeight: 600, color: "var(--text-normal)" } }, label), /* @__PURE__ */ BdApi.React.createElement(TextInput, { value: value ?? "", placeholder, onChange }));
}
function TextTab({ activity, update }) {
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12
  } }, /* @__PURE__ */ BdApi.React.createElement("div", { style: { gridColumn: "1 / -1" } }, /* @__PURE__ */ BdApi.React.createElement(TextWithLabel, { label: "Name", value: activity.name, onChange: (name) => update({ name }) })), /* @__PURE__ */ BdApi.React.createElement(TextWithLabel, { label: "Details", value: activity.details, onChange: (details) => update({ details }) }), /* @__PURE__ */ BdApi.React.createElement(
    TextWithLabel,
    {
      label: "Details URL",
      value: activity.details_url,
      onChange: (details_url) => update({ details_url })
    }
  ), /* @__PURE__ */ BdApi.React.createElement(TextWithLabel, { label: "State", value: activity.state, onChange: (state) => update({ state }) }), /* @__PURE__ */ BdApi.React.createElement(TextWithLabel, { label: "State URL", value: activity.state_url, onChange: (state_url) => update({ state_url }) }));
}
function ImageTab({ activity, update }) {
  const setAsset = (key, value) => update({ assets: { ...activity.assets, [key]: value } });
  return /* @__PURE__ */ BdApi.React.createElement(Flex, { direction: "bd-flex-vertical", align: "bd-flex-align-stretch", style: { gap: 12 } }, /* @__PURE__ */ BdApi.React.createElement(
    TextWithLabel,
    {
      label: "Large image",
      value: activity.assets?.large_image,
      onChange: (v) => setAsset("large_image", v)
    }
  ), /* @__PURE__ */ BdApi.React.createElement(
    TextWithLabel,
    {
      label: "Large text",
      value: activity.assets?.large_text,
      onChange: (v) => setAsset("large_text", v)
    }
  ), /* @__PURE__ */ BdApi.React.createElement(
    TextWithLabel,
    {
      label: "Small image",
      value: activity.assets?.small_image,
      onChange: (v) => setAsset("small_image", v)
    }
  ), /* @__PURE__ */ BdApi.React.createElement(
    TextWithLabel,
    {
      label: "Small text",
      value: activity.assets?.small_text,
      onChange: (v) => setAsset("small_text", v)
    }
  ));
}
var TAB_NAMES = ["Text", "Image", "Buttons", "Party", "Advanced"];
var IMAGE_ID = /^\d{17,20}$/;
async function resolveAssetUrl(appId, image) {
  if (!image) return null;
  if (/^https?:\/\//.test(image)) return image;
  if (image.startsWith("mp:")) return `https://media.discordapp.net/${image.slice(3)}`;
  if (!appId) return null;
  const [resolved] = await AssetHelpers.getAsset(appId, [image, void 0]).catch(() => null) ?? [];
  const value = resolved ?? (IMAGE_ID.test(image) ? image : null);
  if (!value) return null;
  if (/^https?:\/\//.test(value)) return value;
  if (IMAGE_ID.test(value)) return `https://cdn.discordapp.com/app-assets/${appId}/${value}.png`;
  return null;
}
function useAssetUrl(appId, image) {
  const [url, setUrl] = React2.useState(null);
  React2.useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(
      () => resolveAssetUrl(appId, image).then((u) => !cancelled && setUrl(u)),
      300
    );
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [appId, image]);
  return url;
}
function EditModal({ index, props }) {
  const activities = _data.use("activities");
  const [draft, setDraft] = React2.useState(() => activities[index]);
  const [selected, setSelected] = React2.useState(0);
  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const largeUrl = useAssetUrl(draft.application_id, draft.assets?.large_image);
  const smallUrl = useAssetUrl(draft.application_id, draft.assets?.small_image);
  const app = Stores2.ApplicationStore.getApplication(draft.application_id);
  const iconUrl = app?.icon ? `https://cdn.discordapp.com/app-icons/${app.id}/${app.icon}.png?size=240` : null;
  const previewUrl = largeUrl ?? smallUrl ?? iconUrl;
  return /* @__PURE__ */ BdApi.React.createElement(Modal, { ...props, title: "Edit Activity", size: "bd-modal-large", actions: [
    {
      label: "Save",
      color: "bd-button-color-brand",
      closeOnClick: true,
      onClick: () => {
        _data.set("activities", activities.map((a, i) => i === index ? draft : a));
        if (draft.enabled) setActivity(draft);
      }
    },
    {
      label: "Delete",
      color: "bd-button-color-red",
      closeOnClick: true,
      onClick: () => _data.set("activities", activities.filter((_2, i) => i !== index))
    }
  ] }, /* @__PURE__ */ BdApi.React.createElement(Flex, { direction: "bd-flex-vertical", align: "bd-flex-align-stretch", style: { gap: 16 } }, /* @__PURE__ */ BdApi.React.createElement(Flex, { direction: "bd-flex-vertical", align: "bd-flex-align-stretch", style: { gap: 8 } }, /* @__PURE__ */ BdApi.React.createElement(PreviewLabel, null, "Live Preview"), /* @__PURE__ */ BdApi.React.createElement(ApplicationBackgroundPreview, null, /* @__PURE__ */ BdApi.React.createElement(
    ApplicationPreviewImage,
    {
      style: {
        backgroundImage: previewUrl ? `url(${previewUrl})` : void 0,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }
    }
  ), /* @__PURE__ */ BdApi.React.createElement(ApplicationPreviewText, null, /* @__PURE__ */ BdApi.React.createElement(ApplicationName, null, draft.name), /* @__PURE__ */ BdApi.React.createElement(ApplicationDetails, null, draft.details), /* @__PURE__ */ BdApi.React.createElement(ApplicationDetails, null, TYPE_LABELS[draft.type] ?? "Custom")))), /* @__PURE__ */ BdApi.React.createElement(Tabs, { tabs: TAB_NAMES, selected, onSelect: setSelected }), selected === 0 && /* @__PURE__ */ BdApi.React.createElement(TextTab, { activity: draft, update }), selected === 1 && /* @__PURE__ */ BdApi.React.createElement(ImageTab, { activity: draft, update }), selected === 2 && /* @__PURE__ */ BdApi.React.createElement(ButtonsTab, { activity: draft, update }), selected === 3 && /* @__PURE__ */ BdApi.React.createElement(PartyTab, { activity: draft, update }), selected === 4 && /* @__PURE__ */ BdApi.React.createElement(AdvancedTab, { activity: draft, update })), /* @__PURE__ */ BdApi.React.createElement("div", { style: { height: 16 } }));
}
async function exportActivities(activities) {
  try {
    await navigator.clipboard.writeText(JSON.stringify({ version: 1, activities }));
  } catch (e) {
    Logger.log("Export failed", e);
  }
}
async function importActivities(existing) {
  try {
    const parsed = JSON.parse(await DiscordNative.clipboard.read());
    const list = Array.isArray(parsed) ? parsed : parsed?.activities;
    if (!Array.isArray(list)) return;
    const imported = list.filter((a) => a && typeof a === "object" && typeof a.name === "string").map((a) => ({ ...a, id: crypto.randomUUID(), enabled: false }));
    if (imported.length) _data.set("activities", [...existing, ...imported]);
  } catch (e) {
    Logger.log("Import failed", e);
  }
}
function SettingsPanel() {
  const activities = _data.use("activities");
  const update = (index, patch) => _data.set("activities", activities.map((a, i) => i === index ? { ...a, ...patch } : a));
  return /* @__PURE__ */ BdApi.React.createElement(BdApi.React.Fragment, null, /* @__PURE__ */ BdApi.React.createElement(SettingGroup, { name: "Settings", id: "cheese", collapsible: true, shown: false }, /* @__PURE__ */ BdApi.React.createElement(
    SettingItem,
    {
      name: "Startup",
      note: "Start rich presence on plugin startup\n\nIf this is disabled, you'll need to manually enable it each time",
      id: "startup"
    },
    /* @__PURE__ */ BdApi.React.createElement(
      SwitchInput,
      {
        value: _data.get("settings").startup,
        onChange: (v) => _data.set("settings", { startup: v })
      }
    )
  )), activities.map((activity, index) => /* @__PURE__ */ BdApi.React.createElement(ApplicationBackground, { key: activity.id }, /* @__PURE__ */ BdApi.React.createElement(
    Flex,
    {
      direction: "bd-flex-horizontal",
      justify: "bd-flex-justify-between",
      align: "bd-flex-align-center"
    },
    /* @__PURE__ */ BdApi.React.createElement(ApplicationName, null, activity.name),
    /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" } }, /* @__PURE__ */ BdApi.React.createElement(
      Button,
      {
        size: "bd-button-small",
        onClick: () => ModalActions.openModal((props) => /* @__PURE__ */ BdApi.React.createElement(
          EditModal,
          {
            props,
            index
          }
        ))
      },
      "Edit"
    ), /* @__PURE__ */ BdApi.React.createElement(ApplicationDetails, null, TYPE_LABELS[activity.type] ?? "Custom"), /* @__PURE__ */ BdApi.React.createElement(
      SwitchInput,
      {
        value: activity.enabled ?? false,
        onChange: (value) => {
          update(index, { enabled: value });
          setActivity(value ? { ...activity, enabled: true } : null);
        }
      }
    ))
  ))), /* @__PURE__ */ BdApi.React.createElement(
    Flex,
    {
      direction: "bd-flex-horizontal",
      justify: "bd-flex-justify-center",
      align: "bd-flex-align-center",
      style: { gap: 8, marginBottom: 12 }
    },
    /* @__PURE__ */ BdApi.React.createElement(Button, { size: "bd-button-small", onClick: () => importActivities(activities) }, "Import"),
    /* @__PURE__ */ BdApi.React.createElement(Button, { size: "bd-button-small", onClick: () => exportActivities(activities) }, "Export"),
    /* @__PURE__ */ BdApi.React.createElement(Button, { size: "bd-button-small", onClick: () => {
      _data.push("activities", {
        id: crypto.randomUUID(),
        name: "New Activity",
        type: 0 /* PLAYING */,
        application_id: "379286085710381999",
        platform: "desktop",
        enabled: false
      });
    } }, "Add New")
  ), /* @__PURE__ */ BdApi.React.createElement(ApplicationDetails, null, 'This pulls the activities from your clipboard and adds them to the list. Make sure the clipboard contains a valid JSON array of activities or an object with an "activities" property.'));
}
var _ = class {
  start() {
    ChangeLog();
    _data.get("settings").startup && setActivity(Object.values(_data.get("activities")).find((a) => a.enabled) ?? null);
  }
  stop() {
    setActivity(null);
  }
  getSettingsPanel() {
    return /* @__PURE__ */ BdApi.React.createElement(SettingsPanel, null);
  }
};
