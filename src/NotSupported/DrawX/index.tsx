/**
 * @name DrawX
 * @author Kaan
 * @description A knock-off to remix because they cannot maintain a basic canvas feature.
 * @version 1.0.0
 */

import css from './index.css?raw';

const { Webpack, Patcher, React, Components, DOM } = new BdApi("DrawX");
const { Filters } = Webpack;
const { Button, SliderInput } = Components
const { useRef, useEffect, useState, useCallback } = React;
const LayerActions = Webpack.getMangled('LAYER_POP_ALL', {
    pushLayer: Filters.byStrings('"LAYER_PUSH"'),
    popLayer: Filters.byStrings('"LAYER_POP"'),
    popAllLayers: Filters.byStrings('"LAYER_POP_ALL"')
});
const SelectedStore = Webpack.getStore('SelectedChannelStore')
const mods = Webpack.getByKeys('getSendMessageOptionsForReply')
const PendingReplyStore = Webpack.getStore("PendingReplyStore")
const FluxDispatcher = Webpack.getModule(x => x._dispatch)
const Popout = Webpack.getModule(m => m?.Animation, { searchExports: true, raw: true }).exports.y

export const timestampToSnowflake = (timestamp: number): string => {
    const DISCORD_EPOCH = BigInt(1420070400000);
    const SHIFT = BigInt(22);

    const ms = BigInt(timestamp) - DISCORD_EPOCH;
    return ms <= BigInt(0) ? "0" : (ms << SHIFT).toString();
};

const CloudUploader = Webpack.getByStrings('uploadFileToCloud', { searchExports: true })
const [
    UploadCard,
    ToolbarButton
] = Webpack.getBulk({
    filter: Filters.bySource('cuurzA', 'keyboardModeEnabled')
}, { filter: Filters.byStrings('actionBarIcon') })

function ImageHistory() {
    return (
        <div className="drawx-history-wrapper">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="drawx-history-item" />
            ))}
        </div>
    )
}

function getDiscordImageExpiry(url: string) {
    const exMatch = url.match(/ex=([a-f0-9]+)/i);
    const isMatch = url.match(/is=([a-f0-9]+)/i);

    if (!exMatch) return null;

    const exTimestamp = parseInt(exMatch[1], 16);
    const exDate = new Date(exTimestamp * 1000);

    const result = {
        expiresAt: exDate.toLocaleString(),
        timestamp: exTimestamp
    };

    if (isMatch) {
        const isTimestamp = parseInt(isMatch[1], 16);
        const validityHours = ((exTimestamp - isTimestamp) / 3600).toFixed(1);
        result.validFor = `${validityHours} hours`;
    }

    return result;
}

async function upload(name, buffer, channelId) {
    const yeah = buffer

    const file = new File([yeah], `${name}.png`, { type: 'image/png' });

    const replyOptions = mods.getSendMessageOptionsForReply(
        PendingReplyStore.getPendingReply(channelId),
    );
    if (replyOptions.messageReference) {
        FluxDispatcher.dispatch({ type: "DELETE_PENDING_REPLY", channelId });
    }

    const upload = new CloudUploader({ file }, SelectedStore.getCurrentlySelectedChannelId());

    const messagePayload = {
        flags: 0,
        channel_id: channelId,
        content: "",
        sticker_ids: [],
        validNonShortcutEmojis: [],
        type: 0,
        messageReference: replyOptions?.messageReference || null,
        nonce: timestampToSnowflake(Date.now()),
    };

    mods.sendMessage(channelId, messagePayload, null, {
        attachmentsToUpload: [upload],
        onAttachmentUploadError: () => false,
        ...messagePayload,
    });
}

function Body({ name, uploadFile, channelId, type }) {
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState<CanvasRenderingContext2D>(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
    const [brushColor, setBrushColor] = useState('#00FFAA');
    const [brushSize, setBrushSize] = useState(3);
    const colors = ['black', 'red', 'blue', 'tan', 'gray', 'white', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
    const [shouldShow, setShouldShow] = useState(false);
    const targetElementRef = useRef(null);
    const [points, setPoints] = useState([]);
    const lastPointRef = useRef(null);
    const [smoothDrawing, setSmoothDrawing] = useState(true);
    const [gif, setGif] = useState(null)

    useEffect(() => {
        const canvas: HTMLCanvasElement = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', {
            willReadFrequently: false,
            alpha: true
        });
        if (!ctx) return;

        setContext(ctx);

        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = brushColor;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        if (uploadFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    let width = img.naturalWidth;
                    let height = img.naturalHeight;

                    const maxWidth = 1980;
                    const maxHeight = 1080;
                    const scale = Math.min(maxWidth / width, maxHeight / height, 1);

                    width = Math.floor(width * scale);
                    height = Math.floor(height * scale);

                    setCanvasSize({ width, height });
                    canvas.width = width;
                    canvas.height = height;

                    setBackgroundImage(img);
                    ctx.drawImage(img, 0, 0, width, height);

                    ctx.lineWidth = brushSize;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.strokeStyle = brushColor;
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(uploadFile);
        } else {
            canvas.width = canvasSize.width;
            canvas.height = canvasSize.height;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = brushColor;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
        }
    }, [uploadFile]);

    useEffect(() => {
        if (context) {
            context.lineWidth = brushSize;
            context.strokeStyle = brushColor;
        }
    }, [brushSize, brushColor, context]);

    const getMousePos = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const drawSmoothLine = (point1, point2) => {
        if (!context) return;

        const midPoint = {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2
        };

        context.quadraticCurveTo(point1.x, point1.y, midPoint.x, midPoint.y);
        context.stroke();
    };

    const handlePointerDown = (e) => {
        e.preventDefault();
        setIsDrawing(true);

        if (context) {
            const pos = getMousePos(e);
            context.beginPath();
            context.moveTo(pos.x, pos.y);
            lastPointRef.current = pos;
            setPoints([pos]);
        }
    };

    const handlePointerMove = useCallback((e) => {
        if (!isDrawing || !context) return;

        e.preventDefault();
        const pos = getMousePos(e);

        if (smoothDrawing && lastPointRef.current) {
            const midPoint = {
                x: (lastPointRef.current.x + pos.x) / 2,
                y: (lastPointRef.current.y + pos.y) / 2
            };

            context.quadraticCurveTo(
                lastPointRef.current.x,
                lastPointRef.current.y,
                midPoint.x,
                midPoint.y
            );
            context.stroke();

            lastPointRef.current = pos;
        } else if (lastPointRef.current) {
            context.lineTo(pos.x, pos.y);
            context.stroke();
            lastPointRef.current = pos;
        }

        setPoints(prev => [...prev, pos]);
    }, [isDrawing, context, smoothDrawing]);

    const throttledHandlePointerMove = useCallback(
        (() => {
            let lastTime = 0;
            const throttleMs = 16; // ~60fps

            return (e) => {
                const now = Date.now();
                if (now - lastTime >= throttleMs) {
                    lastTime = now;
                    handlePointerMove(e);
                }
            };
        })(),
        [handlePointerMove]
    );

    const handlePointerUp = (e) => {
        e.preventDefault();

        if (isDrawing && context && points.length > 0) {
            const pos = getMousePos(e);
            context.lineTo(pos.x, pos.y);
            context.stroke();
        }

        setIsDrawing(false);
        lastPointRef.current = null;
        setPoints([]);

        if (context) {
            context.closePath();
        }
    };

    const handlePointerLeave = (e) => {
        if (isDrawing) {
            handlePointerUp(e);
        }
    };

    const handleUploadClick = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const buffer = e.target.result;
                upload(name, buffer, channelId);
                LayerActions.popLayer();
            };
            reader.readAsArrayBuffer(blob);
        }, 'image/png');
    };

    return (
        <div className="drawx-container">
            <div className="drawx-image-history">
                <ImageHistory />
            </div>
            <div className="drawx-canvas-wrapper">
                <canvas
                    ref={canvasRef}
                    className="drawx-canvas"
                    onPointerDown={handlePointerDown}
                    onPointerMove={throttledHandlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerLeave}
                    style={{ touchAction: 'none' }}
                />
            </div>
            <div className="drawx-toolbar">
                <button
                    onClick={handleUploadClick}
                    className="drawx-upload-btn"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                </button>

                <div className="drawx-color-palette">
                    {colors.map(color => (
                        <div
                            key={color}
                            className={`drawx-color-swatch ${brushColor === color ? 'active' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setBrushColor(color)}
                        />
                    ))}
                </div>
                <div ref={targetElementRef}>
                    <Popout
                        shouldShow={shouldShow}
                        targetElementRef={targetElementRef}
                        onRequestClose={() => setShouldShow(false)}
                        renderPopout={() => (
                            <div className="drawx-color-picker-popout">
                                <input
                                    type="color"
                                    value={brushColor}
                                    onChange={(e) => {
                                        setBrushColor(e.target.value);
                                        setShouldShow(false);
                                    }}
                                />
                            </div>
                        )}
                        children={() => (
                            <div
                                className={`drawx-color-swatch`}
                                style={{ backgroundColor: brushColor }}
                                onClick={() => setShouldShow(!shouldShow)}
                            />
                        )}
                    />
                </div>
                <div className="drawx-brush-size-control">
                    <SliderInput
                        min={1}
                        max={200}
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e))}
                    />
                    <span className="drawx-brush-size-label">{brushSize}px</span>
                </div>
            </div>
        </div>
    );
}

/*
<div className="drawx-smooth-toggle">
                    <div className="drawx-smooth-toggle">
                        <SmoothDrawingCheckbox
                            checked={smoothDrawing}
                            onChange={(e) => setSmoothDrawing(e.target.checked)}
                        />
                    </div>
                </div> */

export default class DrawX {
    start() {
        DOM.addStyle('DrawX', css)
        Patcher.after(UploadCard, "Z", (_, [args], res) => {
            const uploadFile = args?.upload?.item?.file;

            res.props.actions.props.children.unshift(
                <ToolbarButton
                    tooltip={"DrawX"}
                    type={uploadFile.type}
                    onClick={() => {
                        LayerActions.pushLayer(() => <Body name={uploadFile.name} uploadFile={uploadFile} channelId={SelectedStore.getCurrentlySelectedChannelId()} />);
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512"><path fill="var(--interactive-icon-default)" d="m70.2 337.4l104.4 104.4L441.5 175L337 70.5L70.2 337.4zM.6 499.8c-2.3 9.3 2.3 13.9 11.6 11.6L151.4 465L47 360.6L.6 499.8zM487.9 24.1c-46.3-46.4-92.8-11.6-92.8-11.6c-7.6 5.8-34.8 34.8-34.8 34.8l104.4 104.4s28.9-27.2 34.8-34.8c0 0 34.8-46.3-11.6-92.8z"></path></svg>
                </ToolbarButton>
            )
        })
    }

    stop() {
        DOM.removeStyle(css)
        Patcher.unpatchAll()
        LayerActions.popAllLayers();
    }
}