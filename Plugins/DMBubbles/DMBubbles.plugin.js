/**
 * @name DMBubbles
 * @author Kaan
 * @version 1.0.0
 * @description Copies Apples iMessage pins
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/DMBubbles/DMBubbles.plugin.js 
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

// src/DMBubbles/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => DMBubbles
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

// src/DMBubbles/index.tsx
var { Patcher, Webpack, React: React2, DOM, Data, Hooks, Utils, ContextMenu: ContextMenu2 } = new BdApi("DMBubbles");
var Module = Webpack.getBySource(".A.CONTACTS_LIST");
var AvatarImg = Webpack.getByStrings("CutoutIcon", "avatarTooltipText", { searchExports: true });
var Colors = Webpack.getByKeys("unsafe_rawColors")?.unsafe_rawColors;
var { Stores } = Webpack;
var FavoritesStore = new class FS extends Utils.Store {
  favorites = {};
  constructor() {
    super();
    this.favorites = Data.load("favorites") || {};
  }
  addFavorite(id) {
    this.favorites[id] = true;
    this.emitChange();
    this.saveFavorites();
  }
  saveFavorites() {
    Data.save("favorites", this.favorites);
  }
  getIds() {
    return Object.keys(this.favorites);
  }
  removeFavorite(id) {
    const changedData = this.favorites;
    delete changedData[id];
    this.favorites = changedData;
    this.emitChange();
    this.saveFavorites();
  }
  isFavorited(id) {
    return Boolean(this.favorites[id]);
  }
}();
var StyledText = styled.div({
  color: "white",
  textAlign: "center",
  marginTop: "4px"
});
var BubbleContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
});
var GridContainer = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  padding: "4px 8px"
});
function Yeah({ id }) {
  const userData = Hooks.useStateFromStores([Stores.UserStore, Stores.PresenceStore, Stores.TypingStore, Stores.SelectedChannelStore], () => {
    const user = Stores.UserStore.getUser(id);
    const status = Stores.PresenceStore.getStatus(id);
    return {
      username: user?.globalName ? user.globalName : user?.username,
      src: `https://cdn.discordapp.com/avatars/${id}/${user.avatar}.webp?size=80`,
      status,
      statusColor: getStatusColor(status),
      isMobile: Stores.PresenceStore.isMobileOnline(id),
      isTyping: Stores.TypingStore.isTyping(id, Stores.SelectedChannelStore.getChannelId()),
      size: "SIZE_40"
    };
  });
  return /* @__PURE__ */ BdApi.React.createElement(BubbleContainer, null, /* @__PURE__ */ BdApi.React.createElement(AvatarImg, { ...userData }), /* @__PURE__ */ BdApi.React.createElement(StyledText, null, userData.username));
}
function PinsManager() {
  const favorites = Hooks.useStateFromStores([FavoritesStore], () => FavoritesStore.getIds());
  return /* @__PURE__ */ BdApi.React.createElement(GridContainer, null, favorites.map((id, index) => {
    return /* @__PURE__ */ BdApi.React.createElement(Yeah, { key: id, id });
  }));
}
function getStatusColor(type) {
  switch (type) {
    case "online":
      return Colors.GREEN_360;
    case "offline":
      return Colors.ROLE_GREY;
    case "idle":
      return Colors.YELLOW_300;
    case "streaming":
      return Colors.TWITCH;
    case "dnd":
      return Colors.RED_400;
    default:
      return Colors.ROLE_GREY;
  }
}
function ContextMenuBubbles({ props }) {
  const user = props.user;
  const isFavorited = Hooks.useStateFromStores([FavoritesStore], () => FavoritesStore.isFavorited(user.id));
  const onAdd = () => {
    isFavorited ? FavoritesStore.removeFavorite(user.id) : FavoritesStore.addFavorite(user.id);
  };
  return /* @__PURE__ */ BdApi.React.createElement(
    ContextMenu2.Item,
    {
      id: "dm-bubbles-parent",
      label: "DM Bubbles"
    },
    /* @__PURE__ */ BdApi.React.createElement(
      ContextMenu2.Item,
      {
        id: "dm-bubbles-toggle",
        label: isFavorited ? "Remove Favorite" : "Add Favorite",
        action: onAdd
      }
    )
  );
}
var DMBubbles = class {
  unpatchAll;
  start() {
    Patcher.after(Module, "A", (_, __, res) => {
      res.props.children.props.children.props.children.push(
        /* @__PURE__ */ BdApi.React.createElement(PinsManager, null)
      );
    });
    this.unpatchAll = ContextMenuHelper([
      {
        navId: "user-context",
        patch: (res, props) => {
          res.props.children.push(ContextMenuBubbles({ props }));
        }
      }
    ]);
  }
  stop() {
    Patcher.unpatchAll();
    this.unpatchAll();
  }
};
