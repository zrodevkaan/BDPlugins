/**
 * @name DeepTranslate
 * @author kaan
 * @version 1.0.0
 * @description Allow translations from DeepL, the best translator in existence. You can autotranslate selected users
 */
import {Components, ContextMenu, Hooks, Patcher, React, Webpack} from "./global.ts";
import type {ReactNode} from "react";
import type {Message, User} from "discord-types/general";
import {ALL_TARGET_LANGS, COMMON_TARGET_LANGS, DeepTranslateStore, getLanguageName} from "./translate.ts";

const MAX_CHARS = 1500; // DeepL oneshot/anon tier limit, see translate.ts
const DEFAULT_TARGET_LANG = "EN";

function DeepL() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
        <path fill="white"
              d="M20.907 4.94L12.685.186a1.36 1.36 0 0 0-1.37 0l-8.222 4.77a1.38 1.38 0 0 0-.686 1.183v9.526a1.38 1.38 0 0 0 .686 1.194l8.222 4.76l.062.035L15.425 24l-.011-2.061l.008-1.145l.003.02v-.385a.69.69 0 0 1 .296-.56l.264-.151l.127-.07h-.008l4.803-2.78a1.38 1.38 0 0 0 .686-1.195V6.135a1.38 1.38 0 0 0-.686-1.195m-9.853 9.688a1.43 1.43 0 0 1-.4 1.384a1.41 1.41 0 0 1-1.97 0a1.42 1.42 0 0 1 0-2.063a1.41 1.41 0 0 1 2.042.076l3.328-1.916l.687.386zm5.77-2.414a1.41 1.41 0 0 1-1.97 0a1.43 1.43 0 0 1-.37-1.478l-.013.008L10.72 8.57l-.057.057a1.41 1.41 0 0 1-1.97 0a1.42 1.42 0 0 1 0-2.063a1.41 1.41 0 0 1 1.972 0c.394.377.524.918.39 1.407l3.781 2.2l.019-.019a1.41 1.41 0 0 1 1.972 0a1.427 1.427 0 0 1 0 2.061z"></path>
    </svg>
}

function Translate() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
        <path fill="white"
              d="M17 11c-.4 0-.75.23-.91.59l-4 9l1.83.81l1.07-2.41h4.03l1.07 2.41l1.83-.81l-4-9a1 1 0 0 0-.91-.59Zm-1.13 6L17 14.46L18.13 17zm-3.62-2.03l.49-1.94c-.13-.03-1.6-.43-3.17-1.42c1.4-1.41 2.49-3.26 2.74-5.61h1.68V4h-5V2h-2v2H2v2h8.3c-.25 1.91-1.19 3.34-2.31 4.4C7.3 9.75 6.68 8.96 6.25 8H4.12c.5 1.44 1.33 2.63 2.3 3.61c-1.57.99-3.04 1.39-3.17 1.42l.49 1.94c1.18-.3 2.76-.96 4.26-2.02c1.49 1.06 3.08 1.72 4.25 2.02"></path>
    </svg>
}

function MenuItemLabel({title, subtext}: { title: string, subtext?: string }) {
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <span>{title}</span>
            {subtext && <span style={{fontSize: "12px", color: "var(--text-danger)"}}>{subtext}</span>}
        </div>
    );
}

function TCM({user, message}: { user: User, message: Message }) {
    const isRateLimited = Hooks.useStateFromStores([DeepTranslateStore], () => DeepTranslateStore.isRateLimited())
    const cached = Hooks.useStateFromStores([DeepTranslateStore], () => DeepTranslateStore.getCached(user.id, message.id))
    const isAutoTranslate = Hooks.useStateFromStores([DeepTranslateStore], () => DeepTranslateStore.isAutoTranslate(user.id))
    const isTooLong = message.content.length > MAX_CHARS;
    const disabled = isRateLimited || isTooLong;

    function translateTo(targetLang: string) {
        return () => DeepTranslateStore.storeTranslate(user.id, message.id, message.content, targetLang as any);
    }

    const quickTargetLang = DeepTranslateStore.getLastTargetLang(user.id) ?? DEFAULT_TARGET_LANG;

    const subtext = isRateLimited
        ? "Rate limited, try again shortly"
        : isTooLong
            ? `Message exceeds ${MAX_CHARS} characters`
            : undefined;

    async function copyTranslation() {
        await navigator.clipboard.writeText(cached.translatedText);
    }

    return <ContextMenu.Item leadingAccessory={{
        type: "icon",
        icon: DeepL
    }} id={"dp-tr"} label={"DeepTranslate"}>
        <ContextMenu.Item id={"dr-tr-ts"} color={disabled ? "danger" : undefined} disabled={disabled}
                          label={<MenuItemLabel title={`Translate to ${getLanguageName(quickTargetLang)}`} subtext={subtext}/>}
                          action={translateTo(quickTargetLang)}
                          leadingAccessory={{
                              type: "icon",
                              icon: Translate
                          }}
        />

        <ContextMenu.Item id={"dr-tr-lang"} disabled={disabled} label={"Translate to..."}>
            {COMMON_TARGET_LANGS.map(code => (
                <ContextMenu.Item key={code} id={`dr-tr-lang-${code}`} label={getLanguageName(code)}
                                  action={translateTo(code)}/>
            ))}
            <ContextMenu.Item id={"dr-tr-lang-more"} label={"More languages"}>
                {ALL_TARGET_LANGS.filter(code => !COMMON_TARGET_LANGS.includes(code)).map(code => (
                    <ContextMenu.Item key={code} id={`dr-tr-lang-${code}`} label={getLanguageName(code)}
                                      action={translateTo(code)}/>
                ))}
            </ContextMenu.Item>
        </ContextMenu.Item>

        {cached && (
            <ContextMenu.Item id={"dr-tr-refresh"} disabled={disabled} label={"Refresh Translation"}
                              action={translateTo(cached.targetLang)}/>
        )}

        {cached && (
            <ContextMenu.Item id={"dr-tr-copy"} label={"Copy Translation"} action={copyTranslation}/>
        )}

        <ContextMenu.Item id={"dr-tr-auto"} color={isAutoTranslate ? "brand" : undefined}
                          label={isAutoTranslate ? "Disable Auto-Translate" : `Auto-Translate to ${getLanguageName(quickTargetLang)}`}
                          action={() => DeepTranslateStore.toggleAutoTranslate(user.id)}/>

        <ContextMenu.Item id={"dr-tr-rm-ts"} color={"danger"} label={"Delete Translation"} disabled={!cached}
                          action={() => DeepTranslateStore.clearMessage(user.id, message.id)}/>
    </ContextMenu.Item>
}

function TranslateComponent({original, message, author}: { original?: ReactNode, message: Message, author: User }) {
    const translateData = Hooks.useStateFromStores([DeepTranslateStore], () => DeepTranslateStore.getCached(author.id, message.id))
    const isPending = Hooks.useStateFromStores([DeepTranslateStore], () => DeepTranslateStore.getIsPending(author.id, message.id))
    const isAutoTranslate = Hooks.useStateFromStores([DeepTranslateStore], () => DeepTranslateStore.isAutoTranslate(author.id))
    const isRateLimited = Hooks.useStateFromStores([DeepTranslateStore], () => DeepTranslateStore.isRateLimited())

    React.useEffect(() => {
        if (!isAutoTranslate || translateData || isPending || isRateLimited) return;
        if (message.content.length === 0 || message.content.length > MAX_CHARS) return;

        const targetLang = DeepTranslateStore.getLastTargetLang(author.id) ?? DEFAULT_TARGET_LANG;
        DeepTranslateStore.queueAutoTranslate(author.id, message.id, message.content, targetLang as any);
    }, [isAutoTranslate, translateData, isPending, isRateLimited, author.id, message.id, message.content]);

    if (!translateData && !isPending) return original;

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            {original}
            {isPending
                ? <span style={{maxWidth: "100px !important"}}><Components.Spinner/></span>
                : <span style={{fontSize: "16px", color: "var(--text-muted)"}}>
                      {translateData.translatedText} · Translated from {getLanguageName(translateData.detectedSource)} to {getLanguageName(translateData.targetLang)}
                  </span>}
        </div>
    );
}

export default class DeepTranslate {
    async start() {
        const MessageContent = await Webpack.waitForModule(Webpack.Filters.bySource('VOICE_HANGOUT_INVITE?""'))

        Patcher.after(MessageContent.Ay, "type", (_this, args, returnValue) => {
            const message = args[0].message
            if (!message) return returnValue;

            return <TranslateComponent original={returnValue} message={message} author={message.author}/>
        })

        this.unpatch = ContextMenu.patch("message", (res, props) => {
            res.props.children.props.children.splice(6, 0,
                TCM({user: props.message.author, message: props.message})
            )
        })
    }

    stop() {
        Patcher.unpatchAll();
        this.unpatch?.();
    }
}