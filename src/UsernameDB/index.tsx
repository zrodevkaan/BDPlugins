/**
 * @name UsernameDB
 * @author Kaan
 * @description Colors or names ;p
 */

const { Webpack, Patcher, Data, React, Net } = new BdApi('UsernameDB')

const UsernameHeader = Webpack.getBySource('subscribeToGroupId', 'renderRemixTag', 'decorations')

const UserStore = Webpack.getStore("UserStore")
const FontIDs = Webpack.getModule(x => x.BANGERS, { searchExports: true })
const EffectIDs = Webpack.getModule(x => x.NEON && x.GRADIENT, { searchExports: true })

class InternalStore {
    static stores = new Set();
    static idSymbol = Symbol("id");
    static id = 0;

    static getStore(name) {
        for (const store of InternalStore.stores) {
            if (InternalStore.prototype.getName.call(store) === name) return store;
        }
    }

    static getStoreId(store) {
        return store[InternalStore.idSymbol];
    }

    constructor() {
        this[InternalStore.idSymbol] = InternalStore.id++;
        InternalStore.stores.add(this);
    }

    initialize() {
    }

    static displayName;
    displayName;

    getName() {
        if (this.displayName) return this.displayName;

        const constructor = this.constructor;
        if (constructor.displayName) return constructor.displayName;

        return constructor.name;
    }

    #listeners = new Set();

    addChangeListener(callback) {
        this.#listeners.add(callback);
    }

    removeChangeListener(callback) {
        this.#listeners.delete(callback);
    }

    emit() {
        for (const listener of this.#listeners) {
            listener();
        }
    }

    getClass() {
        return this.constructor;
    }

    getId() {
        return InternalStore.getStoreId(this);
    }
}

const convertToNum = (hex) => parseInt(hex.replace("#", ""), 16); // for people who use hex.

class ColorDatastore extends InternalStore {
    private UserColors: Record<string, {}> = {};

    async GatherColors(): Promise<Record<string, {}>> {
        this.UserColors = await this.fetchUserData();
        this.emit();
        return this.UserColors
    }

    async fetchUserData(): Promise<Record<string, {}>> {
        const AllColors = await (await Net.fetch('https://raw.githubusercontent.com/zrodevkaan/UsernameDB/refs/heads/main/users.json')).json();
        this.UserColors = AllColors;
        this.emit();
        return this.UserColors
    }

    GrabFromCache(userId: string): Record<string, {}> {
        this.emit();
        return this.UserColors[userId]
    }
}

const UserColorDatastore = new ColorDatastore();

export default class UsernameDB {
    constructor() {
        UserColorDatastore.GatherColors();
    }

    ColorStore = UserColorDatastore

    start() {
        Patcher.before(UsernameHeader, "Z", (a, args) => {
            const author = args[0].author
            const userId = args[0].message.author.id
            author.displayNameStyles = UserColorDatastore.GrabFromCache(userId) //{fontId, effectId, colors: []}
        })

        Patcher.after(UserStore, 'getUser', (_, [userId], res) => {
            if (!res || typeof res !== "object") return;

            const cache = UserColorDatastore.GrabFromCache(userId) || res.displayNameStyles

            if (!Object.prototype.hasOwnProperty.call(res, "displayNameStyles")) {
                Object.defineProperty(res, "displayNameStyles", {
                    value: cache,
                    enumerable: true,
                    configurable: true,
                    writable: true,
                });
            } else {
                res.displayNameStyles = cache
            }
        });

    }
    stop() {
        Patcher.unpatchAll()
    }
}