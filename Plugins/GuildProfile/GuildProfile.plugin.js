/**
 * @name GuildProfile
 * @author Kaan
 * @version 1.0.0
 * @description Gives every server a profile popout of a guild spanning to Mutual friends, blocked and even emojis!
 */

const { Webpack, Webpack: { Filters }, ContextMenu, DOM, React, Components, UI } = BdApi;
const { useState, useId, useRef, useLayoutEffect, useMemo, useReducer, useEffect } = React


const SystemDesign = {
    VoiceIcon: Webpack.getByStrings('"M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z', { searchExports: true }),
    ModalRoot: Webpack.getByRegex(/let{transitionState:.{1,3},children:.{1,3},size:.{1,3}/, { searchExports: true }),
    openModal: Webpack.getByStrings('onCloseRequest', 'onCloseCallback', 'onCloseCallback', 'instant', 'backdropStyle', { searchExports: true }),
    SearchIcon: Webpack.getByStrings('"M15.62 17.03a9 9 0 1 1 1.41-1.41l4.68 4.67a1 1 0 0 1-1.42 1.42l-4.67-4.68ZM17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z', { searchExports: true }),
    VideoIcon: Webpack.getByStrings('"M4 4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-2.12a1 1 0', { searchExports: true }),
    LiveStream: Webpack.getByStrings('dI3q4u'),
    ServerOwnerIcon: Webpack.getByStrings('"M5 18a1 1 0 0 0-1 1 3 3 0 0 0 3 3h10a3 3 0 0 0 3-3 1 1 0 0 0-1-1H5ZM3.04', { searchExports: true }),
    ServerOwnerIconClasses: Webpack.getModule(x => x.ownerIcon && x.icon),
    InviteData: Webpack.getByKeys('GuildTemplateName', 'Info', 'Data'),
};
const ModalClass = Webpack.getModule(m => m.modal && Object.keys(m).length === 1);
const Section = Webpack.getByStrings("cancelAnimationFrame(", "text-xs/semibold", ".useReducedMotion)")
const snowflakeUtils = Webpack.getByKeys('extractTimestamp')
const quantize = Webpack.getMangled('[[0,0,0]]', {
    quantize: Webpack.Filters.byStrings(".getImageData(0,0,")
})

const CONFIG = {
    MEDIA: {
        IMAGE_EXTENSIONS: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'heic', 'heif', 'dng', 'avif', 'ico'],
        VIDEO_EXTENSIONS: ['mp4', 'webm'],
        MAX_WIDTH_RATIO: 0.8,
        MAX_HEIGHT_RATIO: 0.8
    },
    URLS: {
        CDN: "https://cdn.discordapp.com/attachments/",
        MEDIA: "https://media.discordapp.net/attachments/"
    },
    CONSTS: {
        TYPES: {
            IMG: "IMAGE",
            VID: "VIDEO"
        },
        RULES: "embed-images"
    },
}

const Utils = {
    regex: {
        url: new RegExp(`^<?https?:\\/\\/[^\\s]+\\.(${CONFIG.MEDIA.IMAGE_EXTENSIONS.join('|')}).*>?`, 'i'),
        hidden: new RegExp(`<https?:\/\/[^\s]+>`,'i'),
        video: new RegExp(`\\.(${CONFIG.MEDIA.VIDEO_EXTENSIONS.join('|')})$`, 'i')
    },

    shortenUrl(url) {
        const maxLength = 50;
        const regex = /^(https?:\/\/[^\/]+\/)(.*?\/)([^\/\?]+)(\?.*)?$/;
        
        const match = url.match(regex);
        if (match) {
            const domain = match[1];
            const lastPart = match[3];

            const shortened = url.length > maxLength
                ? `${domain}.../${lastPart}`
                : `${domain}${lastPart}`
    
            return shortened;
        }
        return url;
    },

    async getMediaDimensions(src, type = 'image') {
        return new Promise((resolve, reject) => {
            if (type === 'image') {
                const img = new window.Image();
                img.src = src;
                img.onload = () => resolve({ 
                    width: img.naturalWidth, 
                    height: img.naturalHeight 
                });
                img.onerror = reject;
            } else {
                const video = document.createElement('video');
                video.src = src;
                video.onloadedmetadata = () => resolve({
                    width: video.videoWidth,
                    height: video.videoHeight,
                    type: video.canPlayType(src) || 'video/mp4'
                });
                video.onerror = reject;
            }
        });
    },    

    calculateOptimalDimensions(natural, maxRatio) {
        const maxWidth = window.innerWidth * maxRatio;
        const maxHeight = window.innerHeight * maxRatio;
        const aspectRatio = natural.width / natural.height;

        let width = natural.width;
        let height = natural.height;

        if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
        }

        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }

        return { width, height };
    },
};
async function openMediaModal(url) {
    const isVideo = Utils.regex.video.test(url);
    let dimensions, type;

    try {
        dimensions = await Utils.getMediaDimensions(url, isVideo ? 'video' : 'image');
        type = isVideo ? CONFIG.CONSTS.TYPES.VID : CONFIG.CONSTS.TYPES.IMG;
    } catch (error) {
        console.error('Failed to get media dimensions:', error);
        return;
    }

    const imgProps = {
        dimensions,
        original: url,
        animated: type === "gif",
        shouldAnimate: type === "gif"
    }

    const item = {
        url,
        original: url,
        proxyUrl: url.replace(CONFIG.URLS.CDN, CONFIG.URLS.MEDIA),
        srcIsAnimated: false,
        contentScanMetadata: undefined,
        ...imgProps,
        ...dimensions,
        type: "IMAGE"
    };

    OpenImageModal({
        className: ModalClass.modal,
        items: [item]
    })
}

const DEFAULT_COLOR = [[0, 0, 0]];

const OpenImageModal = Webpack.getByRegex(/hasMediaOptions:!\w+\.shouldHideMediaOptions/,{searchExports:true});
const GuildMemberCountStore = Webpack.getStore("GuildMemberCountStore");
const ChannelMemberStore = Webpack.getStore("ChannelMemberStore");
const GuildMemberStore = Webpack.getStore("GuildMemberStore");
const GuildStore = Webpack.getStore("GuildStore");
const PermissionStore = Webpack.getStore("PermissionStore");
const RelationshipStore = Webpack.getStore("RelationshipStore");
const SelectedChannelStore = Webpack.getStore("SelectedChannelStore");
const UserStore = Webpack.getStore("UserStore");
const EmojiStore = Webpack.getStore('EmojiStore')
const GetAudioCDN = Webpack.getByStrings(`}=window.GLOBAL_ENV;return`)
const StickersStore = Webpack.getStore('StickersStore')
const Sounds = Webpack.getStore('SoundboardStore')
const UserModal = Webpack.getByKeys('openUserProfileModal')
const getDefaultAvatar = (id) => Number(BigInt(id) >> 22n) % 6

const Endpoints = Webpack.getModule(Filters.byProps("GUILD_EMOJI", "GUILD_EMOJIS"), { searchExports: true });
const PermissionsBits = Webpack.getModule(Filters.byProps("MANAGE_GUILD_EXPRESSIONS"), { searchExports: true });
const HTTP = Webpack.getModule(m => typeof m === "object" && m.del && m.put, { searchExports: true })
const useStateFromStores = Webpack.getByStrings('useStateFromStores', { searchExports: true })
const { copy } = DiscordNative.clipboard;

async function fetchBlob(url) {
    const response = await fetch(url);
    return await response.blob();
}

function getUrl(data, fileExt) {
    if (data.type === 2) {
        return `https://media.discordapp.net/stickers/${data.id}.${fileExt}?size=1280&quality=lossless`;
    } else {
        return `https://cdn.discordapp.com/emojis/${data.id}.${data.isAnimated ? 'gif' : 'png'}?size=1280&quality=lossless`;
    }
}

async function cloneSticker(guildId, sticker, customName, fileExt) {
    const data = new FormData();
    const fileData = await fetchBlob(getUrl(sticker, fileExt));
    data.append("name", customName || sticker.name);
    data.append("tags", sticker.tags);
    data.append("description", sticker.description);
    data.append("file", fileData);

    await HTTP.post({
        url: Endpoints.GUILD_STICKER(guildId),
        body: data,
    });
}

async function cloneEmoji(guildId, emoji, customName) {
    const data = await fetchBlob(getUrl(emoji));
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = async () => {
            try {
                await HTTP.post({
                    url: Endpoints.GUILD_EMOJIS(guildId),
                    body: {
                        name: customName || emoji.name,
                        image: reader.result
                    }
                });
                resolve();
            } catch (error) {
                reject(error);
            }
        };
        reader.readAsDataURL(data);
    });
}

async function downloadURI(uri, name) {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = name;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Download failed:", error);
    }
}

function useForceUpdate() {
    return useReducer((num) => num + 1, 0);
}

function useInternalStore(store, factory) {
    const forceUpdate = useForceUpdate();
    const [state, setState] = useState(factory);

    useEffect(() => {
        setState(factory);

        function listener() {
            setState(factory);
            // forceUpdate();
        }

        store.addChangeListener(listener);
        return () => {
            store.removeChangeListener(listener);
        };
    }, []);

    return state;
}

const cache = new Map();

async function getBannerColor(guildIcon) {
    if (!guildIcon) return DEFAULT_COLOR;

    return cache[guildIcon] ??= new Promise((resolve, reject) => {
        let img = new Image();

        img.crossOrigin = "Anonymous",
            img.onerror = e => {
                reject(e);
                img.onerror = img.onload = null,
                    img = null;
            };
        img.onload = () => {
            resolve(quantize.quantize(img, 5, 10));
            img.onerror = img.onload = null,
                img = null;
        };
        img.src = guildIcon;
    });
}

const Tabs = {
    ABOUT: 0,
    FRIENDS: 1,
    SOUNDS: 2,
    EMOJIS: 3,
    STICKERS: 4,
    IGNORE: 5
};

function dateToNode(value, lang) {
    if (null == value || "" === value) return null;
    const data = new Date(value);
    return !(data instanceof Date) || isNaN(data.getTime()) ? null : data.toLocaleDateString(lang, {
        month: "short",
        day: "numeric",
        year: "numeric"
    })
}

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

    initialize() { }

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

    async requestFriendIds(guildId) {
        this.requestMembersById(guildId, RelationshipStore.getFriendIDs());
    }

    useFriendIds(guildId) {
        useLayoutEffect(() => {
            this.requestFriendIds(guildId);
        }, []);

        return useStateFromStores([GuildMemberStore, RelationshipStore], () =>
            GuildMemberStore.getMemberIds(guildId).filter(id => RelationshipStore.isFriend(id))
        );
    }

    async requestBlockedIds(guildId) {
        this.requestMembersById(guildId, RelationshipStore.getBlockedIDs());
    }

    async requestIgnoredIds(guildId) {
        this.requestMembersById(guildId, RelationshipStore.getIgnoredIDs());
    }

    useBlockedIds(guildId) {
        useLayoutEffect(() => {
            this.requestBlockedIds(guildId);
        }, []);

        return useStateFromStores([GuildMemberStore, RelationshipStore], () =>
            GuildMemberStore.getMemberIds(guildId).filter(id => RelationshipStore.isBlocked(id))
        );
    }

    useIgnoredIds(guildId) {
        useLayoutEffect(() => {
            this.requestIgnoredIds(guildId);
        }, []);

        return useStateFromStores([GuildMemberStore, RelationshipStore], () =>
            GuildMemberStore.getMemberIds(guildId).filter(id => RelationshipStore.isIgnored(id))
        );
    }
}

const focusStore = new class FocusStore extends InternalStore {
    constructor() {
        super();

        window.addEventListener("focus", () => this.emit());
        window.addEventListener("blur", () => this.emit());
    }

    get hasFocus() { return document.hasFocus(); }
    useFocus() {
        const [hasFocus, setFocus] = useState(() => document.hasFocus());

        useLayoutEffect(() => {
            function listener() {
                setFocus(document.hasFocus());
            }

            window.addEventListener("focus", listener);
            window.addEventListener("blur", listener)

            return () => {
                window.removeEventListener("focus", listener);
                window.removeEventListener("blur", listener);
            }
        }, []);

        return hasFocus;
    }
}

const inCommonStore = new InCommonStore();

const markdownWrapper = Webpack.getByKeys("parse", "defaultRules", "parseTopic")

function Markdown(props) {
    const parsed = useMemo(() => {
        const state = Object.assign({}, { allowLinks: true }, props.state);

        return markdownWrapper.parse(props.text, state);
    }, [props.text, props.state]);

    return React.createElement('div', {}, parsed);
}

const GuildSelector = ({ data, onClose, props }) => {
    const validGuilds = useMemo(() => {
        const { id } = UserStore.getCurrentUser();
        const isSticker = data.type === 2;
        const isAnimated = "isAnimated" in data ? data.isAnimated : false;

        return Object.values(GuildStore.getGuilds())
            .filter(guild =>
                (PermissionStore.getGuildPermissions({ id: guild.id }) & PermissionsBits.CREATE_GUILD_EXPRESSIONS) === PermissionsBits.CREATE_GUILD_EXPRESSIONS
                || guild.ownerId === id
            )
            .filter(guild =>
                isSticker ||
                (guild.getMaxEmojiSlots() > (EmojiStore.getGuilds()[guild.id]?.emojis || [])
                    .filter(emoji => emoji.animated === isAnimated && !emoji.managed).length)
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [data]);

    const [selectedGuild, setSelectedGuild] = useState(null);
    const [customName, setCustomName] = useState(data.name);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async () => {
        if (!selectedGuild) return;
        setIsUploading(true);

        try {
            if (data.type === 2) {
                await cloneSticker(selectedGuild.id, data, customName, 'png');
                UI.showToast(`Sticker was uploaded to ${selectedGuild.name}`)
            } else {
                await cloneEmoji(selectedGuild.id, data, customName);
                UI.showToast(`Emoji was uploaded to ${selectedGuild.name}`)
            }
            props.onClose();
        } catch (error) {
            UI.showToast(`Emoji/Sticker could not be uploaded to ${selectedGuild.name}`)
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return React.createElement(SystemDesign.ModalRoot, {
        size: "medium",
        className: "bd-gp-guild-selector",
        ...props
    },
        React.createElement("div", { className: "bd-gp-guild-selector-content" },
            React.createElement("h2", { className: "bd-gp-guild-selector-title" },
                `Save ${data.type === 2 ? 'Sticker' : 'Emoji'} to Server`
            ),
            React.createElement("div", { className: "bd-gp-guild-selector-name" },
                React.createElement("input", {
                    type: "text",
                    value: customName,
                    onChange: (e) => setCustomName(e.target.value),
                    placeholder: "Custom name (optional)",
                    className: "bd-gp-search-input"
                })
            ),
            React.createElement("div", { className: "bd-gp-guild-list" },
                validGuilds.map(guild =>
                    React.createElement("div", {
                        key: guild.id,
                        className: `bd-gp-guild-item ${selectedGuild?.id === guild.id ? 'selected' : ''}`,
                        onClick: () => setSelectedGuild(guild)
                    },
                        React.createElement("img", {
                            src: guild.getIconURL(40, true),
                            className: "bd-gp-guild-icon",
                            alt: guild.name
                        }),
                        React.createElement("div", { className: "bd-gp-guild-name" }, guild.name)
                    )
                )
            ),
            React.createElement("div", { className: "bd-gp-guild-selector-buttons" },
                React.createElement(Components.Button, {
                    className: "bd-gp-button cancel",
                    onClick: props.onClose,
                    disabled: isUploading
                }, "Cancel"),
                React.createElement(Components.Button, {
                    className: "bd-gp-button confirm",
                    onClick: handleUpload,
                    disabled: !selectedGuild || isUploading
                }, isUploading ? "Uploading..." : "Save")
            )
        )
    );
};

function AboutTab({ guild }) {
    return React.createElement(
        "div",
        { className: "bd-gp-emoji-grid" },
        React.createElement(
            Section,
            { heading: "Created At" },
            React.createElement("span", { className: "bd-gp-section" }, dateToNode(snowflakeUtils.extractTimestamp(guild.id)))
        ),
        React.createElement(
            Section,
            { heading: "Join At" },
            React.createElement("span", { className: "bd-gp-section" }, dateToNode(guild.joinedAt))
        ),
        React.createElement(
            Section,
            { heading: "Verification Level" },
            React.createElement("span", { className: "bd-gp-section" }, guild.verificationLevel)
        ),
        React.createElement(
            Section,
            { heading: "Explicit Media Content Filter" },
            React.createElement("span", { className: "bd-gp-section" }, guild.explicitContentFilter)
        ),
        React.createElement(
            Section,
            { heading: "Server Boost Count" },
            React.createElement("span", { className: "bd-gp-section" }, guild.premiumSubscriberCount)
        ),
        React.createElement(
            Section,
            { heading: "Server Boost Level" },
            React.createElement("span", { className: "bd-gp-section" }, guild.premiumTier)
        ),
        React.createElement(
            Section,
            { heading: "Preferred Locale" },
            React.createElement("span", { className: "bd-gp-section" }, guild.preferredLocale)
        ),
        React.createElement(
            Section,
            { heading: "NSFW Level" },
            React.createElement("span", { className: "bd-gp-section" }, guild.nsfwLevel)
        ),
        guild.vanityURLCode &&
        React.createElement(
            Section,
            { heading: "Vanity URL" },
            React.createElement(Markdown, { text: `https://discord.gg/${guild.vanityURLCode}` })
        )
    );
}

const EmptyState = ({ style }) => {
    return React.createElement("div", {
        style: {
            flex: "0 1 auto",
            width: 433,
            height: 232,
            backgroundImage: "url(/assets/99ad5845cf7de1c326e2.svg)",
            margin: "auto",
            ...style
        }
    });
};

function StickersTab({ guild }) {
    const [stickers, setStickers] = useState(StickersStore.getAllGuildStickers().get(guild.id));
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStickers = useMemo(() => {
        if (!stickers?.length) return [];
        return stickers.filter(sticker =>
            sticker.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [stickers, searchTerm]);

    return React.createElement(
        'div',
        { className: 'bd-gp-emojis-container' },
        React.createElement(
            'div',
            { className: 'bd-gp-emoji-search' },
            React.createElement('input', {
                type: 'text',
                placeholder: 'Search stickers...',
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: 'bd-gp-search-input'
            })
        ),
        !filteredStickers.length ?
            React.createElement(EmptyState)
            :
            React.createElement(
                'div',
                { className: 'bd-gp-emoji-grid-emojis' },
                filteredStickers.map(sticker =>
                    React.createElement(
                        'div',
                        {
                            key: sticker.id,
                            className: 'bd-gp-emoji-item',
                            title: sticker.name,
                            onClick: () => {
                                openMediaModal(`https://media.discordapp.net/stickers/${sticker.id}.png?size=1280${sticker.isAnimated ? `&passthrough=true` : ""}`)
                            },
                            onContextMenu: (e) => {
                                ContextMenu.open(e, ContextMenu.buildMenu([{
                                    label: 'Download', action: () => {
                                        downloadURI(`https://media.discordapp.net/stickers/${sticker.id}.png?size=1280${sticker.isAnimated ? `&passthrough=true` : ""}`, sticker.name)
                                    }
                                },
                                {
                                    label: 'Save to Guild',
                                    action: () => {
                                        SystemDesign.openModal((props) =>
                                            React.createElement(GuildSelector, {
                                                data: { ...sticker, type: 2 },
                                                props: props
                                            })
                                        );
                                    }
                                },
                                {
                                    label: 'Copy Link',
                                    action: () => {
                                        const link = `https://media.discordapp.net/stickers/${sticker.id}.png?size=1280${sticker.isAnimated}` ? `&passthrough=true` : ""
                                        copy(link)
                                    }
                                }]))
                            }
                        },
                        React.createElement('img', {
                            src: `https://media.discordapp.net/stickers/${sticker.id}.png?size=1280${sticker.isAnimated ? `&passthrough=true` : ""}`,
                            alt: sticker.name,
                            className: 'bd-gp-emoji-image'
                        }),
                        React.createElement('div', { className: 'bd-gp-emoji-name' }, sticker.name)
                    )
                )
            )
    );
}

function SoundsTab({ guild }) {
    const [sounds, setSounds] = useState(Sounds.getSounds().get(guild.id));
    const [_sound, setSound] = useState(null);

    return React.createElement(
        'div',
        { className: 'bd-gp-sounds-container' },
        !sounds?.length ?
            React.createElement(EmptyState)
            :
            React.createElement(
                'div',
                { className: 'bd-gp-sounds-grid' },
                sounds.map(sound =>
                    React.createElement(
                        'div',
                        {
                            key: sound.id,
                            className: 'bd-gp-sound-item',
                            onClick: () => {
                                _sound?.pause?.();
                                const newSound = new Audio(GetAudioCDN(sound.soundId));
                                setSound(newSound)
                                newSound.play();
                            },
                            onContextMenu: (e) => {
                                ContextMenu.open(e, ContextMenu.buildMenu([{
                                    label: 'Download', action: () => {
                                        downloadURI(GetAudioCDN(sound.soundId), sound.name)
                                    }
                                },
                                {
                                    label: 'Copy Link', action: () => {
                                        copy(GetAudioCDN(sound.soundId))
                                    }
                                }]))
                            }
                        },
                        React.createElement(
                            'div',
                            { className: 'bd-gp-sound-info' },
                            React.createElement('div', { className: 'bd-gp-sound-name' }, sound.name),
                            React.createElement('div', { className: 'bd-gp-sound-user' }, 'Added by ' + (UserStore.getUser(sound.userId)?.username || 'Unknown'))
                        )
                    )
                )
            )
    );
}

function EmojiTab({ guild }) {
    const [emojis, setEmojis] = useState(EmojiStore.getGuilds()[guild.id]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEmojis = useMemo(() => {
        if (!emojis?._emojis) return [];
        return emojis._emojis.filter(emoji =>
            emoji.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [emojis, searchTerm]);

    return React.createElement(
        'div',
        { className: 'bd-gp-emojis-container' },
        React.createElement(
            'div',
            { className: 'bd-gp-emoji-search' },
            React.createElement('input', {
                type: 'text',
                placeholder: 'Search emojis...',
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: 'bd-gp-search-input'
            })
        ),
        !filteredEmojis.length ?
            React.createElement(EmptyState)
            :
            React.createElement(
                'div',
                { className: 'bd-gp-emoji-grid-emojis' },
                filteredEmojis.map(emoji =>
                    React.createElement(
                        'div',
                        {
                            key: emoji.id,
                            className: 'bd-gp-emoji-item',
                            title: `:${emoji.name}:`,
                            onClick: () => {
                                openMediaModal(`https://media.discordapp.net/emojis/${emoji.id}.${emoji.animated ? "gif" : `webp`}?size=1280${emoji.animated ? "?animated=true" : `&quality=lossless`}`)
                            },
                            onContextMenu: (e) => {
                                ContextMenu.open(e, ContextMenu.buildMenu([{
                                    label: 'Download', action: () => {
                                        downloadURI(`https://media.discordapp.net/emojis/${emoji.id}.${emoji.animated ? "gif" : `webp`}?size=1280${emoji.animated ? "?animated=true" : `&quality=lossless`}`, emoji.name)
                                    }
                                },
                                {
                                    label: 'Save to Guild',
                                    action: () => {
                                        SystemDesign.openModal((props) =>
                                            React.createElement(GuildSelector, {
                                                data: { ...emoji, type: 1 },
                                                props: props
                                            })
                                        );
                                    }
                                }, {
                                    label: 'Copy Link', action: () => {
                                        const link = `https://media.discordapp.net/emojis/${emoji.id}.${emoji.animated ? "gif" : `webp`}?size=1280${emoji.animated ? "?animated=true" : `&quality=lossless`}`
                                        copy(link)
                                    }
                                }]))
                            }
                        },
                        React.createElement('img', {
                            src: `https://media.discordapp.net/emojis/${emoji.id}.${emoji.animated ? "gif" : `webp`}?size=1280${emoji.animated ? "?animated=true" : `&quality=lossless`}`,
                            alt: emoji.name,
                            className: 'bd-gp-emoji-image'
                        }),
                        React.createElement('div', { className: 'bd-gp-emoji-name' }, emoji.name)
                    )
                )
            )
    );
}

function UserItem({ userId, guildId }) {
    const user = useStateFromStores([UserStore], () => UserStore.getUser(userId));
    const member = useStateFromStores([GuildMemberStore], () => GuildMemberStore.getMember(guildId, userId));
    const friendNickName = useStateFromStores([RelationshipStore], () => RelationshipStore.isFriend(userId) && RelationshipStore.getNickname(userId));

    const guild = useStateFromStores([GuildStore], () => GuildStore.getGuild(guildId));

    useLayoutEffect(() => {
        if (!user) fetchUser(userId);
        if (!member) inCommonStore.requestMembersById(guildId, userId);
    }, []);

    const hasNickname = useMemo(() => !!friendNickName || !!member?.nick, [user, member]);
    const hasFocus = useInternalStore(focusStore, () => focusStore.hasFocus);
    const randomDefaultAvatar = useMemo(() => getDefaultAvatar(userId), []);

    return React.createElement(
        "div",
        { className: "bd-gp-user", onClick: () => UserModal.openUserProfileModal({ userId: user.id, guildId: guildId }) },
        React.createElement(
            "div",
            {
                className: "bd-gp-user-avatar",
                style: {
                    backgroundImage: user ? `url(${user.getAvatarURL(guildId, 60, hasFocus)})` : `url(${randomDefaultAvatar})`
                }
            }
        ),
        React.createElement(
            "div",
            { className: "bd-gp-user-info" },
            React.createElement(
                "div",
                { className: "bd-gp-user-title" },
                [
                    member?.nick || friendNickName || (user)?.globalName || user?.username || userId,
                    guild.ownerId == userId && React.createElement(Components.Tooltip, { text: "Server Owner" }, (props) => {
                        return React.createElement(SystemDesign.ServerOwnerIcon, { ...props, color: 'currentColor', className: SystemDesign.ServerOwnerIconClasses.ownerIcon })
                    })
                ]
            ),
            hasNickname &&
            React.createElement(
                "div",
                { className: "bd-gp-user-sub" },
                (user)?.globalName || user?.username || userId
            ),
        ),
    );
}

function FriendsTab({ guild }) {
    const ids = inCommonStore.useFriendIds(guild.id);

    return React.createElement(
        "div",
        { className: "bd-gp-users" },
        ids.length
            ? ids.map((userId) =>
                React.createElement(UserItem, { key: userId, userId, guildId: guild.id })
            )
            : React.createElement("div", {
                style: {
                    flex: "0 1 auto",
                    width: 433,
                    height: 232,
                    backgroundImage: "url(/assets/99ad5845cf7de1c326e2.svg)",
                    margin: "auto"
                }
            })
    );
}

function IgnoredTab({ guild }) {
    const ids = inCommonStore.useIgnoredIds(guild.id)

    return React.createElement(
        "div",
        { className: "bd-gp-users" },
        ids.length
            ? ids.map((userId) =>
                React.createElement(UserItem, { key: userId, userId, guildId: guild.id })
            )
            : React.createElement("div", {
                style: {
                    flex: "0 1 auto",
                    width: 433,
                    height: 232,
                    backgroundImage: "url(/assets/99ad5845cf7de1c326e2.svg)",
                    margin: "auto"
                }
            })
    );
}

function BlockedTab({ guild }) {
    const ids = inCommonStore.useBlockedIds(guild.id);

    return React.createElement(
        "div",
        { className: "bd-gp-users" },
        ids.length
            ? ids.map((userId) =>
                React.createElement(UserItem, { key: userId, userId, guildId: guild.id })
            )
            : React.createElement("div", {
                style: {
                    flex: "0 1 auto",
                    width: 433,
                    height: 232,
                    backgroundImage: "url(/assets/99ad5845cf7de1c326e2.svg)",
                    margin: "auto"
                }
            })
    );
}

function GuildProfile({ guildId, transitionState }) {
    const id = useId();
    const [tab, setTab] = useState(Tabs.ABOUT);
    const ref = useRef(null);

    const { guild, icon, banner } = useStateFromStores([GuildStore], () => {
        const guild = GuildStore.getGuild(guildId);

        return {
            guild,
            icon: guild.getIconURL(200, true),
            banner: guild.banner ? `https://cdn.discordapp.com/banners/${guildId}/${guild.banner}.${guild.banner.startsWith("a_") ? "gif" : "webp"}?size=480` : null
        }
    });

    const [bannerColor, setBannerColor] = useState(DEFAULT_COLOR[0]);
    useLayoutEffect(() => {
        const controller = new AbortController();

        getBannerColor(icon).then((color) => {
            if (controller.signal.aborted) return;
            setBannerColor(color[0]);
        });

        return () => controller.abort();
    }, [icon]);

    const onlineCount = useStateFromStores([ChannelMemberStore], () => {
        const { groups } = ChannelMemberStore.getProps(guildId, SelectedChannelStore.getChannelId());
        return groups
            .filter((group) => group.id && group.id !== 'offline')
            .map((group) => group.count)
            .reduce((total, count) => total + count, 0);
    });

    const bannerHeight = useMemo(() => (banner ? 338 : 210), [banner]);

    const memberCount = GuildMemberCountStore.getMemberCount(guildId);

    const bannerStyles = useMemo(() => {
        const bannerStyles = {
            backgroundColor: `rgb(${bannerColor.join(", ")})`
        };

        if (banner) {
            bannerStyles.backgroundImage = `url(${banner})`;
        }

        return bannerStyles;
    }, [banner, bannerColor]);

    return React.createElement(
        SystemDesign.ModalRoot,
        { transitionState, size: "small", hideShadow: true, className: "bd-gp-root" },
        React.createElement(
            "div",
            { className: "bd-gp-modal", style: { "--banner-height": `${bannerHeight}px` } },
            React.createElement(
                "header",
                { "data-has-banner": Boolean(banner).toString() },
                React.createElement(
                    "svg",
                    { viewBox: `0 0 600 ${bannerHeight}`, style: { minHeight: bannerHeight, width: 600 } },
                    React.createElement(
                        "mask",
                        { id: `${id}-${guildId}` },
                        React.createElement("rect", { x: 0, y: 0, width: "100%", height: "100%", fill: "white" }),
                        React.createElement("circle", { cx: 84, cy: bannerHeight - 5, r: 68, fill: "black" })
                    ),
                    React.createElement(
                        "foreignObject",
                        { x: "0", y: "0", width: "100%", height: "100%", overflow: "visible", mask: `url(#${id}-${guildId})` },
                        React.createElement("div", { style: bannerStyles, className: "bd-gp-banner" })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "bd-gp-icon" },
                    icon
                        ? React.createElement("img", { src: icon, height: 120, width: 120 })
                        : React.createElement("div", null, guild.acronym)
                )
            ),
            React.createElement(
                "div",
                { className: "bd-gp-body" },
                React.createElement(
                    "div",
                    { className: "bd-gp-info",style: {margin: '10px'}},
                    React.createElement("div", { className: "bd-gp-name", padding: '10px' }, guild.name),
                    guild.description && React.createElement('span',{ className: 'bd-gp-section', style: {color: 'white'}}, guild.description),
                    React.createElement(
                        "div",
                        { className: "bd-gp-stats",style: {padding: '10px'} },
                        React.createElement(SystemDesign.InviteData.Data, { members: Number(memberCount), membersOnline: Number(onlineCount) })
                    )
                ),
                React.createElement(UserItem, { guildId: guild.id, userId: guild.ownerId }),
                React.createElement(
                    "div",
                    { className: "bd-gp-content", "data-tab-id": tab?.toString?.() ?? "fall-back" },
                    React.createElement(
                        "div",
                        { className: "bd-gp-tabs" },
                        React.createElement(
                            "div",
                            {
                                className: "bd-gp-tab",
                                tabIndex: 0,
                                "aria-selected": tab === Tabs.ABOUT,
                                "aria-controls": "about-tab",
                                onClick: () => {
                                    setTab(Tabs.ABOUT);
                                    ref.current?.scrollTo(0, 0);
                                }
                            },
                            "About"
                        ),
                        React.createElement(
                            "div",
                            {
                                className: "bd-gp-tab",
                                tabIndex: 0,
                                "aria-selected": tab === Tabs.FRIENDS,
                                "aria-controls": "friends-tab",
                                onClick: () => {
                                    setTab(Tabs.FRIENDS);
                                    ref.current?.scrollTo(0, 0);
                                }
                            },
                            "Friends"
                        ),
                        React.createElement(
                            "div",
                            {
                                className: "bd-gp-tab",
                                tabIndex: 0,
                                "aria-selected": tab === Tabs.BLOCKED,
                                "aria-controls": "blocked-tab",
                                onClick: () => {
                                    setTab(Tabs.BLOCKED);
                                    ref.current?.scrollTo(0, 0);
                                }
                            },
                            "Blocked"
                        ),
                        React.createElement(
                            "div",
                            {
                                className: "bd-gp-tab",
                                tabIndex: 0,
                                "aria-selected": tab === Tabs.IGNORE,
                                "aria-controls": "sounds-tab",
                                onClick: () => {
                                    setTab(Tabs.IGNORE);
                                    ref.current?.scrollTo(0, 0);
                                }
                            },
                            "Ignored"
                        ),
                        React.createElement(
                            "div",
                            {
                                className: "bd-gp-tab",
                                tabIndex: 0,
                                "aria-selected": tab === Tabs.EMOJIS,
                                "aria-controls": "emoji-tab",
                                onClick: () => {
                                    setTab(Tabs.EMOJIS);
                                    ref.current?.scrollTo(0, 0);
                                }
                            },
                            "Emojis"
                        ),
                        React.createElement(
                            "div",
                            {
                                className: "bd-gp-tab",
                                tabIndex: 0,
                                "aria-selected": tab === Tabs.STICKERS,
                                "aria-controls": "sounds-tab",
                                onClick: () => {
                                    setTab(Tabs.STICKERS);
                                    ref.current?.scrollTo(0, 0);
                                }
                            },
                            "Stickers"
                        ),
                        React.createElement(
                            "div",
                            {
                                className: "bd-gp-tab",
                                tabIndex: 0,
                                "aria-selected": tab === Tabs.SOUNDS,
                                "aria-controls": "sounds-tab",
                                onClick: () => {
                                    setTab(Tabs.SOUNDS);
                                    ref.current?.scrollTo(0, 0);
                                }
                            },
                            "Sounds"
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "bd-gp-page", ref: ref },
                        tab === Tabs.ABOUT
                            ? React.createElement(AboutTab, { guild })
                            : tab === Tabs.FRIENDS
                                ? React.createElement(FriendsTab, { guild })
                                : tab === Tabs.EMOJIS
                                    ? React.createElement(EmojiTab, { guild })
                                    : tab == Tabs.SOUNDS
                                        ? React.createElement(SoundsTab, { guild })
                                        : tab == Tabs.STICKERS ? React.createElement(StickersTab, { guild }) : tab == Tabs.IGNORE ? React.createElement(IgnoredTab, { guild }) : React.createElement(BlockedTab, { guild })
                    )
                )
            )
        )
    );
}

function openGuildProfileModal(guildId) {
    SystemDesign.openModal((props) =>
        React.createElement(GuildProfile, { guildId: guildId, ...props }),
        { modalKey: `bd-guild-profile-${guildId}` }
    );
}

const css = `
.bd-gp-banner {
  height: var(--banner-height);
  min-height: var(--banner-height);
  object-fit: cover;
  background-position: center center;
  background-size: cover;
}

.bd-gp-icon {
  position: absolute;
  left: 84px;
  top: calc(var(--banner-height) - 5px);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  height: 120px;
  width: 120px;
  background: var(--background-secondary-alt);
  background-color: var(--bg-mod-faint);
  align-items: center;
  justify-content: center;
  color: var(--header-primary);
  font-size: 34px;
}

.bd-gp-modal {
  background: var(--bg-surface-overlay);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  border-radius: var(--radius-sm);
  width: var(--custom-user-profile-width-full-size);
  height: var(--custom-user-profile-height-full-size);
}

.bd-gp-body {
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px;
  margin-top: 70px;
  overflow: hidden;
  height: 100%;
}

.bd-gp-sounds-container,
.bd-gp-emojis-container {
    padding: 16px;
    height: 100%;
    overflow-y: auto;
}

.bd-gp-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: var(--text-muted);
}

.bd-gp-empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.bd-gp-empty-text {
    font-size: 16px;
}

.bd-gp-sounds-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.bd-gp-sound-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 4px;
    background: var(--background-secondary);
    cursor: pointer;
}

.bd-gp-sound-item:hover {
    background: var(--background-modifier-hover);
}

.bd-gp-sound-icon {
    margin-right: 12px;
    font-size: 20px;
}

.bd-gp-sound-info {
    flex: 1;
}

.bd-gp-sound-name {
    font-weight: 500;
    color: var(--text-normal);
}

.bd-gp-sound-user {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
}

.bd-gp-emoji-search {
    margin-bottom: 16px;
}

.bd-gp-search-input {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: none;
    background: var(--background-secondary);
    color: var(--text-normal);
    font-size: 14px;
}

.bd-gp-search-input:focus {
    outline: none;
    background: var(--background-tertiary);
}

.bd-gp-emoji-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 16px;
    padding: 8px;
}

.bd-gp-emoji-grid-emojis {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    gap: 16px;
    padding: 8px;
}

.bd-gp-emoji-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 8px;
    cursor: pointer;
    border-radius: 4px;
    background-color: var(--background-modifier-hover);
}

.bd-gp-emoji-item:hover {
    background: var(--background-tertiary);
}

.bd-gp-emoji-image {
    width: 48px;
    height: 48px;
    margin-bottom: 4px;
}

.bd-gp-emoji-name {
    font-size: 12px;
    color: var(--text-muted);
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

.bd-gp-name {
  user-select: text;
  word-break: break-word;
  color: var(--header-primary);
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
}

.bd-gp-content {
  height: 100%;
  background-color: var(--bg-mod-faint);
  border: 1px solid var(--border-faint);

  position: relative;
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.bd-gp-root {
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  width: 600px;
  max-height: none;
}

.bd-gp-tabs {
  display: flex;
  gap: 29px;
  margin: 16px 16px 0;
  border-bottom: 1px solid var(--background-modifier-accent);
  flex-direction: row;
}

.bd-gp-tab {
  border-bottom-width: 1px;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: transparent;
  color: var(--interactive-normal);
  height: 25px;
  box-sizing: border-box;
  position: relative;
  font-size: 16px;
  line-height: 20px;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex-shrink: 0;
}
.bd-gp-tab[aria-selected="true"] {
  border-bottom-color: var(--interactive-active);
  cursor: default;
  color: var(--interactive-active);
}

.bd-gp-user {
  display: flex;
  font-weight: 500;
  align-items: center;
  cursor: pointer;
  line-height: 30px;
  padding: 4px;
  color: var(--text-normal);
  border-radius: 4px;
  margin: 1px 0 1px 8px;
}
.bd-gp-user:hover {
  background-color: var(--background-modifier-hover);
}

.bd-gp-user-avatar {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  flex-shrink: 0;
  position: relative;
  border-radius: 50%;
  background-position: center center;
  background-size: contain;
}

.bd-gp-user-info {
  font-size: 18px;
  line-height: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.bd-gp-user-sub {
  font-size: 14px;
  color: var(--text-muted);
}

.bd-gp-page {
  overflow: hidden scroll;
  padding-right: 0px;
  padding: 12px 0;
  height: 100%;
  width: 100%;
}

.bd-gp-content[data-tab-id="0"] > .bd-gp-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
  position: relative;
  box-sizing: border-box;
  min-height: 0;
  flex: 1 1 auto;
}

.bd-gp-emojis-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.bd-gp-sounds-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.bd-gp-page::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.bd-gp-page::-webkit-scrollbar-corner {
  background-color: transparent;
}
.bd-gp-page::-webkit-scrollbar-thumb {
  background-clip: padding-box;
  border: 2px solid transparent;
  border-radius: 4px;
  background-color: var(--background-modifier-accent);
  min-height: 40px;
}
.bd-gp-page::-webkit-scrollbar-thumb, .bd-gp-page::-webkit-scrollbar-track {
  visibility: hidden;
}
.bd-gp-page:hover::-webkit-scrollbar-thumb, .bd-gp-page:hover::-webkit-scrollbar-track {
  visibility: visible;
}
.bd-gp-page::-webkit-scrollbar-track {
  border: 2px solid var(--scrollbar-thin-track);
  background-color: var(--scrollbar-thin-track);
  border-color: var(--scrollbar-thin-track);
}

.bd-gp-section {
  font-family: var(--font-primary);
  font-size: 14px;
  line-height: 1.2857142857142858;
  font-weight: 400;
  color: var(--text-normal);
}

.bd-gp-content[data-tab-id="0"] .bd-gp-user {
  margin-left: 0;
}

.bd-gp-stats {
  display: flex;
  gap: 10px;
  color: var(--text-normal);
}
.bd-gp-guild-selector-content {
    padding: 16px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.bd-gp-guild-selector-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--header-primary);
}

.bd-gp-guild-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 300px;
    overflow-y: auto;
    padding-right: 8px;
}

.bd-gp-guild-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    gap: 12px;
}

.bd-gp-guild-item:hover {
    background: var(--background-modifier-hover);
}

.bd-gp-guild-item.selected {
    background: var(--background-modifier-selected);
}

.bd-gp-guild-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.bd-gp-guild-name {
    font-size: 16px;
    color: var(--text-normal);
}

.bd-gp-guild-selector-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 8px;
}

.bd-gp-button {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: none;
}

.bd-gp-guild-list::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.bd-gp-guild-list::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    border: 2px solid transparent;
    border-radius: 4px;
    background-color: var(--background-modifier-accent);
    min-height: 40px;
}

.bd-gp-guild-list::-webkit-scrollbar-track {
    border: 2px solid var(--scrollbar-thin-track);
    background-color: var(--scrollbar-thin-track);
    border-color: var(--scrollbar-thin-track);
}  

`

class GuildProfileClass {
    start() {
        DOM.addStyle('guildProfile', css)
        this.unpatch = ContextMenu.patch("guild-context", (props, res) => {
            if (!res.guild) return;
            props.props.children.push(
                ContextMenu.buildItem(
                    {
                        id: "bd-guild-profile",
                        label: "Guild Profile",
                        action: () => openGuildProfileModal(res.guild.id)
                    }
                )
            );
        });
    }

    stop() {
        DOM.removeStyle('guildProfile')
        this.unpatch();
    }
}


module.exports = GuildProfileClass