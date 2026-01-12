/**
 * @name MoreDoubleClicks
 * @description Allows you to double-click more areas with modifier keys for different actions.
 * @author Kaan
 * @version 2.0.3
 */
const {Webpack, Utils, Patcher, Data, React, Hooks, Components} = new BdApi("MoreDoubleClicks");
const MessageContent = Webpack.getBySource('VOICE_HANGOUT_INVITE?""')
const EditUtils = Webpack.getModule(x => x.startEditMessageRecord)
const ReplyAction = Webpack.getByStrings('showMentionToggle', 'FOCUS_CHANNEL_TEXT_AREA', {searchExports: true})

const addReaction = Webpack.getByStrings('uaUU/g', {searchExports: true})
// const removeReaction = Webpack.getByStrings('3l9f6u', {searchExports: true})

const Permissions = Webpack.getByKeys('BAN_MEMBERS', {searchExports: true})

const SwitchItem = Webpack.getByStrings('"tooltipText"in')
const Selectable = Webpack.getModule(Webpack.Filters.byStrings('data-mana-component":"select'), {searchExports: true})

const {ChannelStore, UserStore, RawGuildEmojiStore, GuildStore, PermissionStore} = Webpack.Stores
const {useStateFromStores} = Hooks;

const DataStore = new Proxy(
    {},
    {
        get: (_, key) => {
            return Data.load(key);
        },
        set: (_, key, value) => {
            Data.save(key, value);
            return true;
        },
        deleteProperty: (_, key) => {
            Data.delete(key);
        },
    }
);

const MoreDoubleClickStore = new class MDCS extends Utils.Store {
    constructor() {
        super();
        this.deleteKeyPressed = false;
    }

    setSetting(key, value) {
        DataStore.settings = {...DataStore.settings, [key]: value}
        this.emitChange();
    }

    getSetting(key) {
        return DataStore.settings[key]
    }

    settings() {
        return DataStore.settings;
    }

    setDeleteKeyPressed(pressed) {
        this.deleteKeyPressed = pressed;
    }

    isDeleteKeyPressed() {
        return this.deleteKeyPressed;
    }
}

function hasPermission(userId, permission, channelId) {
    if (userId === UserStore.getCurrentUser().id) {
        return PermissionStore.can(permission, channelId);
    }
    return PermissionStore.can(permission, channelId, userId);
}

function StartDoubleClickAction(_, args, ret, event) {
    const message = args[0].message
    const canEdit = message.author.id == UserStore.getCurrentUser().id
    const doubleClickEmoji = MoreDoubleClickStore.getSetting("doubleClickEmoji")
    const textOverride = MoreDoubleClickStore.getSetting("textOverride")

    const selection = window.getSelection();
    if (selection && selection.toString().length > 0 && message.content.includes(selection.toString()) && textOverride) {
        return;
    }

    const shiftAction = MoreDoubleClickStore.getSetting("shiftDoubleClickAction");
    const ctrlAction = MoreDoubleClickStore.getSetting("ctrlDoubleClickAction");
    const delAction = MoreDoubleClickStore.getSetting("delDoubleClickAction");
    const normalAction = MoreDoubleClickStore.getSetting("normalDoubleClickAction");

    let actionToTake = normalAction;

    if (event.shiftKey) {
        actionToTake = shiftAction;
    } else if (event.ctrlKey || event.metaKey) {
        actionToTake = ctrlAction;
    } else if (MoreDoubleClickStore.isDeleteKeyPressed()) {
        actionToTake = delAction;
    }

    if ("DELETE" === actionToTake && (hasPermission(message.author.id, Permissions.MANAGE_MESSAGES, message.channel_id) || canEdit)) {
        return EditUtils.deleteMessage(message.channel_id, message.id)
    }

    if ("EDIT" === actionToTake && canEdit) {
        return EditUtils.startEditMessageRecord(message.channel_id, message, {shiftKey: false});
    }

    if ("REPLY" === actionToTake) {
        return ReplyAction(ChannelStore.getChannel(message.channel_id), message, {shiftKey: false});
    }

    if ('REACT' === actionToTake) {
        return addReaction(
            message.channel_id,
            message.id,
            doubleClickEmoji,
            "Message",
            {
                burst: MoreDoubleClickStore.getSetting("shouldEmojiBurst"),
            }
        )
    }

    if ('NONE' === actionToTake) {
        return;
    }
}

function SettingsPanel() {
    const {
        emoji,
        guild,
        normalAction,
        shiftAction,
        ctrlAction,
        delAction,
        shouldBurst,
        textOverride
    } = useStateFromStores(MoreDoubleClickStore, () => ({
        emoji: MoreDoubleClickStore.getSetting("doubleClickEmoji"),
        guild: MoreDoubleClickStore.getSetting("selectedGuildForReaction"),
        normalAction: MoreDoubleClickStore.getSetting("normalDoubleClickAction"),
        shiftAction: MoreDoubleClickStore.getSetting("shiftDoubleClickAction"),
        ctrlAction: MoreDoubleClickStore.getSetting("ctrlDoubleClickAction"),
        delAction: MoreDoubleClickStore.getSetting("delDoubleClickAction"),
        shouldBurst: MoreDoubleClickStore.getSetting("shouldEmojiBurst"),
        textOverride: MoreDoubleClickStore.getSetting("textOverride")
    }));

    const actionOptions = [
        {label: "None", value: "NONE"},
        {label: "Edit", value: "EDIT"},
        {label: "Reply", value: "REPLY"},
        {label: "React", value: "REACT"},
        {label: "Delete", value: "DELETE"}
    ];

    const setNewEmoji = (emoji) => {
        const newEmoji = {
            id: emoji.id,
            name: emoji.name,
            animated: emoji.animated,
            icon: emoji.id ? `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'webp'}?size=32` : null
        }

        MoreDoubleClickStore.setSetting("doubleClickEmoji", newEmoji);
    }

    return <div style={{minHeight: '500px', padding: '10px'}}>
        <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Normal Double-Click</label>
            <Selectable
                value={normalAction}
                onSelectionChange={(e) => MoreDoubleClickStore.setSetting('normalDoubleClickAction', e)}
                options={actionOptions}
            />
        </div>

        <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Shift + Double-Click</label>
            <Selectable
                value={shiftAction}
                onSelectionChange={(e) => MoreDoubleClickStore.setSetting('shiftDoubleClickAction', e)}
                options={actionOptions}
            />
        </div>

        <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Ctrl/Cmd + Double-Click</label>
            <Selectable
                value={ctrlAction}
                onSelectionChange={(e) => MoreDoubleClickStore.setSetting('ctrlDoubleClickAction', e)}
                options={actionOptions}
            />
        </div>

        <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>DEL + Double-Click</label>
            <Selectable
                value={delAction}
                onSelectionChange={(e) => MoreDoubleClickStore.setSetting('delDoubleClickAction', e)}
                options={actionOptions}
            />
        </div>

        <h3 style={{marginTop: '20px', marginBottom: '10px'}}>Reaction Settings</h3>

        <SwitchItem
            onChange={(v) => MoreDoubleClickStore.setSetting('shouldEmojiBurst', v)}
            title="Enable burst/super reactions"
            note="Use Burst Reaction"
            value={shouldBurst}
        />

        <SwitchItem
            onChange={(v) => MoreDoubleClickStore.setSetting('textOverride', v)}
            title="Override text selects."
            note="Toggles if you want to select text or should actions still execute if text is selected."
            value={textOverride}
        />

        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', marginBottom: '10px'}}>
            <span style={{fontWeight: 'bold'}}>Currently Selected Emoji:</span>
            {emoji?.icon ? (
                <img src={emoji.icon} style={{width: '32px', height: '32px'}}/>
            ) : (
                <span style={{fontSize: '32px'}}>{emoji?.name}</span>
            )}
        </div>

        <div style={{marginBottom: '10px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Select Guild for Emojis</label>
            <Selectable
                onSelectionChange={(e) => {
                    MoreDoubleClickStore.setSetting("selectedGuildForReaction", e)
                }}
                value={GuildStore.getGuild(guild)?.id}
                options={GuildStore.getGuildsArray().map(x => {
                    return {
                        label: <div style={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center'
                        }}>
                            <img
                                src={`https://cdn.discordapp.com/icons/${x.id}/${x.icon}.png?size=32`}
                                style={{width: '20px', height: '20px', borderRadius: '50%'}}
                            />
                            {x.name}
                        </div>,
                        value: x.id
                    }
                })}
            />
        </div>

        <div style={{marginTop: '15px'}}>
            <label style={{display: 'block', marginBottom: '10px', fontWeight: 'bold'}}>Select Emoji</label>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gap: '5px'}}>
                {Object.values(RawGuildEmojiStore.getGuildEmojis(guild)).map(x => {
                    return x?.id ?
                        <img
                            key={x.id}
                            onClick={() => setNewEmoji(x)}
                            src={`https://cdn.discordapp.com/emojis/${x.id}.${x.animated ? 'gif' : 'webp'}?size=80`}
                            style={{width: '40px', height: '40px', cursor: 'pointer', borderRadius: '4px'}}
                            title={x.name}
                        /> :
                        <span
                            key={x.name}
                            onClick={() => setNewEmoji(x)}
                            style={{fontSize: '40px', cursor: 'pointer', textAlign: 'center'}}
                        >
                            {x.name}
                        </span>
                })}
            </div>
        </div>
    </div>
}

export class MoreDoubleClicks {
    load() {
        DataStore.settings = {
            normalDoubleClickAction: "REPLY",
            shiftDoubleClickAction: "EDIT",
            ctrlDoubleClickAction: "REACT",
            delDoubleClickAction: "DELETE",
            selectedGuildForReaction: Object.values(GuildStore.getGuilds())[0].id,
            doubleClickEmoji: {
                "id": null,
                "name": "😭",
                "animated": false
            },
            shouldEmojiBurst: false,
            ...(DataStore.settings || {}),
        }
    }

    start() {
        this.handleKeyDown = (e) => {
            if (e.key === 'Delete') {
                MoreDoubleClickStore.setDeleteKeyPressed(true);
            }
        };

        this.handleKeyUp = (e) => {
            if (e.key === 'Delete') {
                MoreDoubleClickStore.setDeleteKeyPressed(false);
            }
        };

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);

        Patcher.after(MessageContent.ZP, 'type', (_, args, ret) => {
            const originalOnDoubleClick = ret.props.onDoubleClick;

            Object.defineProperty(ret.props, 'onDoubleClick', {
                value: (event) => {
                    StartDoubleClickAction(_, args, ret, event)
                    if (originalOnDoubleClick) originalOnDoubleClick(event);
                },
                configurable: true,
                enumerable: true
            })
        })
    }

    getSettingsPanel() {
        return <SettingsPanel/>
    }

    stop() {
        if (this.handleKeyDown) {
            document.removeEventListener('keydown', this.handleKeyDown);
        }
        if (this.handleKeyUp) {
            document.removeEventListener('keyup', this.handleKeyUp);
        }

        Patcher.unpatchAll()
    }
}