/**
 * @name VoiceMessagePlayer
 * @author Kaan
 * @version 1.0.0
 * @description Recreation of the popout on mobile for voice messages.
 */
const { Patcher, React, Webpack, DOM, ContextMenu, UI, Net, Utils, Data, Hooks } = new BdApi(
  'VoiceMessagePlayer'
);
const { Stores } = Webpack;
const { Store, className } = Utils;
const { useStateFromStores } = Hooks;
import _css from './index.css';

import { styled } from '../Helpers';

type SelfAudio = {
  id: string;
  url: string;
  playing: boolean;
  muted: boolean;
  currentTime: number;
  volume: number;
  key: string;
};

const Module = Webpack.getByKeys('create');

const [Dispatch, AppRoot, AudioComponent] = Webpack.getBulk(
  { filter: x => x._dispatch },
  { filter: Webpack.Filters.bySource('Shakeable') },
  { filter: Webpack.Filters.bySource('playbackCacheKey', '"metadata"') }
);

function ForceUpdateRoot() {
  Dispatch.dispatch({ type: 'DOMAIN_MIGRATION_START' });
  requestIdleCallback(() => Dispatch.dispatch({ type: 'DOMAIN_MIGRATION_SKIP' }));
}

class AudioStore extends Store {
  private Audios: SelfAudio[] = [];
  private mostRecentURL = '';

  constructor() {
    super();
  }

  addAudio(audio: SelfAudio) {
    if (this.Audios.find(x => x.url === audio.url)) return;
    this.Audios.push(audio);
    this.emitChange();
  }

  getAudios() {
    return this.Audios;
  }

  setMostRecentlyPlayedURL(url: string) {
    this.mostRecentURL = url;
    this.emitChange();
  }

  getMostRecentlyPlayedURL() {
    return this.mostRecentURL;
  }

  deleteAudio(url: string) {
    this.Audios = this.Audios.filter(x => x.url !== url);
    this.emitChange();
  }

  getAudio(id: string) {
    return this.Audios.find(x => x.id === id);
  }

  playAudio(url: string) {
    const audio = this.Audios.find(x => x.url === url);
    if (audio) {
      audio.playing = true;
      this.emitChange();
    }
  }
}

const AudioStoreInstance = new AudioStore();

const ColoredText = styled.span(({ color }) => ({
  color: color || 'white',
}));

const Pause = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 22 22">
    <path
      fill="white"
      d="M16 19q-.825 0-1.412-.587T14 17V7q0-.825.588-1.412T16 5t1.413.588T18 7v10q0 .825-.587 1.413T16 19m-8 0q-.825 0-1.412-.587T6 17V7q0-.825.588-1.412T8 5t1.413.588T10 7v10q0 .825-.587 1.413T8 19"
    ></path>
  </svg>
);

const Resume = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 22 22">
    <path
      fill="white"
      d="M6 17V7q0-.425.288-.712T7 6t.713.288T8 7v10q0 .425-.288.713T7 18t-.712-.288T6 17m5.525.1q-.5.3-1.012 0T10 16.225v-8.45q0-.575.513-.875t1.012 0l7.05 4.25q.5.3.5.85t-.5.85z"
    ></path>
  </svg>
);

const AudioElement = React.memo(({ Audio }: { Audio: SelfAudio }) => {
  const AudioData = useStateFromStores([Stores.MediaPlaybackStore], () => {
    return {
      time: Stores.MediaPlaybackStore.getPlaybackPosition(Audio.key),
      volume: Stores.MediaPlaybackStore.getPlaybackRate(Audio.key),
    };
  });

  const audio = useStateFromStores([AudioStoreInstance], () =>
    AudioStoreInstance.getAudio(Audio.id)
  );

  console.log(audio);

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = React.useState(Audio.playing);
  const [volume, setVolume] = React.useState(AudioData.volume);
  const [muted, setMuted] = React.useState(Audio.muted);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [pressing, setPressing] = React.useState(false);

  React.useEffect(() => {
    if (audioRef.current && AudioData !== undefined) {
      audioRef.current.currentTime = AudioData.time;
      setCurrentTime(AudioData.time);
    }
  }, [AudioData]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        AudioStoreInstance.setMostRecentlyPlayedURL(Audio.url);
      }
      setPlaying(!playing);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  React.useEffect(() => {
    if (audioRef.current && AudioData !== undefined) {
      audioRef.current.currentTime = AudioData.time;
      setCurrentTime(AudioData.time);

      if (audio?.playing && !playing) {
        audioRef.current.play();
        setPlaying(true);
      }
    }
  }, [AudioData, audio?.playing]);

  return (
    <div
      onDoubleClick={() => {
        // AudioStoreInstance.deleteAudio(Audio.url)
      }}
      className="audio-base"
    >
      <audio
        ref={audioRef}
        src={Audio.url}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        style={{ display: 'none' }}
      />

      <div className="audio-base-controls">
        <button onClick={togglePlay} className="play-button">
          {playing ? <Pause size={30} /> : <Resume size={30} />}
        </button>

        <span className="time">{formatTime(currentTime)}</span>
        <span className="divider">/</span>
        <span className="time">{formatTime(duration)}</span>
      </div>
    </div>
  );
});

/*
<button onClick={toggleMute} className="mute-button">
    {muted ? '' : '🔊'}
</button>
<input
    type="range"
    min="0"
    max="1"
    step="0.01"
    value={volume}
    onChange={handleVolumeChange}
    className="volume-bar"
/>

// Do with some circle shit. idk
<input
    type="range"
    min="0"
    max={duration || 0}
    value={currentTime}
    onChange={handleSeek}
    className="seek-bar"
/>
 */

const BaseBackground = styled.div({
  position: 'absolute',
  width: '100px',
  height: '100px',
  backgroundColor: 'var(--background-base-lower)',
  top: '30px',
  right: '30px',
  zIndex: 10000,
});

const AudioPopout = React.memo(() => {
  const Audios: SelfAudio[] = useStateFromStores(
    [AudioStoreInstance],
    () => AudioStoreInstance.getAudios().concat(),
    []
  );

  const [hovering, setHovering] = React.useState(false);

  const ref = React.useRef(null);

  return (
    Audios.length > 0 && (
      <BaseBackground
        className={'audioBackground'}
        style={{
          opacity: hovering ? 1 : 0.5,
        }}
        ref={ref}
        onMouseEnter={e => {
          setHovering(true);
        }}
        onMouseLeave={e => {
          setHovering(false);
        }}
      >
        {Audios.map(x => {
          return (
            <>
              <AudioElement Audio={x} />
              <span
                className="audioCloseButton"
                onClick={() => AudioStoreInstance.deleteAudio(x.url)}
              >
                X
              </span>
            </>
          );
        })}
      </BaseBackground>
    )
  );
});

export default class VoiceMessagePlayer {
  start() {
    ForceUpdateRoot();

    DOM.addStyle('VoiceMessagePlayer', _css);

    Patcher.after(AppRoot.Z, 'type', (_, __, res) => {
      res.props.children.push(<AudioPopout />);
    });

    Patcher.after(AudioComponent.Z, 'type', (_, [__], res) => {
      const children = Utils.findInTree(res, x => x?.ref, { walkable: ['props', 'children'] });
      const unpatch = Patcher.after(children.ref.current, 'play', (args: HTMLElement, b, c) => {
        unpatch();
        const domElement = args.children[0] as HTMLAudioElement;
        AudioStoreInstance.addAudio({
          id: String(performance.now()),
          url: domElement.src,
          playing: false,
          muted: false,
          currentTime: Stores.MediaPlaybackStore.getPlaybackPosition(__.playbackCacheKey),
          volume: 1,
          key: __.playbackCacheKey,
        });
      });
    });
  }

  onSwitch() {
    const recentURL = AudioStoreInstance.getMostRecentlyPlayedURL();
    if (recentURL) {
      const audio = AudioStoreInstance.getAudios().find(x => x.url === recentURL);
      if (audio) {
        AudioStoreInstance.playAudio(recentURL);
      }
    }
  }

  get audio() {
    return AudioStoreInstance.getAudios();
  }

  stop() {
    DOM.removeStyle('VoiceMessagePlayer');
    Patcher.unpatchAll();
  }
}
