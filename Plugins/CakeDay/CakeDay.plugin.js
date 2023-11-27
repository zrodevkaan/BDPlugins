/**
 * @name CakeDay
 * @author Imafrogowo, knewest
 * @version 1.2.2
 * @description Allowing us to set birthdays – because we're basically the human equivalent of goldfish when it comes to remembering special dates.
 */

const {
  Patcher,
  React,
  Data, // I wanted to use this but nahhhhhhhhh.
  ContextMenu,
  findModuleByProps,
  Webpack: { getModule },
} = BdApi;

class CakeDay {
  constructor() {
    this.patches = [];
    this.verison = "1.2.2"
    this.name = CakeDay.name
    this.savedBirthdays = {}; // Initialize an object to store saved birthdays
  }

  load() {
    if (window.Kaan) {
        Kaan.isUpdateAvailable(this.constructor.name, this.version)
            .then((updateAvailable) => {
                if (updateAvailable) {
                    BdApi.showConfirmationModal("Update Plugin", `A new version of ${this.constructor.name} is available. Do you want to update now?`, {
                        confirmText: "Update Now",
                        cancelText: "Cancel",
                        onConfirm: () => {
                            Kaan.updatePlugin(this.constructor.name, this.version);
                        }
                    });
                }
            })
            .catch((error) => {
                console.error(error.message);
            });
    } else {
        BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${this.constructor.name} is missing. Please click Download Now to install it.`, {
            confirmText: "Download Now",
            cancelText: "Cancel",
            onConfirm: () => {
                require("request").get("https://raw.githubusercontent.com/ImAFrogOwO/BDPlugins/main/Kaan.plugin.js", async (error, response, body) => {
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
    BdApi.DOM.addStyle(
      "DiscordCakeDay-CSS",
      `.discord-cake-day-message-cake, .discord-cake-day-member-cake {
        display: inline-block; 
        height: 16px; 
        width: 16px; 
        min-width: 16px; 
        min-height: 16px; 
        margin-left: 6px; 
        vertical-align: middle; 
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAADH0lEQVRYw+2WTUycVRSGn3Pu5eMbJghSqT8sqjbtwnSjiUbSxJgmtli70Oh0ogmVuKldGN24MMaFGzcu0E50ZxxhYUpNdQH+Ld0qmlCMqa1aQEQLM8wMA8zP993rAqVkLIoRJ5rw7m7uzXnfe857Tg7sYAf/VRwbOMuxgbObnptG/tCTIy8fPXHm7sb77YJcixyQ0WzKHz1x5tMwkXwgdo7q6nJdVV8XOD02lJ7Z+H40m9oeAQ3k54LW5CO9hw5yiy0zOe+YufA9S6UcURTNqkjGeTf40fDjtX8iRjYhf9sGyYGTT/e5wyMvKh+M4J95nuHbn2DifI56tUwhP09xMYf3/ktRyYy9k842fmYrYuQa5G8FQfhU35Fel3q0W4PHjmMnv6La9zB+8FXee/9nvr60hDGKiFAuFcjnrlAuFUH4RJDM2FB6rNEvm4mRBvI3wzA81XPrHZw8voeuDotLCnjAg67CT/MVsuemCFp0LYAIImuJLCwusJhfYLm8hKoOA5kPh9Kf/1lW7AbyN8IwPLV3/wEq1Yi5hQo33tBOfQW8BxEIAsgXa6hctY73Hu89AB2du+js6sbFEfmF+f5CYaH/wf536yKaETg9mk1NNYqR31rtlTCReGHvvgM4FwNQqzsO3dvN/tvaubnbcHm2xvhkgYkLRYIWxf9VXUUwaqhUVijk1zITx9GciGSAwdFsqvJ7CZ51zr3Wfl2nExHdGCiOPfXY4WKwRrBWUJW/3WgiYIylVMwTRREAqnoRuMt654507dpNoq1Nvd9KQL/VkfIHJNraAEFVmZud2hfHcY/1+MgGCVoTneu1/LehxgLTgHe2VnccPribe+7cQ+xcUwQkE5bnXjpPqeqxKsKVXJVL08u4JgkIW1twHlTAWitMfFvkhzmDpzklMGqIYo9RwQKoCMaA99IcAUbW7Wy9h2TCcH1HQJM8iLVmvWdstebou+8m7u/tIY6bIyAZQnp8nJVVh20NlI8/+4UvvomamoFq3dFiFSsgq1VPqeybZ0JzdeBaNcb9OP0dM1MXm7dwejDWoqq1bd/x/neb9w528CtJD20wscn0EwAAAABJRU5ErkJggg=='); 
        background-size: 16px;
      }

      .birthday-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #2F3136 !important; /* Why couldn't I remove it without "!important"?? - Knew */
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

      .close-button:hover, .set-button:hover {
        background-color: #5B6EAE;
        border-radius: 4px;
        transition: background-color 0.15s ease-in-out;
      }

      .birthday-input {
        width: 100%;
        padding-top: 8px;
        padding-bottom: 8px;
        border-radius: 4px;
        border: 1px solid #72767d;
        background: #3A3C42;
        color: #DCDDDE;
        margin-top: 8px;
        transition: border 0.15s ease-in-out, background-color 0.15s ease-in-out;
      }

      `
    );

    function getModuleWithKey(filter) {
      let target; let id; let key;
  
      BdApi.Webpack.getModule(
        (e, m, i) => filter(e, m, i) && (target = m) && (id = i) && true,
        { searchExports: true },
      );
  
      for (const k in target.exports) {
        if (filter(target.exports[k], target, id)) {
          key = k;
          break;
        }
      }
  
      return [target.exports, key];
    }

    //const GetUser = (ID) => getModule(x=>x.getUser).getUser(ID) >> Realized isnt needed. Patch returns user object.
    const Tooltip = BdApi.Webpack.getModule((x) => x.Tooltip).Tooltip;
    const Tree = BdApi.Webpack.getModule(x=>x?.UsernameDecorationTypes)

    this.UnpatchBirthdayContext = ContextMenu.patch(
      "user-context",
      (res, props) => {
        const ButtonGroup = ContextMenu.buildItem({
          type: "button",
          label: "Add Birthday",
          onClick: () => {
            this.createBirthdayModal(props.user);
          },
        });
        const ColorDanger = BdApi.findModuleByProps(
          "colorDanger",
          "colorPremium"
        )["colorDanger"]; // Stole from AssignBadgesRewrite. my beloved davvy
        const ClearButtonGroup = ContextMenu.buildItem({
          type: "button",
          label: "Clear Birthday",
          className: ColorDanger,
          onClick: () => {
            this.clearBirthday(props.user);
          },
          bold: true,
        });

        const Separator = ContextMenu.buildItem({ type: "separator" });

        res.props.children.push(Separator);
        res.props.children.push(ButtonGroup); // PUSH BABY PUSH
        res.props.children.push(ClearButtonGroup);
      }
    );
    
    this.Pastel = Patcher.after("mybelovedPastelLove", Tree, "default", (OwO, [props], ret) => {
      const Author = props?.message?.author;
      const Decorations = ret.props?.children[4]?.props?.children;
      if (Author.id in this.savedBirthdays) {
        const Today = new Date();

        let [MonthStr, DayStr] = this.savedBirthdays[Author.id].split("/");

        if (DayStr > 12) {
          // dude. voidloops asked for DD/MM and MM/DD. curse you !!
          [MonthStr, DayStr] = [DayStr, MonthStr];
        }

        let Month = parseInt(MonthStr);
        let Day = parseInt(DayStr);

        if (
          (Today.getMonth() + 1 === Month && Today.getDate() === Day) ||
          (Today.getDate() === Month && Today.getMonth() + 1 === Day)
        ) {
          Decorations?.push(
            React.createElement(
              Tooltip,
              {
                text: "It's my birthday!",
              },
              (data) =>
                React.createElement("button", {
                  ...data,
                  className: "discord-cake-day-message-cake",
                  onClick: () => {
                    this.createBirthdayModal(Author);
                  },
                })
            )
          );
        }
      }

      // SyntaxError: Invalid left-hand side in assignment XD \\
      const TargetChild = ret.props.children[3]?.props;
      if (TargetChild) {
        TargetChild.children = Decorations ?? TargetChild.children;
      }
    });

    this.savedBirthdays = BdApi.Data.load("CakeDay", "savedBirthdays") || {};
  }

  clearBirthday(user) {
    if (user && user.id) {
      const userId = user.id;
      if (userId in this.savedBirthdays) {
        delete this.savedBirthdays[userId];
        BdApi.Data.save("CakeDay", "savedBirthdays", this.savedBirthdays);
        this.showCustomToast(`Cleared birthday for ${user.username}`, 1);
      }
    }
  }

  createBirthdayModal = (author) => {
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

    const modal = document.createElement("div");
    modal.style.cssText = modalStyles;
    modal.className = "birthday-modal";

    const closeButton = createButton("", "close-button", () =>
      modal.remove()
    );
    const titleLabel = createHeading(`Set ${author.username}’s birthday:`, "h2");
    const birthdayInput = createInput(
      "text",
      "    MM/DD or DD/MM",
      "birthday-input"
    );
    const setButton = createButton("Set birthday?", "set-button", () =>
      handleSetButtonClick()
    );

    titleLabel.style = "color: white; font-family: 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;";
    modal.append(titleLabel, birthdayInput, setButton, closeButton); // Just making sure that the close button appears on top. - Knew

    const handleSetButtonClick = () => {
      const birthday = birthdayInput.value;
      if (isValidBirthday(birthday)) {
        this.showCustomToast(`Birthday set for ${author.username}!`, 1);

        // birfday savin when?
        this.savedBirthdays[author.id] = birthday;
        BdApi.Data.save("CakeDay", "savedBirthdays", this.savedBirthdays);

        modal.remove();
      } else {
        this.showCustomToast("Please set a valid birthday!", 2);
      }
    };

    modal.append(closeButton, titleLabel, birthdayInput, setButton);
    document.body.appendChild(modal);

    function createButton(text, className, clickHandler) {
      const button = document.createElement("button");
      button.textContent = text;
      button.className = className;
      button.addEventListener("click", clickHandler);

      if (className === "close-button") {
        const svgData = `
              <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#FFFFFF">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                  <g id="SVGRepo_iconCarrier">
                      <g clip-path="url(#clip0_429_10978)">
                          <path d="M16.9999 7.00004L6.99994 17" stroke="#f2f2f2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M7.00006 7.00003L17.0001 17" stroke="#f2f2f2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </g>
                      <defs>
                          <clipPath id="clip0_429_10978">
                              <rect width="24" height="24" fill="white"/>
                          </clipPath>
                      </defs>
                  </g>
              </svg>
          `;
        const svgDataURL = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgData);
        button.style.backgroundImage = `url('${svgDataURL}')`;
        button.style.backgroundSize = "contain";
        button.style.backgroundRepeat = "no-repeat";
        button.style.backgroundPosition = "center";
      } // I couldn't add the SVG through CSS for some reason (nothing would appear). Either way, this reduces the number of HTTP requests made. - Knew

      return button;
    }

    function createHeading(text, level) {
      const heading = document.createElement(level);
      heading.textContent = text;
      return heading;
    }

    function createInput(type, placeholder, className) {
      const input = document.createElement("input");
      input.type = type;
      input.placeholder = placeholder;
      input.className = className;
      return input;
    }

    function isValidBirthday(birthday) {
      // vee goes expert regex101.com mode.
      const pattern =
        /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$|^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/;
      return pattern.test(birthday);
    }
  };

  showCustomToast(message, type) {
    const showToast = BdApi.Webpack.getModule(x => x.showToast).showToast
    const { createToast } = getModule((x) => x.createToast);
    showToast(createToast(message, type));
  }

  stop() {
    BdApi.DOM.removeStyle("DiscordCakeDay-CSS");
    BdApi.DOM.removeStyle("CakeDayCSS");
    this.Pastel();
    this.UnpatchBirthdayContext();
  }

  getSettingsPanel() {
    const CakeDayCSS = `
  .cake-day-table {
    width: 100%;
    border-collapse: collapse;
  }
  .cake-day-table th,
  .cake-day-table td {
    border: none;
    padding: 8px;
    text-align: left;
    color: white;
    vertical-align: middle;
  }
  .cake-day-table th {
    font-weight: bold;
  }
  .cake-day-profile a {
    display: inline-block;
    text-decoration: none;
  }
  .cake-day-profile img {
    max-width: 48px;
    border-radius: 25px;
  }
  .clear-birthday-button {
    text-align: center;
    vertical-align: middle;
  }
`;
    const rows = [];
    for (const userId in this.savedBirthdays) {
      if (this.savedBirthdays.hasOwnProperty(userId)) {
        const birthday = this.savedBirthdays[userId];
        const user = BdApi.Webpack.getStore("UserStore").getUser(userId);
        if (user) {
          const profileLink = React.createElement(
            "a",
            { href: "#"},
            React.createElement("img", {
              src: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=1024`,
            })
          );
          rows.push(
            React.createElement(
              "tr",
              { key: userId, "data-user-id": userId },
              React.createElement(
                "td",
                { className: "cake-day-profile" },
                profileLink
              ),
              React.createElement("td", null, user.username),
              React.createElement("td", null, birthday),
              React.createElement(
                "button",
                {
                  onClick: () => {
                    this.clearBirthday(user)
                    //console.log(user)
                  },
                  className: "clear-birthday-button bd-button button-ejjZWC lookFilled-1H2Jvj colorBrand-2M3O3N sizeMedium-2oH5mg grow-2T4nbg"
                },
                "Clear Birthday"
              )
            )
          );
        }
      }
    }
    return React.createElement(
      "div",
      { className: "cake-day-settings" },
      React.createElement("style", null, CakeDayCSS),
      React.createElement(
        "table",
        { className: "cake-day-table" },
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement("th", null, "Profile Picture"),
            React.createElement("th", null, "Name"),
            React.createElement("th", null, "Date"),
            React.createElement("th", null, "")
          )
        ),
        React.createElement("tbody", null, rows)
      )
    );
  }
}
module.exports = CakeDay;
