import {getKey, wpGetBulkKeyed} from "@helpers";
import {BetterDiscord} from "../Arven/shared";

export const {Webpack, Patcher, React, Data, Utils, Hooks, Net, ContextMenu, ReactUtils} = new BdApi("LensKit")

export const ProfileModalHelpers = Webpack.getMangled("user_profile_avatar", {
    openProfilePicture: x => String(x).includes("user_profile_avatar"),
    resolveUserProfilePicture: x => String(x).includes("renderWindow")
}, {raw: true, mapDeclarations: true})

export const FetchUser = getKey(Webpack.getModule(Webpack.Filters.combine(Webpack.Filters.bySource('UserProfileModalActionCreators'), Webpack.Filters.bySource('CURRENT_USER_UPDATE'))), x => String(x).includes("USER_UPDATE") && !String(x).includes("USER_PROFILE_FETCH_START") && String(x).includes('Promise.resolve'));

Patcher.instead(ProfileModalHelpers, "resolveUserProfilePicture", (_, args, __) => {
    const user = args[0].user

    const data = __(...args)
    if (data.alt === "lenskit_secret") {
        const banner = `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=4096`

        return {
            ...data,
            original: banner,
            url: banner,
            width: 2000,
        }
    }
    return data
})

const DefaultOptions = {
    options: {
        searchExports: true
    }
}

export const GlobalModules = wpGetBulkKeyed({
    Typing: {
        filter: BetterDiscord.Webpack.Filters.byKeys("startTyping")
    },
    Endpoints: {
        filter: x => x.STORE_LAYOUT && x.USER_ACTIVITY_SUBSCRIBE,
        ...DefaultOptions
    },
    Dispatcher: {
        filter: BetterDiscord.Webpack.Filters.byStoreName("UserStore"),
        // A is faster than UserStore
        ...DefaultOptions,
        options: {
            key: "_dispatcher",
        }
    },
    HTTP: {
        filter: m => typeof m === "object" && m.del && m.put,
        ...DefaultOptions
    },
    Gateway: {
        filter: BetterDiscord.Webpack.Filters.byStoreName("GatewayConnectionStore"),
    },
    Flux: {
        filter: BetterDiscord.Webpack.Filters.bySource("OfflineCacheStore"),
        options: {
            key: "Ay"
        }
    },
    Intl: {
        filter: BetterDiscord.Webpack.Filters.byKeys("intl")
    },
    ModalModule: {
        filter: BetterDiscord.Webpack.Filters.byKeys("openModal")
    },
    SimpleMarkdownWrapper: {
        filter: m => m.reactParserFor,
    },
    AssetModule: {
        filter: BetterDiscord.Webpack.Filters.bySource("ApplicationAssetUtils"),
        map: {
            getAssetImage: BetterDiscord.Webpack.Filters.byStrings(".TWITCH?null"),
            getAssetImageId: BetterDiscord.Webpack.Filters.byStrings(".serialize(t)"),
            fetchApplicationAssets: BetterDiscord.Webpack.Filters.byStrings("APPLICATION_ASSETS_UPDATE"),
            getAssetImages: BetterDiscord.Webpack.Filters.byStrings(`.startsWith("http:")`)
        }
    },
    Lodash: {
        filter: BetterDiscord.Webpack.Filters.bySource("=\"Expected a function\","),
    }
})

export const DiscordComponents = wpGetBulkKeyed({
    Header: {
        filter: BetterDiscord.Webpack.Filters.bySource(".Ay.Masks.HEADER_BAR_BADGE_BOTTOM,"),
        ...DefaultOptions,
        options: {
            key: "Ay"
        }
    },
    Modal: {
        filter: BetterDiscord.Webpack.Filters.byStrings("actionBarInputLayout"),
        options: {
            key: "a"
        }
    }
})