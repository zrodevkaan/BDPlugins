/**
 * @name MentionFix
 * @version 2.0.3
 * @description Hate the `@unknown-user` when mentioning someone you've never met? Yeah this fixes that. :>
 * @author Kaan
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/MentionFix/MentionFix.plugin.js
 * @invite t3zMgv7Nvb
 * @stable 586111
 * @canary 586503
 */
"use strict";

// helpers/webpack.ts
var { Webpack } = BdApi;
function resolveModule(filter, options) {
  const opts = options ?? {};
  if (opts.declaration) {
    const { declaration, key, raw, ...rest } = opts;
    const result = Webpack.getMangled(filter, { __value: declaration }, {
      ...rest,
      mapDeclarations: true
    });
    return result?.__value ?? null;
  }
  const mod = Webpack.getModule(filter, opts);
  if (mod == null) return null;
  return opts.key ? mod[opts.key] : mod;
}
function wpGetByStrings(strings, options) {
  return resolveModule(Webpack.Filters.byStrings(...strings), options);
}

// helpers/index.tsx
var { Webpack: Webpack2, React, ContextMenu, Hooks } = BdApi;
var { createElement, forwardRef } = React;
function styledBase(tag, cssOrFn) {
  return (props) => {
    const style = typeof cssOrFn === "function" ? cssOrFn(props) : cssOrFn;
    return React.createElement(tag, { ...props, style: { ...style, ...props.style } });
  };
}
var styled = new Proxy(styledBase, {
  get(target, p) {
    return (cssOrFn) => target(p, cssOrFn);
  }
});
function getKey(module2, fn) {
  for (const key in module2) {
    if (fn(module2[key])) return { key, module: module2 };
  }
}

// src/MentionFix/index.tsx
var { Webpack: Webpack3, Patcher, React: React2, Hooks: Hooks2, Components } = new BdApi("MentionFix");
var FetchUser = getKey(Webpack3.getBySource("UserProfileModalActionCreators"), (x) => String(x).includes("USER_UPDATE") && !String(x).includes("USER_PROFILE_FETCH_START") && String(x).includes("Promise.resolve"));
var UserMention = getKey(wpGetByStrings([".A.USER_MENTION),"], { raw: true }).exports, (x) => String(x).includes("USER_MENTION"));
var UserComponent = UserMention.module[UserMention.key];
function queuer(worker, { concurrency = 3 } = {}) {
  const pending = /* @__PURE__ */ new Map();
  const queue = [];
  let active = 0;
  function runNext() {
    if (active >= concurrency || queue.length === 0) return;
    const { key, resolve, reject } = queue.shift();
    active++;
    worker(key).then(resolve, reject).finally(() => {
      active--;
      pending.delete(key);
      runNext();
    });
  }
  return function enqueue(key) {
    if (pending.has(key)) return pending.get(key);
    const promise = new Promise((resolve, reject) => {
      queue.push({ key, resolve, reject });
    });
    pending.set(key, promise);
    runNext();
    return promise;
  };
}
var fetchUserQueue = queuer(
  (userId) => FetchUser.module[FetchUser.key](userId),
  { concurrency: 8 }
);
function CustomMention({ args }) {
  const userId = args.userId ?? args.parsedUserId;
  const data = Hooks2.useStateFromStores([Webpack3.Stores.UserStore, Webpack3.Stores.ChannelStore], () => ({
    user: Webpack3.Stores.UserStore.getUser(userId),
    channel: Webpack3.Stores.ChannelStore.getChannel(args.channelId)
  }));
  React2.useEffect(() => {
    if (data.user) return;
    fetchUserQueue(userId).then(() => Webpack3.Stores.UserStore.emitChange());
  }, [userId, data.user]);
  return !data.user ? /* @__PURE__ */ BdApi.React.createElement(Components.Spinner, null) : /* @__PURE__ */ BdApi.React.createElement(UserComponent, { ...args });
}
var MentionFix = class {
  start() {
    Patcher.after(UserMention.module, UserMention.key, (that, [args], res) => {
      const userId = args.userId ?? args.parsedUserId;
      if (!userId || Webpack3.Stores.UserStore.getUser(userId)) return res;
      return /* @__PURE__ */ BdApi.React.createElement(CustomMention, { args });
    });
  }
  stop() {
    Patcher.unpatchAll();
  }
};
module.exports = MentionFix;
