/**
 * @name LastOnline
 * @author kaan
 * @description tracking of user online status and last seen times with status change notifications. This plugin only works off cache, Discord does not give any feedback I require.
 * @version 1.3.1
 */

const {Patcher, Webpack, Utils, React, Data, UI, Components} = new BdApi('LastOnline');
const DMUser = Webpack.getByStrings("activities", "isMultiUserDM", "isMobile", {defaultExport: false});
const ActivityClasses = Webpack.getByKeys('activityStatusText', 'fullWidth')
const ChannelStore = Webpack.getStore('ChannelStore');
const SystemUI = Components

const DEFAULT_SETTINGS = {
    refreshInterval: 60000,
    tooltipFormat: 'Last seen: {lastOnline}, Last message: {lastMessage}',
    excludeUsers: [],
    fontSize: '0.85em',
    textColor: 'var(--interactive-normal)',
    trackMode: 'all',
    maxTrackAge: 30,
    showOnlyIfRecent: false,
    recentActivityThreshold: 7,
    showStatusNotifications: false,
    notificationDuration: 3000,
};

const config = {
    settings: [
        {
            type: 'category',
            id: 'general',
            name: 'General Settings',
            collapsible: true,
            settings: [
                {
                    type: 'text',
                    id: 'tooltipFormat',
                    name: 'Tooltip Format',
                    note: 'Customize the text shown in tooltips.',
                    value: DEFAULT_SETTINGS.tooltipFormat,
                },
                {
                    type: 'number',
                    id: 'refreshInterval',
                    name: 'Refresh Interval (ms)',
                    note: 'How often the tooltip data refreshes (in milliseconds).',
                    value: DEFAULT_SETTINGS.refreshInterval,
                },
                {
                    type: 'dropdown',
                    id: 'trackMode',
                    name: 'Tracking Mode',
                    note: 'Choose which users to track',
                    value: DEFAULT_SETTINGS.trackMode,
                    options: [
                        {label: 'All Users', value: 'all'},
                        {label: 'Friends Only', value: 'friends'},
                    ]
                },
            ],
        },
        {
            type: 'category',
            id: 'appearance',
            name: 'Appearance',
            collapsible: true,
            settings: [
                {
                    type: 'text',
                    id: 'fontSize',
                    name: 'Font Size',
                    note: 'Adjust the font size of the status text.',
                    value: DEFAULT_SETTINGS.fontSize,
                },
                {
                    type: 'text',
                    id: 'textColor',
                    name: 'Text Color',
                    note: 'Set the color of the status text (e.g., #ffffff).',
                    value: DEFAULT_SETTINGS.textColor,
                },
                {
                    type: 'switch',
                    id: 'showOnlyIfRecent',
                    name: 'Show Only Recent Activity',
                    note: 'Only display status for users active within the recent threshold.',
                    value: DEFAULT_SETTINGS.showOnlyIfRecent,
                },
                {
                    type: 'number',
                    id: 'recentActivityThreshold',
                    name: 'Recent Activity Threshold (Days)',
                    note: 'Number of days to consider a user recently active.',
                    value: DEFAULT_SETTINGS.recentActivityThreshold,
                },
            ],
        },
        {
            type: 'category',
            id: 'notifications',
            name: 'Notifications',
            collapsible: true,
            settings: [
                {
                    type: 'switch',
                    id: 'showStatusNotifications',
                    name: 'Show Status Change Notifications',
                    note: 'Show notifications when users go online or offline.',
                    value: DEFAULT_SETTINGS.showStatusNotifications,
                },
                {
                    type: 'number',
                    id: 'notificationDuration',
                    name: 'Notification Duration (ms)',
                    note: 'Duration to show notifications (in milliseconds).',
                    value: DEFAULT_SETTINGS.notificationDuration,
                },
            ],
        },
        {
            type: 'category',
            id: 'advanced',
            name: 'Advanced Settings',
            collapsible: true,
            settings: [
                {
                    type: 'number',
                    id: 'maxTrackAge',
                    name: 'Max Tracking Age (Days)',
                    note: 'Maximum number of days to keep user tracking data.',
                    value: DEFAULT_SETTINGS.maxTrackAge,
                },
            ],
        },
        {
            type: 'category',
            id: 'exclude',
            name: 'Exclude Users',
            collapsible: true,
            settings: [
                {
                    type: 'text',
                    id: 'excludeUsers',
                    name: 'Excluded User IDs',
                    note: 'Comma-separated list of user IDs to exclude from tracking.',
                    value: DEFAULT_SETTINGS.excludeUsers.join(', '),
                },
            ],
        },
    ],
}

class LastOnlineData {
    constructor() {
        this.cache = Data.load('lastOnlineData') ?? {};
        this.settings = Data.load('settings') ?? DEFAULT_SETTINGS;

        this.presenceListener = null;
        this.messageListener = null;
        this.presenceModule = Webpack.getModule(e => e.dispatch && !e.emitter && !e.commands);
        this.UserStore = Webpack.getStore('UserStore');
        this.PresenceStore = Webpack.getStore('PresenceStore');
        this.RelationshipStore = Webpack.getStore('RelationshipStore');

        this.userStatuses = {};
    }

    startTracking() {
        this.presenceListener = (event) => {
            const updates = event.updates;
            if (!updates || !updates.length) return;

            updates.forEach(update => {
                const {user, status} = update;
                if (!user || !user.id) return;

                if (!this.shouldTrackUser(user.id)) return;

                const prevStatus = this.userStatuses[user.id] || 'unknown';
                this.userStatuses[user.id] = status;

                if (getSettingById('showStatusNotifications') && prevStatus !== 'unknown') {
                    this.handleStatusChange(user.id, prevStatus, status);
                }

                status === 'offline' && this.updateLastOnline(user.id);
            });
        };

        this.presenceModule.subscribe('PRESENCE_UPDATES', this.presenceListener);

        this.messageListener = (event) => {
            const {author, timestamp} = event.message;
            if (!author || !author.id) return;

            if (!this.shouldTrackUser(author.id)) return;

            this.updateLastMessage(author.id, new Date(timestamp));
        };

        this.presenceModule.subscribe('MESSAGE_CREATE', this.messageListener);

        this.initializeUserStatuses();
    }

    initializeUserStatuses() {
        const users = this.UserStore.getUsers();
        for (const userId in users) {
            if (this.shouldTrackUser(userId)) {
                this.userStatuses[userId] = this.PresenceStore.getStatus(userId);
            }
        }
    }

    animStat = () => Webpack.getBySource('.UNKNOWN?n:null').qE

    convertToDiscord = (id, avatar) => `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=56`

    imageIcon = ({url}) => {
        return React.createElement('img', {style: {borderRadius: '50%', width: '24px', height: '24px'}, src: url})
    }

    handleStatusChange(userId, oldStatus, newStatus) {
        const user = this.UserStore.getUser(userId);
        if (!user) return;

        if ((oldStatus === 'offline' && newStatus !== 'offline') ||
            (oldStatus !== 'offline' && newStatus === 'offline')) {

            const isOnline = newStatus !== 'offline';
            const statusText = isOnline ? 'online' : 'offline';
            const statusType = isOnline ? 'success' : 'info';

            UI.showNotification({
                id: `status-change-${Date.now()}`,
                title: `${user.username} is now ${statusText}`,
                icon: () => React.createElement(this.imageIcon, {url: this.convertToDiscord(user.id, user.avatar)}),
                type: statusType,
                duration: getSettingById("notificationDuration")
            });
        }
    }

    shouldTrackUser(userId) {
        const trackMode = this.settings.trackMode || 'all';
        const excludedUsers = Array.isArray(this.settings.excludeUsers)
            ? this.settings.excludeUsers.map(id => id.trim())
            : (this.settings.excludeUsers ? this.settings.excludeUsers.split(',').map(id => id.trim()) : []);

        if (excludedUsers.includes(userId)) return false;

        switch (trackMode) {
            case 'friends':
                return this.RelationshipStore.isFriend(userId);
            default:
                return true;
        }
    }

    updateLastOnline(userId) {
        const user = this.UserStore.getUser(userId);
        if (!user) return;

        this.cache[userId] = {
            ...this.cache[userId],
            lastOnline: {
                timestamp: new Date().getTime(),
                username: user.username,
            },
        };

        this.saveData();
    }

    updateLastMessage(userId, timestamp) {
        const user = this.UserStore.getUser(userId);
        if (!user) return;

        const numericTimestamp = timestamp instanceof Date ? timestamp.getTime() : timestamp;

        this.cache[userId] = {
            ...this.cache[userId],
            lastMessage: {
                timestamp: numericTimestamp,
                username: user.username,
            },
        };

        this.saveData();
    }

    getLastOnline(userId) {
        const data = this.cache[userId];
        if (!data) return null;

        if (this.settings.showOnlyIfRecent) {
            const recentThreshold = new Date().getTime() -
                (this.settings.recentActivityThreshold * 24 * 60 * 60 * 1000);

            const lastActivityTimestamp = Math.max(
                data.lastOnline?.timestamp || 0,
                data.lastMessage?.timestamp || 0
            );

            if (lastActivityTimestamp < recentThreshold) return null;
        }

        const formattedLastOnline = data.lastOnline
            ? this.formatTimestamp(data.lastOnline.timestamp)
            : null;

        const formattedLastMessage = data.lastMessage
            ? this.formatTimestamp(data.lastMessage.timestamp)
            : null;

        return {
            lastOnline: {
                ...data.lastOnline,
                formatted: formattedLastOnline,
            },
            lastMessage: {
                ...data.lastMessage,
                formatted: formattedLastMessage,
            },
        };
    }

    stopTracking() {
        if (this.presenceListener) {
            this.presenceModule.unsubscribe('PRESENCE_UPDATES', this.presenceListener);
        }
        if (this.messageListener) {
            this.presenceModule.unsubscribe('MESSAGE_CREATE', this.messageListener);
        }
    }

    formatTimestamp(timestamp) {
        const now = new Date().getTime();
        const diff = now - timestamp;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        }
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        }
        const days = Math.floor(diff / 86400000);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }

    cleanupOldData() {
        const maxTrackAge = this.settings.maxTrackAge || 30;
        const cutoffTimestamp = new Date().getTime() - (maxTrackAge * 24 * 60 * 60 * 1000);

        for (const userId in this.cache) {
            const userLastActivity = Math.max(
                this.cache[userId].lastOnline?.timestamp || 0,
                this.cache[userId].lastMessage?.timestamp || 0
            );

            if (userLastActivity < cutoffTimestamp) {
                delete this.cache[userId];
            }
        }

        this.saveData();
    }

    saveData() {
        Data.save('lastOnlineData', this.cache);
    }

    isUserOnline(userId) {
        const userStatus = this.PresenceStore.getStatus(userId);
        return userStatus === 'online' || userStatus === 'dnd' || userStatus === 'idle';
    }

    saveSettings(newSettings) {
        this.settings = {...this.settings, ...newSettings};
        Data.save('settings', this.settings);
    }

    clearCache() {
        this.cache = {};
        Data.save('lastOnlineData', this.cache);
    }
}

const DataClass = new LastOnlineData();

function getSettingById(settingId) {
    const settings = Data.load('settings') || DEFAULT_SETTINGS;
    return settings[settingId] !== undefined ? settings[settingId] : DEFAULT_SETTINGS[settingId];
}

const LastSeenComponent = ({userId}) => {
    const [lastSeen, setLastSeen] = React.useState(() => DataClass.getLastOnline(userId));

    React.useEffect(() => {
        const interval = setInterval(() => setLastSeen(DataClass.getLastOnline(userId)), getSettingById('refreshInterval'));
        return () => clearInterval(interval);
    }, [userId]);

    const isOnline = DataClass.isUserOnline(userId);
    const tooltipFormat = getSettingById('tooltipFormat');
    const lastOnlineText = lastSeen?.lastOnline?.formatted || 'Never';
    const lastMessageText = lastSeen?.lastMessage?.formatted || 'Never';

    const construct = tooltipFormat
        .replace('{lastOnline}', lastOnlineText)
        .replace('{lastMessage}', lastMessageText);

    return React.createElement(
        SystemUI.Tooltip,
        {
            text: isOnline ? 'Currently Online' : construct,
            position: 'right'
        },
        (props) => React.createElement(
            'div', {},
            React.createElement(
                'span',
                {
                    ...props,
                    style: {fontSize: getSettingById('fontSize'), color: getSettingById('textColor'), width: '22px'},
                    className: `${ActivityClasses.activityStatusText} smaller-last-seen`,
                },
                isOnline ? 'Online' : construct
            )
        )
    );
};

export default class LastOnline {
    start() {
        DataClass.startTracking();

        Patcher.after(DMUser, 'ZP', (_, args, res) => {
            res.type = React.useMemo(() => {
                const {type} = res;

                if (type.__myPluginId) return type;

                const newType = function (props) {
                    const ret = type(props);

                    return React.cloneElement(ret, {
                        children() {
                            const res = ret.props.children.apply(this, arguments);

                            const userObj = BdApi.Utils.findInTree(
                                res,
                                x => x?.['aria-label'] && x.innerRef,
                                {walkable: ['props', 'children']}
                            );

                            if (userObj?.children?.props && !userObj.children.props.subText) {
                                const UserId = ChannelStore.getChannel(props.channel.id).recipients[0];

                                userObj.children.props.subText = React.createElement(LastSeenComponent, {userId: UserId});
                            }

                            return res;
                        }
                    });
                }

                newType.__myPluginId = type;

                return newType;
            }, [res.type]);
        })
    }

    stop() {
        Patcher.unpatchAll();
        DataClass.stopTracking();
    }

    saveSettings() {
        const settingsToSave = {};
        config.settings.forEach((category) => {
            category.settings.forEach((setting) => {
                settingsToSave[setting.id] = setting.value;
            });
        });
        Data.save('settings', settingsToSave);
    }

    handleSettingChange(categoryId, settingId, newValue) {
        const category = config.settings.find((cat) => cat.id === categoryId);
        if (!category) return;

        const setting = category.settings.find((set) => set.id === settingId);
        if (!setting) return;

        setting.value = newValue;
        this.saveSettings();
    }

    loadSettings() {
        const savedSettings = Data.load('settings');
        if (savedSettings) {
            config.settings.forEach((category) => {
                category.settings.forEach((setting) => {
                    const savedValue = savedSettings[setting.id];
                    if (savedValue !== undefined) {
                        setting.value = savedValue;
                    }
                });
            });
        }
    }

    getSettingsPanel() {
        this.loadSettings();

        return UI.buildSettingsPanel({
            settings: config.settings,
            onChange: (category, id, value) => {
                this.handleSettingChange(category, id, value);
            },
        });
    }
}