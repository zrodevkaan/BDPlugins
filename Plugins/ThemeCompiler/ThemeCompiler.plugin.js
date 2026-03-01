/**
 * @name ThemeCompiler
 * @description Autocompiles theme files
 * @version 1.0.0
 * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/ThemeCompiler/ThemeCompiler.plugin.js 
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

// src/ThemeCompiler/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => ThemeCompiler
});
module.exports = __toCommonJS(index_exports);
var css = `
$(97009, form) {
  display: grid;
  grid-template-areas: "floatingBars floatingBars floatingBars" "stackedBars stackedBars stackedBars" "stickerPreviews stickerPreviews stickerPreviews" "stickerPreviewDivider stickerPreviewDivider stickerPreviewDivider" "channelAttachmentArea channelAttachmentArea channelAttachmentArea" "textArea textArea textArea" "accessoryBarLeft accessoryBarText accessoryBarRight";
  grid-template-columns: [start] min-content [textBar-start] 1fr [textBar-end] min-content [end];
  background: var(--bg-overlay-floating,var(--chat-background-default));
  border: 1px solid var(--border-faint);
  border-radius: var(--radius-sm);
  margin-left: var(--space-xs);
  margin-right: var(--space-xs);
  margin-bottom: var(--space-xs);
  padding: 0 !important;
  transition: border-color .2s ease;
  &:focus-within {
    border-color: var(--border-subtle);
  }
  > div:not([class]), $(97009, channelBottomBarArea), $(97009, channelTextArea), $(564355, scrollableContainer), $(564355, inner) {
    display: contents;
  }
  .floatingBars__74017 {
    grid-area: floatingBars;
  }
  .stackedBars__74017 {
    grid-area: stackedBars;
  }
  .stickerPreviews_a4cf0b {
    grid-area: stickerPreviews;
  }
  .stickerPreviewDivider_a4cf0b {
    grid-area: stickerPreviewDivider;
  }
  .channelAttachmentArea_b77158 {
    grid-area: channelAttachmentArea;
  }
  .textArea__74017 {
    grid-area: textArea;
    height: unset !important;
    > div {
      max-height: 144px;
      overflow: hidden scroll;
      &::-webkit-scrollbar {
        width: 12px;
        height: 12px
      }
      &::-webkit-scrollbar-thumb, &::-webkit-scrollbar-track {
        background-clip: padding-box;
        border: 4px solid transparent
      }
      &::-webkit-scrollbar-track {
        border-width: medium;
        border-width: initial
      }
      &::-webkit-scrollbar-thumb {
        background-color: hsl(var(--primary-800-hsl)/.6);
        border-radius: 8px
      }
    }
  }
  div:is(.attachWrapper__0923f, .attachButton__74017) + .textArea__74017:after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 8px;
    right: 8px;
    border-top: 1px solid var(--background-mod-subtle);
    height: 1px;
  }
  .slateTextArea_ec4baf.slateTextArea_ec4baf {
    margin-left: 15px;
  }
  .attachWrapper__0923f, .attachButton__74017 {
    grid-area: accessoryBarLeft;
  }
  .attachButton__74017 {
    grid-area: accessoryBarLeft;
    margin: 0;
  }
  .attachButton__0923f.attachButton__0923f {
    height: var(--accessoryHeight);
    min-height: 100%;
    margin-left: 0;
    padding: var(--space-4) var(--space-12) var(--space-4) var(--space-md);
  }
  .icon__4d3a9 {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    height: var(--accessoryHeight);
    min-height: 100%;
    padding: var(--space-4) var(--space-12) var(--space-4) var(--space-md);
  }
  .wrapper__1a58a, .wrapper__1a58a svg, .wrapper_ca5f52, .wrapper_ca5f52 svg {
    width: 20px !important;
    height: 20px !important;
  }
  .buttons__74017 {
    height: var(--accessoryHeight);
    min-height: 100%;
    grid-area: accessoryBarRight;
    padding-right: 12px;
    &:empty, &:has(.separator_aa63ab:first-child) {
      display: none;
    }
  }
}`;
var GRAB_MODULES_REGEX = /\$\((\d+),\s*([^)]+)\)/g;
var ReplaceModules = () => css.replace(GRAB_MODULES_REGEX, (_, id, className) => `.${window.n(id)[className]}`);
var ThemeCompiler = class {
  start() {
    console.log(ReplaceModules());
  }
  stop() {
  }
};
