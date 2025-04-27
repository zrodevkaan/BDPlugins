/**
 * @name LiveTyping
 * @author Kaan
 * @version 1.0.0
 * @description Typing status per user on servers, channels or threads.
 */

const { Webpack, Patcher, React, Components, Data, UI, Utils, DOM } = new BdApi("LiveTyping");

const {
    getModule,
    getStore,
    getByStrings,
    getByPrototypeKeys,
    getBySource,
    getBulk,
    Filters
} = Webpack;

const getBulkStore = (() => {
    const storeCache = new Map();

    return (storeNames, options = {}) => {
        const { throwOnMissing = false, cache = true } = options;
        const result = {};

        if (!Array.isArray(storeNames)) {
            storeNames = [storeNames];
        }

        for (const name of storeNames) {
            if (cache && storeCache.has(name)) {
                result[name] = storeCache.get(name);
                continue;
            }

            try {
                const store = getStore(name);

                if (!store && throwOnMissing) {
                    throw new Error(`Store '${name}' not found`);
                }

                if (cache && store) {
                    storeCache.set(name, store);
                }

                result[name] = store;
            } catch (e) {
                if (throwOnMissing) {
                    throw e;
                }
                result[name] = null;
            }
        }

        return storeNames.length === 1 ? result[storeNames[0]] : result;
    };
})();

const {
    UserStore,
    TypingStore,
    PrivateChannelSortStore,
    GuildChannelStore,
    SelectedGuildStore
} = getBulkStore([
    'UserStore',
    'TypingStore',
    'PrivateChannelSortStore',
    'GuildChannelStore',
    'SelectedGuildStore'
]);

/* when well Webpack.Stores be merged.... :( */

const [ChannelElement, Popout, useStateFromStores] = getBulk({ filter: x => x && String(x.Z?.render).includes('.charCode===') && String(x.Z?.render).includes("onKeyPress") }, { filter: Filters.byStrings("Unsupported animation config:"), searchExports: true }, { filter: Filters.byStrings("useStateFromStores"), searchExports: true })

const Spinner = Components.Spinner
const scrollersModule = getBySource(".customTheme)", { raw: true });
const RenderAvatars = getByPrototypeKeys("renderUsers", "renderMoreUsers")

const GuildObject = getByStrings('.guildbar.AVATAR_SIZE', 'backgroundStyle', {
    searchExports: true,
    raw: true
}).exports;

const SPINNER_TYPES = Object.keys(Spinner.Type);
const INDICATOR_DIRECTIONS = ["left", "right"];
const DEFAULT_INDICATOR_TYPE = "PULSING_ELLIPSIS";
const DEFAULT_INDICATOR_LOCATION = "right";

const CONFIG = {
    defaultConfig: [
        {
            id: "indicatorType",
            name: "Indicator Type",
            note: "Allows you to select which indicator you'd like.",
            type: "dropdown",
            value: DEFAULT_INDICATOR_TYPE,
            options: SPINNER_TYPES.map(type => ({ label: type, value: type })),
            disabled: false,
        },
        {
            id: "indicatorLocation",
            name: "Indicator Location",
            note: "Allows you to display the indicator on the left or right of channels.",
            type: "dropdown",
            value: DEFAULT_INDICATOR_LOCATION,
            options: INDICATOR_DIRECTIONS.map(dir => ({ label: dir, value: dir })),
            disabled: false,
        }
    ]
};

const DataStore = new Proxy({}, {
    get: (_, key) => {
        if (key === 'settings') {
            const savedSettings = Data.load(key) || {};
            return CONFIG.defaultConfig.reduce((acc, setting) => {
                acc[setting.id] = savedSettings[setting.id] ?? setting.value;
                return acc;
            }, {});
        }
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
});

const getTypingTooltip = (users) => {
    const names = Object.values(users).map(u => u.username).filter(Boolean);
    const [a, b, c] = names;
    return !names.length ? '' :
        names.length === 1 ? `${a} is typing!` :
            names.length === 2 ? `${a} and ${b} are typing!` :
                names.length === 3 ? `${a}, ${b}, and ${c} are typing!` :
                    `${names.length} members are typing!`;
};

const n = (user) => Number(user.discriminator) % 5;

function getTypingUsers(users) {
    const currentUser = UserStore.getCurrentUser();
    if (!users || !currentUser) return {};
    return Object.entries(users)
        .filter(([id]) => id !== currentUser.id)
        .reduce((acc, [id]) => (UserStore.getUser(id) && (acc[id] = UserStore.getUser(id)), acc), {});
}

function ExtractItemID(link) {
    return link?.substr(link.lastIndexOf('_') + 1);
}

const UserAvatarList = ({ users }) => {
    const SelectedGuild = SelectedGuildStore.getGuildId();
    const users_ = Object.values(users).map(x => x.id).map(x => UserStore.getUser(x))

    return React.createElement('div', {
        className: 'live-typing-avatar-list',
        style: {
            padding: '8px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            maxWidth: '200px',
            justifyContent: 'center'
        }
    }, React.createElement(RenderAvatars, { guildId: SelectedGuild, max: 3, users: users_ }))
};

/*function TypingAvatar({ user }) {
    return React.createElement('div', {
        className: 'dm-typing-avatar',
        style: {
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            marginLeft: '4px',
            position: 'relative'
        }
    },
        React.createElement(RenderAvatars, {guildId: SelectedGuild, size: 3, users: []}));
}*/

/* React.createElement(Avatar.Avatar, {
            src: user?.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=24` : `https://cdn.discordapp.com/embed/avatars/${n(user)}.png`,
            size: "SIZE_24",
            status: null
        }) */

const isEmpty = o => !o || !Object.keys(o).length;

const TypingIndicatorDMBar = React.memo(() => {
    const [showPopout, setShowPopout] = React.useState(false);
    const privateChannelIds = useStateFromStores([PrivateChannelSortStore], () => PrivateChannelSortStore.getPrivateChannelIds());
    const currentUserId = UserStore.getCurrentUser().id;

    const typingUsersByChannel = useStateFromStores([TypingStore], () => {
        const result = {};
        for (const channelId of privateChannelIds) {
            const typingUsers = TypingStore.getTypingUsers(channelId);
            if (!isEmpty(typingUsers)) result[channelId] = typingUsers;
        }
        return result;
    }, [privateChannelIds]);

    const typingUsers = {};
    Object.values(typingUsersByChannel).forEach(users => {
        Object.keys(users).forEach(userId => {
            if (userId !== currentUserId) {
                typingUsers[userId] = UserStore.getUser(userId);
            }
        });
    });

    if (isEmpty(typingUsers)) return null;

    const indicatorType = DataStore.settings.indicatorType || DEFAULT_INDICATOR_TYPE;
    const tooltipText = getTypingTooltip(typingUsers);

    return React.createElement(Popout, {
        renderPopout: () => React.createElement(UserAvatarList, { users: typingUsers }),
        position: "left",
        shouldShow: showPopout,
        className: 'moreCorners',
        onRequestClose: () => setShowPopout(false),
        children: (props) => React.createElement('div', {
            className: "typing-indicator-dm-container",
            onMouseEnter: () => setShowPopout(true),
            onMouseLeave: () => setShowPopout(false),
            onClick: () => setShowPopout(x => !x),
            style: { cursor: 'pointer' }
        }, React.createElement(Spinner, {
            ...props,
            type: Spinner.Type[indicatorType],
            animated: true,
            style: { gap: 'var(--space-xs)', padding: 'var(--space-0)' }
        }))
    });
});

const TypingIndicator = React.memo(({ channelId }) => {
    const [showPopout, setShowPopout] = React.useState(false);

    const typingUsers = useStateFromStores([TypingStore], () => getTypingUsers(TypingStore.getTypingUsers(channelId)), [channelId]);
    if (isEmpty(typingUsers)) return null;

    const indicatorType = DataStore.settings.indicatorType || DEFAULT_INDICATOR_TYPE;

    return React.createElement(Popout, {
        renderPopout: () => React.createElement(UserAvatarList, { users: typingUsers }),
        position: "right",
        shouldShow: showPopout,
        className: 'moreCorners',
        onRequestClose: () => setShowPopout(false),
        children: (props) => React.createElement('div', {
            onMouseEnter: () => setShowPopout(true),
            onMouseLeave: () => setShowPopout(false),
            onClick: () => setShowPopout(x => !x),
            style: { cursor: 'pointer' }
        }, React.createElement(
            Components.Tooltip,
            { text: getTypingTooltip(typingUsers) },
            (tooltipProps) => React.createElement(Spinner, {
                ...tooltipProps,
                ...props,
                type: Spinner.Type[indicatorType],
                animated: true,
                style: { width: "16px", height: "16px" }
            })
        ))
    });
});

const GuildTypingIndicator = React.memo(({ guildId }) => {
    const [showPopout, setShowPopout] = React.useState(false);

    const allTypingUsers = useStateFromStores([TypingStore], () => {
        const { VOCAL = {}, SELECTABLE = {} } = GuildChannelStore.getChannels(guildId) || {};
        const allChannels = [...Object.values(VOCAL), ...Object.values(SELECTABLE)];
        return allChannels.reduce((acc, { channel }) => ({ ...acc, ...getTypingUsers(TypingStore.getTypingUsers(channel.id)) }), {});
    }, [guildId]);

    if (isEmpty(allTypingUsers)) return null;

    const indicatorType = DataStore.settings.indicatorType || DEFAULT_INDICATOR_TYPE;

    return React.createElement(
        Components.Tooltip,
        { text: getTypingTooltip(allTypingUsers) },
        (tooltipProps) => React.createElement(Spinner, {
            ...tooltipProps,
            style: {
                position: 'absolute',
                zIndex: 2,
                borderRadius: 'var(--radius-sm)',
                padding: '2px',
                cursor: 'pointer'
            },
            type: Spinner.Type[indicatorType],
            animated: true
        })
    )
});


class LiveTyping {
    start() {
        this.patchChannelElement();
        this.patchGuildObject();
        this.patchDMTyping();
        this.injectStyles();
    }

    injectStyles() {
        DOM.addStyle("LiveTyping", `
            .live-typing-avatar-list {
                background-color: var(--background-secondary);
                border-radius: 5px;
            }
            .live-typing-user-item:hover {
                background-color: var(--background-modifier-hover);
                border-radius: 3px;
            }
            .dm-typing-avatar {
                animation: pulse 1.5s infinite;
            }
            
            .moreCorners {
                border-radius: 10px;
                transform-origin: center center;
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
        `);
    }

    patchDMTyping() {
        Patcher.after(scrollersModule.exports[Webpack.modules[scrollersModule.id].toString().match(/,(.{1,3}):\(\)=>(.{1,3}),.+?\2=\(0,.{1,3}\..{1,3}\)\((.{1,3})\.none,\3\.fade,\3\.customTheme\)/)[1]], "render", (that, [props], res) => {
            res.props.children.props.children.unshift(React.createElement(TypingIndicatorDMBar))
        });
    }

    patchChannelElement() {
        Patcher.after(ChannelElement.Z, "render", (_, [props], ret) => {
            const channelId = ExtractItemID(props['data-list-item-id']);
            if (!channelId) return;

            const children = ret.props.children.props.children[0].props.children;
            const component = React.createElement(TypingIndicator, { channelId });

            const location = DataStore.settings.indicatorLocation || DEFAULT_INDICATOR_LOCATION;
            if (location === "left") {
                children.unshift(component);
            } else {
                children.push(component);
            }
        });
    }

    patchGuildObject() {
        Patcher.after(GuildObject, "L", (_, [props], ret) => {
            const guildId = ExtractItemID(props['data-list-item-id']);
            if (!guildId) return;

            const unpatch = Patcher.after(ret.type.prototype, "render", (thisObj, _, renderRet) => {
                unpatch();
                const guild = Utils.findInTree(renderRet, x => x?.['data-list-item-id'], { walkable: ['props', 'children'] });
                if (guild && guild.children) {
                    guild.children?.push?.(React.createElement(GuildTypingIndicator, { guildId }));
                }
            });
        });
    }

    stop() {
        Patcher.unpatchAll();
        DOM.removeStyle("LiveTyping");
    }

    getSettingsPanel() {
        const currentSettings = DataStore.settings;

        const configWithCurrentValues = CONFIG.defaultConfig.map(setting => ({
            ...setting,
            value: currentSettings[setting.id] ?? setting.value
        }));

        return UI.buildSettingsPanel({
            settings: configWithCurrentValues,
            onChange: (_, id, value) => {
                const settings = { ...DataStore.settings };
                settings[id] = value;
                DataStore.settings = settings;
            }
        });
    }
}

module.exports = LiveTyping;