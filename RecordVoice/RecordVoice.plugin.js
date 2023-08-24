/**
 * @name RecordVoice
 * @author imafrogowo
 * @description Allows you do to video recordings on desktop!
 * @version 1.0.0
 */

const {
    React,
    Webpack,
    ContextMenu,
    Patcher,
    UI,
    ReactUtils,
    findModuleByProps,
    Webpack: { getModule, getStore },
  } = BdApi;
  
  class RecordAudio extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isRecording: false,
      };
      this.isRecording = false;
      this.VoiceModule =
        DiscordNative.nativeModules.requireModule("discord_voice");
      this.globalStarted = false;
      this.UploadModule = getModule((m) => m.prototype?.uploadFileToCloud, {
        searchExports: true,
      });
      this.SelectedChannel = getStore("SelectedChannelStore");
      this.RestAPI = findModuleByProps("getAPIBaseURL");
    }
    onceAdded = (selector, callback, signal) => {
      let directMatch;
      if ((directMatch = document.querySelector(selector))) {
        callback(directMatch);
        return () => null;
      }
  
      const cancel = () => observer.disconnect();
  
      const observer = new MutationObserver((changes) => {
        for (const change of changes) {
          if (!change.addedNodes.length) continue;
  
          for (const node of change.addedNodes) {
            const match =
              (node?.matches(selector) && node) || node?.querySelector(selector);
  
            if (!match) continue;
  
            cancel();
            signal.removeEventListener("abort", cancel);
  
            callback(match);
          }
        }
      });
  
      observer.observe(document.body, { childList: true, subtree: true });
  
      signal.addEventListener("abort", cancel);
    };
    async start() {
      /* Square, this didn't work, sooo..... I used a different method. */
      const Upload = BdApi.findModuleByProps("instantBatchUpload");
      const buttonsClassName = findModuleByProps(
        "profileBioInput",
        "buttons"
      )?.buttons;
      const controller = new AbortController();
      if (!buttonsClassName)
        return UI.showToast(
          `[${this.meta.name}] Could not add button to textarea.`,
          { type: "error" }
        );
      const instance = await new Promise((resolve, reject) => {
        this.onceAdded(
          "." + buttonsClassName,
          (e) => {
            const vnode = ReactUtils.getInternalInstance(e);
            if (!vnode) return;
  
            for (
              let curr = vnode, max = 100;
              curr !== null && max--;
              curr = curr.return
            ) {
              const tree = curr?.pendingProps?.children;
              let buttons;
              if (
                Array.isArray(tree) &&
                (buttons = tree.find(
                  (s) => s?.props?.type && s.props.channel && s.type?.$$typeof
                ))
              ) {
                resolve(buttons.type);
                break;
              }
            }
          },
          controller.signal
        );
  
        const abort = controller.abort.bind(controller);
        controller.signal.addEventListener("abort", () => {
          this.cleanup.delete(abort);
          reject();
        });
  
        this.cleanup?.add(abort);
      });
  
      this.t = Patcher.after(
        "RecordAudio",
        instance,
        "type",
        (_, [props], res) => {
          if (this.state === undefined) {
            this.state = { isRecording: false };
          }
  
          const toggleRecording = async () => {
            console.log(
              "State:",
              this.state.isRecording,
              "this:",
              this.isRecording
            );
            this.setState((prevState) => ({
              isRecording: !prevState.isRecording,
            }));
            this.isRecording = !this.isRecording;
  
            if (this.isRecording) {
              UI.showToast("Voice Recording Started", {
                forceShow: true,
                type: "success",
              });
              this.VoiceModule.startLocalAudioRecording({},(success) => {});
            } else {
              UI.showToast("Voice Recording Ended", {
                forceShow: true,
                type: "danger",
              });
              this.VoiceModule.stopLocalAudioRecording(
                (audioFilePath, dfg) => {
                    (this.audioFileToSend = audioFilePath);
                }
              );
              const channelId = getStore("SelectedChannelStore").getChannelId();
              await new Promise((resolve) => setTimeout(resolve, 500));
              const buffer = require("fs").readFileSync(
                String(this.audioFileToSend),
                "" // Really? utf8's toString on readFileSync on DEFAULT?? 
              );
              const Audio = new Blob([buffer], {
                type: "audio/ogg; codecs=opus",
              });
              this.FileToUpload = new File([Audio], "recording.ogg");
              const UploadFIle = new this.UploadModule(
                {
                  file: this.FileToUpload,
                  isClip: false,
                  isThumbnail: false,
                  platform: 1,
                },
                channelId,
                false,
                0
              );
              UploadFIle.on("complete", () => {
                this.RestAPI.post({
                  url: `/channels/${channelId}/messages`,
                  body: {
                    content: "",
                    flags: 1 << 13,
                    channel_id: channelId,
                    nonce: 0, // Most useless key ever.
                    type: 0,
                    attachments: [
                      {
                        id: "0",
                        filename: UploadFIle.filename,
                        uploaded_filename: UploadFIle.uploadedFilename,
                        waveform: "ThisCanBeAnythingOwO",
                        duration_secs: 1,
                      },
                    ],
                  },
                });
              });
              UploadFIle.on("error", (yes, no) => console.log(yes, no));
              UploadFIle.upload();
            }
          };
  
          const custom = React.createElement(
            "button",
            {
              ref: (e) => {
                if (e) {
                  e.unmount = () => {
                    this.render = () => null;
                    this.forceUpdate();
                  };
                }
              },
              onClick: toggleRecording,
              onContextMenu: (e) => ContextMenu.open(e, this.renderContextMenu()),
              className: `css-sucks button-ejjZWC colorBrand-2M3O3N grow-2T4nbg ${
                this.state.isRecording ? "recording" : ""
              }`,
              style: { color: "white" },
            },
            React.createElement(
              "div",
              {
                className: "contents-3NembX",
                style: {
                  color: "white",
                  left: "-2px" /* Pissed me off too dw.*/,
                },
              },
              React.createElement(
                "svg",
                {
                  width: "25",
                  height: "25",
                  viewBox: "0 0 24 24",
                  className: "buttonWrapper-3YFQGJ",
                },
                React.createElement("path", {
                  fill: "currentColor",
                  d: "M14.99 11C14.99 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14 17.3 11H19C19 14.42 16.28 17.24 13 17.72V22H11V17.72C7.72 17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1ZM12 4C11.2 4 11 4.66667 11 5V11C11 11.3333 11.2 12 12 12C12.8 12 13 11.3333 13 11V5C13 4.66667 12.8 4 12 4Z",
                }),
                React.createElement("path", {
                  fill: "currentColor",
                  d: "M14.99 11C14.99 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14 17.3 11H19C19 14.42 16.28 17.24 13 17.72V21H11V17.72C7.72 17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1Z",
                })
              )
            )
          );
  
          const children = res.props.children;
          children.push(custom);
          res.props.children = children;
          return res;
        }
      );
    }
    stop() {
      this.t ? this.t() : console.log("nuh uh");
    }
  }
  
