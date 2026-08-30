/**
 * @name ColorTooltips
 * @author Kaan
 * @version 1.0.0
 * @description A remaster of Pu's ColorTooltips plugin, allowing you to do color conversions in chat
 */

const {React, Webpack, Components, DOM} = new BdApi("ColorTooltips");

const Popout = Webpack.getModule((m) => m?.Animation, {searchExports: true, raw: true})?.exports?.Y;

const TinyColor = Webpack.getByKeys("hsl");

type Format =
    | "hex" | "keyword" | "decimal"
    | "rgb" | "rgb_percent"
    | "hsl" | "hsv" | "hwb" | "cmyk"
    | "xyz" | "lab" | "lch"
    | "ansi16" | "ansi256" | "hcg" | "apple";

const CSS_STRINGABLE: ReadonlySet<Format> = new Set(["rgb", "hsl", "hwb"]);

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
    try {
        const color = TinyColor(rawColor);
        switch (format) {
            case "hex":
                return color.hex();
            case "keyword":
                return color.keyword() || "No matching CSS keyword";
            case "decimal":
                return color.rgbNumber().toString();
            case "rgb_percent":
                return color.percentString();
            default: {
                const instance = color[format]().round();
                if (CSS_STRINGABLE.has(format)) return instance.string();
                // tinycolorjs sucks.
                return `${format}(${instance.array().join(", ")})`;
            }
        }
    } catch {
        return null;
    }
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
    targetRef: {current: HTMLElement};
    format?: Format;
}) {
    const [rawColor, setRawColor] = React.useState<string | null>(null);
    const [format, setFormat] = React.useState<Format>(initialFormat);
    const [copied, setCopied] = React.useState(false);
    const copyTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
        if (!targetRef.current) return;
        setRawColor(getComputedColorString(targetRef.current));
    }, [targetRef]);

    React.useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        };
    }, []);

    if (!rawColor) return null;

    const display = formatColor(rawColor, format);

    const formats: { label: string; value: Format }[] = [
        {label: "Hex", value: "hex"},
        {label: "Keyword", value: "keyword"},
        {label: "Decimal", value: "decimal"},
        {label: "RGB", value: "rgb"},
        {label: "RGB %", value: "rgb_percent"},
        {label: "HSL", value: "hsl"},
        {label: "HSV", value: "hsv"},
        // {label: "HWB", value: "hwb"},
        // {label: "CMYK", value: "cmyk"},
        // {label: "XYZ", value: "xyz"},
        {label: "LAB", value: "lab"},
        {label: "LCH", value: "lch"},
        // {label: "ANSI16", value: "ansi16"},
        // {label: "ANSI256", value: "ansi256"},
        // {label: "HCG", value: "hcg"},
        // {label: "Apple", value: "apple"},
    ];

    const handleCopy = async () => {
        if (!display) return;

        await navigator.clipboard.writeText(display);

        setCopied(true);
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div style={{display: "flex", flexDirection: "column", color: "#fff", minWidth: "500px"}}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "var(--background-gradient-high,var(--background-base-lowest))",
                borderRadius: "8px",
                padding: "6px 10px",
            }}>
                <div style={{display: "flex", flex: 1, flexWrap: "wrap", gap: "4px"}}>
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
                                        ? "var(--background-modifier-selected, rgba(255,255,255,0.12))"
                                        : "transparent",
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
                padding: "10px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
            }}>
                <div style={{
                    backgroundColor: rawColor,
                    width: "60px",
                    height: "60px",
                    borderRadius: "12px",
                    flexShrink: 0,
                    border: "1px solid rgba(255,255,255,0.15)",
                }}/>
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
            </div>
        </div>
    );
}

function hexWithOpacity(hexColor, opacity) {
    const alpha = Math.round(opacity * 255);
    const alphaHex = alpha.toString(16).padStart(2, '0');
    return hexColor + alphaHex;
}

function getCssVarAsHex(colorVar) {
    const computedColor = getComputedStyle(document.body)
        .getPropertyValue(colorVar)
        .trim();

    if (!computedColor) return null;

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');

    try {
        ctx.fillStyle = computedColor;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        return TinyColor(`rgb(${r}, ${g}, ${b})`).hex();
    } catch {
        return null;
    }
}

interface ChatColorCompProps {
    color: string;
}

function ChatColorComp({ color }: ChatColorCompProps) {
    const ref = React.useRef<HTMLDivElement>(null);

    const { bgColor, textColor, type } = React.useMemo(() => {
        const hexColor = color.includes("var")
            ? TinyColor(getCssVarAsHex(color.slice(4, -1))).hex()
            : TinyColor(color).hex();

        const tinyColor = TinyColor(hexColor);

        return {
            bgColor: hexWithOpacity(tinyColor.hex(), 0.3),
            textColor: tinyColor.lighten(0.1).hex(),
            type: tinyColor.module
        };
    }, [color]);

    return (
        <Popout
            position="top"
            targetElementRef={ref}
            renderPopout={() => (
                <ChatColorPopoutContent
                    targetRef={ref}
                    format={type}
                />
            )}
        >
            {(props: any) => (
                <span
                    className="mention ctp interactive"
                    {...props}
                    ref={ref}
                    role="button"
                    aria-expanded={false}
                    style={{
                        backgroundColor: bgColor,
                        color: textColor,
                    }}
                >
                    {color}
                </span>
            )}
        </Popout>
    );
}

const colorRegexArray = [
    // {name: 'hex3', regex: /^(\s*)#[0-9a-f]{3}(\s*)/},
    {name: 'hex6', regex: /^(\s*)#[0-9a-fA-F]{6}(\s*)/},
    {
        name: 'rgb',
        regex:
            /^(\s*)rgb\(\s*(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\s*,\s*(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\s*,\s*(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\s*\)(\s*)/,
    },
    {
        name: 'rgba',
        regex:
            /^(\s*)rgba\(\s*(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\s*,\s*(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\s*,\s*(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\s*,\s*(?:0*\.?\d+|1(?:\.0*)?)\s*\)(\s*)/,
    },
    {
        name: 'rgb_percentage',
        regex:
            /^(\s*)rgb\(\s*(?:100|[1-9]?[0-9])%\s*,\s*(?:100|[1-9]?[0-9])%\s*,\s*(?:100|[1-9]?[0-9])%\s*\)(\s*)/,
    },
    {
        name: 'rgba_percentage',
        regex:
            /^(\s*)rgba\(\s*(?:100|[1-9]?[0-9])%\s*,\s*(?:100|[1-9]?[0-9])%\s*,\s*(?:100|[1-9]?[0-9])%\s*,\s*(?:0*\.?\d+|1(?:\.0*)?)\s*\)(\s*)/,
    },
    {
        name: 'hsl',
        regex:
            /^(\s*)hsl\(\s*(?:360|3[0-5][0-9]|[12]?[0-9]{1,2})\s*,\s*(?:100|[1-9]?[0-9])%\s*,\s*(?:100|[1-9]?[0-9])%\s*\)(\s*)/,
    },
    {
        name: 'hsla',
        regex:
            /^(\s*)hsla\(\s*(?:360|3[0-5][0-9]|[12]?[0-9]{1,2})\s*,\s*(?:100|[1-9]?[0-9])%\s*,\s*(?:100|[1-9]?[0-9])%\s*,\s*(?:0*\.?\d+|1(?:\.0*)?)\s*\)(\s*)/,
    },
    {
        name: 'named_colors',
        regex:
            /^(\s*)(lightgoldenrodyellow|mediumspringgreen|mediumaquamarine|mediumslateblue|mediumturquoise|mediumvioletred|blanchedalmond|cornflowerblue|darkolivegreen|lightslategray|lightslategrey|lightsteelblue|mediumseagreen|darkgoldenrod|darkslateblue|darkslategray|darkslategrey|darkturquoise|lavenderblush|lightseagreen|palegoldenrod|paleturquoise|palevioletred|rebeccapurple|antiquewhite|darkseagreen|lemonchiffon|lightskyblue|mediumorchid|mediumpurple|midnightblue|darkmagenta|deepskyblue|floralwhite|forestgreen|greenyellow|lightsalmon|lightyellow|navajowhite|saddlebrown|springgreen|yellowgreen|aquamarine|blueviolet|chartreuse|darkorange|darkorchid|darksalmon|darkviolet|dodgerblue|ghostwhite|indianred |lightcoral|lightgreen|mediumblue|papayawhip|powderblue|sandybrown|whitesmoke|aliceblue|burlywood|cadetblue|chocolate|darkgreen|darkkhaki|firebrick|gainsboro|goldenrod|lawngreen|lightblue|lightcyan|lightgray|lightgrey|lightpink|limegreen|mintcream|mistyrose|olivedrab|orangered|palegreen|peachpuff|rosybrown|royalblue|slateblue|slategray|slategrey|steelblue|turquoise|cornsilk|darkblue|darkcyan|darkgray|darkgrey|deeppink|honeydew|indigo  |lavender|moccasin|seagreen|seashell|crimson|darkred|dimgray|dimgrey|fuchsia|hotpink|magenta|oldlace|skyblue|thistle|bisque|maroon|orange|orchid|purple|salmon|sienna|silver|tomato|violet|yellow|azure|beige|black|brown|coral|green|ivory|khaki|linen|olive|wheat|white|aqua|blue|cyan|gold|gray|grey|lime|navy|peru|pink|plum|snow|teal|red|tan)(\s*)/,
    },
    {
        name: 'css_variables',
        regex: /^(\s*)var\(\s*--[a-zA-Z0-9_-]+(?:\s*,\s*[^)]+)?\s*\)(\s*)/,
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
                parse: (capture: string[]) => ({color: capture[0] || capture[1] || "red"}),
                react: (node: { color: string }) => <ChatColorComp color={node.color}/>
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