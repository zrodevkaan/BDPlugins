/**
 * @name RoleFilters
 * @author Kaan
 * @version 1.0.0
 * @description Allows you to hide, show and collapse roles!
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

// src/RoleFilters/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => RoleFilters
});
module.exports = __toCommonJS(index_exports);
var { Patcher, Webpack, React, Data, UI, Utils, ContextMenu } = new BdApi("RoleFilters");
var GatewayStore = Webpack.getStore("GatewayConnectionStore");
var GuildRoleStore = Webpack.getStore("GuildRoleStore");
var PresenceStore = Webpack.getStore("PresenceStore");
var TypingStore = Webpack.getStore("TypingStore");
var GuildStore = Webpack.getStore("GuildStore");
var GuildMemberStore = Webpack.getStore("GuildMemberStore");
var UserStore = Webpack.getStore("UserStore");
var UseStateFromStores = Webpack.getModule((m) => m.toString?.().includes("useStateFromStores"), { searchExports: true });
var MemberList = Webpack.getBySource(`.Z.MEMBER_LIST)`, "updateMaxContentFeedRowSeen");
var MemberListItemComponent = Webpack.getBySource("shouldAnimateStatus", "onClickPremiumGuildIcon").Z;
var ChevronIcon = React.memo(({ isExpanded }) => /* @__PURE__ */ BdApi.React.createElement(
  "svg",
  {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    style: {
      transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
      transition: "transform 0.2s ease",
      marginRight: "4px"
    }
  },
  /* @__PURE__ */ BdApi.React.createElement("path", { d: "M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" })
));
var EyeIcon = React.memo(({ isVisible }) => /* @__PURE__ */ BdApi.React.createElement(
  "svg",
  {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    style: {
      opacity: isVisible ? 1 : 0.5,
      marginLeft: "4px"
    }
  },
  isVisible ? /* @__PURE__ */ BdApi.React.createElement(
    "path",
    {
      d: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
    }
  ) : /* @__PURE__ */ BdApi.React.createElement(
    "path",
    {
      d: "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
    }
  )
));
var GuildMemberContextMenu = Webpack.getBySource("2021-07_role_popout", { raw: true });
var MemberItemComponent = React.memo(({ member, user, channel }) => {
  const [selected, setSelected] = React.useState(false);
  const userData = UseStateFromStores([UserStore, PresenceStore, TypingStore], () => {
    return {
      user: UserStore.getUser(user.id),
      presence: PresenceStore.getStatus(user.id) || "offline",
      isMobile: PresenceStore.getState().clientStatuses[user.id]?.mobile || false,
      typing: TypingStore.isTyping(channel.id, user.id) || false,
      activities: PresenceStore.getState().presencesForGuilds?.[user.id]?.[channel.guild_id]?.activities || []
    };
  });
  return /* @__PURE__ */ BdApi.React.createElement("div", { onMouseEnter: () => setSelected(true), onMouseLeave: () => setSelected(false) }, /* @__PURE__ */ BdApi.React.createElement(
    MemberListItemComponent,
    {
      channel,
      guildId: channel.guild_id,
      selected,
      nick: member.nick,
      isMoblie: userData.isMobile,
      activities: userData.activities,
      colorStrings: member?.colorStrings,
      colorString: member.colorString,
      user: userData.user,
      typing: userData.typing,
      status: userData.presence
    }
  ));
}, (prevProps, nextProps) => {
  return prevProps.member.userId === nextProps.member.userId && prevProps.member.nick === nextProps.member.nick && prevProps.channel.id === nextProps.channel.id;
});
var useDataStore = (guildId, roleId) => {
  const [state, setState] = React.useState(() => ({
    isCollapsed: DataStore.isRoleCollapsed(guildId, roleId),
    isHidden: DataStore.isRoleHidden(guildId, roleId),
    settings: DataStore.getSettings()
  }));
  React.useEffect(() => {
    const updateState = () => {
      setState({
        isCollapsed: DataStore.isRoleCollapsed(guildId, roleId),
        isHidden: DataStore.isRoleHidden(guildId, roleId),
        settings: DataStore.getSettings()
      });
    };
    DataStore.addChangeListener(updateState);
    return () => {
      DataStore.removeChangeListener(updateState);
    };
  }, [guildId, roleId]);
  return state;
};
var RoleItemComponent = React.memo(({ members, role, channel }) => {
  const { isCollapsed, isHidden } = useDataStore(channel.guild_id, role.id);
  const membersToRender = React.useMemo(() => {
    const result = [];
    for (let i = 0; i < Math.min(members.length, 50); i++) {
      const member = members[i];
      member && result.push(
        /* @__PURE__ */ BdApi.React.createElement(
          MemberItemComponent,
          {
            member,
            key: member.userId,
            nick: member.nick,
            user: UserStore.getUser(member.userId),
            channel
          }
        )
      );
    }
    return result;
  }, [members, channel]);
  const isItJustTheAtEveryoneRole = role.name === "@everyone";
  const roleData = GuildRoleStore.getRole(channel.guild_id, role.id);
  const handleToggleCollapse = React.useCallback(() => {
    DataStore.toggleRoleCollapse(channel.guild_id, role.id);
  }, [channel.guild_id, role.id]);
  return /* @__PURE__ */ BdApi.React.createElement("div", { key: role.id }, /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      onClick: handleToggleCollapse,
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "var(--text-muted)",
        marginBottom: "8px",
        marginTop: "16px",
        padding: "0 8px",
        cursor: "pointer",
        borderRadius: "4px",
        transition: "background-color 0.2s ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.backgroundColor = "var(--background-modifier-hover)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }
    },
    /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", alignItems: "center" } }, /* @__PURE__ */ BdApi.React.createElement(ChevronIcon, { isExpanded: !isCollapsed }), /* @__PURE__ */ BdApi.React.createElement("h3", { style: {
      fontFamily: "var(--font-primary)",
      fontSize: "14px",
      fontWeight: "400",
      lineHeight: "1.2857142857142858",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "8px"
    } }, roleData?.unicodeEmoji ? /* @__PURE__ */ BdApi.React.createElement("div", null, roleData?.unicodeEmoji) : roleData.icon && /* @__PURE__ */ BdApi.React.createElement(
      "img",
      {
        style: { width: "16px", height: "16px" },
        src: `https://cdn.discordapp.com/role-icons/${roleData.id}/${roleData.icon}.webp?size=16&quality=lossless`
      }
    ) || null, /* @__PURE__ */ BdApi.React.createElement("span", null, !isItJustTheAtEveryoneRole ? role.name : "Others", " - ", members.length)))
  ), !isHidden && !isCollapsed && /* @__PURE__ */ BdApi.React.createElement("div", { style: {
    transition: "opacity 0.2s ease, max-height 0.2s ease",
    overflow: "hidden"
  } }, membersToRender));
});
var InternalStore = class _InternalStore {
  static stores = /* @__PURE__ */ new Set();
  static idSymbol = Symbol("id");
  static id = 0;
  static getStore(name) {
    for (const store of _InternalStore.stores) {
      if (_InternalStore.prototype.getName.call(store) === name) return store;
    }
  }
  static getStoreId(store) {
    return store[_InternalStore.idSymbol];
  }
  constructor() {
    this[_InternalStore.idSymbol] = _InternalStore.id++;
    _InternalStore.stores.add(this);
  }
  initialize() {
  }
  static displayName;
  displayName;
  getName() {
    if (this.displayName) return this.displayName;
    const constructor = this.constructor;
    if (constructor.displayName) return constructor.displayName;
    return constructor.name;
  }
  #listeners = /* @__PURE__ */ new Set();
  addChangeListener(callback) {
    this.#listeners.add(callback);
  }
  removeChangeListener(callback) {
    this.#listeners.delete(callback);
  }
  emit() {
    for (const listener of this.#listeners) {
      listener();
    }
  }
  getClass() {
    return this.constructor;
  }
  getId() {
    return _InternalStore.getStoreId(this);
  }
};
var DataStoreA = class extends InternalStore {
  getSettings() {
    return Data.load("roleFilters") || {
      collapsedRoles: {},
      hiddenRoles: {}
    };
  }
  saveSettings(settings) {
    Data.save("roleFilters", settings);
    this.emit();
  }
  toggleRoleCollapse(guildId, roleId) {
    const settings = this.getSettings();
    if (!settings.collapsedRoles?.[guildId]) {
      settings.collapsedRoles[guildId] = {};
    }
    const newState = !settings.collapsedRoles[guildId][roleId];
    settings.collapsedRoles[guildId][roleId] = newState;
    this.saveSettings(settings);
    return newState;
  }
  isRoleCollapsed(guildId, roleId) {
    const settings = this.getSettings();
    return settings.collapsedRoles[guildId]?.[roleId] || false;
  }
  toggleRoleHidden(guildId, roleId) {
    const settings = this.getSettings();
    if (!settings.hiddenRoles?.[guildId]) {
      settings.hiddenRoles[guildId] = {};
    }
    const newState = !settings.hiddenRoles[guildId][roleId];
    settings.hiddenRoles[guildId][roleId] = newState;
    this.saveSettings(settings);
    return newState;
  }
  isRoleHidden(guildId, roleId) {
    const settings = this.getSettings();
    return settings.hiddenRoles?.[guildId]?.[roleId] || false;
  }
};
var DataStore = new DataStoreA();
var MemberListComponent = React.memo(({ channel }) => {
  const members = UseStateFromStores([GuildMemberStore], () => GuildMemberStore.getMembers(channel.guild_id));
  const [settings, setSettings] = React.useState(() => DataStore.getSettings());
  React.useEffect(() => {
    const updateSettings = () => {
      setSettings(DataStore.getSettings());
    };
    DataStore.addChangeListener(updateSettings);
    return () => {
      DataStore.removeChangeListener(updateSettings);
    };
  }, []);
  const containerRef = React.useRef(null);
  const ROW_HEIGHT = 42;
  const roleGroups = React.useMemo(() => {
    let groups = {};
    for (let index = 0; index < members.length; index++) {
      const member = members[index];
      const roleId = member.hoistRoleId || channel.guild_id;
      const role = GuildRoleStore.getRole(channel.guild_id, roleId);
      if (!groups[role.id]) {
        groups[role.id] = {
          role,
          members: []
        };
      }
      groups[role.id].members.push(member);
    }
    return groups;
  }, [members, channel.guild_id]);
  const sortedRoleGroups = React.useMemo(() => {
    return Object.values(roleGroups).sort((a, b) => b.role.position - a.role.position);
  }, [roleGroups]);
  const reactMembers = React.useMemo(() => {
    const result = [];
    for (let i = 0; i < sortedRoleGroups.length; i++) {
      const roleGroup = sortedRoleGroups[i];
      const memberElements = [];
      const members2 = roleGroup.members;
      for (let i2 = 0; i2 < members2.length; i2++) {
        const member = members2[i2];
        memberElements.push(member);
      }
      result.push(
        /* @__PURE__ */ BdApi.React.createElement("div", { key: roleGroup.role.id, className: "role-group" }, /* @__PURE__ */ BdApi.React.createElement(RoleItemComponent, { members: memberElements, role: roleGroup.role, channel }))
      );
    }
    return result;
  }, [sortedRoleGroups, channel, settings]);
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "container_c8ffbb" }, /* @__PURE__ */ BdApi.React.createElement("aside", { className: "membersWrap_c8ffbb hiddenMembers_c8ffbb" }, /* @__PURE__ */ BdApi.React.createElement("div", { style: { overflow: "scroll", paddingRight: "0px" }, className: "members_c8ffbb thin__99f8c scrollerBase__99f8c fade__99f8c" }, /* @__PURE__ */ BdApi.React.createElement("div", { role: "list", className: "content__99f8c", style: { height: "fit-content" } }, reactMembers))));
}, (prevProps, nextProps) => {
  return prevProps.channel.id === nextProps.channel.id;
});
var RoleFilters = class {
  constructor() {
    this.cachedType = null;
  }
  start() {
    Patcher.after(MemberList, "Z", (_, [__], res) => {
      const org = res.type;
      if (!this.cachedType) {
        this.cachedType = new Proxy(org, {
          apply(target, thisArg, args) {
            const currentProps = args[0];
            const channel = currentProps.channel;
            return [/* @__PURE__ */ BdApi.React.createElement(MemberListComponent, { key: channel.id, channel })];
          }
        });
      }
      res.type = this.cachedType;
    });
  }
  stop() {
    Patcher.unpatchAll();
    this.cachedType = null;
  }
};
