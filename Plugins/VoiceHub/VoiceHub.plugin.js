/**
 * @name VoiceHub
 * @author Kaan
 * @version 1.0.1
 * @description Wanna know what people are in VCs? Here ya go.
 */

const { Patcher, Webpack, React, DOM } = new BdApi('VoiceHub');
const Module = Webpack.getBySource('ConnectedPrivateChannelsList');

const SystemDesign = {
    VoiceIcon: Webpack.getByStrings('"M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z', { searchExports: true }),
    ModalRoot: Webpack.getByStrings('.ImpressionTypes.MODAL,"aria-labelledby":',{searchExports:true}),
    openModal: Webpack.getByStrings('onCloseRequest', 'onCloseCallback', 'onCloseCallback', 'instant', 'backdropStyle', { searchExports: true }),
    SearchIcon: Webpack.getByStrings('"M15.62 17.03a9 9 0 1 1 1.41-1.41l4.68 4.67a1 1 0 0 1-1.42 1.42l-4.67-4.68ZM17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z', { searchExports: true }),
    VideoIcon: Webpack.getByStrings('"M4 4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-2.12a1 1 0', { searchExports: true }),
    LiveStream: Webpack.getByStrings('dI3q4u')
};

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
            style: {width: '95%'},
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
            React.createElement(SystemDesign.VoiceIcon, {
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
            // console.log(userState)
            return React.createElement('div', {
                key: user.id,
                onClick: (e) => {
                    e.stopPropagation();
                    if (e.shiftKey) UserModal.openUserProfileModal({userId: user.id, channelId: channel.id, guildId: guild.id})
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
                userState.selfVideo && React.createElement(SystemDesign.VideoIcon),
                userState.selfStream && React.createElement(SystemDesign.LiveStream),
            ])
        }))
    ]);
};

const VoiceChannelList = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filterType, setFilterType] = React.useState('all'); // deprecated/useless idea. dont mind this.
    const guilds = GuildStore.getGuilds();

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

    return React.createElement('div', {
        style: {
            padding: '20px',
            maxHeight: '600px',
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
            className: 'hell',
            style: {
                overflowY: 'auto',
                flex: 1,
            }
        }, filteredGuilds.map(guild => {
            const voiceStates = VoiceStateStore.getVoiceStates(guild.id);
            const activeChannels = [...new Set(Object.values(voiceStates).map(state => state.channelId))]
                .map(channelId => ChannelStore.getChannel(channelId))
                .filter(Boolean);

            return React.createElement('div', {
                key: guild.id,
                style: {
                    marginBottom: '24px'
                }
            }, [
                React.createElement('div',{style: {display: 'flex', gap: '10px'}}, 
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
                            letterSpacing: '0.5px'
                        }
                    }, guild.name),
                ),
                ...activeChannels.map(channel =>
                    React.createElement(CustomVoiceChannel, {
                        key: channel.id,
                        channel: channel,
                        guild: guild,
                        voiceStates: voiceStates
                    })
                )
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
        React.createElement(SystemDesign.VoiceIcon, {
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
        `.hell::-webkit-scrollbar {
            display: none;
        }`)
        Patcher.after(Module, 'Z', (_, __, res) => {
            const isExisting = res.props.children.props.children.find(x=>x?.key === "voice-connect") // prevent button duplication?
            // idk how that works.
            if (isExisting) return;
            res.props.children.props.children.unshift(
                React.createElement(VoiceHubButton, {
                    key: 'voice-connect', 
                    onClick: () => {
                        SystemDesign.openModal(modalProps => {
                            return React.createElement(SystemDesign.ModalRoot, {
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