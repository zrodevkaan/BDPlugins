/**
 * @name DMBubbles
 * @author Kaan
 * @version 1.0.0
 * @description Copies Apples iMessage pins
 */
import {ContextMenuHelper, styled} from "../Helpers";

const {Patcher, Webpack, React, DOM, Data, Hooks, Utils, ContextMenu} = new BdApi('DMBubbles');
const Module = Webpack.getBySource('.A.CONTACTS_LIST');
const AvatarImg = Webpack.getByStrings('CutoutIcon', 'avatarTooltipText', {searchExports: true})
const Colors = Webpack.getByKeys("unsafe_rawColors")?.unsafe_rawColors;
const {Stores} = Webpack;

const FavoritesStore = new class FS extends Utils.Store {
    private favorites: Record<string, boolean> = {};

    constructor() {
        super();
        this.favorites = Data.load('favorites') || {}
    }

    addFavorite(id: string): void {
        this.favorites[id] = true;
        this.emitChange();
        this.saveFavorites()
    }

    saveFavorites() {
        Data.save('favorites', this.favorites)
    }

    getIds() {
        return Object.keys(this.favorites)
    }

    removeFavorite(id: string): void {
        const changedData = this.favorites
        delete changedData[id]
        this.favorites = changedData;
        this.emitChange();
        this.saveFavorites()
    }

    isFavorited(id: string): boolean {
        return Boolean(this.favorites[id])
    }
}

const StyledText = styled.div({
    color: 'white',
    textAlign: 'center',
    marginTop: '4px',
})

const BubbleContainer = styled.div({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
})

const GridContainer = styled.div({
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    padding: '4px 8px'
})

function Yeah({id}: { id: string }): React.ReactNode {
    const userData = Hooks.useStateFromStores([Stores.UserStore, Stores.PresenceStore, Stores.TypingStore, Stores.SelectedChannelStore], () => {
        const user = Stores.UserStore.getUser(id)
        const status = Stores.PresenceStore.getStatus(id)

        return {
            username: user?.globalName ? user.globalName : user?.username,
            src: `https://cdn.discordapp.com/avatars/${id}/${user.avatar}.webp?size=80`,
            status: status,
            statusColor: getStatusColor(status),
            isMobile: Stores.PresenceStore.isMobileOnline(id),
            isTyping: Stores.TypingStore.isTyping(id, Stores.SelectedChannelStore.getChannelId()),
            size: "SIZE_40"
        }
    })

    return <BubbleContainer>
        <AvatarImg {...userData} />
        <StyledText>{userData.username}</StyledText>
    </BubbleContainer>
}

function PinsManager() {
    const favorites = Hooks.useStateFromStores([FavoritesStore], () => FavoritesStore.getIds())

    return <GridContainer>
        {favorites.map((id: string, index: number) => {
            return <Yeah key={id} id={id}/>
        })}
    </GridContainer>
}

 function getStatusColor(type: "online" | "offline" | "idle" | "streaming" | "dnd") {
    switch (type) {
        case "online":
            return Colors.GREEN_360
        case "offline":
            return Colors.ROLE_GREY
        case "idle":
            return Colors.YELLOW_300
        case "streaming":
            return Colors.TWITCH
        case "dnd":
            return Colors.RED_400
        default:
            return Colors.ROLE_GREY
    }
 }

function ContextMenuBubbles({props}: { props }) {
    const user = props.user
    const isFavorited = Hooks.useStateFromStores([FavoritesStore], () => FavoritesStore.isFavorited(user.id))

    const onAdd = () => {
        isFavorited ? FavoritesStore.removeFavorite(user.id) : FavoritesStore.addFavorite(user.id)
    }

    return (
        <ContextMenu.Item
            id="dm-bubbles-parent"
            label={"DM Bubbles"}>
            <ContextMenu.Item
                id="dm-bubbles-toggle"
                label={isFavorited ? "Remove Favorite" : "Add Favorite"}
                action={onAdd}
            />
        </ContextMenu.Item>
    )
}

export default class DMBubbles {
    private unpatchAll: () => Function

    start() {
        Patcher.after(Module, 'A', (_, __, res) => {
            res.props.children.props.children.props.children.push(
                <PinsManager/>
            );
        });

        this.unpatchAll = ContextMenuHelper([
            {
                navId: "user-context",
                patch: (res, props) => {
                    res.props.children.push(ContextMenuBubbles({props}))
                }
            }
        ])
    }

    stop() {
        Patcher.unpatchAll();
        this.unpatchAll();
    }
}