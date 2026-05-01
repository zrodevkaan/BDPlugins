/**
 * @name AudioOptions
 * @author Kaan
 * @version 2.0.0
 * @description Adds an option button next to voice messages.
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/AudioOptions/AudioOptions.plugin.js 
 * @invite t3zMgv7Nvb
 */
"use strict";

// src/Helpers/index.tsx
var { React, ContextMenu } = BdApi;
var { createElement, forwardRef } = React;
function styledBase(tag, cssOrFn) {
  return (props) => {
    const style = typeof cssOrFn === "function" ? cssOrFn(props) : cssOrFn;
    return React.createElement(tag, { ...props, style: { ...style, ...props.style } });
  };
}
var styled = new Proxy(styledBase, {
  get(target, p, receiver) {
    return (cssOrFn) => target(p, cssOrFn);
  }
});
function getKey(module2, fn) {
  for (var key in module2) {
    if (fn(module2[key])) {
      return { key, module: module2 };
    }
  }
}

// src/AudioOptions/index.tsx
var { Patcher, React: React2, Webpack, DOM, ContextMenu: ContextMenu2, UI, Net, Utils } = new BdApi("AudioOptions");
var IconBase = Webpack.getModule((x) => x.Icon);
var VoiceMessagePlayer = getKey(Webpack.getBySource("MEDIA_PLAYBACK_POSITION_UPDATE", { raw: true }).declarations, (x) => String(x.type).includes(".Ay.getPlaybackRate("));
console.log(VoiceMessagePlayer);
var PathIcon = () => {
  return React2.createElement(
    "svg",
    {
      viewBox: "0 0 24 24",
      width: 24,
      height: 24,
      fill: "var(--interactive-icon-default)"
    },
    React2.createElement("path", {
      d: "M4 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
    })
  );
};
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
    console.log(error);
    UI.showToast("Download failed!", { type: "error" });
  }
};
var AudioButton = ({ showOptionsMenu }) => {
  return /* @__PURE__ */ BdApi.React.createElement(IconBase.Icon, { icon: PathIcon, tooltip: "Audio Options", className: "audio-options-button", tooltipPosition: "right", onClick: (e) => showOptionsMenu(e) });
};
var AudioOptions = class {
  start() {
    this.patchAudioPlayer();
  }
  patchAudioPlayer() {
    Patcher.after(VoiceMessagePlayer.module[VoiceMessagePlayer.key], "type", (_, [props], res) => {
      console.log(res);
      res.props.children.push(/* @__PURE__ */ BdApi.React.createElement(AudioButton, { showOptionsMenu: this.showOptionsMenu.bind(this, props) }));
    });
  }
  showOptionsMenu(props, e) {
    const audioElement = document.querySelector('[class^="audioElement"]');
    const audioUrl = props.item.downloadUrl;
    const fileName = props.item.originalItem.filename || `voice-message-${Date.now()}.ogg`;
    const menuItems = [
      {
        id: "download",
        label: "Download Audio",
        action: () => this.downloadAudio(audioUrl, fileName)
      },
      {
        id: "copy",
        label: "Copy Audio URL",
        action: () => this.copyToClipboard(audioUrl)
      }
    ];
    if (audioElement) {
      menuItems.push({
        type: "separator"
      });
      menuItems.push({
        id: "loop",
        label: audioElement.loop ? "Disable Loop" : "Enable Loop",
        action: () => {
          audioElement.loop = !audioElement.loop;
          UI.showToast(`Loop ${audioElement.loop ? "enabled" : "disabled"}`, { type: "success" });
        }
      });
    }
    ContextMenu2.open(e, ContextMenu2.buildMenu(menuItems));
  }
  downloadAudio(url, filename) {
    createDownloadLink(url, filename);
  }
  copyToClipboard(text) {
    DiscordNative.clipboard.copy(text);
    UI.showToast("Copied to clipboard!", { type: "success" });
  }
  stop() {
    Patcher.unpatchAll();
  }
};
module.exports = AudioOptions;
