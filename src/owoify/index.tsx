/**
 * @name owoify
 * @author Kaan
 * @version 1.0.0
 * @icon https://upload.wikimedia.org/wikipedia/commons/f/f8/Stylized_uwu_emoticon.svg
 */
const {Patcher, React, Webpack, DOM, ContextMenu, Commands, Net} = new BdApi('owoify');
const { Stores } = Webpack;

const mods = Webpack.getByKeys("sendMessage")
const FluxDispatcher = Webpack.getModule((x) => x._dispatch);

export const timestampToSnowflake = (timestamp: number): string => {
    const DISCORD_EPOCH = BigInt(1420070400000);
    const SHIFT = BigInt(22);

    const ms = BigInt(timestamp) - DISCORD_EPOCH;
    return ms <= BigInt(0) ? "0" : (ms << SHIFT).toString();
};

function sendMessage(src: string, id: string) {
    const channelId = id != undefined ? id : Stores.SelectedChannelStore.getChannelId()

    const replyOptions = mods.getSendMessageOptionsForReply(
        Stores.PendingReplyStore.getPendingReply(channelId),
    );

    if (replyOptions.messageReference) {
        FluxDispatcher.dispatch({ type: "DELETE_PENDING_REPLY", channelId });
    }

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

    mods.sendMessage(channelId, messagePayload, undefined, {
        onAttachmentUploadError: () => false,
        ...messagePayload,
    });
}

export default class owoify {
    start() {
        Commands.register({
            name: 'owoify',
            description: 'owoify your text',
            options: [
                {
                    type: Commands.Types.OptionTypes.STRING,
                    name: 'message',
                    description: 'The message to owoify',
                    required: true
                }
            ],
            execute: async (args, {channel}) => {
                const data = await Net.fetch("https://anythingtranslate.com/wp-admin/admin-ajax.php", {
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0",
                        "Accept": "*/*",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest",
                        "Sec-GPC": "1",
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin",
                        "Priority": "u=0",
                        "Pragma": "no-cache",
                        "Cache-Control": "no-cache"
                    },
                    "referrer": "https://anythingtranslate.com/translators/uwuifier-translator/",
                    "body": `action=do_translation&translator_nonce=30da8ebac3&post_id=135742&to_translate=${encodeURI(args[0].value.split(' ').join(' '))}&translation_model=newest&is_language_swapped=0`,
                    "method": "POST",
                    "mode": "cors"
                });

                return sendMessage((await data.json()).data, channel.id)
            },
            id: "owoify"
        })
    }

    stop() {
        Commands.unregisterAll()
    }
}