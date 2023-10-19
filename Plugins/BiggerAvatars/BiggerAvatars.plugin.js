/**
 * @name BiggerAvatars
 * @author imafrogowo
 * @version 1.0.3
 * @description Bigger Avatars
 */

/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

const { Patcher, Webpack, DOM } = BdApi;

class BiggerAvatars {
  constructor() {
    this.name = BiggerAvatars.name
    this.version = '1.0.'
    this.githubOwner = "ImAFrogOwO"
    this.css = `
                .image-div {
                    background-size: cover;
                    border-style: solid;
                    display: block;
                    pointer-events: none;
                    position: fixed;
                    z-index: 99999;
                    width: 256px;
                    height: 256px;
                }
            `;

    this.handleMouseOver = this.handleMouseOver.bind(this);
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

  getModuleWithKey(filter) {
    let target; let id; let key;

    Webpack.getModule(
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

  handleMouseOver(event) {
    const imgElement = event.target;
    /* if (
      imgElement.className.includes("avatarDecoration") ||
      imgElement.currentSrc.includes("decoration")
    )
      imgElement.style.pointerEvents = "none";
    else imgElement.style.pointerEvents = "all";*/

    if (
      imgElement.currentSrc.includes('avatars') || !imgElement.className.includes("avatarWrapperNormal") && !imgElement.className.includes("clickable") && !imgElement.className.includes("avatarStack")
    ) {
       // for some reason this stops the bug? by erroring....
      if (imgElement?.['aria-label'].includes(BdApi.Webpack.getModule(x=>x.getCurrentUser).getCurrentUser().username))
      {
        return console.log("included") // if someone wants to fix this go for it. to reproduce you open a profile and hover over the profile picture
        // in the modal popout.
      }
      // console.log("imgElement:", imgElement);
      const src = imgElement.currentSrc;
      const newSize = 1280;

      const modifiedSrc = src.replace(/size=\d+/, `size=${newSize}`);

      const imageDiv = document.createElement('div');
      imageDiv.classList.add('image-div');

      const img = new Image();
      img.src = modifiedSrc;

      imageDiv.appendChild(img);

      const rect = imgElement.getBoundingClientRect();
      let left = rect.left + window.scrollX;
      let top = rect.bottom + window.scrollY;

      if (top + 300 > window.innerHeight) {
        top = window.innerHeight - 320;
      }

      if (left + 300 > window.innerWidth) {
        left = window.innerWidth - 320;
      }
      imageDiv.style.left = `${left}px`;
      imageDiv.style.top = `${top}px`;

      img.style.width = '300px';
      img.style.height = '300px';
      img.style.borderRadius = '20px';
      document.body.appendChild(imageDiv);

      imgElement.addEventListener('mouseleave', () => {
        if (document.body.contains(imageDiv)) {
          document.body.removeChild(imageDiv);
        }
      });
    }
  }
  GetElementsBySrc(findSrc) {
    // This is still lazy as hell.
    const TerribleElements = document.querySelectorAll(
      `img[src*="${findSrc}"]`,
    );

    return TerribleElements;
  }
  start() {
    const getAvatarURL =
      Webpack.getStore('UserStore').getCurrentUser().constructor.prototype;
    const memberListUser = this.getModuleWithKey(
      BdApi.Webpack.Filters.byStrings('avatarDecorationSrc', 'roleName', 'user'),
    );
    const friendsList = this.getModuleWithKey(
      BdApi.Webpack.Filters.byStrings(
        'statusBackdropColor',
        'typingIndicatorRef',
        'src',
      ),
    );

    this.ChatListPatch = Patcher.after(
      'BiggerAvatars',
      friendsList[0],
      'Avatar',
      (a, b, c, d, e) => {
        const matchingElements = this.GetElementsBySrc(c.props.src);
        matchingElements.forEach((imgElement) => {
          if (!imgElement.hasEventListener) {
            imgElement.hasEventListener = true;
            imgElement.addEventListener('mouseover', this.handleMouseOver);
          }
        });
      },
    );

    this.MemberListPatch = Patcher.after(
      'BiggerAvatars',
      memberListUser[0],
      'Z',
      (a, b, c, d, e) => {
        const matchingElement = this.GetElementsBySrc(
          c.props.avatar.props.children[0].props.src,
        );
        if (matchingElement[0]) {
          matchingElement[0].style.pointerEvents = 'all'; // Why does this have to be here and not the actual mouseover event.
          matchingElement[0].addEventListener(
            'mouseover',
            this.handleMouseOver,
          );
        }
      },
    );

    this.AvatarPatch = Patcher.after(
      'BiggerAvatars',
      getAvatarURL,
      'getAvatarURL',
      (a, b, c, d, e) => {
        const matchingElements = this.GetElementsBySrc(c);
        matchingElements.forEach((imgElement) => {
          if (imgElement.className.includes("avatarWrapperNormal") || imgElement.className.includes("clickable") || imgElement.className.includes("avatarStack")) imgElement.style.pointerEvents = 'none';
          imgElement.style.pointerEvents = 'all';
          if (!imgElement.hasEventListener) {
            imgElement.hasEventListener = true;
            imgElement.addEventListener('mouseover', this.handleMouseOver);
          }
        });
      },
    );

    DOM.addStyle('BiggerImagesCSS', this.css);
  }

  stop() {
    this.ChatListPatch();
    this.MemberListPatch();
    this.AvatarPatch();
    document.querySelectorAll('.image-div').forEach((img) => {
      img.remove();
      img.removeEventListener('mouseover', this.handleMouseOver);
    });
    DOM.removeStyle('BiggerImagesCSS');
  }
}

module.exports = BiggerAvatars;
