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
  return (/* @__PURE__ */ new Date()).toLocaleString("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
function Timezone({ user }) {
  const timezone = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezone(user.id));
  const time = getCurrentTime(timezone);
  const formattedTime = time ? time.replace(/^0/, "") : "";
  return timezone ? /* @__PURE__ */ BdApi.React.createElement(TimezoneText, { color: "var(--text-default)" }, formattedTime) : null;
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
  };
}
function TimezoneModal({ user }) {
  const timezone = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezone(user.id));
  const [currentTime] = React2.useState(() => /* @__PURE__ */ new Date());
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
var Clock = () => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, viewBox: "0 0 24 24" }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "var(--interactive-icon-default)",
    d: "M13 12.175V9q0-.425-.288-.712T12 8t-.712.288T11 9v3.575q0 .2.075.388t.225.337l2.525 2.525q.3.3.713.3t.712-.3q.275-.3.275-.712t-.275-.688zM12 6q.425 0 .713-.288T13 5t-.288-.712T12 4t-.712.288T11 5t.288.713T12 6m6 6q0 .425.288.713T19 13t.713-.288T20 12t-.288-.712T19 11t-.712.288T18 12m-6 6q-.425 0-.712.288T11 19t.288.713T12 20t.713-.288T13 19t-.288-.712T12 18m-6-6q0-.425-.288-.712T5 11t-.712.288T4 12t.288.713T5 13t.713-.288T6 12m6 10q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
  }
));
function ChatClock({ user }) {
  const timezone = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezone(user.authorId));
  return timezone && /* @__PURE__ */ BdApi.React.createElement(Components.Tooltip, { text: getCurrentTime(timezone) }, (props) => {
    return /* @__PURE__ */ BdApi.React.createElement("div", { ...props, style: { display: "inline-flex", marginLeft: "5px", marginTop: "4px", verticalAlign: "top" } }, /* @__PURE__ */ BdApi.React.createElement(Clock, null));
  });
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
  start() {
    Patcher.after(Banner_3, "A", (a, b, res) => {
      return [/* @__PURE__ */ BdApi.React.createElement(Timezone, { user: b[0].user }), res];
    });
    Patcher.before(MessageHeader, "A", (a, b) => {
      !b[0].isRepliedMessage && b[0].decorations[1].push(/* @__PURE__ */ BdApi.React.createElement(ChatClock, { user: b[0].author }));
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
  stop() {
    Patcher.unpatchAll();
    this.unpatchAll();
  }
};
