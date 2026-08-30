/**
 * @name ColorTooltips
 * @author Kaan
 * @version 1.1.0
 * @description A remaster of Pu's ColorTooltips plugin, allowing you to do color conversions in chat
 */

const {React, Webpack, Components, DOM} = new BdApi("ColorTooltips");
import TinyColor from "tinycolor2";

const addedColors = {
    chucknorris: "c00000",
    charmeleon: "red",
    ivysaur: "blue",
    squirtle: "green",
};

Object.entries(addedColors).forEach(([name, color]) => {
    const hex = TinyColor(color).toHexString().replace("#", "").toLowerCase();
    TinyColor.names[name] = hex;
    TinyColor.hexNames[hex] = name;
});

// Object.assign(TinyColor.names, { chucknorris: "c00000" });
// Object.assign(TinyColor.hexNames, {c00000: "chucky norris!!"})

const Popout = Webpack.getModule((m) => m?.Animation, {searchExports: true, raw: true})?.exports?.Y;

type Format =
    | "hex" | "keyword" | "decimal"
    | "rgb" | "rgb_percent"
    | "hsl" | "hsv" | "hwb" | "cmyk"
    | "xyz" | "lab" | "lch"
    | "ansi16" | "ansi256" | "hcg" | "apple";

let normalizeCanvas: HTMLCanvasElement | null = null;
let normalizeCtx: CanvasRenderingContext2D | null = null;

function normalizeCssColor(cssColor: string): string | null {
    if (!cssColor) return null;

    if (!normalizeCanvas) {
        normalizeCanvas = document.createElement("canvas");
        normalizeCanvas.width = 1;
        normalizeCanvas.height = 1;
        normalizeCtx = normalizeCanvas.getContext("2d");
    }
    if (!normalizeCtx) return null;

    normalizeCtx.fillStyle = cssColor;
    normalizeCtx.clearRect(0, 0, 1, 1);
    normalizeCtx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = normalizeCtx.getImageData(0, 0, 1, 1).data;

    if (r === 0 && g === 0 && b === 0 && a === 0) {
        return null;
    }

    return a === 255
        ? `rgb(${r}, ${g}, ${b})`
        : `rgba(${r}, ${g}, ${b}, ${+(a / 255).toFixed(3)})`;
}

function getComputedColorString(element: HTMLElement) {
    return normalizeCssColor(getComputedStyle(element).color);
}

function formatColor(rawColor: string | null, format: Format) {
    if (!rawColor) return null;

    const color = TinyColor(rawColor);
    if (!color.isValid()) return null;

    switch (format) {
        case "hex":
            return color.toHexString();
        case "keyword":
            // this is going to fail anyway. idk why I have it here.
            return color.toName() || "No matching CSS keyword";
        case "decimal":
            return parseInt(color.toHex(), 16).toString();
        case "rgb":
            return color.toRgbString();
        case "rgb_percent":
            return color.toPercentageRgbString();
        case "hsl":
            return color.toHslString();
        case "hsv":
            return color.toHsvString();
        default:
            return null;
    }
}

type Adjustment = { label: string; hex: string };

function mixHexColors(hexA: string, hexB: string, amount: number): string {
    const parse = (hex: string) => {
        const clean = hex.replace("#", "");
        const full = clean.length === 3
            ? clean.split("").map((c) => c + c).join("")
            : clean;
        const num = parseInt(full, 16);
        return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
    };

    const [r1, g1, b1] = parse(hexA);
    const [r2, g2, b2] = parse(hexB);
    const w = amount / 100;
    const blend = (a: number, b: number) => Math.round(a + (b - a) * w);

    return "#" + [blend(r1, r2), blend(g1, g2), blend(b1, b2)]
        .map((c) => c.toString(16).padStart(2, "0"))
        .join("");
}

function getColorInfo(rawColor: string) {
    const c = TinyColor(rawColor);
    if (!c.isValid()) return null;

    return {
        isLight: c.isLight(),
        brightness: Math.round(c.getBrightness()),
        luminance: c.getLuminance().toFixed(2),
    };
}

function getAdjustments(rawColor: string): Adjustment[] {
    const base = TinyColor(rawColor);
    if (!base.isValid()) return [];

    const make = (fn: (c: any) => any) => fn(TinyColor(rawColor)).toHexString();
    const baseHex = base.toHexString();

    return [
        // new versions dropped .mix();
        {label: "Lighten", hex: make((c) => c.lighten(15))},
        {label: "Brighten", hex: make((c) => c.brighten(15))},
        {label: "Darken", hex: make((c) => c.darken(15))},
        {label: "Saturate", hex: make((c) => c.saturate(25))},
        {label: "Desaturate", hex: make((c) => c.desaturate(25))},
        {label: "Greyscale", hex: make((c) => c.greyscale())},
        {label: "Complement", hex: make((c) => c.complement())},
        {label: "Tint", hex: mixHexColors(baseHex, "#ffffff", 50)},
        {label: "Shade", hex: mixHexColors(baseHex, "#000000", 50)},
    ];
}

const Icon = ({copied}: { copied: boolean }) => (
    copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
            <path fill="#23a55a" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
            <path fill="#fff"
                  d="M14 8H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V10c0-1.103-.897-2-2-2"></path>
            <path fill="#fff" d="M20 2H10a2 2 0 0 0-2 2v2h8a2 2 0 0 1 2 2v8h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2"></path>
        </svg>
    )
);

function ChatColorPopoutContent({targetRef, format: initialFormat = "hex"}: {
    targetRef: { current: HTMLElement };
    format?: Format;
}) {
    const [rawColor, setRawColor] = React.useState<string | null>(null);
    const [format, setFormat] = React.useState<Format>(initialFormat);
    const [copied, setCopied] = React.useState(false);
    const [copiedAdjustment, setCopiedAdjustment] = React.useState<string | null>(null);
    const copyTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const adjustmentTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
        if (!targetRef.current) return;
        setRawColor(getComputedColorString(targetRef.current));
    }, [targetRef]);

    React.useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
            if (adjustmentTimeoutRef.current) clearTimeout(adjustmentTimeoutRef.current);
        };
    }, []);

    if (!rawColor) return null;

    const display = formatColor(rawColor, format);
    const info = getColorInfo(rawColor);
    const adjustments = getAdjustments(rawColor);

    const formats: { label: string; value: Format }[] = [
        {label: "Hex", value: "hex"},
        {label: "Keyword", value: "keyword"},
        {label: "Decimal", value: "decimal"},
        {label: "RGB", value: "rgb"},
        {label: "RGB %", value: "rgb_percent"},
        {label: "HSL", value: "hsl"},
        {label: "HSV", value: "hsv"},
    ];

    const handleCopy = async () => {
        if (!display) return;

        await navigator.clipboard.writeText(display);

        setCopied(true);
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = setTimeout(() => setCopied(false), 1500);
    };

    const handleAdjustmentCopy = async (hex: string, label: string) => {
        await navigator.clipboard.writeText(hex);

        setCopiedAdjustment(label);
        if (adjustmentTimeoutRef.current) clearTimeout(adjustmentTimeoutRef.current);
        adjustmentTimeoutRef.current = setTimeout(() => setCopiedAdjustment(null), 1500);
    };

    return (
        <div style={{
            display: "flex",
            backgroundColor: "#000",
            flexDirection: "column",
            color: "#fff",
            minWidth: "500px"
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "var(--background-gradient-high,var(--background-base-lowest))",
                borderRadius: "8px",
                padding: "6px",
            }}>
                <div style={{display: "flex", flex: 1, flexWrap: "wrap", gap: "6px"}}>
                    {formats.map(({label, value}) => {
                        const active = format === value;
                        return (
                            <Components.Button
                                key={value}
                                looks={Components.Button.Looks.BLANK}
                                onClick={() => setFormat(value)}
                                style={{
                                    color: "#fff",
                                    fontWeight: active ? 600 : 400,
                                    padding: "4px 10px",
                                    minWidth: "fit-content",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    backgroundColor: active
                                        ? "var(--interactive-background-selected)"
                                        : "var(--interactive-background-selected, rgba(255,255,255,0.4))",
                                    transition: "background-color 0.15s ease, font-weight 0.15s ease",
                                }}
                            >
                                {label}
                            </Components.Button>
                        );
                    })}
                </div>
                <Components.Tooltip text={copied ? "Copied!" : "Copy"}>
                    {(x) => (
                        <div
                            {...x}
                            onClick={handleCopy}
                            role="button"
                            aria-label="Copy color value"
                            style={{
                                cursor: display ? "pointer" : "default",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "4px",
                                borderRadius: "6px",
                                opacity: display ? 1 : 0.4,
                            }}
                        >
                            <Icon copied={copied}/>
                        </div>
                    )}
                </Components.Tooltip>
            </div>

            <div style={{
                backgroundColor: "var(--background-gradient-highest,var(--chat-background-default))",
                borderRadius: "8px",
                padding: "6px",
                marginTop: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
            }}>
                <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                    <div style={{
                        backgroundColor: rawColor,
                        width: "60px",
                        height: "60px",
                        borderRadius: "12px",
                        flexShrink: 0,
                        border: "1px solid rgba(255,255,255,0.15)",
                    }}/>
                    <div style={{display: "flex", flexDirection: "column", gap: "4px"}}>
                        <span
                            onClick={handleCopy}
                            style={{
                                color: "#fff",
                                fontFamily: "var(--font-code, monospace)",
                                cursor: display ? "pointer" : "default",
                                wordBreak: "break-all",
                            }}
                        >
                            {display ?? "Unsupported color format"}
                        </span>
                        {info && (
                            <div style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "10px",
                                fontSize: "12px",
                                color: "var(--text-muted, #949ba4)"
                            }}>
                                <span>{info.isLight ? "Light" : "Dark"}</span>
                                <span>Brightness {info.brightness}/255</span>
                                <span>Luminance {info.luminance}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {adjustments.length > 0 && (
                <div style={{
                    backgroundColor: "var(--background-gradient-highest,var(--chat-background-default))",
                    borderRadius: "8px",
                    padding: "10px",
                    marginTop: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                }}>
                    <span style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "var(--text-muted, #949ba4)",
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                    }}>
                        Adjustments
                    </span>
                    <div style={{display: "flex", flexWrap: "wrap", gap: "6px"}}>
                        {adjustments.map(({label, hex}) => (
                            <Components.Tooltip
                                key={label}
                                text={copiedAdjustment === label ? "Copied!" : `${label} · ${hex}`}
                            >
                                {(x) => (
                                    <div
                                        {...x}
                                        onClick={() => handleAdjustmentCopy(hex, label)}
                                        role="button"
                                        aria-label={`Copy ${label} color (${hex})`}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            padding: "4px 8px",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            backgroundColor: "var(--background-modifier-hover, rgba(255,255,255,0.06))",
                                            transition: "background-color 0.15s ease",
                                        }}
                                    >
                                        <div style={{
                                            width: "16px",
                                            height: "16px",
                                            borderRadius: "4px",
                                            backgroundColor: hex,
                                            border: "1px solid rgba(255,255,255,0.15)",
                                            flexShrink: 0,
                                        }}/>
                                        <span style={{fontSize: "12px", color: "#fff"}}>{label}</span>
                                    </div>
                                )}
                            </Components.Tooltip>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function hexWithOpacity(hexColor: string, opacity: number) {
    const alpha = Math.round(opacity * 255);
    const alphaHex = alpha.toString(16).padStart(2, '0');
    return hexColor + alphaHex;
}

function getCssVarAsHex(colorVar: string): string | null {
    const computedColor = getComputedStyle(document.body)
        .getPropertyValue(colorVar)
        .trim();

    if (!computedColor) return null;

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    try {
        ctx.fillStyle = computedColor;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        // discord is on old ass version of tinycolor2 lmao.
        return TinyColor(`rgb(${r}, ${g}, ${b})`).toHexString();
    } catch {
        return null;
    }
}

function lightenHex(hex: string, amount: number): string {
    const clean = hex.replace("#", "");
    const full = clean.length === 3
        ? clean.split("").map(c => c + c).join("")
        : clean;
    const num = parseInt(full, 16);

    const r = (num >> 16) & 0xff;
    const g = (num >> 8) & 0xff;
    const b = num & 0xff;

    const mix = (channel: number) => Math.round(channel + (255 - channel) * amount);

    return "#" + [mix(r), mix(g), mix(b)]
        .map(c => c.toString(16).padStart(2, "0"))
        .join("");
}

function ChatColorComp({color}: { color: string }) {
    const ref = React.useRef<HTMLDivElement>(null);

    let hexColor: string;
    let bgColor: string;
    let textColor: string;

    if (color.startsWith("var(")) {
        const resolved = getCssVarAsHex(color.slice(4, color.length - 1));
        hexColor = resolved ? TinyColor(resolved).toHexString() : "#000000";
        bgColor = hexWithOpacity(hexColor, 0.3);
        textColor = lightenHex(hexColor, 0.1);
    } else {
        hexColor = TinyColor(color).toHexString();
        bgColor = hexWithOpacity(hexColor, 0.3);
        textColor = lightenHex(hexColor, 0.1);
    }

    return (
        <Popout
            position={"top"}
            targetElementRef={ref}
            renderPopout={() => <ChatColorPopoutContent targetRef={ref} format="hex"/>}
        >
            {(props: Record<string, unknown>) => (
                <span
                    className={"mention ctp interactive"}
                    {...props}
                    ref={ref}
                    role={"button"}
                    aria-expanded={false}
                    style={{
                        backgroundColor: bgColor,
                        color: textColor
                    }}
                >
                    {color}
                </span>
            )}
        </Popout>
    );
}

const colorRegexArray = [
    {name: 'hex6', regex: /^(\s*)#[0-9a-fA-F]{6}/},
    {name: 'hex3', regex: /^(\s*)#[0-9a-f]{3}/},
    {
        name: 'rgb',
        regex: /^(\s*)?rgb\(\s*(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\s*,\s*(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\s*,\s*(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\s*\)/,
    },
    {
        name: 'rgba',
        regex: /^(\s*)?rgba\(\s*(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\s*,\s*(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\s*,\s*(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\s*,\s*(?:0*\.?\d+|1(?:\.0*)?)\s*\)/,
    },
    {
        name: 'rgb_percentage',
        regex: /^(\s*)?rgb\(\s*(?:100|[1-9]?[0-9])%\s*,\s*(?:100|[1-9]?[0-9])%\s*,\s*(?:100|[1-9]?[0-9])%\s*\)/,
    },
    {
        name: 'rgba_percentage',
        regex: /^(\s*)?rgba\(\s*(?:100|[1-9]?[0-9])%\s*,\s*(?:100|[1-9]?[0-9])%\s*,\s*(?:100|[1-9]?[0-9])%\s*,\s*(?:0*\.?\d+|1(?:\.0*)?)\s*\)/,
    },
    {
        name: 'hsl',
        regex: /^(\s*)?hsl\(\s*(?:360|3[0-5][0-9]|[12]?[0-9]{1,2})\s*,\s*(?:100|[1-9]?[0-9])%\s*,\s*(?:100|[1-9]?[0-9])%\s*\)/,
    },
    {
        name: 'hsla',
        regex: /^(\s*)?hsla\(\s*(?:360|3[0-5][0-9]|[12]?[0-9]{1,2})\s*,\s*(?:100|[1-9]?[0-9])%\s*,\s*(?:100|[1-9]?[0-9])%\s*,\s*(?:0*\.?\d+|1(?:\.0*)?)\s*\)/,
    },
    {
        name: 'named_colors',
        regex: /^(\s*)?(squirtle|charmeleon|ivysaur|chucknorris|lightgoldenrodyellow|mediumspringgreen|mediumaquamarine|mediumslateblue|mediumturquoise|mediumvioletred|blanchedalmond|cornflowerblue|darkolivegreen|lightslategray|lightslategrey|lightsteelblue|mediumseagreen|darkgoldenrod|darkslateblue|darkslategray|darkslategrey|darkturquoise|lavenderblush|lightseagreen|palegoldenrod|paleturquoise|palevioletred|rebeccapurple|antiquewhite|darkseagreen|lemonchiffon|lightskyblue|mediumorchid|mediumpurple|midnightblue|darkmagenta|deepskyblue|floralwhite|forestgreen|greenyellow|lightsalmon|lightyellow|navajowhite|saddlebrown|springgreen|yellowgreen|aquamarine|blueviolet|chartreuse|darkorange|darkorchid|darksalmon|darkviolet|dodgerblue|ghostwhite|indianred |lightcoral|lightgreen|mediumblue|papayawhip|powderblue|sandybrown|whitesmoke|aliceblue|burlywood|cadetblue|chocolate|darkgreen|darkkhaki|firebrick|gainsboro|goldenrod|lawngreen|lightblue|lightcyan|lightgray|lightgrey|lightpink|limegreen|mintcream|mistyrose|olivedrab|orangered|palegreen|peachpuff|rosybrown|royalblue|slateblue|slategray|slategrey|steelblue|turquoise|cornsilk|darkblue|darkcyan|darkgray|darkgrey|deeppink|honeydew|indigo  |lavender|moccasin|seagreen|seashell|crimson|darkred|dimgray|dimgrey|fuchsia|hotpink|magenta|oldlace|skyblue|thistle|bisque|maroon|orange|orchid|purple|salmon|sienna|silver|tomato|violet|yellow|azure|beige|black|brown|coral|green|ivory|khaki|linen|olive|wheat|white|aqua|blue|cyan|gold|gray|grey|lime|navy|peru|pink|plum|snow|teal|red|tan)/,
    },
    {
        name: 'css_variables',
        regex: /^(\s*)?var\(\s*--[a-zA-Z0-9_-]+(?:\s*,\s*[^)]+)?\s*\)/,
    },
];
const markdown = Webpack.getModule(m => m.reactParserFor)

export default class Plugin {
    start() {
        DOM.addStyle('colorTooltips', `
        .ctp {
            background: var(--mention-background);
            border-radius: 3px;
            color: var(--mention-foreground);
            font-weight: var(--font-weight-medium);
            padding: 0 2px;
            unicode-bidi: plaintext
        }
        `)

        let index = 0;

        for (const obj of colorRegexArray) {
            const regex = obj.regex;
            const name = obj.name;

            if (!regex) continue;

            markdown.defaultRules[name] = {
                order: index,
                match: (text: string) => text.match(regex),
                parse: (capture: string[]) => ({color: capture[0].toLowerCase() || capture[1].toLowerCase() || "red"}),
                react: (node: { color: string }) => <Components.ErrorBoundary
                    fallback={<span>{node.color}</span>}><ChatColorComp
                    color={node.color.replace(" ", "")}/></Components.ErrorBoundary>
            }

            index++;
        }

        markdown.parse = markdown.reactParserFor(markdown.defaultRules);
    }

    stop() {
        DOM.removeStyle('colorTooltips');

        for (const obj of colorRegexArray) {
            delete markdown.defaultRules[obj.name];
        }

        markdown.parse = markdown.reactParserFor(markdown.defaultRules)
    }
}