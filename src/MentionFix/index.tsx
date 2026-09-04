/**
 * @name MentionFix
 * @version 2.0.4
 * @description Hate the `@unknown-user` when mentioning someone you've never met? Yeah this fixes that. :>
 * @author Kaan
 */
import {getKey} from "@helpers";

const {Webpack, Patcher, React, Hooks, Components} = new BdApi('MentionFix')

const FetchUser = getKey(Webpack.getModule(Webpack.Filters.combine(Webpack.Filters.bySource('UserProfileModalActionCreators'), Webpack.Filters.bySource('CURRENT_USER_UPDATE'))), x => String(x).includes("USER_UPDATE") && !String(x).includes("USER_PROFILE_FETCH_START") && String(x).includes('Promise.resolve'));
const UserMention = getKey(Webpack.getBySource('.A.USER_MENTION),'), x => String(x).includes("USER_MENTION"));
const UserComponent = UserMention.module[UserMention.key];

interface MentionProps {
    className?: string;
    userId?: string;
    parsedUserId?: string;
    channelId: string;
    viewingChannelId?: string;
    content?: unknown[];
    inlinePreview?: boolean;
}

function queuer(worker, {concurrency = 3} = {}) {
    const pending = new Map();
    const queue = [];
    let active = 0;

    function runNext() {
        if (active >= concurrency || queue.length === 0) return;
        const {key, resolve, reject} = queue.shift();
        active++;

        worker(key)
            .then(resolve, reject)
            .finally(() => {
                active--;
                pending.delete(key);
                runNext();
            });
    }

    return function enqueue(key) {
        if (pending.has(key)) return pending.get(key);

        const promise = new Promise((resolve, reject) => {
            queue.push({key, resolve, reject});
        });

        pending.set(key, promise);
        runNext();
        return promise;
    };
}

const fetchUserQueue = queuer(
    userId => FetchUser.module[FetchUser.key](userId),
    {concurrency: 8}
);

function CustomMention({args}: { args: MentionProps }) {
    const userId = args.userId ?? args.parsedUserId;

    const data = Hooks.useStateFromStores([Webpack.Stores.UserStore, Webpack.Stores.ChannelStore], () => ({
        user: Webpack.Stores.UserStore.getUser(userId),
        channel: Webpack.Stores.ChannelStore.getChannel(args.channelId),
    }))

    React.useEffect(() => {
        if (data.user) return;
        fetchUserQueue(userId).then(() => Webpack.Stores.UserStore.emitChange());
    }, [userId, data.user]);

    return !data.user ? <Components.Spinner/> : <UserComponent {...args} />
}

class MentionFix {
    start() {
        Patcher.after(UserMention.module, UserMention.key, (that, [args], res) => {
            const userId = args.userId ?? args.parsedUserId;
            if (!userId || Webpack.Stores.UserStore.getUser(userId)) return res;

            return <CustomMention args={args}/>
        })
    }

    stop() {
        Patcher.unpatchAll()
    }
}

module.exports = MentionFix;