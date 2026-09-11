/**
 * @name DeepTranslate
 * @author kaan
 * @version 1.0.0
 * @description Allow translations from DeepL, the best translator in existence. You can autotranslate selected users
 */
import {Components, ContextMenu, Hooks, Patcher, React, Utils, Webpack} from "./global.ts";
import type {ReactNode} from "react";
import type {Message, User} from "discord-types/general";
import {
    ALL_TARGET_LANGS,
    COMMON_TARGET_LANGS,
    DeepTranslateStore,
    getLanguageName,
    TranslateError
} from "./translate.ts";
import {DeepL} from "./deepl.tsx";
import {getKey, styled} from "@helpers";

const MAX_CHARS = 1500; // DeepL oneshot/anon tier limit, see translate.ts
const DEFAULT_TARGET_LANG = navigator.language.split("-")[0]!.toUpperCase() ?? "EN";

const Buttons = Webpack.getBySource("isSubmitButtonEnabled", '.A.getActiveOption(')
const HeaderComponents = Webpack.getModule((x) => x.Icon && x.Title)
const ScrollerClassNames = Webpack.getByKeys("scrollbarGutterStable")
const SelectedChannelStore = Webpack.Stores.SelectedChannelStore;

const StackedBarsModule = Webpack.getBySource("xU4pF1,{", {raw: true}).declarations

const Popout = Webpack.getModule((m) => m?.Animation, {searchExports: true, raw: true})?.exports?.Y


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
        return () => DeepTranslateStore.storeTranslate(user.id, message.id, message.content, targetLang as any, 'auto');
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
                          label={<MenuItemLabel title={`Translate to ${getLanguageName(quickTargetLang)}`}
                                                subtext={subtext}/>}
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
        DeepTranslateStore.queueAutoTranslate(author.id, message.id, message.content, targetLang as any, 'auto');
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

const Wrapper = styled.div({
    display: "flex",
    alignItems: "center",
    margin: "10px 0",
});

const Line = styled.div({
    flex: 1,
    height: "2px",
    borderRadius: "100%",
    background: "var(--border-subtle)",
});

const Label = styled.span({
    margin: "0 10px",
    color: "var(--text-muted)",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
});

export function SepWithText({children}: { children: React.ReactNode }) {
    return (
        <Wrapper>
            <Line/>
            <Label>{children}</Label>
            <Line/>
        </Wrapper>
    );
}

function DeepLChatPopout({channelId}: { channelId: string }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const ref = React.useRef(null);
    const selectedLang = Hooks.useStateFromStores([DeepTranslateStore], () => DeepTranslateStore.getOutgoingTranslateLang(channelId));

    function pick(lang: string | null) {
        DeepTranslateStore.setOutgoingTranslateLang(channelId, lang);
        setIsOpen(false);
    }

    function LangRow({label, active, onClick}: { label: string, active: boolean, onClick: () => void }) {
        const [hovered, setHovered] = React.useState(false);

        return (
            <div
                onClick={onClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                    padding: "6px 8px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "18px",
                    cursor: "pointer",
                    background: active
                        ? "var(--interactive-accent-background-selected)"
                        : hovered
                            ? "var(--interactive-background-hover)"
                            : "transparent",
                    color: active ? "white" : "var(--interactive-text-default)"
                }}>
                <span>{label}</span>
                {active && (
                    <svg width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor"
                              d="M21.7 5.3a1 1 0 0 1 0 1.4l-12 12a1 1 0 0 1-1.4 0l-6-6a1 1 0 1 1 1.4-1.4L9 16.6L20.3 5.3a1 1 0 0 1 1.4 0Z"/>
                    </svg>
                )}
            </div>
        );
    }

    return (
        <div ref={ref}>
            <Popout
                shouldShow={isOpen}
                onRequestClose={() => setIsOpen(false)}
                position={"top"}
                clickTrap={true}
                targetElementRef={ref}
                renderPopout={() => (
                    <div
                        className={Utils.className(ScrollerClassNames.container, ScrollerClassNames.scrollbarGutterStable, ScrollerClassNames.thin, ScrollerClassNames.scrollerBase, ScrollerClassNames.fade)}
                        style={{
                            // container_d02962 scrollbarGutterStable__99f8c thin__99f8c scrollerBase__99f8c fade__99f8c
                            background: "var(--background-surface-high)",
                            borderRadius: "var(--radius-sm)",
                            boxShadow: "var(--elevation-high)",
                            padding: "6px",
                            width: "400px",
                            maxHeight: "280px",
                            overflowY: "auto",
                            border: "1px solid var(--border-subtle)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "2px"
                        }}>
                        <div style={{
                            padding: "6px 8px 4px",
                            fontSize: "12px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: ".02em",
                            color: "var(--text-muted)"
                        }}>
                            Auto-Translate Sent Messages
                        </div>

                        <LangRow label={"Off"} active={!selectedLang} onClick={() => pick(null)}/>

                        <SepWithText>Common Languages</SepWithText>

                        {COMMON_TARGET_LANGS.map(code => (
                            <LangRow key={code} label={getLanguageName(code)} active={selectedLang === code}
                                     onClick={() => pick(code)}/>
                        ))}

                        <SepWithText>All Languages</SepWithText>

                        {ALL_TARGET_LANGS.map(code => (
                            <LangRow key={code} label={getLanguageName(code)} active={selectedLang === code}
                                     onClick={() => pick(code)}/>
                        ))}
                    </div>
                )}
            >
                {(_props: any, {isShown}: { isShown: boolean }) => (
                    <div key={"rere-dern"} {..._props}
                         onClick={(e: MouseEvent) => {
                             setIsOpen(o => !o);
                         }}
                         style={{
                             cursor: "pointer",
                             display: "flex",
                             color: (selectedLang || isShown) ? "var(--icon-brand)" : "var(--interactive-icon-default)"
                         }}>
                        <HeaderComponents.Icon icon={() => <DeepL on={!!selectedLang}/>}/>
                    </div>
                )}
            </Popout>
        </div>
    );
}

function FloatingBarTeller() {
    const isOutgoing = Hooks.useStateFromStores(
        [DeepTranslateStore],
        () => DeepTranslateStore.isCurrentlyTranslating()
    );

    return (
        <div
            key="floating-bar"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                ...(isOutgoing ? { padding: '6px 10px' } : {}),
                marginBottom: '6px',
                justifyContent: 'flex-start',
                width: '100%',
                boxSizing: 'border-box',
                borderBottom: '1px solid var(--border-subtle)'
            }}
        >
            {isOutgoing ? (
                <>
                    <DeepL />
                    <span /*onClick={() => DeepTranslateStore.cancelAll()} not yet.*/ style={{ color: 'var(--text-default)' }}>
                        Currently translating...
                    </span>
                </>
            ) : null}
        </div>
    );
}


export default class DeepTranslate {
    async start() {
        const MessageContent = await Webpack.waitForModule(Webpack.Filters.bySource('VOICE_HANGOUT_INVITE?""'))
        const MessageActions = Webpack.getByKeys("_sendMessage")

        Patcher.instead(MessageActions, "_sendMessage", async (_this, methodArgs, originalFunc) => {
            const channelId = SelectedChannelStore.getChannelId();
            const content = methodArgs[1].content

            const targetLang = channelId ? DeepTranslateStore.getOutgoingTranslateLang(channelId) : undefined;

            const canTranslate = targetLang
                && content
                && content.length > 0
                && content.length <= MAX_CHARS
                && !DeepTranslateStore.isRateLimited();

            if (canTranslate) {
                try {
                    const result = await DeepTranslateStore.translateOutgoing(content, targetLang as any);
                    methodArgs[1].content = result.text;
                } catch (err) {
                    throw new TranslateError("Failed to translate; Rate limit?", 0);
                }
            }

            return originalFunc.apply(_this, methodArgs);
        })

        Patcher.after(Buttons.A, "type", (_, buttonArgs, returnValue) => {
            const [props] = buttonArgs;
            const channelId = props?.channel?.id
            if (!channelId) return returnValue;

            returnValue.props.children.unshift(<DeepLChatPopout channelId={channelId} key={"deep-translate-outgoing"}/>);
        })

        Patcher.after(MessageContent.Ay, "type", (_this, args, returnValue) => {
            const message = args[0].message
            if (!message) return returnValue;

            return <TranslateComponent original={returnValue} message={message} author={message.author}/>
        })

        const module = getKey(StackedBarsModule, Webpack.Filters.byRegex(/0===.{1}.length&&0===.{1}.length/))
        Patcher.instead(module?.module, module?.key, (a, b, c) => {
            const data = c(...b);
            !Object.values(b[0].bars.floating).find(x => x.type.name.includes("FloatingBarTeller")) && b[0].bars.floating.push(
                <FloatingBarTeller/>)
            return data;
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