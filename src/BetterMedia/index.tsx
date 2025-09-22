/**
 * @name BetterMedia
 * @description Makes media better? or at least try lmao
 * @version 1.0.0
 * @author Kaan
 */

const { Webpack, Patcher, DOM, Components, React, ContextMenu, UI, Net, Data } = new BdApi("BetterMedia")
const ImageComp = Webpack.getModule(x => x?.displayName == "Image", { searchExports: true })
const Popout = Webpack.getModule(m => m?.Animation, { searchExports: true, raw: true }).exports.y
const ImageRenderComponent = Webpack.getModule(x => x?.isAnimated && x?.getFormatQuality, { raw: true }).exports
const MediaModal = Webpack.getByStrings('.shouldHideMediaOptions', 'hasMediaOptions:', 'numMediaItems:', { searchExports: true })
const mediautils = Webpack.getModule(x => x?.getUserBannerURL)
const UserProfileStore = Webpack.getStore("UserProfileStore")
const GuildStoreCurrent = Webpack.getStore("SelectedGuildStore")
const GuildMemberStore = Webpack.getStore("GuildMemberStore")
const MessageStore = Webpack.getStore("MessageStore")
const SelectedChannelStore = Webpack.getStore("SelectedChannelStore")
const Toolbar = Webpack.getBySource(/spoiler:!.{1,3}.spoiler/)
const ToolbarButton = Webpack.getByStrings('actionBarIcon')
const ModalSystem = Webpack.getMangled(".modalKey?", {
    openModalLazy: Webpack.Filters.byStrings(".modalKey?"),
    openModal: Webpack.Filters.byStrings(",instant:"),
    closeModal: Webpack.Filters.byStrings(".onCloseCallback()"),
    closeAllModals: Webpack.Filters.byStrings(".getState();for")
});

const searchEngines = {
    Google: {
        url: 'https://www.google.com/searchbyimage?sbisrc=cr_1&image_url=',
        mayContainNSFW: false,
        ico: 'https://www.google.com/favicon.ico'
    },
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
    SauceNAO: {
        url: 'https://saucenao.com/search.php?db=999&url=',
        mayContainNSFW: true,
        ico: 'https://saucenao.com/favicon.ico'
    },
    IQDB: {
        url: 'https://iqdb.org/?url=',
        mayContainNSFW: true,
        ico: 'https://www.iqdb.org/favicon.ico'
    }
}

const buildSearchMenu = (url) => {
    return Object.entries(searchEngines).map(([name, engine]) => {
        const domain = extractDomain(engine.url);
        const src = engine.url + encodeURIComponent(url);

        return {
            type: 'button',
            id: `search-${name.toLowerCase()}`,
            label: name,
            iconLeft: () => <img src={engine?.fallbackIco || generateFaviconURL(domain, 16)} />,
            action: () => window.open(src, '_blank'),
            danger: engine.mayContainNSFW
        };
    });
};

const createContextMenuItem = (id, label, action, options = {}) => ({
    id,
    label,
    action,
    ...options
});

const createSubmenuItem = (id, label, items, options = {}) => ({
    id,
    label,
    type: 'submenu',
    items,
    ...options
});

const createIconItem = (id, label, icon, action, options = {}) => ({
    id,
    label,
    action,
    iconLeft: () => icon,
    ...options
});

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

const getFormatFromUrl = (url) => {
    const extension = url.split('.').pop()?.split('?')[0]?.toUpperCase();
    return extension || 'UNKNOWN';
};

const copyURL = (text) => {
    navigator.clipboard.writeText(text);
};

const openMedia = async (url: string, doBarrelRoll: boolean, buffer?: Buffer) => {
    const discordDoesntEncodeWebpsInDiscordNative = url.replace(/\.webp(\?|$)/i, '.png$1');
    const extension = getFormatFromUrl(discordDoesntEncodeWebpsInDiscordNative);
    const mediaItem = {
        url: discordDoesntEncodeWebpsInDiscordNative,
        original: discordDoesntEncodeWebpsInDiscordNative,
        proxyUrl: discordDoesntEncodeWebpsInDiscordNative,
        isAnimated: true,
        type: "IMAGE" as const,
    };

    let mediaBuffer = buffer;
    if (!mediaBuffer) {
        try {
            const response = await fetch(discordDoesntEncodeWebpsInDiscordNative);
            const arrayBuffer = await response.arrayBuffer();
            mediaBuffer = Buffer.from(arrayBuffer);
        } catch (error) {
            console.warn('openMedia: Failed to create buffer from URL:', error);
        }
    }

    const menuStuff = () => {
        return ContextMenu.buildMenu([{
            type: 'submenu',
            label: 'BetterMedia',
            items: [
                {
                    type: 'button',
                    label: 'Copy Image',
                    action: () => DiscordNative.clipboard.copyImage(mediaBuffer || discordDoesntEncodeWebpsInDiscordNative)
                }
            ]
        }])
    }

    const modalIndex = MediaModal({
        BetterMediaModal: true,
        items: [mediaItem],
        onContextMenu: (e) => {
            if (extension == "GIF") return
            return ContextMenu.open(e, menuStuff())
        },
    });

    requestAnimationFrame(() => {
        try {
            if (!buffer) return;
            const dimensionlessModule = Webpack.getModule(x => x?.dimensionlessImage);
            if (!dimensionlessModule?.dimensionlessImage) {
                console.warn('openMedia: Could not find dimensionlessImage module');
                return;
            }
            const selector = `.${dimensionlessModule.dimensionlessImage}`;
            const imageElement = document.querySelector(selector) as HTMLElement;
            if (!imageElement) {
                console.warn('openMedia: Image element not found');
                return;
            }
            // imageElement.addEventListener('contextmenu', handleContextMenu, { once: false });
            if (doBarrelRoll) {
                imageElement.classList.add('doabarrelroll');
            }
            URL.revokeObjectURL(discordDoesntEncodeWebpsInDiscordNative);
        } catch (error) {
            console.error('openMedia: Error setting up media element:', error);
        }
    });

    return modalIndex;
};

const getFileSize = async (url) => {
    try {
        const response = await Net.fetch(url, { method: 'HEAD' });
        const size = response.headers.get('content-length');
        if (size) {
            const bytes = parseInt(size);
            if (bytes < 1024) return `${bytes} B`;
            if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
            if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
            return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
        }
    } catch (error) {
        console.warn('Failed to get file size:', error);
    }
    return 'Unknown';
};


const InformationPopout = ({ url, provider, ...props }) => {
    const [getSize, setSize] = React.useState("Requesting...");

    React.useEffect(() => {
        const getSize = async () => {
            const result = await getFileSize(url)
            setSize(result)
        }
        getSize();
    }, [url])

    return (
        <div className="bm-popout" {...props}>
            <div className="bm-popout-title">Image Info</div>
            <div className="bm-popout-format">
                Name: <span className="bm-popout-format-value"> {getFileNameOwO(url)} </span>
            </div>
            <div className="bm-popout-format">
                Provider: <span className="bm-popout-format-value">{provider}</span>
            </div>
            <div className="bm-popout-format">
                Size: <span className="bm-popout-format-value">{getSize}</span>
            </div>
            <div className="bm-popout-format">
                Format: <span className="bm-popout-format-value">{getFormatFromUrl(url)}</span>
            </div>
            <div className="bm-popout-url-label">URL:</div>
            <div className="bm-popout-url" onClick={() => copyURL(url)} title="Click to copy">
                {url}
            </div>
        </div>
    );
};

function getFileNameOwO(file) {
    const input = typeof file === 'string' ? file : file.name;
    const cleaned = input.split('?')[0].split('#')[0];
    const segments = cleaned.split(/[/\\]/);
    return segments.pop();
}

var createDownloadLink = async (url, filename) => {
    try {
        let blob;
        if (url.startsWith("data:")) {
            const [header, data] = url.split(",");
            if (!header || !data) return "";
            const mimeType = header.match(/:(.*?);/)?.[1] || "audio/ogg";
            const binary = atob(data);
            blob = new Blob([new Uint8Array([...binary].map((c) => c.charCodeAt(0)))], { type: mimeType });
        } else {
            blob = await (await Net.fetch(url)).blob();
        }
        const a = Object.assign(document.createElement("a"), {
            href: URL.createObjectURL(blob),
            download: filename || "download.ogg"
        });
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        UI.showToast("Download started!", { type: "success" });
    } catch (error) {
        UI.showToast("Download failed!", { type: "error" });
    }
};

const openInBrowser = (url) => window.open(url, '_blank');

const MediaContainer = ({ url: urlA, width, isThirdParty, provider }) => {
    const url = isThirdParty ? urlA || "" : (() => {
        if (urlA == undefined || urlA == null || urlA == "") return "";

        try {
            const urlObj = new URL(urlA);
            urlObj.searchParams.delete('width');
            urlObj.searchParams.delete('height');
            urlObj.searchParams.set('size', '4096');
            return urlObj.toString();
        } catch (error) {
            console.warn('Invalid URL provided to MediaContainer:', urlA, error);
            return urlA || "";
        }
    })() || "";

    const owoRef = React.useRef(null)
    const containerWidth = Math.max(width - 20, 60);
    const [open, setOpen] = React.useState(false)
    const [shouldShow, setShouldShow] = useSetting('showToolbar', true)
    const iconWidth = 24;
    const totalIconsWidth = iconWidth * 5;
    const availableSpaceForGaps = containerWidth - totalIconsWidth - 10;
    const gap = Math.max(Math.min(availableSpaceForGaps / 4, 20), 5);

    const buildSearchMenu = () => {
        const reverseSearchItems = Object.entries(searchEngines).map(([name, engine]) => {
            const domain = extractDomain(engine.url);
            const src = engine.url + encodeURIComponent(url)

            return createIconItem(
                `search-${name.toLowerCase()}`,
                name,
                <img src={generateFaviconURL(domain, 16)} />,
                () => window.open(src, '_blank'),
                { color: engine.mayContainNSFW ? 'danger' : 'brand' }
            );
        });

        return [createSubmenuItem('reverse-search', 'Reverse Search', reverseSearchItems), createSubmenuItem('canvas-methods', "Canvas Methods", createCanvasMenu(url)), createContextMenuItem('disable-toolbar', "Disable Toolbar", () => {
            setShouldShow(false);
            DataStore.settings.showToolbar = false;
        })];
    };

    return shouldShow && (
        <div className="bm-media-container">
            <div className="bm-media-controls" style={{ gap: `${gap}px` }}>
                <Components.Tooltip text="Download">
                    {(props) => <ArrowDownload {...props} className="bm-icon" onClick={() => createDownloadLink(url, Date.now())} />}
                </Components.Tooltip>
                <Components.Tooltip text="Copy URL">
                    {(props) => <Clipboard {...props} className="bm-icon" onClick={() => copyURL(url)} />}
                </Components.Tooltip>
                <Components.Tooltip text="Open in Browser">
                    {(props) => <ArrowUpRightDashes {...props} className="bm-icon" onClick={() => openInBrowser(url)} />}
                </Components.Tooltip>
                <div ref={owoRef}>
                    <Popout
                        shouldShow={open}
                        position="bottom"
                        targetElementRef={owoRef}
                        onRequestClose={() => setOpen(false)}
                        clickTrap={true}
                        renderPopout={(props) => <InformationPopout provider={provider} url={url} {...props}></InformationPopout>}
                    >
                        {(props) => (
                            <div {...props} ref={owoRef} onClick={() => setOpen(true)}>
                                <Components.Tooltip text="Information">
                                    {(propsA) => <BookInformation24Regular {...propsA} className="bm-icon" />}
                                </Components.Tooltip>
                            </div>
                        )}
                    </Popout>
                </div>
                <Components.Tooltip text="More">
                    {(props) => <Settings16Filled {...props} onClick={(e) => {
                        ContextMenu.open(e, ContextMenu.buildMenu(buildSearchMenu()));
                    }} className="bm-icon" />}
                </Components.Tooltip>
            </div>
        </div>
    )
}

const OpenIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" {...props}>
        <path fill="currentColor" d="M2 5.25A3.25 3.25 0 0 1 5.25 2h5.5A3.25 3.25 0 0 1 14 5.25v2a.75.75 0 0 1-1.5 0v-2a1.75 1.75 0 0 0-1.75-1.75h-5.5A1.75 1.75 0 0 0 3.5 5.25v5.5c0 .966.784 1.75 1.75 1.75h3a.75.75 0 0 1 0 1.5h-3A3.25 3.25 0 0 1 2 10.75v-5.5Zm4 1.5A.75.75 0 0 1 6.75 6h3.5a.75.75 0 0 1 0 1.5H8.56l4.22 4.22a.75.75 0 1 1-1.06 1.06L7.5 8.56v1.69a.75.75 0 0 1-1.5 0v-3.5Z"></path>
    </svg>
)

const CopyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
    </svg>
);

const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
);

const CanvasIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" {...props}>
        <g fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" color="currentColor">
            <path d="M4 8c0-2.828 0-4.243 1.004-5.121S7.624 2 10.857 2h2.286c3.232 0 4.849 0 5.853.879C20 3.757 20 5.172 20 8v9H4zm-1 9h18"></path>
            <path d="M10.699 5.566c1.23-.176 3.268-.106 1.581 1.587c-2.108 2.115-5.272 6.876-1.581 5.29c3.69-1.588 5.272-.53 3.69 1.057M12 17v4m-7 1l3-5m11 5l-3-5"></path>
        </g>
    </svg>
)

const ImageIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
    </svg>
);

const BannerIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 17h14v2H5zm4.5-4.2h1l.9 2.2h.9l-2.1-5h-.9L7.2 15h.9l.4-2.2zm.2-1.5L10.2 9l.5 2.3h-1zm4.3 3.7h.9v-1.3h1.3v-.8h-1.3V12h1.5v-.8h-2.4V15z" />
    </svg>
);

const MainMenuIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" {...props}>
        <path fill="currentColor" fillRule="evenodd" d="M13 2.5H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5ZM3 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H3Zm9 9.857L9.5 8l-2.476 2.83L5.5 9L4 10.8V12h8v-1.143ZM6.5 8a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3Z" clipRule="evenodd"></path>
    </svg>
)

const BookInformation24Regular = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path fill="var(--interactive-normal)" d="M4 4.5A2.5 2.5 0 0 1 6.5 2H18a2.5 2.5 0 0 1 2.5 2.5v14.25a.75.75 0 0 1-.75.75H5.5a1 1 0 0 0 1 1h13.25a.75.75 0 0 1 0 1.5H6.5A2.5 2.5 0 0 1 4 19.5v-15ZM12.25 8a1 1 0 1 0 0-2a1 1 0 0 0 0 2Zm-.75 1.75v5a.75.75 0 0 0 1.5 0v-5a.75.75 0 0 0-1.5 0Z"></path>
    </svg>
)

const ArrowDownload = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" {...props}>
        <path fill="var(--interactive-normal)" d="M3.5 13h9a.75.75 0 0 1 .102 1.493l-.102.007h-9a.75.75 0 0 1-.102-1.493L3.5 13h9h-9ZM7.898 1.007L8 1a.75.75 0 0 1 .743.648l.007.102v7.688l2.255-2.254a.75.75 0 0 1 .977-.072l.084.072a.75.75 0 0 1 .072.977l-.072.084L8.53 11.78a.75.75 0 0 1-.976.073l-.084-.073l-3.536-3.535a.75.75 0 0 1 .977-1.133l.084.072L7.25 9.44V1.75a.75.75 0 0 1 .648-.743L8 1l-.102.007Z"></path>
    </svg>
)

const Clipboard = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 18 18" {...props}>
        <path fill="var(--interactive-normal)" d="M11.873 3H12.75A2.25 2.25 0 0 1 15 5.25v9A2.25 2.25 0 0 1 12.75 16.5h-7.5A2.25 2.25 0 0 1 3 14.25v-9A2.25 2.25 0 0 1 5.25 3h.877A2.25 2.25 0 0 1 8.25 1.5h1.5a2.25 2.25 0 0 1 2.123 1.5M7.5 3.75a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0-.75.75"></path>
    </svg>
)

const ArrowUpRightDashes = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path fill="var(--interactive-normal)" d="M11 3a1 1 0 1 0 0 2h6.586l-2.293 2.293a1 1 0 0 0 1.414 1.414L19 6.414V13a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1zm2.707 8.707a1 1 0 0 0-1.414-1.414l-3 3a1 1 0 1 0 1.414 1.414zm-6 6a1 1 0 1 0-1.414-1.414l-3 3a1 1 0 1 0 1.414 1.414z"></path>
    </svg>
)

const Settings16Filled = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" {...props}>
        <path fill="var(--interactive-normal)" d="M7.999 2c-.37 0-.731.036-1.08.106a.5.5 0 0 0-.394.396l-.262 1.354a.417.417 0 0 1-.545.315l-1.307-.45a.5.5 0 0 0-.538.141A5.495 5.495 0 0 0 2.786 5.74a.5.5 0 0 0 .146.538l1.045.907a.417.417 0 0 1 0 .63l-1.045.907a.5.5 0 0 0-.146.537a5.5 5.5 0 0 0 1.087 1.878a.5.5 0 0 0 .538.142l1.307-.45a.417.417 0 0 1 .545.314l.262 1.355a.5.5 0 0 0 .393.396a5.525 5.525 0 0 0 2.17-.002a.5.5 0 0 0 .393-.395l.262-1.354a.417.417 0 0 1 .545-.315l1.3.45a.5.5 0 0 0 .538-.143a5.495 5.495 0 0 0 1.087-1.882a.5.5 0 0 0-.146-.537l-1.039-.902a.417.417 0 0 1 0-.629l1.04-.902a.5.5 0 0 0 .145-.537a5.496 5.496 0 0 0-1.087-1.881a.5.5 0 0 0-.538-.143l-1.3.45a.417.417 0 0 1-.545-.316l-.262-1.353a.5.5 0 0 0-.392-.395A5.524 5.524 0 0 0 7.999 2ZM6.5 7.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0Zm4.663 4.947a.459.459 0 0 1 .526-.152l.8.276a.455.455 0 0 0 .594-.343l.16-.83a.459.459 0 0 1 .396-.38a3.554 3.554 0 0 1 .719 0c.202.02.356.18.395.38l.16.83a.455.455 0 0 0 .595.343l.8-.276a.46.46 0 0 1 .526.152c.14.194.261.403.36.623a.459.459 0 0 1-.13.532l-.64.555a.455.455 0 0 0 0 .686l.64.555a.459.459 0 0 1 .13.532c-.099.22-.22.429-.36.623a.46.46 0 0 1-.526.152l-.8-.276a.455.455 0 0 0-.594.343l-.16.83a.459.459 0 0 1-.396.38a3.554 3.554 0 0 1-.719 0a.459.459 0 0 1-.395-.38l-.161-.83a.455.455 0 0 0-.595-.343l-.799.276a.46.46 0 0 1-.526-.152a3.493 3.493 0 0 1-.36-.623a.459.459 0 0 1 .13-.532l.64-.555a.455.455 0 0 0 0-.686l-.64-.555a.459.459 0 0 1-.13-.532c.099-.22.22-.429.36-.623ZM15 14.5a1 1 0 1 0-2 0a1 1 0 0 0 2 0Z"></path>
    </svg>
)

const Rotate = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" {...props}>
        <path fill="var(--interactive-normal)" d="M15 3v2h1V3h-1zm-2.156.438L12 3.655l-.03.03l-.033.002l-.843.312h-.03l-.033.03l-.092.032l.843 1.813h.033l.062-.03l.688-.25l.062-.032l.78-.22l-.56-1.905zM20 4v8h2V6.78c3.03 1.98 5 5.28 5 9.22c0 6.055-4.945 11-11 11S5 22.055 5 16v-1H3v1c0 7.145 5.855 13 13 13s13-5.855 13-13c0-4.06-1.795-7.615-4.656-10H28V4h-8zM9.156 5l-.53.344l-.032.03h-.03l-.69.532l-.03.032h-.032l-.28.25l1.312 1.5l.22-.188l.06-.03l.563-.44L9.75 7l.47-.313L9.155 5zM6.094 7.594l-.22.28l-.03.032l-.032.032l-.53.687v.03l-.032.033l-.344.53l1.688 1.095l.28-.47l.064-.062l.437-.592l.03-.032l.22-.25l-1.53-1.312zM3.97 11l-.033.125l-.03.03v.033L3.593 12v.03l-.03.064l-.22.844l1.906.53l.22-.78l.03-.063l.25-.688l.03-.062v-.03L3.97 11z"></path>
    </svg>
)

const UserIcon = (props) => {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20"><path fill="var(--interactive-normal)" d="M10 2a4 4 0 1 0 0 8a4 4 0 0 0 0-8Zm-4.991 9A2.001 2.001 0 0 0 3 13c0 1.691.833 2.966 2.135 3.797C6.417 17.614 8.145 18 10 18c1.855 0 3.583-.386 4.865-1.203C16.167 15.967 17 14.69 17 13a2 2 0 0 0-2-2H5.009Z"></path></svg>
}

const GuildIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="var(--interactive-normal)" d="M11.414 1.586A2 2 0 0 0 10 1H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V3a2 2 0 0 0-.586-1.414ZM9.853 12.854a.5.5 0 0 1-.354.146h-3a.5.5 0 1 1 0-1h3a.5.5 0 0 1 .354.854Zm0-2a.5.5 0 0 1-.354.146h-3a.5.5 0 1 1 0-1h3a.5.5 0 0 1 .354.854Zm0-6A.5.5 0 0 1 9.499 5h-3a.498.498 0 0 1-.5-.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .354.854Z"></path></svg>
)

const Eye = (props) => (
    <svg
        {...props}
        viewBox="0 0 24 24"
        width="24" height="24"
    >
        <path fill="var(--interactive-normal)"
            d="M12 5C5.648 5 1 12 1 12C1 12 5.648 19 12 19C18.352 19 23 12 23 12C23 12 18.352 5 12 5ZM12 16C9.791 16 8 14.21 8 12C8 9.79 9.791 8 12 8C14.209 8 16 9.79 16 12C16 14.21 14.209 16 12 16Z M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
        />
    </svg>
);

const EyeClose = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 89.9801 1200 1020"
        width="24" height="24"
    >
        <path
            d="M669.727,273.516c-22.891-2.476-46.15-3.895-69.727-4.248c-103.025,0.457-209.823,25.517-310.913,73.536  c-75.058,37.122-148.173,89.529-211.67,154.174C46.232,529.978,6.431,577.76,0,628.74c0.76,44.162,48.153,98.67,77.417,131.764  c59.543,62.106,130.754,113.013,211.67,154.174c2.75,1.335,5.51,2.654,8.276,3.955l-75.072,131.102l102.005,60.286l551.416-960.033  l-98.186-60.008L669.727,273.516z M902.563,338.995l-74.927,129.857c34.47,44.782,54.932,100.006,54.932,159.888  c0,149.257-126.522,270.264-282.642,270.264c-6.749,0-13.29-0.728-19.922-1.172l-49.585,85.84c22.868,2.449,45.99,4.233,69.58,4.541  c103.123-0.463,209.861-25.812,310.84-73.535c75.058-37.122,148.246-89.529,211.743-154.174  c31.186-32.999,70.985-80.782,77.417-131.764c-0.76-44.161-48.153-98.669-77.417-131.763  c-59.543-62.106-130.827-113.013-211.743-154.175C908.108,341.478,905.312,340.287,902.563,338.995L902.563,338.995z   M599.927,358.478c6.846,0,13.638,0.274,20.361,0.732l-58.081,100.561c-81.514,16.526-142.676,85.88-142.676,168.897  c0,20.854,3.841,40.819,10.913,59.325c0.008,0.021-0.008,0.053,0,0.074l-58.228,100.854  c-34.551-44.823-54.932-100.229-54.932-160.182C317.285,479.484,443.808,358.477,599.927,358.478L599.927,358.478z M768.896,570.513  L638.013,797.271c81.076-16.837,141.797-85.875,141.797-168.603C779.81,608.194,775.724,588.729,768.896,570.513L768.896,570.513z"
            fill="var(--interactive-normal)"
        />
    </svg>
);

const rotateImage = (url: string, rotation: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext('2d');

        const image = new Image();
        image.crossOrigin = 'anonymous';

        image.onload = function () {
            const radians = (rotation * Math.PI) / 180;
            const isRotated = Math.abs(Math.sin(radians)) > 0.5;

            if (isRotated) {
                canvas.width = image.naturalHeight;
                canvas.height = image.naturalWidth;
            } else {
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
            }

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            ctx?.save();
            ctx?.translate(centerX, centerY);
            ctx?.rotate(radians);
            ctx?.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
            ctx?.restore();

            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('no data. omegalul'));
                }
            }, 'image/png');
        };

        image.onerror = function (e) {
            reject("ACK? CORS?");
        };

        image.src = url;
    });
};

const deepFryImage = (url: string, intensity: number = 2): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.crossOrigin = 'anonymous';

        image.onload = function () {
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            ctx?.drawImage(image, 0, 0);

            const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
            if (!imageData) return reject("Failed to get image data");

            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * intensity);
                data[i + 1] = Math.min(255, data[i + 1] * intensity);
                data[i + 2] = Math.min(255, data[i + 2] * intensity);
            }

            ctx?.putImageData(imageData, 0, 0);

            canvas.toBlob((blob) => {
                blob ? resolve(blob) : reject(new Error('Deep fry failed'));
            }, 'image/png');
        };

        image.onerror = () => reject("Image load failed");
        image.src = url;
    });
};

const addGlowEffect = (url: string, color: string = '#00ff00', intensity: number = 20): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.crossOrigin = 'anonymous';

        image.onload = function () {
            const padding = intensity * 2;
            canvas.width = image.naturalWidth + padding;
            canvas.height = image.naturalHeight + padding;

            if (!ctx) return reject("No context");

            ctx.shadowColor = color;
            ctx.shadowBlur = intensity;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            for (let i = 0; i < 3; i++) {
                ctx.drawImage(image, padding / 2, padding / 2);
            }

            canvas.toBlob((blob) => {
                blob ? resolve(blob) : reject(new Error('Glow effect failed'));
            }, 'image/png');
        };

        image.onerror = () => reject("Image load failed");
        image.src = url;
    });
};

const makeCircularPfp = (url: string, borderColor: string = '#7289da', borderWidth: number = 8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.crossOrigin = 'anonymous';

        image.onload = function () {
            const size = Math.min(image.naturalWidth, image.naturalHeight);
            canvas.width = size + borderWidth * 2;
            canvas.height = size + borderWidth * 2;

            if (ctx) {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const radius = size / 2;

                ctx.beginPath();
                ctx.arc(centerX, centerY, radius + borderWidth, 0, Math.PI * 2);
                ctx.fillStyle = borderColor;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.clip();

                const offsetX = (image.naturalWidth - size) / 2;
                const offsetY = (image.naturalHeight - size) / 2;
                ctx.drawImage(image, -offsetX + borderWidth, -offsetY + borderWidth);
            }

            canvas.toBlob((blob) => {
                blob ? resolve(blob) : reject(new Error('Circular pfp failed'));
            }, 'image/png');
        };

        image.onerror = () => reject("Image load failed");
        image.src = url;
    });
};

const rgbShift = (url: string, offset: number = 5): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.crossOrigin = 'anonymous';

        image.onload = function () {
            canvas.width = image.naturalWidth + offset * 2;
            canvas.height = image.naturalHeight + offset * 2;

            if (ctx) {
                ctx.globalCompositeOperation = 'screen';
                ctx.fillStyle = 'red';
                ctx.globalAlpha = 0.33;
                ctx.drawImage(image, offset * 2, 0);

                ctx.fillStyle = 'lime';
                ctx.drawImage(image, offset, offset);

                ctx.fillStyle = 'blue';
                ctx.drawImage(image, 0, offset * 2);
            }

            canvas.toBlob((blob) => {
                blob ? resolve(blob) : reject(new Error('RGB shift failed'));
            }, 'image/png');
        };

        image.onerror = () => reject("Image load failed");
        image.src = url;
    });
};

const css = `
.altText {
    color: var(--text-muted);
    display: inline-block;
    font-size: 12px;
    font-weight: var(--font-weight-medium);
    line-height: 16px;
    margin: .25rem 0 .75rem;
}

/* I miss sera.. :( */
.doabarrelroll {
    animation: barrel-roll 0.1s linear infinite;
    transform-origin: center center;
}

@keyframes barrel-roll {
    0% {
        transform: rotate(0deg);
    }
    25% {
        transform: rotate(90deg);
    }
    50% {
        transform: rotate(180deg);
    }
    75% {
        transform: rotate(270deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.bm-popout {
    background: var(--background-base-low);
    border-radius: 8px;
    padding: 16px;
    width: 260px;
    color: var(--text-default);
    font-size: 14px;
    box-shadow: var(--elevation-high);
    border: 1px solid var(--background-modifier-accent);
}

.bm-popout-title {
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--text-default);
}

.bm-popout-format {
    color: var(--text-muted);
    font-size: 13px;
    margin-bottom: 12px;
}

.bm-popout-format-value {
    color: var(--text-default);
    font-weight: 500;
    word-wrap: break-word;
}

.bm-popout-url-label {
    color: var(--text-muted);
    font-size: 13px;
    margin-bottom: 8px;
}

.bm-popout-url {
    background: var(--background-base-lower);
    padding: 10px;
    border-radius: 6px;
    font-size: 12px;
    word-break: break-all;
    cursor: pointer;
    overflow: hidden;
    color: var(--text-default);
    transition: background 0.15s ease;
}

.bm-popout-url:hover {
    background: var(--background-base-lowest);
}

.bm-filename {
    font-size: 13px;
    font-weight: 500;
    opacity: 0.9;
    text-overflow: ellipsis;
    white-space: wrap;
    margin-bottom: 8px;
    overflow: hidden;
}

.bm-media-container {
    position: absolute;
    bottom: 5px;
    pointer-events: auto;
    left: 5px;
    right: 5px;
    cursor: default;
    user-select: text;
    z-index: 10;
    background: var(--opacity-black-60);
    padding: 10px;
    border-radius: 8px;
    color: var(--text-normal);
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.bm-media-controls {
    display: flex;
    justify-content: center;
    align-items: center;
}

.bm-icon {
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s ease;
    color: var(--interactive-normal);
    width: 24px;
    height: 24px;
}

.bm-icon:hover {
    opacity: 1;
    color: var(--interactive-hover);
}`;

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
            return true;
        },
    }
);

const settings = {
    allImagesAreGifs: true
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

class SettingsStore extends InternalStore {
    static displayName = "SettingsStore";

    constructor() {
        super();
        this.settings = {};
        this.initialize();
    }

    initialize() {
        this.settings = DataStore.settings || {};
    }

    getSetting(key, defaultValue) {
        return this.settings[key] ?? defaultValue;
    }

    setSetting(key, value) {
        this.settings[key] = value;
        DataStore.settings = this.settings;
        this.emit();
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        DataStore.settings = this.settings;
        this.emit();
    }
}

const settingsStore = new SettingsStore();

const uoOrg = ImageRenderComponent.uo

const RotateIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 6v3l4-4-4-4v3c-5.5 0-10 4.5-10 10 0 2.2.7 4.2 1.9 5.8l1.4-1.4C4.5 16.8 4 14.5 4 12c0-4.4 3.6-8 8-8z" /><path d="M20 12c0-4.4-3.6-8-8-8v1.8c3.4 0 6.2 2.8 6.2 6.2 0 2.5-1.5 4.7-3.6 5.7l1.4 1.4c2.3-1.3 3.8-3.7 3.8-6.3z" /></svg>
const FireIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" /></svg>
const SparklesIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="m9 11 3-3 3 3-3 3-3-3z" /><path d="M18.5 6.5 21 4l-2.5-2.5L16 4l2.5 2.5zM18.5 17.5 21 20l-2.5 2.5L16 20l2.5-2.5zM5.5 6.5 8 4 5.5 1.5 3 4l2.5 2.5zM5.5 17.5 8 20l-2.5 2.5L3 20l2.5-2.5z" /></svg>
const UserCircleIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>
const ZapIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 1 8.5 8.5H1l4.5 6L10 22l4.5-7.5H22l-4.5-6L13 1z" /></svg>

function createCanvasMenu(url) {
    const rotations = [90, 180, 270, 360];
    const rotationMenu = rotations.map(a => {
        return {
            type: 'button',
            id: a == 360 ? "do a barrel roll~" : `${a}-based`,
            label: a == 360 ? "do a barrel roll~" : `Rotate ${a}°`,
            iconLeft: () => <CanvasIcon />,
            action: async () => {
                const blob = await rotateImage(url, a);
                const buffer = Buffer.from(await blob.arrayBuffer());
                const urlLocal = URL.createObjectURL(blob);
                openMedia(urlLocal, a == 360, buffer);
            }
        };
    });

    const deepFryIntensities = [1.5, 2, 3, 4];
    const deepFryMenu = deepFryIntensities.map(intensity => {
        return {
            type: 'button',
            id: `deepfry-${intensity}`,
            label: intensity >= 3 ? `Nuclear Fry (${intensity}x)` : `Deep Fry (${intensity}x)`,
            iconLeft: () => <FireIcon />,
            action: async () => {
                const blob = await deepFryImage(url, intensity);
                const buffer = Buffer.from(await blob.arrayBuffer());
                const urlLocal = URL.createObjectURL(blob);
                openMedia(urlLocal, false, buffer);
            }
        };
    });

    const glowOptions = [
        { color: '#00ff00', name: 'Matrix Green', intensity: 20 },
        { color: '#ff0080', name: 'Neon Pink', intensity: 25 },
        { color: '#00ffff', name: 'Cyan', intensity: 20 },
        { color: '#ffff00', name: 'Electric Yellow', intensity: 15 },
        { color: '#ff4500', name: 'Fire Orange', intensity: 30 }
    ];
    const glowMenu = glowOptions.map(option => {
        return {
            type: 'button',
            id: `glow-${option.name.toLowerCase().replace(' ', '-')}`,
            label: option.name,
            iconLeft: () => <SparklesIcon />,
            action: async () => {
                const blob = await addGlowEffect(url, option.color, option.intensity);
                const buffer = Buffer.from(await blob.arrayBuffer());
                const urlLocal = URL.createObjectURL(blob);
                openMedia(urlLocal, false, buffer);
            }
        };
    });

    const pfpOptions = [
        { color: '#7289da', name: 'Discord Blue', width: 8 },
        { color: '#ff0000', name: 'Red Border', width: 10 },
        { color: '#00ff00', name: 'Green Border', width: 8 },
        { color: '#ffff00', name: 'Gold Border', width: 12 },
        { color: '#ff00ff', name: 'Magenta Border', width: 8 }
    ];
    const pfpMenu = pfpOptions.map(option => {
        return {
            type: 'button',
            id: `pfp-${option.name.toLowerCase().replace(' ', '-')}`,
            label: option.name,
            iconLeft: () => <UserCircleIcon />,
            action: async () => {
                const blob = await makeCircularPfp(url, option.color, option.width);
                const buffer = Buffer.from(await blob.arrayBuffer());
                const urlLocal = URL.createObjectURL(blob);
                openMedia(urlLocal, false, buffer);
            }
        };
    });

    const rgbShiftIntensities = [3, 5, 8, 12, 20];
    const rgbShiftMenu = rgbShiftIntensities.map(offset => {
        return {
            type: 'button',
            id: `rgb-shift-${offset}`,
            label: offset >= 12 ? `Glitch Hard (${offset}px)` : `RGB Shift (${offset}px)`,
            iconLeft: () => <ZapIcon />,
            action: async () => {
                const blob = await rgbShift(url, offset);
                const buffer = Buffer.from(await blob.arrayBuffer());
                const urlLocal = URL.createObjectURL(blob);
                openMedia(urlLocal, false, buffer);
            }
        };
    });

    return [
        {
            type: 'submenu',
            id: 'rotation-menu',
            label: "Rotations",
            items: rotationMenu,
            iconLeft: () => <RotateIcon />
        },
        {
            type: 'submenu',
            id: 'deepfry-menu',
            label: "Deep Fry",
            items: deepFryMenu,
            iconLeft: () => <FireIcon />
        },
        {
            type: 'submenu',
            id: 'glow-menu',
            label: "Glow Effects",
            items: glowMenu,
            iconLeft: () => <SparklesIcon />
        },
        {
            type: 'submenu',
            id: 'pfp-menu',
            label: "Profile Pictures",
            items: pfpMenu,
            iconLeft: () => <UserCircleIcon />
        },
        {
            type: 'submenu',
            id: 'rgb-menu',
            label: "RGB Glitch",
            items: rgbShiftMenu,
            iconLeft: () => <ZapIcon />
        }
    ];
}


const provider = /\/external\/[^\/]+\/https\/([^\/]+)/

function getImageProvider(imageArgs, mainURL) {
    const potentialDiscordUrl = imageArgs?.src || imageArgs?.original;

    if (potentialDiscordUrl && potentialDiscordUrl.includes('discordapp')) {
        const providerMatch = provider.exec(potentialDiscordUrl);
        if (providerMatch && providerMatch[1]) {
            return providerMatch[1].toUpperCase();
        }
    }

    if (mainURL) {
        const domain = extractDomain(mainURL);
        return domain ? domain.toUpperCase() : 'UNKNOWN';
    }

    return 'UNKNOWN';
}

const useSetting = (key, defaultValue) => {
    const [value, setValue] = React.useState(() =>
        settingsStore.getSetting(key, defaultValue)
    );

    React.useEffect(() => {
        const updateValue = () => {
            setValue(settingsStore.getSetting(key, defaultValue));
        };

        settingsStore.addChangeListener(updateValue);

        return () => {
            settingsStore.removeChangeListener(updateValue);
        };
    }, [key, defaultValue]);

    const setSetting = (newValue) => {
        settingsStore.setSetting(key, newValue);
    };

    return [value, setSetting];
};


export default class BetterMedia {
    async start() {
        DataStore.settings ??= settings

        DOM.addStyle('BetterMedia', css)
        Patcher.after(ImageComp, 'render', (_, args, res) => {
            args[0].srcIsAnimated = true;

            const isThirdPartyFailure = (args[0].src === "");
            const imageParent = res.props?.focusTarget?.current;

            const mainURL = isThirdPartyFailure
                ? args[0].original
                : (args[0].dataSafeSrc || args[0].src || args[0].original);

            const imageProvider = getImageProvider(args[0], mainURL);

            if (res.props?.focusTarget?.current != null) {
                res.props.children.props.children.push(
                    <MediaContainer
                        provider={imageProvider}
                        url={mainURL}
                        width={imageParent.clientWidth ?? 102}
                        isThirdParty={Boolean(args[0]?.dataSafeSrc)}
                    />
                );
            }
        });

        Patcher.before(Webpack.getByStrings('.shouldHideMediaOptions', 'hasMediaOptions:', 'numMediaItems:', { searchExports: true, raw: true }).exports, 'K', (_, args) => {
            const chatAttachments = MessageStore.getMessages(SelectedChannelStore.getChannelId())._array
                .reduce((acc, x) => {
                    if (x?.attachments) {
                        acc.push(...x.attachments);
                    }
                    return acc;
                }, []);

            if (args[0].BetterMediaModal == undefined && args[0].location !== "ChannelAttachmentUpload") {
                const firstOriginalItem = args[0].items?.[0];

                const existingUrls = new Set(args[0].items?.map(item => item.url) || []);

                const filteredAttachments = chatAttachments.filter(attachment => {
                    const url = attachment.original || attachment.proxy_url;
                    const processedUrl = url.replace(/\.webp(\?|$)/i, '.png$1');
                    return !existingUrls.has(processedUrl);
                });

                const mediaItems = filteredAttachments.map(attachment => {
                    const url = attachment.url || attachment.proxy_url;
                    const discordDoesntEncodeWebpsInDiscordNative = url.replace(/\.webp(\?|$)/i, '.png$1');
                    return {
                        url: discordDoesntEncodeWebpsInDiscordNative,
                        original: discordDoesntEncodeWebpsInDiscordNative,
                        proxyUrl: discordDoesntEncodeWebpsInDiscordNative,
                        isAnimated: true,
                        type: "IMAGE" as const,
                    };
                });

                args[0].items = firstOriginalItem ? [firstOriginalItem, ...mediaItems] : mediaItems;
            }
        })

        Patcher.after(Toolbar, 'Z', (_, [args], returnValue) => {
            if (returnValue?.props?.actions?.props?.children && args?.upload?.item?.file) {
                const fileBuffer = args.upload.item.file;

                returnValue.props.actions.props.children.unshift(
                    <ToolbarButton tooltip="Edit Upload" onClick={() => {
                        ModalSystem.openModal((modalProps) =>
                            <div {...modalProps}> hi pp </div>//<CanvasHolder {...modalProps} fileBuffer={fileBuffer}/>
                        );
                    }}>
                        <Settings16Filled />
                    </ToolbarButton>
                );
            }
        });

        /*Patcher.after(VideoComponent.prototype, 'render', (_, args, res) => {
            const data = args.props
 
            return <video src={data?.embed.url}>  </video>
        })*/

        ImageRenderComponent.uo = DataStore.settings.allImagesAreGifs ? /.{1,3}/ : uoOrg

        Patcher.instead(ImageRenderComponent.ZP, "isAnimated", (_, [__], ret) => {
            return true;
        });

        ContextMenu.patch("user-context", this.AUCM)
        ContextMenu.patch("image-context", this.AICM)
    }

    AICM(res, props) {
        const url = props.src

        const buildProfilePictureMenu = () => {
            return [
                {
                    type: 'submenu',
                    id: 'reverse-search',
                    label: 'Reverse Search',
                    iconLeft: () => <SearchIcon />,
                    items: buildSearchMenu(url)
                },
                {
                    type: 'submenu',
                    id: 'canvas-methods',
                    label: 'Canvas Methods',
                    iconLeft: () => <CanvasIcon />,
                    items: createCanvasMenu(url)
                }
            ];
        };

        const betterMediaMenu = {
            type: 'submenu',
            id: 'better-media',
            label: 'BetterMedia',
            iconLeft: () => <MainMenuIcon />,
            items: buildProfilePictureMenu()
        };

        res.props.children.push(ContextMenu.buildItem(betterMediaMenu))
    }

    AUCM(res, props) {
        const isInGuild = (GuildStoreCurrent.getGuildId() != null);
        const user = props.user;

        const userProfile = UserProfileStore.getUserProfile(user.id);
        const guildMemberProfile = isInGuild ? UserProfileStore.getGuildMemberProfile(user.id, GuildStoreCurrent.getGuildId()) : null;

        const normalImg = mediautils.getUserAvatarURL({ id: user.id, avatar: user.avatar, discriminator: null }, true, 4096, "png", false);
        const normalBanner = mediautils.getUserBannerURL({ id: user.id, banner: userProfile?.banner, size: 4096, canAnimate: true });

        const guildMember = isInGuild ? GuildMemberStore.getMember(GuildStoreCurrent.getGuildId(), user.id) : null;

        const guildImg = isInGuild ? mediautils.getGuildMemberAvatarURL({ guildId: GuildStoreCurrent.getGuildId(), userId: user.id, avatar: guildMember?.avatar, discriminator: null }, true, 4096, "png", false)?.replace('?size=96', '?size=4096') : null;
        const guildBanner = isInGuild ? mediautils.getGuildMemberBannerURL({ id: user.id, guildId: GuildStoreCurrent.getGuildId(), banner: guildMemberProfile?.banner, size: 4096, canAnimate: true }) : null;

        const isAnimated = user.avatar && user.avatar.startsWith('a_');
        const isAnimatedBanner = userProfile?.banner && userProfile.banner.startsWith('a_');
        const isAnimatedGuildBanner = guildMemberProfile?.banner && guildMemberProfile.banner.startsWith('a_');

        const animatedNormalImg = isAnimated ? normalImg.replace('.png', '.gif').replace('.webp', '.gif') : null;
        const animatedNormalBanner = isAnimatedBanner ? normalBanner.replace('.png', '.gif').replace('.webp', '.gif') : null;
        const animatedGuildImg = isAnimated && guildImg ? guildImg.replace('.png', '.gif').replace('.webp', '.gif') : null;
        const animatedGuildBanner = isAnimatedGuildBanner && guildBanner ? guildBanner.replace('.png', '.gif').replace('.webp', '.gif') : null;

        const buildMediaMenu = (img, banner, animatedImg, animatedBanner, isAnimatedBanner) => {
            const menuItems = [];

            if (img) {
                const pfpItems = [
                    {
                        type: 'button',
                        id: 'open-pfp',
                        label: 'Open',
                        iconLeft: () => <OpenIcon />,
                        action: () => openMedia(img)
                    }
                ];

                if (isAnimated) {
                    pfpItems.push({
                        type: 'button',
                        id: 'open-pfp_a',
                        label: 'Open Animated',
                        iconLeft: () => <OpenIcon />,
                        action: () => openMedia(animatedImg)
                    });
                }

                if (isAnimated) {
                    pfpItems.push({
                        type: 'submenu',
                        id: 'copy-avatar-submenu',
                        label: 'Copy URL',
                        iconLeft: () => <CopyIcon />,
                        items: [
                            {
                                type: 'button',
                                id: 'copy-avatar-url-static',
                                label: 'Copy Static URL',
                                iconLeft: () => <CopyIcon />,
                                action: () => copyURL(img)
                            },
                            {
                                type: 'button',
                                id: 'copy-avatar-url-animated',
                                label: 'Copy Animated URL',
                                iconLeft: () => <CopyIcon />,
                                action: () => copyURL(animatedImg)
                            }
                        ]
                    });
                } else {
                    pfpItems.push({
                        type: 'button',
                        id: 'copy-avatar-url',
                        label: 'Copy URL',
                        iconLeft: () => <CopyIcon />,
                        action: () => copyURL(img)
                    });
                }

                pfpItems.push(
                    {
                        type: 'submenu',
                        id: 'reverse-search',
                        label: 'Reverse Search',
                        iconLeft: () => <SearchIcon />,
                        items: buildSearchMenu(img)
                    },
                    {
                        type: 'submenu',
                        id: 'canvas-methods',
                        label: 'Canvas Methods',
                        iconLeft: () => <CanvasIcon />,
                        items: createCanvasMenu(img)
                    }
                );

                menuItems.push({
                    type: 'submenu',
                    id: 'profile-picture',
                    label: 'Profile Picture',
                    iconLeft: () => <ImageIcon />,
                    items: pfpItems
                });
            }

            if (banner) {
                const bannerItems = [
                    {
                        type: 'button',
                        id: 'open-banner',
                        label: 'Open',
                        iconLeft: () => <OpenIcon />,
                        action: () => openMedia(banner)
                    }
                ];

                if (isAnimatedBanner) {
                    bannerItems.push({
                        type: 'button',
                        id: 'open-banner-a',
                        label: 'Open Animated',
                        iconLeft: () => <OpenIcon />,
                        action: () => openMedia(animatedBanner)
                    });
                }

                if (isAnimatedBanner) {
                    bannerItems.push({
                        type: 'submenu',
                        id: 'copy-banner-submenu',
                        label: 'Copy URL',
                        iconLeft: () => <CopyIcon />,
                        items: [
                            {
                                type: 'button',
                                id: 'copy-banner-url-static',
                                label: 'Copy Static URL',
                                iconLeft: () => <CopyIcon />,
                                action: () => copyURL(banner)
                            },
                            {
                                type: 'button',
                                id: 'copy-banner-url-animated',
                                label: 'Copy Animated URL',
                                iconLeft: () => <CopyIcon />,
                                action: () => copyURL(animatedBanner)
                            }
                        ]
                    });
                } else {
                    bannerItems.push({
                        type: 'button',
                        id: 'copy-banner-url',
                        label: 'Copy URL',
                        iconLeft: () => <CopyIcon />,
                        action: () => copyURL(banner)
                    });
                }

                bannerItems.push(
                    {
                        type: 'submenu',
                        id: 'reverse-search-banner',
                        label: 'Reverse Search',
                        iconLeft: () => <SearchIcon />,
                        items: buildSearchMenu(banner)
                    },
                    {
                        type: 'submenu',
                        id: 'canvas-methods-banner',
                        label: 'Canvas Methods',
                        iconLeft: () => <CanvasIcon />,
                        items: createCanvasMenu(banner)
                    }
                );

                menuItems.push({
                    type: 'submenu',
                    id: 'banner',
                    label: 'Banner',
                    iconLeft: () => <BannerIcon />,
                    items: bannerItems
                });
            }

            return menuItems;
        };

        const betterMediaItems = [];

        const normalItems = buildMediaMenu(normalImg, normalBanner, animatedNormalImg, animatedNormalBanner, isAnimatedBanner);
        if (normalItems.length > 0) {
            if (isInGuild) {
                betterMediaItems.push({
                    type: 'submenu',
                    id: 'profile',
                    label: 'Profile',
                    iconLeft: () => <UserIcon />,
                    items: normalItems
                });
            } else {
                betterMediaItems.push(...normalItems);
            }
        }

        if (isInGuild && (guildImg || guildBanner)) {
            const guildItems = buildMediaMenu(guildImg, guildBanner, animatedGuildImg, animatedGuildBanner, isAnimatedGuildBanner);
            if (guildItems.length > 0) {
                betterMediaItems.push({
                    type: 'submenu',
                    id: 'guild',
                    label: 'Guild',
                    iconLeft: () => <GuildIcon />,
                    items: guildItems
                });
            }
        }

        if (betterMediaItems.length > 0) {
            const betterMediaMenu = {
                type: 'submenu',
                id: 'better-media',
                label: 'BetterMedia',
                iconLeft: () => <MainMenuIcon />,
                items: betterMediaItems
            };

            res.props.children.push(ContextMenu.buildItem({ type: 'separator' }));
            res.props.children.push(ContextMenu.buildItem(betterMediaMenu));
        }
    }
    
    getSettingsPanel() {
        return () => {
            const [showToolbar, setShowToolbar] = useSetting('showToolbar', true);

            return (
                <div>
                    <span>
                        Toggle Image Toolbar
                    </span>
                    <Components.SwitchInput
                        value={showToolbar}
                        onChange={setShowToolbar}
                    />
                </div>
            );
        };
    }

    stop() {
        ImageRenderComponent.uo = uoOrg

        DOM.removeStyle('BetterMedia')
        Patcher.unpatchAll()
        ContextMenu.unpatch('user-context', this.AUCM)
        ContextMenu.unpatch("image-context", this.AICM)
    }
}