/**
 * @name WebTranslator
 * @author Kaan
 * @
 */

const { ContextMenu, UI, Data, Webpack, React, Components: { Tooltip }, Patcher, DOM } = new BdApi('WebTranslator')

const MessageContent = Webpack.waitForModule(Webpack.Filters.bySource('VOICE_HANGOUT_INVITE?""'))

const LANGUAGE_CODES = ["BG","ZH","CS","DA","NL","EN","ET","FI","FR","DE","EL","HU","IT","JA","LV","LT","PL","PT","RO","RU","SK","SL","ES","SV","TR"]

const languageNames = {
    BG: "Bulgarian", ZH: "Chinese", CS: "Czech", DA: "Danish", NL: "Dutch", EN: "English", ET: "Estonian",
    FI: "Finnish", FR: "French", DE: "German", EL: "Greek", HU: "Hungarian", IT: "Italian", JA: "Japanese",
    LV: "Latvian", LT: "Lithuanian", PL: "Polish", PT: "Portuguese", RO: "Romanian", RU: "Russian", SK: "Slovak",
    SL: "Slovenian", ES: "Spanish", SV: "Swedish", TR: "Turkish"
};

const DataStore = new Proxy({}, {
    get: (_, key) => {
        if (key === 'settings') {
            const savedSettings = Data.load(key) || {};
            return baseConfig.defaultConfig.reduce((acc, setting) => {
                acc[setting.id] = savedSettings[setting.id] ?? setting.value;
                return acc;
            }, {});
        }
        return Data.load(key);
    },
    set: (_, key, value) => {
        Data.save(key, value);
        return true;
    },
    deleteProperty: (_, key) => {
        Data.delete(key);
        return true;
    },
});

function updateTranslationData(data) {
    const { text, targetLang, message } = data;
    DataStore[message.id] = data;
}

function getTranslationData(message) {
    return DataStore[message.id];
}

function deleteTranslationData(messageId) {
    delete DataStore[messageId];
}

function convertToLanguageName(languageCode) {
    return languageNames[languageCode] || languageCode;
}

const markdownWrapper = Webpack.getByKeys("parse", "defaultRules", "parseTopic");

const css = `.bd-translation { color: var(--text-normal); }
.bd-translation-tiny { font-size: 13px; color: var(--text-muted); margin: 0px 0px 0px 5px }
.bd-translation-language {
  height: .9375rem; padding: 0 .275rem; border-radius: 4px; top: .1rem;
  background-color: var(--status-positive-background);
  color: var(--status-positive-text);
  text-transform: uppercase; display: inline-flex; align-items: center;
  flex-shrink: 0; text-indent: 0; font-size: .8rem; line-height: .9375rem;
  position: relative; font-weight: 600; vertical-align: top; margin-right: 1ch;
  transition: background-color .2s linear, color .2 linear;
}
.bd-translation-language[data-bd-is-out-of-date="true"] {
  background-color: var(--status-danger-background);
  color: var(--status-danger-text);
}`;

function Markdown(props) {
    const parsed = React.useMemo(() => {
        const state = Object.assign({}, { allowLinks: true }, props.state);
        return markdownWrapper.parse(props.text, state);
    }, [props.text, props.state]);

    return React.createElement(React.Fragment, {}, parsed);
}

class WebTranslator {
    constructor() {
        this.socket = new WebSocket("ws://localhost:3060")
        this.socket.addEventListener('message', (event) => {
            const response = JSON.parse(event.data);
            updateTranslationData(response);
        });
    }

    async start() {
        DOM.addStyle('css', css);
        this.ContextMenuPatch = this.yeahMethod.bind(this);
        const obj = await MessageContent;

        ContextMenu.patch("message", this.ContextMenuPatch);

        Patcher.after(await obj.ZP, 'type', (a, [props], c) => {
            const TranslationData = getTranslationData(props.message);
            if (!TranslationData) return;

            return React.createElement("div", { className: "bd-translation" }, [
                React.createElement("div", { className: "bd-translation-language" }, convertToLanguageName(TranslationData?.targetLang ?? "ARVEN")),
                React.createElement(Markdown, {
                    text: TranslationData.translated,
                }),
                React.createElement(
                    "div",
                    { className: "bd-translation-tiny" },
                    React.createElement("span", null, `Original: ${TranslationData.original}`)
                )
            ]);
        });
    }

    yeahMethod(res, props) {
        const { message } = props;

        if (!message.content) return;

        const items = LANGUAGE_CODES.map(lang => ({
            type: 'button',
            id: lang,
            label: convertToLanguageName(lang),
            action: async () => {
                try {
                    this.socket.send(JSON.stringify({ text: message.content, targetLang: lang, message }));
                } catch (error) {
                    console.error("Translation error:", error);
                    UI.showToast("Translation failed", { type: "error" });
                }
            }
        }));

        items.push({
            type: 'button',
            id: 'reset-translation',
            label: 'Reset Translation',
            color: 'danger',
            action: () => {
                deleteTranslationData(message.id);
                UI.showToast("Translation reset.", { type: "info" });
            }
        });

        res.props.children.push(ContextMenu.buildItem({
            label: 'Translate Message',
            type: 'submenu',
            items: items
        }));
    }

    stop() {
        if (this.socket) this.socket.close();
        ContextMenu.unpatch("message", this.ContextMenuPatch);
        Patcher.unpatchAll();
        DOM.removeStyle('css');
    }
}

module.exports = WebTranslator;