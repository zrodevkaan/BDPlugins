/**
 * @name BetterMedia
 * @description Expands image and emoji features. Reverse image search, download, copy url, copy image, and more!
 * @version 1.0.0
 * @author Kaan
 * @keyframes barrel-roll {
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

// src/BetterMedia/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => BetterMedia
});
module.exports = __toCommonJS(index_exports);
var { Webpack, Patcher, DOM, Components, React, ContextMenu, UI, Net, Data, Plugins } = new BdApi(
  "BetterMedia"
);
var ImageComp = Webpack.getModule((x) => x?.displayName == "Image", { searchExports: true });
var Popout = Webpack.getModule((m) => m?.Animation, { searchExports: true, raw: true }).exports.y;
var ImageRenderComponent = Webpack.getModule((x) => x?.isAnimated && x?.getFormatQuality, {
  raw: true
}).exports;
var MediaModal = Webpack.getByStrings(
  ".shouldHideMediaOptions",
  "hasMediaOptions:",
  "numMediaItems:",
  { searchExports: true }
);
var mediautils = Webpack.getModule((x) => x?.getUserBannerURL);
var UserProfileStore = Webpack.getStore("UserProfileStore");
var GuildStoreCurrent = Webpack.getStore("SelectedGuildStore");
var GuildMemberStore = Webpack.getStore("GuildMemberStore");
var MessageStore = Webpack.getStore("MessageStore");
var EmojiStore = Webpack.getStore("EmojiStore");
var StickersStore = Webpack.getStore("StickersStore");
var SelectedChannelStore = Webpack.getStore("SelectedChannelStore");
var ModalSystem = Webpack.getMangled(".modalKey?", {
  openModalLazy: Webpack.Filters.byStrings(".modalKey?"),
  openModal: Webpack.Filters.byStrings(",instant:"),
  closeModal: Webpack.Filters.byStrings(".onCloseCallback()"),
  closeAllModals: Webpack.Filters.byStrings(".getState();for")
});
var Modal = Webpack.getModule((x) => x.Modal).Modal;
var FormSwitch = Webpack.getByStrings(".Z.colors.INTERACTIVE_MUTED).spring()", {
  searchExports: true
});
var searchEngines = {
  Google: {
    url: "https://www.google.com/searchbyimage?sbisrc=cr_1&image_url=",
    mayContainNSFW: false,
    ico: "https://www.google.com/favicon.ico"
  },
  GoogleLens: {
    url: "https://lens.google.com/uploadbyurl?url=",
    mayContainNSFW: false,
    ico: "https://lens.google.com/favicon.ico"
  },
  Sogou: {
    url: "http://pic.sogou.com/ris?flag=1&drag=0&flag=1&query=",
    mayContainNSFW: false,
    ico: "https://www.sogou.com/favicon.ico"
  },
  Bing: {
    url: "https://www.bing.com/images/search?view=detailv2&iss=sbi&FORM=IRSBIQ&q=imgurl:",
    mayContainNSFW: false,
    ico: "https://www.bing.com/favicon.ico"
  },
  WhatAnime: {
    url: "https://trace.moe/?url=",
    mayContainNSFW: false,
    ico: "https://trace.moe/favicon.ico"
  },
  TinEye: {
    url: "https://tineye.com/search?url=",
    mayContainNSFW: false,
    ico: "https://tineye.com/favicon.ico"
  },
  Yandex: {
    url: "https://yandex.com/images/search?rpt=imageview&url=",
    mayContainNSFW: false,
    ico: "https://yandex.com/favicon.ico"
  },
  Ascii2D: {
    url: "https://ascii2d.net/search/url/",
    mayContainNSFW: true,
    ico: "https://ascii2d.net/favicon.ico"
  },
  SauceNAO: {
    url: "https://saucenao.com/search.php?db=999&url=",
    mayContainNSFW: true,
    ico: "https://saucenao.com/favicon.ico"
  },
  IQDB: {
    url: "https://iqdb.org/?url=",
    mayContainNSFW: true,
    ico: "https://www.iqdb.org/favicon.ico"
  }
};
var buildSearchMenu = (url) => {
  return Object.entries(searchEngines).map(([name, engine]) => {
    const domain = extractDomain(engine.url);
    const src = engine.url + encodeURIComponent(url);
    return {
      type: "button",
      id: `search-${name.toLowerCase()}`,
      label: name,
      iconLeft: () => /* @__PURE__ */ BdApi.React.createElement("img", { src: engine?.fallbackIco || generateFaviconURL(domain, 16) }),
      action: () => window.open(src, "_blank"),
      danger: engine.mayContainNSFW
    };
  });
};
var createContextMenuItem = (id, label, action, options = {}) => ({
  id,
  label,
  action,
  ...options
});
var createSubmenuItem = (id, label, items, options = {}, icon = null) => ({
  id,
  label,
  type: "submenu",
  items,
  ...options,
  iconLeft: () => icon
});
var createIconItem = (id, label, icon, action, options = {}) => ({
  id,
  label,
  action,
  iconLeft: () => icon,
  ...options
});
function extractDomain(url) {
  try {
    const urlObj = new URL(url.startsWith("http") ? url : "https://" + url);
    return urlObj.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
function generateFaviconURL(website, size = 16) {
  const url = new URL(
    "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
  );
  url.searchParams.set("url", `https://${website}`);
  url.searchParams.set("size", String(size));
  return url.href;
}
var getFormatFromUrl = (url) => {
  const extension = url.split(".").pop()?.split("?")[0]?.toUpperCase();
  return extension || "UNKNOWN";
};
var copyURL = (text) => {
  navigator.clipboard.writeText(text);
};
async function setClipboard(data, mimeType) {
  let clipboardItem;
  if (typeof data === "string") {
    clipboardItem = new ClipboardItem({
      "text/plain": new Blob([data], { type: "text/plain" })
    });
  } else {
    const type = mimeType || "image/png";
    let blob;
    if (data instanceof Blob) {
      blob = mimeType ? data.slice(0, data.size, type) : data;
    } else if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
      blob = new Blob([data], { type });
    } else {
      throw new Error("Unsupported data type for clipboard image write.");
    }
    clipboardItem = new ClipboardItem({
      [type]: blob
    });
  }
  await navigator.clipboard.write([clipboardItem]);
}
var openMedia = async (url, doBarrelRoll, buffer, shouldReverse = true) => {
  const discordDoesntEncodeWebpsInDiscordNative = shouldReverse ? url.replace(/\.webp(\?|$)/i, ".png$1") : url.replace(/\.png(\?|$)/i, ".webp$1");
  const extension = getFormatFromUrl(discordDoesntEncodeWebpsInDiscordNative);
  const mediaItem = {
    url: discordDoesntEncodeWebpsInDiscordNative,
    original: discordDoesntEncodeWebpsInDiscordNative,
    proxyUrl: discordDoesntEncodeWebpsInDiscordNative,
    isAnimated: true,
    type: "IMAGE"
  };
  let mediaBuffer = buffer;
  if (!mediaBuffer) {
    try {
      const response = await fetch(discordDoesntEncodeWebpsInDiscordNative);
      const arrayBuffer = await response.arrayBuffer();
      mediaBuffer = Buffer.from(arrayBuffer);
    } catch (error) {
      console.warn("openMedia: Failed to create buffer from URL:", error);
    }
  }
  const menuStuff = () => {
    return ContextMenu.buildMenu([
      {
        type: "submenu",
        label: "BetterMedia",
        items: [
          {
            type: "button",
            label: "Copy Image",
            action: () => {
              setClipboard(mediaBuffer, "image/png");
            }
            //DiscordNative.clipboard.copyImage(mediaBuffer || discordDoesntEncodeWebpsInDiscordNative)
          }
        ]
      }
    ]);
  };
  const modalIndex = MediaModal({
    BetterMediaModal: true,
    items: [mediaItem],
    onContextMenu: (e) => {
      if (extension == "GIF") return;
      return ContextMenu.open(e, menuStuff());
    }
  });
  requestAnimationFrame(() => {
    try {
      if (!buffer) return;
      const dimensionlessModule = Webpack.getModule((x) => x?.dimensionlessImage);
      if (!dimensionlessModule?.dimensionlessImage) {
        console.warn("openMedia: Could not find dimensionlessImage module");
        return;
      }
      const selector = `.${dimensionlessModule.dimensionlessImage}`;
      const imageElement = document.querySelector(selector);
      if (!imageElement) {
        console.warn("openMedia: Image element not found");
        return;
      }
      if (doBarrelRoll) {
        imageElement.classList.add("doabarrelroll");
      }
      URL.revokeObjectURL(discordDoesntEncodeWebpsInDiscordNative);
    } catch (error) {
      console.error("openMedia: Error setting up media element:", error);
    }
  });
  return modalIndex;
};
var getFileSize = async (url) => {
  try {
    const response = await Net.fetch(url, { method: "HEAD" });
    const size = response.headers.get("content-length");
    if (size) {
      const bytes = parseInt(size);
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
  } catch (error) {
    console.warn("Failed to get file size:", error);
  }
  return "Unknown";
};
var InformationPopout = ({ url, provider: provider2, ...props }) => {
  const [getSize, setSize] = React.useState("Requesting...");
  React.useEffect(() => {
    const getSize2 = async () => {
      const result = await getFileSize(url);
      setSize(result);
    };
    getSize2();
  }, [url]);
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "bm-popout", ...props }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "bm-popout-title" }, "Image Info"), /* @__PURE__ */ BdApi.React.createElement("div", { className: "bm-popout-format" }, "Name: ", /* @__PURE__ */ BdApi.React.createElement("span", { className: "bm-popout-format-value" }, " ", getFileNameOwO(url), " ")), /* @__PURE__ */ BdApi.React.createElement("div", { className: "bm-popout-format" }, "Provider: ", /* @__PURE__ */ BdApi.React.createElement("span", { className: "bm-popout-format-value" }, provider2)), /* @__PURE__ */ BdApi.React.createElement("div", { className: "bm-popout-format" }, "Size: ", /* @__PURE__ */ BdApi.React.createElement("span", { className: "bm-popout-format-value" }, getSize)), /* @__PURE__ */ BdApi.React.createElement("div", { className: "bm-popout-format" }, "Format: ", /* @__PURE__ */ BdApi.React.createElement("span", { className: "bm-popout-format-value" }, getFormatFromUrl(url))), /* @__PURE__ */ BdApi.React.createElement("div", { className: "bm-popout-url-label" }, "URL:"), /* @__PURE__ */ BdApi.React.createElement("div", { className: "bm-popout-url", onClick: () => copyURL(url), title: "Click to copy" }, url));
};
function getFileNameOwO(file) {
  const input = typeof file === "string" ? file : file.name;
  const cleaned = input.split("?")[0].split("#")[0];
  const segments = cleaned.split(/[/\\]/);
  return segments.pop();
}
var createDownloadLink = async (url, filename) => {
  try {
    let blob;
    if (url.startsWith("data:")) {
      const [header, data] = url.split(",");
      if (!header || !data) return "";
      const mimeType = header.match(/:(.*?);/)?.[1] || "audio/ogg";
      const binary = atob(data);
      blob = new Blob([new Uint8Array([...binary].map((c) => c.charCodeAt(0)))], { type: mimeType });
    } else {
      blob = await (await Net.fetch(url)).blob();
    }
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: filename || "download.ogg"
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    UI.showToast("Download started!", { type: "success" });
  } catch (error) {
    UI.showToast("Download failed!", { type: "error" });
  }
};
var openInBrowser = (url) => window.open(url, "_blank");
var MediaContainer = ({ url: urlA, width, isThirdParty, provider: provider2 }) => {
  const url = isThirdParty ? urlA || "" : (() => {
    if (urlA == void 0 || urlA == null || urlA == "") return "";
    try {
      const urlObj = new URL(urlA);
      urlObj.searchParams.delete("width");
      urlObj.searchParams.delete("height");
      urlObj.searchParams.set("size", "4096");
      return urlObj.toString();
    } catch (error) {
      console.warn("Invalid URL provided to MediaContainer:", urlA, error);
      return urlA || "";
    }
  })() || "";
  const owoRef = React.useRef(null);
  const containerWidth = Math.max(width - 20, 60);
  const [open, setOpen] = React.useState(false);
  const [hide, setHide] = React.useState(false);
  const [shouldShow, setShouldShow] = useSetting("showToolbar", true);
  const iconWidth = 24;
  const totalIconsWidth = iconWidth * 5;
  const availableSpaceForGaps = containerWidth - totalIconsWidth - 10;
  const gap = Math.max(Math.min(availableSpaceForGaps / 4, 20), 5);
  const buildSearchMenu2 = () => {
    const reverseSearchItems = Object.entries(searchEngines).map(([name, engine]) => {
      const domain = extractDomain(engine.url);
      const src = engine.url + encodeURIComponent(url);
      return createIconItem(
        `search-${name.toLowerCase()}`,
        name,
        /* @__PURE__ */ BdApi.React.createElement("img", { src: generateFaviconURL(domain, 16) }),
        () => window.open(src, "_blank"),
        { color: engine.mayContainNSFW ? "danger" : "brand" }
      );
    });
    const elements = [
      createSubmenuItem("reverse-search", "Reverse Search", reverseSearchItems, {}, /* @__PURE__ */ BdApi.React.createElement(SearchIcon, null)),
      createContextMenuItem("disable-toolbar", "Disable Toolbar", () => {
        setShouldShow(false);
        DataStore.settings.showToolbar = false;
      }),
      createContextMenuItem("open-settings", "Open Settings", () => {
        const SettingsPanel = Plugins.get("BetterMedia").instance.getSettingsPanel();
        ModalSystem.openModal((props) => /* @__PURE__ */ BdApi.React.createElement(Modal, { ...props, title: "BetterMedia Settings" }, /* @__PURE__ */ BdApi.React.createElement(SettingsPanel, null)));
      })
    ];
    if (DataStore.settings.canvasFeatures) {
      elements.splice(
        1,
        0,
        createSubmenuItem(
          "canvas-methods",
          "Canvas Methods",
          createCanvasMenu(url),
          {},
          /* @__PURE__ */ BdApi.React.createElement(CanvasIcon, null)
        )
      );
    }
    return elements;
  };
  return shouldShow && /* @__PURE__ */ BdApi.React.createElement("div", { className: "bm-media-container" }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "bm-media-controls", style: { gap: `${gap}px` } }, /* @__PURE__ */ BdApi.React.createElement(Components.Tooltip, { text: "Download" }, (props) => /* @__PURE__ */ BdApi.React.createElement(
    ArrowDownload,
    {
      ...props,
      className: "bm-icon",
      onClick: () => createDownloadLink(url, Date.now())
    }
  )), /* @__PURE__ */ BdApi.React.createElement(Components.Tooltip, { text: "Copy URL" }, (props) => /* @__PURE__ */ BdApi.React.createElement(Clipboard, { ...props, className: "bm-icon", onClick: () => copyURL(url) })), /* @__PURE__ */ BdApi.React.createElement(Components.Tooltip, { text: "Open in Browser" }, (props) => /* @__PURE__ */ BdApi.React.createElement(
    ArrowUpRightDashes,
    {
      ...props,
      className: "bm-icon",
      onClick: () => openInBrowser(url)
    }
  )), /* @__PURE__ */ BdApi.React.createElement("div", { ref: owoRef }, /* @__PURE__ */ BdApi.React.createElement(
    Popout,
    {
      shouldShow: open,
      position: "bottom",
      targetElementRef: owoRef,
      onRequestClose: () => setOpen(false),
      clickTrap: true,
      renderPopout: (props) => /* @__PURE__ */ BdApi.React.createElement(InformationPopout, { provider: provider2, url, ...props })
    },
    (props) => /* @__PURE__ */ BdApi.React.createElement("div", { ...props, ref: owoRef, onClick: () => setOpen(true) }, /* @__PURE__ */ BdApi.React.createElement(Components.Tooltip, { text: "Information" }, (propsA) => /* @__PURE__ */ BdApi.React.createElement(BookInformation24Regular, { ...propsA, className: "bm-icon" })))
  )), /* @__PURE__ */ BdApi.React.createElement(Components.Tooltip, { text: "More" }, (props) => /* @__PURE__ */ BdApi.React.createElement(
    Settings16Filled,
    {
      ...props,
      onClick: (e) => {
        ContextMenu.open(e, ContextMenu.buildMenu(buildSearchMenu2()));
      },
      className: "bm-icon"
    }
  ))));
};
var CopyIcon = () => /* @__PURE__ */ BdApi.React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" }));
var SearchIcon = () => /* @__PURE__ */ BdApi.React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" }));
var CanvasIcon = (props) => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", ...props }, /* @__PURE__ */ BdApi.React.createElement(
  "g",
  {
    fill: "currentColor",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "1.5",
    color: "currentColor"
  },
  /* @__PURE__ */ BdApi.React.createElement("path", { d: "M4 8c0-2.828 0-4.243 1.004-5.121S7.624 2 10.857 2h2.286c3.232 0 4.849 0 5.853.879C20 3.757 20 5.172 20 8v9H4zm-1 9h18" }),
  /* @__PURE__ */ BdApi.React.createElement("path", { d: "M10.699 5.566c1.23-.176 3.268-.106 1.581 1.587c-2.108 2.115-5.272 6.876-1.581 5.29c3.69-1.588 5.272-.53 3.69 1.057M12 17v4m-7 1l3-5m11 5l-3-5" })
));
var ImageIcon = () => /* @__PURE__ */ BdApi.React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" }));
var BannerIcon = () => /* @__PURE__ */ BdApi.React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M5 17h14v2H5zm4.5-4.2h1l.9 2.2h.9l-2.1-5h-.9L7.2 15h.9l.4-2.2zm.2-1.5L10.2 9l.5 2.3h-1zm4.3 3.7h.9v-1.3h1.3v-.8h-1.3V12h1.5v-.8h-2.4V15z" }));
var MainMenuIcon = (props) => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 16 16", ...props }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M13 2.5H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5ZM3 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H3Zm9 9.857L9.5 8l-2.476 2.83L5.5 9L4 10.8V12h8v-1.143ZM6.5 8a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3Z",
    clipRule: "evenodd"
  }
));
var BookInformation24Regular = (props) => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...props }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "var(--interactive-icon-default)",
    d: "M4 4.5A2.5 2.5 0 0 1 6.5 2H18a2.5 2.5 0 0 1 2.5 2.5v14.25a.75.75 0 0 1-.75.75H5.5a1 1 0 0 0 1 1h13.25a.75.75 0 0 1 0 1.5H6.5A2.5 2.5 0 0 1 4 19.5v-15ZM12.25 8a1 1 0 1 0 0-2a1 1 0 0 0 0 2Zm-.75 1.75v5a.75.75 0 0 0 1.5 0v-5a.75.75 0 0 0-1.5 0Z"
  }
));
var ArrowDownload = (props) => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 16 16", ...props }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "var(--interactive-icon-default)",
    d: "M3.5 13h9a.75.75 0 0 1 .102 1.493l-.102.007h-9a.75.75 0 0 1-.102-1.493L3.5 13h9h-9ZM7.898 1.007L8 1a.75.75 0 0 1 .743.648l.007.102v7.688l2.255-2.254a.75.75 0 0 1 .977-.072l.084.072a.75.75 0 0 1 .072.977l-.072.084L8.53 11.78a.75.75 0 0 1-.976.073l-.084-.073l-3.536-3.535a.75.75 0 0 1 .977-1.133l.084.072L7.25 9.44V1.75a.75.75 0 0 1 .648-.743L8 1l-.102.007Z"
  }
));
var Clipboard = (props) => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 18 18", ...props }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "var(--interactive-icon-default)",
    d: "M11.873 3H12.75A2.25 2.25 0 0 1 15 5.25v9A2.25 2.25 0 0 1 12.75 16.5h-7.5A2.25 2.25 0 0 1 3 14.25v-9A2.25 2.25 0 0 1 5.25 3h.877A2.25 2.25 0 0 1 8.25 1.5h1.5a2.25 2.25 0 0 1 2.123 1.5M7.5 3.75a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0-.75.75"
  }
));
var ArrowUpRightDashes = (props) => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...props }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "var(--interactive-icon-default)",
    d: "M11 3a1 1 0 1 0 0 2h6.586l-2.293 2.293a1 1 0 0 0 1.414 1.414L19 6.414V13a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1zm2.707 8.707a1 1 0 0 0-1.414-1.414l-3 3a1 1 0 1 0 1.414 1.414zm-6 6a1 1 0 1 0-1.414-1.414l-3 3a1 1 0 1 0 1.414 1.414z"
  }
));
var Settings16Filled = (props) => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 20 20", ...props }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "var(--interactive-icon-default)",
    d: "M7.999 2c-.37 0-.731.036-1.08.106a.5.5 0 0 0-.394.396l-.262 1.354a.417.417 0 0 1-.545.315l-1.307-.45a.5.5 0 0 0-.538.141A5.495 5.495 0 0 0 2.786 5.74a.5.5 0 0 0 .146.538l1.045.907a.417.417 0 0 1 0 .63l-1.045.907a.5.5 0 0 0-.146.537a5.5 5.5 0 0 0 1.087 1.878a.5.5 0 0 0 .538.142l1.307-.45a.417.417 0 0 1 .545.314l.262 1.355a.5.5 0 0 0 .393.396a5.525 5.525 0 0 0 2.17-.002a.5.5 0 0 0 .393-.395l.262-1.354a.417.417 0 0 1 .545-.315l1.3.45a.5.5 0 0 0 .538-.143a5.495 5.495 0 0 0 1.087-1.882a.5.5 0 0 0-.146-.537l-1.039-.902a.417.417 0 0 1 0-.629l1.04-.902a.5.5 0 0 0 .145-.537a5.496 5.496 0 0 0-1.087-1.881a.5.5 0 0 0-.538-.143l-1.3.45a.417.417 0 0 1-.545-.316l-.262-1.353a.5.5 0 0 0-.392-.395A5.524 5.524 0 0 0 7.999 2ZM6.5 7.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0Zm4.663 4.947a.459.459 0 0 1 .526-.152l.8.276a.455.455 0 0 0 .594-.343l.16-.83a.459.459 0 0 1 .396-.38a3.554 3.554 0 0 1 .719 0c.202.02.356.18.395.38l.16.83a.455.455 0 0 0 .595.343l.8-.276a.46.46 0 0 1 .526.152c.14.194.261.403.36.623a.459.459 0 0 1-.13.532l-.64.555a.455.455 0 0 0 0 .686l.64.555a.459.459 0 0 1 .13.532c-.099.22-.22.429-.36.623a.46.46 0 0 1-.526.152l-.8-.276a.455.455 0 0 0-.594.343l-.16.83a.459.459 0 0 1-.396.38a3.554 3.554 0 0 1-.719 0a.459.459 0 0 1-.395-.38l-.161-.83a.455.455 0 0 0-.595-.343l-.799.276a.46.46 0 0 1-.526-.152a3.493 3.493 0 0 1-.36-.623a.459.459 0 0 1 .13-.532l.64-.555a.455.455 0 0 0 0-.686l-.64-.555a.459.459 0 0 1-.13-.532c.099-.22.22-.429.36-.623ZM15 14.5a1 1 0 1 0-2 0a1 1 0 0 0 2 0Z"
  }
));
var GuildIcon = (props) => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 16 16" }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "var(--interactive-icon-default)",
    d: "M11.414 1.586A2 2 0 0 0 10 1H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V3a2 2 0 0 0-.586-1.414ZM9.853 12.854a.5.5 0 0 1-.354.146h-3a.5.5 0 1 1 0-1h3a.5.5 0 0 1 .354.854Zm0-2a.5.5 0 0 1-.354.146h-3a.5.5 0 1 1 0-1h3a.5.5 0 0 1 .354.854Zm0-6A.5.5 0 0 1 9.499 5h-3a.498.498 0 0 1-.5-.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .354.854Z"
  }
));
var rotateImage = (url, rotation) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = function() {
      const radians = rotation * Math.PI / 180;
      const isRotated = Math.abs(Math.sin(radians)) > 0.5;
      if (isRotated) {
        canvas.width = image.naturalHeight;
        canvas.height = image.naturalWidth;
      } else {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
      }
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx?.save();
      ctx?.translate(centerX, centerY);
      ctx?.rotate(radians);
      ctx?.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
      ctx?.restore();
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("no data. omegalul"));
        }
      }, "image/png");
    };
    image.onerror = function(e) {
      reject("ACK? CORS?");
    };
    image.src = url;
  });
};
var deepFryImage = (url, intensity = 2) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = function() {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx?.drawImage(image, 0, 0);
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (!imageData) return reject("Failed to get image data");
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * intensity);
        data[i + 1] = Math.min(255, data[i + 1] * intensity);
        data[i + 2] = Math.min(255, data[i + 2] * intensity);
      }
      ctx?.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => {
        blob ? resolve(blob) : reject(new Error("Deep fry failed"));
      }, "image/png");
    };
    image.onerror = () => reject("Image load failed");
    image.src = url;
  });
};
var addGlowEffect = (url, color = "#00ff00", intensity = 20) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = function() {
      const padding = intensity * 2;
      canvas.width = image.naturalWidth + padding;
      canvas.height = image.naturalHeight + padding;
      if (!ctx) return reject("No context");
      ctx.shadowColor = color;
      ctx.shadowBlur = intensity;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      for (let i = 0; i < 3; i++) {
        ctx.drawImage(image, padding / 2, padding / 2);
      }
      canvas.toBlob((blob) => {
        blob ? resolve(blob) : reject(new Error("Glow effect failed"));
      }, "image/png");
    };
    image.onerror = () => reject("Image load failed");
    image.src = url;
  });
};
var makeCircularPfp = (url, borderColor = "#7289da", borderWidth = 8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = function() {
      const size = Math.min(image.naturalWidth, image.naturalHeight);
      canvas.width = size + borderWidth * 2;
      canvas.height = size + borderWidth * 2;
      if (ctx) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = size / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + borderWidth, 0, Math.PI * 2);
        ctx.fillStyle = borderColor;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.clip();
        const offsetX = (image.naturalWidth - size) / 2;
        const offsetY = (image.naturalHeight - size) / 2;
        ctx.drawImage(image, -offsetX + borderWidth, -offsetY + borderWidth);
      }
      canvas.toBlob((blob) => {
        blob ? resolve(blob) : reject(new Error("Circular pfp failed"));
      }, "image/png");
    };
    image.onerror = () => reject("Image load failed");
    image.src = url;
  });
};
var rgbShift = (url, offset = 5) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = function() {
      canvas.width = image.naturalWidth + offset * 2;
      canvas.height = image.naturalHeight + offset * 2;
      if (ctx) {
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = "red";
        ctx.globalAlpha = 0.33;
        ctx.drawImage(image, offset * 2, 0);
        ctx.fillStyle = "lime";
        ctx.drawImage(image, offset, offset);
        ctx.fillStyle = "blue";
        ctx.drawImage(image, 0, offset * 2);
      }
      canvas.toBlob((blob) => {
        blob ? resolve(blob) : reject(new Error("RGB shift failed"));
      }, "image/png");
    };
    image.onerror = () => reject("Image load failed");
    image.src = url;
  });
};
var css = `
.altText {
    color: var(--text-muted);
    display: inline-block;
    font-size: 12px;
    font-weight: var(--font-weight-medium);
    line-height: 16px;
    margin: .25rem 0 .75rem;
}

/* I miss sera.. :( */
.doabarrelroll {
    animation: barrel-roll 0.1s linear infinite;
    transform-origin: center center;
}

@keyframes barrel-roll {
    0% {
        transform: rotate(0deg);
    }
    25% {
        transform: rotate(90deg);
    }
    50% {
        transform: rotate(180deg);
    }
    75% {
        transform: rotate(270deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.bm-popout {
    background: var(--background-base-low);
    border-radius: 8px;
    padding: 16px;
    width: 260px;
    color: var(--text-default);
    font-size: 14px;
    box-shadow: var(--elevation-high);
    border: 1px solid var(--background-modifier-accent);
}

.bm-popout-title {
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--text-default);
}

.bm-popout-format {
    color: var(--text-muted);
    font-size: 13px;
    margin-bottom: 12px;
}

.bm-popout-format-value {
    color: var(--text-default);
    font-weight: 500;
    word-wrap: break-word;
}

.bm-popout-url-label {
    color: var(--text-muted);
    font-size: 13px;
    margin-bottom: 8px;
}

.bm-popout-url {
    background: var(--background-base-lower);
    padding: 10px;
    border-radius: 6px;
    font-size: 12px;
    word-break: break-all;
    cursor: pointer;
    overflow: hidden;
    color: var(--text-default);
    transition: background 0.15s ease;
}

.bm-popout-url:hover {
    background: var(--background-base-lowest);
}

.bm-filename {
    font-size: 13px;
    font-weight: 500;
    opacity: 0.9;
    text-overflow: ellipsis;
    white-space: wrap;
    margin-bottom: 8px;
    overflow: hidden;
}

.bm-media-container {
    position: absolute;
    bottom: 5px;
    pointer-events: auto;
    left: 5px;
    right: 5px;
    cursor: default;
    user-select: text;
    z-index: 10;
    background: var(--opacity-black-60);
    padding: 10px;
    border-radius: 8px;
    color: var(--text-normal);
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.bm-media-controls {
    display: flex;
    justify-content: center;
    align-items: center;
}

.bm-icon {
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s ease;
    color: var(--interactive-icon-default);
    width: 24px;
    height: 24px;
}

.bm-icon:hover {
    opacity: 1;
    color: var(--interactive-hover);
}`;
var DataStore = new Proxy(
  {},
  {
    get: (_, key) => {
      return Data.load(key);
    },
    set: (_, key, value) => {
      Data.save(key, value);
      return true;
    },
    deleteProperty: (_, key) => {
      Data.delete(key);
      return true;
    }
  }
);
var settings = {
  allImagesAreGifs: { value: true, title: "All Media are GIFs", note: "Show all media as GIFs" },
  showToolbar: { value: true, title: "Show Toolbar", note: "Shows or hides the Toolbar on media" },
  reverseModalGallery: {
    value: true,
    title: "Image Gallery Reverse",
    note: "Reverses the images on the Media modal gallery at the bottom."
  },
  canvasFeatures: {
    value: true,
    title: "Canvas Methods",
    note: "Adds Canvas Methods to Media like Glow or Deep Fry"
  },
  enabledGallery: {
    value: true,
    title: "Enable Gallery",
    note: "When opening images, gives you the most recent images in the bottom of every image modal. (W.I.P) This feature is buggy and will be fixed"
  }
};
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
var SettingsStore = class extends InternalStore {
  static displayName = "SettingsStore";
  constructor() {
    super();
    this.settings = {};
    this.initialize();
  }
  initialize() {
    this.settings = DataStore.settings || {};
  }
  getSetting(key, defaultValue) {
    return this.settings[key] ?? defaultValue;
  }
  setSetting(key, value) {
    this.settings[key] = value;
    DataStore.settings = this.settings;
    this.emit();
  }
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    DataStore.settings = this.settings;
    this.emit();
  }
};
var settingsStore = new SettingsStore();
var RotateIcon = () => /* @__PURE__ */ BdApi.React.createElement("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M12 6v3l4-4-4-4v3c-5.5 0-10 4.5-10 10 0 2.2.7 4.2 1.9 5.8l1.4-1.4C4.5 16.8 4 14.5 4 12c0-4.4 3.6-8 8-8z" }), /* @__PURE__ */ BdApi.React.createElement("path", { d: "M20 12c0-4.4-3.6-8-8-8v1.8c3.4 0 6.2 2.8 6.2 6.2 0 2.5-1.5 4.7-3.6 5.7l1.4 1.4c2.3-1.3 3.8-3.7 3.8-6.3z" }));
var FireIcon = () => /* @__PURE__ */ BdApi.React.createElement("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" }));
var SparklesIcon = () => /* @__PURE__ */ BdApi.React.createElement("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ BdApi.React.createElement("path", { d: "m9 11 3-3 3 3-3 3-3-3z" }), /* @__PURE__ */ BdApi.React.createElement("path", { d: "M18.5 6.5 21 4l-2.5-2.5L16 4l2.5 2.5zM18.5 17.5 21 20l-2.5 2.5L16 20l2.5-2.5zM5.5 6.5 8 4 5.5 1.5 3 4l2.5 2.5zM5.5 17.5 8 20l-2.5 2.5L3 20l2.5-2.5z" }));
var UserCircleIcon = () => /* @__PURE__ */ BdApi.React.createElement("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" }));
var ZapIcon = () => /* @__PURE__ */ BdApi.React.createElement("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M13 1 8.5 8.5H1l4.5 6L10 22l4.5-7.5H22l-4.5-6L13 1z" }));
function createCanvasMenu(url) {
  const rotations = [90, 180, 270, 360];
  const rotationMenu = rotations.map((a) => {
    return {
      type: "button",
      id: a == 360 ? "do a barrel roll~" : `${a}-based`,
      label: a == 360 ? "do a barrel roll~" : `Rotate ${a}\xB0`,
      iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(CanvasIcon, null),
      action: async () => {
        const blob = await rotateImage(url, a);
        const buffer = Buffer.from(await blob.arrayBuffer());
        const urlLocal = URL.createObjectURL(blob);
        openMedia(urlLocal, a == 360, buffer);
      }
    };
  });
  const deepFryIntensities = [1.5, 2, 3, 4];
  const deepFryMenu = deepFryIntensities.map((intensity) => {
    return {
      type: "button",
      id: `deepfry-${intensity}`,
      label: intensity >= 3 ? `Nuclear Fry (${intensity}x)` : `Deep Fry (${intensity}x)`,
      iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(FireIcon, null),
      action: async () => {
        const blob = await deepFryImage(url, intensity);
        const buffer = Buffer.from(await blob.arrayBuffer());
        const urlLocal = URL.createObjectURL(blob);
        openMedia(urlLocal, false, buffer);
      }
    };
  });
  const glowOptions = [
    { color: "#00ff00", name: "Matrix Green", intensity: 20 },
    { color: "#ff0080", name: "Neon Pink", intensity: 25 },
    { color: "#00ffff", name: "Cyan", intensity: 20 },
    { color: "#ffff00", name: "Electric Yellow", intensity: 15 },
    { color: "#ff4500", name: "Fire Orange", intensity: 30 }
  ];
  const glowMenu = glowOptions.map((option) => {
    return {
      type: "button",
      id: `glow-${option.name.toLowerCase().replace(" ", "-")}`,
      label: option.name,
      iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(SparklesIcon, null),
      action: async () => {
        const blob = await addGlowEffect(url, option.color, option.intensity);
        const buffer = Buffer.from(await blob.arrayBuffer());
        const urlLocal = URL.createObjectURL(blob);
        openMedia(urlLocal, false, buffer);
      }
    };
  });
  const pfpOptions = [
    { color: "#7289da", name: "Discord Blue", width: 8 },
    { color: "#ff0000", name: "Red Border", width: 10 },
    { color: "#00ff00", name: "Green Border", width: 8 },
    { color: "#ffff00", name: "Gold Border", width: 12 },
    { color: "#ff00ff", name: "Magenta Border", width: 8 }
  ];
  const pfpMenu = pfpOptions.map((option) => {
    return {
      type: "button",
      id: `pfp-${option.name.toLowerCase().replace(" ", "-")}`,
      label: option.name,
      iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(UserCircleIcon, null),
      action: async () => {
        const blob = await makeCircularPfp(url, option.color, option.width);
        const buffer = Buffer.from(await blob.arrayBuffer());
        const urlLocal = URL.createObjectURL(blob);
        openMedia(urlLocal, false, buffer);
      }
    };
  });
  const rgbShiftIntensities = [3, 5, 8, 12, 20];
  const rgbShiftMenu = rgbShiftIntensities.map((offset) => {
    return {
      type: "button",
      id: `rgb-shift-${offset}`,
      label: offset >= 12 ? `Glitch Hard (${offset}px)` : `RGB Shift (${offset}px)`,
      iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(ZapIcon, null),
      action: async () => {
        const blob = await rgbShift(url, offset);
        const buffer = Buffer.from(await blob.arrayBuffer());
        const urlLocal = URL.createObjectURL(blob);
        openMedia(urlLocal, false, buffer);
      }
    };
  });
  return [
    {
      type: "submenu",
      id: "rotation-menu",
      label: "Rotations",
      items: rotationMenu,
      iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(RotateIcon, null)
    },
    {
      type: "submenu",
      id: "deepfry-menu",
      label: "Deep Fry",
      items: deepFryMenu,
      iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(FireIcon, null)
    },
    {
      type: "submenu",
      id: "glow-menu",
      label: "Glow Effects",
      items: glowMenu,
      iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(SparklesIcon, null)
    },
    {
      type: "submenu",
      id: "pfp-menu",
      label: "Profile Pictures",
      items: pfpMenu,
      iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(UserCircleIcon, null)
    },
    {
      type: "submenu",
      id: "rgb-menu",
      label: "RGB Glitch",
      items: rgbShiftMenu,
      iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(ZapIcon, null)
    }
  ];
}
var provider = /\/external\/[^\/]+\/https\/([^\/]+)/;
function getImageProvider(imageArgs, mainURL) {
  const potentialDiscordUrl = imageArgs?.src || imageArgs?.original;
  if (potentialDiscordUrl && potentialDiscordUrl.includes("discordapp")) {
    const providerMatch = provider.exec(potentialDiscordUrl);
    if (providerMatch && providerMatch[1]) {
      return providerMatch[1].toUpperCase();
    }
  }
  if (mainURL) {
    const domain = extractDomain(mainURL);
    return domain ? domain.toUpperCase() : "UNKNOWN";
  }
  return "UNKNOWN";
}
var useSetting = (key, defaultValue) => {
  const [value, setValue] = React.useState(() => settingsStore.getSetting(key, defaultValue));
  React.useEffect(() => {
    const updateValue = () => {
      setValue(settingsStore.getSetting(key, defaultValue));
    };
    settingsStore.addChangeListener(updateValue);
    return () => {
      settingsStore.removeChangeListener(updateValue);
    };
  }, [key, defaultValue]);
  const setSetting = (newValue) => {
    settingsStore.setSetting(key, newValue);
  };
  return [value, setSetting];
};
var getMessageEmojis = (message) => {
  const guildEmojis = EmojiStore.getGuilds();
  const emojiMatches = [...message.content.matchAll(/<a?:(.*?):(\d+)>/g)];
  const guilds = Object.values(guildEmojis);
  const foundEmojis = [];
  for (const match of emojiMatches) {
    const emojiId = match[2];
    const emojiName = match[1];
    for (const guild of guilds) {
      if (guild._emojiMap && guild._emojiMap[emojiId]) {
        foundEmojis.push(guild._emojiMap[emojiId]);
        break;
      } else {
        foundEmojis.push({ id: emojiId, name: emojiName });
        break;
      }
    }
  }
  return foundEmojis;
};
var BetterMedia = class {
  async start() {
    DataStore.settings ??= settings;
    DOM.addStyle("BetterMedia", css);
    Patcher.after(ImageComp, "render", (_, args, res) => {
      args[0].srcIsAnimated = true;
      const isThirdPartyFailure = args[0].src === "";
      const imageParent = res.props?.focusTarget?.current;
      const mainURL = isThirdPartyFailure ? args[0].original : args[0].dataSafeSrc || args[0].src || args[0].original;
      const imageProvider = getImageProvider(args[0], mainURL);
      if (res.props?.focusTarget?.current != null) {
        res.props.children.props.children.push(
          /* @__PURE__ */ BdApi.React.createElement(
            MediaContainer,
            {
              provider: imageProvider,
              url: mainURL,
              width: imageParent.clientWidth ?? 102,
              isThirdParty: Boolean(args[0]?.dataSafeSrc)
            }
          )
        );
      }
    });
    Patcher.before(
      Webpack.getByStrings(".shouldHideMediaOptions", "hasMediaOptions:", "numMediaItems:", {
        searchExports: true,
        raw: true
      }).exports,
      "K",
      (_, args) => {
        if (args[0].BetterMediaModal !== void 0 || args[0].location === "ChannelAttachmentUpload" || DataStore.settings.enabledGallery == false) {
          return;
        }
        if (!args[0].items?.length) return;
        const selectedItem = args[0].items[0];
        const selectedUrl = selectedItem?.url;
        const selectedId = selectedItem?.id;
        const messages = MessageStore.getMessages(SelectedChannelStore.getChannelId())._array;
        const processUrl = (url) => url?.replace(/\.webp(\?|$)/i, ".png$1");
        const mediaMap = /* @__PURE__ */ new Map();
        messages.forEach((message) => {
          message.attachments?.forEach((attachment) => {
            if (attachment.url && attachment.height) {
              const url = processUrl(attachment.url);
              if (!mediaMap.has(attachment.id)) {
                mediaMap.set(attachment.id, {
                  id: attachment.id,
                  url,
                  original: url,
                  proxyUrl: url,
                  animated: true,
                  type: "IMAGE",
                  height: attachment.height,
                  width: attachment.width,
                  messageId: message.id,
                  sourceMetadata: { message }
                });
              }
            }
          });
          message.embeds?.forEach((embed, embedIndex) => {
            if (embed.video?.proxyURL) {
              const uniqueId = `${message.id}-embed-${embedIndex}`;
              if (!mediaMap.has(uniqueId)) {
                mediaMap.set(uniqueId, {
                  id: uniqueId,
                  url: embed.url,
                  proxyUrl: embed.video.proxyURL,
                  width: embed.video.width || 500,
                  height: embed.video.height || 500,
                  type: "IMAGE",
                  messageId: message.id,
                  children: ({ size, src: poster }) => {
                    return React.createElement("video", {
                      ...size,
                      alt: "GIF",
                      poster,
                      src: embed.video.proxyURL,
                      autoPlay: true,
                      loop: true
                    });
                  }
                });
              }
            } else if (embed.image?.proxyURL) {
              const uniqueId = `${message.id}-embed-${embedIndex}`;
              const url = processUrl(embed.image.proxyURL);
              if (!mediaMap.has(uniqueId)) {
                mediaMap.set(uniqueId, {
                  id: uniqueId,
                  url,
                  original: url,
                  proxyUrl: url,
                  animated: true,
                  type: "IMAGE",
                  height: embed.image.height,
                  width: embed.image.width,
                  messageId: message.id,
                  sourceMetadata: { message }
                });
              }
            }
          });
        });
        let mediaItems = Array.from(mediaMap.values());
        DataStore.settings.reverseModalGallery ? mediaItems.push(selectedItem) : mediaItems.unshift(selectedItem);
        const yeah = DataStore.settings.reverseModalGallery ? mediaItems.reverse() : mediaItems;
        args[0].startingIndex = yeah.findIndex((x) => x.url === selectedUrl) || 0;
        args[0].items = yeah;
      }
    );
    Patcher.instead(ImageRenderComponent.uo, "test", (a, b, c) => {
      if (DataStore.settings.allImagesAreGifs) {
        return true;
      }
      return c(...b);
    });
    ContextMenu.patch("user-context", this.AUCM);
    ContextMenu.patch("image-context", this.AICM);
    ContextMenu.patch("guild-context", this.SICM);
    ContextMenu.patch("message", this.MICM);
  }
  MICM(res, props) {
    const { message } = props;
    const emojis = getMessageEmojis(message);
    const emojiItems = emojis.map((x) => {
      const img = `https://cdn.discordapp.com/emojis/${x.id}.webp?size=24${x.animated ? "&animated=true" : ""}`;
      return {
        label: x.name,
        id: x.id + Math.random(),
        type: "submenu",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement("img", { src: img }),
        items: [
          {
            type: "button",
            label: "Copy Emoji Link",
            action: () => copyURL(img)
          },
          {
            type: "button",
            label: "Open Emoji",
            action: () => openMedia(
              img.replace("?size=24", "?size=4096") + "&animated=true",
              false,
              void 0,
              false
            )
          },
          {
            type: "submenu",
            id: "reverse-search",
            label: "Reverse Search",
            iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(SearchIcon, null),
            items: buildSearchMenu(img)
          }
        ]
      };
    });
    const stickerItems = message.stickerItems?.map((stickerId) => {
      const x = StickersStore.getStickerById(stickerId.id);
      const img = `https://media.discordapp.net/stickers/${x.id}.webp?size=24${x.animated ? "&animated=true" : ""}`;
      const owo = img.replace("?size=24", "?size=512") + "&animated=true";
      return {
        label: x.name,
        id: x.id + Math.random(),
        type: "submenu",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement("img", { src: img }),
        items: [
          {
            type: "button",
            label: "Copy Sticker Link",
            action: () => copyURL(owo)
          },
          {
            type: "button",
            label: "Open Sticker",
            action: () => openMedia(owo, false, void 0, false)
          },
          {
            type: "submenu",
            id: "reverse-search",
            label: "Reverse Search",
            iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(SearchIcon, null),
            items: buildSearchMenu(img)
          }
        ]
      };
    }) || [];
    const betterMediaMenu = {
      type: "submenu",
      id: "better-media",
      label: "BetterMedia",
      iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(MainMenuIcon, null),
      items: [...emojiItems, ...stickerItems]
    };
    if (emojiItems.length > 0 || stickerItems.length > 0) {
      res.props.children.props.children.push(ContextMenu.buildItem(betterMediaMenu));
    }
  }
  AICM(res, props) {
    const url = props.src;
    const buildProfilePictureMenu = () => {
      return [
        {
          type: "submenu",
          id: "reverse-search",
          label: "Reverse Search",
          iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(SearchIcon, null),
          items: buildSearchMenu(url)
        },
        {
          type: "submenu",
          id: "canvas-methods",
          label: "Canvas Methods",
          iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(CanvasIcon, null),
          items: createCanvasMenu(url)
        }
      ];
    };
    const betterMediaMenu = {
      type: "submenu",
      id: "better-media",
      label: "BetterMedia",
      iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(MainMenuIcon, null),
      items: buildProfilePictureMenu()
    };
    res.props.children.push(ContextMenu.buildItem(betterMediaMenu));
  }
  AUCM(res, props) {
    const { user } = props;
    const isInGuild = GuildStoreCurrent.getGuildId() != null;
    const currentGuildId = GuildStoreCurrent.getGuildId();
    const userProfile = UserProfileStore.getUserProfile(user.id);
    const guildMemberProfile = isInGuild ? UserProfileStore.getGuildMemberProfile(user.id, currentGuildId) : null;
    const guildMember = isInGuild ? GuildMemberStore.getMember(currentGuildId, user.id) : null;
    const normalImg = mediautils.getUserAvatarURL(
      { id: user.id, avatar: user.avatar, discriminator: null },
      true,
      4096,
      "png",
      false
    );
    const normalBanner = mediautils.getUserBannerURL({
      id: user.id,
      banner: userProfile?.banner,
      size: 4096,
      canAnimate: true
    });
    const guildImg = isInGuild ? mediautils.getGuildMemberAvatarURL(
      {
        guildId: currentGuildId,
        userId: user.id,
        avatar: guildMember?.avatar,
        discriminator: null
      },
      true,
      4096,
      "png",
      false
    )?.replace("?size=96", "?size=4096") : null;
    const guildBanner = isInGuild ? mediautils.getGuildMemberBannerURL({
      id: user.id,
      guildId: currentGuildId,
      banner: guildMemberProfile?.banner,
      size: 4096,
      canAnimate: true
    }) : null;
    const isAnimatedAvatar = user.avatar && user.avatar.startsWith("a_");
    const isAnimatedBanner = userProfile?.banner && userProfile.banner.startsWith("a_");
    const isAnimatedGuildBanner = guildMemberProfile?.banner && guildMemberProfile.banner.startsWith("a_");
    const animatedNormalImg = isAnimatedAvatar ? normalImg.replace(".png", ".gif").replace(".webp", ".gif") : null;
    const animatedNormalBanner = isAnimatedBanner ? normalBanner.replace(".png", ".gif").replace(".webp", ".gif") : null;
    const animatedGuildImg = isAnimatedAvatar && guildImg ? guildImg.replace(".png", ".gif").replace(".webp", ".gif") : null;
    const animatedGuildBanner = isAnimatedGuildBanner && guildBanner ? guildBanner.replace(".png", ".gif").replace(".webp", ".gif") : null;
    const avatarItems = [];
    if (normalImg) {
      avatarItems.push({
        type: "button",
        id: "open-profile-avatar",
        label: "Open Profile Avatar",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(ImageIcon, null),
        action: () => openMedia(normalImg)
      });
      if (isAnimatedAvatar && animatedNormalImg) {
        avatarItems.push({
          type: "button",
          id: "open-profile-avatar-animated",
          label: "Open Profile Avatar (Animated)",
          iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(ImageIcon, null),
          action: () => openMedia(animatedNormalImg)
        });
      }
      avatarItems.push({
        type: "button",
        id: "copy-profile-avatar",
        label: "Copy Profile Avatar URL",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(CopyIcon, null),
        action: () => copyURL(normalImg)
      });
      if (isAnimatedAvatar && animatedNormalImg) {
        avatarItems.push({
          type: "button",
          id: "copy-profile-avatar-animated",
          label: "Copy Profile Avatar URL (Animated)",
          iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(CopyIcon, null),
          action: () => copyURL(animatedNormalImg)
        });
      }
    }
    const bannerItems = [];
    if (normalBanner) {
      bannerItems.push({
        type: "button",
        id: "open-profile-banner",
        label: "Open Profile Banner",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(BannerIcon, null),
        action: () => openMedia(normalBanner)
      });
      if (isAnimatedBanner && animatedNormalBanner) {
        bannerItems.push({
          type: "button",
          id: "open-profile-banner-animated",
          label: "Open Profile Banner (Animated)",
          iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(BannerIcon, null),
          action: () => openMedia(animatedNormalBanner)
        });
      }
      bannerItems.push({
        type: "button",
        id: "copy-profile-banner",
        label: "Copy Profile Banner URL",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(CopyIcon, null),
        action: () => copyURL(normalBanner)
      });
      if (isAnimatedBanner && animatedNormalBanner) {
        bannerItems.push({
          type: "button",
          id: "copy-profile-banner-animated",
          label: "Copy Profile Banner URL (Animated)",
          iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(CopyIcon, null),
          action: () => copyURL(animatedNormalBanner)
        });
      }
    }
    const guildItems = [];
    if (isInGuild && guildImg) {
      guildItems.push({
        type: "button",
        id: "open-guild-avatar",
        label: "Open Guild Avatar",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(GuildIcon, null),
        action: () => openMedia(guildImg)
      });
      if (isAnimatedAvatar && animatedGuildImg) {
        guildItems.push({
          type: "button",
          id: "open-guild-avatar-animated",
          label: "Open Guild Avatar (Animated)",
          iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(GuildIcon, null),
          action: () => openMedia(animatedGuildImg)
        });
      }
      guildItems.push({
        type: "button",
        id: "copy-guild-avatar",
        label: "Copy Guild Avatar URL",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(CopyIcon, null),
        action: () => copyURL(guildImg)
      });
      if (isAnimatedAvatar && animatedGuildImg) {
        guildItems.push({
          type: "button",
          id: "copy-guild-avatar-animated",
          label: "Copy Guild Avatar URL (Animated)",
          iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(CopyIcon, null),
          action: () => copyURL(animatedGuildImg)
        });
      }
    }
    if (isInGuild && guildBanner) {
      if (guildItems.length > 0) {
        guildItems.push({ type: "separator" });
      }
      guildItems.push({
        type: "button",
        id: "open-guild-banner",
        label: "Open Guild Banner",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(BannerIcon, null),
        action: () => openMedia(guildBanner)
      });
      if (isAnimatedGuildBanner && animatedGuildBanner) {
        guildItems.push({
          type: "button",
          id: "open-guild-banner-animated",
          label: "Open Guild Banner (Animated)",
          iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(BannerIcon, null),
          action: () => openMedia(animatedGuildBanner)
        });
      }
      guildItems.push({
        type: "button",
        id: "copy-guild-banner",
        label: "Copy Guild Banner URL",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(CopyIcon, null),
        action: () => copyURL(guildBanner)
      });
      if (isAnimatedGuildBanner && animatedGuildBanner) {
        guildItems.push({
          type: "button",
          id: "copy-guild-banner-animated",
          label: "Copy Guild Banner URL (Animated)",
          iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(CopyIcon, null),
          action: () => copyURL(animatedGuildBanner)
        });
      }
    }
    const advancedItems = [];
    if (normalImg) {
      advancedItems.push({
        type: "submenu",
        id: "reverse-search-profile-avatar",
        label: "Reverse Search Profile Avatar",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(SearchIcon, null),
        items: buildSearchMenu(normalImg)
      });
      DataStore.settings.canvasFeatures && advancedItems.push({
        type: "submenu",
        id: "canvas-methods-profile-avatar",
        label: "Canvas Methods (Profile Avatar)",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(CanvasIcon, null),
        items: createCanvasMenu(normalImg)
      });
    }
    if (isInGuild && guildImg) {
      advancedItems.push({
        type: "submenu",
        id: "reverse-search-guild-avatar",
        label: "Reverse Search Guild Avatar",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(SearchIcon, null),
        items: buildSearchMenu(guildImg)
      });
      DataStore.settings.canvasFeatures && advancedItems.push({
        type: "submenu",
        id: "canvas-methods-guild-avatar",
        label: "Canvas Methods (Guild Avatar)",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(CanvasIcon, null),
        items: createCanvasMenu(guildImg)
      });
    }
    if (normalBanner) {
      advancedItems.push({
        type: "submenu",
        id: "reverse-search-profile-banner",
        label: "Reverse Search Profile Banner",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(SearchIcon, null),
        items: buildSearchMenu(normalBanner)
      });
      DataStore.settings.canvasFeatures && advancedItems.push({
        type: "submenu",
        id: "canvas-methods-profile-banner",
        label: "Canvas Methods (Profile Banner)",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(CanvasIcon, null),
        items: createCanvasMenu(normalBanner)
      });
    }
    if (isInGuild && guildBanner) {
      advancedItems.push({
        type: "submenu",
        id: "reverse-search-guild-banner",
        label: "Reverse Search Guild Banner",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(SearchIcon, null),
        items: buildSearchMenu(guildBanner)
      });
      DataStore.settings.canvasFeatures && advancedItems.push({
        type: "submenu",
        id: "canvas-methods-guild-banner",
        label: "Canvas Methods (Guild Banner)",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(CanvasIcon, null),
        items: createCanvasMenu(guildBanner)
      });
    }
    const betterMediaItems = [];
    if (avatarItems.length > 0) {
      betterMediaItems.push({
        type: "submenu",
        id: "avatar-folder",
        label: "Avatar",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(ImageIcon, null),
        items: avatarItems
      });
    }
    if (bannerItems.length > 0) {
      betterMediaItems.push({
        type: "submenu",
        id: "banner-folder",
        label: "Banner",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(BannerIcon, null),
        items: bannerItems
      });
    }
    if (guildItems.length > 0) {
      betterMediaItems.push({
        type: "submenu",
        id: "guild-folder",
        label: "Server Profile",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(GuildIcon, null),
        items: guildItems
      });
    }
    if (advancedItems.length > 0) {
      betterMediaItems.push({
        type: "submenu",
        id: "advanced-folder",
        label: "Advanced Options",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(SearchIcon, null),
        items: advancedItems
      });
    }
    if (betterMediaItems.length > 0) {
      const betterMediaMenu = {
        type: "submenu",
        id: "better-media",
        label: "BetterMedia",
        iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(MainMenuIcon, null),
        items: betterMediaItems
      };
      res.props.children.push(ContextMenu.buildItem({ type: "separator" }));
      res.props.children.push(ContextMenu.buildItem(betterMediaMenu));
    }
  }
  getSettingsPanel() {
    return () => {
      const elements = Object.entries({ ...settings }).map((object, array) => {
        const settingObject = settings[object[0]];
        if (!DataStore.settings.hasOwnProperty(object[0])) {
          DataStore.settings[object[0]] = settingObject.value;
        }
        const [showObject, setShowObject] = useSetting(object[0], DataStore.settings[object[0]]);
        return /* @__PURE__ */ BdApi.React.createElement(
          FormSwitch,
          {
            description: settingObject.note,
            label: settingObject.title,
            checked: showObject,
            onChange: setShowObject
          }
        );
      });
      return elements;
    };
  }
  SICM = (res, props) => {
    const guild = props.guild;
    const betterMediaMenu = {
      type: "submenu",
      id: "better-media-guild",
      label: "BetterMedia",
      iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(MainMenuIcon, null),
      items: [
        {
          type: "button",
          id: "open-guild-icon",
          label: "Open Guild Icon",
          iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(GuildIcon, null),
          action: () => {
            const guildIcon = mediautils.getGuildIconURL({
              id: guild.id,
              icon: guild.icon,
              size: 4096
            });
            openMedia(guildIcon, false, void 0, false);
          }
        },
        {
          type: "button",
          id: "copy-guild-icon",
          label: "Copy Guild Icon URL",
          iconLeft: () => /* @__PURE__ */ BdApi.React.createElement(CopyIcon, null),
          action: () => {
            const guildIcon = mediautils.getGuildIconURL({
              id: guild.id,
              icon: guild.icon,
              size: 4096
            });
            copyURL(guildIcon);
          }
        }
      ]
    };
    res.props.children.push(ContextMenu.buildItem(betterMediaMenu));
  };
  stop() {
    DOM.removeStyle("BetterMedia");
    Patcher.unpatchAll();
    ContextMenu.unpatch("user-context", this.AUCM);
    ContextMenu.unpatch("message", this.MICM);
    ContextMenu.unpatch("image-context", this.AICM);
    ContextMenu.unpatch("guild-context", this.SICM);
  }
};
