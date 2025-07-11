/**
 * @name GuildProfile
 * @author Kaan
 * @version 1.0.5
 * @description Gives every server a profile popout of a guild spanning to Mutual friends, blocked and even emojis!
 */

const {Webpack, Webpack: {Filters}, ContextMenu, DOM, React, Components, UI} = BdApi;
const {useState, useId, useRef, useLayoutEffect, useMemo, useReducer, useEffect} = React

const [
    VoiceIcon,
    ModalRoot,
    openModal,
    SearchIcon,
    VideoIcon,
    LiveStream,
    ServerOwnerIcon,
    ServerOwnerIconClasses,
    InviteData
] = BdApi.Webpack.getBulk(
    {
        filter: BdApi.Webpack.Filters.byStrings('"M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z'),
        searchExports: true
    },
    {filter: BdApi.Webpack.Filters.byStrings('.ImpressionTypes.MODAL,"aria-labelledby":'), searchExports: true},
    {
        filter: BdApi.Webpack.Filters.byStrings('onCloseRequest', 'onCloseCallback', 'instant', 'backdropStyle'),
        searchExports: true
    },
    {
        filter: BdApi.Webpack.Filters.byStrings('"M15.62 17.03a9 9 0 1 1 1.41-1.41l4.68 4.67a1 1 0 0 1-1.42 1.42l-4.67-4.68ZM17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z'),
        searchExports: true
    },
    {
        filter: BdApi.Webpack.Filters.byStrings('"M4 4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-2.12a1 1 0'),
        searchExports: true
    },
    {filter: BdApi.Webpack.Filters.byStrings('dI3q4u'), searchExports: true},
    {
        filter: BdApi.Webpack.Filters.byStrings('"M5 18a1 1 0 0 0-1 1 3 3 0 0 0 3 3h10a3 3 0 0 0 3-3 1 1 0 0 0-1-1H5ZM3.04'),
        searchExports: true
    },
    {filter: BdApi.Webpack.Filters.byKeys('ownerIcon', 'icon')},
    {filter: BdApi.Webpack.Filters.byKeys('GuildTemplateName', 'Info', 'Data')}
);


const FetchModule = Webpack.getMangled('type:"USER_PROFILE_FETCH_START"', {fetchUser: Filters.byStrings("USER_UPDATE", "Promise.resolve")})
const getGuildIconURL = BdApi.Webpack.getByKeys('getGuildIconURL').getGuildIconURL
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
        hidden: new RegExp(`<https?:\/\/[^\s]+>`, 'i'),
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

        return {width, height};
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

const OpenImageModal = Webpack.getByStrings('.shouldHideMediaOptions', 'hasMediaOptions:', 'numMediaItems:', {searchExports: true})
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
const {copyImage} = Webpack.getModule(x => x.copyImage)
const Endpoints = Webpack.getModule(Filters.byKeys("GUILD_EMOJI", "GUILD_EMOJIS"), {searchExports: true});
const PermissionsBits = Webpack.getModule(Filters.byKeys("MANAGE_GUILD_EXPRESSIONS"), {searchExports: true});
const HTTP = Webpack.getModule(m => typeof m === "object" && m.del && m.put, {searchExports: true})
const useStateFromStores = Webpack.getByStrings('useStateFromStores', {searchExports: true})
const copy = (text) => window?.DiscordNative ? DiscordNative.clipboard.copy(text) : navigator.clipboard.writeText(text)

/* From old guild-profile powercord icons. Thanks Marvin :) */
const MarvinIcons = {
    AUTO_MODERATION: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("path", {
            d: "M9 20a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2H0v2h10v-2H9zM7.706 7.293a1 1 0 0 0-1.414 0l-2 2a1 1 0 0 0 0 1.415l6 6a1 1 0 0 0 1.414 0l2-2a1 1 0 0 0 0-1.415zm9.586 2.415a1 1 0 0 0 1.414 0l2-2a1 1 0 0 0 0-1.415l-6-6a1 1 0 0 0-1.414 0l-2 2a1 1 0 0 0 0 1.415zm6.414 8.585-7.834-7.835a.987.987 0 0 0-.166-1.165l-4-4a1 1 0 0 0-1.414 0l-1 1a1 1 0 0 0 0 1.415l4 4A1 1 0 0 0 14 12a.983.983 0 0 0 .458-.127l7.835 7.835z",
            fill: "var(--interactive-normal)"
        })
    })),
    SOUNDBOARD: Webpack.getByStrings('"M14.24 1.03a1 1 0 0 1 .73 1.21l-1 4a1 1 0 0 1-1.94-.48l1-4a1 1 0 0 1 1.21', {searchExports: true}),
    ANIMATED_BANNER: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("path", {
            d: "M12 2.32898L16.767 6.49998H19.8L12.658 0.246982C12.4758 0.0877511 12.242 0 12 0C11.758 0 11.5242 0.0877511 11.342 0.246982L4.2 6.49998H7.233L12 2.32898Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            "fill-rule": "evenodd",
            "clip-rule": "evenodd",
            d: "M2 7.99998C1.46957 7.99998 0.960859 8.2107 0.585786 8.58577C0.210714 8.96084 0 9.46955 0 9.99998V22C0 22.5304 0.210714 23.0391 0.585786 23.4142C0.960859 23.7893 1.46957 24 2 24H22C22.5304 24 23.0391 23.7893 23.4142 23.4142C23.7893 23.0391 24 22.5304 24 22V9.99998C24 9.46955 23.7893 8.96084 23.4142 8.58577C23.0391 8.2107 22.5304 7.99998 22 7.99998H2ZM5 14H9V12H5C4.46975 12.0006 3.9614 12.2115 3.58645 12.5865C3.21151 12.9614 3.0006 13.4698 3 14V18C3.0006 18.5302 3.21151 19.0386 3.58645 19.4135C3.9614 19.7885 4.46975 19.9994 5 20H7C7.53025 19.9994 8.0386 19.7885 8.41355 19.4135C8.78849 19.0386 8.9994 18.5302 9 18V15H6V17H7V18H5V14ZM13 14H14V12H10V14H11V18H10V20H14V18H13V14ZM21 14H17V15H20V17H17V20H15V14C15.0006 13.4698 15.2115 12.9614 15.5865 12.5865C15.9614 12.2115 16.4698 12.0006 17 12H21V14Z",
            fill: "var(--interactive-normal)"
        })]
    })),
    ANIMATED_ICON: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("path", {
            "fill-rule": "evenodd",
            "clip-rule": "evenodd",
            d: "M20 2H4C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H20C20.5304 22 21.0391 21.7893 21.4142 21.4142C21.7893 21.0391 22 20.5304 22 20V4C22 3.46957 21.7893 2.96086 21.4142 2.58579C21.0391 2.21071 20.5304 2 20 2ZM5.77778 10.5H9.33333V9H5.77778C5.30645 9.00045 4.85457 9.15863 4.52129 9.43984C4.18801 9.72105 4.00054 10.1023 4 10.5V13.5C4.00054 13.8977 4.18801 14.279 4.52129 14.5602C4.85457 14.8414 5.30645 14.9995 5.77778 15H7.55556C8.02689 14.9995 8.47876 14.8414 8.81204 14.5602C9.14532 14.279 9.3328 13.8977 9.33333 13.5V11.25H6.66667V12.75H7.55556V13.5H5.77778V10.5ZM12.8889 10.5H13.7778V9H10.2222V10.5H11.1111V13.5H10.2222V15H13.7778V13.5H12.8889V10.5ZM16.4444 10.5H20V9H16.4444C15.9731 9.00045 15.5212 9.15863 15.188 9.43984C14.8547 9.72105 14.6672 10.1023 14.6667 10.5V15H16.4444V12.75H19.1111V11.25H16.4444V10.5Z",
            fill: "var(--interactive-normal)"
        })
    })),
    BANNER: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("path", {
            d: "M12 2.329 16.767 6.5H19.8L12.658.247a1 1 0 0 0-1.316 0L4.2 6.5h3.033zM22 8H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zM5 20l3.5-5 2 2.5L14 12l5 8z",
            fill: "var(--interactive-normal)"
        })
    })),
    BOT_DEVELOPER_EARLY_ACCESS: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("path", {
            d: "M12 2C14.761 2 17 4.238 17 7V9H7V7C7 4.238 9.238 2 12 2ZM10.5 5.5C10.5 6.329 11.172 7 12 7C12.828 7 13.5 6.329 13.5 5.5C13.5 4.671 12.828 4 12 4C11.172 4 10.5 4.671 10.5 5.5ZM23 22H17L19 19V12H17V18C17 18.553 16.552 19 16 19H14L15 22H9L10 19H8C7.448 19 7 18.553 7 18V12H5V19L7 22H1L3 19V12C3 10.896 3.897 10 5 10H19C20.103 10 21 10.896 21 12V19L23 22ZM13 14C13 14.553 13.448 15 14 15C14.552 15 15 14.553 15 14C15 13.447 14.552 13 14 13C13.448 13 13 13.447 13 14Z",
            fill: "var(--interactive-normal)"
        })
    })),
    COMMERCE: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("path", {
            d: "M21.707 13.293L10.707 2.293C10.519 2.105 10.266 2 10 2H3C2.447 2 2 2.447 2 3V10C2 10.266 2.105 10.519 2.293 10.707L13.293 21.707C13.488 21.902 13.744 22 14 22C14.256 22 14.512 21.902 14.707 21.707L21.707 14.707C22.098 14.316 22.098 13.684 21.707 13.293ZM7 9C5.894 9 5 8.104 5 7C5 5.894 5.894 5 7 5C8.104 5 9 5.894 9 7C9 8.104 8.104 9 7 9Z",
            fill: "var(--interactive-normal)"
        })
    })),
    COMMUNITY: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("path", {
            d: "M17 3.353V11h-2v4l-4 2v-4H7v-3l4-2V2.051a10.024 10.024 0 1 0 6 1.3z",
            fill: "var(--interactive-normal)"
        })
    })),
    CREATOR_MONETIZABLE: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("circle", {
            cx: 8,
            cy: 12,
            r: 4,
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M8 17c-4.711 0-8 2.467-8 6v1h16v-1c0-3.533-3.29-6-8-6zM21 5h-2a1 1 0 0 1 0-2h4V1h-2V0h-2v1a3 3 0 0 0 0 6h2a1 1 0 0 1 0 2h-4v2h2v1h2v-1a3 3 0 0 0 0-6z",
            fill: "var(--interactive-normal)"
        })]
    })),
    DISCOVERABLE: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "var(--interactive-normal)",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("path", {
            fill: "var(--interactive-normal)",
            fillRule: "evenodd",
            d: "M8.89443 2.49398C9.2851 1.71263 9.67567 1.05131 10 0.543746C10.3243 1.05131 10.7149 1.71263 11.1056 2.49398C11.5176 3.31803 11.9243 4.26467 12.2545 5.29677H7.74546C8.07574 4.26467 8.4824 3.31803 8.89443 2.49398ZM5.65643 5.29677C6.05385 3.89865 6.58341 2.64387 7.10557 1.59955C7.40668 0.997329 7.70784 0.460103 7.98432 0C4.95392 0.620217 2.42286 2.61118 1.06729 5.29677H5.65643ZM0.315044 7.29677H5.20771C5.07621 8.10166 5 8.93835 5 9.79676C5 10.6552 5.07621 11.4919 5.20771 12.2968H0.315043C0.109382 11.4977 0 10.66 0 9.79677C0 8.93352 0.109382 8.09582 0.315044 7.29677ZM1.06729 14.2968H5.65643C6.05385 15.6949 6.58341 16.9497 7.10557 17.994C7.40669 18.5962 7.70785 19.1334 7.98433 19.5935C4.95392 18.9733 2.42286 16.9824 1.06729 14.2968ZM8.1404 14.2968H7.74547C7.83476 14.5758 7.92964 14.8486 8.0287 15.1144C8.05208 14.8376 8.08955 14.5648 8.1404 14.2968ZM8.80423 12.2968H7.23789C7.08803 11.491 7 10.6531 7 9.79676C7 8.9404 7.08803 8.1025 7.23789 7.29677H12.7621C12.8299 7.66136 12.8851 8.03254 12.9251 8.40904C11.1235 9.15974 9.65532 10.5502 8.80423 12.2968ZM19.9549 8.84115C18.7885 8.17649 17.4386 7.79677 16 7.79677C15.6186 7.79677 15.2435 7.82346 14.8763 7.87507C14.8516 7.6806 14.8235 7.48779 14.7923 7.29677H19.685C19.8138 7.79746 19.9049 8.31333 19.9549 8.84115ZM18.9327 5.29677C17.5771 2.61119 15.0461 0.620224 12.0157 6.22053e-06C12.2922 0.460108 12.5933 0.997332 12.8944 1.59955C13.4166 2.64387 13.9461 3.89865 14.3436 5.29677H18.9327ZM16 11.7968C13.7909 11.7968 12 13.5876 12 15.7968C12 18.0059 13.7909 19.7968 16 19.7968C18.2091 19.7968 20 18.0059 20 15.7968C20 13.5876 18.2091 11.7968 16 11.7968ZM10 15.7968C10 12.4831 12.6863 9.79677 16 9.79677C19.3137 9.79677 22 12.4831 22 15.7968C22 17.0926 21.5892 18.2925 20.8907 19.2733L23.7071 22.0897L22.2929 23.5039L19.4765 20.6875C18.4957 21.386 17.2958 21.7968 16 21.7968C12.6863 21.7968 10 19.1105 10 15.7968Z",
            clipRule: "evenodd"
        })
    })),
    ENABLED_DISCOVERABLE_BEFORE: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("path", {
            d: "M21.8541 20.439L16.4541 15.044C17.7069 13.4316 18.2979 11.4022 18.1069 9.36926C17.9159 7.33629 16.9572 5.45256 15.4261 4.10163C13.8949 2.7507 11.9064 2.03416 9.86552 2.09791C7.8246 2.16166 5.88471 3.00091 4.44085 4.44476C2.997 5.88861 2.15775 7.8285 2.094 9.86943C2.03026 11.9103 2.7468 13.8988 4.09773 15.43C5.44865 16.9611 7.33239 17.9198 9.36535 18.1108C11.3983 18.3018 13.4276 17.7108 15.0401 16.458L20.4401 21.858L21.8541 20.439ZM10.1461 16.146C8.95943 16.146 7.79939 15.7941 6.8127 15.1348C5.826 14.4756 5.05697 13.5385 4.60284 12.4421C4.14872 11.3458 4.0299 10.1394 4.26141 8.97549C4.49292 7.8116 5.06437 6.7425 5.90348 5.90339C6.7426 5.06427 7.81169 4.49283 8.97558 4.26132C10.1395 4.0298 11.3459 4.14862 12.4422 4.60275C13.5386 5.05688 14.4757 5.82591 15.1349 6.81261C15.7942 7.7993 16.1461 8.95934 16.1461 10.146C16.1443 11.7368 15.5115 13.2618 14.3867 14.3866C13.2619 15.5114 11.7369 16.1442 10.1461 16.146V16.146Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M10 7C9.40666 7 8.82664 7.17595 8.33329 7.50559C7.83994 7.83524 7.45543 8.30377 7.22836 8.85195C7.0013 9.40013 6.94189 10.0033 7.05765 10.5853C7.1734 11.1672 7.45912 11.7018 7.87868 12.1213C8.29824 12.5409 8.83279 12.8266 9.41473 12.9424C9.99667 13.0581 10.5999 12.9987 11.1481 12.7716C11.6962 12.5446 12.1648 12.1601 12.4944 11.6667C12.8241 11.1734 13 10.5933 13 10C12.9991 9.20462 12.6828 8.44206 12.1204 7.87964C11.5579 7.31722 10.7954 7.00087 10 7V7ZM10.72 11.14L9.52 10.24C9.48274 10.2121 9.4525 10.1758 9.43167 10.1342C9.41084 10.0925 9.4 10.0466 9.4 10V8.5H10V9.85L11.08 10.66L10.72 11.14Z",
            fill: "var(--interactive-normal)"
        })]
    })),
    EXPOSED_TO_ACTIVITIES_WTP_EXPERIMENT: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("path", {
            "fill-rule": "evenodd",
            "clip-rule": "evenodd",
            d: "M10.5857 19.0709L4.92871 13.4149L12.7074 5.63622C14.1213 4.2217 17.5153 1.39317 21.1923 2.80745C22.6066 6.48373 19.7781 9.87856 18.3639 11.2927L10.5857 19.0709ZM18.064 7.93306C18.064 9.03763 17.1686 9.93306 16.064 9.93306C14.9594 9.93306 14.064 9.03763 14.064 7.93306C14.064 6.82849 14.9594 5.93306 16.064 5.93306C17.1686 5.93306 18.064 6.82849 18.064 7.93306Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M3.41353 16.7844C2.34942 17.8496 2 22 2 22C2 22 6.15121 21.6521 7.21623 20.5869C7.71239 20.0915 7.96634 19.4494 7.99996 18.8004L5.21281 18.7866L5.19825 16C4.54943 16.0336 3.90969 16.2881 3.41353 16.7844Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M9.17143 9.17151H3.51458L1.74683 10.9393L6.34301 11.9999L9.17143 9.17151Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M14.8284 14.8282V20.4851L13.0607 22.2528L12 17.6567L14.8284 14.8282Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M18.8 15.2222H23V14.1111H20.6V13H19.4V14.1111H18.8C18.3226 14.1111 17.8648 14.2867 17.5272 14.5993C17.1896 14.9118 17 15.3358 17 15.7778V16.8889C17 17.3309 17.1896 17.7548 17.5272 18.0674C17.8648 18.38 18.3226 18.5556 18.8 18.5556H21.2C21.3591 18.5556 21.5117 18.6141 21.6243 18.7183C21.7368 18.8225 21.8 18.9638 21.8 19.1111V20.2222C21.8 20.3696 21.7368 20.5109 21.6243 20.6151C21.5117 20.7192 21.3591 20.7778 21.2 20.7778H17V21.8889H19.4V23H20.6V21.8889H21.2C21.6774 21.8889 22.1352 21.7133 22.4728 21.4007C22.8104 21.0882 23 20.6643 23 20.2222V19.1111C23 18.6691 22.8104 18.2452 22.4728 17.9326C22.1352 17.62 21.6774 17.4444 21.2 17.4444H18.8C18.6409 17.4444 18.4883 17.3859 18.3757 17.2817C18.2632 17.1775 18.2 17.0362 18.2 16.8889V15.7778C18.2 15.6304 18.2632 15.4891 18.3757 15.3849C18.4883 15.2808 18.6409 15.2222 18.8 15.2222V15.2222Z",
            fill: "var(--interactive-normal)"
        })]
    })),
    FEATURABLE: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("path", {
            d: "M22 6.5v-3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1v10H2v2h9v2h2v-2h9v-2h-1v-10a1 1 0 0 0 1-1zm-3 10H5v-2h3.465l1.7-2.554a1.039 1.039 0 0 1 1.664 0l1.044 1.566 2.229-4.459a1 1 0 0 1 1.843.132l1.776 5.315H19zm-14-7a2 2 0 1 1 2 2 2 2 0 0 1-2-2zm15-4H4v-1h16z",
            fill: "var(--interactive-normal)"
        })
    })),
    GUILD_HOME_TEST: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("path", {
            d: "M12.4364 1.1678L23.7827 11.4012C24.2271 11.802 23.9443 12.5408 23.3463 12.5408H21.1324V21.6926C21.1324 22.4145 20.5483 23 19.8278 23H15.9139C15.1933 23 14.6093 22.4145 14.6093 21.6926V15.1556H9.39075V21.6926C9.39075 22.4145 8.80664 23 8.08612 23H4.17224C3.4517 23 2.86761 22.4145 2.86761 21.6926V12.5408H0.65363C0.055785 12.5408 -0.227111 11.802 0.217246 11.4012L11.5636 1.1678C11.8117 0.944066 12.1883 0.944066 12.4364 1.1678Z",
            fill: "var(--interactive-normal)"
        })
    })),
    HAD_EARLY_ACTIVITIES_ACCESS: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("path", {
            "fill-rule": "evenodd",
            "clip-rule": "evenodd",
            d: "M10.5857 19.0709L4.92871 13.4149L12.7074 5.63622C14.1213 4.2217 17.5153 1.39317 21.1923 2.80745C22.6066 6.48373 19.7781 9.87856 18.3639 11.2927L10.5857 19.0709ZM18.064 7.93306C18.064 9.03763 17.1686 9.93306 16.064 9.93306C14.9594 9.93306 14.064 9.03763 14.064 7.93306C14.064 6.82849 14.9594 5.93306 16.064 5.93306C17.1686 5.93306 18.064 6.82849 18.064 7.93306Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M3.41353 16.7844C2.34942 17.8496 2 22 2 22C2 22 6.15121 21.6521 7.21623 20.5869C7.71239 20.0915 7.96634 19.4494 7.99996 18.8004L5.21281 18.7866L5.19825 16C4.54943 16.0336 3.90969 16.2881 3.41353 16.7844Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M9.17143 9.17151H3.51458L1.74683 10.9393L6.34301 11.9999L9.17143 9.17151Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M14.8284 14.8282V20.4851L13.0607 22.2528L12 17.6567L14.8284 14.8282Z",
            fill: "var(--interactive-normal)"
        })]
    })),
    HAS_DIRECTORY_ENTRY: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("path", {
            d: "M20 7H12L10.553 5.106C10.214 4.428 9.521 4 8.764 4H3C2.447 4 2 4.447 2 5V19C2 20.104 2.895 21 4 21H20C21.104 21 22 20.104 22 19V9C22 7.896 21.104 7 20 7Z",
            fill: "var(--interactive-normal)"
        })
    })),
    INVITES_DISABLED: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("g", {
            children: [/*#__PURE__*/React.createElement("path", {
                d: "M18.74,9.5H14v2h4.74A1.27,1.27,0,0,1,20,12.76v2.48a1.27,1.27,0,0,1-1.26,1.26H14v2h4.74A3.26,3.26,0,0,0,22,15.24V12.76A3.26,3.26,0,0,0,18.74,9.5Z",
                fill: "var(--interactive-normal)"
            }), /*#__PURE__*/React.createElement("path", {
                d: "M7.9,20.13a1.28,1.28,0,0,1-1.78,0L4.37,18.38a1.27,1.27,0,0,1,0-1.79l3.07-3.06L6,12.11,3,15.18a3.27,3.27,0,0,0,0,4.61L4.7,21.54a3.26,3.26,0,0,0,4.62,0l3.07-3.07L11,17.06Z",
                fill: "var(--interactive-normal)"
            }), /*#__PURE__*/React.createElement("rect", {
                x: 11,
                y: "1.5",
                width: 2,
                height: 5,
                fill: "var(--interactive-normal)"
            }), /*#__PURE__*/React.createElement("rect", {
                x: 3,
                y: "8.5",
                width: 5,
                height: 2,
                fill: "var(--interactive-normal)"
            }), /*#__PURE__*/React.createElement("rect", {
                x: 6,
                y: "3.09",
                width: 2,
                height: "4.83",
                transform: "translate(-1.84 6.56) rotate(-45)",
                fill: "var(--interactive-normal)"
            })]
        })
    })),
    INVITE_SPLASH: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("path", {
            fill: "var(--interactive-normal)",
            d: "M6 4h12v7.134l2-1.143V2H4v7.991l2 1.143V4zm9.266 11H8.734L2 11.152V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8.848z"
        }), /*#__PURE__*/React.createElement("path", {
            fill: "var(--interactive-normal)",
            d: "M9.065 8.666 7 11.978h10L13.274 6l-2.936 4.708-1.273-2.042z"
        })]
    })),
    INTERNAL_EMPLOYEE_ONLY: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("path", {
            d: "M5.92127 6.03529C5.92127 6.03529 6.14242 5.70443 6.23413 5.55786C6.32585 5.41129 5.9967 5.065 5.86899 4.95529C5.74127 4.84558 5.53985 4.90043 5.53985 4.90043C3.9327 5.61272 3.1287 7.07415 3.01899 7.36643C2.90927 7.65872 3.29842 7.97758 3.58556 8.13358C3.71756 8.20558 3.92756 8.04615 4.05699 7.92786L4.1007 7.88329L4.16842 7.81472L4.16927 7.81386L8.54156 12.169L9.13899 11.5715L10.237 10.4735L5.91527 6.04129L5.92127 6.03529Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M16.2505 10.6294L16.4811 10.41L18.5528 12.462C18.5674 12.4749 18.5828 12.48 18.5965 12.48C18.636 12.48 18.6685 12.444 18.6685 12.444C18.6685 12.444 20.9622 10.1683 20.97 10.1606C21.0377 10.0937 20.97 10.0569 20.97 10.0569L19.2008 8.27571L19.1982 8.27829L18.9557 8.04086L19.0911 7.91057L19.3808 7.944L19.326 7.56L19.3988 7.48629L19.29 6.93257C18.912 6.39686 17.8765 5.53886 17.8765 5.53886L17.3348 5.44114L17.28 5.514L16.872 5.45314L16.9114 5.80114L16.9371 5.82686L16.8162 5.94857L16.1477 5.29457C16.1477 5.29457 12.2682 3.18771 12.0617 3.09C11.9451 3.036 11.8594 3 11.7771 3C11.7137 3 11.652 3.02143 11.5808 3.072C11.4162 3.18771 11.5131 3.42086 11.5131 3.42086L13.9251 7.878L14.4077 8.35629L14.2568 8.50714L14.2011 8.56286L13.8154 8.50971L13.8745 8.892L13.7631 9.00343L13.7434 8.98371C13.7254 8.96571 13.7005 8.95629 13.6765 8.95629C13.6525 8.95629 13.6285 8.96571 13.6097 8.98371C13.5728 9.02057 13.5728 9.08057 13.6097 9.11743L13.6294 9.13714L13.5762 9.19114L13.5625 9.17657C13.5437 9.15857 13.5197 9.14914 13.4957 9.14914C13.4708 9.14914 13.4468 9.15857 13.4288 9.17657C13.392 9.21343 13.392 9.27343 13.4288 9.31029L13.4434 9.32486L12.4285 10.3449L12.4054 10.3217C12.3865 10.3037 12.3625 10.2943 12.3385 10.2943C12.3145 10.2943 12.2905 10.3037 12.2717 10.3217C12.2348 10.3586 12.2348 10.4186 12.2717 10.4554L12.2957 10.4786L12.2417 10.5326L12.2237 10.5154C12.2057 10.4966 12.1808 10.4871 12.1577 10.4871C12.1328 10.4871 12.1088 10.4966 12.09 10.5154C12.054 10.5523 12.054 10.6114 12.09 10.6483L12.108 10.6663L11.976 10.8L11.958 10.9697L12.0274 11.0409L12.0257 11.0417L11.9417 11.1274L6.46538 16.6029L6.39424 16.5437L6.1671 16.5763L6.03852 16.7066L6.02995 16.698C6.0111 16.6791 5.9871 16.6697 5.9631 16.6697C5.9391 16.6697 5.91424 16.6791 5.89624 16.698C5.85938 16.7349 5.85938 16.794 5.89624 16.8309L5.90652 16.8411L5.85338 16.896L5.84824 16.8909C5.83024 16.872 5.80538 16.8626 5.78138 16.8626C5.75738 16.8626 5.73338 16.872 5.71452 16.8909C5.67852 16.9277 5.67852 16.9869 5.71452 17.0237L5.72052 17.0306L4.71852 18.0497L4.69795 18.0291C4.6791 18.0103 4.65595 18.0017 4.6311 18.0017C4.6071 18.0017 4.5831 18.0103 4.56424 18.0291C4.52738 18.066 4.52738 18.126 4.56424 18.1629L4.58652 18.1843L4.53338 18.2383L4.5171 18.222C4.49824 18.204 4.47424 18.1946 4.44938 18.1946C4.42624 18.1946 4.40138 18.204 4.38338 18.222C4.34652 18.2589 4.34652 18.3189 4.38338 18.3557L4.40052 18.3737L4.32595 18.45L3.93767 18.3806L3.96681 18.8143L3.84424 18.9394L3.95052 19.524C3.95052 19.524 4.11338 20.0331 4.44852 20.3709C4.77338 20.6983 5.26881 20.8551 5.29024 20.8714L5.84995 20.9691L5.98795 20.8337L6.37367 20.8963L6.31024 20.5149L6.42767 20.4L6.48167 20.454C6.49967 20.472 6.52367 20.4814 6.54767 20.4814C6.57167 20.4814 6.59652 20.472 6.61452 20.454C6.65138 20.4163 6.65138 20.3571 6.61452 20.3203L6.56138 20.2671L6.61624 20.214L6.66252 20.2603C6.68052 20.2791 6.70538 20.2886 6.72938 20.2886C6.75338 20.2886 6.77738 20.2791 6.79624 20.2603C6.8331 20.2234 6.8331 20.1643 6.79624 20.1274L6.75081 20.0811L7.76824 19.0774L7.81281 19.122C7.83081 19.1409 7.85567 19.1494 7.87967 19.1494C7.90367 19.1494 7.92767 19.1409 7.94652 19.122C7.98252 19.0851 7.98252 19.0251 7.94652 18.9883L7.90281 18.9454L7.95681 18.8914L7.99452 18.9291C8.01252 18.9471 8.03652 18.9566 8.06052 18.9566C8.08538 18.9566 8.10938 18.9471 8.12738 18.9291C8.16424 18.8923 8.16424 18.8323 8.12738 18.7954L8.09052 18.7586L8.20452 18.6471L8.24567 18.4029L8.18481 18.342L8.18567 18.3411L8.29624 18.2314L13.7357 12.7903L13.7331 12.7851L13.8394 12.8949L14.01 12.876L14.1634 12.7217L14.1882 12.7466C14.2071 12.7646 14.2311 12.774 14.2551 12.774C14.2791 12.774 14.304 12.7646 14.322 12.7466C14.3588 12.7097 14.3588 12.6497 14.322 12.6129L14.2971 12.588L14.3511 12.5349L14.37 12.5537C14.388 12.5717 14.412 12.5811 14.4368 12.5811C14.4608 12.5811 14.4848 12.5717 14.5028 12.5537C14.5397 12.5169 14.5397 12.4569 14.5028 12.42L14.484 12.4003L15.5005 11.382L15.5271 11.4086C15.5451 11.4266 15.5691 11.436 15.5931 11.436C15.618 11.436 15.642 11.4266 15.66 11.4086C15.6968 11.3717 15.6968 11.3117 15.66 11.2749L15.6334 11.2483L15.6874 11.1943L15.708 11.2157C15.7268 11.2337 15.7508 11.2431 15.7748 11.2431C15.7988 11.2431 15.8228 11.2337 15.8417 11.2157C15.8785 11.178 15.8785 11.1189 15.8417 11.082L15.8211 11.0606L15.9342 10.9474L16.3122 11.0066L16.2505 10.6294Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M17.0057 16.7793L14.5946 14.9519L14.1652 14.5096L12.5015 16.1733L12.9198 16.5728L14.4909 18.929L16.6097 21.2493L19.0518 18.971L17.0057 16.7793Z",
            fill: "var(--interactive-normal)"
        })]
    })),
    MEMBER_PROFILES: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("path", {
            d: "M21 5V3a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v2zM7 2a1 1 0 1 1-1 1 1 1 0 0 1 1-1zM4 2a1 1 0 1 1-1 1 1 1 0 0 1 1-1zM1 6v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6zm3 10a3 3 0 0 1 3-3 2 2 0 1 1 2-2 2 2 0 0 1-2 2 3 3 0 0 1 3 3zm14-2h-6v-2h6zm0-3h-6V9h6z",
            fill: "var(--interactive-normal)"
        })
    })),
    MEMBER_VERIFICATION_GATE_ENABLED: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("path", {
            d: "M20.726 8.42512L18.1179 6.78514L17.1704 6.18665L15.2803 5.02016L14.3383 4.40216L12.2243 3.07118L12.1143 3.02618C12.0142 2.99127 11.9053 2.99127 11.8052 3.02618L11.7502 3.05118L9.61118 4.40216L8.66866 5.02016L6.7796 6.18665L5.83158 6.78514L3.22451 8.42512C3.15612 8.46679 3.09956 8.5253 3.06025 8.59508C3.02095 8.66485 3.0002 8.74354 3 8.82362V19.5315C3.00765 19.6584 3.06346 19.7775 3.15603 19.8646C3.24859 19.9517 3.37092 20.0001 3.49801 20H20.5015C20.6287 20.0002 20.7511 19.9518 20.8438 19.8648C20.9365 19.7777 20.9923 19.6584 21 19.5315V8.82362C20.9949 8.73856 20.9667 8.6565 20.9184 8.58628C20.8701 8.51607 20.8036 8.46035 20.726 8.42512ZM3.94203 19.058V9.08811L5.83208 7.89663V19.058H3.94203V19.058ZM6.77911 19.058V7.30313L8.66916 6.11215V19.073L6.77911 19.058V19.058ZM9.61118 5.51865L11.5012 4.32766V19.0575H9.61118V5.51915V5.51865ZM12.4733 19.058V4.32766L14.3383 5.51865V19.058H12.4733ZM15.3058 19.058V6.09715L17.1959 7.28863V19.058H15.3058ZM20.0325 19.058H18.1179V7.89663L20.008 9.08811L20.033 19.058H20.0325Z",
            fill: "var(--interactive-normal)"
        })
    })),
    NEWS: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("path", {
            d: "M22 7h-3V3a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h18a1 1 0 0 0 .707-.293l2-2A1 1 0 0 0 23 19V8a1 1 0 0 0-1-1zM9 19H3v-2h6zm0-3H3v-2h6zm0-3H3v-2h6zm7 6h-6v-2h6zm0-3h-6v-2h6zm0-3h-6v-2h6zm0-5H3V5h13zm5 10.586-.414.414H19V9h2z",
            fill: "var(--interactive-normal)"
        })
    })),
    NEW_THREAD_PERMISSIONS: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("path", {
            d: "M3 13h12v1.998H3zm0-7h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1zm0 4h12v1.998H3zm0-3h12v1.998H3z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M19 10h3V8h-3a3 3 0 1 0 0 6 1 1 0 0 1 0 2H3v2h16a3 3 0 0 0 0-6 1 1 0 0 1 0-2zm-4 9H3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1z",
            fill: "var(--interactive-normal)"
        })]
    })),
    PREMIUM_TIER_3_OVERRIDE: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("path", {
            d: "M11.9997 2L5.33301 8.66667V15.3333L11.9997 22L18.6663 15.3333V8.66667L11.9997 2ZM16.9997 14.65L11.9997 19.65L6.99967 14.65V9.35L11.9997 4.35L16.9997 9.35V14.65Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M8.66699 10.0501V13.9501L12.0003 17.2835L15.3337 13.9501V10.0501L12.0003 6.7168L8.66699 10.0501Z",
            fill: "var(--interactive-normal)"
        })]
    })),
    PREVIEW_ENABLED: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("path", {
            d: "M12 5C5.648 5 1 12 1 12C1 12 5.648 19 12 19C18.352 19 23 12 23 12C23 12 18.352 5 12 5ZM12 16C9.791 16 8 14.21 8 12C8 9.79 9.791 8 12 8C14.209 8 16 9.79 16 12C16 14.21 14.209 16 12 16Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z",
            fill: "var(--interactive-normal)"
        })]
    })),
    PRIVATE_THREADS: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("path", {
            "fill-rule": "evenodd",
            "clip-rule": "evenodd",
            d: "M22.5563 4.92187V3.92186C22.5563 2.80188 21.5812 1.92188 20.5312 1.92188C19.4813 1.92188 18.5312 2.80188 18.5312 3.92186V4.92187H17.7712C17.6387 4.92187 17.5312 5.02932 17.5312 5.16187V9.68186C17.5312 9.81442 17.6387 9.92186 17.7712 9.92186H23.2913C23.4239 9.92186 23.5312 9.81442 23.5312 9.68186V5.16187C23.5312 5.02932 23.4239 4.92187 23.2913 4.92187H22.5563ZM21.5312 4.92187H19.5312V3.92186C19.5312 3.35045 19.9979 2.92188 20.5312 2.92188C21.0646 2.92188 21.5312 3.35045 21.5312 3.92186V4.92187Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M15.4544 7.00001C15.5869 7.00001 15.6944 7.10746 15.6944 7.24001V8.76C15.6944 8.89255 15.5869 9 15.4544 9H9.42485L8.36486 15H10.5744V17H8.01442L7.37765 20.5874C7.33529 20.8261 7.12778 21 6.88534 21H5.90098C5.58986 21 5.3543 20.719 5.40866 20.4126L6.01442 17H2.60952C2.29889 17 2.06345 16.7198 2.11699 16.4138L2.29199 15.4138C2.33386 15.1746 2.54162 15 2.7845 15H6.36442L7.42442 9H4.01952C3.70889 9 3.47345 8.71978 3.52699 8.4138L3.702 7.41382C3.74386 7.17456 3.95162 7.00001 4.1945 7.00001H7.77442L8.41118 3.41263C8.45354 3.17393 8.66105 3 8.90347 3H9.88783C10.1989 3 10.4345 3.28106 10.3801 3.5874L9.77441 7.00001H15.4544Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M13.4287 12.9609C12.8986 12.9609 12.4688 13.3907 12.4688 13.9209V20.2223C12.4688 20.7525 12.8986 21.1823 13.4287 21.1823H14.3887C14.5213 21.1823 14.6287 21.2897 14.6287 21.4223V23.4608C14.6287 23.6688 14.8753 23.7783 15.0296 23.6388L17.4746 21.43C17.651 21.2705 17.8805 21.1823 18.1182 21.1823H22.5487C23.079 21.1823 23.5087 20.7525 23.5087 20.2223V13.9209C23.5087 13.3907 23.079 12.9609 22.5487 12.9609H13.4287Z",
            fill: "var(--interactive-normal)"
        })]
    })),
    RELAY_ENABLED: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("path", {
            d: "M18.3227 3.14757C14.126 -1.04919 7.34433 -1.04919 3.14757 3.14757C-1.04919 7.34433 -1.04919 14.126 3.14757 18.3227C3.33101 18.5062 3.57981 18.6092 3.83923 18.6092C4.09865 18.6092 4.34744 18.5062 4.53088 18.3227L10.4151 12.4385L12.6579 14.6813L14.7792 12.56L12.5364 10.3172L18.3227 4.53088C18.7047 4.14889 18.7047 3.52956 18.3227 3.14757ZM11.7622 21.424C17.1766 21.424 21.5219 17.0788 21.5219 11.6644H23.5219C23.5219 18.1834 18.2812 23.424 11.7622 23.424V21.424ZM11.7622 17.5114C15.0247 17.5114 17.6093 14.9269 17.6093 11.6644H19.6093C19.6093 16.0314 16.1293 19.5114 11.7622 19.5114V17.5114Z",
            fill: "var(--interactive-normal)"
        })
    })),
    ROLE_ICONS: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("path", {
            d: "M12 14C7.289 14 4 16.467 4 20V22H20V20C20 16.467 16.711 14 12 14ZM11 19C10.447 19 10 18.553 10 18C10 17.447 10.447 17 11 17C11.553 17 12 17.447 12 18C12 18.553 11.553 19 11 19ZM14 19C13.447 19 13 18.553 13 18C13 17.447 13.447 17 14 17C14.553 17 15 17.447 15 18C15 18.553 14.553 19 14 19Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M18 6H17.91C17.432 3.167 14.967 1 12 1C9.033 1 6.568 3.167 6.09 6H6C4.896 6 4 6.896 4 8V9C4 10.104 4.896 11 6 11C6 12.102 6.897 13 8 13H16C17.104 13 18 12.102 18 11C19.104 11 20 10.104 20 9V8C20 6.896 19.104 6 18 6ZM16 10H8V6H16V10Z",
            fill: "var(--interactive-normal)"
        })]
    })),
    ROLE_SUBSCRIPTIONS_ENABLED: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("path", {
            d: "M23 0H7a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zm-8 8a2 2 0 1 1 2-2 2 2 0 0 1-2 2z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("rect", {
            className: "a",
            x: "-.013",
            y: 15,
            width: "3.5",
            height: 9,
            rx: 1
        }), /*#__PURE__*/React.createElement("path", {
            d: "m4.987 16 5-1.988h2.175a.51.51 0 0 1 .456.738l-1.262 2.524a.51.51 0 0 0 .456.738h8.2a.986.986 0 0 1 .787 1.578l-1.813 3.017A.987.987 0 0 1 18.2 23H4.987z",
            fill: "var(--interactive-normal)"
        })]
    })),
    ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("path", {
            d: "M16.22 5.93a7.985 7.985 0 0 1 3.38 7.637l1.982.268a9.989 9.989 0 0 0-4.516-9.748l.884-1.936-4.221 1.573L15.3 7.94zM9 20.031A7.985 7.985 0 0 1 3.674 12.1l-2-.1a10 10 0 0 0 6.492 9.859l-.853 1.868 4.217-1.573-1.571-4.216zM6.232 5.75h1.5a.75.75 0 1 1 0 1.5H4.411v1.5h1.821V10h1.5V8.75a2.25 2.25 0 0 0 0-4.5h-1.5a.75.75 0 1 1 0-1.5h3.322v-1.5H7.732V0h-1.5v1.25a2.25 2.25 0 1 0 0 4.5zm14.615 11.543-4.293 4.293-1.293-1.293-1.414 1.414 2 2a1 1 0 0 0 1.414 0l5-5z",
            fill: "var(--interactive-normal)"
        })
    })),
    SEVEN_DAY_THREAD_ARCHIVE: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("path", {
            d: "M2.25 8.25H15.75V11.25H2.25V8.25ZM3 12H15V21.75H3V12ZM7.125 14.25C7.02554 14.25 6.93017 14.2895 6.85982 14.3598C6.7895 14.4302 6.75 14.5255 6.75 14.625V15.75H11.25V14.625C11.25 14.5255 11.2105 14.4302 11.1402 14.3598C11.0698 14.2895 10.9745 14.25 10.875 14.25H7.125Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M18.2656 1.94141L16.0664 6.9961H14.875L17.0781 2.22266H14.25V1.30859H18.2656V1.94141Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M18.8633 4.85155C18.8633 4.1927 19.0104 3.66797 19.3047 3.27734C19.6016 2.88672 20.0065 2.69141 20.5195 2.69141C20.931 2.69141 21.2708 2.84506 21.5391 3.15235V0.996094H22.6719V6.9961H21.6523L21.5976 6.54686C21.3164 6.89844 20.9544 7.07422 20.5117 7.07422C20.0143 7.07422 19.6146 6.8789 19.3125 6.48828C19.013 6.09506 18.8633 5.54947 18.8633 4.85155ZM19.9922 4.93358C19.9922 5.32942 20.0612 5.63282 20.1992 5.84376C20.3372 6.0547 20.5378 6.16015 20.8008 6.16015C21.1497 6.16015 21.3958 6.01303 21.5391 5.71874V4.05079C21.3984 3.7565 21.1549 3.60938 20.8086 3.60938C20.2643 3.60938 19.9922 4.05079 19.9922 4.93358Z",
            fill: "var(--interactive-normal)"
        })]
    })),
    TEXT_IN_VOICE_ENABLED: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("path", {
            "fill-rule": "evenodd",
            "clip-rule": "evenodd",
            d: "M15 11.9999C15 12.0006 15 12.0012 15 12.0019C15 12.5529 14.551 13.0019 14 13.0019V15.0019C15.654 15.0019 17 13.6569 17 12.0019C17 12.0012 17 12.0006 17 11.9999H15ZM19 11.9999C19 12.0006 19 12.0012 19 12.0019C19 14.7589 16.757 17.0019 14 17.0019V19.0019C17.86 19.0019 21 15.8629 21 12.0019C21 12.0012 21 12.0006 21 11.9999H19ZM10.293 3.29592C10.579 3.00992 11.009 2.92492 11.383 3.07892C11.757 3.23192 12 3.59892 12 4.00192V20.0019C12 20.4069 11.757 20.7719 11.383 20.9269C11.009 21.0819 10.579 20.9959 10.293 20.7099L6 16.0019H3C2.45 16.0019 2 15.5519 2 15.0019V9.00192C2 8.45292 2.45 8.00192 3 8.00192H6L10.293 3.29592Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M15 3.5363C15 3.24011 15.2336 3 15.5217 3H20.4783C20.7664 3 21 3.24011 21 3.5363V7.05653C21 7.35267 20.7664 7.59283 20.4783 7.59283H18.0703C17.9411 7.59283 17.8165 7.64211 17.7205 7.73116L16.3917 8.96516C16.3079 9.04304 16.1739 8.98186 16.1739 8.86566V7.72691C16.1739 7.65283 16.1155 7.59283 16.0435 7.59283H15.5217C15.2336 7.59283 15 7.35267 15 7.05653V3.5363Z",
            fill: "var(--interactive-normal)"
        })]
    })),
    THREADS_ENABLED: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("path", {
            d: "M5.43309 21C5.35842 21 5.30189 20.9325 5.31494 20.859L5.99991 17H2.14274C2.06819 17 2.01168 16.9327 2.02453 16.8593L2.33253 15.0993C2.34258 15.0419 2.39244 15 2.45074 15H6.34991L7.40991 9H3.55274C3.47819 9 3.42168 8.93274 3.43453 8.85931L3.74253 7.09931C3.75258 7.04189 3.80244 7 3.86074 7H7.75991L8.45234 3.09903C8.46251 3.04174 8.51231 3 8.57049 3H10.3267C10.4014 3 10.4579 3.06746 10.4449 3.14097L9.75991 7H15.7599L16.4523 3.09903C16.4625 3.04174 16.5123 3 16.5705 3H18.3267C18.4014 3 18.4579 3.06746 18.4449 3.14097L17.7599 7H21.6171C21.6916 7 21.7481 7.06725 21.7353 7.14069L21.4273 8.90069C21.4172 8.95811 21.3674 9 21.3091 9H17.4099L17.0495 11.04H15.05L15.4104 9H9.41035L8.35035 15H10.5599V17H7.99991L7.30749 20.901C7.29732 20.9583 7.24752 21 7.18934 21H5.43309Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M13.4399 12.96C12.9097 12.96 12.4799 13.3898 12.4799 13.92V20.2213C12.4799 20.7515 12.9097 21.1813 13.4399 21.1813H14.3999C14.5325 21.1813 14.6399 21.2887 14.6399 21.4213V23.4597C14.6399 23.6677 14.8865 23.7773 15.0408 23.6378L17.4858 21.4289C17.6622 21.2695 17.8916 21.1813 18.1294 21.1813H22.5599C23.0901 21.1813 23.5199 20.7515 23.5199 20.2213V13.92C23.5199 13.3898 23.0901 12.96 22.5599 12.96H13.4399Z",
            fill: "var(--interactive-normal)"
        })]
    })),
    THREADS_ENABLED_TESTING: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("path", {
            d: "M19.336 14.471 2.059 10.42c-.012.2-.029.388-.029.585a9 9 0 0 0 .14 1.533l16.115 3.777a8.993 8.993 0 0 0 1.051-1.844zM4.438 17.118l.719-2.339-2.539-.6a9 9 0 0 0 1.82 2.939zm15.592-6.113c0-.125-.014-.247-.019-.371L3.138 6.68a8.921 8.921 0 0 0-.859 2.252l17.511 4.105a8.954 8.954 0 0 0 .24-2.032zM8.607 15.588l-1.987-.467-.952 3.1a9 9 0 0 0 1.807 1.051zm2.423 4.417c.1 0 .2-.012.294-.015l1.076-3.513-2.331-.546-1.169 3.81a9.01 9.01 0 0 0 2.13.264zM9.007 2.241A8.991 8.991 0 0 0 4.033 5.35l3.75.878zm8.545 2.574-1.06 3.455 3.318.777a8.98 8.98 0 0 0-2.258-4.232zM12.728 2.17a9.052 9.052 0 0 0-1.7-.165c-.131 0-.258.015-.387.019l-1.4 4.547 1.987.466zm2.3 5.756 1.288-4.194a8.948 8.948 0 0 0-2.145-1.152L12.7 7.38z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M20.03 17h-5.4l-.767-.18-.913 2.974A8.887 8.887 0 0 0 15.14 19h4.89a1 1 0 0 1 0 2h-14v2h14a3 3 0 0 0 0-6z",
            fill: "var(--interactive-normal)"
        })]
    })),
    THREE_DAY_THREAD_ARCHIVE: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("path", {
            d: "M2.25 8.25H15.75V11.25H2.25V8.25ZM3 12H15V21.75H3V12ZM7.125 14.25C7.02554 14.25 6.93017 14.2895 6.85982 14.3598C6.7895 14.4302 6.75 14.5255 6.75 14.625V15.75H11.25V14.625C11.25 14.5255 11.2105 14.4302 11.1402 14.3598C11.0698 14.2895 10.9745 14.25 10.875 14.25H7.125Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M15.5352 3.65234H16.1367C16.4232 3.65234 16.6354 3.58073 16.7734 3.4375C16.9115 3.29426 16.9805 3.10416 16.9805 2.86718C16.9805 2.63803 16.9115 2.45964 16.7734 2.33203C16.638 2.20443 16.4505 2.14063 16.2109 2.14063C15.9948 2.14063 15.8138 2.20052 15.668 2.32031C15.5221 2.43751 15.4492 2.59114 15.4492 2.78124H14.3203C14.3203 2.48438 14.3997 2.21875 14.5586 1.98438C14.7201 1.7474 14.944 1.5625 15.2305 1.42969C15.5195 1.29688 15.8372 1.23047 16.1836 1.23047C16.7852 1.23047 17.2565 1.375 17.5977 1.66406C17.9388 1.95052 18.1094 2.34636 18.1094 2.85156C18.1094 3.11198 18.03 3.35155 17.8711 3.57031C17.7122 3.78907 17.5039 3.95702 17.2461 4.07422C17.5664 4.18879 17.8047 4.36068 17.9609 4.58983C18.1198 4.81901 18.1992 5.08985 18.1992 5.40235C18.1992 5.90755 18.0143 6.3125 17.6445 6.61718C17.2773 6.92186 16.7904 7.07422 16.1836 7.07422C15.6159 7.07422 15.151 6.92448 14.7891 6.62501C14.4297 6.32551 14.25 5.92968 14.25 5.43751H15.3789C15.3789 5.65104 15.4583 5.82552 15.6172 5.96093C15.7787 6.09636 15.9766 6.16406 16.2109 6.16406C16.4792 6.16406 16.6888 6.09374 16.8398 5.95313C16.9935 5.8099 17.0703 5.62109 17.0703 5.38673C17.0703 4.81901 16.7578 4.53516 16.1328 4.53516H15.5352V3.65234Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M18.8516 4.85155C18.8516 4.1927 18.9987 3.66797 19.293 3.27734C19.5898 2.88672 19.9948 2.69141 20.5078 2.69141C20.9193 2.69141 21.2591 2.84506 21.5273 3.15235V0.996094H22.6601V6.9961H21.6406L21.5859 6.54686C21.3047 6.89844 20.9427 7.07422 20.5 7.07422C20.0026 7.07422 19.6029 6.8789 19.3008 6.48828C19.0013 6.09506 18.8516 5.54947 18.8516 4.85155ZM19.9805 4.93358C19.9805 5.32942 20.0495 5.63282 20.1875 5.84376C20.3255 6.0547 20.526 6.16015 20.7891 6.16015C21.138 6.16015 21.3841 6.01303 21.5273 5.71874V4.05079C21.3867 3.7565 21.1432 3.60938 20.7969 3.60938C20.2526 3.60938 19.9805 4.05079 19.9805 4.93358Z",
            fill: "var(--interactive-normal)"
        })]
    })),
    VANITY_URL: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("g", {
            children: [/*#__PURE__*/React.createElement("rect", {
                x: 7,
                y: "11.25",
                width: 10,
                height: "1.5",
                fill: "var(--interactive-normal)"
            }), /*#__PURE__*/React.createElement("path", {
                d: "M8,15H4a1,1,0,0,1-1-1V10A1,1,0,0,1,4,9H8a1,1,0,0,1,1,1h2A3,3,0,0,0,8,7H4a3,3,0,0,0-3,3v4a3,3,0,0,0,3,3H8a3,3,0,0,0,3-3H9A1,1,0,0,1,8,15Z",
                fill: "var(--interactive-normal)"
            }), /*#__PURE__*/React.createElement("path", {
                d: "M20,7H16a3,3,0,0,0-3,3h2a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v4a1,1,0,0,1-1,1H16a1,1,0,0,1-1-1H13a3,3,0,0,0,3,3h4a3,3,0,0,0,3-3V10A3,3,0,0,0,20,7Z",
                fill: "var(--interactive-normal)"
            })]
        })
    })),
    VIP_REGIONS: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: [/*#__PURE__*/React.createElement("path", {
            "fill-rule": "evenodd",
            "clip-rule": "evenodd",
            d: "M15 11.9999C15 12.0006 15 12.0012 15 12.0019C15 12.5529 14.551 13.0019 14 13.0019V15.0019C15.654 15.0019 17 13.6569 17 12.0019C17 12.0012 17 12.0006 17 11.9999H15ZM19 11.9999C19 12.0006 19 12.0012 19 12.0019C19 14.7589 16.757 17.0019 14 17.0019V19.0019C17.86 19.0019 21 15.8629 21 12.0019C21 12.0012 21 12.0006 21 11.9999H19ZM10.293 3.29592C10.579 3.00992 11.009 2.92492 11.383 3.07892C11.757 3.23192 12 3.59892 12 4.00192V20.0019C12 20.4069 11.757 20.7719 11.383 20.9269C11.009 21.0819 10.579 20.9959 10.293 20.7099L6 16.0019H3C2.45 16.0019 2 15.5519 2 15.0019V9.00192C2 8.45292 2.45 8.00192 3 8.00192H6L10.293 3.29592Z",
            fill: "var(--interactive-normal)"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M20.9773 4.97598C20.9546 4.92105 20.9162 4.87411 20.8668 4.84109C20.8175 4.80806 20.7595 4.79045 20.7001 4.79046H19.0855L18.27 3.15233C18.2423 3.10587 18.2029 3.06742 18.1559 3.04073C18.1089 3.01403 18.0557 3 18.0017 3C17.9476 3 17.8945 3.01403 17.8475 3.04073C17.8005 3.06742 17.7611 3.10587 17.7333 3.15233L16.9146 4.79046H15.2999C15.2406 4.79047 15.1826 4.80812 15.1333 4.84116C15.084 4.8742 15.0455 4.92115 15.0228 4.97609C15.0001 5.03102 14.9942 5.09147 15.0058 5.14979C15.0173 5.20811 15.0459 5.26168 15.0878 5.30373L16.4631 6.68207L15.9117 8.61668C15.8948 8.67585 15.8964 8.73879 15.9164 8.79699C15.9363 8.85519 15.9736 8.90586 16.0232 8.94215C16.0728 8.97844 16.1323 8.99861 16.1937 8.99993C16.2551 9.00125 16.3154 8.98366 16.3665 8.94954L18 7.85745L19.6339 8.94894C19.685 8.98295 19.7453 9.00045 19.8066 8.99908C19.8679 8.9977 19.9274 8.97752 19.9769 8.94125C20.0264 8.90497 20.0637 8.85436 20.0836 8.79622C20.1035 8.73808 20.1052 8.67521 20.0884 8.61608L19.537 6.68147L20.9122 5.30313C20.9541 5.26113 20.9826 5.20765 20.9942 5.14944C21.0058 5.09122 20.9999 5.03087 20.9773 4.97598V4.97598Z",
            fill: "var(--interactive-normal)"
        })]
    })),
    WELCOME_SCREEN_ENABLED: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("path", {
            d: "M20 8h-.63l-6.719-5.759a1 1 0 0 0-1.3 0L4.63 8H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-8-3.682L16.3 8H7.7zM16 12v2H8v-2zm2 6H6v-2h12z",
            fill: "var(--interactive-normal)"
        })
    })),
    // Placeholder for unknown features
    UNKNOWN: React.memo(props => /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/React.createElement("path", {
            d: "M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 16.25A1.25 1.25 0 1 1 13.25 17 1.25 1.25 0 0 1 12 18.25zm1-4.376V15h-2v-3h1a2 2 0 1 0-2-2H8a4 4 0 1 1 5 3.874z",
            fill: "var(--interactive-normal)"
        })
    }))
};

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
    const forceUpdate = useForceUpdate;
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

    get hasFocus() {
        return document.hasFocus();
    }

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
        const state = Object.assign({}, {allowLinks: true}, props.state);

        return markdownWrapper.parse(props.text, state);
    }, [props.text, props.state]);

    return React.createElement('div', {}, parsed);
}

const GuildSelector = ({data, onClose, props}) => {
    const validGuilds = useMemo(() => {
        const {id} = UserStore.getCurrentUser();
        const isSticker = data.type === 2;
        const isAnimated = "isAnimated" in data ? data.isAnimated : false;

        return Object.values(GuildStore.getGuilds())
            .filter(guild =>
                (PermissionStore.getGuildPermissions({id: guild.id}) & PermissionsBits.CREATE_GUILD_EXPRESSIONS) === PermissionsBits.CREATE_GUILD_EXPRESSIONS
                || guild.ownerId === id
            )
            .filter(guild =>
                isSticker ||
                (guild._emojiMap > (EmojiStore.getGuilds()[guild.id]?.emojis || [])
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

    return React.createElement(ModalRoot, {
            size: "medium",
            className: "bd-gp-guild-selector",
            ...props
        },
        React.createElement("div", {className: "bd-gp-guild-selector-content"},
            React.createElement("h2", {className: "bd-gp-guild-selector-title"},
                `Save ${data.type === 2 ? 'Sticker' : 'Emoji'} to Server`
            ),
            React.createElement("div", {className: "bd-gp-guild-selector-name"},
                React.createElement("input", {
                    type: "text",
                    value: customName,
                    onChange: (e) => setCustomName(e.target.value),
                    placeholder: "Custom name (optional)",
                    className: "bd-gp-search-input"
                })
            ),
            React.createElement("div", {className: "bd-gp-guild-list"},
                validGuilds.map(guild =>
                    React.createElement("div", {
                            key: guild.id,
                            className: `bd-gp-guild-item ${selectedGuild?.id === guild.id ? 'selected' : ''}`,
                            onClick: () => setSelectedGuild(guild)
                        },
                        React.createElement("img", {
                            src: getGuildIconURL({
                                id: guild.id,
                                icon: guild.icon,
                                size: 40,
                                isAnimated: true
                            }),
                            className: "bd-gp-guild-icon",
                            alt: guild.name
                        }),
                        React.createElement("div", {className: "bd-gp-guild-name"}, guild.name)
                    )
                )
            ),
            React.createElement("div", {className: "bd-gp-guild-selector-buttons"},
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

function AboutTab({guild}) {
    return React.createElement(
        "div",
        {className: "bd-gp-emoji-grid"},
        React.createElement(
            Section,
            {heading: "Created At"},
            React.createElement("span", {className: "bd-gp-section"}, dateToNode(snowflakeUtils.extractTimestamp(guild.id)))
        ),
        React.createElement(
            Section,
            {heading: "Joined At"},
            React.createElement("span", {className: "bd-gp-section"}, dateToNode(guild.joinedAt))
        ),
        React.createElement(
            Section,
            {heading: "Verification Level"},
            React.createElement("span", {className: "bd-gp-section"}, guild.verificationLevel)
        ),
        React.createElement(
            Section,
            {heading: "Explicit Media Content Filter"},
            React.createElement("span", {className: "bd-gp-section"}, guild.explicitContentFilter)
        ),
        React.createElement(
            Section,
            {heading: "Server Boost Count"},
            React.createElement("span", {className: "bd-gp-section"}, guild.premiumSubscriberCount)
        ),
        React.createElement(
            Section,
            {heading: "Server Boost Level"},
            React.createElement("span", {className: "bd-gp-section"}, guild.premiumTier)
        ),
        React.createElement(
            Section,
            {heading: "Preferred Locale"},
            React.createElement("span", {className: "bd-gp-section"}, guild.preferredLocale)
        ),
        React.createElement(
            Section,
            {heading: "NSFW Level"},
            React.createElement("span", {className: "bd-gp-section"}, guild.nsfwLevel)
        ),
        guild.vanityURLCode &&
        React.createElement(
            Section,
            {heading: "Vanity URL"},
            React.createElement(Markdown, {text: `https://discord.gg/${guild.vanityURLCode}`})
        )
    );
}

const EmptyState = ({style}) => {
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

function StickersTab({guild}) {
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
        {className: 'bd-gp-emojis-container'},
        React.createElement(
            'div',
            {className: 'bd-gp-emoji-search'},
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
                {className: 'bd-gp-emoji-grid-emojis'},
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
                                            openModal((props) =>
                                                React.createElement(GuildSelector, {
                                                    data: {...sticker, type: 2},
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
                        React.createElement('div', {className: 'bd-gp-emoji-name'}, sticker.name)
                    )
                )
            )
    );
}

function SoundItem({sound, onPlay, onContextMenu}) {
    const username = UserStore.getUser(sound.userId)?.username || 'Unknown';

    const renderEmoji = () => {
        if (sound.emojiId) {
            return React.createElement('img', {
                src: `https://cdn.discordapp.com/emojis/${sound.emojiId}.webp?size=1280`,
                alt: "Sound emoji",
                style: {width: '24px', height: '24px', marginRight: '8px', display: 'inline-block'}
            });
        } else if (sound.emojiName) {
            return React.createElement('span', {
                style: {fontSize: '24px', marginRight: '8px'}
            }, sound.emojiName);
        }
        return null;
    };

    return React.createElement(
        'div',
        {
            className: 'bd-gp-sound-item',
            onClick: onPlay,
            onContextMenu: onContextMenu
        },
        React.createElement(
            'div',
            {className: 'bd-gp-sound-info', style: {display: 'flex', alignItems: 'center'}},
            renderEmoji(),
            React.createElement(
                'div',
                null,
                React.createElement('div', {className: 'bd-gp-sound-name'}, sound.name),
                React.createElement('div', {className: 'bd-gp-sound-user'}, 'Added by ' + username)
            )
        )
    );
}

function SoundsTab({guild}) {
    const [sounds, setSounds] = useState(Sounds.getSounds().get(guild.id));
    const [_sound, setSound] = useState(null);

    if (!sounds?.length) {
        return React.createElement(EmptyState);
    }

    return React.createElement(
        'div',
        {className: 'bd-gp-sounds-container'},
        React.createElement(
            'div',
            {className: 'bd-gp-sounds-grid'},
            sounds.map(sound =>
                React.createElement(
                    SoundItem,
                    {
                        key: sound.id,
                        sound: sound,
                        onPlay: () => {
                            _sound?.pause?.();
                            const newSound = new Audio(GetAudioCDN(sound.soundId));
                            setSound(newSound);
                            newSound.play();
                        },
                        onContextMenu: (e) => {
                            ContextMenu.open(e, ContextMenu.buildMenu([{
                                label: 'Download',
                                action: () => {
                                    downloadURI(GetAudioCDN(sound.soundId), sound.name)
                                }
                            },
                                {
                                    label: 'Copy Link',
                                    action: () => {
                                        copy(GetAudioCDN(sound.soundId))
                                    }
                                }]))
                        }
                    }
                )
            )
        )
    );
}

function EmojiTab({guild}) {
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
        {className: 'bd-gp-emojis-container'},
        React.createElement(
            'div',
            {className: 'bd-gp-emoji-search'},
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
                {className: 'bd-gp-emoji-grid-emojis'},
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
                                            openModal((props) =>
                                                React.createElement(GuildSelector, {
                                                    data: {...emoji, type: 1},
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
                        React.createElement('div', {className: 'bd-gp-emoji-name'}, emoji.name)
                    )
                )
            )
    );
}

function UserItem({userId, guildId}) {
    const user = useStateFromStores([UserStore], () => UserStore.getUser(userId));
    const member = useStateFromStores([GuildMemberStore], () => GuildMemberStore.getMember(guildId, userId));
    const friendNickName = useStateFromStores([RelationshipStore], () => RelationshipStore.isFriend(userId) && RelationshipStore.getNickname(userId));

    const guild = useStateFromStores([GuildStore], () => GuildStore.getGuild(guildId));

    useLayoutEffect(() => {
        if (!user) FetchModule.fetchUser(userId);
        if (!member) inCommonStore.requestMembersById(guildId, userId);
    }, []);

    const hasNickname = useMemo(() => !!friendNickName || !!member?.nick, [user, member]);
    const hasFocus = useInternalStore(focusStore, () => focusStore.hasFocus);
    const randomDefaultAvatar = useMemo(() => getDefaultAvatar(userId), []);

    return React.createElement(
        "div",
        {className: "bd-gp-user", onClick: () => UserModal.openUserProfileModal({userId: user.id, guildId: guildId})},
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
            {className: "bd-gp-user-info"},
            React.createElement(
                "div",
                {className: "bd-gp-user-title"},
                [
                    member?.nick || friendNickName || (user)?.globalName || user?.username || userId,
                    guild.ownerId == userId && React.createElement(Components.Tooltip, {text: "Server Owner"}, (props) => {
                        return React.createElement(ServerOwnerIcon, {
                            ...props,
                            color: 'currentColor',
                            className: ServerOwnerIconClasses.ownerIcon
                        })
                    })
                ]
            ),
            hasNickname &&
            React.createElement(
                "div",
                {className: "bd-gp-user-sub"},
                (user)?.globalName || user?.username || userId
            ),
        ),
    );
}

function FriendsTab({guild}) {
    const ids = inCommonStore.useFriendIds(guild.id);

    return React.createElement(
        "div",
        {className: "bd-gp-users"},
        ids.length
            ? ids.map((userId) =>
                React.createElement(UserItem, {key: userId, userId, guildId: guild.id})
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

function IgnoredTab({guild}) {
    const ids = inCommonStore.useIgnoredIds(guild.id)

    return React.createElement(
        "div",
        {className: "bd-gp-users"},
        ids.length
            ? ids.map((userId) =>
                React.createElement(UserItem, {key: userId, userId, guildId: guild.id})
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

function BlockedTab({guild}) {
    const ids = inCommonStore.useBlockedIds(guild.id);

    return React.createElement(
        "div",
        {className: "bd-gp-users"},
        ids.length
            ? ids.map((userId) =>
                React.createElement(UserItem, {key: userId, userId, guildId: guild.id})
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

function GuildProfile({guildId, transitionState}) {
    const id = useId();
    const [tab, setTab] = useState(Tabs.ABOUT);
    const ref = useRef(null);

    const {guild, features, icon, banner} = useStateFromStores([GuildStore], () => {
        const guild = GuildStore.getGuild(guildId);
        const features = guild.features;
        return {
            guild,
            features,
            icon: getGuildIconURL({
                id: guild.id,
                icon: guild.icon,
                size: 200,
                isAnimated: true
            }),
            banner: guild.banner ? `https://cdn.discordapp.com/banners/${guildId}/${guild.banner}.${guild.banner.startsWith("a_") ? "gif" : "webp"}?size=1280` : null
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
        const {groups} = ChannelMemberStore.getProps(guildId, SelectedChannelStore.getChannelId());
        return groups
            .filter((group) => group.id && group.id !== 'offline')
            .map((group) => group.count)
            .reduce((total, count) => total + count, 0);
    });

    const bannerHeight = useMemo(() => (banner ? 210 : 210), [banner]);

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
        ModalRoot,
        {transitionState, size: "small", hideShadow: true, className: "bd-gp-root"},
        React.createElement(
            "div",
            {className: "bd-gp-modal", style: {"--banner-height": `${bannerHeight}px`}},
            React.createElement(
                "header",
                {"data-has-banner": Boolean(banner).toString()},
                React.createElement(
                    "svg",
                    {viewBox: `0 0 600 ${bannerHeight}`, style: {minHeight: bannerHeight, width: 600}},
                    React.createElement(
                        "mask",
                        {id: `${id}-${guildId}`},
                        React.createElement("rect", {
                            x: 0,
                            y: 0,
                            width: "100%",
                            height: "100%",
                            fill: "var(--interactive-normal)"
                        }),
                        React.createElement("circle", {cx: 84, cy: bannerHeight - 5, r: 68, fill: "currentColor"})
                    ),
                    React.createElement(
                        "foreignObject",
                        {
                            x: "0",
                            y: "0",
                            width: "100%",
                            height: "100%",
                            overflow: "visible",
                            mask: `url(#${id}-${guildId})`
                        },
                        React.createElement("div", {
                            style: bannerStyles,
                            className: "bd-gp-banner",
                            onContextMenu: () => banner && ContextMenu.open(event, ContextMenu.buildMenu([
                                {label: 'Copy Link', action: () => copy(banner)},
                            ]))
                        })
                    )
                ),
                React.createElement(
                    "div",
                    {
                        className: "bd-gp-icon", onContextMenu: (event) => {
                            ContextMenu.open(event, ContextMenu.buildMenu([
                                {label: 'Copy Link', action: () => copy(icon)},
                            ]))
                        }
                    },
                    icon
                        ? React.createElement("img", {src: icon, height: 120, width: 120})
                        : React.createElement("div", null, guild.acronym)
                ),
            ),
            React.createElement(
                "div",
                {className: "bd-gp-body"},
                React.createElement(
                    "div",
                    {className: "bd-gp-info", style: {margin: '10px'}},
                    React.createElement('div', {style: {gap: '10px'}},
                        React.createElement("div", {className: "bd-gp-name"}, guild.name),
                        React.createElement('div', {
                                style: {
                                    display: features.length > 6 ? 'grid' : 'flex',
                                    gap: '5px',
                                    gridTemplateColumns: features.length > 6 ? 'repeat(auto-fill, 14px)' : 'none',
                                    gridAutoRows: '14px',
                                    alignItems: 'center'
                                }
                            },
                            Array.from(features).map(feature => {
                                const Icon = MarvinIcons[feature] ?? MarvinIcons.UNKNOWN;
                                return React.createElement(Components.Tooltip, {text: feature}, (props) => {
                                    return React.createElement(Icon, {
                                        ...props,
                                        width: 14,
                                        height: 14,
                                        style: {color: 'gray', maxWidth: '14px', maxHeight: '14px'}
                                    });
                                });
                            })
                        )
                    ),
                    guild.description && React.createElement('span', {
                        className: 'bd-gp-section',
                        style: {color: 'white'}
                    }, guild.description),
                    React.createElement(
                        "div",
                        {className: "bd-gp-stats", style: {padding: '10px'}},
                        React.createElement(InviteData.Data, {
                            members: Number(memberCount),
                            membersOnline: Number(onlineCount)
                        })
                    )
                ),
                React.createElement(UserItem, {guildId: guild.id, userId: guild.ownerId}),
                React.createElement(
                    "div",
                    {className: "bd-gp-content", "data-tab-id": tab?.toString?.() ?? "fall-back"},
                    React.createElement(
                        "div",
                        {className: "bd-gp-tabs"},
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
                        {className: "bd-gp-page", ref: ref},
                        tab === Tabs.ABOUT
                            ? React.createElement(AboutTab, {guild})
                            : tab === Tabs.FRIENDS
                                ? React.createElement(FriendsTab, {guild})
                                : tab === Tabs.EMOJIS
                                    ? React.createElement(EmojiTab, {guild})
                                    : tab == Tabs.SOUNDS
                                        ? React.createElement(SoundsTab, {guild})
                                        : tab == Tabs.STICKERS ? React.createElement(StickersTab, {guild}) : tab == Tabs.IGNORE ? React.createElement(IgnoredTab, {guild}) : React.createElement(BlockedTab, {guild})
                    )
                )
            )
        )
    );
}

function openGuildProfileModal(guildId) {
    openModal((props) =>
            React.createElement(GuildProfile, {guildId: guildId, ...props}),
        {modalKey: `bd-guild-profile-${guildId}`}
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
  background: var(--background-base-lower-alt);
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
    background: var(--background-base-lower);
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
    background: var(--background-base-lower);
    color: var(--text-normal);
    font-size: 14px;
}

.bd-gp-search-input:focus {
    outline: none;
    background: var(--background-base-lowest);
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
    background: var(--background-base-lowest);
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
  height: 500px;
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
