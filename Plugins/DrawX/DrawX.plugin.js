/**
 * @name DrawX
 * @author Kaan
 * @description A knock-off to remix because they cannot maintain a basic canvas feature.
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

// src/DrawX/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => DrawX,
  timestampToSnowflake: () => timestampToSnowflake
});
module.exports = __toCommonJS(index_exports);

// src/DrawX/index.css?raw
var index_default = ".drawx-container {\r\n    width: 100%;\r\n    height: 100vh;\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: center;\r\n    position: relative;\r\n    background-color: #1e1e1e;\r\n    overflow: auto;\r\n    gap: 20px;\r\n    padding: 40px 20px;\r\n}\r\n\r\n.drawx-image-history {\r\n    position: absolute;\r\n    top: 20px;\r\n    left: 50%;\r\n    transform: translateX(-50%);\r\n    z-index: 999;\r\n    max-width: 90vw;\r\n}\r\n\r\n.drawx-history-wrapper {\r\n    background-color: #121214;\r\n    height: 100px;\r\n    padding: 10px 12px;\r\n    border-radius: 8px;\r\n    overflow: auto;\r\n    display: flex;\r\n    gap: 8px;\r\n    align-items: center;\r\n}\r\n\r\n.drawx-history-item {\r\n    min-width: 80px;\r\n    width: 80px;\r\n    height: 80px;\r\n    background-color: #2a2a2a;\r\n    border-radius: 6px;\r\n    border: 1px solid #404040;\r\n    cursor: pointer;\r\n    transition: all 0.2s;\r\n}\r\n\r\n.drawx-canvas-wrapper {\r\n    position: relative;\r\n    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);\r\n    border-radius: 8px;\r\n    overflow: hidden;\r\n}\r\n\r\n.drawx-canvas {\r\n    display: block;\r\n    cursor: crosshair;\r\n    background-color: #ffffff;\r\n}\r\n\r\n.drawx-toolbar {\r\n    position: absolute;\r\n    bottom: 20px;\r\n    left: 50%;\r\n    transform: translateX(-50%);\r\n    background: #121214;\r\n    padding: 12px 24px;\r\n    border-radius: 12px;\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 12px;\r\n    z-index: 1000;\r\n    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);\r\n    align-items: center;\r\n}\r\n\r\n.drawx-upload-btn {\r\n    width: 48px;\r\n    height: 48px;\r\n    border-radius: 50%;\r\n    background-color: #5a5ae8;\r\n    border: none;\r\n    cursor: pointer;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    transition: background-color 0.2s;\r\n}\r\n\r\n.drawx-upload-btn:hover {\r\n    background-color: #6d6dff;\r\n}\r\n\r\n.drawx-color-palette {\r\n    display: flex;\r\n    gap: 8px;\r\n    align-items: center;\r\n}\r\n\r\n.drawx-color-swatch {\r\n    width: 24px;\r\n    height: 24px;\r\n    border-radius: 4px;\r\n    cursor: pointer;\r\n    border: 1px solid #404040;\r\n    transition: all 0.2s;\r\n}\r\n\r\n.drawx-color-swatch.active {\r\n    border: 2px solid white;\r\n}\r\n\r\n.drawx-brush-size-control {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 8px;\r\n}\r\n\r\n.drawx-brush-size-label {\r\n    color: #fff;\r\n    font-size: 12px;\r\n}";

// src/DrawX/index.tsx
var { Webpack, Patcher, React, Components, DOM } = new BdApi("DrawX");
var { Filters } = Webpack;
var { Button, SliderInput } = Components;
var { useRef, useEffect, useState, useCallback } = React;
var LayerActions = Webpack.getMangled("LAYER_POP_ALL", {
  pushLayer: Filters.byStrings('"LAYER_PUSH"'),
  popLayer: Filters.byStrings('"LAYER_POP"'),
  popAllLayers: Filters.byStrings('"LAYER_POP_ALL"')
});
var SelectedStore = Webpack.getStore("SelectedChannelStore");
var mods = Webpack.getByKeys("getSendMessageOptionsForReply");
var PendingReplyStore = Webpack.getStore("PendingReplyStore");
var FluxDispatcher = Webpack.getModule((x) => x._dispatch);
var Popout = Webpack.getModule((m) => m?.Animation, { searchExports: true, raw: true }).exports.y;
var timestampToSnowflake = (timestamp) => {
  const DISCORD_EPOCH = BigInt(14200704e5);
  const SHIFT = BigInt(22);
  const ms = BigInt(timestamp) - DISCORD_EPOCH;
  return ms <= BigInt(0) ? "0" : (ms << SHIFT).toString();
};
var CloudUploader = Webpack.getByStrings("uploadFileToCloud", { searchExports: true });
var [
  UploadCard,
  ToolbarButton
] = Webpack.getBulk({
  filter: Filters.bySource("cuurzM", "keyboardModeEnabled")
}, { filter: Filters.byStrings("actionBarIcon") });
function ImageHistory() {
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "drawx-history-wrapper" }, [...Array(10)].map((_, i) => /* @__PURE__ */ BdApi.React.createElement("div", { key: i, className: "drawx-history-item" })));
}
async function upload(name, buffer, channelId) {
  const yeah = buffer;
  const file = new File([yeah], `${name}.png`, { type: "image/png" });
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
function Body({ name, uploadFile, channelId, type }) {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [brushColor, setBrushColor] = useState("#00FFAA");
  const [brushSize, setBrushSize] = useState(3);
  const colors = ["black", "red", "blue", "tan", "gray", "white", "green", "yellow", "purple", "orange", "pink", "cyan"];
  const [shouldShow, setShouldShow] = useState(false);
  const targetElementRef = useRef(null);
  const [points, setPoints] = useState([]);
  const lastPointRef = useRef(null);
  const [smoothDrawing, setSmoothDrawing] = useState(true);
  const [gif, setGif] = useState(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", {
      willReadFrequently: false,
      alpha: true
    });
    if (!ctx) return;
    setContext(ctx);
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = brushColor;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    if (uploadFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.naturalWidth;
          let height = img.naturalHeight;
          const maxWidth = 1980;
          const maxHeight = 1080;
          const scale = Math.min(maxWidth / width, maxHeight / height, 1);
          width = Math.floor(width * scale);
          height = Math.floor(height * scale);
          setCanvasSize({ width, height });
          canvas.width = width;
          canvas.height = height;
          setBackgroundImage(img);
          ctx.drawImage(img, 0, 0, width, height);
          ctx.lineWidth = brushSize;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.strokeStyle = brushColor;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(uploadFile);
    } else {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = brushColor;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    }
  }, [uploadFile]);
  useEffect(() => {
    if (context) {
      context.lineWidth = brushSize;
      context.strokeStyle = brushColor;
    }
  }, [brushSize, brushColor, context]);
  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };
  const drawSmoothLine = (point1, point2) => {
    if (!context) return;
    const midPoint = {
      x: (point1.x + point2.x) / 2,
      y: (point1.y + point2.y) / 2
    };
    context.quadraticCurveTo(point1.x, point1.y, midPoint.x, midPoint.y);
    context.stroke();
  };
  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    if (context) {
      const pos = getMousePos(e);
      context.beginPath();
      context.moveTo(pos.x, pos.y);
      lastPointRef.current = pos;
      setPoints([pos]);
    }
  };
  const handlePointerMove = useCallback((e) => {
    if (!isDrawing || !context) return;
    e.preventDefault();
    const pos = getMousePos(e);
    if (smoothDrawing && lastPointRef.current) {
      const midPoint = {
        x: (lastPointRef.current.x + pos.x) / 2,
        y: (lastPointRef.current.y + pos.y) / 2
      };
      context.quadraticCurveTo(
        lastPointRef.current.x,
        lastPointRef.current.y,
        midPoint.x,
        midPoint.y
      );
      context.stroke();
      lastPointRef.current = pos;
    } else if (lastPointRef.current) {
      context.lineTo(pos.x, pos.y);
      context.stroke();
      lastPointRef.current = pos;
    }
    setPoints((prev) => [...prev, pos]);
  }, [isDrawing, context, smoothDrawing]);
  const throttledHandlePointerMove = useCallback(
    /* @__PURE__ */ (() => {
      let lastTime = 0;
      const throttleMs = 16;
      return (e) => {
        const now = Date.now();
        if (now - lastTime >= throttleMs) {
          lastTime = now;
          handlePointerMove(e);
        }
      };
    })(),
    [handlePointerMove]
  );
  const handlePointerUp = (e) => {
    e.preventDefault();
    if (isDrawing && context && points.length > 0) {
      const pos = getMousePos(e);
      context.lineTo(pos.x, pos.y);
      context.stroke();
    }
    setIsDrawing(false);
    lastPointRef.current = null;
    setPoints([]);
    if (context) {
      context.closePath();
    }
  };
  const handlePointerLeave = (e) => {
    if (isDrawing) {
      handlePointerUp(e);
    }
  };
  const handleUploadClick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target.result;
        upload(name, buffer, channelId);
        LayerActions.popLayer();
      };
      reader.readAsArrayBuffer(blob);
    }, "image/png");
  };
  return /* @__PURE__ */ BdApi.React.createElement("div", { className: "drawx-container" }, /* @__PURE__ */ BdApi.React.createElement("div", { className: "drawx-image-history" }, /* @__PURE__ */ BdApi.React.createElement(ImageHistory, null)), /* @__PURE__ */ BdApi.React.createElement("div", { className: "drawx-canvas-wrapper" }, /* @__PURE__ */ BdApi.React.createElement(
    "canvas",
    {
      ref: canvasRef,
      className: "drawx-canvas",
      onPointerDown: handlePointerDown,
      onPointerMove: throttledHandlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerLeave: handlePointerLeave,
      style: { touchAction: "none" }
    }
  )), /* @__PURE__ */ BdApi.React.createElement("div", { className: "drawx-toolbar" }, /* @__PURE__ */ BdApi.React.createElement(
    "button",
    {
      onClick: handleUploadClick,
      className: "drawx-upload-btn"
    },
    /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ BdApi.React.createElement("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), /* @__PURE__ */ BdApi.React.createElement("polyline", { points: "17 8 12 3 7 8" }), /* @__PURE__ */ BdApi.React.createElement("line", { x1: "12", y1: "3", x2: "12", y2: "15" }))
  ), /* @__PURE__ */ BdApi.React.createElement("div", { className: "drawx-color-palette" }, colors.map((color) => /* @__PURE__ */ BdApi.React.createElement(
    "div",
    {
      key: color,
      className: `drawx-color-swatch ${brushColor === color ? "active" : ""}`,
      style: { backgroundColor: color },
      onClick: () => setBrushColor(color)
    }
  ))), /* @__PURE__ */ BdApi.React.createElement("div", { ref: targetElementRef }, /* @__PURE__ */ BdApi.React.createElement(
    Popout,
    {
      shouldShow,
      targetElementRef,
      onRequestClose: () => setShouldShow(false),
      renderPopout: () => /* @__PURE__ */ BdApi.React.createElement("div", { className: "drawx-color-picker-popout" }, /* @__PURE__ */ BdApi.React.createElement(
        "input",
        {
          type: "color",
          value: brushColor,
          onChange: (e) => {
            setBrushColor(e.target.value);
            setShouldShow(false);
          }
        }
      )),
      children: () => /* @__PURE__ */ BdApi.React.createElement(
        "div",
        {
          className: `drawx-color-swatch`,
          style: { backgroundColor: brushColor },
          onClick: () => setShouldShow(!shouldShow)
        }
      )
    }
  )), /* @__PURE__ */ BdApi.React.createElement("div", { className: "drawx-brush-size-control" }, /* @__PURE__ */ BdApi.React.createElement(
    SliderInput,
    {
      min: 1,
      max: 200,
      value: brushSize,
      onChange: (e) => setBrushSize(parseInt(e))
    }
  ), /* @__PURE__ */ BdApi.React.createElement("span", { className: "drawx-brush-size-label" }, brushSize, "px"))));
}
var DrawX = class {
  start() {
    DOM.addStyle("DrawX", index_default);
    Patcher.after(UploadCard, "Z", (_, [args], res) => {
      const uploadFile = args?.upload?.item?.file;
      res.props.actions.props.children.unshift(
        /* @__PURE__ */ BdApi.React.createElement(
          ToolbarButton,
          {
            tooltip: "DrawX",
            type: uploadFile.type,
            onClick: () => {
              LayerActions.pushLayer(() => /* @__PURE__ */ BdApi.React.createElement(Body, { name: uploadFile.name, uploadFile, channelId: SelectedStore.getCurrentlySelectedChannelId() }));
            }
          },
          /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 512 512" }, /* @__PURE__ */ BdApi.React.createElement("path", { fill: "var(--interactive-icon-default)", d: "m70.2 337.4l104.4 104.4L441.5 175L337 70.5L70.2 337.4zM.6 499.8c-2.3 9.3 2.3 13.9 11.6 11.6L151.4 465L47 360.6L.6 499.8zM487.9 24.1c-46.3-46.4-92.8-11.6-92.8-11.6c-7.6 5.8-34.8 34.8-34.8 34.8l104.4 104.4s28.9-27.2 34.8-34.8c0 0 34.8-46.3-11.6-92.8z" }))
        )
      );
    });
  }
  stop() {
    DOM.removeStyle(index_default);
    Patcher.unpatchAll();
    LayerActions.popAllLayers();
  }
};
