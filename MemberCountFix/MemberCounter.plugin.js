/**
 * @name MemberCounter
 * @author SyndiShanX, imafrogowo
 * @description Displays the Member Count of a Server or the DMs you have open
 * @version 0.0.1
 */

const { Webpack, React, findModuleByProps, Patcher } = BdApi;

class MemberCounter {
  constructor() {
    this.patches = [];
    this.MenuItems = {
      ...Webpack.getModule((m) => m.MenuRadioItem),
    };
  }
  addPatch(patchType, moduleToPatch, functionName, callback) {
    this.patches.push(
      Patcher[patchType]("MemberCount", moduleToPatch, functionName, callback)
    );
  }
  start() {
    const MemberList = findModuleByProps("ListThin");
    console.log(MemberList.ListThin);
    this.addPatch(
      "after",
      MemberList.ListThin,
      "render",
      (SyndiShanXIsAwesome, [args], ret) => {
        const SelectedGuildStore = findModuleByProps("getLastSelectedGuildId");
        const MemberCount = findModuleByProps("getMemberCounts").getMemberCount(
          SelectedGuildStore.getGuildId()
        );
        const DMCount = BdApi.Webpack.getStore(
          "PrivateChannelSortStore"
        ).getSortedChannels()[1];
        const counterWrapper =
          MemberCount?.toLocaleString() !== undefined
            ? React.createElement(
                "div",
                {
                  className: "member-counter-wrapper",
                  style: { textAlign: "center" },
                },
                React.createElement(
                  "h3",
                  {
                    className:
                      "member-counter-text membersGroup-2eiWxl container-q97qHp",
                    style: { color: "var(--channels-default)" },
                  },
                  "Members - " + MemberCount?.toLocaleString()
                )
              )
            : React.createElement(
                "div",
                {
                  className: "member-counter-wrapper",
                  style: { textAlign: "center" },
                },
                React.createElement(
                  "h3",
                  {
                    className:
                      "member-counter-text membersGroup-2eiWxl container-q97qHp",
                    style: { color: "var(--channels-default)" },
                  },
                  "DMs - " + DMCount?.length
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
