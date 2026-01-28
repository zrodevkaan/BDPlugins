/**
 * @name BetterExpressionMenu
 * @description Adds more options to the expression popup
 * @version 1.0.0
 * @author Kaan
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

// src/BetterExpressionMenu/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => BetterExpressionMenu,
  timestampToSnowflake: () => timestampToSnowflake
});
module.exports = __toCommonJS(index_exports);
var { React, Webpack, Patcher, Utils, DOM, Components, Net, Data, ContextMenu } = new BdApi("BetterExpressionMenu");
var { SearchInput, DropdownInput, Tooltip, TextInput, Button: BetterDiscordButton } = Components;
var Buttons = Webpack.getBySource("isSubmitButtonEnabled", ".A.getActiveOption(");
var SwitchInput = Webpack.getByStrings('data-toggleable-component":"switch', { searchExports: true });
var Button = Webpack.getByStrings("TRIAL_NUX_EMOJI_BUTTON");
var Classes = Webpack.getByKeys("announcementScrollableContainer");
var Popout = Webpack.getModule((m) => m?.Animation, { searchExports: true, raw: true }).exports.Y;
var DataProtobuf = Webpack.getModule((m) => m?.updateAsync, { searchExports: true });
var EmojiStore = Webpack.getStore("EmojiStore");
var GuildStore = Webpack.getStore("GuildStore");
var Helpers = Webpack.getByKeys("getEmojiURL");
var ProtobufSaveLink = Webpack.getByStrings(".GIF_FAVORITED", { searchExports: true });
var WarningMessage = Webpack.getByStrings("messageType:", "textColor", { searchExports: true });
var mods = Webpack.getByKeys("getSendMessageOptionsForReply");
var SelectedChannelStore = Webpack.getStore("SelectedChannelStore");
var PendingReplyStore = Webpack.getStore("PendingReplyStore");
var ComponentDispatch = Webpack.getModule((m) => m.dispatchToLastSubscribed && m.emitter?._events?.FOCUS_SEARCH, { searchExports: true });
function reconstructProvider(saved) {
  return {
    ...saved,
    api: (tags, limit = 100) => {
      return saved.apiTemplate.replace("${tags}", saved.singleArg ? tags.split(" ")[0] : tags.split(" ").join("+")).replace("${limit}", limit);
    },
    mapToFile: new Function("item", `return ${saved.mapPath}`)
  };
}
var providers = [
  {
    type: "safeboruu",
    api: (tags, limit = 100) => `https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&tags=${tags}&limit=${limit}`,
    maxResults: 100,
    mapToFile: (item) => item.file_url,
    native: true
  },
  {
    type: "nekos_best",
    api: (tags, limit = 100) => `https://nekos.best/api/v2/search?query=${tags}&type=1&amount=${limit}`,
    returnsExtraArg: true,
    toplevelArg: "results",
    maxResults: 100,
    mapToFile: (item) => item.url
  },
  {
    type: "nekosia",
    api: (tags, limit = 20) => `https://api.nekosia.cat/api/v1/images/${tags}?count=${limit}`,
    returnsExtraArg: true,
    toplevelArg: "images",
    maxResults: 20,
    mapToFile: (item) => item.image?.original?.url,
    singleArg: true
  },
  {
    type: "giphy",
    api: (tags, limit = 100, page = 0) => `https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(tags)}&limit=${limit}&api_key=Gc7131jiJuvI7IdN0HZ1D7nh0ow5BU6g${page != 0 ? `&offset=${page}` : ""}`,
    returnsExtraArg: true,
    toplevelArg: "data",
    maxResults: 100,
    hasPagination: true,
    mapToFile: (item) => item.images.source.url,
    singleArg: true
  }
];
function SettingsComponent() {
  const [customProviders, setCustomProviders] = React.useState(() => {
    const saved = Data.load("customProviders") || [];
    return saved.map((p) => ({
      ...p,
      api: (tags, limit = 100) => {
        return p.apiTemplate.replace("${tags}", p.singleArg ? tags.split(" ")[0] : tags.split(" ").join("+")).replace("${limit}", limit);
      },
      mapToFile: new Function("item", `return ${p.mapPath}`)
    }));
  });
  const [name, setName] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [isNative, setIsNative] = React.useState("");
  const [mapPath, setMapPath] = React.useState("item.file_url");
  const [toplevelArg, setToplevelArg] = React.useState("data");
  const add = () => {
    if (!name || !url) return;
    const serializableProvider = {
      type: name,
      apiTemplate: url,
      mapPath,
      returnsExtraArg: Boolean(toplevelArg),
      toplevelArg,
      maxResults: 100,
      native: isNative,
      singleArg: false
    };
    const fullProvider = {
      ...serializableProvider,
      api: (tags, limit = 100) => {
        return url.replace("${tags}", tags.split(" ").join("+")).replace("${limit}", limit);
      },
      mapToFile: new Function("item", `return ${mapPath}`)
    };
    const updatedFull = [...customProviders, fullProvider];
    setCustomProviders(updatedFull);
    const savedProviders = Data.load("customProviders") || [];
    Data.save("customProviders", [...savedProviders, serializableProvider]);
    setName("");
    setUrl("");
    setMapPath("item.file_url");
  };
  const remove = (i) => {
    const updated = customProviders.filter((_, idx) => idx !== i);
    setCustomProviders(updated);
    const serializableData = updated.map((p) => ({
      type: p.type,
      apiTemplate: p.apiTemplate,
      mapPath: p.mapPath,
      returnsExtraArg: p.returnsExtraArg,
      toplevelArg: p.toplevelArg,
      maxResults: p.maxResults,
      native: p.native,
      singleArg: p.singleArg
    }));
    Data.save("customProviders", serializableData);
  };
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "bem-settings-container" }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "bem-settings-form" }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "bem-settings-hint" }, "Use $", "{tags}", " and $", "{limit}", " as placeholders"), /* @__PURE__ */ BdApi.React.createElement(
    TextInput,
    {
      placeholder: "Name (e.g., example.com)",
      value: name,
      onChange: setName
    }
  ), /* @__PURE__ */ BdApi.React.createElement(
    TextInput,
    {
      placeholder: "API URL with ${tags} and ${limit}",
      value: url,
      onChange: setUrl
    }
  ), /* @__PURE__ */ BdApi.React.createElement(
    TextInput,
    {
      placeholder: "Path to image (e.g., item.file_url)",
      value: mapPath,
      onChange: setMapPath
    }
  ), /* @__PURE__ */ BdApi.React.createElement(
    TextInput,
    {
      placeholder: "If a posts are inside a toplevel argument, specify it here (e.g., data)",
      value: toplevelArg,
      onChange: setToplevelArg
    }
  ), /* @__PURE__ */ BdApi.React.createElement("div", null, "Native Fetch:", /* @__PURE__ */ BdApi.React.createElement(
    SwitchInput,
    {
      id: "native-switch",
      value: isNative,
      onChange: setIsNative
    }
  )), /* @__PURE__ */ BdApi.React.createElement(
    BetterDiscordButton,
    {
      onClick: add,
      className: "bem-add-button"
    },
    "Add Provider"
  )), /* @__PURE__ */ BdApi.React.createElement("div", null, customProviders.map((p, i) => /* @__PURE__ */ BdApi.React.createElement("div", { key: i, className: "bem-provider-item" }, /* @__PURE__ */ BdApi.React.createElement("div", null, /* @__PURE__ */ BdApi.React.createElement("div", { className: "bem-provider-name" }, p.type), /* @__PURE__ */ BdApi.React.createElement("div", { className: "bem-provider-path" }, p.mapPath)), /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      onClick: () => remove(i),
      className: "bem-delete-button"
    },
    "Delete"
  )))));
}
function normalizeData(provider, rawData) {
  if (!rawData) return [];
  const data = provider.returnsExtraArg ? rawData[provider.toplevelArg] : rawData;
  return (Array.isArray(data) ? data : []).map((item) => {
    const link = provider.mapToFile(item);
    return {
      file_url: link,
      type: link.endsWith(".mp4") || link.endsWith(".mov") ? "video" : "gif"
    };
  }).filter((item) => !!item.file_url);
}
function SVGButton() {
  return /* @__PURE__ */ BdApi.React.createElement("svg", { className: "bem-svg-button", xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 48 48", fill: "var(--interactive-icon-default)" }, /* @__PURE__ */ BdApi.React.createElement("g", { fill: "none", stroke: "var(--interactive-icon-default)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "4" }, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M6 9a3 3 0 0 1 3-3h30a3 3 0 0 1 3 3v30a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9ZM4 24h40M24 44V4M6 30V18m36 12V18M30 42H18M30 6H18" }), /* @__PURE__ */ BdApi.React.createElement("path", { d: "M24 24s7.897-3.546 9.099-4.747a3.077 3.077 0 1 0-4.352-4.352C27.546 16.103 24 24 24 24Zm0 0s-7.897-3.546-9.099-4.747m9.1 4.747s-3.547-7.897-4.748-9.099M24 24s7.897 3.546 9.099 4.747M24 24s3.546 7.897 4.747 9.099M24 23.999s-7.897 3.547-9.099 4.748a3.077 3.077 0 1 0 4.352 4.352c1.201-1.202 4.747-9.1 4.747-9.1Z" })));
}
var timestampToSnowflake = (timestamp) => {
  const DISCORD_EPOCH = BigInt(14200704e5);
  const SHIFT = BigInt(22);
  const ms = BigInt(timestamp) - DISCORD_EPOCH;
  return ms <= BigInt(0) ? "0" : (ms << SHIFT).toString();
};
function sendMessage(src) {
  const channelId = SelectedChannelStore.getChannelId();
  const replyOptions = mods.getSendMessageOptionsForReply(
    PendingReplyStore.getPendingReply(channelId)
  );
  const messagePayload = {
    flags: 0,
    channel_id: channelId,
    content: src,
    sticker_ids: [],
    validNonShortcutEmojis: [],
    type: 0,
    messageReference: replyOptions?.messageReference || null,
    nonce: timestampToSnowflake(Date.now())
  };
  mods.sendMessage(channelId, messagePayload, null, {
    onAttachmentUploadError: () => false,
    ...messagePayload
  });
}
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
function GifItem({ gif, gifKey }) {
  const [isVisible, setIsVisible] = React.useState(false);
  const placeholderRef = React.useRef(null);
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (placeholderRef.current) {
      observer.observe(placeholderRef.current);
    }
    return () => observer.disconnect();
  }, []);
  if (!isVisible) return /* @__PURE__ */ BdApi.React.createElement("div", { ref: placeholderRef, className: "bem-gif-placeholder" });
  const messageToSend = gif.src?.startsWith("https://media1.tenor.com") ? gif.src : gifKey;
  const menuStuff = () => {
    return ContextMenu.buildMenu([{
      type: "submenu",
      label: "BetterExpressionMenu",
      items: [
        {
          type: "button",
          label: "Copy Gif Source",
          action: () => setClipboard(messageToSend)
        }
      ]
    }]);
  };
  if (gif.format === 2) {
    return /* @__PURE__ */ BdApi.React.createElement(
      "video",
      {
        src: gif.src,
        className: "bem-gif-video",
        autoPlay: true,
        loop: true,
        style: { cursor: "pointer" },
        muted: true,
        onContextMenu: (e) => ContextMenu.open(e, menuStuff()),
        loading: "lazy",
        menuStuff: true,
        onClick: (e) => !e.shiftKey ? sendMessage(messageToSend) : ComponentDispatch.dispatchToLastSubscribed("INSERT_TEXT", { plainText: messageToSend, rawText: messageToSend })
      }
    );
  }
  return /* @__PURE__ */ BdApi.React.createElement(
    "img",
    {
      src: gif.src,
      alt: "gif",
      style: { cursor: "pointer" },
      className: "bem-gif-image",
      loading: "lazy",
      onContextMenu: (e) => ContextMenu.open(e, menuStuff()),
      onClick: (e) => !e.shiftKey ? sendMessage(messageToSend) : ComponentDispatch.dispatchToLastSubscribed("INSERT_TEXT", { plainText: messageToSend, rawText: messageToSend })
    }
  );
}
function FavoritesComponent({ query }) {
  const [gifs, setGifs] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [favorite, setFavorite] = React.useState(null);
  const containerRef = React.useRef();
  const ITEMS_PER_PAGE = 20;
  React.useEffect(() => {
    const data = DataProtobuf.getCurrentValue();
    const favoriteGifs = data?.favoriteGifs?.gifs || [];
    setGifs(favoriteGifs);
  }, []);
  const sortedAndFilteredGifs = React.useMemo(() => {
    return Object.entries(gifs).sort(([, a], [, b]) => (a.order ?? 0) - (b.order ?? 0)).reverse().filter(([key, gif]) => {
      if (!query) return true;
      if (!gif.src) return false;
      return gif.src.toLowerCase().includes(query.toLowerCase());
    });
  }, [gifs, query]);
  React.useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollHeight - scrollTop - clientHeight < 200) {
        setPage((p) => {
          const maxPage = Math.ceil(sortedAndFilteredGifs.length / ITEMS_PER_PAGE) - 1;
          return Math.min(p + 1, maxPage);
        });
      }
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [sortedAndFilteredGifs]);
  React.useEffect(() => {
    if (favorite) {
      const image = new Image();
      image.onload = () => {
        const newGif = {
          width: image.width || 498,
          height: image.height || 498,
          format: favorite.endsWith(".mp4") || favorite.endsWith(".mov") || favorite.endsWith(".gif") ? 2 : 1,
          url: favorite,
          src: favorite
        };
        ProtobufSaveLink(newGif);
        const data = DataProtobuf.getCurrentValue();
        const favoriteGifs = data?.favoriteGifs?.gifs || [];
        setGifs(favoriteGifs);
        setFavorite(null);
      };
      image.onerror = () => {
        console.error("Failed to load image:", favorite);
        const newGif = {
          width: 498,
          height: 498,
          format: 1,
          src: favorite,
          url: favorite
        };
        ProtobufSaveLink(newGif);
        setFavorite(null);
      };
      image.src = favorite;
    }
  }, [favorite]);
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      ref: containerRef,
      className: "bem-favorites-container",
      style: {
        overflowY: "auto",
        maxHeight: "100vh",
        scrollbarWidth: "none",
        msOverflowStyle: "none"
      }
    },
    /* @__PURE__ */ BdApi.React.createElement("div", { className: "bem-gif-grid" }, sortedAndFilteredGifs.slice(0, (page + 1) * ITEMS_PER_PAGE).map(([key, gif]) => /* @__PURE__ */ BdApi.React.createElement("div", { key: gif.id, className: "bem-gif-grid-item" }, /* @__PURE__ */ BdApi.React.createElement(GifItem, { gif, gifKey: key }))))
  );
}
function GIFsComponent({ query }) {
  const [selectedProvider, setSelectedProvider] = React.useState(providers[0]);
  const [data, setData] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const containerRef = React.useRef(null);
  const customProviders = React.useMemo(() => {
    return (Data.load("customProviders") || []).map(reconstructProvider);
  }, []);
  const mainData = React.useMemo(() => {
    return [...providers, ...customProviders];
  }, [customProviders]);
  React.useEffect(() => {
    if (query) {
      const args = selectedProvider.api(
        selectedProvider?.singleArg ? query.split(" ")[0] : query.split(" ").join("+"),
        selectedProvider?.maxResults,
        page
      );
      async function fetchData() {
        const response = !selectedProvider?.native ? await fetch(args) : await Net.fetch(args);
        const json = await response.json();
        const normalized = normalizeData(selectedProvider, json);
        setData(normalized);
        if (containerRef.current) {
          containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
      fetchData();
    }
  }, [query, selectedProvider, page]);
  React.useEffect(() => {
    setPage(0);
  }, [query, selectedProvider]);
  const handleClick = (e, fileUrl) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.shiftKey) {
      sendMessage(fileUrl);
    } else {
      ComponentDispatch.dispatchToLastSubscribed("INSERT_TEXT", {
        plainText: fileUrl,
        rawText: fileUrl
      });
    }
  };
  const menuStuff = (messageToSend) => {
    return ContextMenu.buildMenu([{
      type: "submenu",
      label: "BetterExpressionMenu",
      items: [
        {
          type: "button",
          label: "Copy Gif Source",
          action: () => setClipboard(messageToSend)
        }
      ]
    }]);
  };
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "bem-gifs-container", ref: containerRef }, /* @__PURE__ */ BdApi.React.createElement(
    DropdownInput,
    {
      options: mainData.map((p) => ({ label: p.type, value: p.type })),
      onChange: (selectedType) => {
        const provider = mainData.find((p) => p.type === selectedType);
        if (provider) {
          setSelectedProvider(provider);
        }
      },
      value: selectedProvider.type
    }
  ), /* @__PURE__ */ BdApi.React.createElement("div", { className: "bem-gif-grid bem-gif-grid-margin" }, data && data.map((gif, index) => {
    return /* @__PURE__ */ BdApi.React.createElement(
      "div",
      {
        key: index,
        className: "bem-gif-grid-item",
        onClick: (e) => handleClick(e, gif.file_url),
        onContextMenu: (e) => ContextMenu.open(e, menuStuff(gif.file_url)),
        style: { cursor: "pointer" }
      },
      gif?.type !== "gif" ? /* @__PURE__ */ BdApi.React.createElement(
        "video",
        {
          className: "bem-gif-video",
          onLoadStart: (a) => {
            a.target.volume = 0;
          },
          loop: true,
          autoPlay: true,
          src: gif.file_url,
          style: { pointerEvents: "none" }
        }
      ) : /* @__PURE__ */ BdApi.React.createElement(
        "img",
        {
          src: gif.file_url,
          className: "bem-gif-image",
          style: { pointerEvents: "none" }
        }
      )
    );
  }), selectedProvider?.hasPagination && data != null && Object.values(data).length > 0 && /* @__PURE__ */ BdApi.React.createElement("div", { onClick: () => setPage((p) => p + 1), className: "bem-load-more" }, "Load More (Page ", page + 2, ")")));
}
function EmojiItem({ emoji }) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);
  if (!isVisible) {
    return /* @__PURE__ */ BdApi.React.createElement("div", { ref, className: "bem-emoji-placeholder" });
  }
  const parsedName = `:${emoji.name}:`;
  return /* @__PURE__ */ BdApi.React.createElement(Tooltip, { text: parsedName, position: "top" }, (props) => /* @__PURE__ */ BdApi.React.createElement(
    "img",
    {
      ...props,
      ref,
      src: Helpers.getEmojiURL({
        id: emoji.id,
        animated: true,
        size: 32
      }, false),
      onClick: (e) => {
        ComponentDispatch.dispatchToLastSubscribed("INSERT_TEXT", {
          plainText: parsedName,
          rawText: parsedName
        });
      },
      alt: emoji.name || "emoji",
      className: "bem-emoji-image"
    }
  ));
}
function EmojisComponent({ query }) {
  const [allEmojis, setAllEmojis] = React.useState(EmojiStore.getGuilds());
  const [hoveredEmoji, setHoveredEmoji] = React.useState(null);
  const allGuilds = GuildStore.getGuilds();
  const guildsArray = Object.values(allGuilds).filter((guild) => {
    const guildEmojis = allEmojis[guild.id]?.emojis || [];
    return guildEmojis.length > 0;
  });
  return /* @__PURE__ */ BdApi.React.createElement("div", null, /* @__PURE__ */ BdApi.React.createElement("div", { className: "bem-emojis-container" }, guildsArray.map((guild) => {
    const guildEmojis = allEmojis[guild.id]?.emojis || [];
    return /* @__PURE__ */ BdApi.React.createElement("div", { key: guild.id, className: "bem-guild-section" }, /* @__PURE__ */ BdApi.React.createElement("h2", { className: "bem-guild-header" }, /* @__PURE__ */ BdApi.React.createElement(
      "img",
      {
        src: Helpers.getGuildIconURL(guild),
        alt: "",
        className: "bem-guild-icon"
      }
    ), guild.name), guildEmojis.map((emoji) => /* @__PURE__ */ BdApi.React.createElement(EmojiItem, { key: emoji.id, emoji })));
  })), hoveredEmoji && /* @__PURE__ */ BdApi.React.createElement("div", null, hoveredEmoji.name));
}
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
    }
  }
);
function ExtraComponent({ query }) {
  const [favorite, setFavorite] = React.useState(null);
  const [consented, setConsented] = React.useState(DataStore.consented || false);
  const [localConsent, setLocalConsent] = React.useState(false);
  React.useEffect(() => {
    if (favorite) {
      const image = new Image();
      image.onload = () => {
        const newGif = {
          width: image.width || 498,
          height: image.height || 498,
          format: 1,
          url: favorite,
          src: favorite
        };
        ProtobufSaveLink(newGif);
        setFavorite(null);
      };
      image.onerror = () => {
        console.error("Failed to load image:", favorite);
        const newGif = {
          width: 498,
          height: 498,
          format: 1,
          src: favorite,
          url: favorite
        };
        ProtobufSaveLink(newGif);
        setFavorite(null);
      };
      image.src = favorite;
    }
  }, [favorite]);
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      className: "bem-min-width-bypass",
      style: {
        display: "flex",
        flexDirection: "column",
        padding: "8px",
        gap: "12px"
      }
    },
    /* @__PURE__ */ BdApi.React.createElement(WarningMessage, { messageType: "danger", textColor: "danger" }, /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "4px" } }, /* @__PURE__ */ BdApi.React.createElement("span", null, "Only direct image or GIF URLs are supported. Adding any other type of link may cause unexpected behavior or instability within Discord\u2019s GIF picker on desktop or mobile."), /* @__PURE__ */ BdApi.React.createElement("span", null), /* @__PURE__ */ BdApi.React.createElement("span", null, "By enabling this feature, you acknowledge and accept full responsibility for any resulting issues, including crashes or data loss. The developer provides this functionality \u201Cas is\u201D without any warranty or liability."))),
    !consented && /* @__PURE__ */ BdApi.React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: "10px",
          padding: "10px"
        }
      },
      /* @__PURE__ */ BdApi.React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px"
          }
        },
        /* @__PURE__ */ BdApi.React.createElement(
          "span",
          {
            style: {
              color: "white",
              fontSize: "14px",
              textAlign: "center",
              userSelect: "none"
            }
          },
          "I have read and agree to the disclaimer above."
        ),
        /* @__PURE__ */ BdApi.React.createElement(
          SwitchInput,
          {
            checked: localConsent || false,
            onChange: setLocalConsent,
            disabled: consented
          },
          "I Understand and Consent"
        )
      ),
      /* @__PURE__ */ BdApi.React.createElement(
        BetterDiscordButton,
        {
          style: {
            marginTop: "6px",
            backgroundColor: "#5865F2",
            color: "white",
            width: "fit-content"
          },
          onClick: () => {
            if (localConsent) {
              DataStore.consented = true;
              setConsented(true);
            } else {
              BdApi.UI.showToast(
                "Please toggle the switch first to confirm consent.",
                { type: "error" }
              );
            }
          }
        },
        "Confirm Consent"
      )
    ),
    consented && /* @__PURE__ */ BdApi.React.createElement(BdApi.React.Fragment, null, /* @__PURE__ */ BdApi.React.createElement(
      TextInput,
      {
        placeholder: "Paste Image/GIF link (e.g. https://i.imgur.com/example.gif)",
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            const input = e?.target;
            const value = input?.value || "";
            if (value.trim()) {
              setFavorite(value.trim());
            }
          }
        }
      }
    ), /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", gap: "8px", alignItems: "center" } }, /* @__PURE__ */ BdApi.React.createElement(BetterDiscordButton, { onClick: () => {
      const data = DataProtobuf.getCurrentValue();
      const favoriteGifs = data?.favoriteGifs?.gifs || [];
      DataStore.backupData = favoriteGifs;
    } }, "Backup Data"), DataStore.backupData && /* @__PURE__ */ BdApi.React.createElement(BetterDiscordButton, { onClick: () => {
      DataProtobuf.updateAsync("favoriteGifs", (data) => {
        if (DataStore.backupData && Object.values(DataStore.backupData).length > 0) {
          data.gifs = DataStore.backupData;
        }
      });
    } }, "Restore Data")))
  );
}
var tabs = [
  { id: "favorites", label: "Favorites", component: FavoritesComponent },
  { id: "gifs", label: "GIFs", component: GIFsComponent },
  { id: "emojis", label: "Emojis", component: EmojisComponent },
  { id: "extra", label: "Extras", component: ExtraComponent }
  // { id: 'youtube', label: "YouTube", component: YouTubeComponent }
];
function PanelNav() {
  const [activeTab, setActiveTab] = React.useState(tabs[0].id);
  const [query, setQuery] = React.useState("");
  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "bem-panel-container" }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "bem-panel-header" }, tabs.map((tab) => /* @__PURE__ */ BdApi.React.createElement(
    TabButton,
    {
      key: tab.id,
      label: tab.label,
      isActive: activeTab === tab.id,
      onClick: () => setActiveTab(tab.id)
    }
  )), (activeTab == "favorites" || activeTab == "gifs") && /* @__PURE__ */ BdApi.React.createElement(
    SearchInput,
    {
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          const input = e?.target;
          const value = input?.value || "";
          setQuery(value);
        }
      },
      placeholder: `Search GIFs...`
    }
  )), /* @__PURE__ */ BdApi.React.createElement("div", { className: "scrollerBase bem-panel-content" }, ActiveComponent && /* @__PURE__ */ BdApi.React.createElement(ActiveComponent, { query })));
}
function TabButton({ label, isActive, onClick }) {
  const [isHovered, setIsHovered] = React.useState(false);
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      onClick,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      className: `bem-tab-button ${isActive ? "bem-tab-active" : ""} ${isHovered ? "bem-tab-hovered" : ""}`
    },
    label
  );
}
var CSS = `
/* Settings Component */
.bem-settings-container {
    padding: 16px;
    color: white;
}

.bem-settings-form {
    margin-bottom: 16px;
}

.bem-settings-hint {
    margin-bottom: 8px;
    font-size: 12px;
    color: var(--text-muted);
}

.bem-add-button {
    padding: 8px 16px;
    background-color: #5865F2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.bem-provider-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    margin-bottom: 8px;
    background-color: var(--background-secondary);
    border-radius: 4px;
}

.bem-provider-name {
    font-weight: bold;
}

.bem-provider-path {
    font-size: 11px;
    color: var(--text-muted);
}

.bem-delete-button {
    padding: 4px 8px;
    background-color: #ED4245;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

/* SVG Button */
.bem-svg-button {
    fill: var(--interactive-icon-default);
}

/* Extra Components */
.bem-min-width-bypass > input {
    min-width: 420px;
}

.bem-min-width-bypass {
    justify-content: center;
    align-items: center;
    display: flex-inline;
    margin: 12px;
}

/* GIF Components */
.bem-gif-placeholder {
    width: 100%;
    height: 200px;
    background-color: var(--background-modifier-accent);
    border-radius: 8px;
}

.bem-gif-video {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
}

.bem-gif-image {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
}

/* Favorites Component */
.bem-favorites-container {
    padding: 8px;
    box-sizing: border-box;
}

.bem-favorite-input-wrapper {
    width: 100%;
    padding: 0px 8px;
}

.bem-gif-grid {
    column-count: 2;
    column-gap: 12px;
}

.bem-gif-grid-margin {
    margin-top: 8px;
}

.bem-gif-grid-item {
    break-inside: avoid;
    margin-bottom: 8px;
}

.bem-load-more {
    margin: 10px;
    color: white;
    text-align: center;
    cursor: pointer;
}

/* GIFs Component */
.bem-gifs-container {
    padding: 8px;
    box-sizing: border-box;
}

.bem-favorites-container::-webkit-scrollbar {
    display: none;
}

/* Emoji Components */
.bem-emoji-placeholder {
    width: 32px;
    height: 32px;
    margin: 4px;
    display: inline-block;
    background-color: var(--background-modifier-accent);
    border-radius: 4px;
}

.bem-emoji-image {
    width: 32px;
    height: 32px;
    margin: 4px;
}

.bem-emojis-container {
    padding: 8px;
}

.bem-guild-section {
    padding-bottom: 12px;
}

.bem-guild-header {
    color: white;
    font-size: 700;
    display: flex;
    align-items: center;
    gap: 8px;
}

.bem-guild-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
}

/* Panel Navigation */
.bem-panel-container {
    width: 550px;
    height: 450px;
    background-color: var(--background-base-low);
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border-subtle);
}

.bem-panel-header {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 8px;
    background-color: var(--background-base-lower);
    border-bottom: 1px solid var(--border-subtle);
}

.bem-panel-content {
    flex: 1;
    overflow: auto;
}

/* Tab Button */
.bem-tab-button {
    padding: 8px 16px;
    cursor: pointer;
    color: var(--text-muted);
    background-color: transparent;
    border-radius: 4px;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.1s ease;
    user-select: none;
}

.bem-tab-button.bem-tab-active,
.bem-tab-button.bem-tab-hovered {
    color: var(--header-primary);
    background-color: var(--background-mod-normal);
}

/* Scrollbar */
.scrollerBase::-webkit-scrollbar {
    background: none;
    border-radius: 8px;
    width: 16px;
}

.scrollerBase::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    border: solid 4px transparent;
    border-radius: 8px;
}

.scrollerBase:hover::-webkit-scrollbar-thumb {
    background-color: var(--bg-overlay-6, var(--background-tertiary));
}

.scrollerBase::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 8px;
}

/* Emoji Button Container */
.bem-emoji-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.bem-emoji-button-inner {
    display: flex;
    justify-content: center;
    align-items: center;
}
`;
function EmojiPopout() {
  const owoRef = React.useRef(null);
  const [shouldShow, setShouldShow] = React.useState(false);
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "bem-emoji-button-container", key: "better-expression-menu-gif-remake", ref: owoRef }, /* @__PURE__ */ BdApi.React.createElement(
    Popout,
    {
      targetElementRef: owoRef,
      shouldShow,
      renderPopout: () => /* @__PURE__ */ BdApi.React.createElement(PanelNav, null),
      onRequestClose: () => setShouldShow(false),
      position: "top",
      children: () => /* @__PURE__ */ BdApi.React.createElement(
        Button,
        {
          tooltipText: "Expression Menu",
          renderButtonContents: () => /* @__PURE__ */ BdApi.React.createElement("div", { onClick: () => setShouldShow((s) => !s) }, /* @__PURE__ */ BdApi.React.createElement("div", { className: `bem-emoji-button-inner ${Classes.emojiButton}` }, /* @__PURE__ */ BdApi.React.createElement(SVGButton, null)))
        }
      )
    }
  ));
}
var BetterExpressionMenu = class {
  start() {
    DOM.addStyle("bem-styles", CSS);
    Patcher.after(Buttons.A, "type", (_, __, res) => {
      res.props.children.unshift(/* @__PURE__ */ BdApi.React.createElement(EmojiPopout, null));
      return res;
    });
  }
  stop() {
    DOM.removeStyle("bem-styles");
    Patcher.unpatchAll();
  }
  getSettingsPanel() {
    return React.createElement(SettingsComponent);
  }
};
