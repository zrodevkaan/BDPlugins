/**
 * @name VoiceHub
 * @author Kaan
 * @version 1.0.4
 * @description Wanna know what people are in VCs? Here ya go.
 */

const { Patcher, Webpack, React, DOM, Data } = new BdApi('VoiceHub');
const Module = Webpack.getBySource('ConnectedPrivateChannelsList');

const [VoiceIcon, ModalRoot, openModal, SearchIcon, VideoIcon, LiveStream] = BdApi.Webpack.getBulk(
    { filter: BdApi.Webpack.Filters.byStrings('"M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z'), searchExports: true },
    { filter: BdApi.Webpack.Filters.byStrings('.ImpressionTypes.MODAL,"aria-labelledby":'), searchExports: true },
    { filter: BdApi.Webpack.Filters.byStrings('onCloseRequest', 'onCloseCallback', 'instant', 'backdropStyle'), searchExports: true },
    { filter: BdApi.Webpack.Filters.byStrings('"M15.62 17.03a9 9 0 1 1 1.41-1.41l4.68 4.67a1 1 0 0 1-1.42 1.42l-4.67-4.68ZM17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z'), searchExports: true },
    { filter: BdApi.Webpack.Filters.byStrings('"M4 4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-2.12a1 1 0'), searchExports: true },
    { filter: BdApi.Webpack.Filters.byStrings('dI3q4u'), searchExports: true }
);

const Eye = ({width, height}) => React.createElement('svg', {
    viewbox: '0 0 1200 1200',
    width: width ?? '24px',
    height: height ?? '24px',
    color: 'color-mix(in oklab, hsl(0 0% 100%/1) 100%, #000 0%)'
}, React.createElement('path', {
    fill: 'color-mix(in oklab, hsl(0 0% 100%/1) 100%, #000 0%)',
    d: 'M12 5C5.648 5 1 12 1 12C1 12 5.648 19 12 19C18.352 19 23 12 23 12C23 12 18.352 5 12 5ZM12 16C9.791 16 8 14.21 8 12C8 9.79 9.791 8 12 8C14.209 8 16 9.79 16 12C16 14.21 14.209 16 12 16Z M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z'
}))
const EyeClose = ({width, height}) => /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 89.9801 1200 1020",
    color: 'color-mix(in oklab, hsl(0 0% 100%/1) 100%, #000 0%)',
    width: width ?? '24px', 
    height: height ?? '24px',
    children: /*#__PURE__*/React.createElement("path", {
        d: "M669.727,273.516c-22.891-2.476-46.15-3.895-69.727-4.248c-103.025,0.457-209.823,25.517-310.913,73.536  c-75.058,37.122-148.173,89.529-211.67,154.174C46.232,529.978,6.431,577.76,0,628.74c0.76,44.162,48.153,98.67,77.417,131.764  c59.543,62.106,130.754,113.013,211.67,154.174c2.75,1.335,5.51,2.654,8.276,3.955l-75.072,131.102l102.005,60.286l551.416-960.033  l-98.186-60.008L669.727,273.516z M902.563,338.995l-74.927,129.857c34.47,44.782,54.932,100.006,54.932,159.888  c0,149.257-126.522,270.264-282.642,270.264c-6.749,0-13.29-0.728-19.922-1.172l-49.585,85.84c22.868,2.449,45.99,4.233,69.58,4.541  c103.123-0.463,209.861-25.812,310.84-73.535c75.058-37.122,148.246-89.529,211.743-154.174  c31.186-32.999,70.985-80.782,77.417-131.764c-0.76-44.161-48.153-98.669-77.417-131.763  c-59.543-62.106-130.827-113.013-211.743-154.175C908.108,341.478,905.312,340.287,902.563,338.995L902.563,338.995z   M599.927,358.478c6.846,0,13.638,0.274,20.361,0.732l-58.081,100.561c-81.514,16.526-142.676,85.88-142.676,168.897  c0,20.854,3.841,40.819,10.913,59.325c0.008,0.021-0.008,0.053,0,0.074l-58.228,100.854  c-34.551-44.823-54.932-100.229-54.932-160.182C317.285,479.484,443.808,358.477,599.927,358.478L599.927,358.478z M768.896,570.513  L638.013,797.271c81.076-16.837,141.797-85.875,141.797-168.603C779.81,608.194,775.724,588.729,768.896,570.513L768.896,570.513z",
        fill: "color-mix(in oklab, hsl(0 0% 100%/1) 100%, #000 0%)"
    })
});

const DataStore = new Proxy(
    {},
    {
        get: (_, key) => {
            /*if (key === 'settings') {
                const savedSettings = Data.load(key) || {};
                return baseConfig.defaultConfig.reduce((acc, setting) => {
                    acc[setting.id] = savedSettings[setting.id] ?? setting.value;
                    return acc;
                }, {});
            }*/
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

const InteractiveModule = Webpack.getByKeys('interactive', 'muted', 'selected');
const InteractiveAbove = Webpack.getByKeys('channel', 'interactiveSystemDM', 'interactiveSelected');
const InputModule = Webpack.getByKeys('autocompleteQuerySymbol')
const VoiceStateStore = Webpack.getStore('VoiceStateStore');
const GuildStore = Webpack.getStore('GuildStore');
const ChannelStore = Webpack.getStore('ChannelStore');
const GuildMemberStore = Webpack.getStore('GuildMemberStore');
const UserStore = Webpack.getStore('UserStore');
const VoiceModule = Webpack.getModule(x => x.Z?.handleVoiceConnect?.toString?.().includes?.('async'))
const UserModal = Webpack.getByKeys('openUserProfileModal')
const UserContextMenu = Webpack.getByStrings('.isGroupDM()', { searchExports: true });

const getAvatar = (id) => Number(BigInt(id) >> 22n) % 6

const clsx = (...args) => [...args].join(' ');

const SearchBar = ({ value, onChange }) => {
    return React.createElement('div', {
        style: {
            position: 'relative',
            marginBottom: '12px'
        }
    }, [
        React.createElement('input', {
            className: clsx(InputModule.input),
            style: { width: '95%' },
            type: 'text',
            value,
            onChange: e => onChange(e.target.value),
            placeholder: 'Search servers, channels, or users...',
        }),
    ]);
};

const CustomVoiceChannel = ({ channel, voiceStates, guild }) => {
    const users = Object.entries(voiceStates)
        .filter(([_, state]) => state.channelId === channel.id)
        .map(([userId]) => UserStore.getUser(userId));

    const handleChannelClick = () => {
        VoiceModule.Z.handleVoiceConnect({
            channel,
            connected: false,
            needSubscriptionToAccess: false,
            locked: false
        });
    };

    const handleUserClick = (event, user) => {
        const dummyChannel = {
            isGroupDM() { return false; },
            isDM() { return false; },
            guild_id: null
        };
        UserContextMenu(event, user, dummyChannel);
    };

    return React.createElement('div', {
        className: 'voice-channel',
        onClick: handleChannelClick,
        style: {
            padding: '6px 8px',
            marginBottom: '2px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            borderLeft: '2px solid var(--background-modifier-accent)',
            transition: 'background-color 0.2s ease',
            ':hover': {
                backgroundColor: 'var(--background-modifier-hover)'
            }
        }
    }, [
        React.createElement('div', {
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }
        }, [
            React.createElement(VoiceIcon, {
                width: '14',
                height: '14',
                color: 'var(--interactive-normal)'
            }),
            React.createElement('span', {
                style: {
                    color: 'var(--header-secondary)',
                    fontSize: '13px',
                    fontWeight: '500'
                }
            }, channel.name)
        ]),
        React.createElement('div', {
            style: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                paddingLeft: '20px'
            }
        }, users.map(user => {
            const member = guild?.id ? GuildMemberStore.getMember(guild.id, user.id) : null;
            const directUser = member?.avatar ? member : user;

            const userState = voiceStates[user.id]

            return React.createElement('div', {
                key: user.id,
                onClick: (e) => {
                    e.stopPropagation();
                    if (e.shiftKey) UserModal.openUserProfileModal({ userId: user.id, channelId: channel.id, guildId: guild.id })
                    else handleUserClick(e, user);
                },
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    backgroundColor: 'var(--background-secondary)',
                    transition: 'background-color 0.2s ease',
                    ':hover': {
                        backgroundColor: 'var(--background-modifier-active)'
                    }
                }
            }, [
                React.createElement('img', {
                    src: directUser?.joinedAt && directUser?.avatar ? `https://cdn.discordapp.com/guilds/${guild.id}/users/${directUser.userId}/avatars/${directUser.avatar}.png` : directUser?.avatar ? `https://cdn.discordapp.com/avatars/${directUser?.id}/${directUser?.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${getAvatar(directUser.id)}.png`,
                    style: {
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%'
                    }
                }),
                React.createElement('span', {
                    style: {
                        color: 'var(--interactive-normal)',
                        fontSize: '13px'
                    }
                }, user.username),
                userState.selfVideo && React.createElement(VideoIcon),
                userState.selfStream && React.createElement(LiveStream),
            ])
        }))
    ]);
};

const VoiceChannelList = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filterType, setFilterType] = React.useState('all'); // deprecated/useless idea. dont mind this.
    const guilds = GuildStore.getGuilds();

    const [dropped, setDropped] = React.useState(DataStore?.hiddenGuilds || []);

    const searchLower = searchQuery.toLowerCase();

    const filteredGuilds = Object.values(guilds).filter(guild => {
        const voiceStates = VoiceStateStore.getVoiceStates(guild.id);
        if (!Object.keys(voiceStates).length) return false;

        if (filterType === 'servers') {
            return guild.name.toLowerCase().includes(searchLower);
        }

        const activeChannels = [...new Set(Object.values(voiceStates).map(state => state.channelId))]
            .map(channelId => ChannelStore.getChannel(channelId))
            .filter(Boolean);

        if (filterType === 'channels') {
            return activeChannels.some(channel =>
                channel.name.toLowerCase().includes(searchLower)
            );
        }

        if (filterType === 'users') {
            return Object.keys(voiceStates).some(userId => {
                const user = UserStore.getUser(userId);
                return user && user.username.toLowerCase().includes(searchLower);
            });
        }

        return guild.name.toLowerCase().includes(searchLower) ||
            activeChannels.some(channel => channel.name.toLowerCase().includes(searchLower)) ||
            Object.keys(voiceStates).some(userId => {
                const user = UserStore.getUser(userId);
                return user && user.username.toLowerCase().includes(searchLower);
            });
    });

    const toggleDropped = (guildId) => {
        const yue = {
            ...dropped,
            [guildId]: !dropped[guildId]
        }

        setDropped(yue)

        DataStore.hiddenGuilds = yue
    };

    return React.createElement('div', {
        style: {
            padding: '20px',
            height: '600px',
            display: 'flex',
            flexDirection: 'column',
        }
    }, [
        React.createElement('div', {
            style: {
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
            }
        }, [
            React.createElement(SearchBar, {
                value: searchQuery,
                onChange: setSearchQuery
            }),
            React.createElement('div', {
                style: {
                    display: 'flex',
                    gap: '8px'
                }
            })
        ]),
        React.createElement('div', {
            className: 'voice-modal-scroller',
            style: {
                overflowY: 'auto',
                flex: 1,
            }
        }, filteredGuilds.length <= 0 ? React.createElement("div", {
            style: {
                flex: "0 1 auto",
                width: 433,
                height: 232,
                backgroundImage: "url(/assets/99ad5845cf7de1c326e2.svg)",
                margin: "auto"
            }
        }) : filteredGuilds.map(guild => {
            const voiceStates = VoiceStateStore.getVoiceStates(guild.id);
            const activeChannels = [...new Set(Object.values(voiceStates).map(state => state.channelId))]
                .map(channelId => ChannelStore.getChannel(channelId))
                .filter(Boolean);

            return React.createElement('div', {
                key: guild.id,
                style: {
                    marginBottom: '24px'
                },
            }, [
                React.createElement('div', { style: { display: 'flex', gap: '10px' }, onClick: () => toggleDropped(guild.id) },
                    React.createElement('img', {
                        src: guild?.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=1280&quality=lossless` : `https://cdn.discordapp.com/embed/avatars/${getAvatar(guild.id)}.png`,
                        style: {
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%'
                        }
                    }),
                    React.createElement('h2', {
                        style: {
                            marginBottom: '12px',
                            color: 'var(--header-primary)',
                            fontSize: '16px',
                            fontWeight: '600',
                            letterSpacing: '0.5px',
                            gap: '10px',
                            display: 'flex',
                            alignItems: 'center',
                        }
                    }, [guild.name, React.createElement(dropped[guild.id] ? EyeClose : Eye, {width: '24px', height: '24px'})]),
                ),
                !dropped[guild.id] ? activeChannels.map(channel =>
                    React.createElement(CustomVoiceChannel, {
                        key: channel.id,
                        channel: channel,
                        guild: guild,
                        voiceStates: voiceStates
                    })
                ) : React.createElement('div')
            ]);
        }))
    ]);
};
const VoiceHubButton = ({ onClick }) => {
    return React.createElement('div', {
        className: clsx(InteractiveModule.interactive, InteractiveAbove.interactive, InteractiveAbove.linkButton),
        style: {
            display: 'flex',
            alignItems: 'center',
            padding: '6px 6px',
            borderRadius: '4px',
            margin: '2px 0',
            gap: '8px',
            marginLeft: '10px',
            marginRight: '40px',
            cursor: 'pointer'
        },
        onClick
    }, [
        React.createElement(VoiceIcon, {
            width: '22',
            height: '22',
            color: 'currentColor'
        }),
        React.createElement('span', {
            style: {
                fontSize: '16px',
                fontWeight: '500'
            }
        }, 'Voice Hub')
    ]);
};

class VoiceHub {
    start() {
        DOM.addStyle('voiceHub',
            `.voice-modal-scroller::-webkit-scrollbar {
            display: none;
        }`)
        Patcher.after(Module, 'Z', (_, __, res) => {
            const isExisting = res.props.children.props.children.find(x => x?.key === "voice-connect") // prevent button duplication?
            // idk how that works.
            if (isExisting) return;
            res.props.children.props.children.unshift(
                React.createElement(VoiceHubButton, {
                    key: 'voice-connect',
                    onClick: () => {
                        openModal(modalProps => {
                            return React.createElement(ModalRoot, {
                                ...modalProps,
                                size: "medium",
                                className: "voice-hub-modal"
                            }, React.createElement(VoiceChannelList));
                        });
                    }
                })
            );
        });
    }

    stop() {
        DOM.removeStyle('voiceHub')
        Patcher.unpatchAll();
    }
}