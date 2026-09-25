export const BetterDiscord = new BdApi("AllowedMentions");

export const Buttons = BetterDiscord.Webpack.getBySource("isSubmitButtonEnabled", '.A.getActiveOption(')
export const HeaderComponents = BetterDiscord.Webpack.getModule((x) => x.Icon && x.Title)
export const Popout = BetterDiscord.Webpack.getModule((m) => m?.Animation, {
    searchExports: true,
    raw: true
})?.exports?.Y;
export const MessageActions = BetterDiscord.Webpack.getModule((m) => m._sendMessage);
// export const MessageActionsDecs = BetterDiscord.Webpack.getModule((m) => m._sendMessage, {raw:true}).declarations;

export function MentionSVG() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
        <path fill="none" stroke="var(--interactive-icon-default)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12.002V13a2 2 0 1 0 4 0v-1a7 7 0 1 0-4.406 6.502m.406-6.5a3 3 0 1 1 0-.004m0 .004v-.004m0 0V9"></path>
    </svg>
}