/**
 * @name RoleFilters
 * @author Kaan
 * @version 1.0.0
 * @description Allows you to hide, show and collapse roles!
 */

import type {Channel} from "discord-types/general";

const {Patcher, Webpack, React, Data, UI, Utils, ContextMenu} = new BdApi("RoleFilters");
const GatewayStore = Webpack.getStore('GatewayConnectionStore')
const GuildRoleStore = Webpack.getStore('GuildRoleStore')
const PresenceStore = Webpack.getStore('PresenceStore')
const ChannelStore = Webpack.getStore('ChannelStore')
const TypingStore = Webpack.getStore('TypingStore')
const GuildStore = Webpack.getStore('GuildStore')
const GuildMemberStore = Webpack.getStore('GuildMemberStore')
const UserStore = Webpack.getStore('UserStore')
const Socket = () => GatewayStore.getSocket();
const UseStateFromStores: Function = Webpack.getModule(m => m.toString?.().includes("useStateFromStores"), {searchExports: true});

const MemberList = Webpack.getBySource(`.Z.MEMBER_LIST)`, 'updateMaxContentFeedRowSeen')
const MemberListItemComponent = Webpack.getBySource('shouldAnimateStatus', 'onClickPremiumGuildIcon').Z

interface ColorStrings {
    primaryColor: string;
    secondaryColor: string;
    tertiaryColor?: string;
}

interface GuildMember {
    avatar: string | null;
    avatarDecoration: string | null;
    colorRoleId: string;
    colorString: string;
    colorStrings: ColorStrings;
    communicationDisabledUntil: string;
    flags: number;
    fullProfileLoadedTimestamp: number | undefined;
    guildId: string;
    highestRoleId: string;
    hoistRoleId: string;
    iconRoleId: string;
    isPending: boolean;
    joinedAt: string;
    nick: string;
    premiumSince: string;
    roles: string[];
    unusualDMActivityUntil: string | undefined;
    userId: string;
}

interface Role {
    id: string;
    name: string;
    color: number;
    position: number;
    hoist: boolean;
    mentionable: boolean;
    permissions: string;
}

interface RoleFilterSettings {
    collapsedRoles: { [guildId: string]: { [roleName: string]: boolean } };
    hiddenRoles: { [guildId: string]: { [roleName: string]: boolean } };
}

const DataStore = {
    getSettings(): RoleFilterSettings {
        return Data.load("roleFilters") || {
            collapsedRoles: {},
            hiddenRoles: {}
        };
    },

    saveSettings(settings: RoleFilterSettings) {
        Data.save("roleFilters", settings);
    },

    toggleRoleCollapse(guildId: string, roleName: string): boolean {
        const settings = this.getSettings();
        if (!settings.collapsedRoles?.[guildId]) {
            settings.collapsedRoles[guildId] = {};
        }

        const newState = !settings.collapsedRoles[guildId][roleName];
        settings.collapsedRoles[guildId][roleName] = newState;
        this.saveSettings(settings);
        return newState;
    },

    isRoleCollapsed(guildId: string, roleName: string): boolean {
        const settings = this.getSettings();
        return settings.collapsedRoles[guildId]?.[roleName] || false;
    },

    toggleRoleHidden(guildId: string, roleName: string): boolean {
        const settings = this.getSettings();
        if (!settings.hiddenRoles?.[guildId]) {
            settings.hiddenRoles[guildId] = {};
        }

        const newState = !settings.hiddenRoles[guildId][roleName];
        settings.hiddenRoles[guildId][roleName] = newState;
        this.saveSettings(settings);
        return newState;
    },

    isRoleHidden(guildId: string, roleName: string): boolean {
        const settings = this.getSettings();
        return settings.hiddenRoles?.[guildId]?.[roleName] || false;
    }
};


const UpdateUsers = ({guild_id, name, limit = 100}: { guild_id: string | string[], name: string, limit?: number }) => {
    Socket().send(8, {
        guild_id,
        limit,
        query: name, // it kills the websocket because im not defaulting it.
    })
    return GuildMemberStore.getMembers(guild_id)
}

const ChevronIcon = React.memo(({isExpanded}: { isExpanded: boolean }) => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            marginRight: '4px'
        }}
    >
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
    </svg>
));

const EyeIcon = React.memo(({isVisible}: { isVisible: boolean }) => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{
            opacity: isVisible ? 1 : 0.5,
            marginLeft: '4px'
        }}
    >
        {isVisible ? (
            <path
                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        ) : (
            <path
                d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
        )}
    </svg>
));

const MemberItemComponent = React.memo(({member, user, channel}: {
    member: GuildMember,
    user: any,
    channel: Channel
}) => {
    const [selected, setSelected] = React.useState(false);

    const userData = UseStateFromStores([UserStore, PresenceStore, TypingStore], () => {
        return {
            user: UserStore.getUser(user.id),
            presence: PresenceStore.getStatus(user.id) || 'offline',
            isMobile: PresenceStore.getState().clientStatuses[user.id]?.mobile || false,
            typing: TypingStore.isTyping(channel.id, user.id) || false,
            activities: PresenceStore.getState().presencesForGuilds?.[user.id]?.[channel.guild_id]?.activities || []
        }
    })

    return <div onMouseEnter={() => setSelected(true)} onMouseLeave={() => setSelected(false)}>
        <MemberListItemComponent channel={channel} guildId={channel.guild_id} selected={selected} nick={member.nick}
                                 isMoblie={userData.isMobile} activities={userData.activities}
                                 colorStrings={member?.colorStrings} colorString={member.colorString}
                                 user={userData.user} typing={userData.typing} status={userData.presence}/>
    </div>
}, (prevProps, nextProps) => {
    return prevProps.member.userId === nextProps.member.userId &&
        prevProps.member.nick === nextProps.member.nick &&
        prevProps.channel.id === nextProps.channel.id;
});


const RoleItemComponent = React.memo(({members, role, channel}: {
    members: GuildMember[],
    role: Role,
    channel: Channel
}) => {
    const [settings, setSettings] = React.useState(DataStore.getSettings());

    const membersToRender = React.useMemo(() => {
        const result = [];
        for (let i = 0; i < Math.min(members.length, 50); i++) {
            const member = members[i];
            member && result.push(
                <MemberItemComponent member={member} key={member.userId} nick={member.nick}
                                     user={UserStore.getUser(member.userId)}
                                     channel={channel}/>
            );
        }
        return result;
    }, [members, channel]);

    const isItJustTheAtEveryoneRole = role.name === '@everyone';
    const roleData = GuildRoleStore.getRole(channel.guild_id, role.id);

    return <div key={role.id}>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'var(--text-muted)',
            marginBottom: '8px',
            marginTop: '16px',
            padding: '0 8px',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease'
        }}>
            <h3 style={{
                fontFamily: 'var(--font-primary)',
                fontSize: '14px',
                fontWeight: '400',
                lineHeight: '1.2857142857142858',
                margin: 0,
                display: 'flex',
                gap: '8px',
            }}>
                {roleData?.unicodeEmoji ? <div>{roleData?.unicodeEmoji}</div> : roleData.icon &&
                    <img style={{width: '16px', height: '16px'}}
                         src={`https://cdn.discordapp.com/role-icons/${roleData.id}/${roleData.icon}.webp?size=16&quality=lossless`}/> || null}
                <span>
                    {!isItJustTheAtEveryoneRole ? role.name : "Others"} - {members.length}
                </span>
            </h3>
        </div>
        {!settings.hiddenRoles?.[channel.guild_id]?.[role.id] && membersToRender}
    </div>
}, (prevProps, nextProps) => {
    return prevProps.role.id === nextProps.role.id &&
        prevProps.members.length === nextProps.members.length &&
        prevProps.channel.id === nextProps.channel.id;
});

class InternalStore {
    static stores = new Set();
    static idSymbol = Symbol("id");
    static id = 0;

    static getStore(name) {
        for (const store of InternalStore.stores) {
            if (InternalStore.prototype.getName.call(store) === name) return store;
        }
    }

    static getStoreId(store) {
        return store[InternalStore.idSymbol];
    }

    constructor() {
        this[InternalStore.idSymbol] = InternalStore.id++;
        InternalStore.stores.add(this);
    }

    initialize() {
    }

    static displayName;
    displayName;

    getName() {
        if (this.displayName) return this.displayName;

        const constructor = this.constructor;
        if (constructor.displayName) return constructor.displayName;

        return constructor.name;
    }

    #listeners = new Set();

    addChangeListener(callback) {
        this.#listeners.add(callback);
    }

    removeChangeListener(callback) {
        this.#listeners.delete(callback);
    }

    emit() {
        for (const listener of this.#listeners) {
            listener();
        }
    }

    getClass() {
        return this.constructor;
    }

    getId() {
        return InternalStore.getStoreId(this);
    }
}

class InCommonStore extends InternalStore {
    #request = Webpack.getByKeys("requestMembersById");

    requestMembersById(guildIds, userIds) {
        this.#request.requestMembersById(guildIds, userIds, false);
    }
}

const MemberListComponent = React.memo(({channel}: { channel: Channel }) => {
    const [settings, setSettings] = React.useState(DataStore.getSettings());
    const members = UseStateFromStores([GuildMemberStore], () => GuildMemberStore.getMembers(channel.guild_id));
    const containerRef = React.useRef<HTMLDivElement>(null);
    const ROW_HEIGHT = 42;

    const originalScrollHandler = window.arven.Webpack.getById(941028).exports.TV;

    const handleScroll = React.useCallback(() => {
        if (!containerRef.current) return;

        const {scrollTop: y, clientHeight: height} = containerRef.current;
        console.log(y, height);
        originalScrollHandler({
            guildId: channel.guild_id,
            channelId: channel.id,
            y,
            height,
            rowHeight: ROW_HEIGHT
        });
    }, [channel.guild_id, channel.id]);

    React.useEffect(() => {
        if (containerRef.current) {
            const {clientHeight: height} = containerRef.current;
            originalScrollHandler({
                guildId: channel.guild_id,
                channelId: channel.id,
                y: 0,
                height,
                rowHeight: ROW_HEIGHT
            });
        }
    }, [channel.guild_id, channel.id]);

    const roleGroups = React.useMemo(() => {
        let groups = {};

        for (let index = 0; index < members.length; index++) {
            const member: GuildMember = members[index];
            const roleId = member.hoistRoleId || channel.guild_id;
            const role = GuildRoleStore.getRole(channel.guild_id, roleId);

            if (!groups[role.id]) {
                groups[role.id] = {
                    role: role,
                    members: []
                };
            }
            groups[role.id].members.push(member);
        }

        return groups;
    }, [members, channel.guild_id]);

    const sortedRoleGroups = React.useMemo(() => {
        return Object.values(roleGroups).sort((a, b) => b.role.position - a.role.position);
    }, [roleGroups]);

    const reactMembers = React.useMemo(() => {
        const result = [];

        for (let i = 0; i < sortedRoleGroups.length; i++) {
            const roleGroup = sortedRoleGroups[i];
            const memberElements = [];
            const members = roleGroup.members

            for (let i = 0; i < members.length; i++) {
                const member = members[i];
                memberElements.push(member);
            }

            result.push(
                <div key={roleGroup.role.id} className="role-group">
                    <RoleItemComponent members={memberElements} role={roleGroup.role} channel={channel}/>
                </div>
            );
        }

        return result;
    }, [sortedRoleGroups, channel]);

    /* This is probably the most shitty way do to this. */
    return (
        <div className={'container_c8ffbb'}>
            <aside className={'membersWrap_c8ffbb hiddenMembers_c8ffbb'}>
                <div ref={containerRef} onScroll={handleScroll} style={{overflow: 'scroll', paddingRight: '0px'}} className={'members_c8ffbb thin__99f8c scrollerBase__99f8c fade__99f8c'}>
                    <div role={'list'} className={'content__99f8c'} style={{height: '90000px'}}>
                        {reactMembers}
                    </div>
                </div>
            </aside>
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.channel.id === nextProps.channel.id;
});

export default class RoleFilters {
    constructor() {
        this.cachedType = null;
    }

    start() {
        Patcher.after(MemberList, 'Z', (_, [__], res) => {
            const org = res.type;

            if (!this.cachedType) {
                this.cachedType = new Proxy(org, {
                    apply(target, thisArg, args) {
                        const currentProps = args[0];
                        const channel = currentProps.channel;

                        return [<MemberListComponent key={channel.id} channel={channel}/>];
                    }
                });
            }

            res.type = this.cachedType;
        });
    }

    stop() {
        Patcher.unpatchAll();
        this.cachedType = null;
    }
}