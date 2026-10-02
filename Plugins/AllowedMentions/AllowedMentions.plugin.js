/**
 * @name AllowedMentions
 * @author kaan
 * @version 1.0.0
 * @description Allows you to select various mentions like @everyone, @here, users, roles or add flags to the message!
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/AllowedMentions/AllowedMentions.plugin.js
 * @invite t3zMgv7Nvb
 * @stable 619060
 * @canary 619391
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

// src/AllowedMentions/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Plugin
});
module.exports = __toCommonJS(index_exports);

// src/AllowedMentions/shared.tsx
var BetterDiscord = new BdApi("AllowedMentions");
var Buttons = BetterDiscord.Webpack.getBySource("isSubmitButtonEnabled", ".A.getActiveOption(");
var HeaderComponents = BetterDiscord.Webpack.getModule((x) => x.Icon && x.Title);
var Popout = BetterDiscord.Webpack.getModule((m) => m?.Animation, {
  searchExports: true,
  raw: true
})?.exports?.Y;
var MessageActions = BetterDiscord.Webpack.getModule((m) => m._sendMessage);
function MentionSVG() {
  return /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24px", height: "24px", viewBox: "0 0 24 24" }, /* @__PURE__ */ BdApi.React.createElement("path", { fill: "none", stroke: "var(--interactive-icon-default)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12.002V13a2 2 0 1 0 4 0v-1a7 7 0 1 0-4.406 6.502m.406-6.5a3 3 0 1 1 0-.004m0 .004v-.004m0 0V9" }));
}

// src/AllowedMentions/index.tsx
var { ContextMenu, React, Hooks, Webpack, Utils } = BetterDiscord;
var { DraftStore, UserStore, GuildRoleStore, SelectedGuildStore, SelectedChannelStore, MessageStore } = Webpack.Stores;
var ALLOWED_FLAGS = {
  ["Remove Embeds"]: 1 << 2
  // ["Add Embeds"]: 0,
  // the default flag is 0 with image perms I think?
};
var MENTION_GROUP = "allowedmentions-scope";
var REFERENCE_GROUP = "allowedmentions-reference";
var MENTION_OPTIONS = [
  { id: "everyone", label: "@everyone" },
  { id: "none", label: "None" }
];
var DEFAULT_CHANNEL_STATE = {
  selected: "none",
  selectedUsers: /* @__PURE__ */ new Set(),
  selectedRoles: /* @__PURE__ */ new Set(),
  knownUsers: /* @__PURE__ */ new Set(),
  knownRoles: /* @__PURE__ */ new Set(),
  selectedFlag: 0,
  referenceMessageId: null,
  mentionRepliedUser: false
};
var AllowedMentionsStore = new class AllowedMentionsStoreClass extends Utils.Store {
  channelState = /* @__PURE__ */ new Map();
  getState(channelId) {
    return this.channelState.get(channelId) ?? DEFAULT_CHANNEL_STATE;
  }
  updateState(channelId, updates) {
    this.channelState.set(channelId, { ...this.getState(channelId), ...updates });
    this.emitChange();
  }
  setSelected(channelId, selected) {
    this.updateState(channelId, { selected });
  }
  toggleUser(channelId, userId) {
    const state = this.getState(channelId);
    const next = new Set(state.selectedUsers);
    next.has(userId) ? next.delete(userId) : next.add(userId);
    this.updateState(channelId, { selectedUsers: next });
  }
  toggleRole(channelId, roleId) {
    const state = this.getState(channelId);
    const next = new Set(state.selectedRoles);
    next.has(roleId) ? next.delete(roleId) : next.add(roleId);
    this.updateState(channelId, { selectedRoles: next });
  }
  registerMentions(channelId, userIds, roleIds) {
    const state = this.getState(channelId);
    let changed = false;
    const knownUsers = new Set(state.knownUsers);
    const selectedUsers = new Set(state.selectedUsers);
    for (const userId of userIds) {
      if (!knownUsers.has(userId)) {
        knownUsers.add(userId);
        selectedUsers.add(userId);
        changed = true;
      }
    }
    const knownRoles = new Set(state.knownRoles);
    const selectedRoles = new Set(state.selectedRoles);
    for (const roleId of roleIds) {
      if (!knownRoles.has(roleId)) {
        knownRoles.add(roleId);
        selectedRoles.add(roleId);
        changed = true;
      }
    }
    if (changed) {
      this.updateState(channelId, { knownUsers, selectedUsers, knownRoles, selectedRoles });
    }
  }
  clearChannel(channelId) {
    this.channelState.delete(channelId);
    this.emitChange();
  }
  setFlag(channelId, flag) {
    this.updateState(channelId, { selectedFlag: flag });
  }
  setReferenceMessage(channelId, messageId) {
    this.updateState(channelId, { referenceMessageId: messageId });
  }
  toggleMentionRepliedUser(channelId) {
    const state = this.getState(channelId);
    this.updateState(channelId, { mentionRepliedUser: !state.mentionRepliedUser });
  }
}();
function extractUserIds(draft) {
  return [...draft.matchAll(/<@!?(\d+)>/g)].map((m) => m[1]);
}
function extractRoleIds(draft) {
  return [...draft.matchAll(/<@&(\d+)>/g)].map((m) => m[1]);
}
function getAllUsers(draft) {
  const ids = [...new Set(extractUserIds(draft))];
  const users = {};
  for (const id of ids) {
    const user = UserStore.getUser(id);
    if (user) users[user.id] = user;
  }
  return users;
}
function getAllRoles(draft) {
  const ids = [...new Set(extractRoleIds(draft))];
  const guildId = SelectedGuildStore.getGuildId();
  if (!guildId) return [];
  const roles = GuildRoleStore.getManyRoles(guildId, ids) ?? {};
  return Object.values(roles).filter(Boolean);
}
function getRecentMessages(channelId, limit = 10) {
  const list = MessageStore.getMessages(channelId);
  const all = Array.isArray(list) ? list : list?.toArray?.() ?? [];
  return all.slice(-limit).reverse().filter((x) => x.author.id != "1" || x.loggingName);
}
function truncate(text, max = 40) {
  if (!text) return "[no content]";
  return text.length > max ? `${text.slice(0, max)}\u2026` : text;
}
function ContextMenuUserWithIcon({ user }) {
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ BdApi.React.createElement(
    "img",
    {
      style: { borderRadius: "50%", width: "24px", height: "24px" },
      src: user.getAvatarURL(SelectedGuildStore.getGuildId() ?? null, 4096)
    }
  ), /* @__PURE__ */ BdApi.React.createElement("span", null, user.username));
}
function ContextMenuRoleWithIcon({ role }) {
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, role.icon ? /* @__PURE__ */ BdApi.React.createElement(
    "img",
    {
      style: { borderRadius: "50%", width: "24px", height: "24px" },
      src: `https://cdn.discordapp.com/role-icons/${role.id}/${role.icon}.webp?size=4096&quality=lossless`
    }
  ) : /* @__PURE__ */ BdApi.React.createElement("div", { style: {
    width: "18px",
    borderRadius: "1000px",
    height: "18px",
    backgroundColor: role.colorString ?? role.colorStrings.primaryColor
  } }), /* @__PURE__ */ BdApi.React.createElement("span", null, role.name));
}
function ContextMenuMessagePreview({ message }) {
  const author = UserStore.getUser(message.author?.id);
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "2px" } }, /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, author && /* @__PURE__ */ BdApi.React.createElement(
    "img",
    {
      style: { borderRadius: "50%", width: "24px", height: "24px" },
      src: author.getAvatarURL(SelectedGuildStore.getGuildId() ?? null, 4096)
    }
  ), /* @__PURE__ */ BdApi.React.createElement("span", { style: { fontWeight: 600 } }, author?.username ?? "Unknown")), /* @__PURE__ */ BdApi.React.createElement("span", { style: { opacity: 0.7, fontSize: "12px" } }, truncate(message.content)));
}
function CheckMark() {
  return /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24px", height: "24px", viewBox: "0 0 16 16" }, /* @__PURE__ */ BdApi.React.createElement(
    "path",
    {
      fill: "var(--status-online)",
      d: "M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992zm-.92 5.14l.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486z"
    }
  ));
}
function FC({ id }) {
  const [isShifting, setIsShifting] = React.useState(false);
  const ref = React.useRef(null);
  const {
    selected,
    selectedUsers,
    selectedRoles,
    selectedFlag,
    referenceMessageId,
    mentionRepliedUser
  } = Hooks.useStateFromStores(
    [AllowedMentionsStore],
    () => AllowedMentionsStore.getState(id),
    [id]
  );
  const draft = Hooks.useStateFromStores(
    [DraftStore],
    () => DraftStore.getDraft(id, 0) ?? ""
  );
  const recentMessages = Hooks.useStateFromStores(
    [MessageStore],
    () => getRecentMessages(id),
    [id]
  );
  const users = React.useMemo(() => getAllUsers(draft), [draft]);
  const roles = React.useMemo(() => getAllRoles(draft), [draft]);
  React.useEffect(() => {
    AllowedMentionsStore.registerMentions(
      id,
      Object.keys(users),
      roles.map((role) => role.id)
    );
  }, [users, roles, id]);
  return /* @__PURE__ */ BdApi.React.createElement("div", { ref }, /* @__PURE__ */ BdApi.React.createElement(
    Popout,
    {
      targetElementRef: ref,
      position: "top",
      children: (e) => {
        setIsShifting(e.shiftKey);
        return /* @__PURE__ */ BdApi.React.createElement("div", { ...e }, /* @__PURE__ */ BdApi.React.createElement(HeaderComponents.Icon, { icon: () => /* @__PURE__ */ BdApi.React.createElement(MentionSVG, null) }));
      },
      renderPopout: (e) => {
        return /* @__PURE__ */ BdApi.React.createElement("div", { style: { minWidth: "200px" }, ...e }, /* @__PURE__ */ BdApi.React.createElement(ContextMenu.Menu, { navId: "dick-cheeze" }, MENTION_OPTIONS.map((opt) => ContextMenu.buildItem({
          type: "radio",
          group: MENTION_GROUP,
          id: opt.id,
          label: opt.label,
          checked: selected === opt.id,
          action: () => AllowedMentionsStore.setSelected(id, opt.id)
        })), Object.values(users).length > 0 ? /* @__PURE__ */ BdApi.React.createElement(ContextMenu.Group, { label: "Users" }, Object.values(users).map((user) => ContextMenu.buildItem({
          type: "toggle",
          group: `allowedmentions-user-${user.id}`,
          id: user.id,
          label: () => /* @__PURE__ */ BdApi.React.createElement(ContextMenuUserWithIcon, { user }),
          checked: selectedUsers.has(user.id),
          action: () => AllowedMentionsStore.toggleUser(id, user.id)
        }))) : null, roles.length > 0 ? /* @__PURE__ */ BdApi.React.createElement(ContextMenu.Group, { label: "Roles" }, roles.map((role) => ContextMenu.buildItem({
          type: "toggle",
          group: `allowedmentions-role-${role.id}`,
          id: role.id,
          label: () => /* @__PURE__ */ BdApi.React.createElement(ContextMenuRoleWithIcon, { role }),
          checked: selectedRoles.has(role.id),
          action: () => AllowedMentionsStore.toggleRole(id, role.id)
        }))) : null, /* @__PURE__ */ BdApi.React.createElement(ContextMenu.Separator, null), ContextMenu.buildItem({
          type: "submenu",
          ...referenceMessageId && {
            leadingAccessory: {
              type: "icon",
              icon: CheckMark
            }
          },
          label: "Reply to message",
          children: [
            ContextMenu.buildItem({
              type: "radio",
              group: REFERENCE_GROUP,
              label: "None",
              checked: !referenceMessageId,
              action: () => AllowedMentionsStore.setReferenceMessage(id, null)
            }),
            ...recentMessages.map((message) => ContextMenu.buildItem({
              type: "radio",
              group: REFERENCE_GROUP,
              id: message.id,
              label: () => /* @__PURE__ */ BdApi.React.createElement(ContextMenuMessagePreview, { message }),
              checked: referenceMessageId === message.id,
              action: () => AllowedMentionsStore.setReferenceMessage(id, message.id)
            }))
          ]
        }), referenceMessageId && ContextMenu.buildItem({
          type: "toggle",
          label: "Mention on reply",
          checked: mentionRepliedUser,
          action: () => AllowedMentionsStore.toggleMentionRepliedUser(id)
        }), /* @__PURE__ */ BdApi.React.createElement(ContextMenu.Separator, null), Object.entries(ALLOWED_FLAGS).map(([key, value]) => ContextMenu.buildItem({
          type: "radio",
          group: `allowedmentions-flags-${value}`,
          id: value,
          label: key,
          checked: (selectedFlag & value) === value && value !== 0,
          action: () => {
            AllowedMentionsStore.setFlag(id, selectedFlag ^ value);
          }
        }))));
      }
    }
  ));
}
function buildAllowedMentions(state) {
  const users = Array.from(state.selectedUsers);
  const roles = Array.from(state.selectedRoles);
  const allowedMentions = {
    parse: state.selected === "everyone" ? ["everyone"] : []
  };
  if (users.length > 0) allowedMentions.users = users;
  if (roles.length > 0) allowedMentions.roles = roles;
  if (state.referenceMessageId) allowedMentions.replied_user = state.mentionRepliedUser;
  return allowedMentions;
}
var Plugin = class {
  start() {
    BetterDiscord.Patcher.after(Buttons.A, "type", (_, buttonArgs, returnValue) => {
      const [props] = buttonArgs;
      const channelId = props?.channel?.id;
      if (!channelId) return returnValue;
      returnValue.props.children.unshift(/* @__PURE__ */ BdApi.React.createElement(FC, { id: channelId }));
    });
    BetterDiscord.Patcher.before(MessageActions, "_sendMessage", (_, args) => {
      const options = args[2];
      if (!options) return;
      const channelId = SelectedChannelStore.getChannelId();
      const state = AllowedMentionsStore.getState(channelId);
      options.allowedMentions = buildAllowedMentions(state);
      options.flags = state.selectedFlag;
      if (state.referenceMessageId) {
        const message = MessageStore.getMessage(channelId, state.referenceMessageId);
        if (message) {
          options.messageReference = {
            message_id: message.id,
            channel_id: message.channel_id ?? channelId,
            guild_id: SelectedGuildStore.getGuildId() ?? void 0
          };
        }
      }
    });
  }
  stop() {
    BetterDiscord.Patcher.unpatchAll();
  }
};
