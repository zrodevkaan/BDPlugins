/**
 * @name BetterReactions
 * @description Enhanced reactions with better styling, animations, and user avatars
 * @author Kaan
 * @version 2.4.0
 * @keyframes pulse {
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

// src/BetterReactions/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => BetterReactions
});
module.exports = __toCommonJS(index_exports);
var { Webpack, Patcher, DOM, React } = new BdApi("BetterReactions");
var Reactions = Webpack.getByPrototypeKeys("renderReactions", { searchExports: true });
var useStateFromStores = Webpack.getByStrings("useStateFromStores", { searchExports: true });
var MessageStore = Webpack.getStore("MessageStore");
var MessageReactionsStore = Webpack.getStore("MessageReactionsStore");
var UserStore = Webpack.getStore("UserStore");
var ReactionRenderer = ({ message, channel }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [fullReactions, setFullReactions] = React.useState({});
  const [hasLoadedOnce, setHasLoadedOnce] = React.useState(false);
  const messageReactions = useStateFromStores(
    [MessageStore],
    () => {
      const msg = MessageStore.getMessage(channel.id, message.id);
      return msg?.reactions || {};
    }
  );
  const totalReactionCount = React.useMemo(
    () => Object.values(messageReactions).reduce((sum, reaction) => sum + reaction.count, 0),
    [messageReactions]
  );
  const shouldFetchOnHover = totalReactionCount >= 5;
  React.useEffect(() => {
    const loadUserData = () => {
      if (!shouldFetchOnHover || isHovered || hasLoadedOnce) {
        const reactionUsersMap = {};
        for (const reaction of Object.values(messageReactions)) {
          const emoji = reaction.emoji;
          const users = MessageReactionsStore.getReactions(channel.id, message.id, emoji);
          console.log(reaction);
          reactionUsersMap[emoji.name] = Array.from(users?.values() || []);
        }
        setFullReactions(reactionUsersMap);
        if (!hasLoadedOnce) setHasLoadedOnce(true);
      }
    };
    const timeoutId = setTimeout(loadUserData, 50);
    return () => clearTimeout(timeoutId);
  }, [isHovered, shouldFetchOnHover, messageReactions, hasLoadedOnce, channel.id, message.id]);
  const formattedReactions = React.useMemo(
    () => Object.values(messageReactions),
    [messageReactions]
  );
  if (formattedReactions.length === 0) return null;
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      key: `reactions-${message.id}`,
      className: "better-reactions-container",
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false)
    },
    formattedReactions.map((reaction, index) => {
      const emojiKey = reaction.emoji.id || reaction.emoji.name;
      const isUserReacted = reaction.me;
      const reactionUsers = fullReactions[reaction.emoji.name] || [];
      const currentUser = UserStore.getCurrentUser();
      let displayUsers = reactionUsers.slice(0, 4);
      const hasUserData = reactionUsers.length > 0;
      if (isUserReacted && reactionUsers.length > 0 && currentUser && !reactionUsers.some((u) => u.id === currentUser.id)) {
        displayUsers = [currentUser, ...displayUsers].slice(0, 4);
      }
      const hasMoreUsers = reactionUsers.length > 4;
      return /* @__PURE__ */ BdApi.React.createElement(
        "div",
        {
          key: `${message.id}-${emojiKey}-${index}`,
          className: `better-reaction ${isUserReacted ? "user-reacted" : ""}`,
          onClick: () => {
          }
        },
        /* @__PURE__ */ BdApi.React.createElement("span", { className: "emoji" }, reaction.emoji.name),
        hasUserData && /* @__PURE__ */ BdApi.React.createElement(
          "div",
          {
            key: `avatars-${message.id}-${emojiKey}-${displayUsers.length}`,
            className: "reaction-avatars"
          },
          displayUsers.map((user, userIndex) => {
            const userData = UserStore.getUser(user.id) || user;
            const avatarUrl = userData?.getAvatarURL?.({ size: 24, animated: true });
            return /* @__PURE__ */ BdApi.React.createElement(
              "div",
              {
                key: `${user.id}-${userIndex}`,
                className: "reaction-avatar",
                style: {
                  backgroundImage: avatarUrl ? `url(${avatarUrl})` : "none",
                  backgroundColor: !avatarUrl ? "var(--background-secondary)" : "transparent"
                },
                title: userData?.username || userData?.globalName || "Unknown User"
              }
            );
          }),
          hasMoreUsers && /* @__PURE__ */ BdApi.React.createElement(
            "div",
            {
              key: `more-${reactionUsers.length}`,
              className: "reaction-avatar more-users",
              title: `+${reactionUsers.length - 4} more`
            },
            /* @__PURE__ */ BdApi.React.createElement("span", { className: "more-count" }, "+", reactionUsers.length - 4)
          )
        ),
        shouldFetchOnHover && !hasUserData && !isHovered && /* @__PURE__ */ BdApi.React.createElement("div", { className: "reaction-loading" }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "loading-placeholder" })),
        /* @__PURE__ */ BdApi.React.createElement("span", { className: "reaction-count" }, reaction.count)
      );
    })
  );
};
var styles = `
.better-reactions-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
    border: 0;
    font-family: inherit;
    font-size: 100%;
    font-style: inherit;
    font-weight: inherit;
    margin: 0;
    padding: 0;
    vertical-align: baseline;
}

.better-reaction {
    display: flex;
    align-items: center;
    background-color: var(--background-secondary);
    border: 1px solid var(--background-modifier-accent);
    border-radius: 8px;
    padding: 2px 6px;
    cursor: pointer;
    gap: 6px;
    min-height: 28px;
    transition: background-color 0.15s ease;
}

.better-reaction.user-reacted {
    background-color: var(--background-primary);
    border-color: var(--brand-500);
}

.better-reaction:hover {
    background-color: var(--background-modifier-hover);
}

.reaction-avatars {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    position: relative;
}

.reaction-loading {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.loading-placeholder {
    width: 18px;
    height: 18px;
    background-color: var(--background-tertiary);
    border-radius: 50%;
    opacity: 0.6;
    animation: pulse 1.5s infinite ease-in-out;
}

.emoji {
    font-size: 16px;
    display: flex;
    align-items: center;
}

.reaction-avatar {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    margin-left: -6px;
    z-index: 1;
    box-shadow:
        0 0 0 2px var(--background-secondary),
        0 0 1px rgba(0, 0, 0, 0.2);
    transition: opacity 0.15s ease;
    opacity: 1;
}

.reaction-avatar:first-child {
    margin-left: 0;
    z-index: 0;
}

.reaction-avatar:nth-child(2) { z-index: 1; }
.reaction-avatar:nth-child(3) { z-index: 2; }
.reaction-avatar:nth-child(4) { z-index: 3; }

.reaction-avatar.more-users {
    background-color: var(--background-secondary-alt);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: var(--text-default);
    font-weight: 600;
    z-index: 0;
}

.reaction-avatar.more-users:hover {
    background-color: var(--background-modifier-hover);
}

.reaction-count {
    margin-left: auto;
    font-weight: 500;
    color: var(--text-default);
    font-size: 13px;
    min-width: 12px;
    text-align: center;
}

@keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
}
`;
var BetterReactions = class {
  start() {
    DOM.addStyle("betterReactionsStyles", styles);
    Patcher.after(Reactions.prototype, "renderReactions", (thisObject, args, returnValue) => {
      return /* @__PURE__ */ BdApi.React.createElement(ReactionRenderer, { message: returnValue.props.message, channel: returnValue.props.channel });
    });
  }
  stop() {
    DOM.removeStyle("betterReactionsStyles");
    Patcher.unpatchAll();
  }
};
