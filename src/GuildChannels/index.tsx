/**
 * @name GuildChannels
 * @author Kaan
 */

const { Webpack, Patcher, Utils, React } = new BdApi("GuildChannels")
const { Filters } = Webpack

const GuildTooltip = Webpack.getModule(Filters.byStrings('listItemTooltip', 'guild'), { raw: true }).exports
const Popout = Webpack.getModule(m => m?.Animation, { searchExports: true, raw: true }).exports.y
const useStateFromStores: Function = Webpack.getByStrings("useStateFromStores", { searchExports: true })
const GuildMaybe = n(327496).L
const GuildChannelStore = Webpack.getStore('GuildChannelStore')
const ReadStateStore = Webpack.getStore('ReadStateStore')
const Animated = Webpack.getModule(x=>x.animated.div)

const BadgeBrhu = Webpack.getByKeys('aRk').aRk

const CustomTooltipOverride = ({ guild }) => {
    const divRef = React.useRef(null);
    const [shouldShow, setShouldShow] = React.useState(false);
    const readCountOnGuild = useStateFromStores([GuildChannelStore], () => {
        let count = 0;

        const channels = GuildChannelStore.getChannels(guild.id).SELECTABLE
        for (let index = 0; index < channels.length; index++) {
            const element = channels[index];
            const mentionCount = ReadStateStore.getMentionCount(element.channel.id)
            count += mentionCount
        }

        return count
    })

    console.log(readCountOnGuild)

    return <div ref={divRef}>
        <Popout
            shouldShow={shouldShow}
            targetElementRef={divRef}
            renderPopout={() => <div> hello world </div>}
            // https://cdn.discordapp.com/icons/947985618502307840/d021915c6f7e81a81af16cf482dc9676.png?size=56&quality=lossless
            children={() => {
                // do shit here

                return <Animated.animated.div className={'pill_e5445c wrapper__58105'}>
                    <BadgeBrhu selected={false} lowerBadge={readCountOnGuild}/>
                </Animated.animated.div >
            }}
            position="right"
        />
    </div>
}

export default class GuildChannels {
    start() {
        console.log('gi')
        /*Patcher.instead(GuildTooltip, "Z", (_, args, method) => {
            return args[0]?.guild && <CustomTooltipOverride guild={args[0].guild} />
        })*/
    }

    stop() {
        Patcher.unpatchAll();
    }
}