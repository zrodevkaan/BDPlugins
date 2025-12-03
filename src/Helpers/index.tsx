/**
 * @name Helpers
 * @author Kaan
 * @version 1.0.0
 */

import type {CSSProperties} from "react";

const {React, ContextMenu} = BdApi
const {createElement, forwardRef} = React;

export function styledBase<T extends keyof React.JSX.IntrinsicElements>(
    tag: T,
    cssOrFn: CSSProperties | ((props: any) => CSSProperties) | undefined
): React.ComponentType<React.JSX.IntrinsicElements[T]> {
    return (props: any) => {
        const style = typeof cssOrFn === 'function' ? cssOrFn(props) : cssOrFn;
        return React.createElement(tag, {...props, style: {...style, ...props.style}});
    };
}

type Variants<T> = {
    [K in keyof T]: {
        [V in keyof T[K]]: CSSProperties
    }
}

export function variants<V extends Variants<any>, T extends keyof React.JSX.IntrinsicElements>(
    type: T,
    base: CSSProperties,
    variantDefs: V
) {
    return forwardRef<any, React.JSX.IntrinsicElements[T] & { [K in keyof V]?: keyof V[K] }>((props, ref) => {
        const {style, ...otherProps} = props as any;
        const styles = {...base};

        Object.keys(variantDefs).forEach(key => {
            if (props[key] && variantDefs[key]?.[props[key]]) {
                Object.assign(styles, variantDefs[key][props[key]]);
            }
        });

        return createElement(type, {
            ...otherProps,
            style: Object.assign({}, styles, style),
            ref
        });
    });
}

export const styled = new Proxy(styledBase, {
    get(target, p, receiver) {
        return (cssOrFn: CSSProperties | ((props: any) => CSSProperties) | undefined) =>
            target(p as keyof React.JSX.IntrinsicElements, cssOrFn);
    }
}) as typeof styledBase & {
    [key in keyof React.JSX.IntrinsicElements]: (
        css: React.JSX.IntrinsicElements[key]["style"] | ((props: any) => React.JSX.IntrinsicElements[key]["style"])
    ) => React.ComponentType<React.JSX.IntrinsicElements[key]>
};

type PropsBase = {
    target: HTMLElement;
    config: { context: any, onClose: () => void }
}

type Props = PropsBase & (
    | { navId: "user-context"; user: any }
    | { navId: "message"; message: any }
    | { navId: "guild-context"; guild: any }
    | { navId: "gdm-context"; channel: any }
    | { navId: "channel-context"; channel: any }
    );

interface Patches<T extends Props["navId"]> {
    navId: T;
    patch: (res: React.ReactNode, props: Extract<Props, { navId: T }>) => void;
}

export const ContextMenuHelper = <T extends Props["navId"]>(patches: Patches<T>[]) => {
    const unpatches: Function[] = []
    patches.forEach(patch => {
        const unpatch = ContextMenu.patch(patch.navId, patch.patch)
        unpatches.push(unpatch)
    })
    return () => {
        unpatches.forEach(unpatch => unpatch())
    }
}