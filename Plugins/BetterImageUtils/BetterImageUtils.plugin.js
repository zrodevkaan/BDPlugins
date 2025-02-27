/**
 * @name BetterImageUtils
 * @description Image manipulation and tools
 * @version 2.0.3
 * @author Kaan
 */

const { React, Data, Utils, React: { useState, useEffect }, Webpack, Webpack: { getByKeys, getStore, getBySource }, Patcher, ContextMenu, ReactDOM, DOM, UI, Net } = new BdApi("BetterImageUtils");

const ImageUtils = Webpack.getModule(m => m.copyImage);
const UserStore = Webpack.getModule(m => m.getCurrentUser && m.getUser);
const GuildStore = Webpack.getModule(m => m.getGuild);
const ModalClass = Webpack.getModule(m => m.modal && Object.keys(m).length === 1);
const openImageModal = Webpack.getByRegex(/hasMediaOptions:!\w+\.shouldHideMediaOptions/, { searchExports: true });
const Media = Webpack.getBySource(/let{alt:.{1,3},zoomThumbnailPlaceholder:/).ZP; // Webpack.getModule(a => a?.defaultProps?.readyState, { searchExports: true });
const ImageAnimated = Webpack.getModule(x=>x.ZP.isSrcAVIF)
const Clickable = Webpack.getBySource('BaseHeaderBar').ZP.Icon
const clipboard = {
    SUPPORTS_NATIVE: (text) => window?.DiscordNative ? DiscordNative.clipboard.copy(text) : navigator.clipboard.writeText(text)
}
const check = () => UserStore.getCurrentUser().nsfwAllowed

const ModalSystem = Webpack.getMangled(".modalKey?", {
    openModalLazy: Webpack.Filters.byStrings(".modalKey?"),
    openModal: Webpack.Filters.byStrings(",instant:"),
    closeModal: Webpack.Filters.byStrings(".onCloseCallback()"),
    closeAllModals: Webpack.Filters.byStrings(".getState();for")
})

const [
    FormSwitch,
    ModalRoot,
    CopyIcon,
    OpenExternal,
    Download,
    Dropdown
] = Webpack.getBulk(
    { filter: x => x.toString?.().includes('disabledText') && x.toString?.().includes('tooltipNote'), searchExports: true },
    { filter: Webpack.Filters.byStrings('.ImpressionTypes.MODAL,"aria-labelledby":'), searchExports: true },
    { filter: x => x.toString?.().includes('"M3 16a1 1 0 0 1-1-1v-5a8 8 0 0 1 8-8h5a1 1 0 0 1 1 1v.5a.5.5 0 0 1-.5.5H'), searchExports: true },
    { filter: x => x.toString?.().includes('M15 2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V4'), searchExports: true },
    { filter: x => x.toString?.().includes('"M12 2a1 1 0 0 1 1 1v10.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-1.4'), searchExports: true },
    { filter: x => x.render.toString().includes('["options","value","onChange",'), searchExports: true }
);

const DataStore = new Proxy(
    {},
    {
        get: (_, key) => {
            if (key === 'settings') {
                const savedSettings = Data.load(key) || {};
                return baseConfig.defaultConfig.reduce((acc, setting) => {
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
    }
);

const Eye = () => React.createElement('svg', { viewbox: '0 0 1200 1200', width: '24px', height: '24px', color: 'var(--interactive-normal)' }, React.createElement('path', { fill: 'var(--interactive-normal)', d: 'M12 5C5.648 5 1 12 1 12C1 12 5.648 19 12 19C18.352 19 23 12 23 12C23 12 18.352 5 12 5ZM12 16C9.791 16 8 14.21 8 12C8 9.79 9.791 8 12 8C14.209 8 16 9.79 16 12C16 14.21 14.209 16 12 16Z M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z' }))
const EyeClose = () => /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 89.9801 1200 1020",
    color: 'var(--interactive-normal)',
    width: '24px', height: '24px',
    children: /*#__PURE__*/React.createElement("path", {
        d: "M669.727,273.516c-22.891-2.476-46.15-3.895-69.727-4.248c-103.025,0.457-209.823,25.517-310.913,73.536  c-75.058,37.122-148.173,89.529-211.67,154.174C46.232,529.978,6.431,577.76,0,628.74c0.76,44.162,48.153,98.67,77.417,131.764  c59.543,62.106,130.754,113.013,211.67,154.174c2.75,1.335,5.51,2.654,8.276,3.955l-75.072,131.102l102.005,60.286l551.416-960.033  l-98.186-60.008L669.727,273.516z M902.563,338.995l-74.927,129.857c34.47,44.782,54.932,100.006,54.932,159.888  c0,149.257-126.522,270.264-282.642,270.264c-6.749,0-13.29-0.728-19.922-1.172l-49.585,85.84c22.868,2.449,45.99,4.233,69.58,4.541  c103.123-0.463,209.861-25.812,310.84-73.535c75.058-37.122,148.246-89.529,211.743-154.174  c31.186-32.999,70.985-80.782,77.417-131.764c-0.76-44.161-48.153-98.669-77.417-131.763  c-59.543-62.106-130.827-113.013-211.743-154.175C908.108,341.478,905.312,340.287,902.563,338.995L902.563,338.995z   M599.927,358.478c6.846,0,13.638,0.274,20.361,0.732l-58.081,100.561c-81.514,16.526-142.676,85.88-142.676,168.897  c0,20.854,3.841,40.819,10.913,59.325c0.008,0.021-0.008,0.053,0,0.074l-58.228,100.854  c-34.551-44.823-54.932-100.229-54.932-160.182C317.285,479.484,443.808,358.477,599.927,358.478L599.927,358.478z M768.896,570.513  L638.013,797.271c81.076-16.837,141.797-85.875,141.797-168.603C779.81,608.194,775.724,588.729,768.896,570.513L768.896,570.513z",
        fill: "var(--interactive-normal)"
    })
});

const MediaWrapper = (props) => {
    const { children, data, returnMetadata, getButtonState, downloadImage } = props;

    const hiddenMediaCache = React.useMemo(() => {
        return new Map(DataStore.hiddenMedias || new Map());
    }, []);

    const getMediaIdentifier = () => {
        const imageArgs = returnMetadata(data);
        const mediaUrl = imageArgs?.url || imageArgs?.src;
        const mediaId = data?.id || mediaUrl;
        return mediaId;
    };

    const mediaId = getMediaIdentifier();

    const [hidden, setHidden] = React.useState(() => {
        return mediaId ? hiddenMediaCache.get(mediaId) || false : false;
    });

    React.useEffect(() => {
        if (mediaId) {
            hiddenMediaCache.set(mediaId, hidden);
            DataStore.hiddenMedias = Array.from(hiddenMediaCache.entries());
        }
    }, [hidden, mediaId, hiddenMediaCache]);

    const imageArgs = returnMetadata(data);
    if (!imageArgs?.placeholder) return children;

    const mediaUrl = imageArgs?.url || imageArgs?.src;
    const mediaFilename = imageArgs?.filename || imageArgs?.alt;

    const hideButtonState = {
        tooltip: hidden ? 'Show Image' : 'Hide Image',
        icon: hidden ? Eye : EyeClose,
        onClick: () => setHidden(!hidden)
    };

    const copyButtonState = getButtonState(
        'Copy Link',
        mediaUrl,
        'Unable to copy: No valid URL found'
    );

    const downloadButtonState = getButtonState(
        'Download',
        mediaUrl && mediaFilename,
        'Unable to download: Missing filename or URL'
    );

    const externalButtonState = getButtonState(
        'Open in Window',
        mediaUrl,
        'Unable to locate URL'
    );

    return React.createElement('div', {
        style: {
            position: 'relative',
            width: '100%',
            height: '100%',
            zIndex: 2,
        },
        onMouseEnter: (e) => {
            const actionBar = e.currentTarget.querySelector('.media-action-container');
            if (actionBar) {
                actionBar.style.opacity = '1';
                actionBar.style.visibility = 'visible';
            }
        },
        onMouseLeave: (e) => {
            const actionBar = e.currentTarget.querySelector('.media-action-container');
            if (actionBar) {
                actionBar.style.opacity = '0';
                actionBar.style.visibility = 'hidden';
            }
        },
        className: 'media-wrapper',
    }, [
        React.createElement('div', {
            style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                position: 'relative',
                filter: hidden ? 'blur(50px)' : 'blur(0px)',
                transition: `filter 0.5s ease`,
                zIndex: 3,
            },
            className: 'media-container'
        }, children),

        React.createElement('div', {
            style: {
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'auto',
                backgroundColor: 'var(--background-primary)',
                zIndex: 4,
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
                opacity: '0',
                visibility: 'visible',
                boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.2)',
            },
            onClick: (e) => e.stopPropagation(),
            className: 'media-action-container'
        }, [
            React.createElement(ImageMetadata, { _src: mediaUrl, fileProps: data }),
            React.createElement('div', {
                className: 'media-action-bar',
                style: {
                    display: 'flex',
                    gap: '8px',
                    marginTop: '8px',
                    zIndex: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            }, [
                React.createElement(Clickable, {
                    tooltip: hideButtonState.tooltip,
                    icon: hideButtonState.icon,
                    onClick: hideButtonState.onClick
                }),

                React.createElement(Clickable, {
                    tooltip: copyButtonState.tooltip,
                    tooltipColor: copyButtonState.tooltipColor,
                    icon: CopyIcon,
                    disabled: copyButtonState.disabled,
                    onClick: () => {
                        if (!copyButtonState.disabled) {
                            clipboard.SUPPORTS_NATIVE(mediaUrl);
                            UI.showToast('Link copied to clipboard');
                        }
                    }
                }),

                React.createElement(Clickable, {
                    tooltip: downloadButtonState.tooltip,
                    tooltipColor: downloadButtonState.tooltipColor,
                    icon: Download,
                    disabled: downloadButtonState.disabled,
                    onClick: async () => {
                        if (!downloadButtonState.disabled) {
                            try {
                                await downloadImage(mediaUrl, mediaFilename);
                                UI.showToast(`Downloaded ${mediaFilename}`);
                            } catch (error) {
                                UI.showToast('Download failed');
                                console.error('Download error:', error);
                            }
                        }
                    }
                }),

                React.createElement(Clickable, {
                    tooltip: externalButtonState.tooltip,
                    tooltipColor: externalButtonState.tooltipColor,
                    icon: OpenExternal,
                    disabled: externalButtonState.disabled,
                    onClick: async () => {
                        if (!externalButtonState.disabled) {
                            try {
                                window.open(mediaUrl, 'blank_');
                                UI.showToast(`Opened ${mediaFilename}`);
                            } catch (error) {
                                UI.showToast('Download failed');
                                console.error('Download error:', error);
                            }
                        }
                    }
                }),
            ])
        ])
    ]);
};

const Components = {
    Slider: Webpack.getBySource('initialValueProp', 'getDerivedStateFromProps').i
}

const baseConfig = {
    defaultConfig: [
        {
            id: 'enableNSFW',
            component: FormSwitch,
            type: 'switch',
            children: 'Enable NSFW Search Engines',
            note: 'Allow access to search engines that may contain NSFW content',
            pred: check,
            value: false
        },
        /*{
            id: 'compressionQuality',
            component: Components.Slider,
            type: 'slider',
            children: 'Compression Quality',
            note: 'Set the quality level for image compression (higher = better quality)',
            markers: [0, 0.2, 0.4, 0.6, 0.8, 1],
            value: 0.8,
            min: 0,
            max: 1,
            step: 0.1
        },*/
        {
            id: 'enableDebugData',
            component: FormSwitch,
            type: 'switch',
            children: 'Enable Debug Data',
            note: 'Show additional debug information',
            value: true
        },
        {
            id: 'favoriteAnything',
            component: FormSwitch,
            type: 'switch',
            children: 'Enable Favoriting Everything',
            note: 'Adds the Favorite icon to every image/gif',
            value: false
        },
        // {
        //     id: 'defaultSearchEngine',
        //     component: Dropdown,
        //     type: 'select',
        //     title: 'Default Search Engine',
        //     note: 'Choose the default search engine for reverse image search',
        //     options: [{ label: "Google", value: 'Google' }, { label: "Bing", value: 'Bing' }, { label: "Yandex", value: 'Yandex' }],
        //     value: 'Google'
        // }
    ]
};

function loadDefaults() {
    if (!Data.load('settings')) {
        DataStore.settings = baseConfig.defaultConfig.reduce((acc, setting) => {
            acc[setting.id] = setting.value;
            return acc;
        }, {});
    }
}

const config = {
    ...baseConfig,
    defaultConfig: baseConfig.defaultConfig.map(setting => ({
        ...setting,
        value: DataStore.settings[setting.id]
    }))
};

const styles = {
    container: {
        fontSize: '12px',
        color: '#a3a6aa',
        marginTop: '4px',
        display: 'flex',
        gap: '8px'
    },
    dot: {
        color: '#a3a6aa'
    }
};


function SettingsPanel({ settings, onSettingsChange }) {
    const [localSettings, setLocalSettings] = useState(settings);

    const handleSettingChange = (settingId, value) => {
        const newSettings = {
            ...localSettings,
            [settingId]: value
        };
        setLocalSettings(newSettings);
        onSettingsChange(newSettings);
    };

    return config.defaultConfig
        .filter(setting => {
            if (!setting.component) return false;
            if (setting.pred && !setting?.pred?.()) return false;
            return true;
        })
        .map(setting => {
            try {
                return React.createElement(setting.component, {
                    ...setting,
                    value: localSettings[setting.id],
                    onChange: (value) => handleSettingChange(setting.id, value)
                });
            } catch (error) {
                console.error(`Failed to create component for setting ${setting.id}:`, error);
                return null;
            }
        })
        .filter(Boolean);
}

const imageData = {}
const runTimeHash = getByKeys('runtimeHashMessageKey')

const ImageMetadata = React.memo(({ _src, fileProps }) => {
    const [metadata, setMetadata] = useState(null);
    const src = runTimeHash.runtimeHashMessageKey(String(_src))

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                if (imageData[src]) {
                    setMetadata(imageData[src]);
                }
                const response = await Net.fetch(_src);
                const blob = await response.blob();
                const img = new Image();
                const objectUrl = URL.createObjectURL(blob);

                img.onload = () => {
                    const data = {
                        size: (blob.size / 1024).toFixed(1),
                        type: fileProps.animated ? fileProps.alt : blob.type.split('/')[1].toUpperCase(),
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                        id: src,
                        error: undefined,
                    }
                    setMetadata(data);
                    imageData[src] = data
                    URL.revokeObjectURL(objectUrl);
                };

                img.src = objectUrl;
            } catch (error) {
                setMetadata({ error: 'Click on the image to refetch.' });
                console.error("Failed to fetch metadata:", error);
            }
        };

        fetchMetadata();
    }, [src]);

    if (!metadata) return null;

    return React.createElement('div', { style: styles.container },
        !metadata?.error ? [
            React.createElement('span', { key: 'dimensions' },
                `${metadata.width}×${metadata.height}`
            ),
            React.createElement('span', { key: 'dot1', style: styles.dot }, '•'),
            React.createElement('span', { key: 'size' },
                `${metadata.size}KB`
            ),
            React.createElement('span', { key: 'dot2', style: styles.dot }, '•'),
            React.createElement('span', { key: 'type' },
                metadata.type
            )
        ] : React.createElement('span', { key: 'failed' },
            `${metadata.error}`
        ),
    );
});

const TEST_FOR_TYPE = /https:\/\/cdn.discordapp.com\/.*?\.(\w+)\??size=(\d+)?/;



const filters = {
    vintage: 'sepia(0.5) hue-rotate(-30deg)',
    noir: 'grayscale(1) contrast(1.2)',
    chrome: 'saturate(2) contrast(1.1)',
    fade: 'opacity(0.8) blur(0.5px)',
    vivid: 'saturate(2) contrast(1.1) brightness(1.1)',

    warm: 'sepia(0.4) brightness(1.2)',
    cool: 'hue-rotate(180deg) brightness(0.9)',
    retro: 'sepia(0.8) contrast(1.5)',
    pastel: 'saturate(0.7) brightness(1.3)',
    cinematic: 'grayscale(0.3) contrast(1.4) brightness(0.9)',
    dream: 'blur(2px) brightness(1.1) hue-rotate(45deg)',
    frost: 'contrast(0.8) brightness(1.2) blur(1px)',
    polaroid: 'contrast(1.1) saturate(1.5) sepia(0.3)',
    twilight: 'brightness(0.7) contrast(1.5) hue-rotate(-45deg)',
    neon: 'saturate(3) brightness(1.2) contrast(2)',
    charcoal: 'grayscale(1) brightness(0.8) contrast(0.9)',
    hazy: 'blur(3px) opacity(0.9)',
    sharp: 'contrast(1.8) brightness(1.2)',
    gloom: 'brightness(0.5) contrast(1.2)',
    glow: 'brightness(1.5) saturate(1.3)',
    sepia: 'sepia(1)',
    grayscale: 'grayscale(1)',
    invert: 'invert(1)',
    highContrast: 'contrast(2)',
    lowContrast: 'contrast(0.5)',
    deepFocus: 'brightness(0.8) contrast(1.6) saturate(1.2)',
    golden: 'sepia(0.6) hue-rotate(-20deg) saturate(1.5)',
    funky: 'hue-rotate(90deg) saturate(2.5)',
    muted: 'saturate(0.5) brightness(0.9)',
    vintageFilm: 'sepia(0.7) contrast(1.2) brightness(0.9) saturate(0.8)',
    oceanic: 'hue-rotate(200deg) saturate(1.5)',
    amber: 'sepia(0.4) hue-rotate(10deg) brightness(1.2)',
    forest: 'hue-rotate(-60deg) saturate(1.2) contrast(1.1)',
    softGlow: 'brightness(1.4) blur(1.5px)',
    gritty: 'contrast(1.3) brightness(0.8) grayscale(0.2)',
    morning: 'brightness(1.3) hue-rotate(20deg)',
    evening: 'brightness(0.8) contrast(1.3) sepia(0.5)',
    spooky: 'invert(0.9) hue-rotate(180deg) contrast(1.5)',
    candy: 'saturate(2.5) brightness(1.2) hue-rotate(300deg)',
    electric: 'brightness(1.3) saturate(2) hue-rotate(45deg)',
    dramatic: 'grayscale(0.8) contrast(1.8) brightness(0.7)',
    surreal: 'invert(1) hue-rotate(180deg) contrast(0.8)',
    moonlight: 'grayscale(1) brightness(1.1) contrast(1.3)',
    foggy: 'brightness(0.9) blur(2px)',
    sepiaDark: 'sepia(0.9) brightness(0.8)',
    rose: 'brightness(1.2) hue-rotate(-20deg) saturate(1.8)',
    galaxy: 'hue-rotate(240deg) saturate(1.6) brightness(1.2)'
};

const returnType = (img) => {
    try {
        return TEST_FOR_TYPE.exec(img)[1]
    }
    catch (ex) {
        return 'png'
    }
}

function extractDomain(url) {
    const matches = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/im);
    return matches && matches[1];
}

function generateFaviconURL(website, size = 16) {
    const url = new URL("https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL");
    url.searchParams.set("url", `https://${website}`);
    url.searchParams.set("size", String(size));
    return url.href;
}


async function fetchImageDimensions(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const blob = await response.blob()
        const img = new Image();
        const objectURL = URL.createObjectURL(blob);

        return new Promise((resolve, reject) => {
            img.onload = () => {
                const dimensions = {
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                };
                URL.revokeObjectURL(objectURL);
                resolve(dimensions);
            };

            img.onerror = (error) => {
                URL.revokeObjectURL(objectURL);
                reject(error);
            };

            img.src = objectURL;
        });
    } catch (error) {
        console.error("Failed to fetch or load the image:", error);
    }
}

class ImageUtilsEnhanced {
    constructor() {
        this.searchEngines = {
            GoogleLens: {
                url: 'https://lens.google.com/uploadbyurl?url=',
                mayContainNSFW: false,
                ico: 'https://lens.google.com/favicon.ico'
            },
            Sogou: {
                url: 'http://pic.sogou.com/ris?flag=1&drag=0&flag=1&query=',
                mayContainNSFW: false,
                ico: 'https://www.sogou.com/favicon.ico'
            },
            Bing: {
                url: 'https://www.bing.com/images/search?view=detailv2&iss=sbi&FORM=IRSBIQ&q=imgurl:',
                mayContainNSFW: false,
                ico: 'https://www.bing.com/favicon.ico'
            },
            WhatAnime: {
                url: 'https://trace.moe/?url=',
                mayContainNSFW: false,
                ico: 'https://trace.moe/favicon.ico'
            },
            TinEye: {
                url: 'https://tineye.com/search?url=',
                mayContainNSFW: false,
                ico: 'https://tineye.com/favicon.ico'
            },
            Yandex: {
                url: 'https://yandex.com/images/search?rpt=imageview&url=',
                mayContainNSFW: false,
                ico: 'https://yandex.com/favicon.ico'
            },
            Ascii2D: {
                url: 'https://ascii2d.net/search/url/',
                mayContainNSFW: true,
                ico: 'https://ascii2d.net/favicon.ico'
            },
            ImgOps: {
                url: 'https://imgops.com/specialized+reverse/',
                mayContainNSFW: true,
                ico: 'https://imgops.com/favicon.ico'
            },
            SauceNAO: {
                url: 'https://saucenao.com/search.php?db=999&url=',
                mayContainNSFW: true,
                ico: 'https://saucenao.com/favicon.ico'
            },
            IQDB: {
                url: 'https://iqdb.org/?url=',
                mayContainNSFW: true,
                ico: 'https://www.iqdb.org/favicon.ico'
            },
            Google: {
                url: 'https://www.google.com/searchbyimage?sbisrc=cr_1&image_url=',
                mayContainNSFW: false,
                ico: 'https://www.google.com/favicon.ico'
            },
            /*
            Baidu: {
                url: 'https://graph.baidu.com/details?isfromtusoupc=1&tn=pc&url=',
                mayContainNSFW: false,
                ico: 'https://www.baidu.com/favicon.ico'
            },
            Pinterest: {
                url: 'https://www.pinterest.com/search/pins/?q=',
                mayContainNSFW: false,
                ico: 'https://www.pinterest.com/favicon.ico'
            },
            KarmaDecay: {
                url: 'http://karmadecay.com/search?q=',
                mayContainNSFW: false,
                ico: 'http://karmadecay.com/favicon.ico'
            }*/
        };

        this.imageEditors = {
            Photopea: {
                url: 'https://www.photopea.com#{\"files\": [\"%\"]}',
                ico: 'https://www.photopea.com/favicon.ico'
            },
            /*Pixlr: {
                url: 'https://pixlr.com/e/?image=',
                ico: 'https://pixlr.com/favicon.ico'
            }*/
        };

        this.cache = new Map();
        loadDefaults();
        this.settings = DataStore.settings;
    }


    async getImageMetadata(url) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return {
                size: blob.size,
                type: blob.type,
                lastModified: new Date(response.headers.get('last-modified')),
                dimensions: await this.getImageDimensions(blob)
            };
        } catch (error) {
            console.error('Failed to fetch image metadata:', error);
            return null;
        }
    }

    async getImageDimensions(blob) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.src = URL.createObjectURL(blob);
        });
    }

    async compressImage(url, quality = 0.8) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const img = new Image();
            img.src = URL.createObjectURL(blob);

            return new Promise((resolve) => {
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob((compressedBlob) => {
                        resolve(URL.createObjectURL(compressedBlob));
                    }, 'image/jpeg', quality);
                };
            });
        } catch (error) {
            console.error('Failed to compress image:', error);
            return url;
        }
    }


    createImageEditMenuItem(baseId, url) {
        return {
            type: "submenu",
            id: `${baseId}-edit`,
            label: "Edit Image",
            items: Object.entries(this.imageEditors).map(([editor, info]) => ({
                type: "button",
                id: `${baseId}-edit-${editor.toLowerCase()}`,
                label: `Open in ${editor}`,
                iconLeft: () => React.createElement('img', {
                    src: info.ico,
                    width: 16,
                    height: 16
                }),
                onClick: () => {
                    const encodedUrl = encodeURIComponent(url);
                    const URL = info.url.replace('%', encodedUrl);
                    window.open(URL, '_blank');
                }
            }))
        };
    }

    createImageInfoMenuItem(baseId, url) {
        return {
            type: "button",
            id: `${baseId}-info`,
            label: "Image Information",
            onClick: async () => {
                const metadata = await this.getImageMetadata(url);
                if (!metadata) {
                    UI.showToast("Failed to fetch image information", { type: "error" });
                    return;
                }

                UI.showConfirmationModal(
                    "Image Information",
                    React.createElement("div", null,
                        React.createElement("p", { style: { margin: '5px 0', fontSize: '14px', color: '#ffffff' } }, `Size: ${(metadata.size / 1024).toFixed(2)} KB`),
                        React.createElement("p", { style: { margin: '5px 0', fontSize: '14px', color: '#ffffff' } }, `Type: ${metadata.type}`),
                        React.createElement("p", { style: { margin: '5px 0', fontSize: '14px', color: '#ffffff' } }, `Dimensions: ${metadata.dimensions.width}x${metadata.dimensions.height}`),
                        React.createElement("p", { style: { margin: '5px 0', fontSize: '14px', color: '#ffffff' } }, `Last Modified: ${metadata.lastModified.toLocaleString()}`),
                        React.createElement("p", { style: { margin: '5px 0', fontSize: '14px', color: '#ffffff' } }, `URL: ${url}`)
                    ),
                    {
                        confirmText: "Copy Details",
                        cancelText: "Close",
                        onConfirm: () => {
                            const details = [
                                `Size: ${(metadata.size / 1024).toFixed(2)} KB`,
                                `Type: ${metadata.type}`,
                                `Dimensions: ${metadata.dimensions.width}x${metadata.dimensions.height}`,
                                `Last Modified: ${metadata.lastModified.toLocaleString()}`,
                                `URL: ${url}`
                            ].join('\n');

                            ImageUtils.copy(details)
                            UI.showToast("Image details copied to clipboard!", { type: "success" });
                        }
                    }
                );
            }
        };
    }

    createCompressImageMenuItem(baseId, url) {
        return {
            type: "button",
            id: `${baseId}-compress`,
            label: "Compress Image",
            onClick: async () => {
                try {
                    const compressedUrl = await this.compressImage(url);
                    this.openModal(compressedUrl, returnType(url));
                    UI.showToast("Image compressed successfully!", { type: "success" });
                } catch (error) {
                    UI.showToast("Failed to compress image", { type: "error" });
                }
            }
        };
    }


    createMediaMenuItem(baseId, label, options) {
        const { url, filename, type = 'image', proxyURL } = options;
        const urlToUse = url || proxyURL;

        const baseItems = [
            {
                type: "button",
                id: `${baseId}-view`,
                label: "Open Image",
                onClick: async () => {
                    this.openModal(urlToUse, type == "image" ? 'img' : "video");
                }
            },
            {
                type: "button",
                id: `${baseId}-copy`,
                label: `Copy ${type.charAt(0).toUpperCase() + type.slice(1)}`,
                onClick: () => {
                    ImageUtils.copyImage(urlToUse);
                    UI.showToast("Copied to clipboard!", { type: "success" });
                }
            },
            {
                type: "button",
                id: `${baseId}-copy-link`,
                label: `Copy ${type.charAt(0).toUpperCase() + type.slice(1)} Link`,
                onClick: () => {
                    ImageUtils.copy(urlToUse);
                    UI.showToast("Copied link to clipboard!", { type: "success" });
                }
            },
            {
                type: "button",
                id: `${baseId}-download`,
                label: `Download ${type.charAt(0).toUpperCase() + type.slice(1)}`,
                onClick: async () => {
                    try {
                        const response = await fetch(urlToUse);
                        const blob = await response.blob();
                        const blobUrl = window.URL.createObjectURL(blob);

                        const a = document.createElement('a');
                        a.href = blobUrl;
                        a.download = filename || `download.${type === 'video' ? 'mp4' : 'png'}`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(blobUrl);

                        UI.showToast("Download started!", { type: "success" });
                    } catch (error) {
                        UI.showToast("Download failed!", { type: "error" });
                    }
                }
            }
        ];


        if (type === 'image') {
            baseItems.push(
                { type: "separator" },
                this.createImageEditMenuItem(baseId, urlToUse),
                this.createCompressImageMenuItem(baseId, urlToUse),
                this.createImageInfoMenuItem(baseId, urlToUse),
                this.createFilterMenu(baseId, urlToUse),
                this.createMemeTextMenu(baseId, urlToUse),
                {
                    type: "submenu",
                    id: `${baseId}-search`,
                    label: "Reverse Image Search",
                    items: this.getSearchMenuItems(url, baseId)
                }
            );
        }

        return {
            type: "submenu",
            id: baseId,
            label: label,
            items: baseItems
        };
    }


    loadSettings() {
        return DataStore.settings;
    }

    saveSettings() {
        Data.save('settings', this.settings);
    }

    getIdChangeValue(id, value) {
        this.settings[id] = value;
        this.saveSettings();
    }

    async downloadImage(url, filename) {
        try {
            if (url.startsWith('data:')) {
                const parts = url.split(',');
                const matches = parts[0].match(/:(.*?);/);
                const mimeType = matches ? matches[1] : 'image/png';
                
                const binary = atob(parts[1]);
                const array = [];
                for (let i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                const blob = new Blob([new Uint8Array(array)], {type: mimeType});
                
                const blobUrl = window.URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = filename || `download.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(blobUrl);
                
                UI.showToast("Download started!", { type: "success" });
            } else {
                const response = await Net.fetch(url);
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
    
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = filename || `download.${type === 'video' ? 'mp4' : 'png'}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(blobUrl);
    
                UI.showToast("Download started!", { type: "success" });
            }
        } catch (error) {
            console.log(error);
            UI.showToast("Download failed!", { type: "error" });
        }
    }

    createBatchOperationsMenu(images) {
        return {
            type: "submenu",
            id: this.generateMenuId('batch-operations'),
            label: "Batch Operations",
            items: [
                {
                    type: "button",
                    id: this.generateMenuId('batch-download'),
                    label: "Download All",
                    onClick: async () => {
                        for (const image of images) {
                            await this.downloadImage(image.url, image.filename);
                        }
                        UI.showToast(`Downloaded ${images.length} images!`, { type: "success" });
                    }
                },
                {
                    type: "button",
                    id: this.generateMenuId('batch-compress'),
                    label: "Compress All",
                    onClick: async () => {
                        const compressedUrls = await Promise.all(
                            images.map(image => this.compressImage(image.url, this.settings.compressionQuality))
                        );
                        this.cache.set('compressedBatch', compressedUrls);
                        UI.showToast(`Compressed ${images.length} images!`, { type: "success" });
                    }
                }
            ]
        };
    }


    async compareImages(url1, url2) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const [img1, img2] = await Promise.all([
            this.loadImage(url1),
            this.loadImage(url2),
        ]);

        canvas.width = img1.width + img2.width;
        canvas.height = Math.max(img1.height, img2.height);

        ctx.drawImage(img1, 0, 0);

        ctx.drawImage(img2, img1.width, 0);

        try {
            return canvas.toDataURL();
        } catch (error) {
            console.error("Failed to export canvas:", error);
            throw error;
        }
    }

    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
            img.src = url;
        });
    }


    addToHistory(imageData) {
        const history = Data.load('history') || [];

        const existingIndex = history.findIndex(item => item.url === imageData.url);

        if (existingIndex !== -1) {
            history.splice(existingIndex, 1);
        }

        history.unshift({
            ...imageData,
            timestamp: Date.now()
        });

        if (history.length > 50) history.pop();

        Data.save('history', history);
    }

    getHistoryMenu() {
        const history = Data.load('history') || [];

        return {
            type: "submenu",
            id: this.generateMenuId('history'),
            label: "Recent Images",
            items: history.map(item => ({
                type: "button",
                id: this.generateMenuId(`history-${item.timestamp}`),
                label: item.filename || "Unnamed Image",
                subtext: new Date(item.timestamp).toLocaleString(),
                icon: () => React.createElement('img', { src: item.url, style: { height: 24, width: 24, borderRadius: 24, marginRight: 24 } }),
                onClick: () => this.openModal(item.url, returnType(item.url))
            }))
        };
    }


    applyFilter(imageUrl, filter) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                ctx.filter = filters[filter] || '';
                ctx.drawImage(img, 0, 0);

                resolve(canvas.toDataURL());
            };
            img.src = imageUrl;
        });
    }

    createFilterMenu(baseId, url) {
        return {
            type: "submenu",
            id: `${baseId}-filters`,
            label: "Apply Filters",
            items: Object.keys(filters).map((filterKey) => ({
                type: "button",
                id: `${baseId}-filter-${filterKey}`,
                label: filterKey.charAt(0).toUpperCase() + filterKey.slice(1),
                onClick: async () => {
                    const filteredUrl = await this.applyFilter(url, filterKey);
                    this.openModal(filteredUrl, 'png');
                }
            }))
        };
    }

    getEmbedItems(message) {
        if (!message?.embeds?.length) return [];

        return message.embeds.map((embed, index) => {
            const name = embed.rawTitle ||
                (embed.url && embed.url.split('/').pop()) ||
                'Untitled Embed';
            const baseId = this.generateMenuId(`embed-${index}`);
            const items = [];

            if (embed.video?.url) {
                items.push(this.createMediaMenuItem(
                    `${baseId}-video`,
                    `${name} (Video)`,
                    { url: embed.video.url, filename: `${name}.mp4`, type: 'video', attachment: embed }
                ));
            }

            if (embed.image?.url) {
                items.push(this.createMediaMenuItem(
                    `${baseId}-image`,
                    `${name} (Image)`,
                    { url: embed.image?.url, proxyURL: embed.image.proxyURL, filename: `${name}.png`, attachment: embed }
                ));
            }

            if (embed.thumbnail?.url) {
                items.push(this.createMediaMenuItem(
                    `${baseId}-image`,
                    `${name} (Image)`,
                    { url: embed.thumbnail.url, proxyURL: embed.thumbnail.proxyURL, filename: `${name}.png`, attachment: embed }
                ));
            }

            return items;
        }).flat();
    }

    getGuildItems(guild) {
        if (!guild) return [];

        const items = [];

        if (guild.icon) {
            const iconURL = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=4096`;
            items.push(this.createMediaMenuItem(
                this.generateMenuId('guild-icon'),
                "Server Icon",
                { url: iconURL, filename: `${guild.name}-icon.png` }
            ));
        }

        if (guild.banner) {
            const bannerURL = `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png?size=4096`;
            items.push(this.createMediaMenuItem(
                this.generateMenuId('guild-banner'),
                "Server Banner",
                { url: bannerURL, filename: `${guild.name}-banner.png` }
            ));
        }

        if (guild.splash) {
            const splashURL = `https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.png?size=4096`;
            items.push(this.createMediaMenuItem(
                this.generateMenuId('guild-splash'),
                "Invite Background",
                { url: splashURL, filename: `${guild.name}-splash.png` }
            ));
        }

        return items;
    }

    getAttachmentItems(message) {
        if (!message?.attachments?.length) return [];

        return message.attachments
            .filter(attachment => attachment.content_type?.startsWith('image/'))
            .map((attachment, index) => this.createMediaMenuItem(
                this.generateMenuId(`attachment-${index}`),
                attachment.filename || "Image",
                { url: attachment.url, filename: attachment.filename, attachment }
            ));
    }

    handleMessageContext(res, props) {

        if (!props.message) return;

        const allImages = [
            ...(props.message.attachments || [])
                .filter(a => a.content_type && a.content_type.startsWith('image/'))
                .map(a => ({
                    url: a.url,
                    filename: a.filename || 'image.png'
                })),
            ...(props.message.embeds || [])
                .filter(e => (e.thumbnail && e.thumbnail.url) || (e.image && e.image.url))
                .map(e => ({
                    url: e.thumbnail?.url || e.image?.url,
                    filename: e.rawTitle || 'embed-image.png'
                }))
        ];

        const items = [
            ...this.getEmbedItems(props.message),
            ...this.getAttachmentItems(props.message),

        ];

        if (items.length === 0) return;

        const menuItems = [
            ContextMenu.buildItem({
                type: "submenu",
                id: this.generateMenuId('main'),
                label: "Image Utils",
                items: [
                    ...items,
                    { type: "separator" },
                    this.getHistoryMenu()
                ]
            })
        ];

        if (menuItems.length > 0) {
            res.props.children.push(
                ContextMenu.buildItem({ type: "separator" }),
                ...menuItems,
            );
        }
    }


    handleUserContext(res, props) {
        const user = props.user || UserStore.getUser(props.user.id);
        if (!user) return;

        const items = this.getUserAvatarItems(user);
        if (items.length === 0) return;


        if (user.avatar && user.banner) {
            items.push({
                type: "button",
                id: this.generateMenuId('compare-avatar-banner'),
                label: "Compare Avatar & Banner",
                onClick: async () => {
                    const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096`;
                    const bannerUrl = `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=4096`;

                    try {
                        const comparisonUrl = await this.compareImages(avatarUrl, bannerUrl);
                        this.openModal(comparisonUrl, 'png');
                    } catch (error) {
                        UI.showToast("Failed to compare images", { type: "error" });
                    }
                }
            });
        }

        res.props.children.push(
            ContextMenu.buildItem({ type: "separator" }),
            ContextMenu.buildItem({
                type: "submenu",
                id: this.generateMenuId('user-main'),
                label: "Image Utils",
                items: [
                    ...items,
                    { type: "separator" },
                    this.getHistoryMenu()
                ]
            })
        );


        user.avatar && this.addToHistory({
            url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096`,
            filename: `${user.username}-avatar.png`,
            type: 'avatar'
        });
    }

    getSearchMenuItems(url, baseId) {
        const nsfwItems = [];
        const nonNsfwItems = [];

        Object.entries(this.searchEngines).forEach(([engine, base]) => {
            const domain = extractDomain(base.url);
            const item = {
                type: "button",
                id: this.generateMenuId(`${baseId}-search-${engine.toLowerCase()}`),
                label: `Search with ${engine}`,
                color: base.mayContainNSFW ? 'danger' : undefined,
                iconLeft: () => React.createElement('img', {
                    src: generateFaviconURL(domain, 16),
                }),
                onClick: () => {
                    if (base.mayContainNSFW) {
                        UI.showConfirmationModal(
                            "NSFW Content Warning",
                            `The search engine "${engine}" may return NSFW content. Do you want to continue?`,
                            {
                                danger: true,
                                confirmText: "Proceed",
                                cancelText: "Cancel",
                                onConfirm: () => window.open(`${base.url}${encodeURIComponent(url)}`, '_blank')
                            }
                        );
                    } else {
                        window.open(`${base.url}${encodeURIComponent(url)}`, '_blank');
                    }
                }
            };

            if (base.mayContainNSFW) {
                nsfwItems.push(item);
            } else {
                nonNsfwItems.push(item);
            }
        });

        return [
            ...nonNsfwItems,
            ...(check() ? [{ type: "separator" }, ...nsfwItems] : [])
        ];
    }

    generateMenuId(base) {
        return `iue-${base}`;
    }

    getUserAvatarItems(user) {
        if (!user) return [];
        const items = [];


        if (user.avatar) {
            const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096`;
            items.push(this.createMediaMenuItem(
                this.generateMenuId('user-avatar'),
                "Profile Picture",
                { url: avatarURL, filename: `${user.username}-avatar.png` }
            ));


            if (user.avatar.startsWith('a_')) {
                const gifAvatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif?size=4096`;
                items.push(this.createMediaMenuItem(
                    this.generateMenuId('user-avatar-gif'),
                    "Animated Profile Picture",
                    { url: gifAvatarURL, filename: `${user.username}-avatar.gif` }
                ));
            }
        }

        if (user.guildMemberAvatar) {
            const guildAvatarURL = `https://cdn.discordapp.com/guilds/${user.guildId}/users/${user.id}/avatars/${user.guildMemberAvatar}.png?size=4096`;
            items.push(this.createMediaMenuItem(
                this.generateMenuId('user-guild-avatar'),
                "Server Profile Picture",
                { url: guildAvatarURL, filename: `${user.username}-server-avatar.png` }
            ));
        }

        if (user.banner) {
            const bannerURL = `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=4096`;
            items.push(this.createMediaMenuItem(
                this.generateMenuId('user-banner'),
                "Profile Banner",
                { url: bannerURL, filename: `${user.username}-banner.png` }
            ));

            if (user.banner.startsWith('a_')) {
                const gifBannerURL = `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.gif?size=4096`;
                items.push(this.createMediaMenuItem(
                    this.generateMenuId('user-banner-gif'),
                    "Animated Profile Banner",
                    { url: gifBannerURL, filename: `${user.username}-banner.gif` }
                ));
            }
        }

        if (user.avatarDecorationData?.asset) {
            const decorationURL = `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatarDecorationData.asset}.png?size=1280&passthrough=false`;
            items.push(this.createMediaMenuItem(
                this.generateMenuId('user-decoration'),
                "Avatar Decoration",
                { url: decorationURL, filename: `${user.username}-decoration.png` }
            ));
        }

        return items;
    }

    handleGuildContext(res, props) {
        const guild = props.guild || GuildStore.getGuild(props.guildId);
        if (!guild) return;

        const items = this.getGuildItems(guild);
        if (items.length === 0) return;


        if (guild.icon && guild.banner) {
            items.push({
                type: "button",
                id: this.generateMenuId('compare-icon-banner'),
                label: "Compare Icon & Banner",
                onClick: async () => {
                    const iconUrl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=4096`;
                    const bannerUrl = `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png?size=4096`;

                    try {
                        const comparisonUrl = await this.compareImages(iconUrl, bannerUrl);
                        this.openModal(comparisonUrl, 'png');
                    } catch (error) {
                        console.log(error)
                        UI.showToast("Failed to compare images", { type: "error" });
                    }
                }
            });
        }

        const allAssets = [];
        if (guild.icon) allAssets.push({
            url: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=4096`,
            filename: `${guild.name}-icon.png`
        });
        if (guild.banner) allAssets.push({
            url: `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png?size=4096`,
            filename: `${guild.name}-banner.png`
        });
        if (guild.splash) allAssets.push({
            url: `https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.png?size=4096`,
            filename: `${guild.name}-splash.png`
        });

        /*if (allAssets.length > 1) {
            items.push(
                { type: "separator" },
                this.createBatchOperationsMenu(allAssets)
            );
        }*/

        res.props.children.push(
            ContextMenu.buildItem({ type: "separator" }),
            ContextMenu.buildItem({
                type: "submenu",
                id: this.generateMenuId('guild-main'),
                label: "Image Utils",
                items: [
                    ...items,
                    { type: "separator" },
                    this.getHistoryMenu()
                ]
            })
        );


        guild.icon && this.addToHistory({
            url: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=4096`,
            filename: `${guild.name}-icon.png`,
            type: 'guild-icon'
        });
    }

    createMemeTextMenu(baseId, url) {
        return {
            type: "submenu",
            id: `${baseId}-meme`,
            label: "Add Meme Text",
            items: [
                {
                    type: "button",
                    id: `${baseId}-meme-custom`,
                    label: "Add Custom Text",
                    onClick: () => {
                        UI.showConfirmationModal(
                            "Add Meme Text",
                            React.createElement("div", null,
                                React.createElement("div", { style: { marginBottom: '10px' } },
                                    React.createElement("input", {
                                        type: "text",
                                        placeholder: "Top Text",
                                        id: "meme-top-text",
                                        style: {
                                            width: '100%',
                                            padding: '8px',
                                            marginBottom: '8px',
                                            backgroundColor: '#2f3136',
                                            border: '1px solid #202225',
                                            borderRadius: '3px',
                                            color: '#ffffff'
                                        }
                                    })
                                ),
                                React.createElement("div", null,
                                    React.createElement("input", {
                                        type: "text",
                                        placeholder: "Bottom Text",
                                        id: "meme-bottom-text",
                                        style: {
                                            width: '100%',
                                            padding: '8px',
                                            backgroundColor: '#2f3136',
                                            border: '1px solid #202225',
                                            borderRadius: '3px',
                                            color: '#ffffff'
                                        }
                                    })
                                )
                            ),
                            {
                                confirmText: "Create",
                                cancelText: "Cancel",
                                onConfirm: async () => {
                                    const topText = document.getElementById('meme-top-text').value;
                                    const bottomText = document.getElementById('meme-bottom-text').value;

                                    if (!topText && !bottomText) {
                                        UI.showToast("Please enter at least one line of text", { type: "error" });
                                        return;
                                    }

                                    try {
                                        const memeUrl = await this.addMemeText(url, topText, bottomText);
                                        this.openModal(memeUrl, 'png');
                                        UI.showToast("Meme created successfully!", { type: "success" });
                                    } catch (error) {
                                        console.error("Failed to create meme:", error);
                                        UI.showToast("Failed to create meme", { type: "error" });
                                    }
                                }
                            }
                        );
                    }
                },
                {
                    type: "button",
                    id: `${baseId}-meme-templates`,
                    label: "Quick Templates",
                    onClick: () => {
                        UI.showConfirmationModal(
                            "Quick Meme Templates",
                            React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
                                ["TOP TEXT / BOTTOM TEXT", "WHEN YOU / BOTTOM TEXT", "ME WHEN THE / BOTTOM TEXT"].map(template =>
                                    React.createElement("button", {
                                        style: {
                                            padding: '8px',
                                            backgroundColor: '#2f3136',
                                            border: '1px solid #202225',
                                            borderRadius: '3px',
                                            color: '#ffffff',
                                            cursor: 'pointer'
                                        },
                                        onClick: async () => {
                                            const [top, bottom] = template.split(" / ");
                                            try {
                                                const memeUrl = await this.addMemeText(url, top, bottom);
                                                this.openModal(memeUrl, 'png');
                                                UI.showToast("Meme created successfully!", { type: "success" });
                                            } catch (error) {
                                                UI.showToast("Failed to create meme", { type: "error" });
                                            }
                                        }
                                    }, template)
                                )
                            ),
                            {
                                confirmText: "Close",
                                cancelText: null
                            }
                        );
                    }
                }
            ]
        };
    }

    addMemeText(imageUrl, topText, bottomText) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const maxFontSize = canvas.width * 0.1;
                const minFontSize = canvas.width * 0.04;
                const calculateFontSize = (text) => {
                    let fontSize = maxFontSize;
                    ctx.font = `bold ${fontSize}px Arial`;
                    while (ctx.measureText(text).width > canvas.width * 0.9 && fontSize > minFontSize) {
                        fontSize -= 2;
                        ctx.font = `bold ${fontSize}px Arial`;
                    }
                    return fontSize;
                };

                const drawText = (text, x, y, baseline) => {
                    const fontSize = calculateFontSize(text);
                    ctx.font = `bold ${fontSize}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = baseline;
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = Math.max(fontSize * 0.1, 4);

                    ctx.strokeText(text, x, y);
                    ctx.fillText(text, x, y);
                };

                if (topText) {
                    drawText(topText.toUpperCase(), canvas.width / 2, canvas.height * 0.05, 'top');
                }

                if (bottomText) {
                    drawText(bottomText.toUpperCase(), canvas.width / 2, canvas.height * 0.95, 'bottom');
                }

                resolve(canvas.toDataURL());
            };
            img.src = imageUrl;
        });
    }
    
    handleImageContext(res, props) {
        res.props.children.push(ContextMenu.buildItem({
            type: "submenu",
            id: this.generateMenuId('image-main'),
            label: "Image Utils",
            items: [
                {
                    type: 'button',
                    id: this.generateMenuId('copy-image'),
                    label: 'Copy Image',
                    onClick: async () => {
                        ImageUtils.copyImage(props.src)
                    }
                },
                {
                    type: 'button',
                    id: this.generateMenuId('download-image'),
                    label: 'Download Image',
                    onClick: async () => {
                        const src = props.src
                        
                        let fileName = src.split('/').pop();
                        
                        if (fileName.includes('?')) {
                            fileName = fileName.split('?')[0];
                        }
                        
                        if (!fileName || fileName.trim() === '') {
                            fileName = (Math.random() * 92322323).toString().substring(0, 8) + '.png';
                        }
                        await this.downloadImage(src, fileName)
                    }
                },
                {
                    type: 'submenu',
                    id: this.generateMenuId('reverse-search'),
                    label: 'Search Engines',
                    items: this.getSearchMenuItems(props.src, runTimeHash.runtimeHashMessageKey(props.src))
                },
            ]
        }))
    }

    returnMetadata(data) {
        return { ...data }
    }

    gifRegex = Object.values(ImageAnimated).find(x=>x.toString().includes('gif'))

    start() {
        this.messageContextPatch = ContextMenu.patch("message", this.handleMessageContext.bind(this));
        this.userContextPatch = ContextMenu.patch("user-context", this.handleUserContext.bind(this));
        this.guildContextPatch = ContextMenu.patch("guild-context", this.handleGuildContext.bind(this));
        this.imageContextPatch = ContextMenu.patch("image-context", this.handleImageContext.bind(this));

        /* This doesn't pass the check outside of image components. AKA (some) embeds.*/
        /*this.gifRegex.test = function(a,b,c)
        {
            return DataStore.settings.favoriteAnything ? /\.(gif|png|jpe?g|webp)($|\?|#)/i.test(a) : /\.gif($|\?|#)/i.test(a)
        }*/

        Patcher.instead(ImageAnimated.ZP, "isAnimated", (_, [__], ret) => {
            ImageAnimated.uo = DataStore.settings.favoriteAnything ? /\.(gif|png|jpe?g|webp)($|\?|#)/i : /\.gif($|\?|#)/i
            if (!DataStore.settings.favoriteAnything) return ret(__)
            return true;
        });
        /* Doggy called this disgusting */

        Patcher.after(Media.prototype, "render", (_, __, ret) => {
            if (!DataStore.settings.enableDebugData) return ret
            return React.cloneElement(ret, {
                children: (...args) => {
                    const res = ret.props.children(...args);

                    const owner = res?._owner;
                    const data = Utils.findInTree(
                        owner.return,
                        x => x?.item,
                        { walkable: ['return', 'sourceMetadata', 'memoizedProps'] }
                    )?.item?.originalItem || owner.memoizedProps;

                    return React.createElement(MediaWrapper, {
                        children: res,
                        data: data,
                        returnMetadata: this.returnMetadata.bind(this),
                        getButtonState: this.getButtonState.bind(this),
                        downloadImage: this.downloadImage.bind(this)
                    });
                }
            });
        });
    }

    getButtonState(defaultTooltip, condition, errorTooltip) {
        return {
            disabled: !condition,
            tooltip: condition ? defaultTooltip : errorTooltip,
            tooltipColor: condition ? undefined : "red"
        };
    }

    async openModal(url, type) {
        if (!openImageModal) return;

        const dimensions = await fetchImageDimensions(url);

        const imgProps = {
            dimensions,
            original: url,
            animated: type === "gif",
            shouldAnimate: type === "gif"
        }

        openImageModal({
            className: ModalClass.modal,
            items: [
                {
                    url,
                    original: url,
                    zoomThumbnailPlaceholder: url,
                    type: "IMAGE",
                    ...imgProps,
                    ...dimensions,
                },
            ],
        })
    }

    getSettingsPanel() {
        return React.createElement(SettingsPanel, {
            settings: this.settings,
            onSettingsChange: (newSettings) => {
                this.settings = newSettings;
                this.saveSettings();
            }
        });
    }

    stop() {
        this.messageContextPatch?.();
        this.userContextPatch?.();
        this.guildContextPatch?.();
        this.imageContextPatch?.()
        Patcher.unpatchAll()
        //DOM.removeStyle('BIU')
    }
}

module.exports = ImageUtilsEnhanced;