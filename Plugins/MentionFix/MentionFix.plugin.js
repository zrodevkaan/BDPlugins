/**
 * @name MentionFix
 * @version 1.0.1
 * @description Hate the `@unknown-user` when mentioning someone you've never met? Yeah this fixes that. :>
 * @author Kaan
 */

const {Webpack, Patcher, Data} = new BdApi('MentionFix')

const [Module, Key] = Webpack.getWithKey(Webpack.Filters.byStrings('viewingChannelId', 'parsedUserId'))
const UserStore = Webpack.getStore('UserStore')

const FetchModule = Webpack.getMangled('type:"USER_PROFILE_FETCH_START"', {fetchUser: Webpack.Filters.byStrings("USER_UPDATE", "Promise.resolve")})

class MentionFix {
    constructor() {
        this.unfoundUsers = Data.load('unfoundUsers') || {};

        this.handleUserFetch = this.handleUserFetch.bind(this);
    }

    start() {
        Patcher.after(Module, Key, (that, [args], res) => {
            const userId = args.parsedUserId;
            const doesUserExist = UserStore.getUser(userId);

            if (doesUserExist === undefined && !this.unfoundUsers[userId]) {
                this.handleUserFetch(userId);
            }
        });

        Patcher.after(FetchModule, 'fetchUser', (that, [userId], promise) => {
            promise.catch(error => {
                this.unfoundUsers[userId] = true;
                Data.save('unfoundUsers', this.unfoundUsers);
            });

            return promise;
        });
    }

    handleUserFetch(userId) {
        FetchModule.fetchUser(userId).then(user => {
            if (!user) {
                this.unfoundUsers[userId] = true;
                Data.save('unfoundUsers', this.unfoundUsers);
            }
        });
    }

    stop() {
        Patcher.unpatchAll();
    }
}

module.exports = MentionFix;
