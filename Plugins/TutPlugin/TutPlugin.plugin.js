/**
 * @name TutPlugin
 * @author based
 * @version 1.0.0
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/TutPlugin/TutPlugin.plugin.js 
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

// src/TutPlugin/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => stuff
});
module.exports = __toCommonJS(index_exports);
var { Patcher, Hooks, Utils, Webpack } = new BdApi("TutPlugin");
var TestTutorial = {
  comp: {
    title: "Tutorial Test",
    body: "Discords tutorial system is complete booty butt juice-- although this was not intended for client mod users to use it.. It has three different modules for it and you need to use a component which makes this idea kinda annoying to make unless we expose an api for this.",
    isLongText: false
    // no idea what this is.
  },
  config: {
    spacing: 8,
    popoutPosition: "right"
  },
  popoutOffset: {
    x: -50,
    y: 50
  },
  enabled: true
};
var TutorialStoreNew = new class TSN extends Utils.Store {
  data = { "tut-test": TestTutorial };
  addTutorial(name, data) {
    this.data[name] = data;
    this.emitChange();
    return true;
  }
  getTutorial(name) {
    return this.data?.[name];
  }
  getTutorialNames() {
    return Object.keys(this.data);
  }
  shouldShow(name) {
    return this.data[name].enabled;
  }
  disableTutorial(name) {
    this.data[name] = { ...this.data[name], enabled: false };
    this.emitChange();
  }
}();
var TutorialStore = arven.Stores.TutorialIndicatorStore;
var TutorialComponentModule = n(574842);
var TutorialComponent = n(728321).A;
var TutorialConfigs = n(31456);
var TutorialIndicatorShowModule = n(166649).A;
var config = {
  origin: {
    x: 100,
    y: 20
  },
  targetWidth: 0,
  targetHeight: 0,
  offset: {
    x: 0,
    y: 0
  }
};
var openModal = Webpack.getByKeys("openModal");
var Modal = Webpack.getByKeys("Modal").Modal;
function Gargle() {
  const tutData = Hooks.useStateFromStores(TutorialStoreNew, () => TutorialStoreNew.getTutorial("tut-test"));
  return tutData.enabled ? /* @__PURE__ */ BdApi.React.createElement(TutorialComponent, { tutorialId: "tut-test", inlineSpecs: config, position: "right" }, /* @__PURE__ */ BdApi.React.createElement(BdApi.Components.Button, { onClick: () => TutorialStoreNew.disableTutorial("tut-test") }, "Tutorial Component")) : "HAHAHA NO MORE TUTORIAL.. HOPE YOU LEARNED WHAT TO DO.!!>!>>!>!>!>";
}
var stuff = class {
  start() {
    openModal.openModal((props) => {
      return /* @__PURE__ */ BdApi.React.createElement(Modal, { ...props }, /* @__PURE__ */ BdApi.React.createElement(Gargle, null));
    });
    Patcher.instead(TutorialComponentModule, "F", (_this, args, ret) => {
      const tutorialTarget = args[0];
      const hasNewTutorial = TutorialStoreNew.getTutorial(tutorialTarget);
      let data = ret(tutorialTarget);
      if (hasNewTutorial) {
        data = hasNewTutorial.comp;
      }
      return data;
    });
    Patcher.instead(TutorialConfigs, "p", (_this, args, ret) => {
      const tutorialTarget = args[0];
      const hasNewTutorial = TutorialStoreNew.getTutorial(tutorialTarget);
      let data = ret(tutorialTarget);
      if (hasNewTutorial) {
        data = hasNewTutorial.config;
      }
      return data;
    });
    Patcher.instead(TutorialStore, "getData", (_this, args, ret) => {
      const tutorialTarget = args[0];
      const data = ret(tutorialTarget);
      const newData = { ...data };
      TutorialStoreNew.getTutorialNames().forEach((name) => {
        Object.defineProperty(newData, name, {
          value: {
            popoutOffset: TutorialStoreNew.getTutorial(name).popoutOffset
          },
          writable: true,
          enumerable: true,
          configurable: true
        });
      });
      return newData;
    });
    Patcher.instead(TutorialStore, "shouldShow", (_this, args, ret) => {
      return args && TutorialStoreNew.getTutorialNames().includes(args[0]) ? TutorialStoreNew.shouldShow(args[0]) : false;
    });
  }
  stop() {
    Patcher.unpatchAll();
  }
};
