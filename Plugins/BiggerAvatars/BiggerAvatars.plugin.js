/**
 * @name BiggerAvatars
 * @author imafrogowo
 * @version 1.0.0
 * @description Bigger Avatars
 */

const { Patcher, Webpack, DOM } = BdApi

class BiggerAvatars {
    constructor() {
        this.name = BiggerAvatars.name
        this.version = '1.0.0'
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
        if (Kaan) {
            Kaan.isUpdateAvailable(this.githubOwner, this.name, this.version)
                .then((updateAvailable) => {
                    if (updateAvailable) {
                        BdApi.showConfirmationModal("Update Plugin", `A new version of ${this.name} is available. Do you want to update now?`, {
                            confirmText: "Update Now",
                            cancelText: "Cancel",
                            onConfirm: () => {
                                Kaan.updatePlugin(this.githubOwner, this.name, this.version);
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
                                fs.writeFile(require("path").join(BdApi.Plugins.folder, "Kaan.plugin.js"), body, (err) => {
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

    handleMouseOver(event) {
        const imgElement = event.target;
        if (
            imgElement.className.includes("avatarDecoration") ||
            imgElement.currentSrc.includes("decoration")
        )
            imgElement.style.pointerEvents = "none";
        if (imgElement.currentSrc.includes("avatar")) {
            const src = imgElement.currentSrc;
            const newSize = 1280;

            const modifiedSrc = src.replace(/size=\d+/, `size=${newSize}`);

            const imageDiv = document.createElement("div");
            imageDiv.classList.add("image-div");

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

            img.style.width = "300px";
            img.style.height = "300px";
            img.style.borderRadius = "20px";
            document.body.appendChild(imageDiv);

            imgElement.addEventListener("mouseleave", () => {
                if (document.body.contains(imageDiv)) {
                    document.body.removeChild(imageDiv);
                }
            });
        }
    }
    GetElementsBySrc(findSrc) {
        // This is still lazy as hell.
        const TerribleElements = document.querySelectorAll(
            `img[src*="${findSrc}"]`
        );

        return TerribleElements;
    }
    start() {
        const getAvatarURL =
            Webpack.getStore("UserStore").getCurrentUser().constructor
                .prototype;

        Patcher.after(
            "BiggerAvatars",
            getAvatarURL,
            "getAvatarURL",
            (a, b, c, d, e) => {
                const matchingElements = this.GetElementsBySrc(c);
                matchingElements.forEach((imgElement) => {
                    if (!imgElement.hasEventListener) {
                        imgElement.hasEventListener = true;
                        imgElement.addEventListener("mouseover", this.handleMouseOver);
                    }
                });
            }
        );

        DOM.addStyle("BiggerImagesCSS", this.css);
    }

    stop() {
        DOM.removeStyle("BiggerImagesCSS");
    }
}

module.exports = BiggerAvatars;
