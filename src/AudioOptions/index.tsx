/**
 * @name AudioOptions
 * @author Kaan
 * @version 0.0.0
 * @description Adds a options button next to voice messages.
 */

const {Patcher, React, Webpack, DOM, ContextMenu, UI, Net, Utils} = new BdApi('AudioOptions')

const IconBase = Webpack.getModule(x => x.Icon)
const VoiceMessagePlayer = Webpack.getBySource('.ZP.getPlaybackRate(')

const PathIcon = () => {
    return React.createElement(
        'svg',
        {
            viewBox: '0 0 24 24',
            width: 24,
            height: 24,
            fill: 'var(--interactive-normal)'
        },
        React.createElement('path', {
            d: 'M4 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z'
        })
    );
};

const createDownloadLink = async (url: string, filename: string) => {
    try {
        if (url.startsWith('data:')) {
            const parts = url.split(',');
            if (!parts[0] || !parts[1]) return ''
            const matches = parts[0].match(/:(.*?);/);
            const mimeType = matches ? matches[1] : 'image/png';

            const binary = atob(parts[1]);
            const array = [];
            for (let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            const blob = new Blob([new Uint8Array(array)], {type: mimeType});

            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename || `download.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);

            UI.showToast("Download started!", {type: "success"});
        } else {
        }
    } catch (error) {
        console.log(error);
        UI.showToast("Download failed!", {type: "error"});
    }
}

class AudioOptions {
    start() {
        this.patchAudioPlayer();
    }

    patchAudioPlayer() {
        Patcher.after(VoiceMessagePlayer.Z, 'type', (_, [props], res) => {
            const AudioButton = React.createElement(IconBase.Icon, {
                key: "audio-options-button",
                icon: PathIcon,
                tooltip: "Audio Options",
                className: "audio-options-button",
                tooltipPosition: "right",
                onClick: (e) => this.showOptionsMenu(e, props)
            });

            res.props.children.push(AudioButton);
        })
    }

    showOptionsMenu(e, props) {
        const audioElement: HTMLAudioElement | null = document.querySelector('[class^="audioElement"]');
        const audioUrl = props.item.downloadUrl;
        const fileName = props.item.originalItem.filename || `voice-message-${Date.now()}.mp3`;

        const menuItems = [
            {
                id: 'download',
                label: "Download Audio",
                action: () => this.downloadAudio(audioUrl, fileName)
            },
            {
                id: 'copy',
                label: "Copy Audio URL",
                action: () => this.copyToClipboard(audioUrl)
            },
        ];

        if (audioElement) {
            menuItems.push({
                type: 'separator'
            });

            menuItems.push({
                id: 'loop',
                label: audioElement.loop ? "Disable Loop" : "Enable Loop",
                action: () => {
                    audioElement.loop = !audioElement.loop;
                    UI.showToast(`Loop ${audioElement.loop ? "enabled" : "disabled"}`, {type: "success"});
                }
            });
        }

        ContextMenu.open(e, ContextMenu.buildMenu(menuItems));
    }

    downloadAudio(url: string, filename: string) {
        createDownloadLink(url, filename);
    }

    copyToClipboard(text: any) {
        DiscordNative.clipboard.copy(text);
        UI.showToast("Copied to clipboard!", {type: "success"});
    }

    stop() {
        Patcher.unpatchAll();
    }
}

module.exports = AudioOptions