import {Data, Utils} from "./shared.ts";

export const defaultSettings = {
    "lensSize": 150,
    "lensZoom": 2.5
} as const satisfies Record<string, unknown>;

type SettingsResult = { [K in keyof typeof defaultSettings]: (typeof defaultSettings)[K] };
type SettingsKey = keyof SettingsResult;

type Listener<K extends SettingsKey> = (value: SettingsResult[K]) => void;

export default new (class SettingsStore extends Utils.Store {
    private settings: SettingsResult = {
        ...defaultSettings,
        ...((Data.load("settings") as Partial<SettingsResult>) ?? {}),
    };

    private listeners = new Map<SettingsKey, Set<Listener<any>>>();

    get<K extends SettingsKey>(id: K): SettingsResult[K] {
        return this.settings[id];
    }

    set<K extends SettingsKey>(id: K, value: SettingsResult[K]) {
        this.settings = { ...this.settings, [id]: value };
        Data.save("settings", this.settings);
        this.emitChange();
        this.notify(id, value);
    }

    del<K extends SettingsKey>(id: K) {
        this.settings = { ...this.settings, [id]: defaultSettings[id] };
        Data.save("settings", this.settings);
        this.emitChange();
        this.notify(id, this.settings[id]);
    }

    getAll(): SettingsResult {
        return this.settings;
    }

    subscribe<K extends SettingsKey>(id: K, callback: Listener<K>): () => void {
        if (!this.listeners.has(id)) {
            this.listeners.set(id, new Set());
        }
        this.listeners.get(id)!.add(callback);

        return () => {
            this.listeners.get(id)?.delete(callback);
        };
    }

    private notify<K extends SettingsKey>(id: K, value: SettingsResult[K]) {
        this.listeners.get(id)?.forEach((cb) => cb(value));
    }
})();
