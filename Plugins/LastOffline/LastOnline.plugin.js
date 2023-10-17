/**
 * @name LastOffline
 * @description Allows you to see when someone went last offline.
 * @author davilarek, imafrogowo
 * @version 1.0.1
 */

const { Webpack } = BdApi;
const PresenceStore = Webpack.getStore('PresenceStore');
const UserStore = Webpack.getStore('UserStore');

class LastOnline {
  constructor() {
    this.name = LastOnline.name;
    this.version = '1.0.1'
    this.githubOwner = "ImAFrogOwO"
    this.presenceEventListener = null;
    this.patches = [];
    this.classes = {};
    this.cache = BdApi.Data.load(this.name, "data") ?? {};
    this.getStatusOfUser = BdApi.Webpack.getStore("PresenceStore").getStatus;
  }

  load() {
    if (Kaan) {
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

  saveToData(prop, val) {
    this.cache[prop] = val;
    BdApi.Data.save(this.name, "data", this.cache);
  }

  /**
   * @param {"after" | "before" | "instead"} patchType
   * @param {object} moduleToPatch
   * @param {string} functionName
   * @param {Function} callback
   */
  addPatch(patchType, moduleToPatch, functionName, callback) {
    this.patches.push(
      (BdApi.Patcher[patchType])(this.name, moduleToPatch, functionName, callback)
    );
  }

  start() {
    this.classes["defCol1"] = BdApi.Webpack.getModule(x => x.defaultColor && x.tabularNumbers).defaultColor;
    this.classes["defCol2"] = BdApi.Webpack.getModule(x => x.defaultColor && !x.tabularNumbers && !x.error).defaultColor;
    this.usernameCreatorModuleGetter = (() => {
      const theString = `"User Tag"`;
      const theFilter = x2 => x2 && x2.toString?.().includes(theString);
      const theFilterMain = x => x && Object.values(x).some(theFilter);
      const theModule = BdApi.Webpack.getModule(theFilterMain);
      const funcName = Object.keys(theModule).find(prop => theFilter(theModule[prop]));
      return { funcName, theFunc: theModule[funcName], theModule };
    })();
    this.presenceEventListener = event => {
      const userId = event.updates[0].user.id;
      const status = event.updates[0].status;

      if (status === 'offline' && !this.cache[userId]) {
        const user = UserStore.getUser(userId);

        if (user) {
          const a = {
            userId,
            user,
            newDate: new Date().getTime(),
          };
          this.saveToData(userId, a);
        }
      }
    };

    BdApi.Webpack.getModule(e => e.dispatch && !e.emitter && !e.commands).subscribe("PRESENCE_UPDATES", this.presenceEventListener);
    const getUsernameProps = (lastTimeOnline, targetProps, userId) => [
      targetProps,
      BdApi.React.createElement(
          "h1",
          {
            style: { 
              display: "inline-flex",
              marginLeft: '15px',
              fontSize: "17px",
              fontFamily: "Cosmic Sans, sans-serif",
            },
          className: `${this.classes["defCol1"]} ${this.classes["defCol2"]}`,
          },
          lastTimeOnline ? "Last Online: " + new Date(lastTimeOnline).toLocaleTimeString() : this.getStatusOfUser(userId)
      ),
  ];


    const usernameCreatorModule = this.usernameCreatorModuleGetter;

    this.addPatch("after", usernameCreatorModule.theModule, usernameCreatorModule.funcName, (_, args, ret) => {
        const { id: userId } = args[0]?.user || {};

        if (this.getStatusOfUser(userId) !== "offline") {
            return ret;
        }

        const { newDate } = this.cache[userId] || (this.cache[userId] = "None");
        const lastTimeOnline = newDate || this.cache[userId].newDate;

        const targetProps = ret.props.children.props.children[0].props.children.props.children[0].props.children;
        const modProps = getUsernameProps(lastTimeOnline, targetProps, userId);

        ret.props.children.props.children[0].props.children.props.children[0].props.children = modProps;

        return ret;
    });
  }

  stop() {
    BdApi.Webpack.getModule(e => e.dispatch && !e.emitter && !e.commands).unsubscribe("PRESENCE_UPDATES", this.presenceEventListener);
    this.patches.forEach(x => x());
    BdApi.Data.save(this.name, "data", this.cache);
  }
}

module.exports = LastOnline;
