/**
 * @name MentionFix
 * @version 1.1.0
 * @description Hate the `@unknown-user` when mentioning someone you've never met? Yeah this fixes that. :>
 * @author Kaan
 */
const {Webpack, Patcher} = new BdApi('MentionFix')
const [Module, Key] = Webpack.getWithKey(Webpack.Filters.byStrings('viewingChannelId', 'parsedUserId'))
const UserStore = Webpack.getStore('UserStore')
const FetchModule = Webpack.getMangled('type:"USER_PROFILE_FETCH_START"', {fetchUser: Webpack.Filters.byStrings("USER_UPDATE", "Promise.resolve")})

class MentionFix {
    constructor() {
        this.fetchedUsers = new Set()
    }

    start() {
        Patcher.after(Module, Key, (that, [args], res) => {
            const userId = args.parsedUserId
            const doesUserExist = UserStore.getUser(userId)

            if (doesUserExist === undefined) {
                for (var child of res.props.children) {
                    if (child && child.props) {
                        const originalOnMouseEnter = child.props.onMouseEnter

                        Object.defineProperty(child.props, 'onMouseEnter', {
                            value: (e) => {
                                if (originalOnMouseEnter) {
                                    originalOnMouseEnter(e)
                                }

                                if (!this.fetchedUsers.has(userId)) {
                                    this.fetchedUsers.add(userId)
                                    FetchModule.fetchUser(userId).catch(error => {
                                        this.fetchedUsers.delete(userId)
                                    })
                                }
                            },
                            writable: true,
                            configurable: true
                        })
                    }
                }
            }
        })
    }

    stop() {
        Patcher.unpatchAll()
        this.fetchedUsers.clear()
    }
}

module.exports = MentionFix;