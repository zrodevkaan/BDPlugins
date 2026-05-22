/**
 * @name Helpers
 * @author Kaan
 * @version 1.0.0
 */

import type {CSSProperties} from "react";

const {React, ContextMenu, Webpack, Hooks} = BdApi
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

export function getKey(module2: any, fn: (val: any) => boolean): { key: string, module: any } | undefined {
    for (var key in module2) {
        if (fn(module2[key])) {
            return { key, module: module2 };
        }
    }
}

export function proxyRecache<T>(module: any, filter: (m: any) => any, interval: number): { module: T | undefined } {
    const target: { module: T | undefined } = { module: undefined };

    const returnProxy = new Proxy(target, {
        get(t, key) {
            return Reflect.get(t, key, t);
        },
        set(t, key, value) {
            t[key as keyof typeof t] = value;
            return true;
        }
    });

    const timer = setInterval(() => {
        const result = filter(module);
        if (result !== undefined) {
            returnProxy.module = result;
            clearInterval(timer);
        }
    }, interval);

    return returnProxy;
}

export function waitAndPatch(
    Patcher: PatcherAPI,
    filter: (m: any) => boolean,
    key: string,
    callback: Parameters<typeof BdApi.Patcher.after>[2]
) {
    Webpack.waitForModule(filter).then(mod => {
        Patcher.after(mod, key, callback);
    });
}

export function findDeclaration(
    declarations: any,
    predicate: (val: any) => boolean
): { module: any; key: string } | null {
    for (const key in declarations) {
        if (predicate(declarations[key])) {
            return { key, module: declarations };
        }
    }
    return null;
}

export function getExportBySource(
    sourceString: string,
    predicate: (val: any) => boolean
): any | null {
    const raw = Webpack.getBySource(sourceString, { raw: true });
    if (!raw?.declarations) return null;
    const found = findDeclaration(raw.declarations, predicate);
    if (!found) return null;
    return found.module[found.key];
}

export async function waitForExportBySource<T>(sourceString: string, options: { declaration?: (val: any) => boolean } = {}): Promise<T | null> {
    const raw = await Webpack.waitForModule(
        Webpack.Filters.bySource(sourceString),
        { raw: true }
    );
    if (!raw?.declarations) return null;
    if (options.declaration) {
        const found = findDeclaration(raw.declarations, options.declaration);
        if (!found) return null;
        return found.module[found.key];
    }
    return raw;
}

export function getAllExportsByStrings<T extends unknown[]>(...strings: string[]): T {
    return Webpack.getBulk({ filter: Webpack.Filters.byStrings(...strings) }) as T;
}

export function getAllExportsByKeys<T extends unknown[]>(...keys: string[]): T {
    return Webpack.getBulk({ filter: Webpack.Filters.byKeys(keys) }) as T;
}

export function useStore<T>(store: any, selector: () => T): T {
    return Hooks.useStateFromStores([store], selector);
}

export function useStores<T>(stores: any[], selector: () => T): T {
    return Hooks.useStateFromStores(stores, selector);
}

export function getMangledBulk(
    locatorString: string,
    keys: Record<string, string>
): Record<string, any> {
    return Webpack.getMangled(
        locatorString,
        Object.fromEntries(
            Object.entries(keys).map(([name, match]) => [
                name,
                Webpack.Filters.byStrings(match)
            ])
        )
    );
}

export function getExportByStrings<T>(strings: string[], options: { declaration?: (val: any) => boolean } = {}): T | null {
    if (options.declaration) {
        const raw = Webpack.getBySource(strings[0], { raw: true });
        if (!raw?.declarations) return null;
        const found = findDeclaration(raw.declarations, options.declaration);
        if (!found) return null;
        return found.module[found.key];
    }
    return Webpack.getModule(Webpack.Filters.byStrings(...strings)) ?? null;
}

export function getExportByKeys<T>(keys: string[], options: { declaration?: (val: any) => boolean } = {}): T | null {
    if (options.declaration) {
        const raw = Webpack.getModule(Webpack.Filters.byKeys(keys), { raw: true });
        if (!raw?.declarations) return null;
        const found = findDeclaration(raw.declarations, options.declaration);
        if (!found) return null;
        return found.module[found.key];
    }
    return Webpack.getModule(Webpack.Filters.byKeys(keys)) ?? null;
}

export function getExportByPrototypes<T>(prototypes: string[], options: { declaration?: (val: any) => boolean } = {}): T | null {
    if (options.declaration) {
        const raw = Webpack.getModule(Webpack.Filters.byPrototypeKeys(prototypes), { raw: true });
        if (!raw?.declarations) return null;
        const found = findDeclaration(raw.declarations, options.declaration);
        if (!found) return null;
        return found.module[found.key];
    }
    return Webpack.getModule(Webpack.Filters.byPrototypeKeys(prototypes)) ?? null;
}

export function getExportByDisplayName<T>(name: string, options: { declaration?: (val: any) => boolean } = {}): T | null {
    const filter = (m: any) => m?.displayName === name;
    if (options.declaration) {
        const raw = Webpack.getModule(filter, { raw: true });
        if (!raw?.declarations) return null;
        const found = findDeclaration(raw.declarations, options.declaration);
        if (!found) return null;
        return found.module[found.key];
    }
    return Webpack.getModule(filter) ?? null;
}

export function getExportByStoreName<T>(name: string, options: { declaration?: (val: any) => boolean } = {}): T | null {
    const filter = (m: any) => m?._dispatchToken && m?.getName?.() === name;
    if (options.declaration) {
        const raw = Webpack.getModule(filter, { raw: true });
        if (!raw?.declarations) return null;
        const found = findDeclaration(raw.declarations, options.declaration);
        if (!found) return null;
        return found.module[found.key];
    }
    return Webpack.getModule(filter) ?? null;
}

export async function waitForExportByStrings<T>(strings: string[], options: { declaration?: (val: any) => boolean } = {}): Promise<T | null> {
    if (options.declaration) {
        const raw = await Webpack.waitForModule(Webpack.Filters.byStrings(...strings), { raw: true });
        if (!raw?.declarations) return null;
        const found = findDeclaration(raw.declarations, options.declaration);
        if (!found) return null;
        return found.module[found.key];
    }
    return Webpack.waitForModule(Webpack.Filters.byStrings(...strings));
}

export async function waitForExportByKeys<T>(keys: string[], options: { declaration?: (val: any) => boolean } = {}): Promise<T | null> {
    if (options.declaration) {
        const raw = await Webpack.waitForModule(Webpack.Filters.byKeys(keys), { raw: true });
        if (!raw?.declarations) return null;
        const found = findDeclaration(raw.declarations, options.declaration);
        if (!found) return null;
        return found.module[found.key];
    }
    return Webpack.waitForModule(Webpack.Filters.byKeys(keys));
}

export async function waitForExportByPrototypes<T>(prototypes: string[], options: { declaration?: (val: any) => boolean } = {}): Promise<T | null> {
    if (options.declaration) {
        const raw = await Webpack.waitForModule(Webpack.Filters.byPrototypeKeys(prototypes), { raw: true });
        if (!raw?.declarations) return null;
        const found = findDeclaration(raw.declarations, options.declaration);
        if (!found) return null;
        return found.module[found.key];
    }
    return Webpack.waitForModule(Webpack.Filters.byPrototypeKeys(prototypes));
}

export async function waitForExportByDisplayName<T>(name: string, options: { declaration?: (val: any) => boolean } = {}): Promise<T | null> {
    const filter = (m: any) => m?.displayName === name;
    if (options.declaration) {
        const raw = await Webpack.waitForModule(filter, { raw: true });
        if (!raw?.declarations) return null;
        const found = findDeclaration(raw.declarations, options.declaration);
        if (!found) return null;
        return found.module[found.key];
    }
    return Webpack.waitForModule(filter);
}

export async function waitForExportByStoreName<T>(name: string, options: { declaration?: (val: any) => boolean } = {}): Promise<T | null> {
    const filter = (m: any) => m?._dispatchToken && m?.getName?.() === name;
    if (options.declaration) {
        const raw = await Webpack.waitForModule(filter, { raw: true });
        if (!raw?.declarations) return null;
        const found = findDeclaration(raw.declarations, options.declaration);
        if (!found) return null;
        return found.module[found.key];
    }
    return Webpack.waitForModule(filter);
}