import {ContextMenu, ProfileModalHelpers, ReactUtils, Webpack} from "./shared.ts";
import {
    CopyIcon,
    DownloadIcon,
    generateFaviconURL,
    InfoIcon,
    LensKitIcon,
    LinkIcon,
    OpenIcon,
    SearchIcon
} from "./ui/icons.tsx";
import type {User} from "discord-types/general";
import {MenuItemLabel} from "./utils";
import type {ImageData} from "./types";

function pushIntoProps(res, item) {
    const children = Array.isArray(res.props.children)
        ? res.props.children
        : res.props.children.props.children;

    if (children.some(c => c?.props?.id === item.props.id)) return;

    children.push(item);
}

function makeItem(x: {
    action?: () => void,
    label: string | React.ReactNode,
    id?: string,
    children?: React.FunctionComponent[],
    icon?: React.FC,
    disabled?: boolean,
}): any {
    const id = x.id ?? `lenskit-${String(x.icon)}-${typeof x.label === "string" ? x.label : Math.random()}`;

    const extraProps = x.icon
        ? {leadingAccessory: {type: "icon", icon: () => <x.icon/>}}
        : {};

    return x.children
        ? <ContextMenu.Item {...extraProps} {...x} key={id} id={id}>{x.children}</ContextMenu.Item>
        : <ContextMenu.Item {...extraProps} {...x} key={id} id={id}/>;
}

function copy(x: string) {
    return window.navigator.clipboard.writeText(x);
}

function assetExt(hash: string) {
    return hash?.startsWith("a_") ? "gif" : "png";
}

function getGuildMember(guildId: string, userId: string) {
    return guildId ? Webpack.Stores.GuildMemberStore.getMember(guildId, userId) : null;
}

function getBannerUrl(user: User, guildId: string) {
    const member = getGuildMember(guildId, user.id);
    if (member?.banner) return `https://cdn.discordapp.com/guilds/${guildId}/users/${user.id}/banners/${member.banner}.${assetExt(member.banner)}?size=4096`;
    if (user.banner) return `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${assetExt(user.banner)}?size=4096`;
    return null;
}

function parseDataId(parentElement: HTMLElement) {
    const data = ReactUtils.getInternalInstance(parentElement);
    const string = data!.memoizedProps["data-list-item-id"].split("-");
    return {channelId: string[string.length - 2], messageId: string[string.length - 1]};
}

function buildMessageContext(target: HTMLElement) {
    const element = target?.closest("[class^=\"message\"]");
    if (!element) return {channelId: undefined, messageId: undefined, message: undefined};

    const {channelId, messageId} = parseDataId(element);
    return {channelId, messageId, message: Webpack.Stores.MessageStore.getMessage(channelId, messageId)};
}

function buildActionContext(props) {
    const guildId = props.channel?.guild_id ?? Webpack.Stores.SelectedGuildStore.getGuildId();

    return {
        ...props,
        ...buildMessageContext(props.target),
        guildId,
        user: props.user ? Webpack.Stores.UserStore.getUser(props.user.id) : props.user
    };
}

const REVERSE_SEARCH_ENGINES: Record<string, (url: string) => string> = {
    "Google Lens": (url) => `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(url)}`,
    "Yandex": (url) => `https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(url)}`,
    "TinEye": (url) => `https://tineye.com/search?url=${encodeURIComponent(url)}`,
    "SauceNAO": (url) => `https://saucenao.com/search.php?url=${encodeURIComponent(url)}`,
    "Bing Visual Search": u => `https://www.bing.com/images/search?q=imgurl:${encodeURIComponent(u)}&view=detailv2&iss=sbi`,
    "Trace.moe (anime)": u => `https://trace.moe/?url=${encodeURIComponent(u)}`,
    "IQDB (anime)": u => `https://iqdb.org/?url=${encodeURIComponent(u)}`,
    "ascii2d": u => `https://ascii2d.net/search/url/${encodeURIComponent(u)}`,
};

async function fetchAsBlob(url: string): Promise<Blob> {
    const res = await fetch(url, {mode: "cors"});
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    return res.blob();
}

async function copyImageToClipboard(url: string) {
    const blob = await fetchAsBlob(url);
    const target = blob.type === "image/png" ? blob : await convertToPng(blob);
    await navigator.clipboard.write([new ClipboardItem({[target.type]: target})]);
}

function convertToPng(blob: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objUrl = URL.createObjectURL(blob);
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            canvas.getContext("2d")!.drawImage(img, 0, 0);
            canvas.toBlob(b => {
                URL.revokeObjectURL(objUrl);
                b ? resolve(b) : reject(new Error("canvas.toBlob returned null"));
            }, "image/png");
        };
        img.onerror = reject;
        img.src = objUrl;
    });
}

async function downloadImage(url: string) {
    const blob = await fetchAsBlob(url);
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = url.split("/").pop()?.split("?")[0] || "image";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
}

const LensKitActions = {
    "Avatar": {
        error: "avatar!",
        condition: (props: { user: User }) => !props.user.getAvatarURL(null, 4096).startsWith("/asset"),
        children: [
            {
                label: "Copy Link",
                action: (props: { user: User, guildId: string }) => copy(props.user.getAvatarURL(props.guildId, 4096))
            },
            {
                label: "Open Image",
                action: (props: { user: User, guildId: string }) => ProfileModalHelpers.openProfilePicture({
                    user: props.user,
                    guildId: props.guildId
                }, true)
            }
        ]
    },
    "Banner": {
        error: "banner!",
        condition: (props: { user: User, guildId: string }) => !!getBannerUrl(props.user, props.guildId),
        children: [
            {
                label: "Copy Link",
                action: (props: { user: User, guildId: string }) => copy(getBannerUrl(props.user, props.guildId))
            },
            {
                label: "Open Image",
                action: (props: { user: User, guildId: string }) => ProfileModalHelpers.openProfilePicture({
                    user: props.user,
                    guildId: props.guildId,
                    alt: "lenskit_secret"
                }, true)
            }
        ]
    }
};

// gifFavoriteButton

function buildImageInfoMenu(imageProps: ImageData) {
    const rows: [string, string][] = [
        ["Dimensions", `${imageProps.width} × ${imageProps.height}`],
        ["Animated", imageProps.srcIsAnimated ? "Yes" : "No"],
    ];

    return makeItem({
        id: "lenskit-image-info",
        label: `${imageProps.alt == undefined ? "Image" : imageProps.alt.toUpperCase()} Info`,
        icon: InfoIcon,
        children: rows.map(([title, subtext]) =>
            makeItem({
                id: `lenskit-info-${title.toLowerCase().replace(/\s+/g, "-")}`,
                action: () => copy(subtext),
                label: <MenuItemLabel title={title} subtext={subtext}/>
            })
        )
    });
}

function buildReverseSearchMenu(link: string) {
    return makeItem({
        id: "lenskit-reverse-search",
        label: "Reverse Image Search",
        icon: SearchIcon,
        children: Object.entries(REVERSE_SEARCH_ENGINES).map(([name, buildUrl]) =>
            makeItem({
                label: name,
                icon: () => {
                    const decodedLink = buildUrl(link);
                    const _link = decodedLink.match(/https:\/\/(.*\/)/);
                    return <img src={generateFaviconURL(_link[1])}/>
                },
                action: () => window.open(buildUrl(link), "_blank")
            })
        )
    });
}

function buildClipboardMenu(link: string, imageProps: ImageData) {
    const hasDistinctOriginal = imageProps.original && imageProps.original !== imageProps.src;

    return makeItem({
        id: "lenskit-clipboard",
        label: "Copy",
        icon: CopyIcon,
        children: [
            makeItem({
                label: "Link",
                icon: LinkIcon,
                action: () => copy(link)
            }),
            ...(hasDistinctOriginal ? [
                makeItem({
                    label: "Original Link",
                    icon: LinkIcon,
                    action: () => copy(imageProps.original)
                })
            ] : []),
            makeItem({
                label: "Image",
                icon: CopyIcon,
                action: async () => {
                    await copyImageToClipboard(link);
                }
            }),
        ]
    });
}

export default {
    "lenskit": [{
        func: (res, props) => {
            const imageProps: ImageData = res.props.imageProps;

            function menu() {
                const link = imageProps.original || imageProps.src;

                return makeItem({
                    label: "LensKit",
                    icon: LensKitIcon,
                    children: [
                        buildImageInfoMenu(imageProps),
                        <ContextMenu.Separator key="lenskit-sep-1"/>,
                        buildReverseSearchMenu(link),
                        buildClipboardMenu(link, imageProps),
                        <ContextMenu.Separator key="lenskit-sep-2"/>,
                        makeItem({
                            label: "Open in Browser",
                            icon: OpenIcon,
                            action: () => window.open(link, "_blank")
                        }),
                        makeItem({
                            label: "Download",
                            icon: DownloadIcon,
                            action: async () => {
                                await downloadImage(link);
                            }
                        })
                    ]
                });
            }

            Object.defineProperty(res.props, "children", {value: []});

            const item = menu();
            if (item) pushIntoProps(res, item);
        }
    }],

    "user-context": [
        {
            func: (res, props) => {
                function menu() {
                    const context = buildActionContext(props);

                    const submenuItems = Object.entries(LensKitActions)
                        .map(([menuLabel, value]) => {
                            const enabled = value.condition(context);

                            return makeItem({
                                disabled: !enabled,
                                label: !enabled ?
                                    <MenuItemLabel title={menuLabel} subtext={`No valid ${value.error}`}/> : menuLabel,
                                children: enabled
                                    ? value.children.map(child =>
                                        makeItem({
                                            label: child.label,
                                            action: () => child.action(context)
                                        })
                                    )
                                    : undefined
                            });
                        });

                    if (submenuItems.length === 0) return null;

                    return makeItem({
                        label: "LensKit",
                        icon: LensKitIcon,
                        children: submenuItems
                    });
                }

                const item = menu();
                if (item) pushIntoProps(res, item);
            }
        }
    ]
}