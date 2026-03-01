/**
 * @name CakeDay
 * @author Kaan
 * @version 1.0.0
 * @description Birfdays in discord
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/CakeDay/CakeDay.plugin.js 
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
var { Patcher, Webpack, React, Data, DOM, ContextMenu, UI, Net, Utils, Components } = new BdApi("CakeDay");
var Confetti = Webpack.getBySource("createMultipleConfettiAt:()=>[]");
var ConfettiContext = Object.values(Confetti).find((m) => typeof m === "object");
var Badges = Webpack.getBySource('action:"PRESS_BADGE"');
var UsernameLocation = Webpack.getBySource("isGDMFacepileEnabled", "avatarDecorationSrc");
var velocityConfigs = [
  {
    type: "static",
    value: {
      x: 100,
      y: -50,
      z: 0
    },
    uniformVectorValues: false
  },
  {
    type: "static-random",
    minValue: {
      x: -180,
      y: -180,
      z: 0
    },
    maxValue: {
      x: 180,
      y: 180,
      z: 0
    },
    uniformVectorValues: false
  },
  {
    type: "linear",
    value: {
      x: 100,
      y: -50,
      z: 0
    },
    addValue: {
      x: 10,
      y: 5,
      z: 0
    },
    uniformVectorValues: false
  },
  {
    type: "linear-random",
    minValue: {
      x: 50,
      y: -100,
      z: 0
    },
    maxValue: {
      x: 150,
      y: 0,
      z: 0
    },
    minAddValue: {
      x: 5,
      y: 2,
      z: 0
    },
    maxAddValue: {
      x: 15,
      y: 8,
      z: 0
    },
    uniformVectorValues: false
  },
  {
    type: "oscillating",
    value: {
      x: 0,
      y: 0,
      z: 0
    },
    start: {
      x: -100,
      y: -100,
      z: 0
    },
    final: {
      x: 100,
      y: 100,
      z: 0
    },
    duration: {
      x: 2e3,
      y: 2e3,
      z: 2e3
    },
    direction: {
      x: 1,
      y: 10,
      z: 1
    },
    easingFunction: (t) => t * t,
    uniformVectorValues: false
  },
  {
    type: "oscillating-random",
    minValue: {
      x: 0.2,
      y: 0.2,
      z: 0
    },
    maxValue: {
      x: -1.2,
      y: -1.2,
      z: 0
    },
    minStart: {
      x: 1,
      y: -6,
      z: 0
    },
    maxStart: {
      x: -10,
      y: 10,
      z: 0
    },
    minFinal: {
      x: -10,
      y: 10,
      z: 0
    },
    maxFinal: {
      x: 10,
      y: -10,
      z: 0
    },
    minDuration: {
      x: 3e3,
      y: 3e3,
      z: 3e3
    },
    maxDuration: {
      x: 6e3,
      y: 6e3,
      z: 6e3
    },
    minDirection: {
      x: -0.5,
      y: -0.5,
      z: -0.5
    },
    maxDirection: {
      x: 0.5,
      y: 0.5,
      z: 0.5
    },
    easingFunctions: [
      (t) => Math.sin(t * Math.PI * 4) * 0.7 + 0.3,
      (t) => t * t * (3 - 2 * t),
      (t) => Math.sin(t * Math.PI * 3) * 0.4 + 0.6
    ],
    uniformVectorValues: false
  }
];
function CakeWithConfetti({ data, type }) {
  const Methods = React.use(ConfettiContext);
  const handleMouseOver = (e) => {
    const t = e.currentTarget.getBoundingClientRect();
    const currentType = DataStore?.confettiType || type || "static-random";
    const centerX = t.left + t.width / 2;
    const centerY = t.top + t.height / 2;
    Methods.createMultipleConfettiAt(centerX, centerY, {
      velocity: velocityConfigs.find((x) => x.type === currentType)
    });
  };
  return /* @__PURE__ */ BdApi.React.createElement("div", { ...data, onMouseOver: handleMouseOver }, /* @__PURE__ */ BdApi.React.createElement(CakeSVG, { ...data }));
}
var CakeSVG = () => {
  return /* @__PURE__ */ BdApi.React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16px",
      height: "16px",
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
var DataStore = new Proxy({}, {
  get: (target, key) => {
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
});
var TextInput = ({ user, birthday }) => {
  return /* @__PURE__ */ BdApi.React.createElement("div", null, /* @__PURE__ */ BdApi.React.createElement(
    Components.TextInput,
    {
      placeholder: "Date",
      value: birthday?.date,
      onChange: (e) => {
        birthday.date = e;
        birthday.shouldShow = true;
        const births = DataStore.Birthdays;
        births[user.id] = birthday;
        DataStore.Birthdays = births;
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
var CakeDay = class {
  start() {
    Patcher.after(Badges, "Z", (that, [args], res) => {
      const userData = args.displayProfile;
      const birthday = DataStore.Birthdays[userData?.userId] || {};
      const isBirthday = checkDate(birthday.date);
      if (isBirthday) {
        res.props.children.unshift(
          /* @__PURE__ */ BdApi.React.createElement(Components.Tooltip, { text: "Cake Day" }, (data) => /* @__PURE__ */ BdApi.React.createElement("div", { ...data }, /* @__PURE__ */ BdApi.React.createElement(CakeWithConfetti, { ...data, type: "static-random" })))
        );
      }
    });
    Patcher.after(UsernameLocation, "ZP", (_, __, res) => {
      Patcher.after(res, "type", (_2, __2, res2) => {
        const orig = res2.props.children.props?.children;
        if (!orig) return;
        res2.props.children.props.children = new Proxy(orig, {
          apply(target, thisArg, args) {
            const ret = Reflect.apply(target, thisArg, args);
            const found = Utils.findInTree(ret?.props?.children?.[1]?.props?.children?.[1], (x) => x?.to, { walkable: ["props", "children"] });
            const channel = Webpack.Stores.ChannelStore.getChannel(found.to.split("/").pop());
            const user = Webpack.Stores.UserStore.getUser(channel.recipients[0]);
            const nameProps = found?.children?.props?.name?.props;
            if (checkDate(DataStore.Birthdays[user.id]?.date)) {
              nameProps.children = [/* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", gap: "5px" } }, /* @__PURE__ */ BdApi.React.createElement(
                CakeWithConfetti,
                {
                  type: DataStore?.confettiType || "static-random"
                }
              ), " ", nameProps.children)];
            }
            return [ret];
          }
        });
      });
    });
    ContextMenu.patch("user-context", this.patchUserContextMenu);
  }
  stop() {
    Patcher.unpatchAll();
    ContextMenu.unpatch("user-context", this.patchUserContextMenu);
  }
  patchUserContextMenu = (res, args) => {
    const user = args.user;
    const birthday = DataStore.Birthdays[user.id] || {};
    const ButtonGroup = ContextMenu.buildItem({
      type: "submenu",
      label: "Cake Day",
      iconLeft: CakeSVG,
      items: [
        {
          type: "button",
          label: "Set Date",
          action: () => {
            UI.showConfirmationModal(`Set ${user.username}'s Birthday`, /* @__PURE__ */ BdApi.React.createElement(
              TextInput,
              {
                user,
                birthday
              }
            ));
          }
        },
        {
          type: "button",
          label: "Remove Date",
          color: "danger",
          disabled: !birthday?.date,
          action: () => {
            delete DataStore.Birthdays[user.id];
          }
        }
      ]
    });
    res.props.children.push(ButtonGroup);
  };
};
