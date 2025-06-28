/**
 * @name SidebarDMs
 * @author Kaan
 * @version 1.0.1
 * @description startTyping compiler test
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

// src/SidebarDMs/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var App = new BdApi("SidebarDMs");
var { Patcher, Webpack, Utils } = App;
var AppModule = Webpack.getBySource("notificationCenterVariant", 'location:"Sidebar"');
var PrivateChannelSortStore = Webpack.getStore("PrivateChannelSortStore");
var ChannelStore = Webpack.getStore("ChannelStore");
var UserStore = Webpack.getStore("UserStore");
var PresenceStore = Webpack.getStore("PresenceStore");
var useStateFromStores = Webpack.getModule((m) => m.toString?.().includes("useStateFromStores"), { searchExports: true });
var FriendListModule = Webpack.getBySource("getMaskId():");
function forceUpdateApp() {
  const appMount = document.getElementById("app-mount");
  const reactContainerKey = Object.keys(appMount).find((m) => m.startsWith("__reactContainer$"));
  let container = appMount[reactContainerKey];
  while (!container.stateNode?.isReactComponent) {
    container = container.child;
  }
  const { render } = container.stateNode;
  if (render.toString().includes("null")) return;
  container.stateNode.render = () => null;
  container.stateNode.forceUpdate(() => {
    container.stateNode.render = render;
    container.stateNode.forceUpdate();
  });
}
var convertToDiscord = (id, avatar) => `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=1024`;
var SidebarDMsComponent = () => {
  const privateChannels = useStateFromStores([PrivateChannelSortStore], () => PrivateChannelSortStore.getSortedChannels());
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: {
    bottom: "-60px",
    padding: "15px",
    margin: "10px -5px",
    display: "flex",
    flexDirection: "column",
    gap: "60px"
  } }, privateChannels[1].map((x) => {
    const UserId = ChannelStore.getChannel(x.channelId).recipients[0];
    const User = UserStore.getUser(UserId);
    const presence = User && useStateFromStores([PresenceStore], () => PresenceStore.getStatus(User.id));
    return presence && /* @__PURE__ */ BdApi.React.createElement(
      FriendListModule.qE,
      {
        key: x.channelId,
        status: presence,
        size: "SIZE_24",
        src: convertToDiscord(UserId, User.avatar)
      }
    );
  }));
};
var SidebarDMs = class {
  start() {
    forceUpdateApp();
    Patcher.after(AppModule, "Z", (that, args, res) => {
      res.props.children.splice(1, 0, /* @__PURE__ */ BdApi.React.createElement(SidebarDMsComponent, null));
    });
  }
  stop() {
    Patcher.unpatchAll();
    forceUpdateApp();
  }
};
var index_default = SidebarDMs;
