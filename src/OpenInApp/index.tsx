import {ChangeLog, SettingsStore, styled, wpGetBulkKeyed} from "@helpers";

const {Components} = new BdApi(__PLUGIN_NAME__)
const {Tooltip} = Components

const ICON_SIZE = 24;
const GITHUB_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fff'%3E%3Cpath d='M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943'/%3E%3C/svg%3E";

const Modules = wpGetBulkKeyed({
    "SimpleMarkdown": {
        filter: m => m.reactParserFor,
    }
})

const open = (url: string) => {
    console.log(`OpenInApp: protocol: ${url}`);
    (0, eval)("require(\"electron\")").shell.openExternal(url);
};

function generateFaviconURL(website: string, size = ICON_SIZE) {
    const url = new URL("https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL");
    url.searchParams.set("url", `https://${website}`);
    url.searchParams.set("size", String(size));
    return url.href;
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const protocolRegex = (protocol: string) =>
    new RegExp(`^${escapeRegex(protocol)}(?:[^\\s<>]*[^\\s<>.,;:!?)\\]'"])?`);

const app = (protocol: string, site: string, trusted = false, execute = open) => ({
    protocol,
    icon: generateFaviconURL(site),
    trusted,
    execute
});


const Protocols = {
    // OMG, MOM GET THE CAMERA, I NEED TO TAKE A PICTURE OF THIS PROTOCOL
    BetterDiscord: {
        protocol: "betterdiscord://",
        icon: "https://betterdiscord.app/resources/branding/logo_small.svg",
        execute: (url: string) => window.open(url),
        trusted: true
    },

    // Communication / social
    Spotify: app("spotify://", "spotify.com", true),
    Skype: app("skype://", "skype.com"),
    Teams: app("msteams://", "teams.microsoft.com"),
    Zoom: app("zoommtg://", "zoom.us"),
    Zoomus: app("zoomus://", "zoom.us"),
    Twitch: app("twitch://", "twitch.tv", true),
    YouTube: app("youtube://", "youtube.com", true),
    VLC: app("vlc://", "videolan.org", true),
    WhatsApp: app("whatsapp://", "whatsapp.com"),
    Telegram: app("tg://", "telegram.org"),
    Signal: app("sgnl://", "signal.org"),
    Messenger: app("fb-messenger://", "messenger.com"),
    Slack: app("slack://", "slack.com"),
    Element: app("element://", "element.io"),
    Viber: app("viber://", "viber.com"),
    Line: app("line://", "line.me"),
    Webex: app("webex://", "webex.com"),

    // Games / launchers
    Steam: app("steam://", "steampowered.com", true),
    Epic: app("com.epicgames.launcher://", "epicgames.com"),
    GOG: app("goggalaxy://", "gog.com"),
    Battlenet: app("battlenet://", "battle.net"),
    Origin: app("origin2://", "ea.com"),
    Minecraft: app("minecraft://", "minecraft.net"),
    Roblox: app("roblox://", "roblox.com", true),
    Riot: app("riotclient://", "riotgames.com"),

    // Dev tools / productivity
    VSCode: app("vscode://", "code.visualstudio.com", true),
    Cursor: app("cursor://", "cursor.com"),
    "Github Desktop": {...app("x-github-client://", "desktop.github.com"), icon: GITHUB_ICON},
    Postman: app("postman://", "postman.com"),
    Notion: app("notion://", "notion.so"),
    Obsidian: app("obsidian://", "obsidian.md"),
    Figma: app("figma://", "figma.com"),
    Linear: app("linear://", "linear.app"),
    Zotero: app("zotero://", "zotero.org"),

    // Media
    "Apple Music": app("music://", "music.apple.com"),
    Tidal: app("tidal://", "tidal.com"),
    Plex: app("plex://", "plex.tv"),

    // Maps / mail / misc
    Maps: app("maps://", "maps.apple.com"),
    Mailto: app("mailto:", "mail.google.com", true),
    Tel: app("tel:", "google.com"),
};

interface Settings {
    trusted: string[];
    compact: boolean;
}

const Settings = new SettingsStore<Settings>({
    trusted: [],
    compact: false,
});

const ProtocolMention = styled.span({
    background: "var(--mention-background)",
    borderRadius: 4,
    color: "var(--mention-foreground)",
    fontWeight: "var(--font-weight-medium)",
    padding: "2px 2px",
    unicodeBidi: "plaintext",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    verticalAlign: "bottom",
    cursor: "pointer",
})

const TRUSTED_COLOR = "hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%)";
const UNTRUSTED_COLOR = "hsl(0, calc(var(--saturation-factor, 1) * 100%), 50%)";

const ProtocolContainer = styled.div(({protocol, trusted}: { protocol: string, trusted: boolean }) => {
    const isTrusted = trusted ?? Settings.get("trusted").includes(protocol);

    return {
        background: "var(--background-surface-high)",
        border: "1px solid var(--border-subtle)",
        borderInlineStart: `4px solid ${isTrusted ? TRUSTED_COLOR : UNTRUSTED_COLOR}`,
        borderRadius: 4,
        padding: 8,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        width: "100%",
        maxWidth: 200,
        boxSizing: "border-box",
        cursor: "pointer",
    };
});

const Header = styled.div({
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "var(--text-default)",
    fontWeight: "var(--font-weight-semibold)",
})

const Name = styled.span({
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
})

const Icon = styled.img(({size}) => {
    return {
        width: size ?? ICON_SIZE,
        height: size ?? ICON_SIZE,
        objectFit: "contain",
        flexShrink: 0,
        // borderRadius: "50%",
    }
})

const Footer = styled.div({
    fontSize: 11,
    lineHeight: "14px",
    color: "var(--text-muted)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
})

const OpenIcon = () => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" style={{flexShrink: 0}}>
        <path
            d="M14 3v2h3.6l-9.8 9.8 1.4 1.4L19 6.4V10h2V3zM5 5h6V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-6h-2v6H5z"/>
    </svg>
);

function ReactiveParent({node, protocol, icon, name, trusted, execute}: {
    node: { content: string },
    protocol: string,
    icon: string,
    name: string,
    trusted: boolean,
    execute: (url: string) => void
}) {
    const isCompact = Settings.use("compact");

    return isCompact
        ? <Tooltip text={node.content}>
            {(x) => <ProtocolMention {...x} className="mention interactive">
                <Icon size={"16px"} src={icon}/>
                <span onClick={(e) => {
                    e.preventDefault();
                    execute(node.content);
                }}>{name}</span>
            </ProtocolMention>}
        </Tooltip>
        : <ProtocolEmbed protocol={protocol} trusted={trusted} icon={icon} name={name} url={node.content}
                         execute={execute}/>
}

function ProtocolEmbed({protocol, icon, name, url, execute, trusted}) {
    return (
        <ProtocolContainer trusted={trusted} protocol={protocol} onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            execute(url);
        }}>
            <Header>
                <Icon src={icon} alt=""/>
                <Name>{name}</Name>
                <OpenIcon/>
            </Header>
            <Tooltip text={url}>
                {(props) => <Footer {...props}>{url}</Footer>}
            </Tooltip>
        </ProtocolContainer>
    );
}

function SettingsPanel() {
    return <Components.SettingGroup name="Embed Options">
        <Components.SettingItem id={"openinapp-compact"} name={"Compact Mentions"}
                                note="Use a compact mention style instead of a full embed.">
            <Components.SwitchInput defaultValue={Settings.get("compact")} onChange={v => Settings.set("compact", v)}/>
        </Components.SettingItem>
    </Components.SettingGroup>;
}

export default class OpenInApp {
    start() {
        ChangeLog();

        for (const [name, {protocol, icon, execute, trusted}] of Object.entries(Protocols)) {
            const regex = protocolRegex(protocol);

            Modules.SimpleMarkdown.defaultRules[name.toLowerCase()] = {
                order: 0,
                match: (src: string) => regex.exec(src),
                parse: (capture: RegExpExecArray) => ({content: capture[0]}),
                react: (node: { content: string }) => <ReactiveParent node={node} protocol={protocol} icon={icon}
                                                                      name={name} trusted={trusted} execute={execute}/>,
            }
        }

        Modules.SimpleMarkdown.parse = Modules.SimpleMarkdown.reactParserFor(Modules.SimpleMarkdown.defaultRules);
    }

    stop() {
        for (const name of Object.keys(Protocols)) {
            delete Modules.SimpleMarkdown.defaultRules[name.toLowerCase()];
        }
        Modules.SimpleMarkdown.parse = Modules.SimpleMarkdown.reactParserFor(Modules.SimpleMarkdown.defaultRules);
    }

    getSettingsPanel() {
        return <SettingsPanel/>
    }
}