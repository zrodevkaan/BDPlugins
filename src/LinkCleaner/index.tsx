/**
 * @name LinkCleaner
 * @author kaan
 * @description Clean URLs automatically every time you send a message.
 * @version 1.0.1
 */

const { Webpack, Patcher, Utils, Net } = new BdApi("LinkCleaner")
const MessageActions = Webpack.getByKeys("sendMessage")

const CleanStore = new class CleanStore extends Utils.Store {
    private rules: any = null;

    async init() {
        try {
            const res = await Net.fetch("https://rules2.clearurls.xyz/data.minify.json")
            this.rules = (await res.json()).providers;
        } catch (e) {
            console.error("[LinkCleaner] Failed to fetch rules:", e);
        }
    }

    cleanURL(url: string): string {
        if (!this.rules) return url;

        url = url.replace(/\?([^?]*)\?/, '?$1&');
        if (!url.includes('?') && url.includes('&')) {
            url = url.replace('&', '?');
        }

        url = url.replace(/(youtu\.be\/[^?&]+)&/, '$1?'); // how would I account for weird malformed links
        // besides hardcoding them into a URL array?

        let parsed: URL;
        try { parsed = new URL(url) } catch { return url }

        let href = parsed.toString();

        const providers = Object.values(this.rules) as any[];
        const matching = providers.filter(p =>
            new RegExp(p.urlPattern, "i").test(url) &&
            !p.exceptions?.some((e: string) => new RegExp(e, "i").test(url))
        );

        matching.sort((a, b) => b.urlPattern.length - a.urlPattern.length);

        for (const provider of matching) {
            const rules = Array.isArray(provider.rules) ? provider.rules : Object.values(provider.rules ?? {});
            const rawRules = Array.isArray(provider.rawRules) ? provider.rawRules : Object.values(provider.rawRules ?? {});

            for (const [key] of [...parsed.searchParams]) {
                if (rules.some((r: string) => new RegExp(r, "i").test(key))) {
                    parsed.searchParams.delete(key);
                }
            }

            href = parsed.toString();
            for (const raw of rawRules) {
                href = href.replace(new RegExp(raw, "i"), "");
            }
        }

        return href;
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