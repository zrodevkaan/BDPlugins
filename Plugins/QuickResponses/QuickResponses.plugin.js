/**
 * @name QuickResponses
 * @author Kaan
 * @version 1.0.0
 * @description Allows you to quickly send snippets or complete messages using a slash command like style
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

// src/QuickResponses/index.tsx
var index_exports = {};
__export(index_exports, {
  DOCUMENT: () => DOCUMENT,
  IMAGE: () => IMAGE,
  PDF: () => PDF,
  TEXT: () => TEXT,
  VIDEO: () => VIDEO,
  default: () => QuickResponses,
  timestampToSnowflake: () => timestampToSnowflake
});
module.exports = __toCommonJS(index_exports);

// src/QuickResponses/index.css?raw
var index_default = ".snippets-container {\r\n    display: flex;\r\n    flex-direction: column;\r\n    padding: 6px 10px;\r\n    margin: 0 2px;\r\n    border-radius: 6px;\r\n    background: transparent;\r\n    align-content: center;\r\n    cursor: pointer;\r\n}\r\n\r\n.snippets-container:hover {\r\n    background-color: var(--background-modifier-hover);\r\n    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);\r\n}\r\n\r\n.snippets-container:active {\r\n    background-color: var(--background-modifier-selected);\r\n}\r\n\r\n.snippet-header {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    margin-bottom: 3px;\r\n}\r\n\r\n.snippet-name {\r\n    color: var(--interactive-active);\r\n    font-size: 15px;\r\n    line-height: 1.3;\r\n    font-weight: 500;\r\n}\r\n\r\n.snippet-content {\r\n    color: var(--text-default);\r\n    font-size: 13px;\r\n    font-weight: 400;\r\n    line-height: 1.4;\r\n    margin-bottom: 2px;\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n}\r\n\r\n.snippet-timestamp {\r\n    color: var(--text-muted);\r\n    font-size: 10px;\r\n    font-weight: 600;\r\n    line-height: 1.2;\r\n    text-transform: uppercase;\r\n    letter-spacing: 0.04em;\r\n    opacity: 0.7;\r\n    padding: 2px 6px;\r\n    background: var(--background-base-lower);\r\n    border-radius: 10px;\r\n}\r\n\r\n.snippet-attachments {\r\n    display: inline-flex;\r\n    justify-content: flex-start;\r\n    align-items: center;\r\n    gap: 8px;\r\n    margin-top: 6px;\r\n    flex-wrap: wrap;\r\n}\r\n\r\n.attachment-item {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    background-color: var(--background-base-lower);\r\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);\r\n    border-radius: 6px;\r\n    border: 1px solid var(--border-subtle);\r\n    padding: 4px 8px;\r\n    text-align: center;\r\n    gap: 4px;\r\n}\r\n\r\n.attachment-icon {\r\n    width: 18px;\r\n    height: 18px;\r\n    fill: var(--text-muted);\r\n    opacity: 0.8;\r\n}\r\n\r\n.attachment-filename {\r\n    color: var(--text-muted);\r\n    font-size: 11px;\r\n    font-weight: 500;\r\n    opacity: 0.9;\r\n}\r\n\r\n.snippet-header-message {\r\n    color: var(--interactive-normal);\r\n    padding: 2px 0;\r\n    text-transform: uppercase;\r\n    font-family: var(--font-display);\r\n    font-size: 11px;\r\n    font-weight: 700;\r\n    line-height: 1.4;\r\n    letter-spacing: 0.02em;\r\n}\r\n\r\n.snippet-base {\r\n    padding: 6px;\r\n}";

// src/QuickResponses/index.tsx
var { Webpack, DOM, Data, ContextMenu, Components, React, Net, Patcher } = new BdApi("QuickResponses");
var Autocompletes = Webpack.getBySource(".EMOJIS_AND_STICKERS]:");
var ModalSystem = Webpack.getMangled(".modalKey?", {
  openModalLazy: Webpack.Filters.byStrings(".modalKey?"),
  openModal: Webpack.Filters.byStrings(",instant:"),
  closeModal: Webpack.Filters.byStrings(".onCloseCallback()"),
  closeAllModals: Webpack.Filters.byStrings(".getState();for")
});
var SendMessages = Webpack.getModule((m) => m.sendMessage && m.editMessage);
var CloudUploader = Webpack.getByStrings("uploadFileToCloud", { searchExports: true });
var WordModule = Webpack.getMangled(".EMOJIS_AND_STICKERS){", {
  WordParser: (x) => String(x).includes("OLD_BUILT_INS") && String(x).includes("currentWordIsAtStart")
});
var { Modal } = Webpack.getModule((x) => x.Modal);
var { TextInput, Button } = Components;
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
var PDF = (props) => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...props }, /* @__PURE__ */ BdApi.React.createElement("path", { fill: "var(--interactive-normal)", d: "M7.503 13.002a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0v-.5H8.5a1.5 1.5 0 0 0 0-3h-.997Zm.997 2h-.497v-1H8.5a.5.5 0 1 1 0 1Zm6.498-1.5a.5.5 0 0 1 .5-.5h1.505a.5.5 0 1 1 0 1h-1.006l-.001 1.002h1.007a.5.5 0 0 1 0 1h-1.007l.002.497a.5.5 0 0 1-1 .002l-.003-.998v-.002l.003-2.002Zm-3.498-.5h.498a2 2 0 0 1 0 4H11.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5Zm.5 3a1 1 0 0 0 0-2v2ZM12 8V2H6a2 2 0 0 0-2 2v6.668c-.591.281-1 .884-1 1.582v5.5c0 .698.409 1.3 1 1.582V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.668c.591-.281 1-.884 1-1.582v-5.5c0-.698-.409-1.3-1-1.582V10h-6a2 2 0 0 1-2-2Zm-7.25 4h14.5a.25.25 0 0 1 .25.25v5.5a.25.25 0 0 1-.25.25H4.75a.25.25 0 0 1-.25-.25v-5.5a.25.25 0 0 1 .25-.25Zm8.75-4V2.5l6 6H14a.5.5 0 0 1-.5-.5Z" }));
var IMAGE = (props) => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 16 16", ...props }, /* @__PURE__ */ BdApi.React.createElement("path", { fill: "var(--interactive-normal)", d: "M4.5 2A2.5 2.5 0 0 0 2 4.5v7c0 .51.152.983.414 1.379l4.384-4.384a1.7 1.7 0 0 1 2.404 0l4.384 4.384A2.49 2.49 0 0 0 14 11.5v-7A2.5 2.5 0 0 0 11.5 2h-7Zm7 3.502a1.002 1.002 0 1 1-2.004 0a1.002 1.002 0 0 1 2.004 0Zm1.379 8.084L8.495 9.202a.7.7 0 0 0-.99 0l-4.384 4.384c.396.262.87.414 1.379.414h7c.51 0 .983-.152 1.379-.414Z" }));
var DOCUMENT = (props) => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 16 16", ...props }, /* @__PURE__ */ BdApi.React.createElement("path", { fill: "var(--interactive-normal)", d: "M8 1v3.5A1.5 1.5 0 0 0 9.5 6H13v7.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 13.5v-11A1.5 1.5 0 0 1 4.5 1H8Zm1 .25V4.5a.5.5 0 0 0 .5.5h3.25L9 1.25Z" }));
var TEXT = (props) => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 12 12", ...props }, /* @__PURE__ */ BdApi.React.createElement("path", { fill: "var(--interactive-normal)", d: "M2 2.75A.75.75 0 0 1 2.75 2h6a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V3.5H6.5v5h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5H5v-5H3.5v.75a.75.75 0 0 1-1.5 0v-1.5Z" }));
var VIDEO = (props) => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 1024 960", ...props }, /* @__PURE__ */ BdApi.React.createElement("path", { fill: "var(--interactive-normal)", d: "M832 960v-64H192v64H0V0h192v64h640V0h192v960H832zM128 64H64v64h64V64zm0 128H64v64h64v-64zm0 128H64v64h64v-64zm0 128H64v64h64v-64zm0 128H64v64h64v-64zm0 128H64v64h64v-64zm0 128H64v64h64v-64zm704-704H192v704h640V128zm128-64h-64v64h64V64zm0 128h-64v64h64v-64zm0 128h-64v64h64v-64zm0 128h-64v64h64v-64zm0 128h-64v64h64v-64zm0 128h-64v64h64v-64zm0 128h-64v64h64v-64z" }));
var contentTypeToIcon = {
  // PDFs
  "application/pdf": "PDF",
  // Images
  "image/png": "IMAGE",
  "image/jpeg": "IMAGE",
  "image/jpg": "IMAGE",
  "image/gif": "IMAGE",
  "image/webp": "IMAGE",
  "image/svg+xml": "IMAGE",
  "image/bmp": "IMAGE",
  "image/tiff": "IMAGE",
  "image/avif": "IMAGE",
  // Videos
  "video/mp4": "VIDEO",
  "video/avi": "VIDEO",
  "video/mov": "VIDEO",
  "video/wmv": "VIDEO",
  "video/flv": "VIDEO",
  "video/webm": "VIDEO",
  "video/mkv": "VIDEO",
  "video/m4v": "VIDEO",
  "video/3gp": "VIDEO",
  "video/quicktime": "VIDEO",
  "video/x-msvideo": "VIDEO",
  "video/x-ms-wmv": "VIDEO",
  "video/x-flv": "VIDEO",
  "video/ogg": "VIDEO",
  "video/ogv": "VIDEO",
  // Documents (Word, Excel, PowerPoint, etc.)
  "application/msword": "DOCUMENT",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCUMENT",
  "application/vnd.ms-excel": "DOCUMENT",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "DOCUMENT",
  "application/vnd.ms-powerpoint": "DOCUMENT",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "DOCUMENT",
  // Text formats
  "text/plain": "TEXT",
  "text/html": "TEXT",
  "text/css": "TEXT",
  "text/javascript": "TEXT",
  "application/javascript": "TEXT",
  "application/json": "TEXT",
  "text/csv": "TEXT",
  "text/markdown": "TEXT"
};
var svgs = { "PDF": PDF, "IMAGE": IMAGE, "DOCUMENT": DOCUMENT, "TEXT": TEXT, "VIDEO": VIDEO };
var Icon = ({ type }) => {
  const iconName = contentTypeToIcon[type] || "DOCUMENT";
  const SvgIcon = svgs[iconName];
  return /* @__PURE__ */ BdApi.React.createElement(SvgIcon, null);
};
var SnippetNameModal = ({ parsedMessage, onClose, onSave, isModifying }) => {
  const [snippetName, setSnippetName] = React.useState(parsedMessage.name || "");
  const handleSave = () => {
    if (snippetName.trim()) {
      const updatedMessage = { ...parsedMessage, name: snippetName.trim() };
      onSave(updatedMessage);
      onClose();
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "snippet-modal-container" }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "snippet-modal-field", style: { display: "grid" } }, /* @__PURE__ */ BdApi.React.createElement("label", { className: "snippet-header-message" }, "Snippet Name:"), /* @__PURE__ */ BdApi.React.createElement(
    TextInput,
    {
      value: snippetName,
      onChange: setSnippetName,
      onKeyDown: handleKeyPress,
      placeholder: "Enter a name for this snippet...",
      autoFocus: true,
      className: "snippet-modal-input"
    }
  )), /* @__PURE__ */ BdApi.React.createElement("div", { className: "snippet-modal-buttons", style: { display: "grid", gap: "10px", padding: "5px", alignContent: "space-between" } }, /* @__PURE__ */ BdApi.React.createElement(
    Button,
    {
      color: Button.Colors.BRAND,
      onClick: handleSave,
      disabled: !snippetName.trim()
    },
    isModifying ? "Update Snippet" : "Add Snippet"
  ), /* @__PURE__ */ BdApi.React.createElement(
    Button,
    {
      color: Button.Colors.PRIMARY,
      look: Button.Looks.LINK,
      onClick: onClose
    },
    "Cancel"
  )));
};
var timestampToSnowflake = (timestamp) => {
  const DISCORD_EPOCH = BigInt(14200704e5);
  const SHIFT = BigInt(22);
  const ms = BigInt(timestamp) - DISCORD_EPOCH;
  return ms <= BigInt(0) ? "0" : (ms << SHIFT).toString();
};
function incrementUsage(x) {
  const stats = DataStore.snippetStatistics ?? {};
  stats[x.id] = (stats[x.id] ?? 0) + 1;
  DataStore.snippetStatistics = stats;
}
var RenderSnippets = (props) => {
  const textarea = document.querySelector('[data-slate-editor="true"]');
  props.query = props.query?.split("_").join(" ");
  const filteredSnippets = DataStore.snippets.filter((snippet) => {
    if (!props.query || props.query.trim() === "") {
      return true;
    }
    return snippet.name.toLowerCase().includes(props.query.toLowerCase().trim()) || snippet.content.toLowerCase().includes(props.query.toLowerCase().trim());
  });
  return /* @__PURE__ */ BdApi.React.createElement(BdApi.React.Fragment, null, /* @__PURE__ */ BdApi.React.createElement("div", { className: "snippet-base" }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "snippet-header-message" }, props.query.trim() === "" ? "Snippets" : `Snippets Matching: ${props.query}`)), filteredSnippets.map((x, index) => /* @__PURE__ */ BdApi.React.createElement(BdApi.React.Fragment, null, /* @__PURE__ */ BdApi.React.createElement("div", { key: x.id || index, className: "snippets-container", onClick: async (e) => {
    if (e.shiftKey || x.alwaysClientSided) {
      await SendMessages.sendBotMessage(BigInt(props.channel), x.content);
    } else {
      incrementUsage(x);
      let attachmentsToUpload = [];
      if (x.attachments && Object.keys(x.attachments).length > 0) {
        const uploadPromises = Object.values(x.attachments).map(async (attachment) => {
          try {
            const content = await Net.fetch(attachment.url);
            const file = new File([await content.blob()], attachment.filename, {
              type: attachment.content_type
            });
            const upload = new CloudUploader({ file }, props.channel);
            return upload;
          } catch (error) {
            console.error(`Failed to process attachment: ${attachment?.filename}`, error);
            return null;
          }
        });
        const results = await Promise.allSettled(uploadPromises);
        attachmentsToUpload = results.filter((result) => result.status === "fulfilled" && result.value !== null).map((result) => result.value);
      }
      const messagePayload = {
        flags: 0,
        channel_id: props.channel,
        content: x.content,
        sticker_ids: [],
        validNonShortcutEmojis: [],
        type: 0,
        message_reference: null,
        nonce: timestampToSnowflake(Date.now())
      };
      SendMessages.sendMessage(props.channel, messagePayload, null, {
        attachmentsToUpload,
        onAttachmentUploadError: () => false,
        ...messagePayload
      });
    }
    textarea.blur();
  } }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "snippet-header" }, /* @__PURE__ */ BdApi.React.createElement("span", { className: "snippet-name" }, x.name), /* @__PURE__ */ BdApi.React.createElement("span", { className: "snippet-timestamp" }, x.id)), x.content && /* @__PURE__ */ BdApi.React.createElement("span", { className: "snippet-content" }, x.content), x.attachments && x.attachments.length > 0 && /* @__PURE__ */ BdApi.React.createElement("div", { className: "snippet-attachments" }, x.attachments.map((attachment, attachmentIndex) => /* @__PURE__ */ BdApi.React.createElement("div", { key: attachmentIndex, className: "attachment-item" }, /* @__PURE__ */ BdApi.React.createElement(Icon, { type: attachment.content_type, className: "attachment-icon" }), /* @__PURE__ */ BdApi.React.createElement("div", { style: { display: "flex", gap: "10px", alignItems: "center" } }, /* @__PURE__ */ BdApi.React.createElement("span", { className: "attachment-filename" }, attachment.filename), /* @__PURE__ */ BdApi.React.createElement("span", { className: "attachment-filename" }, attachment.size, "KB")))))))));
};
var Snippets = {
  sentinel: ">>",
  stores: [],
  matches: () => true,
  queryResults: () => {
    return { results: { globals: [{ theMeaningOfLifeIs: 42 }] } };
  },
  renderResults: (a) => {
    return /* @__PURE__ */ BdApi.React.createElement(RenderSnippets, { channel: a.channel.id, callback: a.options.sendMessage, query: a.query });
  },
  autocompleteInputElementType: null
};
var QuickResponses = class {
  start() {
    DataStore.snippets ??= [{
      id: Date.now(),
      alwaysClientSided: true,
      name: "Example Snippet",
      content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos",
      attachments: [
        { type: "pdf", filename: "getting-started-guide.pdf", size: Infinity },
        { type: "image", filename: "welcome-banner.png", size: Infinity }
      ]
    }];
    DataStore.snippetStatistics ??= {};
    Autocompletes.R[11] = "SNIPPETS";
    Autocompletes.W["SNIPPETS"] = Snippets;
    Patcher.before(WordModule, "WordParser", (_, args, __) => {
      if (args[0].textValue?.startsWith(">>")) {
        args[0].currentWord = args[0].textValue?.replace(" ", "_");
      }
      return args;
    });
    ContextMenu.patch("message", this.addToQuickResponse);
    DOM.addStyle("snippetCss", index_default);
  }
  addToQuickResponse(res, props) {
    const parsedMessage = {
      snowflake: props.message.id,
      content: props.message.content,
      id: Date.now(),
      name: "Untitled Snippet",
      attachments: props.message.attachments
    };
    const existingIndex = DataStore.snippets.findIndex((x) => x.snowflake === parsedMessage.snowflake);
    const shouldRemove = existingIndex !== -1;
    const existingSnippet = shouldRemove ? DataStore.snippets[existingIndex] : null;
    const menuItems = [];
    if (shouldRemove) {
      menuItems.push({
        id: "qr-modify-menu",
        label: "Modify",
        action: () => {
          ModalSystem.openModal((props2) => /* @__PURE__ */ BdApi.React.createElement(Modal, { title: "Modify Snippet", subtitle: "Modify the currently existing snippet!", ...props2 }, /* @__PURE__ */ BdApi.React.createElement(
            SnippetNameModal,
            {
              parsedMessage: existingSnippet,
              onClose: props2.onClose,
              isModifying: true,
              onSave: (updatedMessage) => {
                const updatedSnippets = [...DataStore.snippets || []];
                updatedSnippets[existingIndex] = updatedMessage;
                DataStore.snippets = updatedSnippets;
              }
            }
          )));
        }
      });
      menuItems.push({
        id: "qr-remove-menu",
        label: "Remove",
        action: () => {
          const updatedSnippets = [...DataStore.snippets || []];
          updatedSnippets.splice(existingIndex, 1);
          DataStore.snippets = updatedSnippets;
        }
      });
    } else {
      menuItems.push({
        id: "qr-add-menu",
        label: "Add",
        action: () => {
          ModalSystem.openModal((props2) => /* @__PURE__ */ BdApi.React.createElement(Modal, { title: "Add Snippet", subtitle: "Add your snippet name here!", ...props2 }, /* @__PURE__ */ BdApi.React.createElement(
            SnippetNameModal,
            {
              parsedMessage,
              onClose: props2.onClose,
              isModifying: false,
              onSave: (updatedMessage) => {
                DataStore.snippets = [updatedMessage, ...DataStore.snippets || []];
              }
            }
          )));
        }
      });
    }
    const Menu = ContextMenu.buildMenuChildren([
      { type: "separator" },
      {
        type: "submenu",
        label: "QuickResponses",
        items: menuItems
      }
    ]);
    res.props.children.props.children.push(Menu);
  }
  stop() {
    delete Autocompletes.R[Autocompletes.R.length - 1];
    delete Autocompletes.W["SNIPPETS"];
    DOM.addStyle("snippetCss");
    ContextMenu.unpatch("message", this.addToQuickResponse);
  }
};
