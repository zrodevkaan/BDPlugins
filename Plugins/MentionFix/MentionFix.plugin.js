/**
 * @name MentionFix
 * @version 1.0.0
 * @description Hate the `@unknown-user` when mentioning someone you've never met? Yeah this fixes that. :>
 * @author Kaan
 */

const {Webpack, Patcher} = new BdApi('MentionFix')

const [Module, Key] = Webpack.getWithKey(Webpack.Filters.byStrings('viewingChannelId', 'parsedUserId'))
const UserStore = Webpack.getStore('UserStore')

const FetchModule = Webpack.getMangled('type:"USER_PROFILE_FETCH_START"', {fetchUser: Webpack.Filters.byStrings("USER_UPDATE", "Promise.resolve")})

class MentionFix {
    start() {
        Patcher.before(Module, Key, (that, [args], res) => {
            const doesUserExist = UserStore.getUser(args.parsedUserId)
            if (doesUserExist === undefined) {
                FetchModule.fetchUser(args.parsedUserId)
            }
        })
    }

    stop() {
        Patcher.unpatchAll()
    }
}

module.exports = MentionFix;