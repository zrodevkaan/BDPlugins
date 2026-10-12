import {React} from "../shared"
import type {SyntheticEvent} from "react";

export function VoicePlayer({src}: {src: string}) {
    const player = React.useRef<HTMLVideoElement>(null);
    const _ref = React.useRef<HTMLVideoElement>(null);
    const [videoInformation, setVideoInformation] = React.useState({
        width: 0,
        height: 0,
        name: "video",
        duration: 0.00,
    })

    const [volume, setVolume] = React.useState(0)
    const [state, setState] = React.useState({
        playing: false,
        fullscreened: false,
        currentTime: 0,
    })

    function getMetadata(e: SyntheticEvent<HTMLVideoElement>) {
        const video = e.currentTarget;
        const name = src.split("/").pop()?.split("?")[0] ?? "video";

        setVideoInformation({
            width: video.videoWidth,
            height: video.videoHeight,
            name,
            duration: video.duration,
        })
    }

    return <div ref={_ref} key={"react-suckls"}>
        <video
            onLoadedMetadata={getMetadata}
            ref={player}
            src={src}
            style={{ width: _ref.current?.parentElement?.parentElement?.clientWidth, height: _ref.current?.parentElement?.parentElement?.clientHeight }}
            controls={false}
            disablePictureInPicture
            controlsList="nodownload noplaybackrate nofullscreen"
        />
    </div>
}