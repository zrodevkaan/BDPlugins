/**
 * @name DoubleClickToReply
 * @author Kaan
 * @description Allows you to double click an message and reply to it :)
 */
const {ContextMenu, UI, Data, Webpack, React, Components: {Tooltip}, Patcher, DOM} = new BdApi('DoubleClickToReply')
const MessageContent = Webpack.waitForModule(Webpack.Filters.bySource('VOICE_HANGOUT_INVITE?""'))
const StartEdit = Webpack.getByStrings('showMentionToggle', 'FOCUS_CHANNEL_TEXT_AREA', {searchExports: true})
const ChannelStore = Webpack.getStore('ChannelStore')

export default class DoubleClickToReply {
    async start() {
        const yes = await MessageContent
        Patcher.after(yes.ZP, 'type', (_, args, ret) => {
            Object.defineProperty(ret.props, 'onDoubleClick', {
                value: () => {
                    StartEdit(ChannelStore.getChannel(args[0].message.channel_id), args[0].message, {shiftKey: false})
                }
            })
        })
    }

    stop() {
        Patcher.unpatchAll();
    }
}