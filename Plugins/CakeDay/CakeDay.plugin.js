/**
 * @name CakeDay
 * @author Kaan
 * @version 1.1.4
 * @description Birfdays in discord
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/CakeDay/CakeDay.plugin.js
 * @invite t3zMgv7Nvb
 * @stable 595897
 * @canary 596000
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

// src/CakeDay/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => CakeDay
});
module.exports = __toCommonJS(index_exports);

// helpers/webpack.ts
var { Webpack } = BdApi;
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
function wpGetByKeys(keys, options) {
  return resolveModule(Webpack.Filters.byKeys(...keys), options);
}
function wpGetBySource(source, options) {
  return resolveModule(Webpack.Filters.bySource(...source), options);
}

// helpers/index.tsx
var { Webpack: Webpack2, React, ContextMenu, Hooks } = BdApi;
var { createElement, forwardRef } = React;
function styledBase(tag, cssOrFn) {
  return (props) => {
    const style = typeof cssOrFn === "function" ? cssOrFn(props) : cssOrFn;
    return React.createElement(tag, { ...props, style: { ...style, ...props.style } });
  };
}
var styled = new Proxy(styledBase, {
  get(target, p) {
    return (cssOrFn) => target(p, cssOrFn);
  }
});
function getKey(module2, fn) {
  for (const key in module2) {
    if (fn(module2[key])) return { key, module: module2 };
  }
}
function findInTree(tree, predicate, { walkable = [], ignore = [], maxDepth = 100 } = {}) {
  function walk(node, depth) {
    if (!node || typeof node !== "object" || depth > maxDepth) return null;
    if (predicate(node)) return node;
    const keys = walkable.length ? walkable.filter((k) => k in node) : Object.keys(node).filter((k) => !ignore.includes(k));
    for (const key of keys) {
      const child = node[key];
      if (Array.isArray(child)) {
        for (const item of child) {
          const result = walk(item, depth + 1);
          if (result !== null) return result;
        }
      } else {
        const result = walk(child, depth + 1);
        if (result !== null) return result;
      }
    }
    return null;
  }
  return walk(tree, 0);
}

// src/CakeDay/index.tsx
var ModalModule = wpGetByKeys(["openModal"]);
var Modal = wpGetByKeys(["Modal"]).Modal;
var { Patcher, Webpack: Webpack3, React: React2, Data, DOM, ContextMenu: ContextMenu2, UI, Net, Utils, Components, Hooks: Hooks2 } = new BdApi("CakeDay");
var Confetti = Webpack3.getBySource("createMultipleConfettiAt:()=>[]");
var ConfettiContext = Object.values(Confetti).find((m) => typeof m === "object");
var Badges = Webpack3.getBySource('action:"PRESS_BADGE"');
var PrivateChannelActions = Webpack3.getByKeys("openPrivateChannel");
var FetchModule = Webpack3.getMangled('type:"USER_PROFILE_FETCH_START"', { fetchUser: Webpack3.Filters.byStrings("USER_UPDATE", "Promise.resolve") });
var velocityConfigs = [
  {
    type: "static",
    value: { x: 120, y: -180, z: 0 },
    uniformVectorValues: false
  },
  {
    type: "static-random",
    minValue: { x: -220, y: -260, z: 0 },
    maxValue: { x: 220, y: -60, z: 0 },
    uniformVectorValues: false
  },
  {
    type: "linear",
    value: { x: 100, y: -150, z: 0 },
    addValue: { x: 0, y: 8, z: 0 },
    uniformVectorValues: false
  },
  {
    type: "linear-random",
    minValue: { x: -150, y: -220, z: 0 },
    maxValue: { x: 150, y: -80, z: 0 },
    minAddValue: { x: -5, y: 6, z: 0 },
    maxAddValue: { x: 5, y: 14, z: 0 },
    uniformVectorValues: false
  },
  {
    type: "oscillating",
    value: { x: 0, y: 0, z: 0 },
    start: { x: -140, y: -140, z: 0 },
    final: { x: 140, y: 140, z: 0 },
    duration: { x: 1400, y: 1400, z: 1400 },
    direction: { x: 1, y: -1, z: 1 },
    easingFunction: (t) => t * (2 - t),
    uniformVectorValues: false
  },
  {
    type: "oscillating-random",
    minValue: { x: -0.4, y: -0.4, z: 0 },
    maxValue: { x: 0.4, y: 0.4, z: 0 },
    minStart: { x: -240, y: -240, z: 0 },
    maxStart: { x: 240, y: 240, z: 0 },
    minFinal: { x: -240, y: -240, z: 0 },
    maxFinal: { x: 240, y: 240, z: 0 },
    minDuration: { x: 900, y: 1400, z: 900 },
    maxDuration: { x: 1800, y: 2600, z: 1800 },
    minDirection: { x: -1, y: -1, z: -1 },
    maxDirection: { x: 1, y: 1, z: 1 },
    easingFunctions: [
      (t) => Math.sin(t * Math.PI * 4) * 0.7 + 0.3,
      (t) => t * t * (3 - 2 * t),
      (t) => Math.sin(t * Math.PI * 3) * 0.4 + 0.6
    ],
    uniformVectorValues: false
  }
];
var CustomConfettiTypes = {
  heart: {
    name: "heart",
    execute: (methods, centerX, centerY, amount) => {
      const scale = 15;
      for (let i = 0; i < amount; i++) {
        const t = i / amount * Math.PI * 2;
        const heartX = 16 * Math.pow(Math.sin(t), 3);
        const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const targetX = centerX + heartX * scale;
        const targetY = centerY + heartY * scale;
        const velocityX = (targetX - centerX) * 0.1;
        const velocityY = (targetY - centerY) * 0.1;
        methods.createMultipleConfettiAt(centerX, centerY, {
          velocity: {
            type: "static",
            value: { x: velocityX, y: velocityY, z: 0 },
            uniformVectorValues: false
          }
        }, 1);
      }
    }
  },
  attempt: {
    name: "DEBUG",
    execute: (methods, centerX, centerY, amount) => {
      const radius = 15;
      for (let i = 0; i < amount; i++) {
        const t = i / amount * Math.PI * 2;
        const circleX = radius * (Math.cos(t) * t / 0.1);
        const circleY = radius * -(Math.sin(t) * t / 0.1);
        methods.createMultipleConfettiAt(centerX, centerY, {
          velocity: {
            type: "static",
            value: {
              x: circleX,
              y: circleY,
              z: 0
            },
            uniformVectorValues: false
          }
        }, 1);
      }
    }
  }
};
function CakeWithConfetti({ data, type, size }) {
  const Methods = React2.use(ConfettiContext);
  const handleMouseOver = (e) => {
    const t = e.currentTarget.getBoundingClientRect();
    const currentType = Settings.get("confettiType") || type || "static-random";
    const centerX = t.left + t.width / 2;
    const centerY = t.top + t.height / 2;
    const amount = Settings.get("confettiAmount") ?? 20;
    if (CustomConfettiTypes[currentType]) {
      CustomConfettiTypes[currentType].execute(Methods, centerX, centerY, amount);
    } else {
      Methods.createMultipleConfettiAt(centerX, centerY, {
        velocity: velocityConfigs.find((x) => x.type === currentType) ?? velocityConfigs[3]
      }, amount);
    }
  };
  return /* @__PURE__ */ BdApi.React.createElement("div", { ...data, onMouseOver: handleMouseOver }, /* @__PURE__ */ BdApi.React.createElement(CakeSVG, { size, ...data }));
}
var CakeSVG = ({ size }) => {
  return /* @__PURE__ */ BdApi.React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size || "16px",
      height: size || "16px",
      viewBox: "0 0 1024 1024",
      className: "icon",
      version: "1.1"
    },
    /* @__PURE__ */ BdApi.React.createElement(
      "path",
      {
        d: "M90.595742 591.482946l597.480328-454.389857S933.474816 275.667884 933.474816 462.01006L90.595742 591.482946z",
        fill: "#EACC53"
      }
    ),
    /* @__PURE__ */ BdApi.React.createElement("path", { d: "M90.595742 591.482946V941.941707L933.474816 812.398264V461.939503z", fill: "#F5AD1A" }),
    /* @__PURE__ */ BdApi.React.createElement(
      "path",
      {
        d: "M90.595742 791.583821v97.298698L933.474816 759.409633v-97.369255zM468.642458 268.894371s-33.79701 127.426721 179.568663 98.215944c78.318749-12.276993 225.642665-16.863226 202.640943-98.215944-12.276993-29.140219-37.395439-53.129746-43.745608-55.458141 6.350169-12.065321 24.765658-45.509543-17.85103-64.489493-24.201199-8.043547-48.8963-11.500861-63.925033-14.393716-15.522635-6.914628-31.680287-30.48081-12.62978-51.789154-21.308344-3.457314-85.16282 2.892855-122.628815 70.204644-12.62978-1.128919-51.224695-2.328395-61.032178 21.872804-7.479088 21.308344-2.892855 37.959898 2.892854 48.33184-19.544408 3.598429-54.046992 21.167229-63.290016 45.721216z",
        fill: "#F5ECDA"
      }
    ),
    /* @__PURE__ */ BdApi.React.createElement(
      "path",
      {
        d: "M667.049955 236.50851m-67.452904 0a67.452904 67.452904 0 1 0 134.905809 0 67.452904 67.452904 0 1 0-134.905809 0Z",
        fill: "#5B2B20"
      }
    ),
    /* @__PURE__ */ BdApi.React.createElement(
      "path",
      {
        d: "M239.330807 519.161579m-17.85103 0a17.85103 17.85103 0 1 0 35.70206 0 17.85103 17.85103 0 1 0-35.70206 0Z",
        fill: "#774621"
      }
    ),
    /* @__PURE__ */ BdApi.React.createElement(
      "path",
      {
        d: "M286.251499 479.790533m-17.85103 0a17.85103 17.85103 0 1 0 35.70206 0 17.85103 17.85103 0 1 0-35.70206 0Z",
        fill: "#774621"
      }
    ),
    /* @__PURE__ */ BdApi.React.createElement(
      "path",
      {
        d: "M494.184249 483.459519m-17.851031 0a17.85103 17.85103 0 1 0 35.702061 0 17.85103 17.85103 0 1 0-35.702061 0Z",
        fill: "#774621"
      }
    )
  );
};
var DataStore = new class CakeStore extends Utils.Store {
  birthdays = Data.load("Birthdays") ?? {};
  get(id) {
    return this.birthdays[id] || {};
  }
  set(id, date) {
    this.birthdays = { ...this.birthdays, [id]: date };
    Data.save("Birthdays", this.birthdays);
    this.emitChange();
  }
  del(id) {
    delete this.birthdays[id];
    Data.save("Birthdays", this.birthdays);
    this.emitChange();
  }
  getAll() {
    return this.birthdays;
  }
}();
var Settings = new class SettingsStore extends Utils.Store {
  settings = Data.load("settings") || {};
  get(key) {
    return this.settings[key];
  }
  set(key, value) {
    this.settings = { ...this.settings, [key]: value };
    Data.save("settings", this.settings);
    this.emitChange();
  }
  del(key) {
    delete this.settings[key];
    Data.save("settings", this.settings);
  }
}();
var TextInput = ({ user, birthday }) => {
  return /* @__PURE__ */ BdApi.React.createElement("div", null, /* @__PURE__ */ BdApi.React.createElement(
    Components.TextInput,
    {
      style: { width: "100%" },
      placeholder: "MM/DD or DD/MM \u2014 e.g. 07/28",
      value: birthday?.date,
      onChange: (e) => {
        birthday.date = e;
        birthday.shouldShow = true;
        DataStore.set(user.id, birthday);
      }
    }
  ));
};
var checkDate = (date) => {
  if (!date) {
    return false;
  }
  const today = /* @__PURE__ */ new Date();
  const birthdayDate = new Date(date);
  if (!isNaN(birthdayDate.getTime())) {
    return today.getDate() === birthdayDate.getDate() && today.getMonth() === birthdayDate.getMonth();
  }
  const dateParts = date.split("/").map(Number);
  if (dateParts.length !== 2 || !dateParts[0] || !dateParts[1]) {
    return false;
  }
  const [firstPart, secondPart] = dateParts;
  const isDDMM = firstPart <= 31 && secondPart <= 12 && today.getDate() === firstPart && today.getMonth() === secondPart - 1;
  const isMMDD = firstPart <= 12 && secondPart <= 31 && today.getDate() === secondPart && today.getMonth() === firstPart - 1;
  return isDDMM || isMMDD;
};
var BirthdayListNotification = ({ extraUsers, showDate }) => {
  const allBirthdays = Hooks2.useStateFromStores([DataStore], () => Object.entries(DataStore.getAll()));
  const users = extraUsers ? extraUsers.map((user) => ({ user, id: user.id, date: "" })) : allBirthdays.map(([id, data]) => ({ user: Webpack3.Stores.UserStore.getUser(id), date: data.date, id })).filter(Boolean);
  const [fetching, setFetching] = React2.useState(() => /* @__PURE__ */ new Set());
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "8px" } }, users.map((data) => data?.user ? /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      key: data.user.id,
      style: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" },
      onClick: (e) => {
        e.stopPropagation();
        PrivateChannelActions.getDMChannel(data.user.id).then((_) => {
          PrivateChannelActions?.openPrivateChannel?.({ recipientIds: data.user.id });
        });
      }
    },
    /* @__PURE__ */ BdApi.React.createElement(
      "img",
      {
        src: data.user.getAvatarURL?.(void 0, 40, true),
        width: 28,
        height: 28,
        style: { borderRadius: "50%", flexShrink: 0 }
      }
    ),
    /* @__PURE__ */ BdApi.React.createElement("span", { style: { fontSize: "14px" } }, data.user.globalName || data.user.username),
    showDate && data.date
  ) : /* @__PURE__ */ BdApi.React.createElement("div", { onClick: () => {
    if (fetching.has(data.id)) return;
    setFetching((prev) => new Set(prev).add(data.id));
    FetchModule.fetchUser(data.id).then(() => {
      setFetching((prev) => {
        const next = new Set(prev);
        next.delete(data.id);
        return next;
      });
    });
  } }, fetching.has(data.id) ? /* @__PURE__ */ BdApi.React.createElement(Components.Spinner, null) : /* @__PURE__ */ BdApi.React.createElement("div", null, "Empty user ", data.id))));
};
function reactSvgToDataUri(Component, props = {}) {
  function serialize(element2) {
    if (!element2) return "";
    if (typeof element2 === "string" || typeof element2 === "number") {
      return String(element2);
    }
    const { type, props: props2 } = element2;
    const attrs = Object.entries(props2 ?? {}).filter(
      ([key, value]) => key !== "children" && value !== void 0 && value !== null && typeof value !== "function"
    ).map(([key, value]) => {
      const attr = key === "className" ? "class" : key;
      return `${attr}="${String(value)}"`;
    }).join(" ");
    const children = Array.isArray(props2.children) ? props2.children.map(serialize).join("") : serialize(props2.children);
    return `<${type}${attrs ? " " + attrs : ""}>${children}</${type}>`;
  }
  const element = Component(props);
  const svg = serialize(element);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
var CakeDay = class {
  interval;
  start() {
    Patcher.after(Badges, "A", (that, [args], res) => {
      const userData = args.displayProfile;
      const birthday = DataStore.get(userData?.userId) || {};
      const isBirthday = checkDate(birthday.date);
      if (isBirthday) {
        res.props.children.unshift(
          /* @__PURE__ */ BdApi.React.createElement(Components.Tooltip, { text: "Cake Day" }, (data) => /* @__PURE__ */ BdApi.React.createElement("div", { ...data }, /* @__PURE__ */ BdApi.React.createElement(CakeWithConfetti, { ...data, type: "static-random" })))
        );
      }
    });
    const NameAndDecorators = wpGetBySource([":null,withDisplayNameStyles:"], { raw: true });
    const ModuleWithKey = getKey(NameAndDecorators.declarations, (x) => String(x).includes(".FRIEND_REQUEST_ACCEPTED})"));
    const MemberList = wpGetBySource(["placement:c.u.MEMBER_LIST"]);
    Patcher.after(MemberList, "A", (that, [args], res) => {
      const Data2 = findInTree(args, (x) => x.user, { walkable: ["props", "children", "avatar"] });
      const user = Data2.user;
      const birthday = DataStore.get(user.id);
      const Location = res.props.children.props.children[1].props.children;
      checkDate(birthday.date) && Location.push(/* @__PURE__ */ BdApi.React.createElement(CakeWithConfetti, null));
    });
    Patcher.after(ModuleWithKey?.module, ModuleWithKey?.key, (a, b, res) => {
      const BeforeChildren = res.props.children({ role: {} });
      const userData = b[0].user;
      const birthday = DataStore.get(userData?.id) || {};
      if (checkDate(birthday.date)) {
        const location = findInTree(BeforeChildren, (x) => x?.name, { walkable: ["props", "children", "name"] });
        const decor = /* @__PURE__ */ BdApi.React.createElement("span", { style: { paddingLeft: "10px" } }, /* @__PURE__ */ BdApi.React.createElement(CakeWithConfetti, null));
        location.decorators = !Array.isArray(location.decorators) ? [decor] : location.decorators.push(decor);
      }
      Patcher.after(res.props, "children", () => BeforeChildren);
      return res;
    });
    Patcher.after(Webpack3.Stores.UserProfileStore, "getUserProfile", (a, b, c) => {
      if (c?.badges && !Object.values(c?.badges).find((x) => x.id == "birthday") && checkDate(DataStore.get(b[0]).date)) {
        c.badges.push({
          id: "birthday",
          name: "Birthday",
          description: /* @__PURE__ */ BdApi.React.createElement(BdApi.React.Fragment, null, /* @__PURE__ */ BdApi.React.createElement("div", null, "Birthday"), /* @__PURE__ */ BdApi.React.createElement(
            "span",
            {
              style: {
                all: "revert",
                fontFamily: "inherit",
                font: "200 14px var(--font-display)",
                color: "var(--interactive-text-default)",
                textTransform: "none",
                letterSpacing: "normal"
              }
            },
            "birthday time!"
          )),
          iconSrc: reactSvgToDataUri(CakeSVG, { size: 16 })
        });
      }
    });
    Webpack3.Stores.UserStore._dispatcher.subscribe("HOUR", this.updateUserThatSomePersonBirthdayIsTodayLmao);
    ContextMenu2.patch("user-context", this.patchUserContextMenu);
    this.interval = setInterval(() => Webpack3.Stores.A._dispatcher.dispatch({ type: "HOUR" }), 60 * 60 * 1e3);
  }
  updateUserThatSomePersonBirthdayIsTodayLmao() {
    const allBirthdays = Object.entries(DataStore.getAll()).filter(([id, data]) => checkDate(data.date));
    if (!allBirthdays.length) return;
    const users = allBirthdays.map(([id]) => Webpack3.Stores.UserStore.getUser(id)).filter(Boolean);
    UI.showNotification({
      id: "cakeday-batch",
      title: users.length > 1 ? `${users.length} Birthdays Today` : "Birthday",
      icon: () => /* @__PURE__ */ BdApi.React.createElement(CakeWithConfetti, { size: "20px" }),
      content: /* @__PURE__ */ BdApi.React.createElement(BirthdayListNotification, { extraUsers: users }),
      type: "success",
      duration: Infinity
    });
  }
  stop() {
    Patcher.unpatchAll();
    Webpack3.Stores.UserStore._dispatcher.unsubscribe("HOUR", this.updateUserThatSomePersonBirthdayIsTodayLmao);
    ContextMenu2.unpatch("user-context", this.patchUserContextMenu);
    clearInterval(this.interval);
  }
  getSettingsPanel() {
    return () => {
      const confettiType = Hooks2.useStateFromStores([Settings], () => Settings.get("confettiType")) || "linear-random";
      const confettiAmount = Hooks2.useStateFromStores([Settings], () => Settings.get("confettiAmount")) || 20;
      const bypassAmount = Hooks2.useStateFromStores([Settings], () => Settings.get("bypassAmount")) || false;
      const allConfettiTypes = [
        ...velocityConfigs.map((config) => ({
          label: config.type.substring(0, 1).toUpperCase() + config.type.substring(1, config.type.length),
          value: config.type
        })),
        ...Object.values(CustomConfettiTypes).map((customType) => ({
          label: customType.name.substring(0, 1).toUpperCase() + customType.name.substring(1, customType.name.length),
          value: customType.name
        }))
      ];
      return /* @__PURE__ */ BdApi.React.createElement("div", null, /* @__PURE__ */ BdApi.React.createElement(Components.SettingGroup, { name: "Confetti Settings" }, /* @__PURE__ */ BdApi.React.createElement(
        Components.SettingItem,
        {
          name: "Confetti Type",
          note: "Changes the behaviour of the confetti when hovering."
        },
        /* @__PURE__ */ BdApi.React.createElement(
          Components.DropdownInput,
          {
            defaultValue: confettiType,
            onChange: (amt) => Settings.set("confettiType", amt),
            options: allConfettiTypes
          }
        )
      ), /* @__PURE__ */ BdApi.React.createElement(
        Components.SettingItem,
        {
          name: "Confetti Amount",
          note: "how much bifday you want....."
        },
        /* @__PURE__ */ BdApi.React.createElement(
          Components.SliderInput,
          {
            min: 0,
            max: bypassAmount ? 1e3 : 100,
            step: [20],
            defaultValue: confettiAmount,
            onChange: (type) => Settings.set("confettiAmount", type)
          }
        )
      ), /* @__PURE__ */ BdApi.React.createElement(
        Components.SettingItem,
        {
          name: "More confett~~~~!!@@!~#@#",
          note: "Enabling this allows you to go from 100 confetti to 1000 confetti on the slider. \nThis can cause lag issues."
        },
        /* @__PURE__ */ BdApi.React.createElement(
          Components.SwitchInput,
          {
            defaultValue: bypassAmount,
            onChange: (val) => Settings.set("bypassAmount", val)
          }
        )
      )), /* @__PURE__ */ BdApi.React.createElement(Components.SettingGroup, { name: "Birthdays" }, /* @__PURE__ */ BdApi.React.createElement(BirthdayListNotification, { showDate: true })));
    };
  }
  patchUserContextMenu = (res, args) => {
    const user = args.user;
    const birthday = DataStore.get(user.id) || {};
    const ButtonGroup = ContextMenu2.buildItem({
      type: "submenu",
      label: "Cake Day",
      iconLeft: CakeSVG,
      items: [
        {
          type: "button",
          label: "Set Date",
          action: () => {
            ModalModule.openModal((props) => /* @__PURE__ */ BdApi.React.createElement(
              Modal,
              {
                ...props,
                title: `Set ${user.globalName ?? user.username}'s birthday`
              },
              /* @__PURE__ */ BdApi.React.createElement(
                TextInput,
                {
                  user,
                  birthday
                }
              )
            ));
          }
        },
        {
          type: "button",
          label: "Remove Date",
          color: "danger",
          disabled: !birthday?.date,
          action: () => {
            DataStore.del(user.id);
          }
        }
      ]
    });
    res.props.children.push(ButtonGroup);
  };
};
