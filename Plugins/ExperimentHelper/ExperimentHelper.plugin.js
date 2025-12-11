/**
 * @name ExperimentHelper
 * @description A ton of experiment based helpers
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

// src/ExperimentHelper/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => ExperimentHelper
});
module.exports = __toCommonJS(index_exports);
var { React, Webpack, Data, Patcher, ContextMenu, UI } = new BdApi("ExperimentHelper");
var UserStore = Webpack.getStore("UserStore");
var ExperimentStore = Webpack.getStore("ExperimentStore");
var ExperimentsLocation = Webpack.getModule((x) => String(x).includes("Search experiments"), { raw: true });
var Icon = Webpack.getByKeys("Icon").Icon;
function murmurhash3_32_gc(key, seed = 0) {
  var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;
  remainder = key.length & 3;
  bytes = key.length - remainder;
  h1 = seed;
  c1 = 3432918353;
  c2 = 461845907;
  i = 0;
  while (i < bytes) {
    k1 = key.charCodeAt(i) & 255 | (key.charCodeAt(++i) & 255) << 8 | (key.charCodeAt(++i) & 255) << 16 | (key.charCodeAt(++i) & 255) << 24;
    ++i;
    k1 = (k1 & 65535) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
    k1 = k1 << 15 | k1 >>> 17;
    k1 = (k1 & 65535) * c2 + (((k1 >>> 16) * c2 & 65535) << 16) & 4294967295;
    h1 ^= k1;
    h1 = h1 << 13 | h1 >>> 19;
    h1b = (h1 & 65535) * 5 + (((h1 >>> 16) * 5 & 65535) << 16) & 4294967295;
    h1 = (h1b & 65535) + 27492 + (((h1b >>> 16) + 58964 & 65535) << 16);
  }
  k1 = 0;
  switch (remainder) {
    case 3:
      k1 ^= (key.charCodeAt(i + 2) & 255) << 16;
    case 2:
      k1 ^= (key.charCodeAt(i + 1) & 255) << 8;
    case 1:
      k1 ^= key.charCodeAt(i) & 255;
      k1 = (k1 & 65535) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
      k1 = k1 << 15 | k1 >>> 17;
      k1 = (k1 & 65535) * c2 + (((k1 >>> 16) * c2 & 65535) << 16) & 4294967295;
      h1 ^= k1;
  }
  h1 ^= key.length;
  h1 ^= h1 >>> 16;
  h1 = (h1 & 65535) * 2246822507 + (((h1 >>> 16) * 2246822507 & 65535) << 16) & 4294967295;
  h1 ^= h1 >>> 13;
  h1 = (h1 & 65535) * 3266489909 + (((h1 >>> 16) * 3266489909 & 65535) << 16) & 4294967295;
  h1 ^= h1 >>> 16;
  return h1 >>> 0;
}
function getRolloutPosition(userId, experimentName) {
  const hashInput = `${experimentName}:${userId}`;
  const hash = murmurhash3_32_gc(hashInput, 0);
  return (hash >>> 0) % 1e4;
}
var ModalSystem = Webpack.getMangled(".modalKey?", {
  openModalLazy: Webpack.Filters.byStrings(".modalKey?"),
  openModal: Webpack.Filters.byStrings(",instant:"),
  closeModal: Webpack.Filters.byStrings(".onCloseCallback()"),
  closeAllModals: Webpack.Filters.byStrings(".getState();for")
});
var Modal = Webpack.getModule((x) => x.Modal).Modal;
var TextInput = Webpack.getByStrings("setShouldValidate", { searchExports: true });
var ArrowUpRightDashes = (props) => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...props }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "var(--interactive-icon-default)",
    d: "M11 3a1 1 0 1 0 0 2h6.586l-2.293 2.293a1 1 0 0 0 1.414 1.414L19 6.414V13a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1zm2.707 8.707a1 1 0 0 0-1.414-1.414l-3 3a1 1 0 1 0 1.414 1.414zm-6 6a1 1 0 1 0-1.414-1.414l-3 3a1 1 0 1 0 1.414 1.414z"
  }
));
function ExperimentModal({ user }) {
  const [customUserId, setCustomUserId] = React.useState("");
  const [customExperimentId, setCustomExperimentId] = React.useState("");
  const [validUser, setValidUser] = React.useState(user);
  const [treats, setTreats] = React.useState(
    () => Object.keys(arven.Stores.ExperimentStore.getRegisteredExperiments()).concat(Object.keys(arven.Stores.ApexExperimentStore.getRegisteredExperiments()))
  );
  const [query, setQuery] = React.useState("");
  const results = React.useMemo(() => {
    const allResults = [];
    for (const yes of treats) {
      const rolloutPos = getRolloutPosition(validUser.id, yes);
      allResults.push({ id: yes, user_id: validUser.id, rolloutPos });
    }
    return allResults;
  }, [treats, validUser]);
  const filteredResults = React.useMemo(() => {
    if (!query) return results;
    return results.filter((x) => x.id.replaceAll("_", " ").toLowerCase().includes(query.toLowerCase()));
  }, [results, query]);
  return /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "12px" } }, /* @__PURE__ */ BdApi.React.createElement(
    TextInput,
    {
      placeholder: "Search Experiment",
      value: query,
      onChange: setQuery
    }
  ), /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", gap: "8px" } }, /* @__PURE__ */ BdApi.React.createElement(
    TextInput,
    {
      placeholder: "User ID",
      value: customUserId,
      onChange: setCustomUserId
    }
  ), /* @__PURE__ */ BdApi.React.createElement(
    TextInput,
    {
      placeholder: "Experiment ID",
      value: customExperimentId,
      onChange: setCustomExperimentId
    }
  )), customUserId && customExperimentId && /* @__PURE__ */ BdApi.React.createElement("div", { style: {
    padding: "12px 16px",
    backgroundColor: "var(--background-base-low)",
    borderRadius: "8px",
    border: "1px solid var(--background-base-lowest)",
    display: "flex",
    justifyContent: "space-between",
    textAlign: "left",
    alignItems: "center"
  } }, /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ BdApi.React.createElement(
    Icon,
    {
      icon: ArrowUpRightDashes,
      text: "yes",
      onClick: () => window.open(`https://nelly.tools/experiments/${murmurhash3_32_gc(customExperimentId)}`, "blank")
    }
  ), /* @__PURE__ */ BdApi.React.createElement("span", { style: { fontWeight: "500", color: "var(--text-default)" } }, customExperimentId.replaceAll("_", " "))), /* @__PURE__ */ BdApi.React.createElement("span", { style: {
    color: "var(--text-muted)",
    fontSize: "0.9em"
  } }, getRolloutPosition(customUserId, customExperimentId))), /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "8px" } }, filteredResults.sort((a, b) => a.rolloutPos - b.rolloutPos).map((x) => {
    const rolloutPos = x.rolloutPos;
    return /* @__PURE__ */ BdApi.React.createElement(
      "div",
      {
        key: x.id,
        style: {
          padding: "12px 16px",
          backgroundColor: "var(--background-base-low)",
          borderRadius: "8px",
          border: "1px solid var(--background-base-lowest)",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }
      },
      /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ BdApi.React.createElement(
        Icon,
        {
          icon: ArrowUpRightDashes,
          text: "yes",
          onClick: () => window.open(`https://nelly.tools/experiments/${murmurhash3_32_gc(x.id)}`, "blank")
        }
      ), /* @__PURE__ */ BdApi.React.createElement("span", { style: { fontWeight: "500", color: "var(--text-default)" } }, x.id.replaceAll("_", " ").replaceAll("-", " "))),
      /* @__PURE__ */ BdApi.React.createElement("span", { style: {
        color: "var(--text-muted)",
        fontSize: "0.9em"
      } }, rolloutPos)
    );
  })));
}
var ExperimentHelper = class {
  start() {
    const PreviousExperiments = Data.load("Experiments") ?? [];
    const CurrentExperiments = Object.keys(ExperimentStore.getAllExperimentAssignments());
    const NewExperiments = CurrentExperiments.filter((x) => !PreviousExperiments.includes(x));
    if (NewExperiments.length > 0) {
      UI.showNotification({
        title: "New Experiment",
        content: `Found ${NewExperiments.length} new experiment${NewExperiments.length > 1 ? "s" : ""}: ${NewExperiments.join(", ")}`
      });
    }
    Data.save("Experiments", CurrentExperiments);
    Patcher.after(ExperimentsLocation.exports, "Z", (a, b, res) => {
      const experiments = res.props.children[1];
      experiments.forEach((x) => {
        if (!x.props.originalExperimentId) {
          x.props.originalExperimentId = x.props.experiment.title;
        }
        const rolloutPos = getRolloutPosition(
          UserStore.getCurrentUser().id,
          x.props.experimentId
        );
        x.props.experiment = {
          ...x.props.experiment,
          title: `${x.props.originalExperimentId} - (${rolloutPos})`
        };
      });
    });
    ContextMenu.patch("user-context", this.UECM);
  }
  UECM(res, data) {
    res.props.children.push(
      /* @__PURE__ */ BdApi.React.createElement(
        ContextMenu.Item,
        {
          id: "ts-is-ass",
          label: "Experiment Information",
          action: () => ModalSystem.openModal((props) => /* @__PURE__ */ BdApi.React.createElement(
            Modal,
            {
              size: "lg",
              title: "Experiment Rollout Checker",
              subtitle: "Check a users rollout position on any experiment",
              ...props
            },
            /* @__PURE__ */ BdApi.React.createElement(
              ExperimentModal,
              {
                user: UserStore.getUser(data.user.id)
              }
            )
          ))
        }
      )
    );
  }
  stop() {
    Patcher.unpatchAll();
    ContextMenu.unpatch("user-context", this.UECM);
  }
};
