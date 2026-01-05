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
var { Webpack, Patcher, DOM, React, Hooks, Components, Utils } = new BdApi("BetterReactions");
var { useStateFromStores } = Hooks;
var { Store } = Utils;
var Reactions = Webpack.getByPrototypeKeys("renderReactions", { searchExports: true });
var MessageStore = Webpack.getStore("MessageStore");
var MessageReactionsStore = Webpack.getStore("MessageReactionsStore");
var UserStore = Webpack.getStore("UserStore");
var EmojiHelpers = Webpack.getByKeys("getEmojiURL");
var addReaction = BdApi.Webpack.getByStrings("uaUU/g", { searchExports: true });
var removeReaction = BdApi.Webpack.getByStrings("3l9f6u", { searchExports: true });
function RenderReaction({ reaction, withText, size = 24, offset = 24 }) {
  const img = EmojiHelpers.getEmojiURL({ id: reaction.emoji.id, animated: true, size });
  return reaction.emoji.id == null ? /* @__PURE__ */ BdApi.React.createElement("span", { className: "emoji" }, reaction.emoji.name) : /* @__PURE__ */ BdApi.React.createElement(Components.Tooltip, { text: !withText ? /* @__PURE__ */ BdApi.React.createElement(
    "img",
    {
      src: img,
      alt: reaction.emoji.name
    }
  ) : /* @__PURE__ */ BdApi.React.createElement("div", null, /* @__PURE__ */ BdApi.React.createElement(
    "img",
    {
      src: img,
      alt: reaction.emoji.name
    }
  ), /* @__PURE__ */ BdApi.React.createElement("span", { style: { fontSize: "16px", color: "var(--text-default)" } }, ":", reaction.emoji.name, ":")), position: "top" }, (props) => /* @__PURE__ */ BdApi.React.createElement(
    "img",
    {
      ...props,
      src: img,
      alt: reaction.emoji.name
    }
  ));
}
var ReactionStore = new class ReactionStore2 extends Store {
  displayName = "ReactionStore";
  cachedMessages = /* @__PURE__ */ new Map();
  isLoaded(id) {
    return this.cachedMessages.has(id);
  }
  setIsLoaded(id) {
    this.cachedMessages.set(id, true);
    this.emitChange();
  }
}();
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
  const isLoaded = useStateFromStores([ReactionStore], () => ReactionStore.isLoaded(message.id));
  const totalReactionCount = React.useMemo(
    () => Object.values(messageReactions).reduce((sum, reaction) => sum + reaction.count, 0),
    [messageReactions]
  );
  const shouldFetchOnHover = totalReactionCount >= 5;
  const loadUserData = () => {
    if (!shouldFetchOnHover || isHovered || hasLoadedOnce || isLoaded) {
      const reactionUsersMap = {};
      for (const reaction of Object.values(messageReactions)) {
        const emoji = reaction.emoji;
        const users1 = MessageReactionsStore.getReactions(channel.id, message.id, emoji, 4, 0);
        const users2 = MessageReactionsStore.getReactions(channel.id, message.id, emoji, 4, 1);
        const mergedUsers = new Map([
          ...users1 || /* @__PURE__ */ new Map(),
          ...users2 || /* @__PURE__ */ new Map()
        ]);
        reactionUsersMap[emoji.name] = Array.from(mergedUsers.values());
      }
      setFullReactions(reactionUsersMap);
      ReactionStore.setIsLoaded(message.id);
      if (!hasLoadedOnce) setHasLoadedOnce(true);
    }
  };
  React.useEffect(() => {
    loadUserData();
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
          onClick: () => {
            const isBurst = reaction.burst_count > 0;
            if (isUserReacted) {
              removeReaction({
                channelId: message.channel_id,
                messageId: message.id,
                emoji: reaction.emoji,
                location: "Message"
              });
            } else {
              addReaction(
                channel.id,
                message.id,
                reaction.emoji,
                "Message",
                {
                  burst: isBurst
                }
              );
            }
          },
          className: `better-reaction ${isUserReacted ? "user-reacted" : ""}`
        },
        /* @__PURE__ */ BdApi.React.createElement(RenderReaction, { withText: true, reaction, size: 24, offset: 24 }),
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
                  backgroundColor: !avatarUrl ? "var(--background-base-lower)" : "transparent"
                }
              }
            );
          }),
          hasMoreUsers && /* @__PURE__ */ BdApi.React.createElement(
            "div",
            {
              key: `more-${reactionUsers.length}`,
              className: "reaction-avatar more-users"
            },
            /* @__PURE__ */ BdApi.React.createElement("span", { className: "more-count" }, "+", reactionUsers.length - 4)
          )
        ),
        shouldFetchOnHover && !hasUserData && !isHovered && /* @__PURE__ */ BdApi.React.createElement("div", { className: "reaction-loading" }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "loading-placeholder" })),
        /* @__PURE__ */ BdApi.React.createElement("span", { className: "reaction-count" }, reaction.burst_count + reaction.count)
      );
    })
  );
};
var styles = `
.better-reactions-container {
    display: flex;
    font: inherit;
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
    background-color: var(--background-base-lower);
    border: 1px solid var(--background-modifier-accent);
    border-radius: 8px;
    padding: 2px 6px;
    cursor: pointer;
    gap: 6px;
    font-family: var(--font-primary);
    min-height: 28px;
    transition: background-color 0.15s ease;
}

.better-reaction.user-reacted {
    background-color: var(--background-base-low);
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
    background-color: var(--background-base-lowest);
    border-radius: 50%;
    opacity: 0.6;
    animation: pulse 1.5s infinite ease-in-out;
}

.better-reaction > .emoji {
    font-size: 18px;
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
        0 0 0 2px var(--background-base-low),
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
    background-color: var(--background-base-lower);
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
