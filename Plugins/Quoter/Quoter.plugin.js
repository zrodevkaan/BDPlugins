/**
 * @name Quoter
 * @description Right click a message to quote your friends wild statements.
 * @author Kaan
 * @version 1.0.4
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/Quoter/Quoter.plugin.js 
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

// src/Quoter/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Quoter,
  timestampToSnowflake: () => timestampToSnowflake
});
module.exports = __toCommonJS(index_exports);
var { Webpack, Patcher, ContextMenu } = new BdApi("Quoter");
function calculateFontSize({
  charCount,
  width,
  height
}) {
  let baseSize;
  if (charCount <= 20) {
    baseSize = 48;
  } else if (charCount <= 50) {
    baseSize = 36;
  } else if (charCount <= 100) {
    baseSize = 28;
  } else if (charCount <= 200) {
    baseSize = 22;
  } else {
    baseSize = 18;
  }
  const estimatedCharWidth = baseSize * 0.6;
  const charsPerLine = Math.floor(width / estimatedCharWidth);
  const estimatedLines = Math.ceil(charCount / charsPerLine);
  const requiredHeight = estimatedLines * baseSize * 1.2;
  if (requiredHeight > height * 0.8) {
    baseSize = baseSize * (height * 0.8) / requiredHeight;
  }
  return Math.max(16, Math.min(baseSize, 60));
}
var parseEmotes = (text) => {
  const emoteRegex = /<a?:(\w+):(\d+)>/g;
  const tokens = [];
  let lastIndex = 0;
  let match;
  while ((match = emoteRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    const isAnimated = match[0].startsWith("<a:");
    tokens.push({
      type: "emote",
      name: match[1],
      id: match[2],
      animated: isAnimated
    });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push({ type: "text", content: text.slice(lastIndex) });
  }
  return tokens.length > 0 ? tokens : [{ type: "text", content: text }];
};
var loadEmoteImage = async (emoteId, animated) => {
  try {
    const url = `https://cdn.discordapp.com/emojis/${emoteId}.${animated ? "gif" : "png"}`;
    const res = await BdApi.Net.fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
};
var preloadEmotes = async (tokens) => {
  const emoteMap = new Map();
  for (const token of tokens) {
    if (token.type === "emote" && !emoteMap.has(token.id)) {
      const img = await loadEmoteImage(token.id, token.animated);
      emoteMap.set(token.id, img);
    }
  }
  return emoteMap;
};
var generateQuoteImage = async (imageUrl, text, attribution, width = 1250, height = 530) => {
  return new Promise(async (resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const tokens = parseEmotes(text);
    const emoteMap = await preloadEmotes(tokens);
    function wrapTextWithEmotes(ctx2, tokens2, x, y, maxWidth, lineHeight) {
      const textTokens = [];
      for (const token of tokens2) {
        if (token.type === "text") {
          textTokens.push(...token.content.split(" ").filter((w) => w).map((w) => ({ type: "text", content: w })));
        } else {
          textTokens.push(token);
        }
      }
      var lines = [];
      var line = [];
      var lineWidth = 0;
      const emoteSize = lineHeight * 0.95;
      for (var n = 0; n < textTokens.length; n++) {
        var token = textTokens[n];
        var tokenWidth;
        if (token.type === "text") {
          tokenWidth = ctx2.measureText(token.content + " ").width;
        } else {
          tokenWidth = emoteSize + 5;
        }
        if (lineWidth + tokenWidth > maxWidth && line.length > 0) {
          lines.push(line);
          line = [];
          lineWidth = 0;
        }
        line.push(token);
        if (token.type === "text") {
          lineWidth += ctx2.measureText(token.content + " ").width;
        } else {
          lineWidth += emoteSize + 5;
        }
      }
      if (line.length > 0) {
        lines.push(line);
      }
      var totalHeight = lines.length * lineHeight;
      var startY = y - totalHeight / 2 + lineHeight;
      var currentY = startY;
      for (var i = 0; i < lines.length; i++) {
        var currentLine = lines[i];
        var lineWidthPx = 0;
        for (var j = 0; j < currentLine.length; j++) {
          var t = currentLine[j];
          if (t.type === "text") {
            lineWidthPx += ctx2.measureText(t.content + " ").width;
          } else {
            lineWidthPx += emoteSize + 5;
          }
        }
        var centeredX = x + (maxWidth - lineWidthPx) / 2;
        var currentX = centeredX;
        for (var j = 0; j < currentLine.length; j++) {
          var t = currentLine[j];
          if (t.type === "text") {
            ctx2.fillText(t.content + " ", currentX, currentY);
            currentX += ctx2.measureText(t.content + " ").width;
          } else {
            var emoteImg = emoteMap.get(t.id);
            if (emoteImg) {
              ctx2.drawImage(emoteImg, currentX, currentY - emoteSize * 0.8, emoteSize, emoteSize);
            }
            currentX += emoteSize + 5;
          }
        }
        currentY += lineHeight;
      }
      return currentY;
    }
    try {
      const res = await BdApi.Net.fetch(imageUrl);
      const dataA = await res.blob();
      const url = URL.createObjectURL(dataA);
      const img = new Image();
      img.onload = () => {
        try {
          URL.revokeObjectURL(url);
          ctx.drawImage(img, 0, 0, 600, height);
          const grad = ctx.createLinearGradient(0, 45, 530, 0);
          grad.addColorStop(0, "rgba(0, 0, 0, 0)");
          grad.addColorStop(1, "rgba(0, 0, 0, 1)");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
          const availableWidth = 400;
          const availableHeight = height;
          const fontSize = calculateFontSize({
            charCount: text.length,
            width: availableWidth,
            height: availableHeight
          });
          const lineHeight = fontSize * 1.2;
          ctx.fillStyle = "white";
          ctx.font = `bold ${fontSize}px Arial, "Segoe UI Emoji"`;
          const centerX = 650;
          const centerY = height / 2;
          const endY = wrapTextWithEmotes(ctx, tokens, centerX, centerY, availableWidth, lineHeight);
          ctx.fillStyle = "rgba(104, 104, 104, 1)";
          ctx.font = "italic 20px Arial";
          const attrWidth = ctx.measureText(attribution).width;
          const attrX = centerX + (availableWidth - attrWidth) / 2;
          ctx.fillText("- @" + attribution, attrX - 10, endY + 5);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob"));
            }
          }, "image/png");
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image"));
      };
      img.crossOrigin = "anonymous";
      img.src = url;
    } catch (err) {
      reject(new Error("Failed to fetch image: " + err.message));
    }
  });
};
var CloudUploader = Webpack.getByStrings("uploadFileToCloud", { searchExports: true });
var SelectedStore = Webpack.getStore("SelectedChannelStore");
var UserStore = Webpack.getStore("UserStore");
var mods = Webpack.getByKeys("getSendMessageOptionsForReply");
var PendingReplyStore = Webpack.getStore("PendingReplyStore");
var FluxDispatcher = Webpack.getModule((x) => x._dispatch);
var timestampToSnowflake = (timestamp) => {
  const DISCORD_EPOCH = BigInt(14200704e5);
  const SHIFT = BigInt(22);
  const ms = BigInt(timestamp) - DISCORD_EPOCH;
  return ms <= BigInt(0) ? "0" : (ms << SHIFT).toString();
};
async function upload(a, b, c, channelId) {
  const yeah = await generateQuoteImage(a, b, c);
  const file = new File([yeah], "quote.png", { type: "image/png" });
  const replyOptions = mods.getSendMessageOptionsForReply(
    PendingReplyStore.getPendingReply(channelId)
  );
  if (replyOptions.messageReference) {
    FluxDispatcher.dispatch({ type: "DELETE_PENDING_REPLY", channelId });
  }
  const upload2 = new CloudUploader({ file }, SelectedStore.getCurrentlySelectedChannelId());
  const messagePayload = {
    flags: 0,
    channel_id: channelId,
    content: "",
    sticker_ids: [],
    validNonShortcutEmojis: [],
    type: 0,
    messageReference: replyOptions?.messageReference || null,
    nonce: timestampToSnowflake(Date.now())
  };
  mods.sendMessage(channelId, messagePayload, null, {
    attachmentsToUpload: [upload2],
    onAttachmentUploadError: () => false,
    ...messagePayload
  });
}
var Quoter = class {
  constructor() {
    this.contextMenuPatch = null;
  }
  async start() {
    this.contextMenuPatch = ContextMenu.patch("message", (res, props) => {
      res.props.children.props.children.push(ContextMenu.buildItem({
        label: "Quote User",
        action: async () => {
          const yesImage = UserStore.getUser(props.message.author.id).getAvatarURL(null, 1 << 12);
          const img = yesImage, text = props.message.content, attribution = props.message.author.username;
          await upload(img, text, attribution, props.message.channel_id);
        }
      }));
    });
  }
  stop() {
    Patcher.unpatchAll();
    if (this.contextMenuPatch) {
      this.contextMenuPatch();
      this.contextMenuPatch = null;
    }
  }
};
