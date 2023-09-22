/**
 * @name Unshortener
 * @description Unshortens any message you right click. (e.g gg.gg, goog.l etc...)
 * @author imafrogowo
 * @version 1.0.0
 */
const request = require("request");
const fs = require("fs");
const path = require("path");
const pluginsFolder = BdApi.Plugins && BdApi.Plugins.folder ? BdApi.Plugins.folder : window.ContentManager.pluginsFolder;

const {
    ContextMenu,
    React,
    ReactDOM
} = BdApi;

const {
    Notifications
} = XenoLib

class Unshortener {

    constructor() {
        this.URL = "";
        this.Patch = null;
    }

    async startPatch() {
        this.Patch = ContextMenu.patch('message', async (MessageReturnVal, props) => {
            const {
                message
            } = props;
            console.log(MessageReturnVal.props.children)

            const ButtonGroup = ContextMenu.buildItem({
                type: 'button',
                label: 'Get Link Info',
                action: async () => {
                    for (const child of MessageReturnVal.props.children) {
                        if (child && child.props && child.props.className) {
                            const className = child.props.className;
                            console.log(className);
                        }
                    }
                    const links = this.getLinks(message.content);
                    const resolvedLinks = [];
                    for (const element of links) {
                        const apiUrl = `https://unshorten.me/s/${element}`;

                        try {
                            const response = await fetch(apiUrl);
                            const text = await response.text();
                            resolvedLinks.push(`Resolved: ${text}`);
                            text.includes("Error") ? Notifications.error(`Couldn't parse ${element}`, {
                                timeout: 0
                            }) : Notifications.success(`Resolved: ${text}`, {
                                timeout: 0
                            });

                        } catch (error) {
                            console.log(error);
                        }
                    }
                },
            });

            MessageReturnVal.props.children.splice(1, 0, ButtonGroup);
        });
    }


    getLinks(text) {
        const regex = /https?:\/\/[^\s]+/g;
        return text.match(regex);
    }

    start() {
        if (!this.Patch) {
            this.startPatch();
        } else {
            console.log("Unshortener patch is already started.");
        }
    }

    stop() {
        if (this.Patch) {
            this.Patch();
            this.Patch = null;
        } else {
            console.log("Unshortener patch is not active.");
        }
    }

    load() {
        const downloadXenoLib = () => {
            if (global.XenoLib) {
                return console.log('XenoLib Exists')
            }
            request("https://gitea.slowb.ro/Davilarek/MessageLoggerV2-fixed/raw/branch/master/Plugins/1XenoLib.plugin.js", (error, response, body) => {
                try {
                    if (error || response.statusCode !== 200) {
                        // modalTools.closeModal(modalInstance);
                        //showAlert();
                        return;
                    }

                    fs.writeFile(path.join(pluginsFolder, "1XenoLib.plugin.js"), body, () => {
                        if ((BdApi.isSettingEnabled("fork-ps-5") || BdApi.isSettingEnabled("autoReload")) && !isPowercord) {
                            return;
                        }
                        BdApi.showToast("Reload to load the libraries and plugin!");
                    });
                } catch (error) {
                    //console.error("Fatal error downloading XenoLib", error);
                    // modalTools.closeModal(modalInstance);
                    BdApi.showToast("Error downloading 1XenoLib. Tell imafrogowo.");
                    showAlert();
                }
            });
        };
        downloadXenoLib();
    }
}

module.exports = Unshortener;
