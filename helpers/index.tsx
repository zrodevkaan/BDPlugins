import type { CSSProperties } from "react";
export * from "./webpack";

const { Webpack, React, ContextMenu, Hooks } = BdApi;
const { createElement, forwardRef } = React;

type ModuleFilter = (m: any) => boolean;

interface ExportOptions {
    declaration?: ModuleFilter;
}

interface RawModule {
    id: number;
    declarations: Record<string, any>;
    exports: any;
}

export function styledBase<T extends keyof React.JSX.IntrinsicElements>(
    tag: T,
    cssOrFn: CSSProperties | ((props: any) => CSSProperties) | undefined
): React.ComponentType<React.JSX.IntrinsicElements[T]> {
    return (props: any) => {
        const style = typeof cssOrFn === "function" ? cssOrFn(props) : cssOrFn;
        return React.createElement(tag, { ...props, style: { ...style, ...props.style } });
    };
}

type Variants<T> = {
    [K in keyof T]: {
        [V in keyof T[K]]: CSSProperties;
    };
};

export function variants<V extends Variants<any>, T extends keyof React.JSX.IntrinsicElements>(
    type: T,
    base: CSSProperties,
    variantDefs: V
) {
    return forwardRef<any, React.JSX.IntrinsicElements[T] & { [K in keyof V]?: keyof V[K] }>((props, ref) => {
        const { style, ...otherProps } = props as any;
        const styles = { ...base };
        Object.keys(variantDefs).forEach(key => {
            if (props[key] && variantDefs[key]?.[props[key]]) {
                Object.assign(styles, variantDefs[key][props[key]]);
            }
        });
        return createElement(type, {
            ...otherProps,
            style: Object.assign({}, styles, style),
            ref,
        });
    });
}

export const styled = new Proxy(styledBase, {
    get(target, p) {
        return (cssOrFn: CSSProperties | ((props: any) => CSSProperties) | undefined) =>
            target(p as keyof React.JSX.IntrinsicElements, cssOrFn);
    },
}) as typeof styledBase & {
    [key in keyof React.JSX.IntrinsicElements]: (
        css:
            | React.JSX.IntrinsicElements[key]["style"]
            | ((props: any) => React.JSX.IntrinsicElements[key]["style"])
    ) => React.ComponentType<React.JSX.IntrinsicElements[key]>;
};

type PropsBase = {
    target: HTMLElement;
    config: { context: any; onClose: () => void };
};

type Props = PropsBase &
    (
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
    const unpatches: Function[] = [];
    patches.forEach(patch => {
        unpatches.push(ContextMenu.patch(patch.navId, patch.patch));
    });
    return () => unpatches.forEach(unpatch => unpatch());
};

export function getKey(module: any, fn: (val: any) => boolean): { key: string; module: any } | undefined {
    for (const key in module) {
        if (fn(module[key])) return { key, module };
    }
}

export function waitAndPatch(
    Patcher: PatcherAPI,
    filter: ModuleFilter,
    key: string,
    callback: Parameters<typeof BdApi.Patcher.after>[2]
) {
    Webpack.waitForModule(filter).then(mod => Patcher.after(mod, key, callback));
}

export function useStore<T>(store: any, selector: () => T): T {
    return Hooks.useStateFromStores([store], selector);
}

export function useStores<T>(stores: any[], selector: () => T): T {
    return Hooks.useStateFromStores(stores, selector);
}

export function proxyRecache() {
    return void 0;
}


export function findDeclaration(
    declarations: Record<string, any>,
    predicate: ModuleFilter
): { module: Record<string, any>; key: string } | null {
    for (const key in declarations) {
        if (predicate(declarations[key])) return { key, module: declarations };
    }
    return null;
}

export function findAllDeclarations(
    declarations: Record<string, any>,
    predicate: ModuleFilter
): Array<{ module: Record<string, any>; key: string }> {
    const results: Array<{ module: Record<string, any>; key: string }> = [];
    for (const key in declarations) {
        if (predicate(declarations[key])) results.push({ key, module: declarations });
    }
    return results;
}

function resolveFromRaw(raw: RawModule | null | undefined, declaration?: ModuleFilter): any | null {
    if (!raw?.declarations) return null;
    const found = findDeclaration(raw.declarations, declaration!);
    return found ? found.module[found.key] : null;
}


export function getExportByFilter<T>(filter: ModuleFilter, options: ExportOptions = {}): T | null {
    if (options.declaration)
        return resolveFromRaw(Webpack.getModule(filter, { raw: true }) as RawModule, options.declaration);
    return Webpack.getModule(filter) ?? null;
}

export function getExportByStrings<T>(strings: string[], options: ExportOptions = {}): T | null {
    return getExportByFilter<T>(Webpack.Filters.byStrings(...strings), options);
}

export function getExportByKeys<T>(keys: string[], options: ExportOptions = {}): T | null {
    return getExportByFilter<T>(Webpack.Filters.byKeys(keys), options);
}

export function getExportByPrototypes<T>(prototypes: string[], options: ExportOptions = {}): T | null {
    return getExportByFilter<T>(Webpack.Filters.byPrototypeKeys(prototypes), options);
}

export function getExportBySource<T>(source: string, options: ExportOptions = {}): T | null {
    const raw = Webpack.getBySource(source, { raw: true }) as RawModule | null;
    if (!raw) return null;
    if (options.declaration) return resolveFromRaw(raw, options.declaration);
    return raw.exports ?? null;
}

export function getExportByDisplayName<T>(name: string, options: ExportOptions = {}): T | null {
    return getExportByFilter<T>((m: any) => m?.displayName === name, options);
}

export function getExportByStoreName<T>(name: string, options: ExportOptions = {}): T | null {
    return getExportByFilter<T>((m: any) => m?._dispatchToken && m?.getName?.() === name, options);
}

export function getExportByType<T>(ctor: abstract new (...args: any[]) => T, options: ExportOptions = {}): T | null {
    return getExportByFilter<T>((m: any) => m instanceof ctor, options);
}

export function getExportByTypeString<T>(match: string | RegExp, options: ExportOptions = {}): T | null {
    const test = typeof match === "string" ? (s: string) => s.includes(match) : (s: string) => match.test(s);
    return getExportByFilter<T>((m: any) => {
        try { return typeof m === "function" && test(Function.prototype.toString.call(m)); }
        catch { return false; }
    }, options);
}


export async function waitForExportByFilter<T>(filter: ModuleFilter, options: ExportOptions = {}): Promise<T | null> {
    if (options.declaration) {
        const raw = await Webpack.waitForModule(filter, { raw: true }) as RawModule;
        return resolveFromRaw(raw, options.declaration);
    }
    return Webpack.waitForModule(filter);
}

export async function waitForExportByStrings<T>(strings: string[], options: ExportOptions = {}): Promise<T | null> {
    return waitForExportByFilter<T>(Webpack.Filters.byStrings(...strings), options);
}

export async function waitForExportByKeys<T>(keys: string[], options: ExportOptions = {}): Promise<T | null> {
    return waitForExportByFilter<T>(Webpack.Filters.byKeys(keys), options);
}

export async function waitForExportByPrototypes<T>(prototypes: string[], options: ExportOptions = {}): Promise<T | null> {
    return waitForExportByFilter<T>(Webpack.Filters.byPrototypeKeys(prototypes), options);
}

export async function waitForExportBySource<T>(source: string, options: ExportOptions = {}): Promise<T | null> {
    const raw = await Webpack.waitForModule(Webpack.Filters.bySource(source), { raw: true }) as RawModule | null;
    if (!raw) return null;
    if (options.declaration) return resolveFromRaw(raw, options.declaration);
    return raw.exports ?? null;
}

export async function waitForExportByDisplayName<T>(name: string, options: ExportOptions = {}): Promise<T | null> {
    return waitForExportByFilter<T>((m: any) => m?.displayName === name, options);
}

export async function waitForExportByStoreName<T>(name: string, options: ExportOptions = {}): Promise<T | null> {
    return waitForExportByFilter<T>((m: any) => m?._dispatchToken && m?.getName?.() === name, options);
}


export function waitForAllExports<T extends readonly Promise<any>[]>(
    ...promises: [...T]
): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
    return Promise.all(promises) as any;
}

type BulkQuery =
    | { filter: ModuleFilter; options?: ExportOptions }
    | { strings: string[]; options?: ExportOptions }
    | { keys: string[]; options?: ExportOptions }
    | { prototypes: string[]; options?: ExportOptions }
    | { source: string; options?: ExportOptions };

function resolveBulkQuery(query: BulkQuery): Promise<any> {
    if ("filter" in query) return waitForExportByFilter(query.filter, query.options);
    if ("strings" in query) return waitForExportByStrings(query.strings, query.options);
    if ("keys" in query) return waitForExportByKeys(query.keys, query.options);
    if ("prototypes" in query) return waitForExportByPrototypes(query.prototypes, query.options);
    return waitForExportBySource(query.source, query.options);
}

export async function waitForBulk<T extends BulkQuery[]>(
    ...queries: [...T]
): Promise<{ [K in keyof T]: any }> {
    return Promise.all(queries.map(resolveBulkQuery)) as any;
}

export async function waitForMangledExports<T extends Record<string, any>>(
    locator: string,
    mappers: { [K in keyof T]: ModuleFilter }
): Promise<T> {
    await Webpack.waitForModule(Webpack.Filters.bySource(locator));
    return Webpack.getMangled(locator, mappers) as T;
}

export async function waitForMangledBulk<T extends Record<string, any>>(
    locator: string,
    snippets: { [K in keyof T]: string }
): Promise<T> {
    const mappers = Object.fromEntries(
        Object.entries(snippets).map(([k, v]) => [k, Webpack.Filters.byStrings(v as string)])
    ) as { [K in keyof T]: ModuleFilter };
    return waitForMangledExports<T>(locator, mappers);
}


export function getMangledExports<T extends Record<string, any>>(
    locator: string,
    mappers: { [K in keyof T]: ModuleFilter }
): T {
    return Webpack.getMangled(locator, mappers) as T;
}

export function getMangledBulk<T extends Record<string, any>>(
    locator: string,
    snippets: { [K in keyof T]: string }
): T {
    const mappers = Object.fromEntries(
        Object.entries(snippets).map(([k, v]) => [k, Webpack.Filters.byStrings(v as string)])
    ) as { [K in keyof T]: ModuleFilter };
    return getMangledExports<T>(locator, mappers);
}


export function getAllDeclarationExports<T>(source: string, predicate: ModuleFilter): T[] {
    const raw = Webpack.getBySource(source, { raw: true }) as RawModule | null;
    if (!raw?.declarations) return [];
    return findAllDeclarations(raw.declarations, predicate).map(({ module, key }) => module[key] as T);
}

export function combineFilters(...filters: ModuleFilter[]): ModuleFilter {
    return (m: any) => filters.every(f => f(m));
}

export function anyFilter(...filters: ModuleFilter[]): ModuleFilter {
    return (m: any) => filters.some(f => f(m));
}

export function lazyExport<T extends object>(getter: () => T | null): T {
    let cached: T | null = null;
    return new Proxy({} as T, {
        get(_, key) {
            cached ??= getter();
            return cached ? (cached as any)[key] : undefined;
        },
        set(_, key, value) {
            cached ??= getter();
            if (cached) (cached as any)[key] = value;
            return true;
        },
        has(_, key) {
            cached ??= getter();
            return cached ? key in cached : false;
        },
    });
}


type TreePredicate = (node: any) => boolean;

interface WalkOptions {
    walkable?: string[];
    ignore?: string[];
    maxDepth?: number;
}

export function findInTree(
    tree: any,
    predicate: TreePredicate,
    { walkable = [], ignore = [], maxDepth = 100 }: WalkOptions = {}
): any | null {
    function walk(node: any, depth: number): any | null {
        if (!node || typeof node !== "object" || depth > maxDepth) return null;
        if (predicate(node)) return node;
        const keys = walkable.length
            ? walkable.filter(k => k in node)
            : Object.keys(node).filter(k => !ignore.includes(k));
        for (const key of keys) {
            const child = node[key];
            if (Array.isArray(child)) {
                for (const item of child) {
                    const result = walk(item, depth + 1);
                    if (result !== null) return result;
                }
            } else {
                const result = walk(child, depth + 1);
                if (result !== null) return result;
            }
        }
        return null;
    }
    return walk(tree, 0);
}

export function findAllInTree(
    tree: any,
    predicate: TreePredicate,
    { walkable = [], ignore = [], maxDepth = 100 }: WalkOptions = {}
): any[] {
    const results: any[] = [];
    function walk(node: any, depth: number): void {
        if (!node || typeof node !== "object" || depth > maxDepth) return;
        if (predicate(node)) results.push(node);
        const keys = walkable.length
            ? walkable.filter(k => k in node)
            : Object.keys(node).filter(k => !ignore.includes(k));
        for (const key of keys) {
            const child = node[key];
            if (Array.isArray(child)) {
                for (const item of child) walk(item, depth + 1);
            } else {
                walk(child, depth + 1);
            }
        }
    }
    walk(tree, 0);
    return results;
}

export function findInReactTree(tree: any, predicate: TreePredicate): any | null {
    return findInTree(tree, predicate, { walkable: ["props", "children"] });
}

export function findAllInReactTree(tree: any, predicate: TreePredicate): any[] {
    return findAllInTree(tree, predicate, { walkable: ["props", "children"] });
}

export function walkFiber(
    fiber: any,
    predicate: TreePredicate,
    direction: "down" | "up" = "down"
): any | null {
    if (!fiber) return null;
    if (predicate(fiber)) return fiber;
    if (direction === "up") return walkFiber(fiber.return, predicate, "up");
    const fromChild = fiber.child ? walkFiber(fiber.child, predicate, "down") : null;
    if (fromChild) return fromChild;
    return fiber.sibling ? walkFiber(fiber.sibling, predicate, "down") : null;
}