/**
 * @name EditServers
 * @description Allows you to local edit server names
 * @version 1.0.2
 * @author imafrogowo
 */

const { Webpack, React, ContextMenu, Data, Patcher } = BdApi;

class EditServers {
  constructor() {
    this.name = EditServers.name
    this.version = '1.0.2'
    this.githubOwner = "ImAFrogOwO"
    this.FluxDispatcher = Webpack.getModule(
      (e) => e.dispatch && !e.emitter && !e.commands
    );
  }

  start() {
    this.GetMutualsGuildPatch = ContextMenu.patch(
      "guild-context",
      (res, props) => {
        const buttonGroup = ContextMenu.buildItem({
          type: "button",
          label: "Edit Server",
          onClick: () => this.createModal(props.guild),
        });
        res.props.children.push(
          ContextMenu.buildItem({ type: "separator" }),
          buttonGroup
        );
      }
    );
    const GuildItem = ((
      target // Took from TypingIndicator.plugin.js
    ) =>
      target
        ? [
          target,
          Object.keys(target).find((k) =>
            ["includeActivity", "onBlur"].every((s) =>
              target[k]?.toString?.().includes(s)
            )
          ),
        ]
        : [])(
          Webpack.getModule(
            (m) =>
              Object.values(m).some((m) =>
                ["includeActivity", "onBlur"].every((s) =>
                  m?.toString?.().includes(s)
                )
              ),
            { searchGetters: false }
          )
        );
    this.GuildPatch = Patcher.after(
      "EditServers",
      GuildItem[0],
      "Z",
      (a, b, c) => {
        const Guild = c?.props?.text?.props?.guild;

        if (Guild) {
          const savedData = Data.load("EditServersData", "data") || {};
          const guildData = savedData[Guild.id];

          if (guildData) {
            const newName = guildData.settingName || guildData.originalName;
            Guild.name = newName;
          }
        }
      }
    );
  }

  createModal(server) {
    const ConfirmationModal = Webpack.getModule(m => m?.toString?.()?.includes('.confirmButtonColor'), { searchExports: true });
    Webpack.getModule(m => m.openModal).openModal(props => {
      return React.createElement(
        "div",
        {},
        React.createElement(ConfirmationModal, Object.assign({
          header: `${server.name}`,
          confirmButtonColor: BdApi.findModuleByProps('button', 'colorBrand').colorBrand,
          confirmText: `Confirm`,
          cancelText: 'Clear',
          onConfirm: (sdfsdf) => {
            this.SetButtonClick(server, this.serverName)
          },
          onCancel: () => {
            this.ResetButtonClick(server)
          },
          ...props,
        }),
          React.createElement("div", {}, React.createElement(Webpack.getModule(x => x.TextArea).TextInput, { placeholder: "Enter new guild name.", onChange: (v) => { this.serverName = v } })),
        )
      );
    });
  }

  ResetButtonClick(server) {
    const savedData = Data.load("EditServersData", "data") || {};
    if (savedData[server.id]) {
      const originalName = savedData[server.id].originalName;
      const currentName = server.name;

      if (currentName !== originalName) {
        server.name = originalName;
        console.log(originalName)
        savedData[server.id].settingName = "";
        Data.save("EditServersData", "data", savedData);
      }
    }
  }

  SetButtonClick(server, name) {
    const guildStore = BdApi.Webpack.getStore("GuildStore");
    if (guildStore) {
      const guildData = guildStore.getGuild(server.id);
      if (guildData) {
        const savedData = Data.load("EditServersData", "data") || {};
        savedData[server.id] = {
          ...(savedData[server.id] || {}), // Preserve stuff. ig
          settingName: name,
          id: server.id,
        };
        Data.save("EditServersData", "data", savedData);
        guildData.name = name;
      }
    }
  }


  stop() {
    this.GetMutualsGuildPatch();
    this.GuildPatch();
  }
}

module.exports = EditServers;