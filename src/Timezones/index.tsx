/**
 * @name Timezones
 * @author Kaan
 * @version 2.0.0
 * @description Allows you to display a local timezone you set for a user.
 */
import type { User } from "discord-types/general";
import { ContextMenuHelper, styled } from "../Helpers";

const { Patcher, Webpack, Data, Utils, Hooks, ContextMenu, Components, React } = new BdApi("Timezones")
const Banner_3 = Webpack.getBySource(".unsafe_rawColors.PRIMARY_800).hex(),") // displayProfile, canAnimate: pendingBanner
const ModalUtils = Webpack.getByKeys("openModal")
const Modal = Webpack.getByKeys("Modal").Modal
const SearchableSelect = Webpack.getModule(Webpack.Filters.byStrings('SearchableSelect', 'fieldProps'), { searchExports: true })
const MessageHeader = Webpack.getModule((x) => String(x.A).includes(".colorRoleId?nul"));
const TimestampHeader = Webpack.getBySource('.SENT_BY_SOCIAL_LAYER_INTEGRATION)?').Ay
const Selectable = Webpack.getModule(Webpack.Filters.byStrings('data-mana-component":"select'), { searchExports: true })

function getTimezones() {
    const now = new Date();
    return Intl.supportedValuesOf('timeZone').map(tz => ({
        timezone: tz,
        currentTime: now.toLocaleString('en-US', {
            timeZone: tz,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }),
        offset: new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            timeZoneName: 'short'
        }).formatToParts(now).find(p => p.type === 'timeZoneName')?.value || ''
    }));
}

type ChatTimezoneDisplay = "CLOCK" | "TEXT" | "NONE";
type BannerTimezoneDisplay = "ENABLED" | "DISABLED";
type TimezoneFormat = "12H" | "24H";

interface TimezoneSettings {
    chatTimezoneDisplay: ChatTimezoneDisplay;
    bannerTimezoneDisplay: BannerTimezoneDisplay;
    timezoneFormat: TimezoneFormat;
    showSeconds: boolean;
    showTimezoneAbbreviation: boolean;
}

const UserTimezoneStore = new class UTS extends Utils.Store {
    private timezones: Record<string, string> = Data.load('timezones') || {};
    private settings: TimezoneSettings = {
        chatTimezoneDisplay: "CLOCK",
        bannerTimezoneDisplay: "ENABLED",
        timezoneFormat: "12H",
        showSeconds: false,
        showTimezoneAbbreviation: false,
        ...(Data.load('settings') || {})
    };

    addTimezone(id: string, timezoneName: string) {
        this.timezones[id] = timezoneName;
        Data.save('timezones', this.timezones);
        this.emitChange();
    }

    getTimezone(id: string) {
        return this.timezones[id];
    }

    removeTimezone(id: string) {
        delete this.timezones[id];
        Data.save('timezones', this.timezones);
        this.emitChange();
    }

    setTimezoneSettings(settings: Partial<TimezoneSettings>) {
        this.settings = { ...this.settings, ...settings };
        Data.save('settings', this.settings);
        this.emitChange();
    }

    getTimezoneSettings(): TimezoneSettings {
        return this.settings;
    }
}

const TimezoneOption = styled.div(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: '8px'
}));

const TimezoneName = styled.span(() => ({
    fontWeight: '500',
    flex: '1'
}));

const TimezoneInfo = styled.span(() => ({
    color: 'var(--text-muted)',
    fontSize: '0.875em',
    whiteSpace: 'nowrap'
}));

const TimezoneChat = styled.span(() => ({
    color: "var(--chat-text-muted)",
    fontSize: ".75rem",
    lineHeight: "1.375rem",
    verticalAlign: "baseline"
}))

const TimezoneText = styled.div(() => {
    return {
        color: 'white',
        position: 'absolute',
        padding: '5px',
        borderRadius: '5px',
        backgroundColor: 'var(--background-base-low)',
        left: '10px',
        top: '10px',
        zIndex: '999',
        textAlign: 'center',
        fontWeight: 'lighter'
    };
})

const SettingsPanelContainer = styled.div(() => ({
    minHeight: '500px',
}))

const SettingsHeaderGroup = styled.div(() => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '8px'
}))

const SettingsSection = styled.div(({displayType}) => {
    return {
        marginTop: '20px',
        alignItems: 'center',
        justifyContent: 'space-between',
        display: displayType
    }
})

const Header = styled.span(() => ({
    color: 'var(--text-strong)',
    fontFamily: 'var(--font-primary)',
    fontSize: '18px',
    fontWeight: '700',
    lineHeight: '1.25'
}))

const HeaderDescription = styled.span({
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-primary)',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '1.4'
})

function getUTCOffset(timezone) {
    const date = new Date();
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return (tzDate - utcDate) / (1000 * 60 * 60);
}

function getTimezoneDifference(timezone) {
    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const localOffset = getUTCOffset(localTimezone);
    const targetOffset = getUTCOffset(timezone);

    const diffHours = targetOffset - localOffset;

    if (diffHours === 0) {
        return "Same timezone";
    } else if (diffHours > 0) {
        return `${diffHours} hour(s) ahead`;
    } else {
        return `${Math.abs(diffHours)} hour(s) behind`;
    }
}

function getCurrentTime(timezone: string) {
    const settings = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezoneSettings());
    const use24h = settings.timezoneFormat === "24H";
    const includeSeconds = settings.showSeconds;
    
    const timeString = new Date().toLocaleString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        ...(includeSeconds && { second: '2-digit' }),
        hour12: !use24h
    });

    let formattedTime = timeString;
    
    if (!use24h) {
        formattedTime = formattedTime.replace(/^0/, '');
    }

    if (settings.showTimezoneAbbreviation) {
        const abbr = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            timeZoneName: 'short'
        }).formatToParts(new Date()).find(p => p.type === 'timeZoneName')?.value || '';
        return `${formattedTime} ${abbr}`;
    }

    return formattedTime;
}

function Timezone({ user }: { user: User }) {
    const timezone = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezone(user.id));
    const settings = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezoneSettings());
    
    if (!timezone || settings.bannerTimezoneDisplay === "DISABLED") return null;
    
    const time = getCurrentTime(timezone);

    return <TimezoneText color={'var(--text-default)'}>{time}</TimezoneText>;
}

function returnSpoof(timezone: string, offset: string, time: string) {
    return {
        trim() { return `${timezone} ${offset} ${time}` },
        getTime() { return timezone },
        toString() { return this.getTime() + " " + offset } // this is what discord is searching for, so to allow timezone and utc offset we need to add both.
    }
}

function TimezoneModal({ user }: { user: User }) {
    const timezone = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezone(user.id));
    const timezones = React.useMemo(() => getTimezones(), []);

    const node = (timezone: string, offset: string, time: string) => {
        const timeDiff = getTimezoneDifference(timezone);
        return (
            <TimezoneOption>
                <TimezoneName>{timezone}</TimezoneName>
                <TimezoneInfo>{offset} • {timeDiff}</TimezoneInfo>
            </TimezoneOption>
        );
    };

    const renderTimezone = (tz: string, offset: string, time: string) => {
        return Object.assign(node(tz, offset, time), returnSpoof(tz, offset, time));
    };

    return (
        <div>
            <SearchableSelect
                value={timezone || "Unknown"}
                onChange={(e) => UserTimezoneStore.addTimezone(user.id, e)}
                options={timezones.map((x) => {
                    return {
                        label: renderTimezone(x.timezone, x.offset, x.currentTime),
                        value: `${x.timezone}`
                    };
                })}
            />
        </div>
    );
}

const Clock = () => <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
    <path fill="var(--interactive-icon-default)"
        d="M13 12.175V9q0-.425-.288-.712T12 8t-.712.288T11 9v3.575q0 .2.075.388t.225.337l2.525 2.525q.3.3.713.3t.712-.3q.275-.3.275-.712t-.275-.688zM12 6q.425 0 .713-.288T13 5t-.288-.712T12 4t-.712.288T11 5t.288.713T12 6m6 6q0 .425.288.713T19 13t.713-.288T20 12t-.288-.712T19 11t-.712.288T18 12m-6 6q-.425 0-.712.288T11 19t.288.713T12 20t.713-.288T13 19t-.288-.712T12 18m-6-6q0-.425-.288-.712T5 11t-.712.288T4 12t.288.713T5 13t.713-.288T6 12m6 10q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"></path>
</svg>

function ChatClock({ user }: { user: User }) {
    const timezone = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezone(user.id));
    const settings = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezoneSettings());
    const displayMode: ChatTimezoneDisplay = settings?.chatTimezoneDisplay ?? "CLOCK";

    if (!timezone || displayMode === "NONE") return null;

    const time = getCurrentTime(timezone);

    return displayMode === "CLOCK"
        ? <Components.Tooltip text={time}>
            {(props) => {
                return <div {...props} style={{ display: 'inline-flex', marginLeft: '5px', marginTop: '4px', verticalAlign: 'top' }}>
                    <Clock />
                </div>
            }}
        </Components.Tooltip>
        : <TimezoneChat> • {time}</TimezoneChat>
}

function TimezoneContextMenu({ user }: { user: User }) {
    const isDisabled = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezone(user.id));

    return <ContextMenu.Item id={"bwah"} label={"Timezones"}>
        <ContextMenu.Item action={() => {
            ModalUtils.openModal((props) => <Modal title={`Set Timezone for ${user.username}`} {...props}>
                <TimezoneModal user={user} />
            </Modal>)
        }} id={"bwah-1"} label={"Set Timezone"}></ContextMenu.Item>
        <ContextMenu.Item action={() => {
            UserTimezoneStore.removeTimezone(user.id);
        }} id={"bwah-2"} disabled={!isDisabled} color={"danger"} label={"Clear Timezone"}></ContextMenu.Item>
    </ContextMenu.Item>
}

export default class Timezones {
    private unpatchAll;
    private modifiedTypes = new WeakMap();

    start() {
        Patcher.after(Banner_3, "A", (a, b, res) => {
            return [<Timezone user={b[0].user} />, res]
        })

        if (!this.modifiedTypes.has(TimestampHeader)) {
            const originalType = TimestampHeader.type;
            const self = this;
            
            TimestampHeader.type = function (props) {
                const res = originalType.call(this, props);
                
                if (res && res.type && self.modifiedTypes) {
                    if (!self.modifiedTypes.has(res.type)) {
                        const originalInnerType = res.type;
                        
                        const newType = function (innerProps) {
                            const innerRes = originalInnerType.call(this, innerProps);
                            if (innerRes?.props?.children?.[1]?.props?.children) {
                                const children = innerRes.props.children[1].props.children;
                                const hasClock = children.some(child => child?.type === ChatClock);
                                
                                if (!hasClock) {
                                    children.push(<ChatClock user={innerProps.message.author} />);
                                }
                            }
                            return innerRes;
                        };
                        
                        self.modifiedTypes.set(originalInnerType, newType);
                        res.type = newType;
                    } else {
                        res.type = self.modifiedTypes.get(res.type);
                    }
                }
                
                return res;
            };
            
            this.modifiedTypes.set(TimestampHeader, originalType);
        }

        this.unpatchAll = ContextMenuHelper([
            {
                navId: 'user-context',
                patch: (res, props) => {
                    return res.props.children.push(TimezoneContextMenu({ user: props.user }))
                }
            }
        ])
    }

    getSettingsPanel() {
        return () => {
            const settings = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezoneSettings());

            return <SettingsPanelContainer>
                <SettingsHeaderGroup>
                    <Header>Chat timezone display</Header>
                    <HeaderDescription>
                        Choose how timezones are shown next to message timestamps.
                    </HeaderDescription>
                </SettingsHeaderGroup>
                <Selectable
                    value={settings.chatTimezoneDisplay}
                    onSelectionChange={(value: ChatTimezoneDisplay) => UserTimezoneStore.setTimezoneSettings({ chatTimezoneDisplay: value })}
                    options={["CLOCK", "TEXT", "NONE"].map(x => ({
                        label: x.toLowerCase(),
                        value: x
                    }))} />

                <SettingsSection>
                    <SettingsHeaderGroup>
                        <Header>Banner timezone display</Header>
                        <HeaderDescription>
                            Show or hide timezone on user profile banners.
                        </HeaderDescription>
                    </SettingsHeaderGroup>
                    <Selectable
                        value={settings.bannerTimezoneDisplay}
                        onSelectionChange={(value: BannerTimezoneDisplay) => UserTimezoneStore.setTimezoneSettings({ bannerTimezoneDisplay: value })}
                        options={["ENABLED", "DISABLED"].map(x => ({
                            label: x.toLowerCase(),
                            value: x
                        }))} />
                </SettingsSection>

                <SettingsSection>
                    <SettingsHeaderGroup>
                        <Header>Time format</Header>
                        <HeaderDescription>
                            Choose between 12-hour (AM/PM) or 24-hour format.
                        </HeaderDescription>
                    </SettingsHeaderGroup>
                    <Selectable
                        value={settings.timezoneFormat}
                        onSelectionChange={(value: TimezoneFormat) => UserTimezoneStore.setTimezoneSettings({ timezoneFormat: value })}
                        options={[
                            { label: "12-hour (2:30 PM)", value: "12H" },
                            { label: "24-hour (14:30)", value: "24H" }
                        ]} />
                </SettingsSection>

                <SettingsSection displayType={"flex"}>
                    <SettingsHeaderGroup>
                        <Header>Show seconds</Header>
                        <HeaderDescription>
                            Include seconds in time display (e.g., 2:30:45 PM).
                        </HeaderDescription>
                    </SettingsHeaderGroup>
                    <Components.SwitchInput
                        checked={settings.showSeconds}
                        onChange={(value) => UserTimezoneStore.setTimezoneSettings({ showSeconds: value })}
                    />
                </SettingsSection>

                <SettingsSection displayType={"flex"}>
                    <SettingsHeaderGroup>
                        <Header>Show timezone abbreviation</Header>
                        <HeaderDescription>
                            Show timezone abbreviation after time (e.g., 2:30 PM EST).
                        </HeaderDescription>
                    </SettingsHeaderGroup>
                    <Components.SwitchInput
                        checked={settings.showTimezoneAbbreviation}
                        onChange={(value) => UserTimezoneStore.setTimezoneSettings({ showTimezoneAbbreviation: value })}
                    />
                </SettingsSection>
            </SettingsPanelContainer>
        }
    }

    stop() {
        const originalType = this.modifiedTypes.get(TimestampHeader);
        if (originalType) {
            TimestampHeader.type = originalType;
        }
        
        this.modifiedTypes = new WeakMap();
        
        Patcher.unpatchAll();
        this.unpatchAll();
    }
}