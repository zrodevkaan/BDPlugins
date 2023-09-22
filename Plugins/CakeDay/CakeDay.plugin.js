/**
 * @name CakeDay
 * @author Imafrogowo
 * @authorId 917630027477159986
 * @version 1.2.0
 * @invite FFFFFFFFF
 * @description Allowing us to set birthdays – because we're basically the human equivalent of goldfish when it comes to remembering special dates. **Cough cough** ~~voidloops~~
 * @website Allowing us to set birthdays – because we're basically the human equivalent of goldfish when it comes to remembering special dates. **Cough cough** ~~voidloops~~
 * @source Allowing us to set birthdays – because we're basically the human equivalent of goldfish when it comes to remembering special dates. **Cough cough** ~~voidloops~~
 * @updateUrl Allowing us to set birthdays – because we're basically the human equivalent of goldfish when it comes to remembering special dates. **Cough cough** ~~voidloops~~
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
    this.savedBirthdays = {}; // Initialize an object to store saved birthdays
  }

  start() {
    BdApi.DOM.addStyle(
      "DiscordCakeDay-CSS",
      `.discord-cake-day-message-cake, .discord-cake-day-member-cake {display: inline-block; height: 16px; width: 16px; min-width: 16px; min-height: 16px; margin-left: 6px; vertical-align: middle; background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAADH0lEQVRYw+2WTUycVRSGn3Pu5eMbJghSqT8sqjbtwnSjiUbSxJgmtli70Oh0ogmVuKldGN24MMaFGzcu0E50ZxxhYUpNdQH+Ld0qmlCMqa1aQEQLM8wMA8zP993rAqVkLIoRJ5rw7m7uzXnfe857Tg7sYAf/VRwbOMuxgbObnptG/tCTIy8fPXHm7sb77YJcixyQ0WzKHz1x5tMwkXwgdo7q6nJdVV8XOD02lJ7Z+H40m9oeAQ3k54LW5CO9hw5yiy0zOe+YufA9S6UcURTNqkjGeTf40fDjtX8iRjYhf9sGyYGTT/e5wyMvKh+M4J95nuHbn2DifI56tUwhP09xMYf3/ktRyYy9k842fmYrYuQa5G8FQfhU35Fel3q0W4PHjmMnv6La9zB+8FXee/9nvr60hDGKiFAuFcjnrlAuFUH4RJDM2FB6rNEvm4mRBvI3wzA81XPrHZw8voeuDotLCnjAg67CT/MVsuemCFp0LYAIImuJLCwusJhfYLm8hKoOA5kPh9Kf/1lW7AbyN8IwPLV3/wEq1Yi5hQo33tBOfQW8BxEIAsgXa6hctY73Hu89AB2du+js6sbFEfmF+f5CYaH/wf536yKaETg9mk1NNYqR31rtlTCReGHvvgM4FwNQqzsO3dvN/tvaubnbcHm2xvhkgYkLRYIWxf9VXUUwaqhUVijk1zITx9GciGSAwdFsqvJ7CZ51zr3Wfl2nExHdGCiOPfXY4WKwRrBWUJW/3WgiYIylVMwTRREAqnoRuMt654507dpNoq1Nvd9KQL/VkfIHJNraAEFVmZud2hfHcY/1+MgGCVoTneu1/LehxgLTgHe2VnccPribe+7cQ+xcUwQkE5bnXjpPqeqxKsKVXJVL08u4JgkIW1twHlTAWitMfFvkhzmDpzklMGqIYo9RwQKoCMaA99IcAUbW7Wy9h2TCcH1HQJM8iLVmvWdstebou+8m7u/tIY6bIyAZQnp8nJVVh20NlI8/+4UvvomamoFq3dFiFSsgq1VPqeybZ0JzdeBaNcb9OP0dM1MXm7dwejDWoqq1bd/x/neb9w528CtJD20wscn0EwAAAABJRU5ErkJggg=='); background-size: 16px;}`
    );
    //const GetUser = (ID) => getModule(x=>x.getUser).getUser(ID) >> Realized isnt needed. Patch returns user object.
    const Tooltip = BdApi.Webpack.getModule((x) => x.Tooltip).Tooltip;
    const Tree = getModule(
      (x) =>
        x &&
        Object.values(x).some(
          (x2) =>
            x2 &&
            x2?.toString?.()?.match(/(.roleDot.{10,50}{children:.{1,2})}\)/)
        )
    );

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
        const ColorDanger = findModuleByProps("colorDanger", "colorPremium")[
          "colorDanger"
        ]; // Stole from AssignBadgesRewrite. my beloved davvy
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

    this.addPatch("after", Tree, "Z", (OwO, [props], ret) => {
      const Author = props?.message?.author;
      const Decorations = ret.props?.children[3]?.props?.children;

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
                React.createElement(
                  "div",
                  {
                    ...data,
                    className: "discord-cake-day-message-cake",
                    onClick: () => {
                      this.createBirthdayModal(Author);
                    },
                  },
                  "🍰"
                )
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

  addPatch(patchType, moduleToPatch, functionName, callback) {
    this.patches.push(
      Patcher[patchType](this.name, moduleToPatch, functionName, callback)
    );
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

    const closeButton = createButton("Close", "close-button", () =>
      modal.remove()
    );
    const titleLabel = createHeading("Set Your Birthday", "h2");
    const birthdayInput = createInput(
      "text",
      "MM/DD or DD/MM",
      "birthday-input"
    );
    const setButton = createButton("Set", "set-button", () =>
      handleSetButtonClick()
    );

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
    const { createToast, showToast } = getModule((x) => x.createToast);
    showToast(createToast(message, type));
  }

  stop() {
    BdApi.DOM.removeStyle("DiscordCakeDay-CSS");
    BdApi.DOM.removeStyle("CakeDayCSS");
    this.patches.forEach((x) => x());
    this.UnpatchBirthdayContext();
  }

  getSettingsPanel() {

    // Original CSS
    const CakeDayCSSGrid = `
      .cake-day-grid-container {  
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        border-style : hidden;
      }
      
      .cake-day-grid-row {
        display: contents;
        color: white;
      }
      
      .cake-day-grid-cell {
        border: 1px solid #ccc; 
        padding: 8px;
      }
      
      .cake-day-header-row {
        font-weight: bold; 
      }
      
      .cake-day-profile img {
        max-width: 48px;
        border-radius: 25px;
      }
    `;
  
    BdApi.DOM.addStyle("CakeDayCSS", CakeDayCSSGrid);
  
    // Original panel setup
    const panel = document.createElement("div");
    panel.className = "cake-day-settings";
  
    // Scroll container
    const scrollContainer = document.createElement('div');
    scrollContainer.style.overflow = 'auto';
    scrollContainer.style.maxHeight = '500px';
  
    // Grid container
    const gridContainer = document.createElement("div");
    gridContainer.className = "cake-day-grid-container";
  
    // Header definitions
    const headers = ["Profile Picture", "Name", "Data"];
  
    // Get data
    const data = [];
    for (const userId in this.savedBirthdays) {
      if (this.savedBirthdays.hasOwnProperty(userId)) {
        const birthday = this.savedBirthdays[userId];
        const user = BdApi.findModuleByProps("getUser").getUser(userId);
        if (user) {
          data.push([user, birthday]);
        }
      }
    }
  
    // Create header row
    const headerRow = document.createElement("div");
    headerRow.className = "cake-day-grid-row cake-day-header-row";
    headers.forEach(header => {
      const headerCell = document.createElement("div");
      headerCell.className = "cake-day-grid-cell cake-day-header";
      headerCell.textContent = header;
      headerRow.appendChild(headerCell);
    });
    gridContainer.appendChild(headerRow);
  
    // Create data rows 
    data.forEach(rowData => {
      const [user, birthday] = rowData;
      const dataRow = document.createElement("div");
      dataRow.className = "cake-day-grid-row";
      
      // Profile cell
      const profileCell = document.createElement("div"); 
      profileCell.className = "cake-day-grid-cell cake-day-profile";
      
      // Image
      const avatar = document.createElement("img");
      avatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=1024`;
      profileCell.appendChild(avatar);
      
      // Name cell
      const nameCell = document.createElement("div");
      nameCell.className = "cake-day-grid-cell cake-day-name";
      nameCell.textContent = user.username;
      
      // Data cell
      const dataCell = document.createElement("div");
      dataCell.className = "cake-day-grid-cell cake-day-data";
      dataCell.textContent = birthday;
  
      dataRow.appendChild(profileCell);
      dataRow.appendChild(nameCell);
      dataRow.appendChild(dataCell);
      gridContainer.appendChild(dataRow);
    });
  
    // Scrollbar styling
    scrollContainer.style.scrollbarWidth = 'thin';
    scrollContainer.style.scrollbarColor = '#6e6e6e transparent';
  
    // Append grid to scroll container
    scrollContainer.appendChild(gridContainer);
  
    // Append scroll container to panel
    panel.appendChild(scrollContainer);
  
    return panel;
  
  }
}

module.exports = CakeDay;
