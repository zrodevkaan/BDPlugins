/**
 * @name CakeDay
 * @author Kaan
 * @version 1.1.3
 * @description Birfdays in discord
 */
import {findInTree, getKey, wpGetByKeys, wpGetBySource} from "@helpers";

const ModalModule = wpGetByKeys(["openModal"])
const Modal = wpGetByKeys(["Modal"]).Modal

interface BdApi {
    Patcher: any;
    Webpack: any;
    React: any;
    Data: any;
    DOM: any;
    ContextMenu: any;
    UI: any;
    Net: any;
    Utils: any;
    Components: any;
}

interface UserData {
    userId: string;
    displayProfile?: any;
}

interface Birthday {
    date?: string;
    shouldShow?: boolean;
}

interface DataStoreType {
    Birthdays: Record<string, Birthday>;

    [key: string]: any;
}

interface User {
    id: string;
    username: string;
}

interface ContextMenuArgs {
    user: User;
}

interface DisplayProfileArgs {
    displayProfile: UserData;
}

interface TextInputProps {
    user: User;
    birthday: Birthday;
}

const {Patcher, Webpack, React, Data, DOM, ContextMenu, UI, Net, Utils, Components, Hooks} = new BdApi('CakeDay');

const Confetti = Webpack.getBySource("createMultipleConfettiAt:()=>[]");

const ConfettiContext = Object.values(Confetti).find((m: any) => typeof m === "object");
const Badges = Webpack.getBySource('action:"PRESS_BADGE"');
const PrivateChannelActions = Webpack.getByKeys("openPrivateChannel")
const FetchModule = Webpack.getMangled('type:"USER_PROFILE_FETCH_START"', {fetchUser: Webpack.Filters.byStrings("USER_UPDATE", "Promise.resolve")})

const velocityConfigs = [
    {
        type: "static",
        value: {x: 120, y: -180, z: 0},
        uniformVectorValues: false
    },
    {
        type: "static-random",
        minValue: {x: -220, y: -260, z: 0},
        maxValue: {x: 220, y: -60, z: 0},
        uniformVectorValues: false
    },
    {
        type: "linear",
        value: {x: 100, y: -150, z: 0},
        addValue: {x: 0, y: 8, z: 0},
        uniformVectorValues: false
    },
    {
        type: "linear-random",
        minValue: {x: -150, y: -220, z: 0},
        maxValue: {x: 150, y: -80, z: 0},
        minAddValue: {x: -5, y: 6, z: 0},
        maxAddValue: {x: 5, y: 14, z: 0},
        uniformVectorValues: false
    },
    {
        type: "oscillating",
        value: {x: 0, y: 0, z: 0},
        start: {x: -140, y: -140, z: 0},
        final: {x: 140, y: 140, z: 0},
        duration: {x: 1400, y: 1400, z: 1400},
        direction: {x: 1, y: -1, z: 1},
        easingFunction: (t: number) => t * (2 - t),
        uniformVectorValues: false
    },
    {
        type: "oscillating-random",
        minValue: {x: -0.4, y: -0.4, z: 0},
        maxValue: {x: 0.4, y: 0.4, z: 0},
        minStart: {x: -240, y: -240, z: 0},
        maxStart: {x: 240, y: 240, z: 0},
        minFinal: {x: -240, y: -240, z: 0},
        maxFinal: {x: 240, y: 240, z: 0},
        minDuration: {x: 900, y: 1400, z: 900},
        maxDuration: {x: 1800, y: 2600, z: 1800},
        minDirection: {x: -1, y: -1, z: -1},
        maxDirection: {x: 1, y: 1, z: 1},
        easingFunctions: [
            (t: number) => Math.sin(t * Math.PI * 4) * 0.7 + 0.3,
            (t: number) => t * t * (3 - 2 * t),
            (t: number) => Math.sin(t * Math.PI * 3) * 0.4 + 0.6
        ],
        uniformVectorValues: false
    }
];

const CustomConfettiTypes = {
    heart: {
        name: "heart",
        execute: (methods: any, centerX: number, centerY: number, amount: number) => {
            const scale = 15;

            for (let i = 0; i < amount; i++) {
                const t = (i / amount) * Math.PI * 2;
                const heartX = 16 * Math.pow(Math.sin(t), 3);
                const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

                const targetX = centerX + heartX * scale;
                const targetY = centerY + heartY * scale;

                const velocityX = (targetX - centerX) * 0.1;
                const velocityY = (targetY - centerY) * 0.1;

                methods.createMultipleConfettiAt(centerX, centerY, {
                    velocity: {
                        type: "static",
                        value: {x: velocityX, y: velocityY, z: 0},
                        uniformVectorValues: false
                    }
                }, 1);
            }
        }
    },
    attempt: {
        name: "DEBUG",
        execute: (methods: any, centerX: number, centerY: number, amount: number) => {
            const radius = 15;

            for (let i = 0; i < amount; i++) {
                const t = (i / amount) * Math.PI * 2;

                const circleX = radius * (Math.cos(t) * t / 0.1);
                const circleY = radius * -(Math.sin(t) * t / 0.1);

                methods.createMultipleConfettiAt(centerX, centerY, {
                    velocity: {
                        type: "static",
                        value: {
                            x: circleX,
                            y: circleY,
                            z: 0
                        },
                        uniformVectorValues: false
                    }
                }, 1);
            }
        }
    }
};

function CakeWithConfetti({data, type, size}): React.JSX.Element {
    const Methods = React.use(ConfettiContext);

    const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
        const t = e.currentTarget.getBoundingClientRect();
        const currentType = Settings.get("confettiType") || type || 'static-random';
        const centerX = t.left + t.width / 2;
        const centerY = t.top + t.height / 2;
        const amount = Settings.get("confettiAmount") ?? 20;

        if (CustomConfettiTypes[currentType]) {
            CustomConfettiTypes[currentType].execute(Methods, centerX, centerY, amount);
        } else {
            Methods.createMultipleConfettiAt(centerX, centerY, {
                velocity: velocityConfigs.find(x => x.type === currentType) ?? velocityConfigs[3],
            }, amount);
        }
    };

    return (
        <div {...data} onMouseOver={handleMouseOver}>
            <CakeSVG size={size} {...data}/>
        </div>
    );
}

const CakeSVG = ({size}): React.JSX.Element => {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size || "16px"} height={size || "16px"}
                viewBox="0 0 1024 1024" className="icon"
                version="1.1">
        <path
            d="M90.595742 591.482946l597.480328-454.389857S933.474816 275.667884 933.474816 462.01006L90.595742 591.482946z"
            fill="#EACC53"/>
        <path d="M90.595742 591.482946V941.941707L933.474816 812.398264V461.939503z" fill="#F5AD1A"/>
        <path
            d="M90.595742 791.583821v97.298698L933.474816 759.409633v-97.369255zM468.642458 268.894371s-33.79701 127.426721 179.568663 98.215944c78.318749-12.276993 225.642665-16.863226 202.640943-98.215944-12.276993-29.140219-37.395439-53.129746-43.745608-55.458141 6.350169-12.065321 24.765658-45.509543-17.85103-64.489493-24.201199-8.043547-48.8963-11.500861-63.925033-14.393716-15.522635-6.914628-31.680287-30.48081-12.62978-51.789154-21.308344-3.457314-85.16282 2.892855-122.628815 70.204644-12.62978-1.128919-51.224695-2.328395-61.032178 21.872804-7.479088 21.308344-2.892855 37.959898 2.892854 48.33184-19.544408 3.598429-54.046992 21.167229-63.290016 45.721216z"
            fill="#F5ECDA"/>
        <path
            d="M667.049955 236.50851m-67.452904 0a67.452904 67.452904 0 1 0 134.905809 0 67.452904 67.452904 0 1 0-134.905809 0Z"
            fill="#5B2B20"/>
        <path
            d="M239.330807 519.161579m-17.85103 0a17.85103 17.85103 0 1 0 35.70206 0 17.85103 17.85103 0 1 0-35.70206 0Z"
            fill="#774621"/>
        <path
            d="M286.251499 479.790533m-17.85103 0a17.85103 17.85103 0 1 0 35.70206 0 17.85103 17.85103 0 1 0-35.70206 0Z"
            fill="#774621"/>
        <path
            d="M494.184249 483.459519m-17.851031 0a17.85103 17.85103 0 1 0 35.702061 0 17.85103 17.85103 0 1 0-35.702061 0Z"
            fill="#774621"/>
    </svg>;
};

const DataStore: DataStoreType = new class CakeStore extends Utils.Store {
    private birthdays: Record<string, Birthday> = Data.load("Birthdays") ?? {};

    get(id: string) {
        return this.birthdays[id] || {};
    }

    set(id: string, date: string) {
        this.birthdays = {...this.birthdays, [id]: date};
        Data.save("Birthdays", this.birthdays);
        this.emitChange();
    }

    del(id: string) {
        delete this.birthdays[id];
        Data.save("Birthdays", this.birthdays);
        this.emitChange();
    }

    getAll() {
        return this.birthdays;
    }
}

const Settings = new class SettingsStore extends Utils.Store {
    private settings = Data.load("settings") || {};

    get(key: string) {
        return this.settings[key]
    }

    set(key: string, value: string) {
        this.settings = {...this.settings, [key]: value};
        Data.save("settings", this.settings)
        this.emitChange();
    }

    del(key: string) {
        delete this.settings[key]
        Data.save("settings", this.settings)
    }
}

const TextInput = ({user, birthday}: TextInputProps): React.JSX.Element => {
    return <div>
        <Components.TextInput
            style={{width: "100%"}}
            placeholder="MM/DD or DD/MM — e.g. 07/28"
            value={birthday?.date}
            onChange={(e: string) => {
                birthday.date = e;
                birthday.shouldShow = true;
                DataStore.set(user.id, birthday);
            }}
        />
    </div>;
};

const checkDate = (date?: string): boolean => {
    if (!date) {
        return false;
    }

    const today = new Date();

    const birthdayDate = new Date(date);

    if (!isNaN(birthdayDate.getTime())) {
        return today.getDate() === birthdayDate.getDate() &&
            today.getMonth() === birthdayDate.getMonth();
    }

    const dateParts = date.split('/').map(Number);

    if (dateParts.length !== 2 || !dateParts[0] || !dateParts[1]) {
        return false;
    }

    const [firstPart, secondPart] = dateParts;

    const isDDMM = firstPart <= 31 && secondPart <= 12 &&
        today.getDate() === firstPart && today.getMonth() === (secondPart - 1);

    const isMMDD = firstPart <= 12 && secondPart <= 31 &&
        today.getDate() === secondPart && today.getMonth() === (firstPart - 1);

    return isDDMM || isMMDD;
};

const BirthdayListNotification = ({extraUsers, showDate}: {
    extraUsers?: User[];
    showDate: boolean
}): React.JSX.Element => {
    const allBirthdays = Hooks.useStateFromStores([DataStore], () => Object.entries(DataStore.getAll()))
    const users = extraUsers ? extraUsers.map((user) => ({user: user, id: user.id, date: ""})) : allBirthdays
        .map(([id, data]) => ({user: Webpack.Stores.UserStore.getUser(id), date: data.date, id: id}))
        .filter(Boolean);

    const [fetching, setFetching] = React.useState(() => new Set());

    return (
        <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
            {users.map(data => (
                data?.user ? <div
                    key={data.user.id}
                    style={{display: "flex", alignItems: "center", gap: "10px", cursor: "pointer"}}
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        PrivateChannelActions.getDMChannel(data.user.id).then(_ => {
                            PrivateChannelActions?.openPrivateChannel?.({recipientIds: data.user.id});
                        })
                    }}
                >
                    <img
                        src={data.user.getAvatarURL?.(undefined, 40, true)}
                        width={28}
                        height={28}
                        style={{borderRadius: "50%", flexShrink: 0}}
                    />
                    <span style={{fontSize: "14px"}}>
                        {data.user.globalName || data.user.username}
                    </span>
                    {showDate && data.date}
                </div> : <div onClick={() => {
                    if (fetching.has(data.id)) return;
                    setFetching(prev => new Set(prev).add(data.id));
                    FetchModule.fetchUser(data.id).then(() => {
                        setFetching(prev => {
                            const next = new Set(prev);
                            next.delete(data.id);
                            return next;
                        });
                    });
                }}>
                    {fetching.has(data.id) ? <Components.Spinner/> : <div>Empty user {data.id}</div>}
                </div>
            ))}
        </div>
    );
};

function reactSvgToDataUri(Component: Function, props = {}) {
    function serialize(element: any): string {
        if (!element) return "";

        if (typeof element === "string" || typeof element === "number") {
            return String(element);
        }

        const {type, props} = element;

        const attrs = Object.entries(props ?? {})
            .filter(([key, value]) =>
                key !== "children" &&
                value !== undefined &&
                value !== null &&
                typeof value !== "function"
            )
            .map(([key, value]) => {
                const attr = key === "className" ? "class" : key;
                return `${attr}="${String(value)}"`;
            })
            .join(" ");

        const children = Array.isArray(props.children)
            ? props.children.map(serialize).join("")
            : serialize(props.children);

        return `<${type}${attrs ? " " + attrs : ""}>${children}</${type}>`;
    }

    const element = Component(props);

    const svg = serialize(element);

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default class CakeDay {
    private interval: NodeJS.Timeout;

    start(): void {
        Patcher.after(Badges, "A", (that: any, [args]: [DisplayProfileArgs], res: any) => {
            const userData = args.displayProfile;

            const birthday = DataStore.get(userData?.userId) || {};
            // somehow this is undefined. ^^
            const isBirthday = checkDate(birthday.date);

            if (isBirthday) {
                res.props.children.unshift(
                    <Components.Tooltip text="Cake Day">
                        {(data: any) => <div {...data}>
                            <CakeWithConfetti {...data} type={'static-random'}/>
                        </div>}
                    </Components.Tooltip>
                );
            }
        });

        const NameAndDecorators = wpGetBySource([":null,withDisplayNameStyles:"], {raw: true})
        const ModuleWithKey = getKey(NameAndDecorators.declarations, x => String(x).includes(".FRIEND_REQUEST_ACCEPTED})"))
        const MemberList = wpGetBySource(["placement:c.u.MEMBER_LIST"])

        Patcher.after(MemberList, 'A', (that: any, [args], res: any) => {
            const Data = findInTree(args, x => x.user, {walkable: ['props', 'children', 'avatar']});
            const user = Data.user;
            const birthday = DataStore.get(user.id)
            const Location = res.props.children.props.children[1].props.children
            checkDate(birthday.date) && Location.push(<CakeWithConfetti/>)
        })

        Patcher.after(ModuleWithKey?.module, ModuleWithKey?.key, (a, b, res) => {
            const BeforeChildren = res.props.children({role: {}});
            const userData = b[0].user
            const birthday = DataStore.get(userData?.id) || {};
            if (checkDate(birthday.date)) {
                const location = findInTree(BeforeChildren, x => x?.name, {walkable: ["props", "children", "name"]})
                const decor = <span style={{paddingLeft: "10px"}}><CakeWithConfetti/></span>
                location.decorators = !Array.isArray(location.decorators) ? [decor] : location.decorators.push(decor); // PlatformIndicators support.
            }

            Patcher.after(res.props, "children", () => BeforeChildren)
            return res;
        })

        Patcher.after(Webpack.Stores.UserProfileStore, "getUserProfile", (a, b, c) => {
            // what do you mean YABDP4Nitro crashes when I call getUser in getUserProfile??

            if (c?.badges && !Object.values(c?.badges).find(x => x.id == "birthday") && checkDate(DataStore.get(b[0]).date)) {
                c.badges.push({
                    id: "birthday",
                    name: "Birthday",
                    description: <>
                        <div>Birthday</div>
                        <span
                            style={{
                                all: "revert",
                                fontFamily: "inherit",
                                font: "200 14px var(--font-display)",
                                color: "var(--interactive-text-default)",
                                textTransform: "none",
                                letterSpacing: "normal",
                            }}
                        >
                                birthday time!
                            </span>
                    </>,
                    iconSrc: reactSvgToDataUri(CakeSVG, {size: 16})
                })
            }
        })

        // Patcher.after(FetchModule, "fetchProfile", (a,b,c) => {
        //     const userId = b[0]
        //     const location = Webpack.Stores.UserProfileStore.getUserProfile(userId)
        //     const user = Webpack.Stores.UserStore.getUser(userId)
        //     const isBirthday = checkDate(DataStore.get(userId).date)
        //     console.log(location, user, isBirthday)
        //     setTimeout(() => isBirthday && location.badges.push({id: "birthday", name:"Birthday", description:`Say happy birthday to ${user.username}` , iconSrc: reactSvgToDataUri(CakeSVG, {size: 16})}), 1000)
        // })

        // Patcher.after(UsernameLocation, 'ZP', (_, __, res) => {
        //     Patcher.after(res, 'type', (_, __, res) => {
        //         const orig = res.props.children.props?.children;
        //         if (!orig) return;
        //         res.props.children.props.children = new Proxy(orig, {
        //             apply(target, thisArg, args) {
        //                 const ret = Reflect.apply(target, thisArg, args);
        //                 const found = Utils.findInTree(ret?.props?.children?.[1]?.props?.children?.[1], x => x?.to, {walkable: ['props', 'children']});
        //                 const channel = Webpack.Stores.ChannelStore.getChannel(found.to.split('/').pop())
        //                 const user = Webpack.Stores.UserStore.getUser(channel.recipients[0])
        //                 const nameProps = found?.children?.props?.name?.props;
        //
        //                 if (checkDate(DataStore.Birthdays[user.id]?.date)) {
        //                     nameProps.children = [<div style={{display: 'flex', gap: '5px'}}>
        //                         <CakeWithConfetti
        //                             type={DataStore?.confettiType || 'static-random'}/> {nameProps.children}</div>];
        //                 }
        //                 return [ret];
        //             }
        //         });
        //     });
        // });

        Webpack.Stores.UserStore._dispatcher.subscribe("HOUR", this.updateUserThatSomePersonBirthdayIsTodayLmao)
        ContextMenu.patch('user-context', this.patchUserContextMenu);

        this.interval = setInterval(() => Webpack.Stores.A._dispatcher.dispatch({type: "HOUR"}), 60 * 60 * 1000);
    }

    updateUserThatSomePersonBirthdayIsTodayLmao(): void {
        const allBirthdays = Object.entries(DataStore.getAll()).filter(([id, data]) => checkDate(data.date));

        if (!allBirthdays.length) return;

        const users = allBirthdays
            .map(([id]) => Webpack.Stores.UserStore.getUser(id))
            .filter(Boolean);

        UI.showNotification({
            id: "cakeday-batch",
            title: users.length > 1 ? `${users.length} Birthdays Today` : "Birthday",
            icon: () => <CakeWithConfetti size={"20px"}/>,
            content: <BirthdayListNotification extraUsers={users}/>,
            type: "success",
            duration: Infinity,
        });
    }

    stop(): void {
        Patcher.unpatchAll();
        Webpack.Stores.UserStore._dispatcher.unsubscribe("HOUR", this.updateUserThatSomePersonBirthdayIsTodayLmao)
        ContextMenu.unpatch('user-context', this.patchUserContextMenu);
        clearInterval(this.interval)
    }

    getSettingsPanel() {
        return () => {
            const confettiType = Hooks.useStateFromStores([Settings], () => Settings.get("confettiType")) || "linear-random";
            const confettiAmount = Hooks.useStateFromStores([Settings], () => Settings.get("confettiAmount")) || 20;
            const bypassAmount = Hooks.useStateFromStores([Settings], () => Settings.get("bypassAmount")) || false;

            const allConfettiTypes = [
                ...velocityConfigs.map((config) => ({
                    label: config.type.substring(0, 1).toUpperCase() + config.type.substring(1, config.type.length),
                    value: config.type
                })),
                ...Object.values(CustomConfettiTypes).map((customType) => ({
                    label: customType.name.substring(0, 1).toUpperCase() + customType.name.substring(1, customType.name.length),
                    value: customType.name,
                }))
            ];

            return <div>
                <Components.SettingGroup name={"Confetti Settings"}>
                    <Components.SettingItem name={"Confetti Type"}
                                            note={"Changes the behaviour of the confetti when hovering."}>
                        <Components.DropdownInput
                            value={confettiType}
                            onChange={(amt: string) => Settings.set("confettiType", amt)}
                            options={allConfettiTypes}
                        />
                    </Components.SettingItem>

                    <Components.SettingItem name={"Confetti Amount"}
                                            note={"how much bifday you want....."}>
                        <Components.SliderInput
                            min={0}
                            max={bypassAmount ? 1000 : 100}
                            step={[20]}
                            value={confettiAmount}
                            onChange={(type: string) => Settings.set("confettiAmount", type)}
                        />
                    </Components.SettingItem>

                    <Components.SettingItem
                        name={"More confett~~~~!!@@!~#@#"}
                        note={"Enabling this allows you to go from 100 confetti to 1000 confetti on the slider. \nThis can cause lag issues."}>
                        <Components.SwitchInput
                            value={bypassAmount}
                            onChange={(val: boolean) => Settings.set("bypassAmount", val)}
                        />
                    </Components.SettingItem>
                </Components.SettingGroup>
                <Components.SettingGroup name={"Birthdays"}>
                    <BirthdayListNotification showDate={true}/>
                </Components.SettingGroup>
            </div>
        }
    }

    private patchUserContextMenu = (res: any, args: ContextMenuArgs): void => {
        const user = args.user;
        const birthday = DataStore.get(user.id) || {};

        const ButtonGroup = ContextMenu.buildItem({
            type: 'submenu',
            label: 'Cake Day',
            iconLeft: CakeSVG,
            items: [
                {
                    type: 'button',
                    label: 'Set Date',
                    action: () => {
                        // im lazy....
                        ModalModule.openModal((props) => <Modal {...props}
                                                                title={`Set ${user.globalName ?? user.username}'s birthday`}>
                            <TextInput user={user}
                                       birthday={birthday}/>
                        </Modal>)
                    }
                },
                {
                    type: 'button',
                    label: 'Remove Date',
                    color: 'danger',
                    disabled: !birthday?.date,
                    action: () => {
                        DataStore.del(user.id);
                    }
                }
            ]
        });
        res.props.children.push(ButtonGroup);
    };
}