/**
 * @name Timezones
 * @author Kaan
 * @version 2.0.0
 * @description Allows you to display a local timezone you set for a user.
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

// src/Timezones/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Timezones
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
var ContextMenuHelper = (patches) => {
  const unpatches = [];
  patches.forEach((patch) => {
    const unpatch = ContextMenu.patch(patch.navId, patch.patch);
    unpatches.push(unpatch);
  });
  return () => {
    unpatches.forEach((unpatch) => unpatch());
  };
};

// src/Timezones/index.tsx
var { Patcher, Webpack, Data, Utils, Hooks, ContextMenu: ContextMenu2, Components, React: React2 } = new BdApi("Timezones");
var Banner_3 = Webpack.getBySource(".unsafe_rawColors.PRIMARY_800).hex(),");
var ModalUtils = Webpack.getByKeys("openModal");
var Modal = Webpack.getByKeys("Modal").Modal;
var SearchableSelect = Webpack.getModule(Webpack.Filters.byStrings("SearchableSelect", "fieldProps"), { searchExports: true });
var MessageHeader = Webpack.getModule((x) => String(x.A).includes(".colorRoleId?nul"));
var TimestampHeader = Webpack.getBySource(".SENT_BY_SOCIAL_LAYER_INTEGRATION)?").Ay;
var Selectable = Webpack.getModule(Webpack.Filters.byStrings('data-mana-component":"select'), { searchExports: true });
function getTimezones() {
  const now = /* @__PURE__ */ new Date();
  return Intl.supportedValuesOf("timeZone").map((tz) => ({
    timezone: tz,
    currentTime: now.toLocaleString("en-US", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }),
    offset: new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "short"
    }).formatToParts(now).find((p) => p.type === "timeZoneName")?.value || ""
  }));
}
var UserTimezoneStore = new class UTS extends Utils.Store {
  timezones = Data.load("timezones") || {};
  settings = {
    chatTimezoneDisplay: "CLOCK",
    bannerTimezoneDisplay: "ENABLED",
    timezoneFormat: "12H",
    showSeconds: false,
    showTimezoneAbbreviation: false,
    ...Data.load("settings") || {}
  };
  addTimezone(id, timezoneName) {
    this.timezones[id] = timezoneName;
    Data.save("timezones", this.timezones);
    this.emitChange();
  }
  getTimezone(id) {
    return this.timezones[id];
  }
  removeTimezone(id) {
    delete this.timezones[id];
    Data.save("timezones", this.timezones);
    this.emitChange();
  }
  setTimezoneSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    Data.save("settings", this.settings);
    this.emitChange();
  }
  getTimezoneSettings() {
    return this.settings;
  }
}();
var TimezoneOption = styled.div(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  gap: "8px"
}));
var TimezoneName = styled.span(() => ({
  fontWeight: "500",
  flex: "1"
}));
var TimezoneInfo = styled.span(() => ({
  color: "var(--text-muted)",
  fontSize: "0.875em",
  whiteSpace: "nowrap"
}));
var TimezoneChat = styled.span(() => ({
  color: "var(--chat-text-muted)",
  fontSize: ".75rem",
  display: "inline-flex",
  lineHeight: "1.375rem",
  verticalAlign: "baseline",
  marginLeft: "3px"
}));
var TimezoneText = styled.div(() => {
  return {
    color: "white",
    position: "absolute",
    padding: "5px",
    borderRadius: "5px",
    backgroundColor: "var(--background-base-low)",
    left: "10px",
    top: "10px",
    zIndex: "999",
    textAlign: "center",
    fontWeight: "lighter"
  };
});
var SettingsPanelContainer = styled.div(() => ({
  minHeight: "500px"
}));
var SettingsHeaderGroup = styled.div(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  marginBottom: "8px"
}));
var SettingsSection = styled.div(({ displayType }) => {
  return {
    marginTop: "20px",
    alignItems: "center",
    justifyContent: "space-between",
    display: displayType
  };
});
var Header = styled.span(() => ({
  color: "var(--text-strong)",
  fontFamily: "var(--font-primary)",
  fontSize: "18px",
  fontWeight: "700",
  lineHeight: "1.25"
}));
var HeaderDescription = styled.span({
  color: "var(--text-muted)",
  fontFamily: "var(--font-primary)",
  fontSize: "14px",
  fontWeight: "400",
  lineHeight: "1.4"
});
function getUTCOffset(timezone) {
  const date = /* @__PURE__ */ new Date();
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
  return (tzDate - utcDate) / (1e3 * 60 * 60);
}
function getTimezoneDifference(timezone) {
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localOffset = getUTCOffset(localTimezone);
  const targetOffset = getUTCOffset(timezone);
  const diffHours = targetOffset - localOffset;
  if (diffHours === 0) {
    return "Same timezone";
  } else if (diffHours > 0) {
    return `${diffHours} hour(s) ahead`;
  } else {
    return `${Math.abs(diffHours)} hour(s) behind`;
  }
}
function getCurrentTime(timezone) {
  const settings = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezoneSettings());
  const use24h = settings.timezoneFormat === "24H";
  const includeSeconds = settings.showSeconds;
  const timeString = (/* @__PURE__ */ new Date()).toLocaleString("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    ...includeSeconds && { second: "2-digit" },
    hour12: !use24h
  });
  let formattedTime = timeString;
  if (!use24h) {
    formattedTime = formattedTime.replace(/^0/, "");
  }
  if (settings.showTimezoneAbbreviation) {
    const abbr = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short"
    }).formatToParts(/* @__PURE__ */ new Date()).find((p) => p.type === "timeZoneName")?.value || "";
    return `${formattedTime} ${abbr}`;
  }
  return formattedTime;
}
function Timezone({ user }) {
  const timezone = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezone(user.id));
  const settings = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezoneSettings());
  if (!timezone || settings.bannerTimezoneDisplay === "DISABLED") return null;
  const time = getCurrentTime(timezone);
  return /* @__PURE__ */ BdApi.React.createElement(TimezoneText, { color: "var(--text-default)" }, time);
}
function returnSpoof(timezone, offset, time) {
  return {
    trim() {
      return `${timezone} ${offset} ${time}`;
    },
    getTime() {
      return timezone;
    },
    toString() {
      return this.getTime() + " " + offset;
    }
    // this is what discord is searching for, so to allow timezone and utc offset we need to add both.
  };
}
function TimezoneModal({ user }) {
  const timezone = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezone(user.id));
  const timezones = React2.useMemo(() => getTimezones(), []);
  const node = (timezone2, offset, time) => {
    const timeDiff = getTimezoneDifference(timezone2);
    return /* @__PURE__ */ BdApi.React.createElement(TimezoneOption, null, /* @__PURE__ */ BdApi.React.createElement(TimezoneName, null, timezone2), /* @__PURE__ */ BdApi.React.createElement(TimezoneInfo, null, offset, " \u2022 ", timeDiff));
  };
  const renderTimezone = (tz, offset, time) => {
    return Object.assign(node(tz, offset, time), returnSpoof(tz, offset, time));
  };
  return /* @__PURE__ */ BdApi.React.createElement("div", null, /* @__PURE__ */ BdApi.React.createElement(
    SearchableSelect,
    {
      value: timezone || "Unknown",
      onChange: (e) => UserTimezoneStore.addTimezone(user.id, e),
      options: timezones.map((x) => {
        return {
          label: renderTimezone(x.timezone, x.offset, x.currentTime),
          value: `${x.timezone}`
        };
      })
    }
  ));
}
var Clock = () => /* @__PURE__ */ BdApi.React.createElement("svg", { className: "tz-svg", xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, viewBox: "0 0 24 24" }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "var(--interactive-icon-default)",
    d: "M13 12.175V9q0-.425-.288-.712T12 8t-.712.288T11 9v3.575q0 .2.075.388t.225.337l2.525 2.525q.3.3.713.3t.712-.3q.275-.3.275-.712t-.275-.688zM12 6q.425 0 .713-.288T13 5t-.288-.712T12 4t-.712.288T11 5t.288.713T12 6m6 6q0 .425.288.713T19 13t.713-.288T20 12t-.288-.712T19 11t-.712.288T18 12m-6 6q-.425 0-.712.288T11 19t.288.713T12 20t.713-.288T13 19t-.288-.712T12 18m-6-6q0-.425-.288-.712T5 11t-.712.288T4 12t.288.713T5 13t.713-.288T6 12m6 10q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
  }
));
function ChatClock({ user }) {
  const timezone = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezone(user.id));
  const settings = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezoneSettings());
  const displayMode = settings?.chatTimezoneDisplay ?? "CLOCK";
  const time = getCurrentTime(timezone);
  if (displayMode === "CLOCK") {
    return /* @__PURE__ */ BdApi.React.createElement(Components.Tooltip, { text: time }, (props) => {
      return /* @__PURE__ */ BdApi.React.createElement("div", { ...props, style: { display: "inline-flex", marginLeft: "5px", marginTop: "4px", verticalAlign: "top" } }, /* @__PURE__ */ BdApi.React.createElement(Clock, null));
    });
  }
  if (displayMode === "TEXT") {
    return /* @__PURE__ */ BdApi.React.createElement("span", { className: "tz-text" }, /* @__PURE__ */ BdApi.React.createElement(TimezoneChat, null, time, " \u2022"));
  }
  return null;
}
function TimezoneContextMenu({ user }) {
  const isDisabled = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezone(user.id));
  return /* @__PURE__ */ BdApi.React.createElement(ContextMenu2.Item, { id: "bwah", label: "Timezones" }, /* @__PURE__ */ BdApi.React.createElement(ContextMenu2.Item, { action: () => {
    ModalUtils.openModal((props) => /* @__PURE__ */ BdApi.React.createElement(Modal, { title: `Set Timezone for ${user.username}`, ...props }, /* @__PURE__ */ BdApi.React.createElement(TimezoneModal, { user })));
  }, id: "bwah-1", label: "Set Timezone" }), /* @__PURE__ */ BdApi.React.createElement(ContextMenu2.Item, { action: () => {
    UserTimezoneStore.removeTimezone(user.id);
  }, id: "bwah-2", disabled: !isDisabled, color: "danger", label: "Clear Timezone" }));
}
var Timezones = class {
  unpatchAll;
  modifiedTypes = /* @__PURE__ */ new WeakMap();
  start() {
    Patcher.after(Banner_3, "A", (a, b, res) => {
      return [/* @__PURE__ */ BdApi.React.createElement(Timezone, { user: b[0].user }), res];
    });
    Patcher.after(MessageHeader, "A", (a, args, res) => {
      res.props.children.push(/* @__PURE__ */ BdApi.React.createElement(ChatClock, { user: args[0].message.author }));
    });
    this.unpatchAll = ContextMenuHelper([
      {
        navId: "user-context",
        patch: (res, props) => {
          return res.props.children.push(TimezoneContextMenu({ user: props.user }));
        }
      }
    ]);
  }
  getSettingsPanel() {
    return () => {
      const settings = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezoneSettings());
      return /* @__PURE__ */ BdApi.React.createElement(SettingsPanelContainer, null, /* @__PURE__ */ BdApi.React.createElement(SettingsHeaderGroup, null, /* @__PURE__ */ BdApi.React.createElement(Header, null, "Chat timezone display"), /* @__PURE__ */ BdApi.React.createElement(HeaderDescription, null, "Choose how timezones are shown next to message timestamps.")), /* @__PURE__ */ BdApi.React.createElement(
        Selectable,
        {
          value: settings.chatTimezoneDisplay,
          onSelectionChange: (value) => UserTimezoneStore.setTimezoneSettings({ chatTimezoneDisplay: value }),
          options: ["CLOCK", "TEXT", "NONE"].map((x) => ({
            label: x.toLowerCase(),
            value: x
          }))
        }
      ), /* @__PURE__ */ BdApi.React.createElement(SettingsSection, null, /* @__PURE__ */ BdApi.React.createElement(SettingsHeaderGroup, null, /* @__PURE__ */ BdApi.React.createElement(Header, null, "Banner timezone display"), /* @__PURE__ */ BdApi.React.createElement(HeaderDescription, null, "Show or hide timezone on user profile banners.")), /* @__PURE__ */ BdApi.React.createElement(
        Selectable,
        {
          value: settings.bannerTimezoneDisplay,
          onSelectionChange: (value) => UserTimezoneStore.setTimezoneSettings({ bannerTimezoneDisplay: value }),
          options: ["ENABLED", "DISABLED"].map((x) => ({
            label: x.toLowerCase(),
            value: x
          }))
        }
      )), /* @__PURE__ */ BdApi.React.createElement(SettingsSection, null, /* @__PURE__ */ BdApi.React.createElement(SettingsHeaderGroup, null, /* @__PURE__ */ BdApi.React.createElement(Header, null, "Time format"), /* @__PURE__ */ BdApi.React.createElement(HeaderDescription, null, "Choose between 12-hour (AM/PM) or 24-hour format.")), /* @__PURE__ */ BdApi.React.createElement(
        Selectable,
        {
          value: settings.timezoneFormat,
          onSelectionChange: (value) => UserTimezoneStore.setTimezoneSettings({ timezoneFormat: value }),
          options: [
            { label: "12-hour (2:30 PM)", value: "12H" },
            { label: "24-hour (14:30)", value: "24H" }
          ]
        }
      )), /* @__PURE__ */ BdApi.React.createElement(SettingsSection, { displayType: "flex" }, /* @__PURE__ */ BdApi.React.createElement(SettingsHeaderGroup, null, /* @__PURE__ */ BdApi.React.createElement(Header, null, "Show seconds"), /* @__PURE__ */ BdApi.React.createElement(HeaderDescription, null, "Include seconds in time display (e.g., 2:30:45 PM).")), /* @__PURE__ */ BdApi.React.createElement(
        Components.SwitchInput,
        {
          checked: settings.showSeconds,
          onChange: (value) => UserTimezoneStore.setTimezoneSettings({ showSeconds: value })
        }
      )), /* @__PURE__ */ BdApi.React.createElement(SettingsSection, { displayType: "flex" }, /* @__PURE__ */ BdApi.React.createElement(SettingsHeaderGroup, null, /* @__PURE__ */ BdApi.React.createElement(Header, null, "Show timezone abbreviation"), /* @__PURE__ */ BdApi.React.createElement(HeaderDescription, null, "Show timezone abbreviation after time (e.g., 2:30 PM EST).")), /* @__PURE__ */ BdApi.React.createElement(
        Components.SwitchInput,
        {
          checked: settings.showTimezoneAbbreviation,
          onChange: (value) => UserTimezoneStore.setTimezoneSettings({ showTimezoneAbbreviation: value })
        }
      )));
    };
  }
  stop() {
    const originalType = this.modifiedTypes.get(TimestampHeader);
    if (originalType) {
      TimestampHeader.type = originalType;
    }
    this.modifiedTypes = /* @__PURE__ */ new WeakMap();
    Patcher.unpatchAll();
    this.unpatchAll();
  }
};
