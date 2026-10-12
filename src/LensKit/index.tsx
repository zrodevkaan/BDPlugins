import {ContextMenu, GlobalModules, Hooks, Net, Patcher, React, Webpack} from "./shared.ts";
import Settings from "./Settings.ts";

import NavIds from "./contextmenus.tsx"
import {HamburgerMenu} from "./ui/icons.tsx";
import {wpWait} from "@helpers";

const ZOOM_SENSITIVITY = 0.001
const SIZE_SENSITIVITY = 0.5
const IGNORE_ATTR = "data-lenskit-ignore"

function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

function fuckOffDiscord(e) {
    e.preventDefault()
    e.stopPropagation()
}

// https://static2.klipy.com/ii/d7aec6f6f171607374b2065c836f92f4/af/56/mVjTRXfg.gif

// const kinds = {
//     "tenor": /https:\/\/media1\.tenor\.com\/.{1}\/[^"]*/,
//     "klipy": /https:\/\/static2.klipy.com\/\w+\/\w+\/\w+\/\w+\/\w+.\w+/
// }
//
// async function returnGIFFromMP4(link, kind) {
//     const text = await Net.fetch(link, {
//         "credentials": "include",
//         "headers": {
//             "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0",
//             "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
//             "Accept-Language": "en-US,en;q=0.9",
//             "Sec-GPC": "1",
//             "Upgrade-Insecure-Requests": "1",
//             "Sec-Fetch-Dest": "document",
//             "Sec-Fetch-Mode": "navigate",
//             "Sec-Fetch-Site": "same-origin",
//             "Priority": "u=0, i"
//         },
//         "referrer": "https://klipy.com/gifs/anakin-liar?__cf_chl_tk=8oyqDDSjhJIMwOSEV0Ib6jWO.p_TbLZHNN4I5Q1i.fE-1789765228-1.0.1.1-QM_LZ0c7fShWy0iH5n2N7XhpU11HecUeFoOr28Q7WAg",
//         "method": "GET",
//         "mode": "cors"
//     }).then(res => res.text())
//     console.log(link, kind)
//     const finale = text.match(kinds[kind])
//     console.log(finale)
//     if (!finale) throw new Error(`No match for kind "${kind}" in ${link}`)
//     return finale[0]
// }

function parseDiscordProxyUrl(proxyUrl) {
    const u = new URL(proxyUrl);
    if (!u.hostname.endsWith("discordapp.net")) return null;

    const parts = u.pathname.replace(/^\//, "").split("/");
    if (parts[0] !== "external" || parts.length < 3) return null;

    const scheme = parts[2];
    const rest = parts.slice(3).join("/");
    if (scheme !== "http" && scheme !== "https") return null;

    return `${scheme}://${rest}${u.search}`;
}

function OverrideZoom({node, props}: { node: React.ReactElement, props: Record<string, unknown> }) {
    const mediaRef = React.useRef<HTMLImageElement | HTMLVideoElement | null>(null)
    const fetchedSrcRef = React.useRef<string | null>(null)
    const [videoBgSrc, setVideoBgSrc] = React.useState<string | undefined>(undefined)
    const [lens, setLens] = React.useState<{
        x: number,
        y: number,
        imgX: number,
        imgY: number,
        rectW: number,
        rectH: number
    } | null>(null)
    const settings = Hooks.useStateFromStores([Settings], () => Settings.getAll())
    const [{size, zoom}, setData] = React.useState({
        size: settings.lensSize,
        zoom: settings.lensZoom
    })

    const [holding, setHolding] = React.useState<boolean>(false)

    React.useEffect(() => {
        const mediaElement = document.querySelector<HTMLImageElement>(
            "[class^=layerContainer] [class^=loadingOverlay] img, [class^=layerContainer] [class^=loadingOverlay] video"
        )
        if (mediaElement) mediaRef.current = mediaElement
    })

    React.useEffect(() => {
        const media = mediaRef.current
        if (media instanceof HTMLVideoElement) {
            const src = props.media.src || props.media.url || props.media.original

            // function getKind() {
            //     return {type: src.includes("tenor") ? "tenor" : src.includes("klipy") ? "klipy" : ""}
            // }

            setVideoBgSrc(parseDiscordProxyUrl(src))
        } else {
            fetchedSrcRef.current = null
        }
    })

    function updateLensFromClientPos(clientX: number, clientY: number, event: MouseEvent) {
        const media = mediaRef.current
        if (!media) return
        const rect = media.getBoundingClientRect()

        const x = clamp(clientX - rect.left, 0, rect.width)
        const y = clamp(clientY - rect.top, 0, rect.height)

        setLens({
            x: (event.clientX - (size / 2)),
            y: (event.clientY - (size / 2)),
            imgX: x,
            imgY: y,
            rectW: rect.width,
            rectH: rect.height,
        })
    }

    function handleMouseMove(e: React.MouseEvent) {
        if (!holding) return
        updateLensFromClientPos(e.clientX, e.clientY, e)
    }

    function handleMouseDown(e: React.MouseEvent) {
        if (e.button == 2) return;

        const media = mediaRef.current
        if (!media) return
        fuckOffDiscord(e)

        setHolding(true)
        updateLensFromClientPos(e.clientX, e.clientY, e)
    }

    function handleMouseUp(e: React.MouseEvent) {
        if (e.button == 2) return;

        fuckOffDiscord(e)
        setHolding(false)
        setLens(null)
    }

    function handleMouseLeave(e: React.MouseEvent) {
        fuckOffDiscord(e)
        setHolding(false)
        setLens(null)
    }

    function handleScrollWheel(e: any) {
        fuckOffDiscord(e)
        if (!e.shiftKey) {
            setData(prev => ({
                ...prev,
                zoom: clamp(prev.zoom - e.deltaY * ZOOM_SENSITIVITY, 1, 10)
            }))
        } else {
            setData(prev => ({
                ...prev,
                size: clamp(prev.size - e.deltaY * SIZE_SENSITIVITY, 1, 400)
            }))
        }
    }

    const bgSrc = mediaRef.current instanceof HTMLImageElement
        ? (mediaRef.current.currentSrc || mediaRef.current.src)
        : mediaRef.current instanceof HTMLVideoElement
            ? videoBgSrc
            : undefined

    return (
        <div
            className="zoom"
            onWheelCapture={handleScrollWheel}
            onMouseMove={handleMouseMove}
            onMouseDownCapture={handleMouseDown}
            onMouseUpCapture={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            {lens && bgSrc && holding ? (
                <div
                    className="result"
                    style={{
                        position: "fixed",
                        left: lens.x,
                        top: lens.y,
                        width: size,
                        height: size,
                        borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.8)",
                        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                        pointerEvents: "none",
                        zIndex: 9999,
                        backgroundImage: `url(${bgSrc})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: `${lens.rectW * zoom}px ${lens.rectH * zoom}px`,
                        backgroundPosition: `${size / 2 - lens.imgX * zoom}px ${size / 2 - lens.imgY * zoom}px`,
                    }}
                />
            ) : null}
            {node}
        </div>
    )
}

function TestImageActionbar({data, isVideo, isGIF}) {
    const {width, height} = data
    const inset = 7

    const MIN_FOR_HAMBURGER = 40

    if (width < MIN_FOR_HAMBURGER || height < MIN_FOR_HAMBURGER) {
        return null
    }

    const getStyles = () => {
        return isVideo ? {
            top: isVideo ? inset - 3 : 0,
            left: isVideo ? inset - 3 : 0,
            background: "var(--background-gradient-chat,var(--background-base-lower))",
            width: 30,
            height: 30,
            borderRadius: "5px",
            padding: "6px",
        } : {
            bottom: inset,
        }
    }

    return <div
        {...{[IGNORE_ATTR]: true}}
        onMouseDown={fuckOffDiscord}
        onMouseUp={fuckOffDiscord}
        onMouseUpCapture={fuckOffDiscord}
        onDoubleClick={fuckOffDiscord}
        onWheel={fuckOffDiscord}
        onDragStart={fuckOffDiscord}
        onClick={(e) => {
            fuckOffDiscord(e)
            ContextMenu.open(e, () => <ContextMenu.Menu navId={"lenskit"}
                                                        onClose={() => GlobalModules.Dispatcher.dispatch({type: "CONTEXT_MENU_CLOSE"})}
                                                        imageProps={data}/>)
        }}
        //className={"hoverButton__06ab4"}
        style={{
            padding: "2px",
            position: 'absolute',
            left: inset,
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: "var(--opacity-black-60)",
            borderRadius: "5px",
            boxSizing: 'border-box',
            zIndex: 9999,
            ...getStyles(),
        }}>
        <HamburgerMenu/>
    </div>
}

export default class LensKit {
    async start() {
        const ZoomModule = await wpWait(Webpack.Filters.bySource(".ZOOM_IN_IMAGE_PRESSED),")).then(x => x)

        Patcher.after(ZoomModule.Ay, "type", (_, __, node) => {
            return <OverrideZoom props={__[0]} node={node}/>
        })

        const ImageMemo = Webpack.getModule(x => x.displayName == "Image", {searchExports: true})

        Patcher.after(ImageMemo, "render", (a, b, c) => {
            const childrenNode = c.props.children.props.children
            childrenNode.push(<TestImageActionbar data={b[0]} isVideo={b[0].alt == "Video"} isGIF={b[0].alt == "GIF"}/>)
        })

        // discords videos and mosaic images are genuinely fucking ass.
        // Patcher.after(VideoModule, "Ay", (_,__,___) => {
        //     if (__[0].item.type === "IMAGE") return ___
        //     return <VoicePlayer src={__[0].item.downloadUrl}/>
        // })

        this.unpatches = Object.entries(NavIds).map(([navId, value]) => {
            return Object.values(value).map(x => {
                return {
                    navId,
                    unpatch: ContextMenu.patch(navId, x.func)
                }
            })
        })
    }

    _settings = Settings;

    stop() {
        Patcher.unpatchAll()
        Object.entries(this.unpatches).map(([entry, value]) => {
            Object.values(value).map(x => {
                x.unpatch();
            })
        });
    }
}