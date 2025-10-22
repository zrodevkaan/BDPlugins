/**
 * @name DynamicChatButtons
 * @author Kaan
 * @version 0.0.2
 * @description Customize which chat buttons are visible in Discord by right clicking the chat area.
 */

const { Patcher, React, Webpack, DOM, ContextMenu, Data } = new BdApi('DynamicChatButtons')

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
        },
    }
);

const Buttons = Webpack.getBySource("isSubmitButtonEnabled", '.Z.getActiveOption(')

export default class DynamicChatButtons {
    protected allKnownButtons: any[];

    constructor() {
        this.allKnownButtons = DataStore.allKnownButtons || [];
    }

    start() {
        Patcher.after(Buttons.Z, 'type', (_, [props], originalResult) => {
            if (!originalResult?.props?.children) {
                return originalResult;
            }

            const buttons = [...originalResult.props.children];
            const currentKeys = buttons.map(button => {
                const isAppButton = String(button.type?.type)?.includes?.('entryPointCommandButtonRef');
                const key = isAppButton ? "app_launcher" : button.key;

                if (isAppButton && button.key === null) {
                    button.key = "app_launcher";
                }

                return key;
            });

            this.updateKnownButtons(currentKeys);

            const filteredButtons = buttons.filter(button => {
                const key = String(button.type?.type)?.includes?.('entryPointCommandButtonRef') ?
                    "app_launcher" : button.key;

                return DataStore[key] !== true;
            });

            return <div className={'dynanmic-chat-buttons'} style={{display: 'flex'}}>
                {filteredButtons}
            </div>
        });

        ContextMenu.patch('textarea-context', this.patchSlate);
    }

    updateKnownButtons(currentKeys) {
        currentKeys.forEach(key => {
            if (key && !this.allKnownButtons.includes(key)) {
                this.allKnownButtons.push(key);
            }
        });

        const existingButtons = DataStore.allKnownButtons || [];
        DataStore.allKnownButtons = [...new Set([...existingButtons, ...this.allKnownButtons])];
    }

    patchSlate = (contextMenu, props) => {
        const buttonKeys = this.allKnownButtons;

        if (!buttonKeys || buttonKeys.length === 0) {
            return;
        }

        const menuItems = buttonKeys.map(key => {
            if (key) {
                return {
                    type: 'toggle',
                    id: key,
                    label: key,
                    checked: DataStore[key] === true,
                    action: () => {
                        DataStore[key] = !DataStore[key];
                    }
                }
            }
        }).filter(x => x)

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