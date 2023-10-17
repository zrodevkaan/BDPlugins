/**
 * @name DMCallConfirmation
 * @author imafrogowo
 * @version 1.0.5
 * @description Gives you a confirmation for the people who accidentally do it. Twice.
 */
const { Patcher, Webpack, Utils, React, Data, ReactDOM } = BdApi;
const { Filters, getModule, getStore } = Webpack;
const { findInTree } = Utils; // I'll make onDoubleClick... eventually..
const SwitchRow = getModule(
    Filters.byStrings("tooltipNote"),
    { searchExports: true }
);
class DMCallConfirmation {

    constructor() {
        this.name = DMCallConfirmation.name
        this.version = '1.0.5'
        this.githubOwner = "ImAFrogOwO"
        this.Settings = Data.load("DMCallConfirmation", "data") || {
            callOnDoubleClick: false,
        };
    }

    getUser = (id) => {
        return getModule(x => x.getUser).getUser(id); // test update.
    };

    load() {
        if (window.Kaan) {
            Kaan.isUpdateAvailable(this.githubOwner, this.name, this.version)
                .then((updateAvailable) => {
                    if (updateAvailable) {
                        BdApi.showConfirmationModal("Update Plugin", `A new version of ${this.name} is available. Do you want to update now?`, {
                            confirmText: "Update Now",
                            cancelText: "Cancel",
                            onConfirm: () => {
                                Kaan.updatePlugin(this.githubOwner, this.name, this.version);
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.error(error.message);
                });
        } else {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${this.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://raw.githubusercontent.com/ImAFrogOwO/BDPlugins/main/Plugins/Kaan.plugin.js", async (error, response, body) => {
                        await new Promise((resolve, reject) => {
                            if (error) {
                                reject(new Error(`Failed to download Kaan: ${error.message}`));
                            } else {
                                fs.writeFile(require("path").join(BdApi.Plugins.folder, "Kaan.plugin.js"), body, (err) => {
                                    if (err) {
                                        reject(new Error(`Failed to write Kaan: ${err.message}`));
                                    } else {
                                        resolve();
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
    }


    start() {
        this.CallPatch = Patcher.instead("DMCallConfirmation", getModule(x => x.call && x.ring), "call", (a, b, c) => {
            const channelId = b[0];
            const channelStore = getStore("ChannelStore");
            const channel = channelStore.getChannel(channelId);
            const recipients = channel.recipients;
            console.log("Data:", a, b, c);
            const userNames = recipients.length > 1
                ? (channel.name !== "" ? channel.name : recipients.map(userId => {
                    const user = this.getUser(userId);
                    return user ? user.username : "Unknown User"; // Hm......
                }).join(', '))
                : (recipients.length === 1 ? (this.getUser(recipients[0])?.username || "Unknown User") : channel.name);


            BdApi.showConfirmationModal(`Calling ${userNames}`, `Are you sure you want to call ${userNames}?`, {
                onConfirm: () => c(...b),
            });
        });
        this.onDoubleClickPatch = Patcher.after("DMCallConfirmation", getModule(x => x?.P && x?.P.name == "n").P.prototype, "render", (a, b, c) => {
            if (this.Settings.callOnDoubleClick) {
                const CallButton = findInTree(c, (item) => item?.['aria-label'] == "Start Voice Call", { walkable: ["props", "children", "child", "sibling"] });
                if (CallButton) {
                    CallButton.onDoubleClick = CallButton.onClick;
                    delete CallButton.onClick;
                }
            }
        });
    }

    forceUpdate() {
        const panel = document.getElementsByClassName("button-container");
        if (panel) {
            ReactDOM.render(this.SettingsPanel(), panel[0] || panel[1]);
        }
    }

    stop() {
        this?.CallPatch?.();
        this?.onDoubleClickPatch?.();
    }

    UpdateData(varr, value) {
        this.Settings[varr] = value;
        Data.save("DMCallConfirmation", "data", this.Settings);
        this.forceUpdate();
        // this.Refresh();
    }

    SettingsPanel = () => {
        const callOnDoubleClick = this.Settings.callOnDoubleClick;

        const DoubleClickCall = React.createElement(SwitchRow, {
            children: "Double Click Call",
            note: "When enabled, Changes a single click for a call to a double click.",
            value: callOnDoubleClick,
            onChange: (varr) => { this.UpdateData("callOnDoubleClick", varr); },
        });

        return React.createElement(
            "div",
            { className: "button-container" },
            DoubleClickCall
        );
    };

    getSettingsPanel() {
        return React.createElement(this.SettingsPanel, { className: "pp" });
    }

}

module.exports = DMCallConfirmation;
