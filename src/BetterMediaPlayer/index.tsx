/**
 * @name BetterMediaPlayer
 * @description Tries to improve the video player with more information.
 * @version 1.0.0
 * @author Kaan
 */
import { styled } from "../Helpers";

const { Webpack, Patcher, Utils, Hooks, DOM, React } = new BdApi("BetterMediaPlayer");
const { useState, useRef, useEffect } = React;
const VideoComponent = Webpack.getBySource(`["onVolumeChange","onMute",`) // Webpack.getBySource('disableArrowKeySeek', 'forceExternal');
const MediaClasses = Webpack.getByKeys('isInAppComponentsV2')
const Clickable = Webpack.getModule(x => String(x.render).includes('secondaryColorClass:'), { searchExports: true })
const ProgressBar = Webpack.getByStrings('percent:', 'foregroundColor:', { searchExports: true })
const Slider = Webpack.getModule(Webpack.Filters.byStrings("stickToMarkers", 'fillStyles'), { searchExports: true })

const { useStateFromStores } = Hooks;

const Container = styled.div({
    display: 'flex',
    flexDirection: 'column',
    gridColumn: '1 / -1',
    gridRow: 'auto',
    width: 'fit-content',
    position: 'relative'
});

const VideoElement = styled.video({
    display: 'block'
});

const ControlBar = styled.div({
    backgroundColor: '#2b2d31',
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 12px',
    boxSizing: 'border-box',
    color: 'white',
    gap: '8px'
});

const InfoContainer = styled.div({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px'
});

const FileName = styled.span({
    fontWeight: 'bold',
    textOverflow: 'ellipsis',
});

const FooterContainer = styled.div({
    display: 'flex',
    gap: '8px',
    justifyContent: 'center'
});

const FooterText = styled.span({
    textOverflow: 'ellipsis',
    color: 'var(--text-muted)'
});

const FormattedTime = styled.span({ whiteSpace: 'nowrap', fontSize: '12px', opacity: 0.7 })

const Pause = () => <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
    <path fill="var(--interactive-icon-default)"
        d="M16 19q-.825 0-1.412-.587T14 17V7q0-.825.588-1.412T16 5t1.413.588T18 7v10q0 .825-.587 1.413T16 19m-8 0q-.825 0-1.412-.587T6 17V7q0-.825.588-1.412T8 5t1.413.588T10 7v10q0 .825-.587 1.413T8 19"></path>
</svg>
const Resume = () => <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
    <path fill="var(--interactive-icon-default)"
        d="M6 17V7q0-.425.288-.712T7 6t.713.288T8 7v10q0 .425-.288.713T7 18t-.712-.288T6 17m5.525.1q-.5.3-1.012 0T10 16.225v-8.45q0-.575.513-.875t1.012 0l7.05 4.25q.5.3.5.85t-.5.85z"></path>
</svg>

const FullscreenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
    <path fill="var(--interactive-icon-default)"
        d="M6 18H4q-.425 0-.712-.288T3 17t.288-.712T4 16h3q.425 0 .713.288T8 17v3q0 .425-.288.713T7 21t-.712-.288T6 20zm12 0v2q0 .425-.288.713T17 21t-.712-.288T16 20v-3q0-.425.288-.712T17 16h3q.425 0 .713.288T21 17t-.288.713T20 18zM6 6V4q0-.425.288-.712T7 3t.713.288T8 4v3q0 .425-.288.713T7 8H4q-.425 0-.712-.288T3 7t.288-.712T4 6zm12 0h2q.425 0 .713.288T21 7t-.288.713T20 8h-3q-.425 0-.712-.288T16 7V4q0-.425.288-.712T17 3t.713.288T18 4z"></path>
</svg>

const ExitFullscreenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
    <path fill="var(--interactive-icon-default)"
        d="m10 15.4l-5.9 5.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7L8.6 14H5q-.425 0-.712-.288T4 13t.288-.712T5 12h6q.425 0 .713.288T12 13v6q0 .425-.288.713T11 20t-.712-.288T10 19zm5.4-5.4H19q.425 0 .713.288T20 11t-.288.713T19 12h-6q-.425 0-.712-.288T12 11V5q0-.425.288-.712T13 4t.713.288T14 5v3.6l5.9-5.9q.275-.275.7-.275t.7.275t.275.7t-.275.7z"></path>
</svg>

const { UserStore } = Webpack.Stores

const FullscreenUtils = Webpack.getMangled('requestFullscreen():"function"', {
    FindFullscreenElement: BdApi.Webpack.Filters.byStrings('arguments.length') as Function,
    RequestFullscreen: BdApi.Webpack.Filters.byStrings('"function"==typeof', '.requestFullscreen()', '.webkitRequestFullscreen()', '.webkitEnterFullscreen()') as Function,
    ExitFullscreen: BdApi.Webpack.Filters.byStrings('.exitFullscreen()', '.webkitExitFullscreen()', '.mozCancelFullScreen()', '.msExitFullscreen()') as Function,
    IsInFullscreen: BdApi.Webpack.Filters.byStrings('fullscreenElement||', 'mozFullScreenElement||', 'webkitFullscreenElement||', 'msFullscreenElement||', 'webkitDisplayingFullscreen') as Function,
    AddFullscreenListener: BdApi.Webpack.Filters.byStrings('.addEventListener(', '"webkitfullscreenchange"', '.removeEventListener(', 'return') as Function
})

function VideoWrapper({ args, children }) {
    const props = children.props;
    if (!props.message?.author) return children;

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [finished, setFinished] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef(null);
    const ref = useRef(null);

    const author = useStateFromStores([UserStore], () => UserStore.getUser(props.message.author.id));

    const actualWidth = props.width || props.item?.width || 1280;
    const actualHeight = props.height || props.item?.height || 720;
    const maxWidth = props.maxWidth || 550;
    const maxHeight = props.maxHeight || 350;

    const aspectRatio = actualWidth / actualHeight;
    let displayWidth = maxWidth;
    let displayHeight = maxWidth / aspectRatio;

    if (displayHeight > maxHeight) {
        displayHeight = maxHeight;
        displayWidth = maxHeight * aspectRatio;
    }

    const barWidth = Math.max(displayWidth, 150);

    const src = props.item?.downloadUrl || props.item?.originalItem?.url;

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "0:00";

        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleFullscreenChange = () => {
        const fullscreenElement = FullscreenUtils.FindFullscreenElement(containerRef.current?.parentNode, containerRef.current);
        const inFullscreen = FullscreenUtils.IsInFullscreen(fullscreenElement, document);
        setIsFullscreen(inFullscreen);
    };

    const toggleFullscreen = () => {
        const fullscreenElement = FullscreenUtils.FindFullscreenElement(containerRef.current?.parentNode, containerRef.current);

        if (isFullscreen) {
            FullscreenUtils.ExitFullscreen(fullscreenElement, document);
        } else {
            if (fullscreenElement) {
                FullscreenUtils.RequestFullscreen(fullscreenElement);
            }
        }
    };

    useEffect(() => {
        if (Math.round(currentTime) >= Math.round(duration) && duration > 0) {
            setFinished(true);
            setIsPlaying(false);
        }
    }, [currentTime, duration]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        // whatever works. discord likes all of them.

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    }, []);

    return (
        <Container ref={containerRef} style={isFullscreen ? {
            width: '100vw',
            height: '100vh',
            backgroundColor: 'black',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999
        } : {}}>
            <VideoElement
                style={{
                    width: isFullscreen ? '100%' : displayWidth,
                    height: isFullscreen ? 'calc(100% - 80px)' : displayHeight,
                    objectFit: isFullscreen ? 'contain' : 'initial'
                }}
                src={src}
                ref={ref}
                onTimeUpdate={(e) => {
                    if (!isDragging) {
                        setCurrentTime(e.target.currentTime);
                    }
                }}
                onLoadedMetadata={(e) => setDuration(e.target.duration)}
            />
            <ControlBar style={{ width: isFullscreen ? '100%' : barWidth, height: 'auto' }}>
                {<InfoContainer>
                    <FileName>{props.fileName}</FileName>
                    {!isFullscreen && <FooterContainer>
                        <FooterText>@{author.username || "owo ?"}</FooterText>
                        <FooterText>•</FooterText>
                        <FooterText>{(props.fileSize * 0.001024)} MB</FooterText>
                    </FooterContainer>}
                </InfoContainer>}
                {duration > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <Clickable onClick={() => {
                        if (finished) {
                            ref.current.currentTime = 0;
                            setCurrentTime(0);
                            setFinished(false);
                        }
                        setIsPlaying(prev => !prev);
                        isPlaying ? ref.current.pause() : ref.current.play();
                    }} icon={isPlaying ? Pause : Resume}></Clickable>
                    <Slider
                        label={""}
                        value={currentTime}
                        initialValue={0}
                        minValue={0}
                        hideBubble={true}
                        maxValue={duration}
                        asValueChanges={(newTime) => {
                            setIsDragging(true);
                            setCurrentTime(newTime);
                            if (ref.current) {
                                ref.current.currentTime = newTime;
                            }
                        }}
                        onValueChange={(newTime) => {
                            setIsDragging(false);
                            setCurrentTime(newTime);
                            if (ref.current) {
                                ref.current.currentTime = newTime;
                            }
                        }}
                    />
                    <FormattedTime>
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </FormattedTime>
                    <Clickable onClick={toggleFullscreen}
                        icon={isFullscreen ? ExitFullscreenIcon : FullscreenIcon}></Clickable>
                </div>}
            </ControlBar>
        </Container>
    );
}

const css = `
.${MediaClasses.oneByOneGridSingle} {
    max-height: none;
}
`

function getKey(module, fn) {
    for (var key in module) {
        if (fn(module[key])) {
            return { key: key, module: module };
            break;
        }
    }
    return {
        key: null,
        module: null
    }
}

export default class BetterMediaPlayer {
    start() {
        const module = getKey(VideoComponent, Webpack.Filters.byRegex(/return\(0,.{1}.jsx\)\(.{1},.{1}\({},.{1}\)\)/))

        Patcher.after(module.module, module.key, (a, args, res) => {
            return <VideoWrapper args={args}>{res}</VideoWrapper>;
        });

        DOM.addStyle(css)
    }

    stop() {
        Patcher.unpatchAll();
        DOM.removeStyle()
    }
}