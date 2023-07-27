/**
 * @name Inspect Element
 * @author imafrogowo
 * @description Forcefully opens dev-tools for users who can't use CTRL+SHIFT+I **Huge thanks to skamt & thecommieaxolotl**
 * @version 1.0.0
 */

const electron = require('electron');
const {
    ContextMenu
} = new BdApi("Inspect Element");

module.exports = class {
    getName() {
        return "Inspect Element";
    }

    start() {
        var MouseX;
        var MouseY;

        console.log('Inspect Element (message) was patched');

        this.t = ContextMenu.patch("message", (MessageReturnVal) => {
            const ButtonGroup = ContextMenu.buildItem({
                type: "submenu",
                label: "DevTools",
                items: [{
                        type: "button",
                        label: "Inspect Element",
                        action: () => {
                            startInspect();
                        }
                    },
                    /*{ Testing xDD
                        type: "button",
                        label: "Inspect Element From Mouse",
                        action: () => {
                            startInspectFromMouse();
                        }
                    },*/
                    {
                        type: "button",
                        label: "BD Inspect Element",
                        action: () => {
                            electron.ipcRenderer.send('bd-inspect-element');
                        }
                    }
                ]
            });

            MessageReturnVal.props.children.splice(1, 0, ButtonGroup);
        });


        document.addEventListener('mousemove', captureMousePosition);

        function captureMousePosition(event) {
            MouseX = event.clientX;
            MouseY = event.clientY;
        }

        function startInspect() {
            electron.ipcRenderer.send('bd-toggle-devtools'); // Finding a way to do { mode: 'detach' }. Referenced from Spicetify xDD
            const element = document.elementFromPoint(MouseX, MouseY);
            console.log('%cInspecting Element', 'font-size: 28px; font-weight: bold; color: red');
            console.log(element)
            /*
             * Returning the element from mouse position. Looking in console
             * Finding the element returned, Right click
             * Reveal in elements panel!
             */
        }

        function startInspectFromMouse() {
            const element = document.elementFromPoint(MouseX, MouseY);
            console.log('%cInspecting Element', 'font-size: 28px; font-weight: bold; color: red');
            console.log(element)
        }
    }

    stop() {
        this.t(); // Huge thanks to davilarek for telling me this exists 😭
    }
};
