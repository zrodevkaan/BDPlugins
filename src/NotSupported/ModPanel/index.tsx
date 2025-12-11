/**
 * @name ModPanel
 * @author Kaan
 * @description its a bunch of self botting but oh well. its for moderators.
 */

const { Webpack, Patcher, Utils, ContextMenu, React, Data, Components } = new BdApi('ModPanel')

const ManaButtonTooltip = Webpack.getModule(x => String(x.Z.render).includes('positionKeyStemOverride')).Z // rich embed
const CTb = Webpack.getByKeys('CTb'); // icon
const ChatMessageDecorators = Webpack.getModule(x => String(x.Z).includes('.colorRoleId?nul')) // chat name icons

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

const addUser = (id, reason, timestamp = Date.now()) => {
    const newObject = DataStore.watchlist || {};
    newObject[id] = { reason, timestamp }
    DataStore.watchlist = newObject
}

const deleteUser = (id) => {
    const newObject = DataStore.watchlist || {};
    delete newObject[id]
    DataStore.watchlist = newObject
}

const WarningIcon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 12 12"><path fill="#f5f11dff" d="M5.214 1.459a.903.903 0 0 1 1.572 0l4.092 7.169c.348.61-.089 1.372-.787 1.372H1.91c-.698 0-1.135-.762-.787-1.372l4.092-7.17ZM5.5 4.5v1a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0ZM6 6.75a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5Z"></path></svg>
}

const ModerationPanel = () => {
    return (
        <div style={{
            padding: '10px 10px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(40px, 1fr))',
            gap: '5px',
            justifyContent: 'center',
            justifyItems: 'center'
        }}>
            <ManaButtonTooltip tooltipText={"Test"} icon={CTb.CTb} />
            <ManaButtonTooltip tooltipText={"Test"} icon={CTb.CTb} />
            <ManaButtonTooltip tooltipText={"Test"} icon={CTb.CTb} />
            <ManaButtonTooltip tooltipText={"Test"} icon={CTb.CTb} />
            <ManaButtonTooltip tooltipText={"Test"} icon={CTb.CTb} />
            <ManaButtonTooltip tooltipText={"Test"} icon={CTb.CTb} />
            <ManaButtonTooltip tooltipText={"Test"} icon={CTb.CTb} />
            <ManaButtonTooltip tooltipText={"Test"} icon={CTb.CTb} />
            <ManaButtonTooltip tooltipText={"Test"} icon={CTb.CTb} />
            <ManaButtonTooltip tooltipText={"Test"} icon={CTb.CTb} />
            <ManaButtonTooltip tooltipText={"Test"} icon={CTb.CTb} />
        </div>
    )
}

const Element = ({ data }) => {
    return <Components.Tooltip position="top" text={data.reason}>
        {(props) => {
            return <span {...props} style={{ position: 'relative', top: '4px' }}>
                <WarningIcon />
            </span>
        }}
    </Components.Tooltip>
}

var ModalSystem = Webpack.getMangled(".modalKey?", {
    openModalLazy: Webpack.Filters.byStrings(".modalKey?"),
    openModal: Webpack.Filters.byStrings(",instant:"),
    closeModal: Webpack.Filters.byStrings(".onCloseCallback()"),
    closeAllModals: Webpack.Filters.byStrings(".getState();for")
});

const Modal = Webpack.getModule(x => x.Modal).Modal
const TextInput = Webpack.getByStrings('setShouldValidate', { searchExports: true })

const ModPanelStuff = ({ a, user }) => {
    const [text, setText] = React.useState('Add Reason')

    return <Modal
        {...a}
        title="Watchlist"
        subtitle={`Add ${user.username} to Watchlist`}
        actions={[{
            text: `Add ${user.username}`,
            onClick: () => {
                a.onClose();
                addUser(user.id, text, Date.now());
            }
        }]}
    >
        <TextInput placeholder={text} onChange={setText}></TextInput>
    </Modal>
}

const CTMPA = (res, props) => {
    const { user } = props;

    res.props.children.push(ContextMenu.buildItem({
        type: 'button',
        label: 'Add User',
        action: () => {
            ModalSystem.openModal((a) =>
                <ModPanelStuff a={a} user={user} />
            )
        }
    }))
}

export default class ModPanel {
    start() {
        // window.arven.Utils.forceUpdateApp()

        /* Patcher.after(window.n(374005).b, 'type', (a, b, res) => {
             res.props.children.props.children.push(<ModerationPanel />)
         })*/

        Patcher.after(ChatMessageDecorators, 'Z', (a, b, res) => {
            const user = b[0].message.author
            const data = DataStore.watchlist?.[user.id]
            if (data != null) {
                b[0].decorations[1].push(<Element data={data} />)
            }
        })

        ContextMenu.patch('user-context', CTMPA)
    }
    stop() {
        Patcher.unpatchAll()
        ContextMenu.unpatch('user-context', CTMPA)
    }
} 