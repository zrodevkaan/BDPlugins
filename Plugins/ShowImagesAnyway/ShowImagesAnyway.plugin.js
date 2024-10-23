/**
 * @name ShowImagesAnyway
 * @author kaan
 * @version 1.0.0
 * @description Enhances Discord's image handling by showing hidden image links with safety controls
 */

const { React, Webpack, DOM } = BdApi;
const { useState, useCallback, useEffect, useRef } = React;

const { openModal } = Webpack.getModule(x => x.openModal);
const SimpleMarkdownWrapper = Webpack.getModule(m => m.defaultRules && m.parse);
const CarouselModal = Webpack.getByStrings(".Messages.MEDIA_VIEWER_MODAL_ALT_TEXT");
const MessageStore = Webpack.getStore("MessageStore");
const SystemDesign = Webpack.getModule(x=>x.Tooltip && x.ModalRoot)

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
    CSS_CLASSES: {
        LAYOUT: {
            CONTAINER: 'sia-container',
            CONTROLS: 'sia-controls',
            MEDIA_CONTAINER: 'sia-media-container',
            CONTAINER_COLLAPSED: 'sia-container-collapsed',
            PREVIEW: 'sia-preview',
            URL_PREVIEW: 'sia-url-preview',
            PREVIEW_ICON: 'sia-preview-icon',
            PREVIEW_TEXT: 'sia-preview-text',
            ICON_URL_CONTAINER: 'sia-icon-url-container'
        },
        MEDIA: {
            IMAGE: 'sia-image',
            IMAGE_SHOWN: 'sia-image-shown',
            IMAGE_HIDDEN: 'sia-image-hidden',
            CUSTOM_IMAGE: 'bd-sia-image'
        },
        OVERLAY: {
            BASE: 'sia-overlay',
            HIDDEN: 'sia-overlay-hidden',
            TEXT: 'sia-overlay-text',
            URL: {
                CONTAINER: 'sia-url-overlay',
                VISIBLE: 'sia-url-overlay-visible',
                LINK: 'sia-url-link'
            }
        },
        SOURCE: {
            TEXT: 'sia-source-text',
            DISCORD: 'sia-discord-source',
            EXTERNAL: 'sia-external-source'
        },
        BUTTONS: {
            MAIN: 'sia-toggle-button',
            SHOW: 'sia-button-show',
            HIDE: 'sia-button-hide'
        },
        MODAL: {
            CAROUSEL: 'bd-sia-carousel-modal'
        }
    }
};
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

    isEmbeddedInMessage(message, url) {
        if (!message?.embeds?.length) return false;
        const cleanUrl = url.replace('\\', '');
        return message.embeds.some(embed => 
            embed.url?.includes(cleanUrl) || 
            embed?.image?.url?.includes(cleanUrl)
        );
    }
};

const Image = React.memo(function Image({ url, shown, onClick, onLoad, onError }) {
    return React.createElement("img", {
        src: url,
        alt: CONFIG.CSS_CLASSES.MEDIA.CUSTOM_IMAGE,
        onClick: onClick,
        onLoad: onLoad,
        onError: onError,
        className: `${CONFIG.CSS_CLASSES.MEDIA.IMAGE} ${shown ? CONFIG.CSS_CLASSES.MEDIA.IMAGE_SHOWN : CONFIG.CSS_CLASSES.MEDIA.IMAGE_HIDDEN}`
    });
});

const MediaViewer = function MediaViewer({ url, args }) {
    const [state, setState] = useState({
        shown: false,
        isHovering: false,
        isLoading: false,
        error: null,
        dimensions: { width: 0, height: 0 }
    });

    const containerRef = useRef(null);
    const mediaRef = useRef(null);

    const message = MessageStore.getMessage(args.channelId, args.messageId);
    const isDiscordMedia = url.includes("discord");
    const parsedUrl = url.replace(/<|>/g, "");

    const toggleMedia = useCallback(() => {
        setState(prev => ({
            ...prev,
            shown: !prev.shown,
            isLoading: !prev.shown
        }));
    }, []);

    const handleMediaLoad = useCallback((e) => {
        setState(prev => ({
            ...prev,
            isLoading: false,
            dimensions: {
                width: e.target.naturalWidth,
                height: e.target.naturalHeight
            }
        }));
        mediaRef.current = e.target;
    }, []);

    const handleMediaError = useCallback(() => {
        setState(prev => ({
            ...prev,
            isLoading: false,
            error: "Failed to load media"
        }));
    }, []);

    useEffect(() => {
        if (!containerRef.current || !mediaRef.current || !state.shown) return;

        const { width, height } = Utils.calculateOptimalDimensions(
            mediaRef.current,
            CONFIG.MEDIA.MAX_WIDTH_RATIO
        );

        containerRef.current.style.width = width ? `${width}px` : 'auto';
        containerRef.current.style.height = height ? `${height + 40}px` : 'auto';
    }, [state.shown, state.dimensions]);

    if (Utils.isEmbeddedInMessage(message, parsedUrl)) return null;

    return React.createElement("div", {
        className: `${CONFIG.CSS_CLASSES.LAYOUT.CONTAINER} ${!state.shown ? CONFIG.CSS_CLASSES.LAYOUT.CONTAINER_COLLAPSED : ''}`,
        onMouseEnter: () => setState(prev => ({ ...prev, isHovering: true })),
        onMouseLeave: () => setState(prev => ({ ...prev, isHovering: false })),
        ref: containerRef
    },
        React.createElement("div", { 
            className: CONFIG.CSS_CLASSES.LAYOUT.PREVIEW
        },
            React.createElement("button", {
                onClick: toggleMedia,
                className: `${CONFIG.CSS_CLASSES.BUTTONS.MAIN} ${
                    state.shown ? CONFIG.CSS_CLASSES.BUTTONS.HIDE : CONFIG.CSS_CLASSES.BUTTONS.SHOW
                }`
            }, state.shown ? "Hide" : "Show"),
            React.createElement(
                "div",
                {
                    className: CONFIG.CSS_CLASSES.LAYOUT.PREVIEW_ICON_CONTAINER, 
                    style: { position: 'relative', display: 'inline-block' } 
                },
                React.createElement(
                    SystemDesign.Tooltip,
                    { text: Utils.shortenUrl(parsedUrl) }, 
                    (props) => React.createElement("img", {
                        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23b9bbbe' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E",
                        className: CONFIG.CSS_CLASSES.LAYOUT.PREVIEW_ICON,
                        alt: "Image",
                        ...props
                    }),
                )
            ),            
            /*
                React.createElement("span", {
                    className: CONFIG.CSS_CLASSES.LAYOUT.PREVIEW_TEXT
                }, parsedUrl),
            */
            React.createElement("div", {
                className: CONFIG.CSS_CLASSES.LAYOUT.URL_PREVIEW
            }, 
                React.createElement("div", {
                    className: CONFIG.CSS_CLASSES.LAYOUT.ICON_URL_CONTAINER
                }
                ),
                React.createElement("span", {
                    className: `${CONFIG.CSS_CLASSES.SOURCE.TEXT} ${
                        isDiscordMedia ? CONFIG.CSS_CLASSES.SOURCE.DISCORD : CONFIG.CSS_CLASSES.SOURCE.EXTERNAL
                    }`
                }, isDiscordMedia ? "Discord media" : "External media")
            ),
        ),
        React.createElement("div", { 
            className: CONFIG.CSS_CLASSES.LAYOUT.MEDIA_CONTAINER 
        },
            state.shown && React.createElement(Image, {
                url: parsedUrl,
                shown: state.shown,
                onLoad: handleMediaLoad,
                onError: handleMediaError,
                onClick: () => openMediaModal(parsedUrl)
            }),
            React.createElement("div", {
                className: `${CONFIG.CSS_CLASSES.OVERLAY.BASE} ${
                    state.shown ? CONFIG.CSS_CLASSES.OVERLAY.HIDDEN : ''
                }`
            },
                state.isLoading && React.createElement("div", { 
                    className: CONFIG.CSS_CLASSES.OVERLAY.TEXT 
                },
                    React.createElement("p", null, "Loading...")
                )
            )
        )
    );
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

    const item = {
        url,
        original: url,
        proxyUrl: url.replace(CONFIG.URLS.CDN, CONFIG.URLS.MEDIA),
        srcIsAnimated: false,
        contentScanMetadata: undefined,
        ...dimensions,
        type
    };

    openModal(props => 
        React.createElement(CarouselModal, {
            ...props,
            className: CONFIG.CSS_CLASSES.MODAL.CAROUSEL,
            items: [item],
            shouldHideMediaOptions: true,
            startingIndex: 0
        })
    );
}

module.exports = class ShowImagesAnyway {
    start() {
        DOM.addStyle("ShowImagesAnyway-CSS", `
        .${CONFIG.CSS_CLASSES.LAYOUT.CONTAINER} {
            margin-bottom: 16px;
            border-radius: 8px;
            overflow: hidden;
            background-color: #2f3136;
            border: 1px solid #202225;
            transition: all 0.2s ease-in-out;
        }
        .${CONFIG.CSS_CLASSES.LAYOUT.CONTAINER_COLLAPSED} {
            max-width: 230px;
            height: auto !important;
            transition: max-width 0.2s ease-in-out;
        }
        .${CONFIG.CSS_CLASSES.LAYOUT.CONTROLS} {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
            background-color: #202225;
            height: 20px;
        }
        .${CONFIG.CSS_CLASSES.LAYOUT.MEDIA_CONTAINER} {
            position: relative;
            cursor: pointer;
            overflow: hidden;
        }
        .${CONFIG.CSS_CLASSES.MEDIA.IMAGE} {
            max-width: 100%;
            max-height: calc(100% - 40px);
            object-fit: contain;
            transition: opacity 0.2s ease-in-out;
        }
        .${CONFIG.CSS_CLASSES.MEDIA.IMAGE_SHOWN} {
            display: block;
            opacity: 1;
        }
        .${CONFIG.CSS_CLASSES.MEDIA.IMAGE_HIDDEN} {
            display: none;
            opacity: 0;
        }
        .${CONFIG.CSS_CLASSES.OVERLAY.BASE} {
            position: absolute;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 1;
            transition: opacity 0.2s ease-in-out;
        }
        .${CONFIG.CSS_CLASSES.OVERLAY.HIDDEN} {
            opacity: 0;
            pointer-events: none;
        }
        .${CONFIG.CSS_CLASSES.OVERLAY.TEXT} {
            color: #ffffff;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
        }
        .${CONFIG.CSS_CLASSES.OVERLAY.URL.CONTAINER} {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(32, 34, 37, 0.9);
            color: #dcddde;
            padding: 8px;
            font-size: 12px;
            transition: opacity 0.2s ease-in-out;
            opacity: 0;
        }
        .${CONFIG.CSS_CLASSES.OVERLAY.URL.VISIBLE} {
            opacity: 1;
        }
        .${CONFIG.CSS_CLASSES.SOURCE.TEXT} {
            font-size: 14px;
        }
        .${CONFIG.CSS_CLASSES.BUTTONS.MAIN} {
            padding: 6px 12px;
            border-radius: 3px;
            font-size: 14px;
            color: #ffffff;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
            outline: none;
        }
        .${CONFIG.CSS_CLASSES.BUTTONS.SHOW} {
            background-color: #5865f2;
        }
        .${CONFIG.CSS_CLASSES.BUTTONS.SHOW}:hover {
            background-color: #4752c4;
        }
        .${CONFIG.CSS_CLASSES.BUTTONS.HIDE} {
            background-color: #4f545c;
        }
        .${CONFIG.CSS_CLASSES.BUTTONS.HIDE}:hover {
            background-color: #5d6269;
        }
        .${CONFIG.CSS_CLASSES.MODAL.CAROUSEL} {
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 0;
            background: transparent !important;
            box-shadow: none !important;
        }
        .${CONFIG.CSS_CLASSES.SOURCE.DISCORD} {
            color: #43b581;
        }
        .${CONFIG.CSS_CLASSES.SOURCE.EXTERNAL} {
            color: #f04747;
        }
        .${CONFIG.CSS_CLASSES.LAYOUT.PREVIEW} {
            display: flex;
            align-items: center;
            padding: 12px;
            background-color: #2f3136;
            border-radius: 4px;
            gap: 12px;
        }
        
        .${CONFIG.CSS_CLASSES.LAYOUT.URL_PREVIEW} {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex: 1;
            min-width: 0;
            color: #b9bbbe;
            font-size: 14px;
        }
        
        .${CONFIG.CSS_CLASSES.LAYOUT.ICON_URL_CONTAINER} {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        
        .${CONFIG.CSS_CLASSES.LAYOUT.PREVIEW_ICON} {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
        }
        
        .${CONFIG.CSS_CLASSES.LAYOUT.PREVIEW_TEXT} {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #b9bbbe;
            font-size: 12px;
            max-width: 300px;
        }
        
        .${CONFIG.CSS_CLASSES.BUTTONS.MAIN} {
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            color: #ffffff;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
            flex-shrink: 0;
            height: fit-content;
        }
        
        .${CONFIG.CSS_CLASSES.SOURCE.TEXT} {
            font-size: 14px;
            flex-shrink: 0;
        }
    `);

        SimpleMarkdownWrapper.defaultRules[CONFIG.CONSTS.RULES] = {
            order: 1,
            match: text => Utils.regex.url.exec(text),
            parse: capture => ({
                url: capture[0],
                type: CONFIG.CONSTS.RULES
            }),
            react: (node, _, args) => React.createElement(MediaViewer, { 
                url: node.url, 
                args: args,
                key: args.key 
            })
        };

        SimpleMarkdownWrapper.parse = SimpleMarkdownWrapper.reactParserFor(SimpleMarkdownWrapper.defaultRules);
    }

    stop() {
        DOM.removeStyle("ShowImagesAnyway-CSS");
        delete SimpleMarkdownWrapper.defaultRules[CONFIG.CONSTS.RULES];
        SimpleMarkdownWrapper.parse = SimpleMarkdownWrapper.reactParserFor(SimpleMarkdownWrapper.defaultRules);
    }
};