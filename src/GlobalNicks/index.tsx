/**
 * @name GlobalNicks
 * @author Kaan
 * @version 1.0.0
 * @description Overrides non-friend users name with a global nickname
 */

const {Patcher, React, Webpack, DOM, ContextMenu, UI, Net, Utils, Data} = new BdApi('GlobalNicks')
const UserStore = Webpack.getStore('UserStore')
const RelationshipStore = Webpack.getStore('RelationshipStore')

export default class GlobalNicks {
    start() {
        Patcher.after(UserStore, 'getUser', (_, args, ret) => {
            if (!ret || !ret.username) return;

            const oriName = ret.username;
            const hasNick = RelationshipStore.getNickname(args[0]);

            if (Object.hasOwn(ret, 'username')) {
                ret.username = hasNick || oriName;
            }
        })
    }

    stop() {
        Patcher.unpatchAll();
    }
}