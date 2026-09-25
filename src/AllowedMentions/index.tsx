/**
 * @name AllowedMentions
 * @author kaan
 * @version 1.0.0
 * @description Allows you to select various mentions like @everyone, @here, users, roles or add flags to the message!
 */

import {BetterDiscord, Buttons, HeaderComponents, MentionSVG, MessageActions, Popout} from "./shared.tsx";
import type {Role, User} from "discord-types/general";

const {ContextMenu, React, Hooks, Webpack, Utils} = BetterDiscord;
const {DraftStore, UserStore, GuildRoleStore, SelectedGuildStore, SelectedChannelStore, MessageStore} = Webpack.Stores;

const ALLOWED_FLAGS = {
    ["Remove Embeds"]: 1 << 2,
    // ["Add Embeds"]: 0,
    // the default flag is 0 with image perms I think?
}

const MENTION_GROUP = "allowedmentions-scope";
const REFERENCE_GROUP = "allowedmentions-reference";

const MENTION_OPTIONS = [
    {id: "everyone", label: "@everyone"},
    {id: "none", label: "None"},
];

type ChannelMentionState = {
    selected: string,
    selectedUsers: Set<string>,
    selectedRoles: Set<string>,
    knownUsers: Set<string>,
    knownRoles: Set<string>,
    selectedFlag: number,
    referenceMessageId: string | null,
    mentionRepliedUser: boolean,
};

const DEFAULT_CHANNEL_STATE: ChannelMentionState = {
    selected: "none",
    selectedUsers: new Set(),
    selectedRoles: new Set(),
    knownUsers: new Set(),
    knownRoles: new Set(),
    selectedFlag: 0,
    referenceMessageId: null,
    mentionRepliedUser: false,
};

const AllowedMentionsStore = new class AllowedMentionsStoreClass extends Utils.Store {
    private channelState: Map<string, ChannelMentionState> = new Map();

    getState(channelId: string): ChannelMentionState {
        return this.channelState.get(channelId) ?? DEFAULT_CHANNEL_STATE;
    }

    private updateState(channelId: string, updates: Partial<ChannelMentionState>) {
        this.channelState.set(channelId, {...this.getState(channelId), ...updates});
        this.emitChange();
    }

    setSelected(channelId: string, selected: string) {
        this.updateState(channelId, {selected});
    }

    toggleUser(channelId: string, userId: string) {
        const state = this.getState(channelId);
        const next = new Set(state.selectedUsers);
        next.has(userId) ? next.delete(userId) : next.add(userId);
        this.updateState(channelId, {selectedUsers: next});
    }

    toggleRole(channelId: string, roleId: string) {
        const state = this.getState(channelId);
        const next = new Set(state.selectedRoles);
        next.has(roleId) ? next.delete(roleId) : next.add(roleId);
        this.updateState(channelId, {selectedRoles: next});
    }

    registerMentions(channelId: string, userIds: string[], roleIds: string[]) {
        const state = this.getState(channelId);
        let changed = false;

        const knownUsers = new Set(state.knownUsers);
        const selectedUsers = new Set(state.selectedUsers);
        for (const userId of userIds) {
            if (!knownUsers.has(userId)) {
                knownUsers.add(userId);
                selectedUsers.add(userId);
                changed = true;
            }
        }

        const knownRoles = new Set(state.knownRoles);
        const selectedRoles = new Set(state.selectedRoles);
        for (const roleId of roleIds) {
            if (!knownRoles.has(roleId)) {
                knownRoles.add(roleId);
                selectedRoles.add(roleId);
                changed = true;
            }
        }

        if (changed) {
            this.updateState(channelId, {knownUsers, selectedUsers, knownRoles, selectedRoles});
        }
    }

    clearChannel(channelId: string) {
        this.channelState.delete(channelId);
        this.emitChange();
    }

    setFlag(channelId: string, flag: number) {
        this.updateState(channelId, {selectedFlag: flag});
    }

    setReferenceMessage(channelId: string, messageId: string | null) {
        this.updateState(channelId, {referenceMessageId: messageId});
    }

    toggleMentionRepliedUser(channelId: string) {
        const state = this.getState(channelId);
        this.updateState(channelId, {mentionRepliedUser: !state.mentionRepliedUser});
    }
}

function extractUserIds(draft: string): string[] {
    return [...draft.matchAll(/<@!?(\d+)>/g)].map(m => m[1]);
}

function extractRoleIds(draft: string): string[] {
    return [...draft.matchAll(/<@&(\d+)>/g)].map(m => m[1]);
}

function getAllUsers(draft: string): Record<string, User> {
    const ids = [...new Set(extractUserIds(draft))];
    const users: Record<string, User> = {};

    for (const id of ids) {
        const user = UserStore.getUser(id);
        if (user) users[user.id] = user;
    }

    return users;
}

function getAllRoles(draft: string): Role[] {
    const ids = [...new Set(extractRoleIds(draft))];
    const guildId = SelectedGuildStore.getGuildId();
    if (!guildId) return [];

    const roles = GuildRoleStore.getManyRoles(guildId, ids) ?? {};
    return Object.values(roles).filter(Boolean) as Role[];
}

function getRecentMessages(channelId: string, limit = 10) {
    const list = MessageStore.getMessages(channelId);
    const all = Array.isArray(list) ? list : list?.toArray?.() ?? [];
    return all.slice(-limit).reverse().filter(x => x.author.id != "1" || x.loggingName); // filter out clyde.
}

function truncate(text: string, max = 40) {
    if (!text) return "[no content]";
    return text.length > max ? `${text.slice(0, max)}…` : text;
}

// src="https://cdn.discordapp.com/role-icons/1026534353167208489/e7206437924cca2077c22be864cfe2f3.webp?size=20&quality=lossless"
// vencord image.

function ContextMenuUserWithIcon({user}: { user: User }) {
    return <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
        <img style={{borderRadius: "50%", width: '24px', height: '24px'}}
             src={user.getAvatarURL(SelectedGuildStore.getGuildId() ?? null, 4096)}/>
        <span>{user.username}</span>
    </div>
}

function ContextMenuRoleWithIcon({role}: { role: Role }) {
    return <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
        {role.icon ?
            <img style={{borderRadius: "50%", width: '24px', height: '24px'}}
                 src={`https://cdn.discordapp.com/role-icons/${role.id}/${role.icon}.webp?size=4096&quality=lossless`}/> :
            <div style={{
                width: "18px",
                borderRadius: "1000px",
                height: "18px",
                backgroundColor: role.colorString ?? role.colorStrings.primaryColor
            }}/>}
        <span>{role.name}</span>
    </div>
}

function ContextMenuMessagePreview({message}: { message: any }) {
    const author = UserStore.getUser(message.author?.id);
    return <div style={{display: "flex", flexDirection: "column", gap: "2px"}}>
        <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
            {author && <img style={{borderRadius: "50%", width: '24px', height: '24px'}}
                            src={author.getAvatarURL(SelectedGuildStore.getGuildId() ?? null, 4096)}/>}
            <span style={{fontWeight: 600}}>{author?.username ?? "Unknown"}</span>
        </div>
        <span style={{opacity: 0.7, fontSize: "12px"}}>{truncate(message.content)}</span>
    </div>
}

function CheckMark() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 16 16">
        <path fill="var(--status-online)"
              d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992zm-.92 5.14l.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486z"></path>
    </svg>
}

function FC({id}: { id: string }) {
    const [isShifting, setIsShifting] = React.useState(false);
    // i have some weird idea for this.
    // but it requires ComponentDispatch.. and that SUCKS.

    const ref = React.useRef(null);

    const {
        selected,
        selectedUsers,
        selectedRoles,
        selectedFlag,
        referenceMessageId,
        mentionRepliedUser,
    } = Hooks.useStateFromStores(
        [AllowedMentionsStore],
        () => AllowedMentionsStore.getState(id),
        [id]
    );

    const draft = Hooks.useStateFromStores(
        [DraftStore],
        () => DraftStore.getDraft(id, 0) ?? ""
    );

    const recentMessages = Hooks.useStateFromStores(
        [MessageStore],
        () => getRecentMessages(id),
        [id]
    );

    const users = React.useMemo(() => getAllUsers(draft), [draft]);
    const roles = React.useMemo(() => getAllRoles(draft), [draft]);

    React.useEffect(() => {
        AllowedMentionsStore.registerMentions(
            id,
            Object.keys(users),
            roles.map(role => role.id),
        );
    }, [users, roles, id]);

    return <div ref={ref}>
        <Popout
            targetElementRef={ref}
            position={"top"}
            children={(e) => {
                setIsShifting(e.shiftKey);
                return <div {...e}>
                    <HeaderComponents.Icon icon={() => <MentionSVG/>}/>
                </div>
            }}
            renderPopout={(e) => {
                return <div style={{minWidth: '200px'}} {...e}>
                    <ContextMenu.Menu navId={"dick-cheeze"}>
                        {MENTION_OPTIONS.map(opt => ContextMenu.buildItem({
                            type: "radio",
                            group: MENTION_GROUP,
                            id: opt.id,
                            label: opt.label,
                            checked: selected === opt.id,
                            action: () => AllowedMentionsStore.setSelected(id, opt.id),
                        }))}

                        {Object.values(users).length > 0 ? <ContextMenu.Group label={"Users"}>
                            {Object.values(users).map(user => ContextMenu.buildItem({
                                type: "toggle",
                                group: `allowedmentions-user-${user.id}`,
                                id: user.id,
                                label: () => <ContextMenuUserWithIcon user={user}/>,
                                checked: selectedUsers.has(user.id),
                                action: () => AllowedMentionsStore.toggleUser(id, user.id),
                            }))}
                        </ContextMenu.Group> : null}

                        {roles.length > 0 ? <ContextMenu.Group label={"Roles"}>
                            {roles.map(role => ContextMenu.buildItem({
                                type: "toggle",
                                group: `allowedmentions-role-${role.id}`,
                                id: role.id,
                                label: () => <ContextMenuRoleWithIcon role={role}/>,
                                checked: selectedRoles.has(role.id),
                                action: () => AllowedMentionsStore.toggleRole(id, role.id),
                            }))}
                        </ContextMenu.Group> : null}

                        <ContextMenu.Separator/>
                        {ContextMenu.buildItem({
                            type: "submenu",
                            ...(referenceMessageId && {
                                leadingAccessory: {
                                    type: "icon",
                                    icon: CheckMark
                                }
                            }),
                            label: "Reply to message",
                            children: [
                                ContextMenu.buildItem({
                                    type: "radio",
                                    group: REFERENCE_GROUP,
                                    label: "None",
                                    checked: !referenceMessageId,
                                    action: () => AllowedMentionsStore.setReferenceMessage(id, null),
                                }),
                                ...recentMessages.map(message => ContextMenu.buildItem({
                                    type: "radio",
                                    group: REFERENCE_GROUP,
                                    id: message.id,
                                    label: () => <ContextMenuMessagePreview message={message}/>,
                                    checked: referenceMessageId === message.id,
                                    action: () => AllowedMentionsStore.setReferenceMessage(id, message.id),
                                })),
                            ],
                        })}
                        {referenceMessageId && ContextMenu.buildItem({
                            type: "toggle",
                            label: "Mention on reply",
                            checked: mentionRepliedUser,
                            action: () => AllowedMentionsStore.toggleMentionRepliedUser(id),
                        })}

                        <ContextMenu.Separator/>
                        {Object.entries(ALLOWED_FLAGS).map(([key, value]) => ContextMenu.buildItem({
                            type: "radio",
                            group: `allowedmentions-flags-${value}`,
                            id: value,
                            label: key,
                            checked: (selectedFlag & value) === value && value !== 0,
                            action: () => {
                                AllowedMentionsStore.setFlag(id, selectedFlag ^ value);
                            }
                        }))}
                    </ContextMenu.Menu>
                </div>
            }}
        />
    </div>
}

function buildAllowedMentions(state: ChannelMentionState) {
    const users = Array.from(state.selectedUsers);
    const roles = Array.from(state.selectedRoles);

    const allowedMentions: { parse: string[], users?: string[], roles?: string[], replied_user?: boolean } = {
        parse: state.selected === "everyone" ? ["everyone"] : [],
    };

    if (users.length > 0) allowedMentions.users = users;
    if (roles.length > 0) allowedMentions.roles = roles;
    if (state.referenceMessageId) allowedMentions.replied_user = state.mentionRepliedUser;

    return allowedMentions;
}

export default class Plugin {
    start() {
        BetterDiscord.Patcher.after(Buttons.A, "type", (_, buttonArgs, returnValue) => {
            const [props] = buttonArgs;
            const channelId = props?.channel?.id
            if (!channelId) return returnValue;

            returnValue.props.children.unshift(<FC id={channelId}/>);
        })

        BetterDiscord.Patcher.before(MessageActions, "_sendMessage", (_, args) => {
            const options = args[2];
            if (!options) return;

            const channelId = SelectedChannelStore.getChannelId();
            const state = AllowedMentionsStore.getState(channelId);

            options.allowedMentions = buildAllowedMentions(state);
            options.flags = state.selectedFlag;

            if (state.referenceMessageId) {
                const message = MessageStore.getMessage(channelId, state.referenceMessageId);
                if (message) {
                    options.messageReference = {
                        message_id: message.id,
                        channel_id: message.channel_id ?? channelId,
                        guild_id: SelectedGuildStore.getGuildId() ?? undefined,
                    };
                }
            }
        });
    }

    stop() {
        BetterDiscord.Patcher.unpatchAll();
    }
}