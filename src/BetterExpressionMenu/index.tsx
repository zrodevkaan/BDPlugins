/**
 * @name BetterExpressionMenu
 * @description Adds more options to the expression popup
 * @version 1.0.0
 * @author Kaan
 */
const { React, Webpack, Patcher, Utils, DOM, Components, Net, Data, ContextMenu } = new BdApi('BetterExpressionMenu');
const { SearchInput, DropdownInput, Tooltip, TextInput, Button: BetterDiscordButton } = Components;
const Buttons = Webpack.getBySource("isSubmitButtonEnabled", '.A.getActiveOption(')
const SwitchInput = Webpack.getByStrings('data-toggleable-component":"switch', { searchExports: true })
const Button = Webpack.getByStrings('TRIAL_NUX_EMOJI_BUTTON')
const Classes = Webpack.getByKeys('announcementScrollableContainer')
const Popout = Webpack.getModule(m => m?.Animation, { searchExports: true, raw: true }).exports.Y
const DataProtobuf = Webpack.getModule(m => m?.updateAsync, { searchExports: true })
const EmojiStore = Webpack.getStore('EmojiStore')
const GuildStore = Webpack.getStore('GuildStore')
const Helpers = Webpack.getByKeys('getEmojiURL')
const ProtobufSaveLink = Webpack.getByStrings('.GIF_FAVORITED', { searchExports: true })
const WarningMessage = Webpack.getByStrings('messageType:', 'textColor', { searchExports: true })
const mods = Webpack.getByKeys('getSendMessageOptionsForReply')
const SelectedChannelStore = Webpack.getStore("SelectedChannelStore");
const PendingReplyStore = Webpack.getStore("PendingReplyStore")
const ComponentDispatch = Webpack.getModule(m => m.dispatchToLastSubscribed && m.emitter?._events?.FOCUS_SEARCH, { searchExports: true })

function reconstructProvider(saved) {
    return {
        ...saved,
        api: (tags, limit = 100) => {
            return saved.apiTemplate
                .replace('${tags}', saved.singleArg ? tags.split(' ')[0] : tags.split(' ').join('+'))
                .replace('${limit}', limit);
        },
        mapToFile: new Function('item', `return ${saved.mapPath}`)
    };
}

const providers = [
    {
        type: 'safeboruu',
        api: (tags, limit = 100) => `https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&tags=${tags}&limit=${limit}`,
        maxResults: 100,
        mapToFile: item => item.file_url,
        native: true,
    },
    {
        type: 'nekos_best',
        api: (tags, limit = 100) => `https://nekos.best/api/v2/search?query=${tags}&type=1&amount=${limit}`,
        returnsExtraArg: true,
        toplevelArg: 'results',
        maxResults: 100,
        mapToFile: item => item.url
    },
    {
        type: 'nekosia',
        api: (tags, limit = 20) => `https://api.nekosia.cat/api/v1/images/${tags}?count=${limit}`,
        returnsExtraArg: true,
        toplevelArg: 'images',
        maxResults: 20,
        mapToFile: item => item.image?.original?.url,
        singleArg: true
    },
    {
        type: 'giphy',
        api: (tags, limit = 100, page = 0) => `https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(tags)}&limit=${limit}&api_key=Gc7131jiJuvI7IdN0HZ1D7nh0ow5BU6g${page != 0 ? `&offset=${page}` : ''}`,
        returnsExtraArg: true,
        toplevelArg: 'data',
        maxResults: 100,
        hasPagination: true,
        mapToFile: item => item.images.source.url,
        singleArg: true,
    }
];

function useAsyncGenerator(generatorFn, deps = []) {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        let cancelled = false;

        async function execute() {
            try {
                setLoading(true);
                for await (const item of generatorFn()) {
                    if (cancelled) break;
                    setData(prev => [...prev, item]);
                }
            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        execute();

        return () => {
            cancelled = true;
        };
    }, deps);

    return { data, loading, error };
}


function SettingsComponent() {
    const [customProviders, setCustomProviders] = React.useState(() => {
        const saved = Data.load('customProviders') || [];
        return saved.map(p => ({
            ...p,
            api: (tags, limit = 100) => {
                return p.apiTemplate
                    .replace('${tags}', p.singleArg ? tags.split(' ')[0] : tags.split(' ').join('+'))
                    .replace('${limit}', limit);
            },
            mapToFile: new Function('item', `return ${p.mapPath}`)
        }));
    });
    const [name, setName] = React.useState('');
    const [url, setUrl] = React.useState('');
    const [isNative, setIsNative] = React.useState('');
    const [mapPath, setMapPath] = React.useState('item.file_url');
    const [toplevelArg, setToplevelArg] = React.useState('data');

    const add = () => {
        if (!name || !url) return;

        const serializableProvider = {
            type: name,
            apiTemplate: url,
            mapPath: mapPath,
            returnsExtraArg: Boolean(toplevelArg),
            toplevelArg: toplevelArg,
            maxResults: 100,
            native: isNative,
            singleArg: false
        };

        const fullProvider = {
            ...serializableProvider,
            api: (tags, limit = 100) => {
                return url
                    .replace('${tags}', tags.split(' ').join('+'))
                    .replace('${limit}', limit);
            },
            mapToFile: new Function('item', `return ${mapPath}`)
        };

        const updatedFull = [...customProviders, fullProvider];
        setCustomProviders(updatedFull);

        const savedProviders = Data.load('customProviders') || [];
        Data.save('customProviders', [...savedProviders, serializableProvider]);

        setName('');
        setUrl('');
        setMapPath('item.file_url');
    };

    const remove = (i) => {
        const updated = customProviders.filter((_, idx) => idx !== i);
        setCustomProviders(updated);

        const serializableData = updated.map(p => ({
            type: p.type,
            apiTemplate: p.apiTemplate,
            mapPath: p.mapPath,
            returnsExtraArg: p.returnsExtraArg,
            toplevelArg: p.toplevelArg,
            maxResults: p.maxResults,
            native: p.native,
            singleArg: p.singleArg
        }));
        Data.save('customProviders', serializableData);
    };

    return (
        <div className="bem-settings-container">
            <div className="bem-settings-form">
                <div className="bem-settings-hint">
                    Use ${'{tags}'} and ${'{limit}'} as placeholders
                </div>
                <TextInput
                    placeholder="Name (e.g., example.com)"
                    value={name}
                    onChange={setName}
                />
                <TextInput
                    placeholder="API URL with ${tags} and ${limit}"
                    value={url}
                    onChange={setUrl}
                />
                <TextInput
                    placeholder="Path to image (e.g., item.file_url)"
                    value={mapPath}
                    onChange={setMapPath}
                />
                <TextInput
                    placeholder="If a posts are inside a toplevel argument, specify it here (e.g., data)"
                    value={toplevelArg}
                    onChange={setToplevelArg}
                />
                <div>
                    Native Fetch:
                    <SwitchInput
                        id="native-switch"
                        value={isNative}
                        onChange={setIsNative}
                    />
                </div>
                <BetterDiscordButton
                    onClick={add}
                    className="bem-add-button"
                >
                    Add Provider
                </BetterDiscordButton>
            </div>

            <div>
                {customProviders.map((p, i) => (
                    <div key={i} className="bem-provider-item">
                        <div>
                            <div className="bem-provider-name">{p.type}</div>
                            <div className="bem-provider-path">{p.mapPath}</div>
                        </div>
                        <button
                            onClick={() => remove(i)}
                            className="bem-delete-button"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function normalizeData(provider, rawData) {
    if (!rawData) return [];

    const data = provider.returnsExtraArg
        ? rawData[provider.toplevelArg]
        : rawData;

    return (Array.isArray(data) ? data : []).map(item => {
        const link = provider.mapToFile(item)
        return {
            file_url: link,
            type: (link.endsWith('.mp4') || link.endsWith('.mov')) ? 'video' : 'gif'
        }
    }).filter(item => !!item.file_url);
}

function SVGButton() {
    return <svg className="bem-svg-button" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="var(--interactive-icon-default)">
        <g fill="none" stroke="var(--interactive-icon-default)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
            <path d="M6 9a3 3 0 0 1 3-3h30a3 3 0 0 1 3 3v30a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9ZM4 24h40M24 44V4M6 30V18m36 12V18M30 42H18M30 6H18"></path>
            <path d="M24 24s7.897-3.546 9.099-4.747a3.077 3.077 0 1 0-4.352-4.352C27.546 16.103 24 24 24 24Zm0 0s-7.897-3.546-9.099-4.747m9.1 4.747s-3.547-7.897-4.748-9.099M24 24s7.897 3.546 9.099 4.747M24 24s3.546 7.897 4.747 9.099M24 23.999s-7.897 3.547-9.099 4.748a3.077 3.077 0 1 0 4.352 4.352c1.201-1.202 4.747-9.1 4.747-9.1Z"></path>
        </g>
    </svg>
}

export const timestampToSnowflake = (timestamp: number): string => {
    const DISCORD_EPOCH = BigInt(1420070400000);
    const SHIFT = BigInt(22);

    const ms = BigInt(timestamp) - DISCORD_EPOCH;
    return ms <= BigInt(0) ? "0" : (ms << SHIFT).toString();
};

function sendMessage(src: string) {
    const channelId = SelectedChannelStore.getChannelId()

    const replyOptions = mods.getSendMessageOptionsForReply(
        PendingReplyStore.getPendingReply(channelId),
    );

    const messagePayload = {
        flags: 0,
        channel_id: channelId,
        content: src,
        sticker_ids: [],
        validNonShortcutEmojis: [],
        type: 0,
        messageReference: replyOptions?.messageReference || null,
        nonce: timestampToSnowflake(Date.now()),
    };

    mods.sendMessage(channelId, messagePayload, null, {
        onAttachmentUploadError: () => false,
        ...messagePayload,
    });
}

async function setClipboard(data, mimeType) {
    let clipboardItem;
    if (typeof data === "string") {
        clipboardItem = new ClipboardItem({
            "text/plain": new Blob([data], { type: "text/plain" })
        });
    } else {
        const type = mimeType || "image/png";
        let blob;
        if (data instanceof Blob) {
            blob = mimeType ? data.slice(0, data.size, type) : data;
        } else if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
            blob = new Blob([data], { type });
        } else {
            throw new Error("Unsupported data type for clipboard image write.");
        }
        clipboardItem = new ClipboardItem({
            [type]: blob
        });
    }
    await navigator.clipboard.write([clipboardItem]);
}

function GifItem({ gif, gifKey }) {
    const [isVisible, setIsVisible] = React.useState(false);
    const placeholderRef = React.useRef(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (placeholderRef.current) {
            observer.observe(placeholderRef.current);
        }

        return () => observer.disconnect();
    }, []);

    if (!isVisible) return <div ref={placeholderRef} className="bem-gif-placeholder" />

    const messageToSend = gif.src?.startsWith('https://media1.tenor.com') ? gif.src : gifKey; // this doesnt get embedded for some reason.

    const menuStuff = () => {
        return ContextMenu.buildMenu([{
            type: 'submenu',
            label: 'BetterExpressionMenu',
            items: [
                {
                    type: 'button',
                    label: 'Copy Gif Source',
                    action: () => setClipboard(messageToSend)
                }
            ]
        }])
    }

    if (gif.format === 2) {
        return (
            <video
                src={gif.src}
                className="bem-gif-video"
                autoPlay
                loop
                style={{ cursor: 'pointer' }}
                muted
                onContextMenu={(e) => ContextMenu.open(e, menuStuff())}
                loading="lazy" menuStuff
                onClick={(e) => !e.shiftKey ? sendMessage(messageToSend) : ComponentDispatch.dispatchToLastSubscribed('INSERT_TEXT', { plainText: messageToSend, rawText: messageToSend })}
            />
        );
    }

    return (
        <img
            src={gif.src}
            alt="gif"
            style={{ cursor: 'pointer' }}
            className="bem-gif-image"
            loading="lazy"
            onContextMenu={(e) => ContextMenu.open(e, menuStuff())}
            onClick={(e) => !e.shiftKey ? sendMessage(messageToSend) : ComponentDispatch.dispatchToLastSubscribed('INSERT_TEXT', { plainText: messageToSend, rawText: messageToSend })}
        />
    );
}

function FavoritesComponent({ query }) {
    const [gifs, setGifs] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [favorite, setFavorite] = React.useState(null);
    const containerRef = React.useRef();
    const ITEMS_PER_PAGE = 20;

    React.useEffect(() => {
        const data = DataProtobuf.getCurrentValue();
        const favoriteGifs = data?.favoriteGifs?.gifs || [];
        setGifs(favoriteGifs);
    }, []);

    const sortedAndFilteredGifs = React.useMemo(() => {
        return Object.entries(gifs)
            .sort(([, a], [, b]) => (a.order ?? 0) - (b.order ?? 0))
            .reverse()
            .filter(([key, gif]) => {
                if (!query) return true;
                if (!gif.src) return false;
                return gif.src.toLowerCase().includes(query.toLowerCase());
            });
    }, [gifs, query]);

    React.useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

            if (scrollHeight - scrollTop - clientHeight < 200) {
                setPage(p => {
                    const maxPage = Math.ceil(sortedAndFilteredGifs.length / ITEMS_PER_PAGE) - 1;
                    return Math.min(p + 1, maxPage);
                });
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [sortedAndFilteredGifs]);

    React.useEffect(() => {
        if (favorite) {
            const image = new Image();
            image.onload = () => {
                const newGif = {
                    width: image.width || 498,
                    height: image.height || 498,
                    format: favorite.endsWith('.mp4') || favorite.endsWith('.mov') || favorite.endsWith('.gif') ? 2 : 1,
                    url: favorite,
                    src: favorite,
                };
                ProtobufSaveLink(newGif);
                const data = DataProtobuf.getCurrentValue();
                const favoriteGifs = data?.favoriteGifs?.gifs || [];
                setGifs(favoriteGifs);
                setFavorite(null);
            };
            image.onerror = () => {
                console.error('Failed to load image:', favorite);
                const newGif = {
                    width: 498,
                    height: 498,
                    format: 1,
                    src: favorite,
                    url: favorite,
                };
                ProtobufSaveLink(newGif);
                setFavorite(null);
            };
            image.src = favorite;
        }
    }, [favorite]);

    return (
        <div
            ref={containerRef}
            className="bem-favorites-container"
            style={{
                overflowY: 'auto',
                maxHeight: '100vh',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}
        >
            <div className="bem-gif-grid">
                {sortedAndFilteredGifs.slice(0, (page + 1) * ITEMS_PER_PAGE).map(([key, gif]) => (
                    <div key={gif.id} className="bem-gif-grid-item">
                        <GifItem gif={gif} gifKey={key} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function GIFsComponent({ query }) {
    const [selectedProvider, setSelectedProvider] = React.useState(providers[0]);
    const [data, setData] = React.useState(null);
    const [page, setPage] = React.useState(0);
    const containerRef = React.useRef(null);

    const customProviders = React.useMemo(() => {
        return (Data.load('customProviders') || []).map(reconstructProvider);
    }, []);

    const mainData = React.useMemo(() => {
        return [...providers, ...customProviders];
    }, [customProviders]);

    React.useEffect(() => {
        if (query) {
            const args = selectedProvider.api(
                selectedProvider?.singleArg ? query.split(' ')[0] : query.split(' ').join('+'),
                selectedProvider?.maxResults,
                page
            );

            async function fetchData() {
                const response = !selectedProvider?.native ? await fetch(args) : await Net.fetch(args);
                const json = await response.json();
                const normalized = normalizeData(selectedProvider, json);
                setData(normalized);

                if (containerRef.current) {
                    containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            fetchData();
        }
    }, [query, selectedProvider, page]);

    React.useEffect(() => {
        setPage(0);
    }, [query, selectedProvider]);

    const handleClick = (e, fileUrl) => {
        e.preventDefault();
        e.stopPropagation();

        if (!e.shiftKey) {
            sendMessage(fileUrl);
        } else {
            ComponentDispatch.dispatchToLastSubscribed('INSERT_TEXT', {
                plainText: fileUrl,
                rawText: fileUrl
            });
        }
    };

    const menuStuff = (messageToSend) => {
        return ContextMenu.buildMenu([{
            type: 'submenu',
            label: 'BetterExpressionMenu',
            items: [
                {
                    type: 'button',
                    label: 'Copy Gif Source',
                    action: () => setClipboard(messageToSend)
                }
            ]
        }])
    }

    return (
        <div className="bem-gifs-container" ref={containerRef}>
            <DropdownInput
                options={mainData.map(p => ({ label: p.type, value: p.type }))}
                onChange={(selectedType) => {
                    const provider = mainData.find(p => p.type === selectedType);
                    if (provider) {
                        setSelectedProvider(provider);
                    }
                }}
                value={selectedProvider.type}
            />
            <div className="bem-gif-grid bem-gif-grid-margin">
                {data && data.map((gif, index) => {
                    return (
                        <div
                            key={index}
                            className="bem-gif-grid-item"
                            onClick={(e) => handleClick(e, gif.file_url)}
                            onContextMenu={(e) => ContextMenu.open(e, menuStuff(gif.file_url))}
                            style={{ cursor: 'pointer' }}
                        >
                            {gif?.type !== "gif" ?
                                <video
                                    className="bem-gif-video"
                                    onLoadStart={(a) => { a.target.volume = 0 }}
                                    loop
                                    autoPlay
                                    src={gif.file_url}
                                    style={{ pointerEvents: 'none' }}
                                /> :
                                <img
                                    src={gif.file_url}
                                    className="bem-gif-image"
                                    style={{ pointerEvents: 'none' }}
                                />
                            }
                        </div>
                    );
                })}
                {selectedProvider?.hasPagination && data != null && Object.values(data).length > 0 && (
                    <div onClick={() => setPage(p => p + 1)} className="bem-load-more">
                        Load More (Page {page + 2})
                    </div>
                )}
            </div>
        </div>
    );
}

function EmojiItem({ emoji }) {
    const [isVisible, setIsVisible] = React.useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '200px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    if (!isVisible) {
        return (
            <div ref={ref} className="bem-emoji-placeholder" />
        );
    }

    const parsedName = `:${emoji.name}:`

    return (
        <Tooltip text={parsedName} position="top">
            {(props) => (
                <img
                    {...props}
                    ref={ref}
                    src={Helpers.getEmojiURL({
                        id: emoji.id,
                        animated: true,
                        size: 32
                    }, false)}
                    onClick={(e) => {
                        ComponentDispatch.dispatchToLastSubscribed('INSERT_TEXT', {
                            plainText: parsedName,
                            rawText: parsedName
                        })
                    }}
                    alt={emoji.name || 'emoji'}
                    className="bem-emoji-image"
                />
            )}
        </Tooltip>
    );
}

function EmojisComponent({ query }) {
    const [allEmojis, setAllEmojis] = React.useState(EmojiStore.getGuilds());
    const [hoveredEmoji, setHoveredEmoji] = React.useState(null)
    const allGuilds = GuildStore.getGuilds();
    const guildsArray = Object.values(allGuilds).filter(guild => {
        const guildEmojis = allEmojis[guild.id]?.emojis || [];
        return guildEmojis.length > 0;
    });

    return (
        <div>
            <div className="bem-emojis-container">
                {guildsArray.map(guild => {
                    const guildEmojis = allEmojis[guild.id]?.emojis || [];
                    return (
                        <div key={guild.id} className="bem-guild-section">
                            <h2 className="bem-guild-header">
                                <img
                                    src={Helpers.getGuildIconURL(guild)}
                                    alt=""
                                    className="bem-guild-icon"
                                />
                                {guild.name}
                            </h2>
                            {guildEmojis.map(emoji => (
                                <EmojiItem key={emoji.id} emoji={emoji} />
                            ))}
                        </div>
                    );
                })}
            </div>
            {hoveredEmoji && <div>
                {hoveredEmoji.name}
            </div>}
        </div>
    );
}

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

function ExtraComponent({ query }) {
    const [favorite, setFavorite] = React.useState(null);
    const [consented, setConsented] = React.useState(DataStore.consented || false);
    const [localConsent, setLocalConsent] = React.useState(false);


    React.useEffect(() => {
        if (favorite) {
            const image = new Image();

            image.onload = () => {
                const newGif = {
                    width: image.width || 498,
                    height: image.height || 498,
                    format: 1,
                    url: favorite,
                    src: favorite,
                };

                ProtobufSaveLink(newGif);
                setFavorite(null);
            };

            image.onerror = () => {
                console.error('Failed to load image:', favorite);
                const newGif = {
                    width: 498,
                    height: 498,
                    format: 1,
                    src: favorite,
                    url: favorite,
                };
                ProtobufSaveLink(newGif);
                setFavorite(null);
            };

            image.src = favorite;
        }
    }, [favorite]);

    return (
        <div
            className="bem-min-width-bypass"
            style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '8px',
                gap: '12px'
            }}
        >
            <WarningMessage messageType="danger" textColor="danger">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span>
                        Only direct image or GIF URLs are supported. Adding any other type of link
                        may cause unexpected behavior or instability within Discord’s GIF picker
                        on desktop or mobile.
                    </span>
                    <span></span>
                    <span>
                        By enabling this feature, you acknowledge and accept full responsibility
                        for any resulting issues, including crashes or data loss. The developer
                        provides this functionality “as is” without any warranty or liability.
                    </span>
                </div>
            </WarningMessage>

            {!consented && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        gap: '10px',
                        padding: '10px'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >

                        <span
                            style={{
                                color: 'white',
                                fontSize: '14px',
                                textAlign: 'center',
                                userSelect: 'none'
                            }}
                        >
                            I have read and agree to the disclaimer above.
                        </span>

                        <SwitchInput
                            checked={localConsent || false}
                            onChange={setLocalConsent}
                            disabled={consented}
                        >
                            I Understand and Consent
                        </SwitchInput>
                    </div>

                    <BetterDiscordButton
                        style={{
                            marginTop: '6px',
                            backgroundColor: '#5865F2',
                            color: 'white',
                            width: 'fit-content'
                        }}
                        onClick={() => {
                            if (localConsent) {
                                DataStore.consented = true;
                                setConsented(true);
                            } else {
                                BdApi.UI.showToast(
                                    "Please toggle the switch first to confirm consent.",
                                    { type: "error" }
                                );
                            }
                        }}
                    >
                        Confirm Consent
                    </BetterDiscordButton>
                </div>
            )}

            {consented && (
                <>
                    <TextInput
                        placeholder="Paste Image/GIF link (e.g. https://i.imgur.com/example.gif)"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const input = e?.target;
                                const value = input?.value || "";
                                if (value.trim()) {
                                    setFavorite(value.trim());
                                }
                            }
                        }}
                    />
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <BetterDiscordButton onClick={() => {
                            const data = DataProtobuf.getCurrentValue();
                            const favoriteGifs = data?.favoriteGifs?.gifs || [];
                            DataStore.backupData = favoriteGifs;
                        }}>
                            Backup Data
                        </BetterDiscordButton>
                        {DataStore.backupData &&
                            <BetterDiscordButton onClick={() => {
                                DataProtobuf.updateAsync('favoriteGifs', (data) => {
                                    if (DataStore.backupData && Object.values(DataStore.backupData).length > 0) {
                                        data.gifs = DataStore.backupData;
                                    }
                                });
                            }}>
                                Restore Data
                            </BetterDiscordButton>}
                    </div>
                </>
            )}
        </div>
    );
}

const YouTubeComponent = () => {
    const [videoId, setVideoId] = React.useState('dQw4w9WgXcQ')
    const [isDownloading, setIsDownloading] = React.useState(false)

    const handleDownload = async () => {
        setIsDownloading(true)
        try {
            const data = await getYoutubeData(videoId)
            const link = document.createElement('a')
            link.href = data.video
            link.download = `youtube-${videoId}.mp4`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Download failed:', error)
            alert('Failed to download video')
        } finally {
            setIsDownloading(false)
        }
    }

    return 'Later'
    /*return <div>
        <SearchInput value={videoId} onChange={setVideoId} placeholder="YouTube Video ID" />
        <button onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? 'Downloading...' : 'Download Video'}
        </button>
    </div>*/
}

const tabs = [
    { id: 'favorites', label: 'Favorites', component: FavoritesComponent },
    { id: 'gifs', label: 'GIFs', component: GIFsComponent },
    { id: 'emojis', label: 'Emojis', component: EmojisComponent },
    { id: 'extra', label: 'Extras', component: ExtraComponent },
    // { id: 'youtube', label: "YouTube", component: YouTubeComponent }
];

function PanelNav() {
    const [activeTab, setActiveTab] = React.useState(tabs[0].id);
    const [query, setQuery] = React.useState("");

    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

    return <div className="bem-panel-container">
        <div className="bem-panel-header">
            {tabs.map(tab => (
                <TabButton
                    key={tab.id}
                    label={tab.label}
                    isActive={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                />
            ))}
            {(activeTab == "favorites" || activeTab == "gifs") && <SearchInput
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        const input = e?.target as HTMLInputElement;
                        const value = input?.value || "";
                        setQuery(value);
                    }
                }}
                placeholder={`Search GIFs...`}
            />}
        </div>
        <div className="scrollerBase bem-panel-content">
            {ActiveComponent && <ActiveComponent query={query} />}
        </div>
    </div>
}

function TabButton({ label, isActive, onClick }) {
    const [isHovered, setIsHovered] = React.useState(false);

    return <div
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`bem-tab-button ${isActive ? 'bem-tab-active' : ''} ${isHovered ? 'bem-tab-hovered' : ''}`}
    >
        {label}
    </div>
}

const CSS = `
/* Settings Component */
.bem-settings-container {
    padding: 16px;
    color: white;
}

.bem-settings-form {
    margin-bottom: 16px;
}

.bem-settings-hint {
    margin-bottom: 8px;
    font-size: 12px;
    color: var(--text-muted);
}

.bem-add-button {
    padding: 8px 16px;
    background-color: #5865F2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.bem-provider-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    margin-bottom: 8px;
    background-color: var(--background-secondary);
    border-radius: 4px;
}

.bem-provider-name {
    font-weight: bold;
}

.bem-provider-path {
    font-size: 11px;
    color: var(--text-muted);
}

.bem-delete-button {
    padding: 4px 8px;
    background-color: #ED4245;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

/* SVG Button */
.bem-svg-button {
    fill: var(--interactive-icon-default);
}

/* Extra Components */
.bem-min-width-bypass > input {
    min-width: 420px;
}

.bem-min-width-bypass {
    justify-content: center;
    align-items: center;
    display: flex-inline;
    margin: 12px;
}

/* GIF Components */
.bem-gif-placeholder {
    width: 100%;
    height: 200px;
    background-color: var(--background-modifier-accent);
    border-radius: 8px;
}

.bem-gif-video {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
}

.bem-gif-image {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
}

/* Favorites Component */
.bem-favorites-container {
    padding: 8px;
    box-sizing: border-box;
}

.bem-favorite-input-wrapper {
    width: 100%;
    padding: 0px 8px;
}

.bem-gif-grid {
    column-count: 2;
    column-gap: 12px;
}

.bem-gif-grid-margin {
    margin-top: 8px;
}

.bem-gif-grid-item {
    break-inside: avoid;
    margin-bottom: 8px;
}

.bem-load-more {
    margin: 10px;
    color: white;
    text-align: center;
    cursor: pointer;
}

/* GIFs Component */
.bem-gifs-container {
    padding: 8px;
    box-sizing: border-box;
}

.bem-favorites-container::-webkit-scrollbar {
    display: none;
}

/* Emoji Components */
.bem-emoji-placeholder {
    width: 32px;
    height: 32px;
    margin: 4px;
    display: inline-block;
    background-color: var(--background-modifier-accent);
    border-radius: 4px;
}

.bem-emoji-image {
    width: 32px;
    height: 32px;
    margin: 4px;
}

.bem-emojis-container {
    padding: 8px;
}

.bem-guild-section {
    padding-bottom: 12px;
}

.bem-guild-header {
    color: white;
    font-size: 700;
    display: flex;
    align-items: center;
    gap: 8px;
}

.bem-guild-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
}

/* Panel Navigation */
.bem-panel-container {
    width: 550px;
    height: 450px;
    background-color: var(--background-base-low);
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border-subtle);
}

.bem-panel-header {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 8px;
    background-color: var(--background-base-lower);
    border-bottom: 1px solid var(--border-subtle);
}

.bem-panel-content {
    flex: 1;
    overflow: auto;
}

/* Tab Button */
.bem-tab-button {
    padding: 8px 16px;
    cursor: pointer;
    color: var(--text-muted);
    background-color: transparent;
    border-radius: 4px;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.1s ease;
    user-select: none;
}

.bem-tab-button.bem-tab-active,
.bem-tab-button.bem-tab-hovered {
    color: var(--header-primary);
    background-color: var(--background-mod-normal);
}

/* Scrollbar */
.scrollerBase::-webkit-scrollbar {
    background: none;
    border-radius: 8px;
    width: 16px;
}

.scrollerBase::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    border: solid 4px transparent;
    border-radius: 8px;
}

.scrollerBase:hover::-webkit-scrollbar-thumb {
    background-color: var(--bg-overlay-6, var(--background-tertiary));
}

.scrollerBase::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 8px;
}

/* Emoji Button Container */
.bem-emoji-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.bem-emoji-button-inner {
    display: flex;
    justify-content: center;
    align-items: center;
}
`

function EmojiPopout() {
    const owoRef = React.useRef(null);
    const [shouldShow, setShouldShow] = React.useState(false);

    return <div className="bem-emoji-button-container" key={'better-expression-menu-gif-remake'} ref={owoRef}>
        <Popout
            targetElementRef={owoRef}
            shouldShow={shouldShow}
            renderPopout={() => <PanelNav />}
            onRequestClose={() => setShouldShow(false)}
            position="top"
            children={() => (
                <Button
                    tooltipText={"Expression Menu"}
                    renderButtonContents={() => (
                        <div onClick={() => setShouldShow(s => !s)}>
                            <div className={`bem-emoji-button-inner ${Classes.emojiButton}`}>
                                <SVGButton />
                            </div>
                        </div>
                    )}
                />
            )}
        />
    </div>
}

export default class BetterExpressionMenu {
    start() {
        DOM.addStyle('bem-styles', CSS)
        Patcher.after(Buttons.A, 'type', (_, __, res) => {
            res.props.children.unshift(<EmojiPopout />)
            return res
        })
    }
    stop() {
        DOM.removeStyle('bem-styles')
        Patcher.unpatchAll();
    }
    getSettingsPanel() {
        return React.createElement(SettingsComponent);
    }
}