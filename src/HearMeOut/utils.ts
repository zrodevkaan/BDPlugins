import type {FluxDispatcher as IFluxDispatcher} from "discord-types/other";

const fluxDispatcher: IFluxDispatcher = BdApi.Webpack.getByKeys("dispatch");
const mediaModule = BdApi.Webpack.getByKeys("getMediaEngine");

function audioBufferToBlob(audioBuffer, type) {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length;
    const interleaved = new Float32Array(length * numberOfChannels);
    for (let channel = 0; channel < numberOfChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            interleaved[i * numberOfChannels + channel] = channelData[i];
        }
    }
    const dataView = encodeWAV(interleaved, numberOfChannels, sampleRate);
    const blob = new Blob([dataView], { type: type });
    return blob;
}

function encodeWAV(samples, channels, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * channels * 2, true);
    view.setUint16(32, channels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);
    floatTo16BitPCM(view, 44, samples);
    return view;
}

function floatTo16BitPCM(output, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

async function record() {
    const mediaEngine = mediaModule.getMediaEngine();
    const vol = mediaModule.getOutputVolume();

    fluxDispatcher.dispatch({
        type: "AUDIO_SET_LOOPBACK",
        loopbackReason: "recording",
        enabled: true
    });

    fluxDispatcher.dispatch({
        type: "AUDIO_SET_OUTPUT_VOLUME",
        volume: 0
    });

    return new Promise((resolve, reject) => {
        try {
            mediaEngine.startRecordingRawSamples((samples, numChannels, sampleRate) => {
                fluxDispatcher.dispatch({
                    type: "AUDIO_SET_OUTPUT_VOLUME",
                    volume: 100
                });
                fluxDispatcher.dispatch({
                    type: "AUDIO_SET_LOOPBACK",
                    loopbackReason: "recording",
                    enabled: false,
                });
                const audioBuffer = new AudioBuffer({
                    length: samples.length,
                    sampleRate: sampleRate,
                    numberOfChannels: numChannels
                });

                Array.from({ length: numChannels }, (_, channel) => {
                    const channelData = Float32Array.from(
                        { length: samples.length / numChannels },
                        (_, frameIndex) => samples[frameIndex * numChannels + channel]
                    );
                    audioBuffer.copyToChannel(channelData, channel);
                });

                resolve(audioBuffer);
            });
        } catch (err) {
            reject(err);
        }
    });
}

export { record, mediaModule, audioBufferToBlob };
