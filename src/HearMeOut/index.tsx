/**
 * @name HearMeOut
 * @author Kaan
 * @version 1.0.0
 * @description A post 2.0 BD plugin for sending messages.
 */

import {mediaModule, record, audioBufferToBlob} from "./utils.ts";

const { Webpack, React, DOM, Components } = new BdApi('HearMeOut');
const ModalRoot = Webpack.getModule(Webpack.Filters.byStrings('.ImpressionTypes.MODAL,"aria-labelledby":'), { searchExports: true })

const css = `
@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes waveAnimation {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}

@keyframes recordingPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.voice-recorder {
  background: #2b2d31;
  border: 1px solid #3e4147;
  border-radius: 12px;
  padding: 32px;
  color: #f2f3f5;
  font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
}

.recorder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid #3e4147;
}

.recorder-title {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.recorder-info {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #b5bac1;
}

.recorder-content {
  align-items: start;
}

.controls-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.button-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin: 10px;
}

.btn-record {
  background: #5865f2;
  color: #ffffff;
  font-weight: 600;
} 

.recorder-visual {
  background: #1e1f23;
  border: 1px solid #3e4147;
  border-radius: 12px;
  padding: 40px 32px;
  text-align: center;
}

.waveform-container {
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 3px;
  margin-bottom: 24px;
  height: 80px;
}

.waveform-bar {
  width: 6px;
  background: #5865f2;
  border-radius: 3px;
  opacity: 0.4;
  transition: all 0.3s ease;
}

.waveform-container.recording .waveform-bar {
  animation: waveAnimation 1s ease-in-out infinite;
  opacity: 1;
}

.waveform-container.recording .waveform-bar:nth-child(1) { animation-delay: 0s; }
.waveform-container.recording .waveform-bar:nth-child(2) { animation-delay: 0.1s; }
.waveform-container.recording .waveform-bar:nth-child(3) { animation-delay: 0.2s; }
.waveform-container.recording .waveform-bar:nth-child(4) { animation-delay: 0.3s; }
.waveform-container.recording .waveform-bar:nth-child(5) { animation-delay: 0.4s; }
.waveform-container.recording .waveform-bar:nth-child(6) { animation-delay: 0.5s; }
.waveform-container.recording .waveform-bar:nth-child(7) { animation-delay: 0.6s; }
.waveform-container.recording .waveform-bar:nth-child(8) { animation-delay: 0.7s; }

.status-text {
  color: #b5bac1;
  font-size: 16px;
  margin: 0;
  font-weight: 500;
}

.status-text.recording {
  color: #ed4245;
  animation: pulse 1.5s infinite;
}

.recording-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #ed4245;
}

.recording-dot {
  width: 8px;
  height: 8px;
  background: #ed4245;
  border-radius: 50%;
  animation: pulse 1s infinite;
}

.warning-box {
  background: var(--background-feedback-warning);
  color: var(--text-feedback-warning);
  padding: 14px 18px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  margin-top: 16px;
}

.warning-text {
  flex: 1;
}

.cancel-section {
  grid-column: 1 / -1;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #3e4147;
}

.cancel-btn {
  background: #4e5058;
  border: 1px solid #5c6169;
  color: #f2f3f5;
  font-size: 14px;
  cursor: pointer;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.cancel-btn:hover {
  background: #5c6169;
}


`

const VoiceRecorder = ({ props }) => {
    const [isRecording, setIsRecording] = React.useState(false);
    const [audioUrl, setAudioUrl] = React.useState(null);

    React.useEffect(() => {
        console.log(audioUrl)
    })

    const startRecording = async () => {
        const audioBuffer = await record();

        const blob = audioBufferToBlob(audioBuffer);

        const arrayBuffer = await blob.arrayBuffer();
        const uintArray = new Uint8Array(arrayBuffer);
        console.log("Uint8Array of WAV data:", uintArray);

        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        const audio = document.createElement("audio");
        audio.src = url;
        audio.crossOrigin = "anonymous";
        audio.volume = 0.1;
        document.body.appendChild(audio);
        await audio.play();
    };

    const handleToggleRecording = async () => {
        if (isRecording) {
            mediaModule.getMediaEngine().stopRecordingRawSamples();
            setIsRecording(false);
            return;
        }
        else if (!isRecording)
        {
            setAudioUrl(null);
            setIsRecording(true);
            await startRecording()
        }
        /*if (isRecording) {
            mediaModule.getMediaEngine().stopRecordingRawSamples();
            console.log(audioRef)
            setIsRecording(false);
            await startRecording();
        } else {
            setIsRecording(true);
        }*/
    };

    const handleCancel = () => {
        /*if (isRecording) {
            mediaModule.getMediaEngine().stopRecordingRawSamples();
        }
        setIsRecording(false);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.remove();
            audioRef.current = null;
        }

        setAudioUrl(null);*/
    };

    const handleUploadRecording = () => {
        if (audioUrl) {
            console.log("Upload logic goes here for URL:", audioUrl);
        } else {
            console.warn("No audio to upload");
        }
    };

    const WaveformBars = () => {
        const heights = [25, 45, 60, 35, 50, 70, 20, 55];
        return heights.map((height, index) => (
            <div key={index} className="waveform-bar" style={{ height: `${height}px` }} />
        ));
    };

    return (
        <ModalRoot {...props} size="large">
            <div className="voice-recorder">
                <div className="recorder-header">
                    <h2 className="recorder-title">Voice Recorder</h2>
                </div>

                <div className="recorder-content">
                    <div className="controls-section">
                        <div className="button-row">
                            <Components.Button onClick={handleUploadRecording}>
                                Upload File
                            </Components.Button>
                            <Components.Button onClick={handleToggleRecording}>
                                {isRecording ? "Stop Recording" : "Start Recording"}
                            </Components.Button>
                        </div>
                    </div>

                    <div className="recorder-visual">
                        <div className={`waveform-container ${isRecording ? "recording" : ""}`}>
                            <WaveformBars />
                        </div>
                        <p className={`status-text ${isRecording ? "recording" : ""}`}>
                            {isRecording ? "Recording in progress..." : "Ready to capture your voice"}
                        </p>
                        {isRecording && (
                            <div className="recording-indicator">
                                <div className="recording-dot"></div>
                                <span>REC</span>
                            </div>
                        )}
                    </div>

                    <div className="warning-box">
                        <span className="warning-text">
                            You may not have the ability to hear others if in a voice call.
                        </span>
                    </div>

                    <div className="cancel-section">
                        <Components.Button onClick={handleCancel}>Cancel</Components.Button>
                    </div>
                </div>
            </div>
        </ModalRoot>
    );
};


const ModalSystem = Webpack.getMangled(".modalKey?", {
    openModalLazy: Webpack.Filters.byStrings(".modalKey?"),
    openModal: Webpack.Filters.byStrings(",instant:"),
    closeModal: Webpack.Filters.byStrings(".onCloseCallback()"),
    closeAllModals: Webpack.Filters.byStrings(".getState();for")
});

export default class HearMeOut
{
    start()
    {
        ModalSystem.openModal((props: any) => React.createElement(VoiceRecorder, {props}))
        DOM.addStyle(css)
    }
    stop()
    {
        DOM.removeStyle(css)
    }
}