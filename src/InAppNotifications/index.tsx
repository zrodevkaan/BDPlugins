/**
 * @name InAppNotifications
 * @author kaan
 * @version 1.0.0
 * @description A compact and sleek UI for messages. its for my liking, there is no config besides keywords.
 */
import type {Message} from "discord-types/general";

const {Webpack, Utils, Patcher, Hooks, React, Data, Components} = new BdApi("InAppNotifications");

const {
    MessageStore,
    ChannelStore,
    UserStore,
    GuildStore,
    UserGuildSettingsStore,
    GuildMemberStore,
    ReferencedMessageStore,
    PendingReplyStore,
    SelectedChannelStore
} = Webpack.Stores;

const [
    MessageComponent,
    MessageConstructor,
    MessageWrapper,
    Dispatcher,
    MessageActions,
] = Webpack.getBulk(
    {filter: Webpack.Filters.byStrings(".mention_everyone??!1"), searchExports: true},
    {filter: Webpack.Filters.byPrototypeKeys("receivePushNotification")},
    {filter: (x: any) => String(x?.type).includes('Message must not be a thread starter message')},
    {filter: (x: any) => x?._dispatch, searchExports: true},
    {filter: Webpack.Filters.byKeys("fetchMessage", "deleteMessage")},
);

const NavigationUtils = Webpack.getMangled("transitionTo - Transitioning to", {
    transitionTo: Webpack.Filters.byStrings("transitionTo - Transitioning to"),
    replace: Webpack.Filters.byStrings("Replacing route with"),
    goBack: Webpack.Filters.byStrings(".goBack()"),
    goForward: Webpack.Filters.byStrings(".goForward()"),
    transitionToGuild: Webpack.Filters.byStrings("transitionToGuild - Transitioning to")
});

interface DispatchedMessage {
    channelId: string;
    message: Message;
    guildId: string;
    isPushNotification: boolean;
    optimistic: boolean;
    type: string;
}

interface DispatchedReaction {
    userId: string;
    channelId: string;
    messageId: string;
    guildId: string;
    emoji: { id: string | null, name: string, animated?: boolean };
}

function injectMessage(rawMessage: any): Message {
    let message = MessageStore.getMessage(rawMessage.channel_id, rawMessage.id);
    if (!message) {
        // Only construct and inject if the message isn't already in the store.
        // This prevents overwriting a fully-hydrated message (with embed fields)
        // with a stale constructed copy from the original MESSAGE_CREATE payload.
        message = MessageComponent(rawMessage);
        const channel = MessageConstructor.getOrCreate(rawMessage.channel_id);
        const updated = channel.mutate((r: any) => {
            r.ready = true;
            r.cached = true;
            r._map[rawMessage.id] = message;
        });
        MessageConstructor.commit(updated);
    }
    // Re-read from store after potential injection to get the most up-to-date copy.
    message = MessageStore.getMessage(rawMessage.channel_id, rawMessage.id) ?? MessageComponent(rawMessage);
    message = Object.assign(Object.create(Object.getPrototypeOf(message)), message, {guild_id: rawMessage.guild_id}); // We pass the guild_id to the message object
    // So we can use it when doing transitionToGuild or whatnot,
    // plus nice to have.
    return message;
}

enum FlagTypes {
    MUTED = 4096,
    ALLOWED = 5012,
}

const SettingsStore = new class extends Utils.Store {
    #keywords: string[] = Data.load("keywords") ?? [];
    #settings: Record<string, any> = Data.load("settings") ?? {};

    getKeywords(): string[] {
        return [...this.#keywords];
    }

    getSetting(key: string) {
        return this.#settings[key];
    }

    setSetting(key: string, value: any) {
        this.#settings[key] = value;
        Data.save("settings", this.#settings);
        this.emitChange();
    }

    setKeywords(keywords: string[]) {
        this.#keywords = keywords;
        Data.save("keywords", this.#keywords);
        this.emitChange();
    }

    flatten = (val: any): string => {
        if (val === null || val === undefined) return '';
        if (typeof val !== 'object') return String(val);
        return Object.values(val).map(this.flatten).join(' ');
    }

    getMatchedKeywords(message: any): string[] {
        if (this.#keywords.length === 0) return [];
        const text = this.flatten(message).toLowerCase();
        return this.#keywords.filter(k => text.includes(k.toLowerCase()));
    }

    hasKeywordMatch(message: any): boolean {
        return this.getMatchedKeywords(message).length > 0;
    }
}();

const NotificationStore = new class extends Utils.Store {
    #messages: Array<{ message: Message, matchedKeywords: string[] }> = [];
    #reactions: Array<{
        emoji: { id: string | null, name: string },
        messageId: string,
        userId: string,
        channelId: string,
        message: Message
    }> = [];

    getMessages() {
        return [...this.#messages];
    }

    getReactions() {
        return [...this.#reactions];
    }

    addMessage(rawMessage: any, matchedKeywords: string[]) {
        const message = injectMessage(rawMessage);
        this.#messages.push({message, matchedKeywords});
        this.emitChange();
    }

    removeReaction(messageId: string) {
        this.#reactions = this.#reactions.filter(m => m.messageId !== messageId);
        this.emitChange();
    }


    addReaction(obj: { emoji: any, messageId: string, userId: string, channelId: string, message: Message }) {
        const exists = this.#reactions.some(r => r.messageId === obj.messageId && r.userId === obj.userId);
        if (exists) return;
        this.#reactions.push(obj);
        this.emitChange();
    }

    removeMessage(id: string) {
        this.#messages = this.#messages.filter(m => m.message.id !== id);
        this.emitChange();
    }

    clear() {
        this.#messages = [];
        this.emitChange();
    }
}();

class ErrorBoundary extends React.Component<{ children: any }, { error: Error | null }> {
    constructor(props: any) {
        super(props);
        this.state = {error: null};
    }

    static getDerivedStateFromError(error: Error) {
        return {error};
    }

    componentDidCatch(error: Error, info: any) {
        console.error("[IAN]", error, info);
    }

    render() {
        if (this.state.error) {
            return (
                <div style={{padding: "0.5rem", color: "var(--text-feedback-critical)", fontSize: "12px"}}>
                    <strong>Error:</strong> {this.state.error.message}
                    <button onClick={() => this.setState({error: null})}>Retry</button>
                </div>
            );
        }
        return this.props.children;
    }
}

function Exit({onClick}: { onClick: () => void }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            onClick={onClick}
            style={{cursor: "pointer", flexShrink: 0}}
        >
            <path
                fill="var(--white)"
                d="m12 13.4l-2.917 2.925q-.277.275-.704.275t-.704-.275q-.275-.275-.275-.7t.275-.7L10.6 12L7.675 9.108Q7.4 8.831 7.4 8.404t.275-.704q.275-.275.7-.275t.7.275L12 10.625L14.892 7.7q.277-.275.704-.275t.704.275q.3.3.3.713t-.3.687L13.375 12l2.925 2.917q.275.277.275.704t-.275.704q-.3.3-.712.3t-.688-.3z"
                strokeWidth={0.7}
                stroke="currentColor"
            />
        </svg>
    );
}

function getChannelInfo(channel: any) {
    const guild = channel.guild_id ? GuildStore.getGuild(channel.guild_id) : null;

    if (guild) {
        return {
            iconUrl: guild.icon
                ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=32`
                : `https://cdn.discordapp.com/embed/avatars/0.png`,
            primaryLabel: guild.name,
            secondaryLabel: `#${channel.name}`,
            isGuild: true,
        };
    }

    if (channel.type === 3) {
        const recipients = (channel.recipients ?? []).map((id: string) => UserStore.getUser(id)).filter(Boolean);
        return {
            iconUrl: channel.icon
                ? `https://cdn.discordapp.com/channel-icons/${channel.id}/${channel.icon}.png?size=32`
                : `https://cdn.discordapp.com/embed/avatars/0.png`,
            primaryLabel: channel.name || recipients.map((u: any) => u.globalName ?? u.username).join(", "),
            secondaryLabel: "Group DM",
            isGuild: false,
        };
    }

    const recipient = UserStore.getUser((channel.recipients ?? [])[0]);
    return {
        iconUrl: recipient?.avatar
            ? `https://cdn.discordapp.com/avatars/${recipient.id}/${recipient.avatar}.png?size=32`
            : `https://cdn.discordapp.com/embed/avatars/0.png`,
        primaryLabel: recipient?.globalName ?? recipient?.username ?? "Direct Message",
        secondaryLabel: "Direct Message",
        isGuild: false,
    };
}

function CardHeader({channel, onRemove}: { channel: any, onRemove: () => void }) {
    const guild = channel.guild_id ? GuildStore.getGuild(channel.guild_id) : null;
    const {iconUrl, primaryLabel, secondaryLabel} = getChannelInfo(channel);

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "8px",
            paddingBottom: "8px",
            borderBottom: "1px solid var(--border-strong)",
            minWidth: 0,
        }}>
            <img
                src={iconUrl}
                style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: guild ? "4px" : "50%",
                    flexShrink: 0,
                }}
            />
            <span style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--white)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flexShrink: 1,
                minWidth: 0,
            }}>
                {primaryLabel}
            </span>
            <span style={{fontSize: '20px', color: 'white'}}>•</span>
            <span style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flexShrink: 1,
                minWidth: 0,
            }}>
                {secondaryLabel}
            </span>
            <span style={{marginLeft: "auto"}}>
                <Exit onClick={onRemove}/>
            </span>
        </div>
    );
}

function KeywordBadges({keywords}: { keywords: string[] }) {
    if (keywords.length === 0) return null;
    return (
        <div style={{
            display: "flex",
            flexWrap: "wrap",
        }}>
            {keywords.map(k => (
                <span key={k} style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--white)",
                    borderRadius: "4px",
                    padding: "1px 6px",
                }}>
                    {k}
                </span>
            ))}
        </div>
    );
}

function NotificationCard({message: initialMessage, matchedKeywords}: { message: Message, matchedKeywords: string[] }) {
    const DURATION = Hooks.useStateFromStores(SettingsStore, () => SettingsStore.getSetting("duration") ?? (15 * 1000));
    const showTextarea = Hooks.useStateFromStores(SettingsStore, () => SettingsStore.getSetting("showTextarea") ?? true);

    // subscribe to MessageStore so that when Discord pushes a MESSAGE_UPDATE
    // (e.g. a bot filling in embed fields after the initial MESSAGE_CREATE),
    /// We get the hook update. Not sure why fields are populated AFTER the MESSAGE_CREATE payload.

    // Shock horror this does not work for specific embeds. Thanks discord :D
    const message = Hooks.useStateFromStores(
        [MessageStore],
        () => MessageStore.getMessage(initialMessage.channel_id, initialMessage.id) ?? initialMessage
    );
    const [getText, setText] = React.useState("");
    const channel = ChannelStore.getChannel(message.channel_id);
    const [progress, setProgress] = React.useState(100);
    const isHoveredRef = React.useRef(false);
    const elapsedRef = React.useRef(0);

    const selectedChannel = Hooks.useStateFromStores(SelectedChannelStore, () => SelectedChannelStore.getChannelId())
    if (selectedChannel == initialMessage.channel_id) {
        NotificationStore.removeMessage(message.id)
    }

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (isHoveredRef.current) return;
            elapsedRef.current += 50;
            const remaining = Math.max(0, 100 - (elapsedRef.current / DURATION) * 100);
            setProgress(remaining);
            if (remaining === 0) {
                clearInterval(interval);
                NotificationStore.removeMessage(message.id);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [message.id]);

    if (!channel) return null;

    //const cache = MessageStore.getMessage(message.channel_id, message.id)
    //if (cache) {
    //    message.messageReference = cache.messageReference; // Really TERRIBLE work around for replied messages.
    //    // Ironically works, no idea how.
    //}

    return (
        <div
            onMouseEnter={() => {
                isHoveredRef.current = true;
            }}
            onMouseLeave={() => {
                isHoveredRef.current = false;
            }}
            onDoubleClick={() => {
                NavigationUtils.transitionTo(
                    `/channels/${(initialMessage as any).guild_id ?? "@me"}/${message.channel_id}/${message.id}`
                );
                NotificationStore.removeMessage(message.id)
            }}
            onContextMenu={() => {
                NotificationStore.removeMessage(message.id)
            }}
            style={{
                backgroundColor: "var(--background-base-low)",
                borderRadius: "8px",
                padding: "0.75rem",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                overflow: "hidden",
                flexShrink: 0,
                position: "relative",
            }}
        >
            {/* wrap everything in a div so the chatbar doesnt turn into superman and hover under the div. */}
            <div>
                <CardHeader channel={channel} onRemove={() => NotificationStore.removeMessage(message.id)}/>
                <ErrorBoundary>
                    <ul style={{listStyle: "none", margin: 0, padding: 0}}>
                        <div style={{
                            maxHeight: '500px',
                        }}>
                            <MessageWrapper
                                id={`${message.id}-${message.id}`}
                                groupId={message.id}
                                message={message}
                                channel={channel}
                                compact={false}
                                renderContentOnly={false}
                                __ian={true}
                            />
                        </div>
                    </ul>
                </ErrorBoundary>
                <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "3px",
                    width: `${progress}%`,
                    backgroundColor: "var(--youtube)",
                    borderRadius: "0 0 4px 4px",
                    transition: "width 50ms linear",
                }}/>
            </div>
            {showTextarea && (
                <div style={{ padding: '10px', zIndex: '10' }}>
                    <Components.TextInput
                        value={getText}
                        onChange={(val) => setText(val)}
                        placeholder="Reply to user?"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                upload(
                                    initialMessage?.guild_id ?? undefined,
                                    message.channel_id,
                                    message.id,
                                    getText
                                );
                                NotificationStore.removeMessage(message.id);
                            }
                        }}
                    />
                </div>
            )}
            <KeywordBadges keywords={matchedKeywords}/>
        </div>
    );
}

// const FetchModule = Webpack.getMangled('type:"USER_PROFILE_FETCH_START"', {fetchUser: Webpack.Filters.byStrings("USER_UPDATE", "Promise.resolve")});

function ReactionCard({entry}: { entry: { emoji: any, message: Message, userId: string } }) {
    const DURATION = 10000;
    const channel = ChannelStore.getChannel(entry.message.channel_id);

    const [reactor, setReactor] = React.useState(UserStore.getUser(entry.userId));

    /*React.useEffect(() => {
        (async () => {
            const user = UserStore.getUser(entry.userId)
            if (user) {
                setReactor(user)
            }
            else {
                if (!user) {
                    setReactor(await FetchModule.fetchUser(entry.userId)); // first time ever ive been rate limited by this api.
                } else
                {
                    setReactor({globalName:'undefined'})
                }
            }
        })()
    })*/

    const [progress, setProgress] = React.useState(100);
    const isHoveredRef = React.useRef(false);
    const elapsedRef = React.useRef(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (isHoveredRef.current) return;
            elapsedRef.current += 50;
            const remaining = Math.max(0, 100 - (elapsedRef.current / DURATION) * 100);
            setProgress(remaining);
            if (remaining === 0) {
                clearInterval(interval);
                NotificationStore.removeReaction(entry.message.id);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [entry.message.id]);

    if (!channel) return null;

    const emojiDisplay = entry.emoji.id
        ?
        <img src={`https://cdn.discordapp.com/emojis/${entry.emoji.id}.${entry.emoji.animated ? "gif" : "png"}?size=20`}
             style={{width: 20, height: 20, verticalAlign: "middle"}}/>
        : <span>{entry.emoji.name}</span>;

    return (
        <div
            onMouseEnter={() => {
                isHoveredRef.current = true;
            }}
            onMouseLeave={() => {
                isHoveredRef.current = false;
            }}
            onDoubleClick={() => {
                if ((entry.message as any)?.guild_id) {
                    NavigationUtils.transitionToGuild(
                        (entry.message as any).guild_id,
                        entry.message.channel_id,
                        entry.message.id
                    );
                } else {
                    NavigationUtils.transitionTo(
                        `/channels/@me/${entry.message.channel_id}/${entry.message.id}`
                    );
                }
            }}
            onContextMenu={() => NotificationStore.removeReaction(entry.message.id)}
            style={{
                backgroundColor: "var(--background-base-low)",
                borderRadius: "8px",
                padding: "0.75rem",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                flexShrink: 0,
                position: "relative",
                maxHeight: '200px',
                overflow: "hidden",
            }}
        >
            <CardHeader channel={channel} onRemove={() => NotificationStore.removeReaction((entry as any).messageId)}/>
            <div style={{fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px"}}>
                <strong
                    style={{color: "var(--white)" /* yucky light mode users. */}}>{reactor?.globalName ?? reactor?.username ?? "Someone"}</strong>
                {" reacted "}{emojiDisplay}
            </div>
            <ErrorBoundary>
                <ul style={{listStyle: "none", margin: 0, padding: 0}}>
                    <MessageWrapper
                        id={`${entry.message.id}-${entry.message.id}`}
                        groupId={entry.message.id}
                        message={entry.message}
                        channel={channel}
                        compact={false}
                        renderContentOnly={false}
                        __ian={true}
                    />
                </ul>
            </ErrorBoundary>
            <div style={{
                position: "absolute", bottom: 0, left: 0,
                height: "3px", width: `${progress}%`,
                backgroundColor: "var(--brand-experiment)",
                borderRadius: "0 0 4px 4px",
                transition: "width 50ms linear",
            }}/>
        </div>
    );
}

function NotificationContainer() {
    const entries = Hooks.useStateFromStores(
        [NotificationStore],
        () => NotificationStore.getMessages()
    );
    const position = Hooks.useStateFromStores(SettingsStore, () => SettingsStore.getSetting("position") ?? "bottom-right");

    const pos: React.CSSProperties = {
        top:    position.startsWith("top")    ? "5px" : undefined,
        bottom: position.startsWith("bottom") ? "5px" : undefined,
        left:   position.endsWith("left")     ? "5px" : undefined,
        right:  position.endsWith("right")    ? "5px" : undefined,
    };

    // const reactions = Hooks.useStateFromStores(
    //     [NotificationStore],
    //     () => NotificationStore.getReactions()
    // );

    // Back in early stages when I was creating messages using the internal constructor all embeds would crash from bot related messages,
    // Either from hasFlags or content was null somehow.
    // const filtered = entries.filter(e => e.message.type !== 20);

    // Currently ran commands by you if the bot `deferReply` then a blank bot message appears.
    // Make better bot code.
    if (entries.length === 0) return null;

    return (
        <div
            id="ian-container"
            style={{
                position: "fixed",
                bottom: "5px",
                right: "5px",
                width: "420px",
                zIndex: 1002,
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                ...pos,
                maxHeight: "100vh",
                overflowY: "auto",
                backgroundColor: "transparent",
                scrollbarWidth: "none",
            } as React.CSSProperties}
        >
            {entries.map(({message, matchedKeywords}) => (
                <NotificationCard key={message.id} message={message} matchedKeywords={matchedKeywords}/>
            ))}
            {/*reactions.map(r => <ReactionCard key={`${r.messageId}-${r.userId}`} entry={r}/>)*/}
        </div>
    );
}

var timestampToSnowflake = (timestamp) => {
    const DISCORD_EPOCH = BigInt(14200704e5);
    const SHIFT = BigInt(22);
    const ms = BigInt(timestamp) - DISCORD_EPOCH;
    return ms <= BigInt(0) ? "0" : (ms << SHIFT).toString();
};

async function upload(guildId, channelId, messageId, text) {
    const useReply = SettingsStore.getSetting("shouldReply");
    MessageActions.sendMessage(channelId, {
        content: text,
        tts: false,
        invalidEmojis: [],
        validNonShortcutEmojis: [],
    }, true, {
        nonce: timestampToSnowflake(Date.now()),
        ...(useReply ? {
            messageReference: {
                guild_id: guildId,
                channel_id: channelId,
                message_id: messageId,
            },
        } : {}),
        location: "chat_input",
    });
}

function ForceUpdateRoot() {
    // when updating the App mount, a weird error can cause webpack to attempt at reloading modules?
    // so instead, if we use domain migration start, this safely remounts app mount.
    Dispatcher.dispatch({type: 'DOMAIN_MIGRATION_START'});
    requestIdleCallback(() => Dispatcher.dispatch({type: 'DOMAIN_MIGRATION_SKIP'}));
}

const POSITIONS = [
    { value: "top-left",     label: "Top Left" },
    { value: "top-right",    label: "Top Right" },
    { value: "bottom-right", label: "Bottom Right" },
    { value: "bottom-left",  label: "Bottom Left" },
];

export default class InAppNotifications {
    isAllowed(message: any, guildId: string) {
        const currentUser = UserStore.getCurrentUser();
        if (document.visibilityState === "hidden") return; // if its hidden, dont show any messages. it just spams your screen.
        // omg this was on the wrong line....


        if (!message?.channel_id) return false;
        if (message?.channel_id == SelectedChannelStore.getChannelId()) return false;
        if (message.author?.id === currentUser?.id) return false;
        if (!guildId) return true;


        if (UserGuildSettingsStore.isChannelMuted(guildId ? guildId : null, message.channel_id)) return false;
        if (UserGuildSettingsStore.isMuted(guildId)) return false;

        const channelNotifLevel = UserGuildSettingsStore.getChannelMessageNotifications(guildId, message.channel_id);
        const guildNotifLevel = UserGuildSettingsStore.getMessageNotifications(guildId);

        const effectiveLevel = (channelNotifLevel === 3 || channelNotifLevel == null)
            ? guildNotifLevel
            : channelNotifLevel;

        if (effectiveLevel === 2) return false;

        if (effectiveLevel === 1) {
            const suppressEveryone = UserGuildSettingsStore.isSuppressEveryoneEnabled(guildId);
            const suppressRoles = UserGuildSettingsStore.isSuppressRolesEnabled(guildId);
            const mentionsMe = message.mentions?.some((u: any) => u.id === currentUser.id);
            const mentionsEveryone = !suppressEveryone && message.mention_everyone;
            const myRoles = GuildMemberStore.getMember(guildId, currentUser.id)?.roles ?? [];
            const mentionsMyRole = !suppressRoles && message.mention_roles?.some((roleId: string) => myRoles.includes(roleId));
            if (!mentionsMe && !mentionsEveryone && !mentionsMyRole) return false;
        }

        if (SettingsStore.hasKeywordMatch(message)) return true;

        return true;
    }

    #messageHandler = async ({message, guildId}: DispatchedMessage) => {
        if (!this.isAllowed(message, guildId)) return;

        const raw = Object.assign(MessageComponent(message), {guild_id: guildId});
        const matchedKeywords = SettingsStore.getMatchedKeywords(message);
        NotificationStore.addMessage(raw, matchedKeywords);
    };

    #reactionHandler = async ({userId, channelId, messageId, guildId, emoji}: DispatchedReaction) => {
        const currentUser = UserStore.getCurrentUser();
        if (!currentUser) return;

        if (document.visibilityState === "hidden") return; // if its hidden, dont show any messages. it just spams your screen.
        // if (userId === currentUser.id) return; // don't notify for your own reactions
        // does this even trigger.

        // only notify for reactions on your own messages
        let message = MessageStore.getMessage(channelId, messageId);
        if (!message) {
            message = await MessageActions.fetchMessage({channelId, messageId}).catch(() => null);
        }
        if (!message) return;
        //if (message.author?.id !== currentUser.id) return;

        const raw = Object.assign(MessageComponent(message), {guild_id: guildId});
        NotificationStore.addReaction({emoji, messageId, userId, channelId, message: raw});
    };

    load() {
        // risky, but no issues *yet*.
        const servers = GuildStore.getGuildsArray();
        Dispatcher.dispatch({
            type: "GUILD_SUBSCRIPTIONS_FLUSH",
            subscriptions: servers.reduce((acc: any, v: any) => {
                acc[v.id] = {typing: true, activities: true, threads: true};
                return acc;
            }, {})
        });
    }

    start() {
        BdApi.DOM.addStyle("IAN", `
            #ian-container::-webkit-scrollbar { display: none; }
            #ian-container input[type="text"] { width: 100% !important; box-sizing: border-box !important; }
        `);
        Patcher.after(Webpack.getModule(Webpack.Filters.bySource("Shakeable")).A, "type", (_: any, __: any, res: any) => {
            res.props.children.push(<ErrorBoundary><NotificationContainer/></ErrorBoundary>);
        });
        Patcher.after(MessageWrapper, 'type', (a, [b], c) => {
            const loc = Utils.findInTree(c, x => x.childrenAccessories, {walkable: ['props', 'children']})
            if (b.__ian) loc.childrenButtons = undefined // Prevents the child buttons from the minipopover from showing on notification messages.
            return c
        })
        Dispatcher.subscribe("MESSAGE_CREATE", this.#messageHandler);

        ForceUpdateRoot();
        //Dispatcher.subscribe("MESSAGE_REACTION_ADD", this.#reactionHandler);
    }

    stop() {
        BdApi.DOM.removeStyle("IAN");
        Patcher.unpatchAll();
        Dispatcher.unsubscribe("MESSAGE_CREATE", this.#messageHandler);
        //Dispatcher.unsubscribe("MESSAGE_REACTION_ADD", this.#reactionHandler); // i dont have a nice way to display this, so just kill it.
        NotificationStore.clear();
    }

    getSettingsPanel() {
        return () => {
            const [value, setValue] = React.useState(
                SettingsStore.getKeywords().join(";")
            );

            const duration = Hooks.useStateFromStores(SettingsStore, () => SettingsStore.getSetting("duration") ?? 15000);
            const shouldReply = Hooks.useStateFromStores(SettingsStore, () => SettingsStore.getSetting("shouldReply") ?? true);
            const showTextarea = Hooks.useStateFromStores(SettingsStore, () => SettingsStore.getSetting("showTextarea") ?? true);
            const position = Hooks.useStateFromStores(SettingsStore, () => SettingsStore.getSetting("position") ?? "bottom-right");

            return (
                <div>
                    <Components.SettingItem
                        id="keywords"
                        name="Keywords"
                        note="A semicolon-separated list of keywords that will always trigger notifications."
                        inline={false}
                    >
                        <Components.TextInput
                            value={value}
                            placeholder="keyword1;keyword2;keyword3"
                            onChange={(v: string) => {
                                setValue(v);
                                const keywords = v.split(";").map((k: string) => k.trim()).filter((k: string) => k.length > 0);
                                SettingsStore.setKeywords(keywords);
                            }}
                        />
                    </Components.SettingItem>

                    <Components.SettingItem
                        id="duration"
                        name="Notification Duration"
                        note={`How long notifications remain on screen. Currently: ${(duration / 1000).toFixed(1)}s`}
                        inline={false}
                    >
                        <Components.SliderInput
                            min={3000}
                            max={60000}
                            step={1000}
                            value={duration}
                            units="ms"
                            onChange={(v: number) => {
                                SettingsStore.setSetting("duration", v);
                            }}
                        />
                    </Components.SettingItem>

                    <Components.SettingItem
                        id="shouldReply"
                        name="Reply to Messages"
                        note="When enabled, allows you to reply directly to messages from the notification."
                        inline={true}
                    >
                        <Components.SwitchInput
                            value={shouldReply}
                            onChange={(v: number) => {
                                SettingsStore.setSetting("shouldReply", v);
                            }}
                        />
                    </Components.SettingItem>

                    <Components.SettingItem
                        id="showTextarea"
                        name="Show Reply Textarea"
                        note="Displays a text input in the notification to reply to messages and DMs."
                        inline={true}
                    >
                        <Components.SwitchInput
                            value={showTextarea}
                            onChange={(v: boolean) => {
                                SettingsStore.setSetting("showTextarea", v);
                            }}
                        />
                    </Components.SettingItem>

                    <Components.SettingItem
                        id="position"
                        name="Notification Position"
                        note="Where notifications appear on screen."
                    >
                        <Components.RadioInput
                            value={position}
                            onChange={(v: string) => SettingsStore.setSetting("position", v)}
                            options={[
                                { value: "top-left",     name: "Top Left" },
                                { value: "top-right",    name: "Top Right" },
                                { value: "bottom-right", name: "Bottom Right" },
                                { value: "bottom-left",  name: "Bottom Left" },
                            ]}
                        />
                    </Components.SettingItem>
                </div>
            );
        };
    }
}