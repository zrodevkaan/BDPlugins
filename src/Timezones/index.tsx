/**
 * @name Timezones
 * @author Kaan
 * @version 1.0.0
 * @description Allows you to display a local timezone you set for a user.
 */
import type { User } from "discord-types/general";
import { ContextMenuHelper, styled } from "../Helpers";

const {Patcher, Webpack, Data, Utils, Hooks, ContextMenu, Components, React} = new BdApi("Timezones")
const Banner_3 = Webpack.getBySource(".unsafe_rawColors.PRIMARY_800).hex(),") // displayProfile, canAnimate: pendingBanner
const ModalUtils = Webpack.getByKeys("openModal")
const Modal = Webpack.getByKeys("Modal").Modal
const SearchableSelect = Webpack.getModule(Webpack.Filters.byStrings('SearchableSelect', 'fieldProps'), {searchExports: true})
const MessageHeader = Webpack.getModule((x) => String(x.A).includes(".colorRoleId?nul"));

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

const UserTimezoneStore = new class UTS extends Utils.Store {
    private timezones: Record<string, string> = Data.load('timezones') || {};

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

function getCurrentTime(timezone: string) {
    return new Date().toLocaleString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function getUTC(timezone: string) {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'shortOffset'
    });
}

function Timezone({user, displayProfile}: { user: User, displayProfile: Object }) {
    const timezone = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezone(user.id));
    const time = getCurrentTime(timezone);
    
    const formattedTime = time ? time.replace(/^0/, '') : '';
    
    return timezone ? <TimezoneText color={'var(--text-default)'}>{formattedTime}</TimezoneText> : null;
}

function returnSpoof(timezone: string, offset: string, time: string)
{
    return {
        trim() { return `${timezone} ${offset} ${time}` }, 
        getTime() {return timezone }, 
        toString() { return this.getTime() }
    }
}

function TimezoneModal({user}: { user: User }) {
    const timezone = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezone(user.id));
    const [currentTime] = React.useState(() => new Date());
    const timezones = React.useMemo(() => getTimezones(), []);
    
    return (
        <SearchableSelect 
            value={timezone || "Unknown"} 
            onChange={(e) => UserTimezoneStore.addTimezone(user.id, e)}
            options={timezones.map(x => {
                const utcFormatter = getUTC(x.timezone);
                const offset = utcFormatter.format(currentTime);
                const time = getCurrentTime(x.timezone);
                
                return {
                    label: (
                        Object.assign(<TimezoneOption>
                            <TimezoneName>{x.timezone}</TimezoneName>
                            <TimezoneInfo>{offset} • {time}</TimezoneInfo>
                        </TimezoneOption>, returnSpoof(x.timezone, offset, time))
                    ),
                    value: x.timezone
                };
            })}
        />
    );
}

const Clock = () => <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
    <path fill="var(--interactive-icon-default)"
          d="M13 12.175V9q0-.425-.288-.712T12 8t-.712.288T11 9v3.575q0 .2.075.388t.225.337l2.525 2.525q.3.3.713.3t.712-.3q.275-.3.275-.712t-.275-.688zM12 6q.425 0 .713-.288T13 5t-.288-.712T12 4t-.712.288T11 5t.288.713T12 6m6 6q0 .425.288.713T19 13t.713-.288T20 12t-.288-.712T19 11t-.712.288T18 12m-6 6q-.425 0-.712.288T11 19t.288.713T12 20t.713-.288T13 19t-.288-.712T12 18m-6-6q0-.425-.288-.712T5 11t-.712.288T4 12t.288.713T5 13t.713-.288T6 12m6 10q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"></path>
</svg>

function ChatClock({user}: { user: User }) {
    const timezone = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezone(user.authorId));
    return timezone && <Components.Tooltip text={getCurrentTime(timezone)}>
        {(props) => {
            return <div {...props} style={{display: 'inline-flex', marginLeft: '5px', marginTop: '4px', verticalAlign: 'top'}}>
                <Clock/>
            </div>
        }}
    </Components.Tooltip>
}

function TimezoneContextMenu({user}: { user: User }) {
    const isDisabled = Hooks.useStateFromStores([UserTimezoneStore], () => UserTimezoneStore.getTimezone(user.id));

    return <ContextMenu.Item id={"bwah"} label={"Timezones"}>
        <ContextMenu.Item action={() => {
            ModalUtils.openModal((props) => <Modal title={`Set Timezone for ${user.username}`} {...props}>
                <TimezoneModal user={user}/>
            </Modal>)
        }} id={"bwah-1"} label={"Set Timezone"}></ContextMenu.Item>
        <ContextMenu.Item action={() => {
            UserTimezoneStore.removeTimezone(user.id);
        }} id={"bwah-2"} disabled={!isDisabled} color={"danger"} label={"Clear Timezone"}></ContextMenu.Item>
    </ContextMenu.Item>
}

export default class Timezones {
    private unpatchAll;

    start() {
        Patcher.after(Banner_3, "A", (a, b, res) => {
            return [<Timezone user={b[0].user} displayProfile={b[0].displayProfile}/>, res]
        })

        Patcher.before(MessageHeader, "A", (a, b) => {
            !b[0].isRepliedMessage && b[0].decorations[1].push(<ChatClock user={b[0].author}/>)
        })

        this.unpatchAll = ContextMenuHelper([
            {
                navId: 'user-context',
                patch: (res, props) => {
                    return res.props.children.push(TimezoneContextMenu({user: props.user}))
                }
            }
        ])
    }

    stop() {
        Patcher.unpatchAll();
        this.unpatchAll();
    }
}