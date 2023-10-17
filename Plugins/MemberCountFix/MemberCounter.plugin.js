/**
 * @name MemberCounter
 * @author SyndiShanX, imafrogowo
 * @description Displays the Member Count of a Server or the DMs you have open
 * @version 0.0.3
 */

const { Webpack: { getModule, getStore }, React, findModuleByProps, Patcher } = BdApi;

class MemberCounter {
  constructor() {
    this.name = MemberCounter.name
    this.version = '0.0.3'
    this.patches = [];
    this.MenuItems = {
      ...getModule((m) => m.MenuRadioItem),
    };
  }
  addPatch(patchType, moduleToPatch, functionName, callback) {
    this.patches.push(
      Patcher[patchType]("MemberCount", moduleToPatch, functionName, callback)
    );
  }
  load() {
    if (window.Kaan) {
      Kaan.isUpdateAvailable(this.name, this.version)
        .then((updateAvailable) => {
          if (updateAvailable) {
            BdApi.showConfirmationModal("Update Plugin", `A new version of ${this.name} is available. Do you want to update now?`, {
              confirmText: "Update Now",
              cancelText: "Cancel",
              onConfirm: () => {
                Kaan.updatePlugin(this.name, this.version);
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
                require('fs').writeFile(require("path").join(BdApi.Plugins.folder, "Kaan.plugin.js"), body, (err) => {
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
    const MemberList = findModuleByProps("ListThin");
    this.addPatch(
      "after",
      MemberList.ListThin,
      "render",
      (SyndiShanXIsAwesome, [args], ret) => {
        const ChannelStore = getStore("ChannelStore")
        const SelectedGuildStore = findModuleByProps("getLastSelectedGuildId");
        const SelectedChannelStore = findModuleByProps("getLastSelectedChannelId");
        const MemberCount = findModuleByProps("getMemberCounts").getMemberCount(
          SelectedGuildStore.getGuildId()
        );
        //const UseStateFromStores = getModule(m => m.toString?.().includes("useStateFromStores"));
        const { groups } = BdApi.Webpack.getStore("ChannelMemberStore").getProps(
          SelectedGuildStore.getGuildId(),
          SelectedChannelStore.getChannelId()
        );

        const OnlineMembers = groups.filter(group => group.id == "online")[0];
        const ThreadBasedOnlineMembers = ChannelStore.getChannel(SelectedChannelStore.getChannelId()).memberCount || OnlineMembers?.count;
        const DMCount = BdApi.Webpack.getStore(
          "PrivateChannelSortStore"
        ).getSortedChannels()[1];
        const onlineCounter = React.createElement(
          "div",
          {
            className: "member-counter-wrapper",
            style: { textAlign: "center", marginBottom: "-10px" },
          },
          React.createElement(
            "h1",
            {
              className:
                "member-counter-text membersGroup-2eiWxl container-q97qHp",
              style: { color: "var(--channels-default)", fontWeight: "bold" },
            },
            `🟢 Online - ${ThreadBasedOnlineMembers}`
          )
        );

        const offlineCounter = React.createElement(
          "div",
          {
            className: "member-counter-wrapper",
            style: { textAlign: "center" },
          },
          React.createElement(
            "h1",
            {
              className:
                "member-counter-text membersGroup-2eiWxl container-q97qHp",
              style: { color: "var(--channels-default)", fontWeight: "bold" },
            },
            `⚫ Offline - ${parseInt(MemberCount) - parseInt(OnlineMembers?.count)}`
          )
        );

        const dmCounter = React.createElement(
          "div",
          {
            className: "member-counter-wrapper",
            style: { textAlign: "center", marginTop: "-20px" },
          },
          React.createElement(
            "h3",
            {
              className:
                "member-counter-text membersGroup-2eiWxl container-q97qHp",
              style: {
                color: "var(--channels-default)",
                fontWeight: "bold",
              },
            },
            `🟢 DMs - ${DMCount?.length}`
          )
        );

        const counterWrapper = MemberCount?.toLocaleString() !== undefined ? (
          React.createElement(
            "div",
            null,
            onlineCounter,
            offlineCounter
          )
        ) : (
          React.createElement(
            "div",
            {
              className: "dmcounter-wrapper",
              style: { textAlign: "center" },
            },
            dmCounter
          )
        );

        const children = ret.props.children[0].props.children.props.children;
        children.splice(1, 0, counterWrapper);
        ret.props.children[0].props.children.props.children = children;
      }
    );
  }
  stop() {
    this.patches.forEach((x) => x());
  }
}

module.exports = MemberCounter
