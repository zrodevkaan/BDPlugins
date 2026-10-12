const {Webpack, Utils, Data, UI} = new BdApi("RelationshipAlerts");

const UserStore: any = Webpack.Stores.UserStore;
const Dispatcher: any = UserStore._dispatcher; // or Webpack.getByKeys("subscribe", "dispatch")

type RelationshipAlert = "added" | "removed";

interface AlertEntry {
    id: string;
    username: string;
    time: number;
}

type History = Record<RelationshipAlert, AlertEntry[]>;

const FRIEND = 1; // 1 friend, 2 blocked, 3 incoming request, 4 outgoing request
const events = ["RELATIONSHIP_ADD", "RELATIONSHIP_UPDATE", "RELATIONSHIP_REMOVE"];

const DataStore = new class RelationshipStore extends Utils.Store {
    private history: History = Data.load("history") ?? {added: [], removed: []};

    get(type: RelationshipAlert): AlertEntry[] {
        return this.history[type];
    }

    getAll(): History {
        return this.history;
    }

    add(type: RelationshipAlert, entry: AlertEntry) {
        const list = this.history[type];
        const last = list[list.length - 1];
        if (last && last.id === entry.id && entry.time - last.time < 5000) return false;

        this.history = {...this.history, [type]: [...list, entry]};
        Data.save("history", this.history);
        this.emitChange();
        return true;
    }

    remove(type: RelationshipAlert, id: string, time: number) {
        this.history = {
            ...this.history,
            [type]: this.history[type].filter((e) => !(e.id === id && e.time === time)),
        };
        Data.save("history", this.history);
        this.emitChange();
    }
};

export default class RelationshipAlerts {
    private handle = (e: any) => {
        const rel = e.relationship ?? e;
        const id: string | undefined = rel?.id ?? rel?.user?.id;
        if (!id) return;

        const user = UserStore.getUser(id);
        const username = user?.globalName ?? user?.username ?? id;

        let type: RelationshipAlert | null = null;

        if (e.type === "RELATIONSHIP_REMOVE") {
            if (rel.type === FRIEND) type = "removed";
        } else if (rel.type === FRIEND) {
            type = "added";
        }

        if (!type) return;

        const logged = DataStore.add(type, {id, username, time: Date.now()});
        // if (logged) {
        //     UI.showToast(`${username} ${type === "added" ? "is now your friend" : "removed you"}`, {
        //         type: type === "added" ? "success" : "info",
        //     });
        // }
    };

    start() {
        events.forEach((t) => Dispatcher.subscribe(t, this.handle));
    }

    stop() {
        events.forEach((t) => Dispatcher.unsubscribe(t, this.handle));
    }
}