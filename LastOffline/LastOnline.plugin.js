/**
 * @name LastOffline
 * @description Allows you to see when someone went last offline.
 * @author davilarek, _ninelota_
 * @version 1.0.0
 */

const { Webpack } = BdApi;
const PresenceStore = Webpack.getStore('PresenceStore');
const UserStore = Webpack.getStore('UserStore');

class LastOnline {
  constructor() {
    this.name = LastOnline.name;
    this.presenceEventListener = null;
    this.patches = [];
    this.classes = {};
    this.cache = BdApi.Data.load(this.name, "data") ?? {};
    this.getStatusOfUser = BdApi.Webpack.getStore("PresenceStore").getStatus;
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
