/**
 * @name DynamicChatButtons
 * @author Kaan
 * @version 1.0.0
 * @description Customize which chat buttons are visible in Discord by right clicking the chat area and forget that breakable css filter that only supports aria-label :)
 */

const {Patcher, React, Webpack, DOM, ContextMenu, Data, Utils, Hooks} = new BdApi('DynamicChatButtons')
const {useStateFromStores} = Hooks

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

const Buttons = Webpack.getBySource("isSubmitButtonEnabled", '.A.getActiveOption(')

const ButtonStore = new class ButtonStoreClass extends Utils.Store {
    protected allKnownButtons = DataStore.allKnownButtons || [];
    protected hiddenStates = {};

    setButtons(buttons) {
        this.allKnownButtons = buttons;
        this.emitChange();
    }

    getButtons() {
        return this.allKnownButtons;
    }

    toggleButton(key) {
        DataStore[key] = !DataStore[key];
        this.hiddenStates = {...this.hiddenStates};
        this.emitChange();
    }

    isHidden(key) {
        return DataStore[key] === true;
    }

    getHiddenStates() {
        return this.hiddenStates;
    }
}

function ChatButtonsWrapper({originalResult}) {
    useStateFromStores([ButtonStore], () => ButtonStore.getHiddenStates());

    const buttons = [...originalResult.props.children];
    const currentKeys = buttons.map(button => {
        const isAppButton = String(button.type?.type)?.includes?.('entryPointCommandButtonRef');
        const key = isAppButton ? "app_launcher" : button.key;

        if (isAppButton && button.key === null) {
            button.key = "app_launcher";
        }

        return key;
    });

    React.useEffect(() => {
        ButtonStore.setButtons(currentKeys);
    }, [currentKeys.join(',')]);

    const filteredButtons = buttons.filter(button => {
        const key = String(button.type?.type)?.includes?.('entryPointCommandButtonRef') ?
            "app_launcher" : button.key;

        return !ButtonStore.isHidden(key);
    });

    return <div className={'dynamic-chat-buttons'} style={{display: 'flex', alignItems: 'center'}}>
        {filteredButtons}
    </div>
}

export default class DynamicChatButtons {
    start() {
        Patcher.after(Buttons.A, 'type', (_, [props], originalResult) => {
            if (!originalResult?.props?.children) {
                return originalResult;
            }

            return <ChatButtonsWrapper originalResult={originalResult}/>
        });

        ContextMenu.patch('textarea-context', this.patchSlate);
    }

    patchSlate = (contextMenu, props) => {
        const buttonKeys = ButtonStore.getButtons();

        if (!buttonKeys || buttonKeys.length === 0) {
            return;
        }

        const menuItems = buttonKeys.map(key => {
            if (key) {
                return {
                    type: 'toggle',
                    id: key,
                    label: key,
                    checked: ButtonStore.isHidden(key),
                    action: () => {
                        ButtonStore.toggleButton(key);
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