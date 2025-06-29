/**
 * @name Affinities
 * @author Kaan
 * @version 1.0.1
 * @description Allows you to checkout whom you interact with the most in categories like communication, direct messages, voice chat, server messages, and probabilities!
 */

import type {ContextMenuSetup} from "betterdiscord";

const {Webpack, Patcher, React, Components, Data, UI, Utils, DOM, ContextMenu} = new BdApi("Index");
const {useState} = React;

const UseStateFromStores: Function = Webpack.getModule(m => m.toString?.().includes("useStateFromStores"), {searchExports: true});
const ModalRoot = Webpack.getModule(Webpack.Filters.byStrings('.ImpressionTypes.MODAL,"aria-labelledby":'), {searchExports: true});
const UserModal = Webpack.getByKeys('openUserProfileModal')
const Module = Webpack.getBySource('.PlatformTypes.WINDOWS&&(0,')
const FetchModule = Webpack.getMangled('type:"USER_PROFILE_FETCH_START"', {fetchUser: Webpack.Filters.byStrings("USER_UPDATE", "Promise.resolve")})

const ModalSystem = Webpack.getMangled(".modalKey?", {
    openModalLazy: Webpack.Filters.byStrings(".modalKey?"),
    openModal: Webpack.Filters.byStrings(",instant:"),
    closeModal: Webpack.Filters.byStrings(".onCloseCallback()"),
    closeAllModals: Webpack.Filters.byStrings(".getState();for")
});

const AffinityStore = Webpack?.Stores?.UserAffinitiesV2Store || Webpack.getStore("UserAffinitiesV2Store");
const UserStore = Webpack?.Stores?.UserStore || Webpack.getStore("UserStore");
const RelationshipStore = Webpack?.Stores?.RelationshipStore || Webpack.getStore("RelationshipStore");
const GuildAffinitiesStore = Webpack?.Stores?.GuildAffinitiesStore || Webpack.getStore("GuildAffinitiesStore");

const getAvatar = (id) => Number(BigInt(id) >> 22n) % 6;

function forceUpdateApp() {
    const appMount = document.getElementById("app-mount");

    const reactContainerKey = Object.keys(appMount).find(m => m.startsWith("__reactContainer$"));

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

Array.prototype.pushIf = function (predicate, ...items) {
    if (predicate) {
        this.push(...items);
    }
    return this;
};

export const FriendsterIcon = ({size = 24, color = 'currentColor', ...props}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 464 448"
        width={size}
        height={size}
        fill={color}
        {...props}
    >
        <path xmlns="http://www.w3.org/2000/svg" fill={color}
              d="M190 41q24 20 32.5 52.5T222 156q-10 27-43.5 27T135 155q-10-27-5-59.5T155 41q20-18 35 0zm83-35q-35 17-33 90q8 73 47 74q49-20 35-108q-3-23-15.5-41T273 6zm162 53q-42-9-52 15q-11 21-26 81t-36 87q-24 29-58.5 44.5T193 296q-42-6-64-41q-12-20-27.5-72T68 108q-24-12-37.5-6t-20 15t-8 26.5T2 171t2 18v2q9 56 17 70q33 69 108.5 100T279 371q78-22 129.5-93.5T462 122q0-50-27-63z"/>
    </svg>
);

export const UserIcon = ({size = 16, color = 'currentColor', ...props}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        width={size}
        height={size}
        fill={color}
        {...props}
    >
        <path xmlns="http://www.w3.org/2000/svg" fill={color}
              d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z"/>
    </svg>
);


export const CrownIcon = ({size = 24, color = 'currentColor', ...props}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={color}
        {...props}
    >
        <path
            xmlns="http://www.w3.org/2000/svg"
            fill={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 18a1 1 0 0 0-1 1 3 3 0 0 0 3 3h10a3 3 0 0 0 3-3 1 1 0 0 0-1-1H5ZM3.04 7.76a1 1 0 0 0-1.52 1.15l2.25 6.42a1 1 0 0 0 .94.67h14.55a1 1 0 0 0 .95-.71l1.94-6.45a1 1 0 0 0-1.55-1.1l-4.11 3-3.55-5.33.82-.82a.83.83 0 0 0 0-1.18l-1.17-1.17a.83.83 0 0 0-1.18 0l-1.17 1.17a.83.83 0 0 0 0 1.18l.82.82-3.61 5.42-4.41-3.07Z"
        />
    </svg>
);

export const FriendIcon = ({size = 24, color = 'currentColor', ...props}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 819 622"
        width={size}
        height={size}
        {...props}
    >
        <path xmlns="http://www.w3.org/2000/svg"
              fill={color}
              d="M552.664 491c41 23 64 61 60 100c-2 24-1 24-32 28c-19 2-140 3-263 3c-140 0-286-1-297-4c-41-11-17-87 37-123c43-27 130-69 154-74c33-7 37-28 0-91c-8-15-17-58-18-104c-1-74 12-124 77-149c12-4 26-6 39-6c43 0 83 24 100 59c23 47 12 170-12 215c-29 51-26 67 6 75c20 5 86 36 149 71zm219-63c32 17 50 48 47 78c-1 18-1 19-25 22c-12 2-75 3-149 3c-13-31-38-59-72-77c-39-22-85-45-120-60c23-11 43-20 52-22c25-6 28-20 0-70c-7-12-15-46-16-82c-1-58 12-98 62-117c10-3 21-5 31-5c33 0 64 18 77 46c17 37 9 133-9 169c-22 40-20 52 5 58c16 4 67 29 117 57z"/>
    </svg>
);

const RankIcons = {
    1: {icon: <CrownIcon size={16} color={'#e2de50'}/>},
    2: {icon: <CrownIcon size={16} color={'#7d7a7a'}/>},
    3: {icon: <CrownIcon size={16} color={'#9f6f53'}/>},
}

const TabSystem = ({activeTab, setActiveTab, tabs}) => {
    return (
        <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '16px',
            flex: 'space-between'
        }}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                        padding: '12px 16px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === tab.id ? '2px solid var(--brand-experiment)' : '2px solid transparent',
                        color: activeTab === tab.id ? 'var(--text-default)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: activeTab === tab.id ? '600' : '500',
                        transition: 'all 0.15s ease'
                    }}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

const FriendList = ({friends, sortKey, showProbability = false}) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [onlyFriends, setOnlyFriends] = React.useState(false);

    const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);

    const filteredFriends = React.useMemo(() => {
        let result = [...friends];

        result.sort((a, b) => {
            if (showProbability) {
                return (b[sortKey] || 0) - (a[sortKey] || 0);
            }
            return (a[sortKey] || 999) - (b[sortKey] || 999);
        });

        if (searchQuery) {
            result = result.filter((friend) => {
                const user = UserStore.getUser(friend.otherUserId);
                const username = user?.username?.toLowerCase() || '';
                const globalName = user?.displayName?.toLowerCase() || '';
                const query = searchQuery.toLowerCase();

                return username.includes(query) || globalName.includes(query);
            });
        }

        if (onlyFriends) {
            result = result.filter((friend) => friend.isFriend);
        }

        return result;
    }, [friends, searchQuery, onlyFriends, sortKey, showProbability]);

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Components.TextInput
                    placeholder={"Search friends..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e)}
                />
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <FriendIcon color={onlyFriends ? '#28952f' : '#FF0000'}/>
                    <Components.SwitchInput
                        value={onlyFriends}
                        onChange={(e) => setOnlyFriends(e)}
                    >
                    </Components.SwitchInput>
                </div>
            </div>
            {filteredFriends.map((friend) => {
                const user = UserStore.getUser(friend.otherUserId);
                const value = friend[sortKey];

                // -- Maybe? --
                if (Math.round((value || 0) * 100) == 0) return null;

                const menu: ContextMenuSetup | typeof Array.prototype.pushIf = [];

                menu.pushIf(!user?.username, {
                    label: 'Fetch User', action: async () => {
                        await FetchModule.fetchUser(friend.otherUserId);
                        forceUpdate();
                    }
                });
                menu.pushIf(user?.username, {
                    label: 'Copy Username',
                    action: () => navigator.clipboard.writeText(user?.username || user?.globalName || user?.displayName || friend.otherUserId)
                });
                menu.pushIf(user?.username, {
                    label: 'Copy ID',
                    action: () => navigator.clipboard.writeText(friend.otherUserId)
                });

                return (
                    <div key={friend.otherUserId} className="friend-item"
                         onClick={() => {
                             UserModal.openUserProfileModal({userId: friend.otherUserId})
                         }}
                         onContextMenu={(a) => {
                             ContextMenu.open(a, ContextMenu.buildMenu(
                                 menu
                             ))
                         }}
                         style={{
                             backgroundColor: 'var(--background-base-lower)',
                             display: 'flex',
                             alignItems: 'center',
                             gap: '10px',
                             margin: '10px 0',
                             padding: '10px',
                             borderRadius: '5px',
                             position: 'relative'
                         }}>
                        {!showProbability && <Components.Tooltip text={"sup"}>
                            {() => {
                                return RankIcons[value]?.icon
                            }}
                        </Components.Tooltip>}
                        <Components.Text style={{minWidth: '30px', textAlign: 'center'}}>
                            {showProbability ?
                                `${Math.round((value || 0) * 100)}%` :
                                `#${value || 'N/A'}`
                            }
                        </Components.Text>
                        <img
                            src={user?.getAvatarURL() || `https://cdn.discordapp.com/embed/avatars/${getAvatar(friend.otherUserId)}.png`}
                            alt={`${user?.username || 'User'} avatar`}
                            style={{height: '36px', borderRadius: '50%'}}
                            className="friend-avatar"
                        />
                        <Components.Text style={{
                            fontSize: '15px',
                            flex: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {RelationshipStore.getNickname(friend.otherUserId) || user?.globalName || user?.username || friend.otherUserId}
                        </Components.Text>

                        {friend.isFriend && (
                            <FriendIcon size={20} color={'#28952f'}/>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const InformationModalForAffinities = ({props}) => {
    const [activeTab, setActiveTab] = useState('communication');

    const friends = UseStateFromStores([AffinityStore], (a) => {
        return AffinityStore.getUserAffinities();
    });

    const tabs = [
        {id: 'communication', label: 'Communication'},
        {id: 'dm', label: 'Direct Messages'},
        {id: 'vc', label: 'Voice Chat'},
        {id: 'server', label: 'Server Messages'},
        {id: 'probabilities', label: 'Probabilities'}
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'communication':
                return <FriendList friends={friends} sortKey="communicationRank"/>;
            case 'dm':
                return <FriendList friends={friends} sortKey="dmRank"/>;
            case 'vc':
                return <FriendList friends={friends} sortKey="vcRank"/>;
            case 'server':
                return <FriendList friends={friends} sortKey="serverMessageRank"/>;
            case 'probabilities':
                return (
                    <div>
                        <div>
                            <Components.Text style={{marginBottom: '10px'}}>
                                Voice Chat Probs
                            </Components.Text>

                            <FriendList friends={friends} sortKey="vcProbability" showProbability={true}/>
                        </div>

                        <div>
                            <Components.Text style={{marginBottom: '10px'}}>
                                Server Messages Probs
                            </Components.Text>

                            <FriendList friends={friends} sortKey="serverMessageProbability" showProbability={true}/>
                        </div>
                    </div>
                );
            default:
                return <FriendList friends={friends} sortKey="communicationRank"/>;
        }
    };

    return (
        <div {...props} style={{
            maxHeight: '600px',
            overflowY: 'auto',
            padding: '20px',
            WebkitScrollbarWidth: 'none',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '::-webkit-scrollbar': {
                display: 'none'
            }
        }}>
            <TabSystem
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
            />
            {renderTabContent()}
        </div>
    );
}

const Icon = Webpack.getModule(x => x.Icon).Icon

const Component = <Icon key={'affinities'} icon={UserIcon} tooltip={'Open User Affinities'} onClick={() => {
    ModalSystem.openModal((props) => (
        <ModalRoot {...props} size={'large'}>
            <div className="affinities-modal-content">
                <InformationModalForAffinities {...props} />
            </div>
        </ModalRoot>
    ));
}}></Icon>

const GuildHeader = Webpack.getBySource('location:"guild_header"').ZP

export default class Affinities {
    start() {
        forceUpdateApp();

        Patcher.after(GuildHeader, "type", (a, [args], res) => {
            res.props.children = new Proxy(res.props.children, {
                apply() {
                    const ret = Reflect.apply(...arguments);
                    const header = Utils.findInTree(ret, x => x?.type === "header", {walkable: ['props', 'children']});

                    const guildScore = GuildAffinitiesStore.getGuildAffinity(args.guild.id)

                    const LowQualityStore = <Components.Text style={{
                        margin: '10px',
                        color: 'var(--text-muted)'
                    }}>{guildScore?.score.toFixed() || "None"}</Components.Text>

                    header.props.children.splice(1, 0, LowQualityStore)

                    return [ret];
                }
            })
        })

        Patcher.after(Module, "T", (a, args, res) => {
            const yes = res.props.children[2].props.children[0].props.children

            yes.unshift(Component)
        });
    }

    stop() {
        Patcher.unpatchAll();
        forceUpdateApp();
    }
}