/**
 * @name SidebarDMs
 * @author Kaan
 * @version 1.0.1
 * @description startTyping compiler test
 */

const App = new BdApi("SidebarDMs");
const {Patcher, Webpack, Utils} = App;

const AppModule = Webpack.getBySource('notificationCenterVariant', 'location:"Sidebar"')
const PrivateChannelSortStore = Webpack.getStore('PrivateChannelSortStore')
const ChannelStore = Webpack.getStore('ChannelStore')
const UserStore = Webpack.getStore('UserStore')
const PresenceStore = Webpack.getStore('PresenceStore')

const useStateFromStores = Webpack.getModule(m => m.toString?.().includes("useStateFromStores"), {searchExports:true})

const FriendListModule = Webpack.getBySource('getMaskId():')
// qE ? ...

function forceUpdateApp() {
    const appMount = document.getElementById("app-mount");
    const reactContainerKey = Object.keys(appMount).find((m) => m.startsWith("__reactContainer$"));
    let container = appMount[reactContainerKey];
    while (!container.stateNode?.isReactComponent) {
        container = container.child;
    }
    const {render} = container.stateNode;
    if (render.toString().includes("null")) return;
    container.stateNode.render = () => null;
    container.stateNode.forceUpdate(() => {
        container.stateNode.render = render;
        container.stateNode.forceUpdate();
    });
}

const convertToDiscord = (id, avatar) => `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=1024`

const SidebarDMsComponent = () => {
    const privateChannels = useStateFromStores([PrivateChannelSortStore], () => PrivateChannelSortStore.getSortedChannels())

    return <div style={{
        bottom: "-60px",
        padding: "15px",
        margin: '10px -5px',
        display: 'flex',
        flexDirection: 'column',
        gap: '60px'
    }}>{
        privateChannels[1].map(x => {
            const UserId = ChannelStore.getChannel(x.channelId).recipients[0]
            const User = UserStore.getUser(UserId)

            const presence = User && useStateFromStores([PresenceStore], () => PresenceStore.getStatus(User.id));

            return presence && <FriendListModule.qE
                key={x.channelId}
                status={presence}
                size={"SIZE_24"}
                src={convertToDiscord(UserId, User.avatar)}
            />
        })
    }</div>
}

class SidebarDMs {
    start() {
        forceUpdateApp();
        Patcher.after(AppModule, "Z" as never, (that, args, res) => {
            res.props.children.splice(1, 0, <SidebarDMsComponent/>)
        })
    }

    stop() {
        Patcher.unpatchAll();
        forceUpdateApp();
    }
}

export default SidebarDMs;