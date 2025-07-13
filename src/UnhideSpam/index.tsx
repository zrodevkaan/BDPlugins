/**
 * @name UnhideSpam
 * @author Kaan
 * @version 1.0.0
 * @description you love spam :)
 */

const {Webpack} = new BdApi("UnhideSpam");
const originalGetUser = Webpack.getStore('UserStore').getUser;

export default class UnhideSpam {
    start() {
        Object.defineProperty(Webpack.getStore('UserStore'), 'getUser', {
            value: function (id) {
                const user = originalGetUser.call(this, id);

                if (user && user.hasFlag) {
                    if (user.hasFlag(1 << 20)) {
                        const modifiedUser = Object.create(Object.getPrototypeOf(user));
                        Object.assign(modifiedUser, user);

                        const originalHasFlag = user.hasFlag.bind(user);

                        modifiedUser.hasFlag = function (flag) {
                            if (flag === (1 << 20)) {
                                return false;
                            }
                            return originalHasFlag(flag);
                        };

                        return modifiedUser;
                    }
                }

                return user;
            },
            writable: true,
            configurable: true
        });
    }

    stop() {
        Webpack.getStore('UserStore').getUser = originalGetUser;
    }
}