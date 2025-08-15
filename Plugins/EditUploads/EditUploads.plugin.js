/**
 * @name EditUploads
 * @author Kaan
 * @version 1.0.0
 * @description Edit uploads before they are sent
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

// src/EditUploads/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => EditUploads
});
module.exports = __toCommonJS(index_exports);
var { Webpack, Data, Utils, Components, React, Patcher } = new BdApi("EditUploads");
var Toolbar = Webpack.getBySource(/spoiler:!.{1,3}.spoiler/);
var ToolbarButton = Webpack.getByStrings("actionBarIcon");
var Filters = BdApi.Webpack.Filters;
var Modals = /* @__PURE__ */ Webpack.getMangled(/* @__PURE__ */ Filters.bySource("root", "headerIdIsManaged"), {
  ModalRoot: /* @__PURE__ */ Filters.byStrings("rootWithShadow"),
  ModalFooter: /* @__PURE__ */ Filters.byStrings(".footer"),
  ModalContent: /* @__PURE__ */ Filters.byStrings(".content"),
  ModalHeader: /* @__PURE__ */ Filters.byStrings(".header", "separator"),
  Animations: (a) => a.SUBTLE,
  Sizes: (a) => a.DYNAMIC
});
var ModalSystem = Webpack.getMangled(".modalKey?", {
  openModalLazy: Webpack.Filters.byStrings(".modalKey?"),
  openModal: Webpack.Filters.byStrings(",instant:"),
  closeModal: Webpack.Filters.byStrings(".onCloseCallback()"),
  closeAllModals: Webpack.Filters.byStrings(".getState();for")
});
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
var CanvasHolder = ({ fileBuffer, ...props }) => {
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const canvas = canvasRef.current;
  function getMousePos(event, canvas2) {
    const rect = canvas2.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
  React.useEffect(() => {
    if (!canvasRef.current || !fileBuffer) return;
    const canvas2 = canvasRef.current;
    const ctx = canvas2.getContext("2d");
    if (!ctx) return;
    const blobUrl = URL.createObjectURL(fileBuffer);
    const img = new Image();
    img.onload = () => {
      canvas2.width = img.width;
      canvas2.height = img.height;
      ctx.clearRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0, img.width, img.height);
      URL.revokeObjectURL(blobUrl);
    };
    img.onerror = () => {
      console.error("Failed to load image");
      URL.revokeObjectURL(blobUrl);
    };
    img.src = blobUrl;
    canvas2.addEventListener("mousedown", (event) => {
      setIsDrawing(true);
      const pos = getMousePos(event, canvas2);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    });
    canvas2.addEventListener("mousemove", (event) => {
      if (!isDrawing) return;
      const pos = getMousePos(event, canvas2);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    });
    canvas2.addEventListener("mouseup", () => {
      setIsDrawing(false);
      ctx.closePath();
    });
    canvas2.addEventListener("mouseleave", () => {
      setIsDrawing(false);
    });
  }, [fileBuffer]);
  return /* @__PURE__ */ BdApi.React.createElement(Modals.ModalRoot, { ...props, size: "LARGE" }, /* @__PURE__ */ BdApi.React.createElement(Modals.ModalContent, null, /* @__PURE__ */ BdApi.React.createElement(
    "canvas",
    {
      ...props,
      ref: canvasRef,
      style: { maxWidth: "100%", maxHeight: "500px" }
    }
  )));
};
var ImageEdit16Filled = ({ size }) => /* @__PURE__ */ BdApi.React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 16 16" }, /* @__PURE__ */ BdApi.React.createElement(
  "path",
  {
    fill: "var(--interactive-normal)",
    d: "M4.5 2A2.5 2.5 0 0 0 2 4.5v6.998c0 .51.152.983.414 1.379l4.383-4.383a1.7 1.7 0 0 1 2.404 0l.34.34l2.088-2.087a2.558 2.558 0 0 1 2.369-.689V4.5a2.5 2.5 0 0 0-2.5-2.5H4.5Zm6.998 3.501a1.002 1.002 0 1 1-2.003 0a1.002 1.002 0 0 1 2.003 0Zm1.764 1.506a1.554 1.554 0 0 0-.926.447L8.05 11.742a2.776 2.776 0 0 0-.73 1.29l-.304 1.21a.61.61 0 0 0 .74.74l1.21-.303a2.776 2.776 0 0 0 1.29-.73l4.288-4.288a1.56 1.56 0 0 0-1.28-2.654ZM8.835 9.541l-1.493 1.493a3.777 3.777 0 0 0-.994 1.755l-.302 1.209H4.5c-.51 0-.984-.153-1.379-.414L7.504 9.2a.7.7 0 0 1 .99 0l.34.34Z"
  }
));
var EditUploads = class {
  start() {
    Patcher.after(Toolbar, "Z", (_, [args], returnValue) => {
      if (returnValue?.props?.actions?.props?.children && args?.upload?.item?.file) {
        const fileBuffer = args.upload.item.file;
        returnValue.props.actions.props.children.unshift(
          /* @__PURE__ */ BdApi.React.createElement(ToolbarButton, { tooltip: "Edit Upload", onClick: () => {
            ModalSystem.openModal(
              (modalProps) => /* @__PURE__ */ BdApi.React.createElement(CanvasHolder, { ...modalProps, fileBuffer })
            );
          } }, /* @__PURE__ */ BdApi.React.createElement(ImageEdit16Filled, { size: "24px" }))
        );
      }
    });
  }
  stop() {
    Patcher.unpatchAll();
  }
};
