/**
 * @name ChannelDMs
 * @author Kaan
 * @version 1.0.0
 * @description Recreates sterns old ChannelDms plugin that a allows you to open DMs from a server channel on the memberlist
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

// src/ChannelDMs/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => ChannelDMs
});
module.exports = __toCommonJS(index_exports);
var { Patcher, Webpack, Utils, React, Components, Hooks } = new BdApi("ChannelDMs");
var { Button } = Components;
var Popout = Webpack.getModule((m) => m?.Animation, { searchExports: true, raw: true }).exports.y;
var MemberItem = Webpack.getBySource("onClickPremiumGuildIcon", "itemProps").Z;
var [TextArea] = Webpack.getBulk({
  filter: Webpack.Filters.byStrings(`"text-input"`),
  searchExports: true
});
var { Stores, modules } = Webpack;
var ChannelComponent = Webpack.getBySource("providedChannel", "showHeaderGuildBreadcrumb")?.Z;
var PrivateChannelHelpers = Webpack.getByKeys("getDMChannelFromUserId");
var AppRoot = Webpack.getModule(Webpack.Filters.bySource("Shakeable"));
var DataStore = new class DataStore2 extends Utils.Store {
  state = "server";
  // friends, server
  channelsOpen = [];
  getState() {
    return this.state;
  }
  setState(state) {
    this.state = state;
    this.emitChange();
  }
  getChannelsOpen() {
    return this.channelsOpen;
  }
  addChannelOpen(id) {
    this.channelsOpen.push(id);
    this.emitChange();
  }
  removeChannel(id) {
    this.channelsOpen = this.channelsOpen.filter((i) => i != id);
    this.emitChange();
  }
  isFriends = () => this.state == "friends";
  isServer = () => this.state == "server";
}();
var MemberList = (() => {
  const {
    id,
    exports
  } = Webpack.getModule(Webpack.Filters.bySource("thin", "none", "fade", "ResizeObserver"), { raw: true });
  const source = modules[id].toString();
  return exports[source.match(new RegExp(`(\\w+):\\(\\)=>${source.match(/let (\w+)=/)[1]}`))[1]];
})();
var PrivateChannelComponent = Webpack.getBySource(".getRecipientId())),", "isMultiUserDM").ZP;
var Dragger = ({ children, onDrag }) => {
  const ref = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const startPos = React.useRef({ x: 0, y: 0 });
  const handleMouseDown = (e) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  };
  React.useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e) => {
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      onDrag?.(dx, dy);
      startPos.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onDrag]);
  return /* @__PURE__ */ BdApi.React.createElement("div", { ref, onMouseDown: handleMouseDown, style: { cursor: isDragging ? "grabbing" : "grab" } }, children);
};
var FriendsElement = () => {
  const IDs = Stores.PrivateChannelSortStore.getSortedChannels()[1];
  const handleClick = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    console.log(id, Stores.ChannelStore.getChannel(id));
    DataStore.addChannelOpen(id);
    return false;
  };
  return IDs.slice(0, 3).map((id) => /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      onClick: (e) => handleClick(e, id.channelId),
      onClickCapture: (e) => handleClick(e, id.channelId),
      onMouseDown: (e) => handleClick(e, id.channelId),
      onMouseDownCapture: (e) => handleClick(e, id.channelId),
      key: id
    },
    /* @__PURE__ */ BdApi.React.createElement(
      PrivateChannelComponent,
      {
        selected: false,
        guild: void 0,
        channel: Stores.ChannelStore.getChannel(id.channelId),
        unread: false,
        mentionCount: 0,
        userCount: 1
      }
    )
  ));
};
var EntireMemberList = ({ org }) => {
  const [isFriends, setState] = React.useState(Hooks.useStateFromStores(DataStore, () => DataStore.getState()));
  const startSetState = (state) => {
    setState(state);
    DataStore.setState(state);
  };
  return /* @__PURE__ */ BdApi.React.createElement(React.Fragment, null, /* @__PURE__ */ BdApi.React.createElement("div", { style: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 8,
    padding: "8px"
  } }, /* @__PURE__ */ BdApi.React.createElement(Button, { onClick: () => startSetState("server") }, "Members"), /* @__PURE__ */ BdApi.React.createElement(Button, { onClick: () => startSetState("friends") }, "DMs")), isFriends == "friends" && /* @__PURE__ */ BdApi.React.createElement("div", { style: { padding: "0 8px 8px 8px" } }, /* @__PURE__ */ BdApi.React.createElement(TextArea, { placeholder: "Find or start a conversation" })), isFriends == "friends" ? /* @__PURE__ */ BdApi.React.createElement(FriendsElement, null) : org);
};
var PopoutMonitor = () => {
  const windows = Hooks.useStateFromStores(
    DataStore,
    () => DataStore.getChannelsOpen().concat()
  );
  const positionsRef = React.useRef({});
  const [, forceRender] = React.useReducer((x) => x + 1, 0);
  return /* @__PURE__ */ BdApi.React.createElement("div", null, windows.map((id) => {
    const pos = positionsRef.current[id] || { x: 0, y: 0 };
    return /* @__PURE__ */ BdApi.React.createElement(
      Dragger,
      {
        key: id,
        onDrag: (dx, dy) => {
          const prev = positionsRef.current[id] || { x: 0, y: 0 };
          positionsRef.current[id] = {
            x: prev.x + dx,
            y: prev.y + dy
          };
          forceRender();
        }
      },
      /* @__PURE__ */ BdApi.React.createElement("div", { style: {
        position: "fixed",
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        width: "500px",
        height: "400px",
        backgroundColor: "var(--background-base-low)",
        border: "1px solid var(--background-modifier-accent)",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 8px 16px rgba(0,0,0,0.24)",
        zIndex: 1e3
      } }, /* @__PURE__ */ BdApi.React.createElement(
        "div",
        {
          onClick: () => {
            DataStore.removeChannel(id);
          },
          style: {
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "20px",
            height: "20px",
            lineHeight: "20px",
            textAlign: "center",
            cursor: "pointer",
            fontWeight: 600,
            borderRadius: "4px",
            background: "var(--background-modifier-hover)",
            zIndex: 1001,
            userSelect: "none"
          }
        },
        "\xD7"
      ), /* @__PURE__ */ BdApi.React.createElement(
        ChannelComponent,
        {
          providedChannel: Stores.ChannelStore.getChannel(id)
        }
      ))
    );
  }));
};
var ChannelDMs = class {
  start() {
    arven.Utils.forceUpdateApp();
    Patcher.after(MemberList, "render", (_, __, res) => {
      const RenderList = res.props.children[0].props.children.props;
      if (__[0].innerAriaLabel == "Members") {
        RenderList.children = /* @__PURE__ */ BdApi.React.createElement(EntireMemberList, { org: RenderList.children });
      }
    });
    Patcher.after(AppRoot.Z, "type", (_, __, tree) => {
      tree.props.children.unshift(/* @__PURE__ */ BdApi.React.createElement(PopoutMonitor, null));
    });
  }
  stop() {
    Patcher.unpatchAll();
  }
};
