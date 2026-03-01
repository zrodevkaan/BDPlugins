/**
 * @name VoiceMessagePlayer
 * @author Kaan
 * @version 1.0.0
 * @description Recreation of the popout on mobile for voice messages.
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/VoiceMessagePlayer/VoiceMessagePlayer.plugin.js 
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

// src/VoiceMessagePlayer/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => VoiceMessagePlayer
});
module.exports = __toCommonJS(index_exports);

// src/VoiceMessagePlayer/index.css
var index_default = ".audioBackground {\n  border-radius: var(--radius-sm);\n}\n.audio-base {\n  display: flex;\n  justify-content: center;\n  justify-items: center;\n  align-items: center;\n}\n.audio-base-controls {\n  display: grid;\n  grid-template-columns: auto 10px auto;\n  align-self: center;\n}\n.audio-base-controls .play-button {\n  background-color: var(--bg-brand);\n  color: var(--text-primary);\n  width: 50px;\n  height: 50px;\n  margin-top: 16px;\n  border-radius: 50%;\n  grid-column: 1 / -1;\n  justify-self: center;\n}\n.audio-base-controls span {\n  color: var(--text-primary);\n  margin-top: 8px;\n  grid-row: 2;\n  justify-self: center;\n  &:first-of-type {\n    justify-self: start;\n  }\n  &:last-of-type {\n    justify-self: end;\n  }\n}\n.audioCloseButton {\n  position: absolute;\n  top: 6px;\n  right: 6px;\n  color: var(--text-primary);\n  border-radius: 50%;\n}\n";

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

// src/VoiceMessagePlayer/index.tsx
var { Patcher, React: React2, Webpack, DOM, ContextMenu: ContextMenu2, UI, Net, Utils, Data, Hooks } = new BdApi(
  "VoiceMessagePlayer"
);
var { Stores } = Webpack;
var { Store, className } = Utils;
var { useStateFromStores } = Hooks;
var Module = Webpack.getByKeys("create");
var [Dispatch, AppRoot, AudioComponent] = Webpack.getBulk(
  { filter: (x) => x._dispatch },
  { filter: Webpack.Filters.bySource("Shakeable") },
  { filter: Webpack.Filters.bySource("playbackCacheKey", '"metadata"') }
);
function ForceUpdateRoot() {
  Dispatch.dispatch({ type: "DOMAIN_MIGRATION_START" });
  requestIdleCallback(() => Dispatch.dispatch({ type: "DOMAIN_MIGRATION_SKIP" }));
}
var AudioStore = class extends Store {
  Audios = [];
  mostRecentURL = "";
  constructor() {
    super();
  }
  addAudio(audio) {
    if (this.Audios.find((x) => x.url === audio.url)) return;
    this.Audios.push(audio);
    this.emitChange();
  }
  getAudios() {
    return this.Audios;
  }
  setMostRecentlyPlayedURL(url) {
    this.mostRecentURL = url;
    this.emitChange();
  }
  getMostRecentlyPlayedURL() {
    return this.mostRecentURL;
  }
  deleteAudio(url) {
    this.Audios = this.Audios.filter((x) => x.url !== url);
    this.emitChange();
  }
  getAudio(id) {
    return this.Audios.find((x) => x.id === id);
  }
  playAudio(url) {
    const audio = this.Audios.find((x) => x.url === url);
    if (audio) {
      audio.playing = true;
      this.emitChange();
    }
  }
};
var AudioStoreInstance = new AudioStore();
var ColoredText = styled.span(({ color }) => ({
  color: color || "white"
}));
var Pause = ({ size }) => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 22 22" }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "white",
    d: "M16 19q-.825 0-1.412-.587T14 17V7q0-.825.588-1.412T16 5t1.413.588T18 7v10q0 .825-.587 1.413T16 19m-8 0q-.825 0-1.412-.587T6 17V7q0-.825.588-1.412T8 5t1.413.588T10 7v10q0 .825-.587 1.413T8 19"
  }
));
var Resume = ({ size }) => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 22 22" }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "white",
    d: "M6 17V7q0-.425.288-.712T7 6t.713.288T8 7v10q0 .425-.288.713T7 18t-.712-.288T6 17m5.525.1q-.5.3-1.012 0T10 16.225v-8.45q0-.575.513-.875t1.012 0l7.05 4.25q.5.3.5.85t-.5.85z"
  }
));
var AudioElement = React2.memo(({ Audio }) => {
  const AudioData = useStateFromStores([Stores.MediaPlaybackStore], () => {
    return {
      time: Stores.MediaPlaybackStore.getPlaybackPosition(Audio.key),
      volume: Stores.MediaPlaybackStore.getPlaybackRate(Audio.key)
    };
  });
  const audio = useStateFromStores(
    [AudioStoreInstance],
    () => AudioStoreInstance.getAudio(Audio.id)
  );
  console.log(audio);
  const audioRef = React2.useRef(null);
  const [playing, setPlaying] = React2.useState(Audio.playing);
  const [volume, setVolume] = React2.useState(AudioData.volume);
  const [muted, setMuted] = React2.useState(Audio.muted);
  const [currentTime, setCurrentTime] = React2.useState(0);
  const [duration, setDuration] = React2.useState(0);
  const [pressing, setPressing] = React2.useState(false);
  React2.useEffect(() => {
    if (audioRef.current && AudioData !== void 0) {
      audioRef.current.currentTime = AudioData.time;
      setCurrentTime(AudioData.time);
    }
  }, [AudioData]);
  const togglePlay = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        AudioStoreInstance.setMostRecentlyPlayedURL(Audio.url);
      }
      setPlaying(!playing);
    }
  };
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  React2.useEffect(() => {
    if (audioRef.current && AudioData !== void 0) {
      audioRef.current.currentTime = AudioData.time;
      setCurrentTime(AudioData.time);
      if (audio?.playing && !playing) {
        audioRef.current.play();
        setPlaying(true);
      }
    }
  }, [AudioData, audio?.playing]);
  return /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      onDoubleClick: () => {
      },
      className: "audio-base"
    },
    /* @__PURE__ */ BdApi.React.createElement(
      "audio",
      {
        ref: audioRef,
        src: Audio.url,
        onPause: () => setPlaying(false),
        onPlay: () => setPlaying(true),
        onTimeUpdate: handleTimeUpdate,
        onLoadedMetadata: handleLoadedMetadata,
        style: { display: "none" }
      }
    ),
    /* @__PURE__ */ BdApi.React.createElement("div", { className: "audio-base-controls" }, /* @__PURE__ */ BdApi.React.createElement("button", { onClick: togglePlay, className: "play-button" }, playing ? /* @__PURE__ */ BdApi.React.createElement(Pause, { size: 30 }) : /* @__PURE__ */ BdApi.React.createElement(Resume, { size: 30 })), /* @__PURE__ */ BdApi.React.createElement("span", { className: "time" }, formatTime(currentTime)), /* @__PURE__ */ BdApi.React.createElement("span", { className: "divider" }, "/"), /* @__PURE__ */ BdApi.React.createElement("span", { className: "time" }, formatTime(duration)))
  );
});
var BaseBackground = styled.div({
  position: "absolute",
  width: "100px",
  height: "100px",
  backgroundColor: "var(--background-base-lower)",
  top: "30px",
  right: "30px",
  zIndex: 1e4
});
var AudioPopout = React2.memo(() => {
  const Audios = useStateFromStores(
    [AudioStoreInstance],
    () => AudioStoreInstance.getAudios().concat(),
    []
  );
  const [hovering, setHovering] = React2.useState(false);
  const ref = React2.useRef(null);
  return Audios.length > 0 && /* @__PURE__ */ BdApi.React.createElement(
    BaseBackground,
    {
      className: "audioBackground",
      style: {
        opacity: hovering ? 1 : 0.5
      },
      ref,
      onMouseEnter: (e) => {
        setHovering(true);
      },
      onMouseLeave: (e) => {
        setHovering(false);
      }
    },
    Audios.map((x) => {
      return /* @__PURE__ */ BdApi.React.createElement(BdApi.React.Fragment, null, /* @__PURE__ */ BdApi.React.createElement(AudioElement, { Audio: x }), /* @__PURE__ */ BdApi.React.createElement(
        "span",
        {
          className: "audioCloseButton",
          onClick: () => AudioStoreInstance.deleteAudio(x.url)
        },
        "X"
      ));
    })
  );
});
var VoiceMessagePlayer = class {
  start() {
    ForceUpdateRoot();
    DOM.addStyle("VoiceMessagePlayer", index_default);
    Patcher.after(AppRoot.Z, "type", (_, __, res) => {
      res.props.children.push(/* @__PURE__ */ BdApi.React.createElement(AudioPopout, null));
    });
    Patcher.after(AudioComponent.Z, "type", (_, [__], res) => {
      const children = Utils.findInTree(res, (x) => x?.ref, { walkable: ["props", "children"] });
      const unpatch = Patcher.after(children.ref.current, "play", (args, b, c) => {
        unpatch();
        const domElement = args.children[0];
        AudioStoreInstance.addAudio({
          id: String(performance.now()),
          url: domElement.src,
          playing: false,
          muted: false,
          currentTime: Stores.MediaPlaybackStore.getPlaybackPosition(__.playbackCacheKey),
          volume: 1,
          key: __.playbackCacheKey
        });
      });
    });
  }
  onSwitch() {
    const recentURL = AudioStoreInstance.getMostRecentlyPlayedURL();
    if (recentURL) {
      const audio = AudioStoreInstance.getAudios().find((x) => x.url === recentURL);
      if (audio) {
        AudioStoreInstance.playAudio(recentURL);
      }
    }
  }
  get audio() {
    return AudioStoreInstance.getAudios();
  }
  stop() {
    DOM.removeStyle("VoiceMessagePlayer");
    Patcher.unpatchAll();
  }
};
