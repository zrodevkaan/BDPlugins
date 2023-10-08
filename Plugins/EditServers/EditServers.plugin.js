/**
 * @name EditServers
 * @description Allows you to change a servers name locally. 
 * @author imafrogowo
 */

const { Webpack, React, ContextMenu, Data, Patcher } = BdApi;

class EditServers {
  constructor() {
    this.FluxDispatcher = Webpack.getModule(
      (e) => e.dispatch && !e.emitter && !e.commands
    );
    BdApi.DOM.addStyle(
      "EditServers-CSS",
      `
      .server-info-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #2F3136 !important;
        color: #DCDDDE;
        padding: 20px;
        width: 300px;
        border-radius: 8px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
        font-family: 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        z-index: 10000;
      }
      .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: transparent;
        color: white;
        border: none;
        font-weight: 600;
        cursor: pointer;
        width: 20px;
        height: 20px;
        display: inline-block;
      }
      
      .close-button:hover {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }
      .set-button {
        background-color: #7289DA;
        color: white;
        border: none;
        border-radius: 4px;
        width: 304px;
        height: 37px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 8px;
        display: inline-block;
        transition: background-color 0.15s ease-in-out;
      }

      .clear-button {
        background-color: #ff0000;
        color: white;
        border: none;
        border-radius: 4px;
        width: 304px;
        height: 37px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 8px;
        display: inline-block;
        transition: background-color 0.15s ease-in-out;
      }

      .clear-button:hover {
        background-color: #990000;
        transition: background-color 0.15s ease-in-out;
        border-radius: 4px;
      }
      
      .close-button:hover,
      .set-button:hover {
        background-color: #5B6EAE;
        border-radius: 4px;
        transition: background-color 0.15s ease-in-out;
      }
      .clear-button { background-color: #ff0000; }
      .clear-button:hover { background-color: #990000; }
      .close-button:hover, .set-button:hover { background-color: #5B6EAE; }
      .server-info-input {
        width: 100%;
        padding: 8px 0;
        border-radius: 4px;
        border: 1px solid #72767d;
        background: #3A3C42;
        color: #DCDDDE;
        margin-top: 8px;
        transition: border 0.15s ease-in-out, background-color 0.15s ease-in-out;
      }
    `
    );
  }

  createElem(type, text, className, clickHandler, backgroundSVG = "") {
    const elem = document.createElement(type);
    elem.textContent = text;
    elem.className = className;
    elem.addEventListener("click", clickHandler);
    if (backgroundSVG) {
      const svgDataURL =
        "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(backgroundSVG);
      elem.style.backgroundImage = `url('${svgDataURL}')`;
      elem.style.backgroundSize = "contain";
      elem.style.backgroundRepeat = "no-repeat";
      elem.style.backgroundPosition = "center";
    }
    return elem;
  }

  start() {
    //this.PatchGuildItem();
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
    const modalStyles = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      color: #333;
      padding: 20px;
      width: 300px;
      border-radius: 5px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    `;

    const modal = this.createElem("div", "", "server-info-modal");
    modal.style.cssText = modalStyles;
    const closeButton = this.createElem(
      "button",
      "",
      "close-button",
      () => modal.remove(),
      `
      <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#FFFFFF">
        <g id="SVGRepo_bgCarrier" stroke-width="0"/>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
        <g id="SVGRepo_iconCarrier">
          <g clip-path="url(#clip0_429_10978)">
            <path d="M16.9999 7.00004L6.99994 17" stroke="#f2f2f2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.00006 7.00003L17.0001 17" stroke="#f2f2f2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <defs>
            <clip-path id="clip0_429_10978">
              <rect width="24" height="24" fill="white"/>
            </clip-path>
          </defs>
        </g>
      </svg>
    `
    );
    const titleLabel = this.createElem(
      "h2",
      `Server Information: ${server.name}`,
      "",
      null
    );
    const serverInfoInput = this.createElem("input", "", "server-info-input");
    serverInfoInput.type = "text";
    serverInfoInput.placeholder = "Enter server information here";
    const setButton = this.createElem(
      "button",
      "Set Server Name",
      "set-button",
      () => this.SetButtonClick(server, titleLabel, serverInfoInput.value)
    );
    const clearButton = this.createElem(
      "button",
      "Reset Server Name",
      "clear-button",
      () => this.ResetButtonClick(server, titleLabel)
    );

    titleLabel.style =
      "color: white; font-family: 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;";
    modal.append(
      closeButton,
      titleLabel,
      serverInfoInput,
      setButton,
      clearButton
    );
    document.body.appendChild(modal);
  }

  ResetButtonClick(server, titleLabel) {
    const guildStore = BdApi.Webpack.getStore("GuildStore");
    if (guildStore) {
      const guildData = guildStore.getGuild(server.id);
      if (guildData) {
        const savedData = Data.load("EditServersData", "data") || {};
        if (savedData[server.id]) {
          guildData.name = savedData[server.id].originalName;
          titleLabel.textContent = `Server Information: ${guildData.name}`;
        }
      }
    }
  }

  SetButtonClick(server, titleLabel, name) {
    const guildStore = BdApi.Webpack.getStore("GuildStore");
    if (guildStore) {
      const guildData = guildStore.getGuild(server.id);
      if (guildData) {
        const savedData = Data.load("EditServersData", "data") || {};
        savedData[server.id] = {
          originalName: guildData.name,
          settingName: name,
          id: server.id,
        };
        Data.save("EditServersData", "data", savedData);
        guildData.name = name;
        titleLabel.textContent = `Server Information: ${name}`;
      }
    }
  }

  stop() {
    this.GetMutualsGuildPatch();
    this.GuildPatch();
    BdApi.DOM.removeStyle("EditServers-CSS");
  }
}

module.exports = EditServers;
