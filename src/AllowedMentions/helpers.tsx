import {BetterDiscord} from "./shared.tsx";

function pushIntoProps(res, item) {
    const children = Array.isArray(res.props.children)
        ? res.props.children
        : res.props.children.props.children;

    if (children.some(c => c?.props?.id === item.props.id)) return;

    children.push(item);
}

export function makeItem(x: {
    action?: () => void,
    label: string | React.ReactNode,
    id?: string,
    children?: React.FunctionComponent[],
    icon?: React.FC,
    disabled?: boolean,
    type?: "RadioInput",
}): any {
    const id = x.id ?? `allowedmentions-${String(x.icon)}-${typeof x.label === "string" ? x.label : Math.random()}`;

    const extraProps = x.icon
        ? {leadingAccessory: {type: "icon", icon: () => <x.icon/>}}
        : {};

    if (x.children) {
        return (
            <BetterDiscord.ContextMenu.Item {...extraProps} {...x} key={id} id={id}>
                {x.children}
            </BetterDiscord.ContextMenu.Item>
        );
    }

    if (x.type) {
        const CustomType = BetterDiscord.ContextMenu[x.type];
        return <CustomType {...extraProps} {...x} key={id} id={id}/>;
    }

    return <BetterDiscord.ContextMenu.Item {...extraProps} {...x} key={id} id={id}/>;
}

function copy(x: string) {
    return window.navigator.clipboard.writeText(x);
}