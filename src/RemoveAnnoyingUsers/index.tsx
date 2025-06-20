/**
 * @name RemoveAnnoyingUsers
 * @author Kaan
 * @version 1.0.0
 * @description Does a person you blocked keep yapping? Remove those pesky annoying users/blocked users in your chat!
 */

const {Patcher, React, Webpack, DOM, ContextMenu, UI, Net, Utils, Data} = new BdApi('RemoveAnnoyingUsers')
const MessageModule = Webpack.getBySource('ChatMessage', 'THREAD_STARTER_MESSAGE')
const BlockedMessage = Webpack.getBySource('blockedAction', 'blockedMessageText', 'fgq1go')
const RelationshipStore = Webpack.getStore('RelationshipStore')

const DataStore = new Proxy(
    {},
    {
        get: (_, key) => {
            const data = Data.load(key);
            return data || {};
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

const BlockedSVG = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="var(--interactive-normal)" width="20px" height="20px" viewBox="0 0 32 32"
                version="1.1">
        <path color={'var(--interactive-normal)'}
              d="M16 29c-7.179 0-13-5.82-13-13s5.821-13 13-13c7.18 0 13 5.82 13 13s-5.82 13-13 13zM16 26c2.211 0 4.249-0.727 5.905-1.941l-13.963-13.962c-1.216 1.655-1.942 3.692-1.942 5.903 0 5.522 4.477 10 10 10zM16 6c-2.228 0-4.279 0.737-5.941 1.97l13.971 13.972c1.232-1.663 1.97-3.713 1.97-5.942 0-5.523-4.477-10-10-10z"/>
    </svg>
}

export default class RemoveAnnoyingUsers {
    private CMPatches: any[];

    constructor() {
        this.CMPatches = []
    }

    start() {
        this.patchContextMenus();

        Patcher.after(MessageModule.ZP, 'type', (_, [__], result) => {
            const user = __.message.author
            if (RelationshipStore.isBlocked(user.id) || DataStore.blockedUsers[user.id]) return null
        })

        Patcher.after(BlockedMessage.Z, 'type', (_, [__], result) => {
            const user = Utils.findInTree(__, x => x?.author).author
            if (RelationshipStore.isBlocked(user.id) || DataStore.blockedUsers[user.id]) return null
        })
    }

    patchContextMenus() {
        this.CMPatches.push(ContextMenu.patch('user-context', (res, props) => {
            res.props.children.push(React.createElement(ContextMenu.Item, {
                label: 'Soft Block User',
                id: 'soft-block-user',
                icon: React.createElement(BlockedSVG),
                action: () => {
                    const user = props.user
                    const currentBlocked = DataStore.blockedUsers || {};
                    currentBlocked[user.id] = true;
                    DataStore.blockedUsers = currentBlocked;
                }
            }))
        }))
    }

    stop() {
        Patcher.unpatchAll()
        this.CMPatches.forEach(x => x())
    }
}