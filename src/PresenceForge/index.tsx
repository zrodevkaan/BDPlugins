import {SettingsStore, styled} from "@helpers";
import {ActivityFlags, ActivityType, type HeadlessActivityBase, StatusDisplayType, TYPE_LABELS} from "./types.ts";

const {
    Components: {Button, Flex, SwitchInput, Modal, TextInput, SettingGroup, SettingItem},
    Webpack,
    Webpack: {Stores},
    Logger
} = new BdApi(__PLUGIN_NAME__);

const ModalActions = Webpack.getByKeys("openModal");
const Dispatcher = Webpack.getByKeys("dispatch", "subscribe", {searchExports: true});

const AssetHelpers = Webpack.getModule(Webpack.Filters.bySource("getAssetImage: size must === [number, number] for Twitch"),
    {
        map: {
            getAsset: Webpack.Filters.byStrings("APPLICATION_ASSETS_FETCH"),
        },
    }
);

async function toPresence({id, enabled, ...activity}: HeadlessActivityBase) {
    const assets = {...activity.assets};
    for (const k of ["large_image", "small_image"] as const) {
        if (assets[k]) assets[k] = (await AssetHelpers.getAsset(activity.application_id, [assets[k], undefined]))[0];
    }

    if (activity.name == null || activity.name === "") activity.name = "Custom Activity";

    const urls = activity.metadata?.button_urls ?? [];
    const buttons = (activity.buttons ?? [])
        .map((label, i) => ({label, url: urls[i]}))
        .filter((b) => b.label && b.url)
        .slice(0, 2);

    return {
        ...activity,
        assets,
        buttons: buttons.map((b) => b.label),
        metadata: {...activity.metadata, button_urls: buttons.map((b) => b.url)},
    };
}

async function setActivity(activity: HeadlessActivityBase | null) {
    if (!activity) return;
    const data = await toPresence(activity)

    Dispatcher.dispatch({
        type: "LOCAL_ACTIVITY_UPDATE",
        activity: activity ? data : null,
    });
}

interface Defaults {
    activities: HeadlessActivityBase[];
    settings: {
        startup: boolean;
    };
}

const _defaults: Defaults = {
    activities: [
        {
            id: "gay-queef-juuce",
            name: "Rocket League",
            type: ActivityType.PLAYING,
            application_id: "379286085710381999",
            platform: "desktop",
            status_display_type: StatusDisplayType.DETAILS,
            state: "In a Match",
            state_url: "https://example.com/state",
            details: "Ranked Duos: 2-1",
            details_url: "https://example.com/details",
            flags: ActivityFlags.INSTANCE | ActivityFlags.JOIN | ActivityFlags.PARTY_PRIVACY_FRIENDS,
            timestamps: {start: "1695164482423"},
            party: {id: "9dd6594e-81b3-49f6-a6b5-a679e6a060d3", size: [2, 2]},
            assets: {
                large_image: "351371005538729000",
                large_text: "DFH Stadium",
                large_url: "https://example.com/stadium",
                small_image: "351371005538729111",
                small_text: "Silver III",
                small_url: "https://example.com/rank",
                // this is only for external parties like spotify or whatever.
                // discord has an internal method to parse this.
                invite_cover_image: "mp:external/bull/shit.png",
            },
            buttons: ["View Profile", "Watch Live"],
            metadata: {button_urls: ["https://example.com/profile", "https://example.com/live"]},
            secrets: {join: "025ed05c71f639de8bfaa0d679d7c94b2fdce12f", match: "match-secret"},
            supported_platforms: ["desktop", "xbox"],
            // internal
            enabled: false,
        },
    ],
    settings: {
        startup: true,
    },
};

const _data = new SettingsStore<Defaults>(_defaults);

const ApplicationBackground = styled.div({
    backgroundColor: "var(--background-surface-high)",
    padding: "8px",
    marginBottom: "12px",
    borderRadius: "4px",
    border: "1px solid var(--border-muted)",
});

const ApplicationName = styled.div({
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--text-normal)",
});

const ApplicationDetails = styled.div({
    fontSize: "14px",
    color: "var(--text-muted)",
});

const ApplicationBackgroundPreview = styled.div({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "var(--background-base-lowest)",
    width: "auto"
});

const ApplicationPreviewImage = styled.img({
    width: "56px",
    height: "56px",
    flexShrink: 0,
    borderRadius: "8px",
    backgroundColor: "var(--background-mod-strong)",
});

const ApplicationPreviewText = styled.div({
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    flex: 1,
});

const PreviewLabel = styled.div({
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--text-normal)",
});

const FLAG_OPTIONS = [
    {label: "Instance", bit: ActivityFlags.INSTANCE},
    {label: "Join", bit: ActivityFlags.JOIN},
    {label: "Party: Friends", bit: ActivityFlags.PARTY_PRIVACY_FRIENDS},
];

const PLATFORM_OPTIONS = ["desktop", "xbox", "playstation", "ios", "android"];

const STATUS_DISPLAY = [
    {label: "Name", value: StatusDisplayType.NAME},
    {label: "State", value: StatusDisplayType.STATE},
    {label: "Details", value: StatusDisplayType.DETAILS},
];

function Checkmark() {
    return <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path
            fill="currentColor"
            d="M8.99991 16.17L4.82991 12L3.40991 13.41L8.99991 19L20.9999 7L19.5899 5.59L8.99991 16.17Z"
        />
    </svg>;
}

// discords actual chip is really horrible. so remake it using blurple because it looks better.
function Chip({label, on, onClick}: { label: string, on: boolean, onClick: () => void }) {
    const [hover, setHover] = React.useState(false);
    const [focus, setFocus] = React.useState(false);

    const background = on
        ? "var(--brand-500, #5865f2)"
        : hover ? "var(--background-mod-normal)" : "var(--background-mod-subtle)";

    return (
        <div
            role="checkbox"
            aria-checked={on}
            tabIndex={0}
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            // focus lock.
            onFocus={(e) => setFocus(e.currentTarget.matches(":focus-visible"))}
            onBlur={() => setFocus(false)}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 12px",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "20px",
                borderRadius: "8px",
                cursor: "pointer",
                userSelect: "none",
                color: on ? "#fff" : hover ? "var(--text-default)" : "var(--text-muted)",
                backgroundColor: background,
                border: `1px solid ${on ? "transparent" : "var(--border-normal, var(--border-muted))"}`,
                outline: focus ? "2px solid var(--focus-primary, var(--brand-500))" : "none",
                outlineOffset: 1,
                transition: "background-color .15s ease, color .15s ease, border-color .15s ease",
            }}
        >
            {on && (<Checkmark/>)}
            {label}
        </div>
    );
}

function Section({label, children}: { label: string, children: React.ReactNode }) {
    return (
        <div style={{gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 6}}>
            <div style={{fontSize: "12px", fontWeight: 600, color: "var(--text-normal)"}}>{label}</div>
            <div style={{display: "flex", flexWrap: "wrap", gap: 6}}>{children}</div>
        </div>
    );
}

const gridStyle = {display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12} as const;

function ButtonsTab({activity, update}: TabProps) {
    const labels = activity.buttons ?? [];
    const urls = activity.metadata?.button_urls ?? [];

    const setButton = (i: number, label: string, url: string) => {
        const nextLabels = Array.from({length: 2}, (_, n) => labels[n] ?? "");
        const nextUrls = Array.from({length: 2}, (_, n) => urls[n] ?? "");
        nextLabels[i] = label;
        nextUrls[i] = url;
        update({buttons: nextLabels, metadata: {...activity.metadata, button_urls: nextUrls}});
    };

    return (
        <div style={gridStyle}>
            {[0, 1].map((i) => (
                <React.Fragment key={i}>
                    <TextWithLabel label={`Button ${i + 1} label`} value={labels[i]}
                                   onChange={(v) => setButton(i, v, urls[i] ?? "")}/>
                    <TextWithLabel label={`Button ${i + 1} URL`} value={urls[i]}
                                   onChange={(v) => setButton(i, labels[i] ?? "", v)}/>
                </React.Fragment>
            ))}
        </div>
    );
}

function PartyTab({activity, update}: TabProps) {
    const [current = 0, max = 0] = activity.party?.size ?? [];
    const setSize = (c: number, m: number) => update({party: {...activity.party, size: [c, m]}});
    const num = (v: string) => Number(v.replace(/\D/g, "")) || 0;

    return (
        <div style={gridStyle}>
            <TextWithLabel label="Current size" value={current ? String(current) : ""}
                           onChange={(v) => setSize(num(v), max)}/>
            <TextWithLabel label="Max size" value={max ? String(max) : ""}
                           onChange={(v) => setSize(current, num(v))}/>
            <TextWithLabel label="Party ID" value={activity.party?.id}
                           onChange={(id) => update({party: {...activity.party, id}})}/>
            <TextWithLabel label="Start timestamp (ms)" value={activity.timestamps?.start}
                           onChange={(start) => update({timestamps: {...activity.timestamps, start}})}/>
            <Section label="Flags">
                {FLAG_OPTIONS.map(({label, bit}) => (
                    <Chip key={label} label={label} on={((activity.flags ?? 0) & bit) !== 0}
                          onClick={() => update({flags: (activity.flags ?? 0) ^ bit})}/>
                ))}
            </Section>
        </div>
    );
}

function AdvancedTab({activity, update}: TabProps) {
    const platforms = activity.supported_platforms ?? [];
    const togglePlatform = (p: string) =>
        update({
            supported_platforms: platforms.includes(p) ? platforms.filter((x) => x !== p) : [...platforms, p],
        });

    return (
        <div style={gridStyle}>
            <TextWithLabel label="Application ID" value={activity.application_id}
                           onChange={(application_id) => update({application_id})}/>
            <TextWithLabel label="Platform" value={activity.platform} onChange={(platform) => update({platform})}/>
            <TextWithLabel label="Join secret" value={activity.secrets?.join}
                           onChange={(join) => update({secrets: {...activity.secrets, join}})}/>
            <TextWithLabel label="Match secret" value={activity.secrets?.match}
                           onChange={(match) => update({secrets: {...activity.secrets, match}})}/>
            <div style={{gridColumn: "1 / -1"}}>
                <TextWithLabel label="Invite cover image" value={activity.assets?.invite_cover_image}
                               onChange={(v) => update({assets: {...activity.assets, invite_cover_image: v}})}/>
            </div>
            <Section label="Show in status">
                {STATUS_DISPLAY.map(({label, value}) => (
                    <Chip key={label} label={label} on={activity.status_display_type === value}
                          onClick={() => update({status_display_type: value})}/>
                ))}
            </Section>
            <Section label="Supported platforms">
                {PLATFORM_OPTIONS.map((p) => (
                    <Chip key={p} label={p} on={platforms.includes(p)} onClick={() => togglePlatform(p)}/>
                ))}
            </Section>
            <Section label="Activity Type" value={activity.type}>
                {Object.entries(TYPE_LABELS).map(([type, label]) => (
                    <Chip key={type} label={label} on={activity.type === Number(type)}
                          onClick={() => update({type: Number(type)})}/>
                ))}
            </Section>
        </div>
    );
}

function Tab({label, selected, onClick}: { label: string, selected: boolean, onClick: () => void }) {
    return (
        <div
            role="tab"
            aria-selected={selected}
            tabIndex={0}
            onClick={onClick}
            style={{
                padding: "8px 12px",
                fontSize: "14px",
                fontWeight: 600,
                borderRadius: "4px",
                cursor: "pointer",
                color: selected ? "var(--text-normal)" : "var(--text-muted)",
                backgroundColor: selected ? "var(--background-mod-strong)" : "var(--background-mod-low)",
            }}
        >
            {label}
        </div>
    );
}

function Tabs({tabs, selected, onSelect}: { tabs: string[], selected: number, onSelect: (index: number) => void }) {
    return (
        <div role="tablist" style={{display: "flex", gap: 8, flexWrap: "wrap"}}>
            {tabs.map((tab, index) => (
                <Tab key={tab} label={tab} selected={index === selected} onClick={() => onSelect(index)}/>
            ))}
        </div>
    );
}

function TextWithLabel({label, value, onChange, placeholder}: {
    label: string,
    value?: string,
    onChange: (value: string) => void,
    placeholder?: string
}) {
    return (
        <Flex direction="bd-flex-vertical" align="bd-flex-align-stretch" style={{gap: 4}}>
            <div style={{fontSize: "12px", fontWeight: 600, color: "var(--text-normal)"}}>{label}</div>
            <TextInput value={value ?? ""} placeholder={placeholder} onChange={onChange}/>
        </Flex>
    );
}

type TabProps = {
    activity: HeadlessActivityBase,
    update: (patch: Partial<HeadlessActivityBase>) => void
};

function TextTab({activity, update}: TabProps) {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
        }}>
            <div style={{gridColumn: "1 / -1"}}>
                <TextWithLabel label="Name" value={activity.name} onChange={(name) => update({name})}/>
            </div>

            <TextWithLabel label="Details" value={activity.details} onChange={(details) => update({details})}/>
            <TextWithLabel label="Details URL" value={activity.details_url}
                           onChange={(details_url) => update({details_url})}/>

            <TextWithLabel label="State" value={activity.state} onChange={(state) => update({state})}/>
            <TextWithLabel label="State URL" value={activity.state_url} onChange={(state_url) => update({state_url})}/>
        </div>
    );
}

function ImageTab({activity, update}: TabProps) {
    const setAsset = (key: string, value: string) =>
        update({assets: {...activity.assets, [key]: value}});

    return (
        <Flex direction="bd-flex-vertical" align="bd-flex-align-stretch" style={{gap: 12}}>
            <TextWithLabel label="Large image" value={activity.assets?.large_image}
                           onChange={(v) => setAsset("large_image", v)}/>
            <TextWithLabel label="Large text" value={activity.assets?.large_text}
                           onChange={(v) => setAsset("large_text", v)}/>
            <TextWithLabel label="Small image" value={activity.assets?.small_image}
                           onChange={(v) => setAsset("small_image", v)}/>
            <TextWithLabel label="Small text" value={activity.assets?.small_text}
                           onChange={(v) => setAsset("small_text", v)}/>
        </Flex>
    );
}

const TAB_NAMES = ["Text", "Image", "Buttons", "Party", "Advanced"];

const IMAGE_ID = /^\d{17,20}$/;

async function resolveAssetUrl(appId?: string, image?: string): Promise<string | null> {
    if (!image) return null;
    if (/^https?:\/\//.test(image)) return image;
    if (image.startsWith("mp:")) return `https://media.discordapp.net/${image.slice(3)}`;
    if (!appId) return null;

    const [resolved] = (await AssetHelpers.getAsset(appId, [image, undefined]).catch(() => null)) ?? [];
    const value = resolved ?? (IMAGE_ID.test(image) ? image : null);

    if (!value) return null;
    if (/^https?:\/\//.test(value)) return value;
    if (IMAGE_ID.test(value)) return `https://cdn.discordapp.com/app-assets/${appId}/${value}.png`;
    return null;
}

function useAssetUrl(appId?: string, image?: string) {
    const [url, setUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        let cancelled = false;
        const timeout = setTimeout(
            () => resolveAssetUrl(appId, image).then((u) => !cancelled && setUrl(u)),
            300
        );
        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [appId, image]);

    return url;
}

function EditModal({index, props}: { index: number, props: any }) {
    const activities = _data.use("activities");
    const [draft, setDraft] = React.useState(() => activities[index]);
    const [selected, setSelected] = React.useState(0);

    const update = (patch: Partial<HeadlessActivityBase>) => setDraft((d) => ({...d, ...patch}));

    const largeUrl = useAssetUrl(draft.application_id, draft.assets?.large_image);
    const smallUrl = useAssetUrl(draft.application_id, draft.assets?.small_image);

    const app = Stores.ApplicationStore.getApplication(draft.application_id);
    const iconUrl = app?.icon
        ? `https://cdn.discordapp.com/app-icons/${app.id}/${app.icon}.png?size=240`
        : null;


    // this is very easily to fail....
    const previewUrl = largeUrl ?? smallUrl ?? iconUrl;

    return (
        <Modal {...props} title="Edit Activity" size="bd-modal-large" actions={[
            {
                label: "Save",
                color: "bd-button-color-brand",
                closeOnClick: true,
                onClick: () => {
                    _data.set("activities", activities.map((a, i) => (i === index ? draft : a)));
                    if (draft.enabled) setActivity(draft);
                },
            },
            {
                label: "Delete",
                color: "bd-button-color-red",
                closeOnClick: true,
                onClick: () => _data.set("activities", activities.filter((_, i) => i !== index)),
            },
        ]}>
            <Flex direction="bd-flex-vertical" align="bd-flex-align-stretch" style={{gap: 16}}>
                <Flex direction="bd-flex-vertical" align="bd-flex-align-stretch" style={{gap: 8}}>
                    <PreviewLabel>Live Preview</PreviewLabel>
                    <ApplicationBackgroundPreview>
                        <ApplicationPreviewImage
                            style={{
                                backgroundImage: previewUrl ? `url(${previewUrl})` : undefined,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                        <ApplicationPreviewText>
                            <ApplicationName>{draft.name}</ApplicationName>
                            <ApplicationDetails>{draft.details}</ApplicationDetails>
                            <ApplicationDetails>{TYPE_LABELS[draft.type] ?? "Custom"}</ApplicationDetails>
                        </ApplicationPreviewText>
                    </ApplicationBackgroundPreview>
                </Flex>

                <Tabs tabs={TAB_NAMES} selected={selected} onSelect={setSelected}/>

                {selected === 0 && <TextTab activity={draft} update={update}/>}
                {selected === 1 && <ImageTab activity={draft} update={update}/>}
                {selected === 2 && <ButtonsTab activity={draft} update={update}/>}
                {selected === 3 && <PartyTab activity={draft} update={update}/>}
                {selected === 4 && <AdvancedTab activity={draft} update={update}/>}
            </Flex>
            {/* Bandage fix for Modals improper actions div */}
            <div style={{height: 16}}></div>
        </Modal>
    );
}

async function exportActivities(activities: HeadlessActivityBase[]) {
    try {
        await navigator.clipboard.writeText(JSON.stringify({version: 1, activities}));
    } catch (e) {
        Logger.log("Export failed", e);
    }
}

async function importActivities(existing: HeadlessActivityBase[]) {
    try {
        const parsed = JSON.parse(await DiscordNative.clipboard.read());
        const list = Array.isArray(parsed) ? parsed : parsed?.activities;
        if (!Array.isArray(list)) return;

        const imported: HeadlessActivityBase[] = list
            .filter((a) => a && typeof a === "object" && typeof a.name === "string")
            .map((a) => ({...a, id: crypto.randomUUID(), enabled: false}));

        if (imported.length) _data.set("activities", [...existing, ...imported]);
    } catch (e) {
        Logger.log("Import failed", e);
    }
}

function SettingsPanel() {
    const activities = _data.use("activities");

    const update = (index: number, patch: Partial<HeadlessActivityBase>) =>
        _data.set("activities", activities.map((a, i) => (i === index ? {...a, ...patch} : a)));

    return (
        <>
            <SettingGroup name={"Settings"} id={"cheese"} collapsible={true} shown={false}>
                <SettingItem name={"Startup"}
                             note={"Start rich presence on plugin startup\n\nIf this is disabled, you'll need to manually enable it each time"}
                             id={"startup"}>
                    <SwitchInput value={_data.get("settings").startup}
                                 onChange={(v) => _data.set("settings", {startup: v})}/>
                </SettingItem>
            </SettingGroup>
            {activities.map((activity, index) => (
                <ApplicationBackground key={activity.id}>
                    <Flex
                        direction="bd-flex-horizontal"
                        justify="bd-flex-justify-between"
                        align="bd-flex-align-center"
                    >
                        <ApplicationName>{activity.name}</ApplicationName>

                        <div style={{display: "flex", alignItems: "center", gap: 12, marginLeft: "auto"}}>
                            <Button
                                size="bd-button-small"
                                onClick={() => ModalActions.openModal((props) => <EditModal props={props}
                                                                                            index={index}/>)}
                            >
                                Edit
                            </Button>
                            <ApplicationDetails>{TYPE_LABELS[activity.type] ?? "Custom"}</ApplicationDetails>
                            <SwitchInput
                                value={activity.enabled ?? false}
                                onChange={(value) => {
                                    update(index, {enabled: value});
                                    setActivity(value ? {...activity, enabled: true} : null);
                                }}
                            />
                        </div>
                    </Flex>
                </ApplicationBackground>
            ))}
            <Flex
                direction="bd-flex-horizontal"
                justify="bd-flex-justify-center"
                align="bd-flex-align-center"
                style={{gap: 8, marginBottom: 12}}
            >
                <Button size="bd-button-small" onClick={() => importActivities(activities)}>
                    Import
                </Button>
                <Button size="bd-button-small" onClick={() => exportActivities(activities)}>
                    Export
                </Button>
                <Button size={"bd-button-small"} onClick={() => {
                    _data.push("activities", {
                        id: crypto.randomUUID(),
                        name: "New Activity",
                        type: ActivityType.PLAYING,
                        application_id: "379286085710381999",
                        platform: "desktop",
                        enabled: false,
                    });
                }}>
                    Add New
                </Button>
            </Flex>
            <ApplicationDetails>
                This pulls the activities from your clipboard and adds them to the list. Make sure the clipboard
                contains a valid JSON array of activities or an object with an "activities" property.
            </ApplicationDetails>
        </>
    );
}

export default class _ {
    start() {
        _data.get("settings").startup && setActivity(Object.values(_data.get("activities")).find((a) => a.enabled) ?? null);
    }

    stop() {
        setActivity(null);
    }

    getSettingsPanel() {
        return <SettingsPanel/>;
    }
}