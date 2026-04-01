/**
 * @name Cleaner
 * @author kaan
 * @version 1.0.0
 */

const { Webpack, Patcher, Utils, Net } = new BdApi("Cleaner")
const MessageActions = Webpack.getByKeys("sendMessage")

const CleanStore = new class CleanStore extends Utils.Store {
    private rules: any = null;

    async init() {
        const res = await Net.fetch("https://rules2.clearurls.xyz/data.minify.json")
        this.rules = (await res.json()).providers;
    }

    cleanURL(url: string): string {
        let parsed: URL;
        try { parsed = new URL(url) } catch { return url }

        for (const provider of Object.values(this.rules) as any[]) {
            if (!new RegExp(provider.urlPattern, "i").test(url)) continue;
            if (provider.exceptions?.some((e: string) => new RegExp(e, "i").test(url))) continue;

            for (const [key] of [...parsed.searchParams]) {
                if (provider.rules?.some((r: string) => new RegExp(r, "i").test(key)))
                    parsed.searchParams.delete(key);
            }

            let href = parsed.toString();
            for (const raw of provider.rawRules ?? [])
                href = href.replace(new RegExp(raw, "i"), "");

            return href;
        }

        return parsed.toString();
    }
}

export default class Cleaner {
    start() {
        CleanStore.init();
        Patcher.before(MessageActions, "sendMessage", (_, args) => {
            args[1].content = args[1].content.replace(/https?:\/\/\S+/g, url => CleanStore.cleanURL(url));
        })
    }
    stop() {
        Patcher.unpatchAll();
    }
}