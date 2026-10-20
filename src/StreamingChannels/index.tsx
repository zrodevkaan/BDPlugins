import {ContextMenuHelper, type Disposer, SettingsStore, styled} from "@helpers";

const {
    Webpack,
    Patcher,
    Webpack: {Stores},
    React: {useEffect, useState},
    Components: {Button},
    Hooks: {useStateFromStores},
    ContextMenu,
    UI,
    Utils,
} = new BdApi(__PLUGIN_NAME__);

interface Settings {
    channels: string[];
    hiddenCategories: string[];
}

const ChannelRender = Webpack.getModule((x) => x && String(x.A).includes(".button||(") && String(x.A).includes(".metaKey||"));

const ChannelModule = Webpack.getBySource(`name:"Channel",renderLoader`, {
    mapDeclarations: true,
    map: {
        ChatRender: Webpack.Filters.byStrings("ChannelRenderer")
    }
});

export const Datastore = new SettingsStore<Settings>({
    channels: [],
    hiddenCategories: []
});

const Screen = styled.div({
    boxSizing: "border-box",
    flex: 1,
    minHeight: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 32,
    textAlign: "center",
    color: "var(--text-muted)",
    background: "var(--background-base-lower, var(--background-primary))",
});

const Header = styled.h2({
    margin: 0,
    fontFamily: "var(--font-primary)",
    fontSize: "24px",
    fontWeight: 500,
    lineHeight: 1.3333,
    color: "var(--header-primary)",
});

const Body = styled.p({
    maxWidth: 360,
    margin: 0,
    color: "var(--text-default, var(--text-normal))",
});

const Actions = styled.div({
    display: "flex",
    gap: 8,
    marginTop: 8,
});

function ByeByeIcon({size = 160, accent = false}: { size?: number, accent?: boolean }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={accent ? "var(--channel-icon)" : "currentColor"}
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{flexShrink: 0}}
        >
            <path
                d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
    );
}

function findHiddenCategory(channelId: string, hidden: string[]): string | null {
    if (!hidden.length) return null;

    const channel = Stores.ChannelStore.getChannel(channelId);
    if (!channel?.guild_id) return null;

    const categories = Stores.GuildCategoryStore.getCategories(channel.guild_id);
    if (!categories) return null;

    for (const {channel: category} of categories._categories ?? []) {
        if (!hidden.includes(category.id)) continue;

        const children = categories[category.id] ?? [];
        if (children.some(child => child.channel.id === channelId)) return category.id;
    }

    return null;
}

function useIsSharing() {
    return useStateFromStores(
        [Stores.StreamerModeStore, Stores.ApplicationStreamingStore, Stores.UserStore],
        () => {
            const userId = Stores.UserStore.getCurrentUser()?.id;
            const streamerMode = Stores.StreamerModeStore.getState()?.[userId]?.enabled ?? false;
            const streaming = Stores.ApplicationStreamingStore.getCurrentUserActiveStream() != null;
            return streamerMode || streaming;
        }
    );
}

function MiddleScreen({channel, onLoad, onUnmark}) {
    const name = channel.name ? `#${channel.name}` : "This channel";

    return (
        <Screen>
            <ByeByeIcon/>
            <Header>{name} is hidden</Header>
            <Body>This channel is marked as a streaming channel, so it won't load automatically.</Body>
            <Actions>
                <Button look="bd-button-outlined" onClick={onLoad}>Load Anyway</Button>
                <Button look="bd-button-link" onClick={onUnmark}>Unmark</Button>
            </Actions>
        </Screen>
    );
}

function PreventOverlay({ret, channel}) {
    const channels = Datastore.use("channels");
    const hiddenCategories = Datastore.use("hiddenCategories");
    const [loadAnyway, setLoadAnyway] = useState(false);
    const isSharing = useIsSharing();

    const isMarked = channels.includes(channel.id);
    const hiddenCategoryId = findHiddenCategory(channel.id, hiddenCategories);

    const shouldPrevent = (isMarked || hiddenCategoryId != null) && isSharing;

    useEffect(() => {
        if (!shouldPrevent) setLoadAnyway(false);
    }, [shouldPrevent]);

    if (!shouldPrevent || loadAnyway) return ret;

    return (
        <MiddleScreen
            channel={channel}
            onLoad={() => setLoadAnyway(true)}
            onUnmark={() => {
                if (isMarked) {
                    Datastore.set("channels", channels.filter(id => id !== channel.id));
                } else if (hiddenCategoryId) {
                    Datastore.set("hiddenCategories", hiddenCategories.filter(id => id !== hiddenCategoryId));
                }
                UI.showToast("Unmarked", {type: "info"});
            }}
        />
    );
}

function PrivateBlur({channelId, children}) {
    const hiddenCategories = Datastore.use("hiddenCategories");
    const isSharing = useIsSharing();

    if (!isSharing || !findHiddenCategory(channelId, hiddenCategories)) return children;

    return <div style={{filter: "blur(4px)"}}>{children}</div>;
}

function patchMenu(res, props) {
    const channel = props?.channel;
    if (!channel?.id) return res;
    if (!Array.isArray(res?.props?.children)) return res;

    const isCategory = channel.type === 4;
    const key = isCategory ? "hiddenCategories" : "channels";
    const noun = isCategory ? "category" : "channel";

    res.props.children.push(
        ...ContextMenu.buildMenuChildren([
            {type: "separator"},
            {
                type: "group",
                items: [{
                    id: "streaming-channels-toggle",
                    label: isCategory ? "Streaming Category" : "Streaming Channel",
                    type: "toggle",
                    checked: Datastore.get(key).includes(channel.id),
                    action: () => {
                        const current = Datastore.get(key);
                        const marked = current.includes(channel.id);

                        Datastore.set(
                            key,
                            marked
                                ? current.filter(id => id !== channel.id)
                                : [...current, channel.id]
                        );

                        UI.showToast(
                            marked ? `Unmarked ${noun}` : `Marked ${noun} as streaming`,
                            {type: marked ? "info" : "success"}
                        );
                    }
                }]
            }
        ])
    );

    return res;
}

export default class StreamingChannels {
    private dispose?: Disposer;

    start() {
        Patcher.after(ChannelModule, "ChatRender", (_this, args, returnValue) => {
            const channelId = args[0]?.match?.params?.channelId;
            if (!channelId) return returnValue;

            const channel = Stores.ChannelStore.getChannel(channelId);
            if (!channel) return returnValue;

            return <PreventOverlay key={channel.id} ret={returnValue} channel={channel}/>;
        });

        Patcher.after(ChannelRender, "A", (_this, _args, returnValue) => {
            const found = Utils.findInTree(
                returnValue,
                (m) => m?.props?.channel,
                {walkable: ["props", "children"]}
            );
            const channel = found?.props?.channel;
            if (!channel) return returnValue;

            if (Datastore.get("channels").includes(channel.id)) {
                const linkTop = Utils.findInTree(
                    returnValue,
                    (m) => typeof m?.className === "string" && m.className.startsWith("linkTop"),
                    {walkable: ["props", "children"]}
                );
                const children = linkTop?.children;

                if (Array.isArray(children)) {
                    const index = children[1]?.props?.channel ? 1 : 0;
                    children[index] = <ByeByeIcon accent size={16}/>;
                }
            }

            return <PrivateBlur channelId={channel.id}>{returnValue}</PrivateBlur>;
        });

        this.dispose = ContextMenuHelper([
            {
                navId: "channel-context",
                patch: (res, props) => patchMenu(res, props)
            },
            {
                navId: "user-context",
                patch: (res, props) => patchMenu(res, props)
            }
        ]);
    }

    isStreamingChannel(channelId: string) {
        return Datastore.get("channels").includes(channelId)
            || findHiddenCategory(channelId, Datastore.get("hiddenCategories")) != null;
    }

    stop() {
        this.dispose?.();
        this.dispose = undefined;
        Patcher.unpatchAll();
    }
}