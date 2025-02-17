/**
 * @name BulkSave
 * @author imafrogowo
 * @description Allows you to download many images at once.
 */

const {
  React,
  Webpack,
  ContextMenu,
  Patcher,
  UI,
  ReactUtils,
  findModuleByProps,
} = BdApi;
const fs = require("fs"); // RIP in 1.13.0
const path = require("path");
const https = require("https");

class Core {
  start() {
    const generateRandomString = (length) => {
        const characters = 
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return [...Array(length)].map(_ =>   
          characters[Math.floor(Math.random() * characters.length)]).join('');
      }
    const GetAttachmentURLs = (Attachments) =>
      Attachments.map((image) => image.proxy_url);

    const DownloadAttachment = async (url, filename) => {
      const downloadDir = path.join(__dirname, "downloads");

      if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir);
      }

      const filePath = path.join(downloadDir, filename);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          return console.log(url + " didn't have any image data");
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const newImageDataURL = buffer.toString("base64");

        fs.writeFileSync(filePath, buffer);

        return buffer;
      } catch (err) {
        console.error("Error saving image:", err);
        return null;
      }
    };

    this.MessagePatch = ContextMenu.patch("message", (res, props) => {
      const ButtonGroup = ContextMenu.buildItem({
        type: "button",
        label: "Bulk Save",
        onClick: () => {
          const Content = props.message.content;
          const URLRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
          const Attachments = props.message.attachments;
          const AttachmentHolder = props.target;
          const Images = Object.values(
            AttachmentHolder.firstChild.firstChild.children
          );
          const ImageArray = GetAttachmentURLs(Attachments);
          const URLsInContent = Content.match(URLRegex);

          ImageArray?.forEach((url) => {
            /* const filename = path.basename(url); - Removed because lazy xDD :3 */
            DownloadAttachment(url, generateRandomString(20) + ".png");
          });

          URLsInContent?.forEach((url) =>
            DownloadAttachment(url, generateRandomString(20) + ".png")
          );
        },
      });

      res.props.children.splice(1, 0, ButtonGroup);
    });
  }
  stop() {
    this.MessagePatch();
  }
}

module.exports = Core;
