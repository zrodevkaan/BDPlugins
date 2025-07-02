/**
 * @name DynamicChatButtons
 * @author Kaan
 * @version 0.0.1
 * @description Customize which chat buttons are visible in Discord by right clicking the chat area.
 */

const {Patcher, React, Webpack, DOM, ContextMenu, Data} = new BdApi('DynamicChatButtons')

const DataStore = new Proxy(
    {},
    {
        get: (_, key) => {
            return Data.load(key);
        },
        set: (_, key, value) => {
            Data.save(key, value);
            return true;
        },
        deleteProperty: (_, key) => {
            Data.delete(key);
            return true;
        },
    }
);

const Buttons = Webpack.getBySource("type", "channel", "showAllButtons")

export default class DynamicChatButtons {
    protected allKnownButtons: any[];

    constructor() {
        this.allKnownButtons = DataStore.allKnownButtons || [];
    }

    start() {
        Patcher.after(Buttons.Z, 'type', (_, __, res) => {
            const buttons = res.props.children;
            const originalButtons = [...buttons];

            const currentKeys = originalButtons.map(button => {
                const isAppButton = String(button.type?.type)?.includes?.('entryPointCommandButtonRef');
                const key = isAppButton ? "app_launcher" : button.key;

                if (isAppButton && button.key === null) {
                    button.key = "app_launcher";
                }

                return key;
            });

            this.updateKnownButtons(currentKeys);

            for (let i = buttons.length - 1; i >= 0; i--) {
                const button = buttons[i];
                const key = String(button.type?.type)?.includes?.('entryPointCommandButtonRef') ?
                    "app_launcher" : button.key;

                if (DataStore[key] === true) {
                    buttons.splice(i, 1);
                }
            }
        });

        ContextMenu.patch('textarea-context', this.patchSlate);
    }

    updateKnownButtons(currentKeys) {
        currentKeys.forEach(key => {
            if (!this.allKnownButtons.includes(key)) {
                this.allKnownButtons.push(key);
            }
        });

        DataStore.allKnownButtons = this.allKnownButtons;
    }

    patchSlate = (contextMenu, props) => {
        const buttonKeys = this.allKnownButtons;

        if (!buttonKeys || buttonKeys.length === 0) {
            return;
        }

        const menuItems = buttonKeys.map(key => ({
            type: 'toggle',
            id: key,
            label: key,
            checked: DataStore[key] === true,
            action: () => {
                DataStore[key] = !DataStore[key];
            }
        }));

        contextMenu.props.children.push(
            ContextMenu.buildItem({
                type: 'submenu',
                label: 'Dynamic Chat Buttons',
                items: menuItems
            })
        );
    }

    stop() {
        Patcher.unpatchAll();
        ContextMenu.unpatch('textarea-context', this.patchSlate);
    }
}