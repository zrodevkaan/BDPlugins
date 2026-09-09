import {Net, Patcher, Utils, Webpack} from "./global.ts";

const TARGET_LANG_MAP = {
    'AR': 'ar', 'BG': 'bg', 'CS': 'cs', 'DA': 'da', 'DE': 'de', 'DE-CH': 'de-CH',
    'EL': 'el',
    'EN-GB': 'en-GB', 'EN-US': 'en-US',
    'ES': 'es', 'ES-419': 'es-419', 'ET': 'et', 'FI': 'fi', 'FR': 'fr', 'FR-CA': 'fr-CA',
    'HE': 'he', 'HU': 'hu', 'ID': 'id', 'IT': 'it', 'JA': 'ja', 'KO': 'ko',
    'LT': 'lt', 'LV': 'lv', 'NB': 'nb', 'NL': 'nl', 'PL': 'pl',
    'PT-BR': 'pt-BR', 'PT-PT': 'pt-PT',
    'RO': 'ro', 'RU': 'ru', 'SK': 'sk', 'SL': 'sl', 'SV': 'sv',
    'TR': 'tr', 'UK': 'uk', 'VI': 'vi',
    'ZH': 'zh-Hans', 'ZH-HANS': 'zh-Hans', 'ZH-HANT': 'zh-Hant',
    'EN': 'en-US', // convenience alias
    'PT': 'pt-BR'  // convenience alias
};

const SOURCE_LANG_MAP = {
    ...TARGET_LANG_MAP,
    'EN': 'en',
    'PT': 'pt',
    'auto': 'auto',
};

export const COMMON_TARGET_LANGS: Array<keyof typeof TARGET_LANG_MAP> = [
    'EN-US', 'ES', 'FR', 'DE', 'JA', 'KO', 'ZH-HANS', 'PT-BR', 'RU'
];

export const ALL_TARGET_LANGS: Array<keyof typeof TARGET_LANG_MAP> = (Object.keys(TARGET_LANG_MAP) as Array<keyof typeof TARGET_LANG_MAP>)
    .filter(code => code !== 'EN' && code !== 'PT');

const displayNames = new Intl.DisplayNames(['en'], {type: 'language'})

export function getLanguageName(code: string): string {
    return displayNames?.of(code) ?? code;
}

enum ErrorCodes {
    TOO_MANY_REQUESTS = 429,
    AUTH_FAILED = 401,
    UNKNOWN = 0,
}

export class TranslateError extends Error {
    code: ErrorCodes;

    constructor(message: string, code: ErrorCodes) {
        super(message);
        this.name = 'TranslateError';
        this.code = code;
    }
}

export async function translate(text: string, targetLang: keyof typeof TARGET_LANG_MAP, sourceLang: keyof typeof SOURCE_LANG_MAP = 'auto', signal: AbortSignal) {
    const target = TARGET_LANG_MAP[targetLang.toUpperCase()] || targetLang;
    const source = sourceLang === 'auto' ? undefined : (TARGET_LANG_MAP[sourceLang.toUpperCase()] || sourceLang);

    const body = {
        text: [text],
        target_lang: target,
        usage_type: 'translate',
        // the DeepL mobile app AND chrome extension both use this weird api.
        // it doesnt need an authorization if the iOS or user agent is a whitelisted string.

        // for anon requests, 1500 character limit.
        // im assuming that the requests per minute is 50?
        // the oneshot api is way more loose (heh) than the public api or the web version?
        app_information: {
            os: 'iOS',
            os_version: '26.0',
            app_version: '26.42',
            app_build: '5443737', // look familiar?
            instance_id: crypto.randomUUID?.() || '00000000-0000-4000-8000-000000000000'
            // uuidv4
        }

        // they also support the following:
        // instance_id: e,
        // app_build: a,
        // os: t,
        // app_version: 'any',
        // os_version: 'any'
    };

    if (source) body.source_lang = source;

    const response = await Net.fetch('https://oneshot-free.www.deepl.com/v1/translate', {
        // https://oneshot-pro.www.deepl.com/v1/translate also exists but this requires a bearer.
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'None',
            'User-Agent': 'DeepL/26.42 CFNetwork/3826.600.41 Darwin/25.0.0',
            'x-app-os-version': '26.0',
            'x-app-instance-id': crypto.randomUUID?.() || '00000000-0000-4000-8000-000000000000',
            'x-app-session-id': crypto.randomUUID?.() || '00000000-0000-4000-8000-000000000000'
        },
        body: JSON.stringify(body),
        signal
    });

    const data = await response.json();

    if (response.status === ErrorCodes.TOO_MANY_REQUESTS) {
        throw new TranslateError('Rate limited - too many requests', ErrorCodes.TOO_MANY_REQUESTS);
    }

    if (response.status === ErrorCodes.AUTH_FAILED) {
        throw new TranslateError(
            'Authorization failed. This could mean the `app_information` parameter is invalid. Which is kinda bad.',
            ErrorCodes.AUTH_FAILED
        );
    }

    if (response.status !== 200) {
        throw new TranslateError(data.message || `HTTP ${response.status}`, response.status || ErrorCodes.UNKNOWN);
    }

    return {
        _rawData: data,
        text: data.translations?.[0]?.text || '',
        detectedSource: data.translations?.[0]?.detected_source_language || '',
        resolvedTarget: target
    };
}

interface TranslateCache {
    translatedText: string;
    detectedSource: string;
    targetLang: string; // resolved BCP-47 IS standard.
    lastTranslated: number;
}

interface TranslateErrorLogEntry {
    code: ErrorCodes;
    message: string;
    timestamp: number;
    userId: string;
    messageId: string;
}

const MAX_ERROR_LOG = 20;

// 1.5s/req (~40/min)
// so.... hopefully this doesnt hit the api rate limit?
const AUTO_TRANSLATE_MIN_INTERVAL_MS = 1500;

interface AutoTranslateJob {
    userId: string;
    messageId: string;
    text: string;
    targetLang: string;
    sourceLang: string;
    controller: AbortController;
}

const TextAreaParentClasses = Webpack.getByKeys("channelBottomBarArea")

// skamt code.
function reRender(selector) {
    const target = document.querySelector(selector)?.parentElement;
    if (!target) return;
    const instance = BdApi.ReactUtils.getOwnerInstance(target);
    const unpatch = Patcher.instead(instance, "render", () => unpatch());
    instance.forceUpdate(() => instance.forceUpdate());
}

export const DeepTranslateStore = new class DeepTranslateStore extends Utils.Store {
    private _cache: Map<string, Map<string, TranslateCache>> = new Map();
    // global log for letting us know if they hit some weird error.
    private _errorLog: TranslateErrorLogEntry[] = [];
    // why so serious
    private _pending: Set<string> = new Set();
    private _lastTargetLang: Map<string, string> = new Map();
    private _autoTranslateUsers: Set<string> = new Set();
    private _outgoingTranslateLang: Map<string, string> = new Map();

    private _autoControllers: Map<string, AbortController> = new Map();

    private _autoQueue: AutoTranslateJob[] = [];
    private _autoQueueRunning = false;
    private _lastAutoTranslateAt = 0;

    private _isCurrentlyTranslating = false;

    private _pendingKey(userId: string, messageId: string) {
        return `${userId}:${messageId}`;
    }

    async storeTranslate(
        userId: string,
        messageId: string,
        text: string,
        targetLang: keyof typeof TARGET_LANG_MAP,
        sourceLang: keyof typeof SOURCE_LANG_MAP = 'auto',
        signal: AbortSignal
    ) {
        const key = this._pendingKey(userId, messageId);
        this._pending.add(key);
        this.emitChange();

        try {
            const data = await translate(text, targetLang, sourceLang);

            let userMessages = this._cache.get(userId);
            if (!userMessages) {
                userMessages = new Map<string, TranslateCache>();
                this._cache.set(userId, userMessages);
            }

            const entry: TranslateCache = {
                translatedText: data.text,
                detectedSource: data.detectedSource,
                targetLang: data.resolvedTarget,
                lastTranslated: Date.now()
            };

            userMessages.set(messageId, entry);
            this._lastTargetLang.set(userId, targetLang.toUpperCase());

            return entry;
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                throw err;
            }

            this._logError(userId, messageId, err);
            throw err;
        } finally {
            this._pending.delete(key);
            this.emitChange();
        }
    }

    queueAutoTranslate(
        userId: string,
        messageId: string,
        text: string,
        targetLang: keyof typeof TARGET_LANG_MAP,
        sourceLang: keyof typeof SOURCE_LANG_MAP = 'auto'
    ) {
        const key = this._pendingKey(userId, messageId);

        if (this.getCached(userId, messageId)) return;
        if (this._pending.has(key)) return;
        if (this._autoQueue.some(job => job.userId === userId && job.messageId === messageId)) return;

        const controller = new AbortController();

        this._autoControllers.set(key, controller);

        this._autoQueue.push({
            userId,
            messageId,
            text,
            targetLang,
            sourceLang,
            controller
        });

        this._runAutoQueue();
    }


    private async _runAutoQueue() {
        if (this._autoQueueRunning) return;
        this._autoQueueRunning = true;

        try {
            while (this._autoQueue.length > 0) {
                const wait =
                    AUTO_TRANSLATE_MIN_INTERVAL_MS -
                    (Date.now() - this._lastAutoTranslateAt);

                if (wait > 0) {
                    await new Promise(resolve => setTimeout(resolve, wait));
                }

                const job = this._autoQueue.shift();
                if (!job) continue;

                const key = this._pendingKey(job.userId, job.messageId);

                if (job.controller.signal.aborted) {
                    this._autoControllers.delete(key);
                    continue;
                }

                this._lastAutoTranslateAt = Date.now();

                try {
                    await this.storeTranslate(
                        job.userId,
                        job.messageId,
                        job.text,
                        job.targetLang as keyof typeof TARGET_LANG_MAP,
                        job.sourceLang as keyof typeof SOURCE_LANG_MAP,
                        job.controller.signal
                    );
                } catch (err) {
                    if (!(err instanceof DOMException && err.name === 'AbortError')) {}
                } finally {
                    this._autoControllers.delete(key);
                }

                if (this.isRateLimited()) {
                    this._autoQueue = [];
                    break;
                }
            }
        } finally {
            this._autoQueueRunning = false;
        }
    }

    cancelAutoTranslate(userId: string, messageId: string): boolean {
        const key = this._pendingKey(userId, messageId);

        const oldLength = this._autoQueue.length;

        this._autoQueue = this._autoQueue.filter(
            job => !(job.userId === userId && job.messageId === messageId)
        );

        const wasQueued = this._autoQueue.length !== oldLength;

        const controller = this._autoControllers.get(key);

        if (controller) {
            controller.abort();
            this._autoControllers.delete(key);
        }

        if (wasQueued || controller) {
            this.emitChange();
            return true;
        }

        return false;
    }

    cancelAll()
    {
        this._autoControllers.values().map(job => {
            job.abort();
        })

        this.emitChange();
    }

    private _logError(userId: string, messageId: string, err: unknown) {
        const isTranslateError = err instanceof TranslateError;

        this._errorLog.push({
            code: isTranslateError ? err.code : ErrorCodes.UNKNOWN,
            message: err instanceof Error ? err.message : String(err),
            timestamp: Date.now(),
            userId,
            messageId
        });

        if (this._errorLog.length > MAX_ERROR_LOG) this._errorLog.shift();
    }

    getCached(userId: string, messageId: string): TranslateCache | undefined {
        return this._cache.get(userId)?.get(messageId);
    }

    getIsPending(userId: string, messageId: string): boolean {
        return this._pending.has(this._pendingKey(userId, messageId));
    }

    getLastTargetLang(userId: string): string | undefined {
        return this._lastTargetLang.get(userId);
    }

    getOutgoingTranslateLang(channelId: string): string | undefined {
        return this._outgoingTranslateLang.get(channelId);
    }

    setOutgoingTranslateLang(channelId: string, targetLang: string | null) {
        if (targetLang) this._outgoingTranslateLang.set(channelId, targetLang);
        else this._outgoingTranslateLang.delete(channelId);
        this.emitChange();
    }

    async translateOutgoing(text: string, targetLang: keyof typeof TARGET_LANG_MAP, sourceLang: keyof typeof SOURCE_LANG_MAP = 'auto') {
        try {
            this._isCurrentlyTranslating = true;
            reRender(`.${TextAreaParentClasses.channelBottomBarArea}`)
            return await translate(text, targetLang, sourceLang).finally((err) => {
                this._isCurrentlyTranslating = false;
                reRender(`.${TextAreaParentClasses.channelBottomBarArea}`)
            });
        } catch (err) {
            this._logError('__outgoing__', '__outgoing__', err);
            this.emitChange();
            throw err;
        }
    }

    isCurrentlyTranslating() {
        return this._isCurrentlyTranslating;
    }

    isAutoTranslate(userId: string): boolean {
        return this._autoTranslateUsers.has(userId);
    }

    toggleAutoTranslate(userId: string) {
        if (this._autoTranslateUsers.has(userId)) {
            this._autoTranslateUsers.delete(userId);
            this._autoQueue = this._autoQueue.filter(job => job.userId !== userId);
        } else {
            this._autoTranslateUsers.add(userId);
        }
        this.emitChange();
    }

    getErrorLog(): TranslateErrorLogEntry[] {
        return this._errorLog;
    }

    getLastError(): TranslateErrorLogEntry | undefined {
        return this._errorLog[this._errorLog.length - 1];
    }

    isRateLimited(withinMs = 60_000): boolean {
        const last = this.getLastError();
        return !!last && last.code === ErrorCodes.TOO_MANY_REQUESTS && (Date.now() - last.timestamp) < withinMs;
    }

    clearUser(userId: string) {
        this._cache.delete(userId);
        this.emitChange();
    }

    clearMessage(userId: string, messageId: string) {
        this._cache.get(userId)?.delete(messageId);
        this.emitChange();
    }
}