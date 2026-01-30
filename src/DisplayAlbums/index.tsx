/**
 * @name DisplayAlbums
 * @description Replaces the default MP3/mu3a etc files with a nicer display
 * @author Kaan
 * @version 1.0.0
 */
const { Patcher, Webpack, Data, React, Utils } = new BdApi("DisplayAlbums")
import MP3Tag from './mp3tag'
import { styled } from '../Helpers';

const Slider = Webpack.getModule(Webpack.Filters.byStrings("stickToMarkers", 'fillStyles'), { searchExports: true })
const Clickable = Webpack.getModule(x => String(x.render).includes('secondaryColorClass:'), { searchExports: true })
const Mediabar = Webpack.getByStrings('sliderWrapperClassName')

const PlayerBackground = styled.div({
    background: 'var(--background-base-low)',
    color: 'var(--text-default)',
    padding: '16px',
    gap: '16px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column'
})

const TopSection = styled.div({
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    alignItems: 'center'
})

const AlbumArt = styled.img({
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px',
    flexShrink: 0,
    background: 'var(--background-secondary)'
})

const MetadataContainer = styled.div({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '4px',
    flex: 1
})

const Title = styled.div({
    fontSize: '18px',
    fontWeight: '600',
    color: 'white'
})

const Info = styled.div({
    fontSize: '12px',
    color: 'var(--text-muted)',
    opacity: 0.8
})

const PlayerControls = styled.div({
    display: 'flex',
    backgroundColor: 'var(--background-base-lowest)',
    alignItems: 'center',
    gap: '8px',
    width: '100%'
})

const SliderContainer = styled.div({
    flex: 1
})

function Show({ when, children }) {
    return when && children
}

const ID3CacheStore = new class ID3 extends Utils.Store {
    private id3cache: Record<string, object> = {}

    cacheID3(name, id3) {
        this.id3cache[name] = id3
        this.emitChange();
    }

    getID3(name) {
        return this.id3cache[name]
    }

    isCached(name) {
        return !!this.id3cache[name]
    }
}

const FormattedTime = styled.span({ whiteSpace: 'nowrap', fontSize: '12px', opacity: 0.7 })

const Pause = () => <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
    <path fill="var(--interactive-icon-default)"
        d="M16 19q-.825 0-1.412-.587T14 17V7q0-.825.588-1.412T16 5t1.413.588T18 7v10q0 .825-.587 1.413T16 19m-8 0q-.825 0-1.412-.587T6 17V7q0-.825.588-1.412T8 5t1.413.588T10 7v10q0 .825-.587 1.413T8 19"></path>
</svg>
const Resume = () => <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
    <path fill="var(--interactive-icon-default)"
        d="M6 17V7q0-.425.288-.712T7 6t.713.288T8 7v10q0 .425-.288.713T7 18t-.712-.288T6 17m5.525.1q-.5.3-1.012 0T10 16.225v-8.45q0-.575.513-.875t1.012 0l7.05 4.25q.5.3.5.85t-.5.85z"></path>
</svg>

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function VolumeSlider({ defaultVolume, onValueChange, muted }) {
    const [volume, setVolume] = React.useState(defaultVolume)

    return <Mediabar
        minValue={0}
        maxValue={0.1}
        muted={muted}
        value={volume}
        onValueChange={(newVolume) => {
            setVolume(newVolume)
            onValueChange(newVolume)
        }}
    />
}

function AudioComponent({ props, fallback }) {
    const data = props[0];
    const [metadata, setMetadata] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [imageUrl, setImageUrl] = React.useState(null);
    const [didError, setDidError] = React.useState(false);
    const [isHolding, setIsHolding] = React.useState(false)
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [currentTime, setCurrentTime] = React.useState(0)
    const [finished, setFinished] = React.useState(false)
    const [duration, setDuration] = React.useState(0)

    const ref = React.useRef(null);

    const load = async () => {
        if (isLoading || metadata) return;
        setIsLoading(true);

        try {
            let mp3tag;
            let arrayBuffer;

            if (ID3CacheStore.isCached(data.item.uniqueId)) {
                const cached = ID3CacheStore.getID3(data.item.uniqueId);
                mp3tag = cached.mp3tag;
                arrayBuffer = cached.arrayBuffer;
            } else {
                const response = await BdApi.Net.fetch(data.item.originalItem.proxy_url);
                arrayBuffer = await response.arrayBuffer();
                mp3tag = new MP3Tag(arrayBuffer);
                mp3tag.read();

                ID3CacheStore.cacheID3(data.item.uniqueId, { mp3tag, arrayBuffer });
            }

            setMetadata(mp3tag.tags);

            let pictureData = mp3tag.tags.v2.APIC[0] ? mp3tag.tags.v2.APIC[0] : mp3tag.tags.v2.PIC[0];

            if (pictureData && pictureData.data) {
                const uint8Array = new Uint8Array(pictureData.data);
                let binary = '';
                for (let i = 0; i < uint8Array.length; i++) {
                    binary += String.fromCharCode(uint8Array[i]);
                }
                const base64 = window.btoa(binary);
                const mimeType = pictureData.format || pictureData.mime || 'image/jpeg';
                setImageUrl(`data:${mimeType};base64,${base64}`);
            }

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setDidError(true);
        }
    };

    React.useEffect(() => {
        load();
    }, []);

    React.useEffect(() => {
        if (ref.current) {
            ref.current.volume = 0.1
        }
    }, [metadata])

    if (didError) return fallback;

    return (
        !!metadata && <PlayerBackground className={data.className}>
            <TopSection>
                {imageUrl && <AlbumArt src={imageUrl} />}
                <MetadataContainer>
                    <Show when={!!metadata.title}>
                        <Title>{metadata.title}</Title>
                    </Show>
                    <Show when={!!metadata.artist}>
                        <Info>{metadata.artist}</Info>
                    </Show>
                    <Show when={!!metadata.album}>
                        <Info>{metadata.album}</Info>
                    </Show>
                </MetadataContainer>
            </TopSection>
            <PlayerControls>
                <Clickable icon={isPlaying ? Pause : Resume} onClick={() => {
                    if (finished) {
                        ref.current.currentTime = 0;
                        setCurrentTime(0);
                        setFinished(false);
                    }
                    setIsPlaying(prev => !prev);
                    isPlaying ? ref.current.pause() : ref.current.play();
                }} />
                <SliderContainer>
                    <Slider hideBubble={true} value={ref?.current?.currentTime || 0}
                        maxValue={duration}
                        asValueChanges={(newTime) => {
                            setIsHolding(true);
                            setCurrentTime(newTime);
                            if (ref.current) {
                                ref.current.currentTime = newTime;
                            }
                        }}
                        onValueChange={(newTime) => {
                            setIsHolding(false);
                            setCurrentTime(newTime);
                            if (ref.current) {
                                ref.current.currentTime = newTime;
                            }
                        }}
                    />
                </SliderContainer>
                <FormattedTime>{formatTime(currentTime)} / {formatTime(duration)}</FormattedTime>
                <VolumeSlider defaultVolume={0.1} onValueChange={(newVolume) => {
                    if (ref.current) {
                        ref.current.volume = newVolume
                    }
                }} />
            </PlayerControls>
            <audio ref={ref} onTimeUpdate={(e) => {
                if (!isHolding) {
                    setCurrentTime(e.target.currentTime);
                }
            }}
                onEnded={() => {
                    setIsPlaying(false);
                    setFinished(true);
                }}
                onLoadedMetadata={(e) => setDuration(e.target.duration)} src={data.item.originalItem.proxy_url} />
        </PlayerBackground >
    );
}

export default class DisplayAlbums {
    start() {
        Patcher.after(n(266620), 'Nj', (_, props, res) => {
            return <AudioComponent props={props} fallback={res} />
        })
    }

    stop() {
        Patcher.unpatchAll()
    }
}