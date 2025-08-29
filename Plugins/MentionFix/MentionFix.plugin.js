/**
 * @name MentionFix
 * @version 1.1.0
 * @description Hate the `@unknown-user` when mentioning someone you've never met? Yeah this fixes that. :>
 * @author Kaan
 */
"use strict";

// src/MentionFix/index.tsx
var { Webpack, Patcher, ReactUtils } = new BdApi("MentionFix");
var [Module, Key] = Webpack.getWithKey(Webpack.Filters.byStrings("viewingChannelId", "parsedUserId"));
var UserStore = Webpack.getStore("UserStore");
var FetchModule = Webpack.getMangled('type:"USER_PROFILE_FETCH_START"', { fetchUser: Webpack.Filters.byStrings("USER_UPDATE", "Promise.resolve") });
var Message = Webpack.getByKeys("interactionSending", "quotedChatMessage").message;
function reRender(selector) {
  const target = document.querySelector(selector)?.parentElement;
  if (!target) return;
  const instance = ReactUtils.getOwnerInstance(target);
  const unpatch = Patcher.instead(instance, "render", () => unpatch());
  instance.forceUpdate(() => instance.forceUpdate());
}
var MentionFix = class {
  constructor() {
    this.fetchedUsers = /* @__PURE__ */ new Set();
  }
  start() {
    Patcher.after(Module, Key, (that, [args], res) => {
      const userId = args.parsedUserId;
      const doesUserExist = UserStore.getUser(userId);
      if (doesUserExist === void 0) {
        for (var child of res.props.children) {
          if (child && child.props) {
            const originalOnMouseEnter = child.props.onMouseEnter;
            Object.defineProperty(child.props, "onMouseEnter", {
              value: async (e) => {
                if (!this.fetchedUsers.has(userId)) {
                  await this.fetchedUsers.add(userId);
                  await FetchModule.fetchUser(userId).catch((error) => {
                    this.fetchedUsers.delete(userId);
                  });
                }
                setTimeout(() => reRender(`.${Message}`), 10);
                if (originalOnMouseEnter) {
                  originalOnMouseEnter(e);
                }
              },
              writable: true,
              configurable: true
            });
          }
        }
      }
    });
  }
  stop() {
    Patcher.unpatchAll();
    this.fetchedUsers.clear();
  }
};
module.exports = MentionFix;
