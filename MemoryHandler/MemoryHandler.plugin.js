/**
 * @name MemoryHandler
 * @author imafrogowo
 * @description Gives you a notification when Discord gets too laggy due to memory issues.
 * @version 1.0.0
 */
const React = BdApi.React;
const ReactDOM = BdApi.ReactDOM;
const request = require("request");
const fs = require("fs");
const path = require("path");
const pluginsFolder =
  BdApi.Plugins && BdApi.Plugins.folder
    ? BdApi.Plugins.folder
    : window.ContentManager.pluginsFolder;

class CustomInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  handleInputChange = (e) => {
    const { onChange } = this.props;
    const newValue = e.target.value;
    this.setState({ value: newValue });
    onChange(newValue);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value });
    }
  }

  render() {
    const { value } = this.state;
    const { className } = this.props;

    return React.createElement("input", {
      type: "text",
      value,
      onChange: this.handleInputChange,
      className: className,
    });
  }
}

class MemoryHandler extends React.Component {
  constructor(props) {
    super(props);
    this.interval = null;
    this.rss = null;
    this.lastWarningTime = 0;
    this.state = {
      memoryThresholdMB: 1000 /* Config Added */,
      warningInterval:
        5 *
        60 *
        1000 /* 5 minutes. TODO: make it a single number (e.g. 1 - 100) */,
    };
  }

  handleRestart = () => {
    DiscordNative.remoteApp.relaunch();
  };

  showWarning = () => {
    BdApi.showConfirmationModal(
      "⚠️ Discord Memory Usage",
      [
        `Discord's memory usage has reached ${this.state.memoryThresholdMB}
         MB out of ${this.rss.toFixed(2)} MB. Would you like to restart?`,
      ],
      {
        confirmText: "Restart",
        cancelText: "No Thanks",
        onConfirm: () => {
          handleRestart();
        },
        onCancel: () => {
          DiscordNative.processUtils.purgeMemory();
        },
      }
    );
  };

  checkMemoryUsage() {
    const currentTime = Date.now();
    const memoryUsage = process.memoryUsage();
    const memoryMB = memoryUsage.rss / (1000.0 * 1000);

    if (
      memoryMB > this.state.memoryThresholdMB &&
      currentTime - this.lastWarningTime >= this.state.warningInterval
    ) {
      this.lastWarningTime = currentTime;
      this.rss = memoryMB;
      this.showWarning();
    }
  }

  loadData() {
    this.Data = BdApi.Data.load("MemoryHandler", "data");
    this.state.memoryThresholdMB = this.Data[0];
    this.state.warningInterval = this.Data[1];
  }
  saveData() {
    BdApi.Data.save("MemoryHandler", "data", [
      this.state.memoryThresholdMB,
      this.state.warningInterval,
    ]);
  }

  start() {
  this.interval = setInterval(this.checkMemoryUsage.bind(this), 1000);

  this.purgeInterval = setTimeout(() => {
    DiscordNative.processUtils.purgeMemory(); 
  }, this.state.warningInterval);
}

  stop() {
    clearInterval(this.interval);
    clearTimeout(this.purgeInterval);
  }

  getSettingsPanel() {
    const css = `
  .setting {
    margin-bottom: 20px;
  }
  
  .label {
    font-weight: bold;
    color: white;
  }
  
  .input {
    padding: 5px;
    border-radius: 4px;
    border: 1px solid white;
    width: 100%;
    color: white;
    background-color: transparent;
    margin-top: 5px;
  }
  
  .button {
    margin-top: 10px;
    background-color: transparent;
    color: #fff;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }
`;

    BdApi.DOM.addStyle("MemoryHandler", css);
    const Modals = ZeresPluginLibrary.WebpackModules.getByProps('openModal', 'closeModal');

    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "setting" },
        React.createElement(
          "label",
          { className: "label" },
          "Memory Threshold (MB):"
        ),
        React.createElement(CustomInput, {
          value: this.state.memoryThresholdMB,
          onChange: (value) => (
            (this.state.memoryThresholdMB = value), this.saveData()
          ),
          description: "This will allow you to set the name of the activity.",
          className: "memoryThresholdMB-txt input",
        }),
      ),
      React.createElement(
        "div",
        { className: "setting" },
        React.createElement(
          "label",
          { className: "label" },
          "Warning Interval (ms):"
        ),
        React.createElement(CustomInput, {
          value: this.state.warningInterval,
          onChange: (value) => (
            (this.state.warningInterval = value), this.saveData()
          ),
          description: "This will allow you to set the name of the activity.",
          className: "warningInterval-txt input",
        })
      ),
      React.createElement(
        "button",
        {
          className: "button",
          onClick: () => {
            DiscordNative.processUtils.purgeMemory();
          },
        },
        "Purge Memory"
      )
    );
  }

  load() {
    const downloadZeresPluginLibrary = () => {
      if (!global.ZeresPluginLibrary) {
        request(
          "https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/afbde5e30463a8cf5f2a7849ca4b7fe50d60b80d/release/0PluginLibrary.plugin.js",
          (error, response, body) => {
            try {
              if (error || response.statusCode !== 200) {
                return;
              }

              fs.writeFile(
                path.join(pluginsFolder, "0PluginLibrary.plugin.js"),
                body,
                () => {
                  BdApi.showToast("Reload to load the libraries and plugin!");
                }
              );
            } catch (error) {
              BdApi.showToast("Error downloading ZeresPluginLibrary.");
            }
          }
        );
      }
    };

    downloadZeresPluginLibrary();
  }
}

module.exports = new MemoryHandler();
