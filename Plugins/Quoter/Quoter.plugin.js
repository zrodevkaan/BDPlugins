/**
 * @name Quoter
 * @description Quote your friends wild statements.
 * @author Kaan
 * @version 1.0.0
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
var generateQuoteImage = async (imageUrl, text, attribution, width = 1250, height = 530) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    function wrapTextCentered(ctx2, text2, x, y, maxWidth, lineHeight) {
      var words = text2.split(" ");
      var lines = [];
      var line = "";
      for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + " ";
        var metrics = ctx2.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(line.trim());
          line = words[n] + " ";
        } else {
          line = testLine;
        }
      }
      if (line.trim()) {
        lines.push(line.trim());
      }
      var totalHeight = lines.length * lineHeight;
      var startY = y - totalHeight / 2 + lineHeight;
      var currentY = startY;
      for (var i = 0; i < lines.length; i++) {
        var lineWidth = ctx2.measureText(lines[i]).width;
        var centeredX = x + (maxWidth - lineWidth) / 2;
        ctx2.fillText(lines[i], centeredX, currentY);
        currentY += lineHeight;
      }
      return currentY;
    }
    const img = new Image();
    img.onload = () => {
      try {
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
        ctx.font = `bold ${fontSize}px Arial`;
        const centerX = 650;
        const centerY = height / 2;
        const endY = wrapTextCentered(ctx, text, centerX, centerY, availableWidth, lineHeight);
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
      reject(new Error("Failed to load image"));
    };
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
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
    message_reference: replyOptions?.messageReference || null,
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
          const yesImage = UserStore.getUser(props.message.author.id).getAvatarURL({ size: 1 << 12, animated: true });
          const img = yesImage.slice(0, yesImage.length - 2) + (1 << 12), text = props.message.content, attribution = props.message.author.username;
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
