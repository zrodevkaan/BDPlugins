/**
 * @name CakeDay
 * @author Kaan
 * @version 1.0.0
 * @description Birfdays in discord
 */

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

declare const BdApi: new (pluginName: string) => BdApi;

const {Patcher, Webpack, React, Data, DOM, ContextMenu, UI, Net, Utils, Components} = new BdApi('CakeDay');

const DMAvi = Webpack.getBySource('isGDMFacepileEnabled', 'avatarDecorationSrc');
const Confetti = Webpack.getBySource("createMultipleConfettiAt:()=>[]");
const ModalRoot = Webpack.getModule(Webpack.Filters.byStrings('.ImpressionTypes.MODAL,"aria-labelledby":'), {searchExports: true});

const ConfettiContext = Object.values(Confetti).find((m: any) => typeof m === "object");
const Badges = Webpack.getBySource('action:"PRESS_BADGE"');

/*
const ModalSystem = Webpack.getMangled(".modalKey?", {
    openModalLazy: Webpack.Filters.byStrings(".modalKey?"),
    openModal: Webpack.Filters.byStrings(",instant:"),
    closeModal: Webpack.Filters.byStrings(".onCloseCallback()"),
    closeAllModals: Webpack.Filters.byStrings(".getState();for")
});
*/

function CakeWithConfetti(): React.JSX.Element {
    const {createMultipleConfettiAt} = React.use(ConfettiContext);

    return <div onMouseOver={(e: React.MouseEvent<HTMLDivElement>) => {
        const t = e.currentTarget.getBoundingClientRect();
        createMultipleConfettiAt(t.left + t.width / 2, t.top + t.height / 2);
    }}>
        <CakeSVG/>
    </div>;
}

const CakeSVG = (): React.JSX.Element => {
    return <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 1024 1024" className="icon"
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

const DataStore: DataStoreType = new Proxy({} as DataStoreType, {
    get: (_: any, key: string) => {
        return Data.load(key);
    },
    set: (_: any, key: string, value: any): boolean => {
        Data.save(key, value);
        return true;
    },
    deleteProperty: (_: any, key: string): boolean => {
        Data.delete(key);
        return true;
    },
});

const TextInput = ({user, birthday}: TextInputProps): React.JSX.Element => {
    return <div>
        <Components.TextInput
            placeholder="Date"
            value={birthday?.date}
            onChange={(e: string) => {
                birthday.date = e;
                birthday.shouldShow = true;
                DataStore.Birthdays[user.id] = birthday;
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

export default class CakeDay {
    start(): void {
        Patcher.after(Badges, "Z", (that: any, [args]: [DisplayProfileArgs], res: any) => {
            const userData = args.displayProfile;

            const birthday = DataStore.Birthdays[userData?.userId] || {};
            // somehow this is undefined. ^^
            const isBirthday = checkDate(birthday.date);

            if (isBirthday) {
                res.props.children.unshift(
                    <Components.Tooltip text="Cake Day">
                        {(data: any) => <div {...data}>
                            <CakeWithConfetti/>
                        </div>}
                    </Components.Tooltip>
                );
            }
        });

        ContextMenu.patch('user-context', this.patchUserContextMenu);
    }

    stop(): void {
        Patcher.unpatchAll();
        ContextMenu.unpatch('user-context', this.patchUserContextMenu);
    }

    private patchUserContextMenu = (res: any, args: ContextMenuArgs): void => {
        const user = args.user;
        const birthday = DataStore.Birthdays[user.id] || {};

        const ButtonGroup = ContextMenu.buildItem({
            type: 'submenu',
            label: 'Cake Day',
            items: [
                {
                    type: 'button',
                    label: 'Set Date',
                    action: () => {
                        // im lazy....
                        UI.showConfirmationModal(`Set ${user.username}'s Birthday`, <TextInput user={user} birthday={birthday}/>);
                    }
                },
                {
                    type: 'button',
                    label: 'Remove Date',
                    color: 'danger',
                    disabled: !birthday?.date,
                    action: () => {
                        delete DataStore.Birthdays[user.id];
                    }
                }
            ]
        });
        res.props.children.push(ButtonGroup);
    };
}