import type {
    ComponentType,
    CSSProperties,
    DependencyList,
    ForwardRefExoticComponent,
    JSX,
    ReactElement,
} from "react";

export * from "./webpack";

const { Webpack, React, ContextMenu, Hooks } = BdApi;
const { createElement, forwardRef } = React;

declare const __PLUGIN_NAME__: string;
declare const __PLUGIN_VERSION__: string;
declare const __PLUGIN_CHANGELOG__: ChangeLogEntry[];

export type ModuleFilter = BetterDiscord.ModuleFilter;
export type ExportedFilter = BetterDiscord.ExportedOnlyFilter;
export type FluxStore = BetterDiscord.FluxStore;
export type AnyStore = BetterDiscord.FluxStore | BetterDiscord.Store;
export type User = BetterDiscord.User;
export type Guild = BetterDiscord.Guild;
export type Channel = BetterDiscord.Channel;
export type Disposer = () => void;

export interface ChangeLogEntry extends BetterDiscord.ChangelogEntry {
    version: string;
}

function parseVersion(version: string): { numbers: number[]; prerelease: (number | string)[] } {
    const match = version.match(
        /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/
    );
    if (!match) throw new Error(`Invalid semantic version "${version}"`);

    const prerelease = match[4]
        ? match[4].split(".").map(identifier => {
            if (/^\d+$/.test(identifier)) {
                if (identifier.length > 1 && identifier.startsWith("0")) {
                    throw new Error(`Invalid numeric prerelease identifier in "${version}"`);
                }
                return Number(identifier);
            }
            return identifier;
        })
        : [];

    return { numbers: [Number(match[1]), Number(match[2]), Number(match[3])], prerelease };
}

export function compareVersions(left: string, right: string): number {
    const a = parseVersion(left);
    const b = parseVersion(right);

    for (let index = 0; index < a.numbers.length; index++) {
        const leftNumber = a.numbers[index];
        const rightNumber = b.numbers[index];
        if (leftNumber !== undefined && rightNumber !== undefined && leftNumber !== rightNumber) {
            return leftNumber > rightNumber ? 1 : -1;
        }
    }

    if (!a.prerelease.length || !b.prerelease.length) {
        if (a.prerelease.length === b.prerelease.length) return 0;
        return a.prerelease.length ? -1 : 1;
    }

    const length = Math.max(a.prerelease.length, b.prerelease.length);
    for (let index = 0; index < length; index++) {
        const leftIdentifier = a.prerelease[index];
        const rightIdentifier = b.prerelease[index];
        if (leftIdentifier === undefined || rightIdentifier === undefined) {
            return leftIdentifier === rightIdentifier ? 0 : leftIdentifier === undefined ? -1 : 1;
        }
        if (leftIdentifier === rightIdentifier) continue;
        if (typeof leftIdentifier === "number" && typeof rightIdentifier !== "number") return -1;
        if (typeof leftIdentifier !== "number" && typeof rightIdentifier === "number") return 1;
        return leftIdentifier > rightIdentifier ? 1 : -1;
    }

    return 0;
}

export function ChangeLog(entries: readonly ChangeLogEntry[] = __PLUGIN_CHANGELOG__): boolean {
    const api = new BdApi(__PLUGIN_NAME__);
    const savedVersion = api.Data.load<unknown>("lastVersion");
    if (savedVersion != null && typeof savedVersion !== "string") {
        throw new Error(`[${__PLUGIN_NAME__}] saved changelog version is not a string`);
    }
    const latestSeenVersion = typeof savedVersion === "string" ? savedVersion : null;

    parseVersion(__PLUGIN_VERSION__);
    for (let index = 1; index < entries.length; index++) {
        const newer = entries[index - 1];
        const older = entries[index];
        if (newer && older && compareVersions(newer.version, older.version) <= 0) {
            throw new Error(
                `[${__PLUGIN_NAME__}] changelog entries must be ordered newest to oldest`
            );
        }
    }

    if (latestSeenVersion === __PLUGIN_VERSION__) return false;

    const availableEntries = entries.filter(entry =>
        compareVersions(entry.version, __PLUGIN_VERSION__) <= 0
    );
    const changes = availableEntries.filter(entry =>
        latestSeenVersion
            ? compareVersions(entry.version, latestSeenVersion) > 0
            : entry === availableEntries[0]
    );

    if (changes.length) {
        api.UI.showChangelogModal({
            title: __PLUGIN_NAME__,
            subtitle: __PLUGIN_VERSION__,
            changes: changes.map(({ version: _version, ...change }) => change),
        });
    }

    api.Data.save("lastVersion", __PLUGIN_VERSION__);
    return changes.length > 0;
}

export interface ExportOptions
    extends Omit<BetterDiscord.LazyOptions, "raw" | "fatal" | "declarationFilter"> {

    declaration?: ExportedFilter;
}

type MangledLocator = ModuleFilter | string | RegExp | Array<string | RegExp> | number;

function orNull<T>(value: T | void | undefined | null): T | null {
    return (value ?? null) as T | null;
}

function toOptions({ declaration, ...rest }: ExportOptions = {}) {
    return declaration ? { ...rest, declarationFilter: declaration } : rest;
}

type StyleInput<P> = CSSProperties | ((props: P) => CSSProperties) | undefined;

export function styledBase<T extends keyof JSX.IntrinsicElements>(
    tag: T,
    cssOrFn: StyleInput<JSX.IntrinsicElements[T]>
): ComponentType<JSX.IntrinsicElements[T]> {
    const Styled = (props: any) => {
        const style = typeof cssOrFn === "function" ? cssOrFn(props) : cssOrFn;
        return createElement(tag as string, { ...props, style: { ...style, ...props.style } });
    };
    Styled.displayName = `styled.${String(tag)}`;
    return Styled as ComponentType<JSX.IntrinsicElements[T]>;
}

type StyledFactory = {
    [K in keyof JSX.IntrinsicElements]: (
        css: StyleInput<JSX.IntrinsicElements[K]>
    ) => ComponentType<JSX.IntrinsicElements[K]>;
};

export const styled = new Proxy(styledBase, {
    get: (target, p) => (css: StyleInput<any>) => target(p as keyof JSX.IntrinsicElements, css),
}) as unknown as typeof styledBase & StyledFactory;

type VariantDefs = Record<string, Record<string, CSSProperties>>;

export function variants<T extends keyof JSX.IntrinsicElements, V extends VariantDefs>(
    type: T,
    base: CSSProperties,
    variantDefs: V
): ForwardRefExoticComponent<JSX.IntrinsicElements[T] & { [K in keyof V]?: keyof V[K] & string }> {
    const keys = Object.keys(variantDefs);
    const Component = forwardRef<any, any>((props, ref) => {
        const { style, ...rest } = props;
        const merged: CSSProperties = { ...base };
        for (const key of keys) {
            const value = rest[key];
            delete rest[key];
            if (value != null && variantDefs[key][String(value)]) {
                Object.assign(merged, variantDefs[key][String(value)]);
            }
        }
        return createElement(type as string, { ...rest, style: { ...merged, ...style }, ref });
    });
    Component.displayName = `variants.${String(type)}`;
    return Component as any;
}

export interface ContextMenuPropsMap {
    "user-context": { user: User };
    message: { message: any };
    "guild-context": { guild: Guild };
    "gdm-context": { channel: Channel };
    "channel-context": { channel: Channel };
}

export type ContextMenuPatch = {
    [K in keyof ContextMenuPropsMap]: {
        navId: K;
        patch: (res: ReactElement, props: BetterDiscord.MenuRenderProps & ContextMenuPropsMap[K]) => void;
    };
}[keyof ContextMenuPropsMap];

export function ContextMenuHelper(patches: ContextMenuPatch[]): Disposer {
    const unpatches = patches.map(p => ContextMenu.patch(p.navId, p.patch as BetterDiscord.PatchCallback));
    return () => unpatches.forEach(unpatch => unpatch());
}

export function getKey<M extends object>(
    module: M,
    fn: (val: any) => boolean
): { key: string; module: M } | undefined {
    for (const key in module) {
        if (fn(module[key])) return { key, module };
    }
}

export function getExportByFilter<T = any>(filter: ModuleFilter, options?: ExportOptions): T | null {
    return orNull(Webpack.getModule<T>(filter, toOptions(options)));
}

export function getExportByStrings<T = any>(strings: string[], options?: ExportOptions) {
    return getExportByFilter<T>(Webpack.Filters.byStrings(...strings), options);
}

export function getExportByKeys<T = any>(keys: string[], options?: ExportOptions) {
    return getExportByFilter<T>(Webpack.Filters.byKeys(...keys), options);
}

export function getExportByPrototypes<T = any>(prototypes: string[], options?: ExportOptions) {
    return getExportByFilter<T>(Webpack.Filters.byPrototypeKeys(...prototypes), options);
}

export function getExportBySource<T = any>(source: string | RegExp, options?: ExportOptions) {
    return getExportByFilter<T>(Webpack.Filters.bySource(source), options);
}

export function getExportByDisplayName<T = any>(name: string, options?: ExportOptions) {
    return getExportByFilter<T>(Webpack.Filters.byDisplayName(name), options);
}

export function getExportByStoreName<T extends FluxStore = FluxStore>(name: string): T | null {
    return orNull(Webpack.getStore(name) as T | undefined);
}

export function getExportByType<T>(ctor: abstract new (...args: any[]) => T, options?: ExportOptions) {
    return getExportByFilter<T>(m => m instanceof ctor, options);
}

export function getExportByTypeString<T = any>(match: string | RegExp, options?: ExportOptions) {
    const test = typeof match === "string" ? (s: string) => s.includes(match) : (s: string) => match.test(s);
    return getExportByFilter<T>(m => {
        try {
            return typeof m === "function" && test(Function.prototype.toString.call(m));
        } catch {
            return false;
        }
    }, options);
}

export async function waitForExportByFilter<T = any>(
    filter: ModuleFilter,
    options?: ExportOptions
): Promise<T | null> {
    return orNull(await Webpack.waitForModule<T>(filter, toOptions(options)));
}

export function waitForExportByStrings<T = any>(strings: string[], o?: ExportOptions) {
    return waitForExportByFilter<T>(Webpack.Filters.byStrings(...strings), o);
}

export function waitForExportByKeys<T = any>(keys: string[], o?: ExportOptions) {
    return waitForExportByFilter<T>(Webpack.Filters.byKeys(...keys), o);
}

export function waitForExportByPrototypes<T = any>(prototypes: string[], o?: ExportOptions) {
    return waitForExportByFilter<T>(Webpack.Filters.byPrototypeKeys(...prototypes), o);
}

export function waitForExportBySource<T = any>(source: string | RegExp, o?: ExportOptions) {
    return waitForExportByFilter<T>(Webpack.Filters.bySource(source), o);
}

export function waitForExportByDisplayName<T = any>(name: string, o?: ExportOptions) {
    return waitForExportByFilter<T>(Webpack.Filters.byDisplayName(name), o);
}

export function waitForExportByStoreName<T extends FluxStore = FluxStore>(name: string) {
    return waitForExportByFilter<T>(Webpack.Filters.byStoreName(name));
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
    | { source: string | RegExp; options?: ExportOptions };

function resolveBulkQuery(query: BulkQuery): Promise<any> {
    if ("filter" in query) return waitForExportByFilter(query.filter, query.options);
    if ("strings" in query) return waitForExportByStrings(query.strings, query.options);
    if ("keys" in query) return waitForExportByKeys(query.keys, query.options);
    if ("prototypes" in query) return waitForExportByPrototypes(query.prototypes, query.options);
    return waitForExportBySource(query.source, query.options);
}

export function waitForBulk<T extends BulkQuery[]>(...queries: [...T]): Promise<{ [K in keyof T]: any }> {
    return Promise.all(queries.map(resolveBulkQuery)) as any;
}

export type MangledOptions = BetterDiscord.MangledOptions;

export function getMangledExports<T extends object>(
    locator: MangledLocator,
    mappers: { [K in keyof T]: ExportedFilter },
    options?: MangledOptions
): T | null {
    return orNull(Webpack.getMangled<T>(locator, mappers, options));
}

export function getMangledBulk<T extends object>(
    locator: MangledLocator,
    snippets: MangledSpecs<T>,
    options?: MangledOptions
): T | null {
    return getMangledExports<T>(locator, snippetsToMappers(snippets), options);
}

export async function waitForMangledExports<T extends object>(
    locator: string | RegExp,
    mappers: { [K in keyof T]: ExportedFilter },
    options?: MangledOptions
): Promise<T | null> {
    await Webpack.waitForModule(Webpack.Filters.bySource(locator));
    return getMangledExports<T>(locator, mappers, options);
}

export function waitForMangledBulk<T extends object>(
    locator: string | RegExp,
    snippets: MangledSpecs<T>,
    options?: MangledOptions
): Promise<T | null> {
    return waitForMangledExports<T>(locator, snippetsToMappers(snippets), options);
}

export type MangledSpec = string | string[] | ExportedFilter;
export type MangledSpecs<T> = { [K in keyof T]: MangledSpec };

function specToFilter(spec: MangledSpec): ExportedFilter {
    if (typeof spec === "function") return spec;
    return Webpack.Filters.byStrings(...(Array.isArray(spec) ? spec : [spec]));
}

function snippetsToMappers<T extends object>(specs: MangledSpecs<T>) {
    return Object.fromEntries(
        Object.entries<MangledSpec>(specs).map(([k, v]) => [k, specToFilter(v)])
    ) as { [K in keyof T]: ExportedFilter };
}

export function getMangledModules<T extends Record<string, object>>(
    modules: { [L in keyof T]: MangledSpecs<T[L]> },
    options?: MangledOptions
): { [L in keyof T]: T[L] | null } {
    return Object.fromEntries(
        Object.entries<MangledSpecs<any>>(modules).map(([locator, specs]) => [
            locator,
            getMangledExports(locator, snippetsToMappers(specs), options),
        ])
    ) as any;
}

export async function waitForMangledModules<T extends Record<string, object>>(
    modules: { [L in keyof T]: MangledSpecs<T[L]> },
    options?: MangledOptions
): Promise<{ [L in keyof T]: T[L] | null }> {
    const entries = await Promise.all(
        Object.entries<MangledSpecs<any>>(modules).map(async ([locator, specs]) => [
            locator,
            await waitForMangledExports(locator, snippetsToMappers(specs), options),
        ])
    );
    return Object.fromEntries(entries) as any;
}

export function findDeclaration(
    declarations: Record<string, any>,
    predicate: ExportedFilter
): { module: Record<string, any>; key: string } | null {
    for (const key in declarations) {
        if (predicate(declarations[key])) return { key, module: declarations };
    }
    return null;
}

export function findAllDeclarations(
    declarations: Record<string, any>,
    predicate: ExportedFilter
): Array<{ module: Record<string, any>; key: string }> {
    const results: Array<{ module: Record<string, any>; key: string }> = [];
    for (const key in declarations) {
        if (predicate(declarations[key])) results.push({ key, module: declarations });
    }
    return results;
}

export function getAllDeclarationExports<T = any>(source: string | RegExp, predicate: ExportedFilter): T[] {
    const raw = Webpack.getBySource<BetterDiscord.Module>(source, { raw: true });
    if (!raw?.declarations) return [];
    return findAllDeclarations(raw.declarations, predicate).map(({ module, key }) => module[key] as T);
}

export function combineFilters(...filters: ModuleFilter[]): ModuleFilter {
    return Webpack.Filters.combine(...filters);
}

export function anyFilter(...filters: ModuleFilter[]): ModuleFilter {
    return (exported, module, id) => filters.some(f => f(exported, module, id));
}

export function notFilter(filter: ModuleFilter): ModuleFilter {
    return Webpack.Filters.not(filter);
}

export function lazyExport<T extends object>(getter: () => T | null | undefined): T {
    let cached: T | null | undefined;
    const resolve = () => (cached ??= getter());
    return new Proxy({} as T, {
        get: (_, key) => (resolve() as any)?.[key],
        set: (_, key, value) => {
            const target = resolve();
            if (target) (target as any)[key] = value;
            return true;
        },
        has: (_, key) => { const t = resolve(); return t ? key in t : false; },
        ownKeys: () => { const t = resolve(); return t ? Reflect.ownKeys(t) : []; },
        getOwnPropertyDescriptor: (_, key) => {
            const t = resolve();
            const desc = t ? Reflect.getOwnPropertyDescriptor(t, key) : undefined;
            return desc && { ...desc, configurable: true };
        },
    });
}

export function proxyRecache() {
    return void 0;
}

export function waitAndPatch<M extends object, K extends Extract<keyof M, string>>(
    patcher: BetterDiscord.BoundPatcher,
    filter: ModuleFilter,
    key: K,
    callback: BetterDiscord.AsAfterCallback<M, K>
): Disposer {
    const controller = new AbortController();
    let unpatch: (() => void) | null = null;
    let cancelled = false;

    waitForExportByFilter<M>(filter, { signal: controller.signal })
        .then(mod => {
            if (!cancelled && mod) unpatch = patcher.after(mod, key, callback);
        })
        .catch(() => {});

    return () => {
        cancelled = true;
        controller.abort();
        unpatch?.();
    };
}

export function safe<A extends any[], R>(name: string, fn: (...args: A) => R): (...args: A) => R | undefined {
    return (...args) => {
        try {
            return fn(...args);
        } catch (e) {
            BdApi.Logger.stacktrace(name, "Patch callback threw", e as Error);
        }
    };
}

export function createDisposer() {
    const fns: Disposer[] = [];
    return {
        add<T extends Disposer | null | undefined | void>(fn: T): T {
            if (typeof fn === "function") fns.push(fn);
            return fn;
        },
        dispose() {
            while (fns.length) {
                try {
                    fns.pop()!();
                } catch (e) {
                    BdApi.Logger.error("helpers", "Disposer failed", e);
                }
            }
        },
    };
}

export function useStore<T>(store: AnyStore, selector: () => T, deps?: DependencyList): T {
    return Hooks.useStateFromStores(store, selector, deps);
}

export function useStores<T>(stores: AnyStore[], selector: () => T, deps?: DependencyList): T {
    return Hooks.useStateFromStores(stores, selector, deps);
}

type TreePredicate = (node: any) => boolean;

interface WalkOptions {
    walkable?: string[];
    ignore?: string[];
    maxDepth?: number;
}

function* childrenOf(node: any, { walkable = [], ignore = [] }: WalkOptions) {
    const keys = walkable.length ? walkable.filter(k => k in node) : Object.keys(node).filter(k => !ignore.includes(k));
    for (const key of keys) {
        const child = node[key];
        if (Array.isArray(child)) yield* child;
        else yield child;
    }
}

export function findInTree(tree: any, predicate: TreePredicate, options: WalkOptions = {}): any | null {
    const { maxDepth = 100 } = options;
    const seen = new WeakSet<object>();
    function walk(node: any, depth: number): any | null {
        if (!node || typeof node !== "object" || depth > maxDepth || seen.has(node)) return null;
        seen.add(node);
        if (predicate(node)) return node;
        for (const child of childrenOf(node, options)) {
            const result = walk(child, depth + 1);
            if (result !== null) return result;
        }
        return null;
    }
    return walk(tree, 0);
}

export function findAllInTree(tree: any, predicate: TreePredicate, options: WalkOptions = {}): any[] {
    const { maxDepth = 100 } = options;
    const results: any[] = [];
    const seen = new WeakSet<object>();
    function walk(node: any, depth: number) {
        if (!node || typeof node !== "object" || depth > maxDepth || seen.has(node)) return;
        seen.add(node);
        if (predicate(node)) results.push(node);
        for (const child of childrenOf(node, options)) walk(child, depth + 1);
    }
    walk(tree, 0);
    return results;
}

export const findInReactTree = (tree: any, predicate: TreePredicate) =>
    findInTree(tree, predicate, { walkable: ["props", "children"] });

export const findAllInReactTree = (tree: any, predicate: TreePredicate) =>
    findAllInTree(tree, predicate, { walkable: ["props", "children"] });

export interface FiberLike {
    type?: any;
    stateNode?: any;
    memoizedProps?: any;
    memoizedState?: any;
    child?: FiberLike | null;
    sibling?: FiberLike | null;
    return?: FiberLike | null;
}

export function walkFiber(
    fiber: FiberLike | null | undefined,
    predicate: (fiber: FiberLike) => boolean,
    direction: "down" | "up" = "down"
): FiberLike | null {
    if (!fiber) return null;
    if (direction === "up") {
        for (let f: FiberLike | null | undefined = fiber; f; f = f.return) if (predicate(f)) return f;
        return null;
    }
    const stack: FiberLike[] = [fiber];
    while (stack.length) {
        const node = stack.pop()!;
        if (predicate(node)) return node;
        if (node !== fiber && node.sibling) stack.push(node.sibling);
        if (node.child) stack.push(node.child);
    }
    return null;
}

export function getFiber(node: Element | null | undefined): FiberLike | null {
    return node ? (BdApi.ReactUtils.getInternalInstance(node) as FiberLike | null) : null;
}

export function forceUpdateElement(target: string | Element | null): boolean {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    const owner = walkFiber(getFiber(el), f => typeof f.stateNode?.forceUpdate === "function", "up");
    owner?.stateNode.forceUpdate();
    return !!owner;
}

export function waitUntil<T>(
    check: () => T | null | undefined | false,
    { interval = 50, timeout = 10_000 } = {}
): Promise<T> {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const tick = () => {
            const result = check();
            if (result) return resolve(result);
            if (Date.now() - start >= timeout) return reject(new Error("waitUntil timed out"));
            setTimeout(tick, interval);
        };
        tick();
    });
}

export interface GuildMember {
    userId: string;
    guildId: string;
    nick: string | null;
    avatar: string | null;
    roles: string[];
    colorString?: string;
    [key: string]: any;
}

export interface UserStoreType extends FluxStore {
    getUser(id: string): User | undefined;
    getCurrentUser(): User | undefined;
    getUsers(): Record<string, User>;
}
export interface GuildStoreType extends FluxStore {
    getGuild(id: string): Guild | undefined;
    getGuilds(): Record<string, Guild>;
    getGuildIds(): string[];
}
export interface ChannelStoreType extends FluxStore {
    getChannel(id: string): Channel | undefined;
    getDMFromUserId(userId: string): string | undefined;
    getSortedPrivateChannels(): Channel[];
}
export interface GuildMemberStoreType extends FluxStore {
    getMember(guildId: string, userId: string): GuildMember | null;
    getNick(guildId: string, userId: string): string | null;
}
export interface SelectedGuildStoreType extends FluxStore {
    getGuildId(): string | null;
    getLastSelectedGuildId(): string | null;
}
export interface SelectedChannelStoreType extends FluxStore {
    getChannelId(guildId?: string): string | undefined;
    getVoiceChannelId(): string | null;
}
export interface MessageStoreType extends FluxStore {
    getMessage(channelId: string, messageId: string): any | undefined;
    getMessages(channelId: string): { toArray(): any[] };
}

function lazyStore<T extends FluxStore>(name: string) {
    return lazyExport<T>(() => Webpack.getStore(name) as T | undefined);
}

const Stores = {
    User: lazyStore<UserStoreType>("UserStore"),
    Guild: lazyStore<GuildStoreType>("GuildStore"),
    Channel: lazyStore<ChannelStoreType>("ChannelStore"),
    GuildMember: lazyStore<GuildMemberStoreType>("GuildMemberStore"),
    SelectedGuild: lazyStore<SelectedGuildStoreType>("SelectedGuildStore"),
    SelectedChannel: lazyStore<SelectedChannelStoreType>("SelectedChannelStore"),
    Message: lazyStore<MessageStoreType>("MessageStore"),
};

export const getUser = (id: string) => Stores.User.getUser(id);
export const getCurrentUser = () => Stores.User.getCurrentUser();
export const getGuild = (id: string) => Stores.Guild.getGuild(id);
export const getChannel = (id: string) => Stores.Channel.getChannel(id);
export const getMember = (guildId: string, userId: string) => Stores.GuildMember.getMember(guildId, userId);
export const getMessage = (channelId: string, messageId: string) => Stores.Message.getMessage(channelId, messageId);

export const getSelectedGuildId = () => Stores.SelectedGuild.getGuildId();
export const getSelectedChannelId = () => Stores.SelectedChannel.getChannelId() ?? null;

export function getCurrentGuild(): Guild | undefined {
    const id = getSelectedGuildId();
    return id ? getGuild(id) : undefined;
}

export function getCurrentChannel(): Channel | undefined {
    const id = getSelectedChannelId();
    return id ? getChannel(id) : undefined;
}

const resolveUser = (userOrId: User | string | null | undefined) =>
    typeof userOrId === "string" ? getUser(userOrId) : userOrId ?? undefined;

export const isCurrentUser = (userOrId: User | string) =>
    (typeof userOrId === "string" ? userOrId : userOrId.id) === getCurrentUser()?.id;

export function getDisplayName(userOrId: User | string, guildId?: string | null): string {
    const user = resolveUser(userOrId);
    const id = typeof userOrId === "string" ? userOrId : userOrId.id;
    const nick = guildId ? Stores.GuildMember.getNick(guildId, id) : null;
    return nick || user?.globalName || user?.username || "Unknown User";
}

export function getUserTag(userOrId: User | string): string {
    const user = resolveUser(userOrId);
    if (!user) return "Unknown User";
    return user.discriminator && user.discriminator !== "0" ? `${user.username}#${user.discriminator}` : user.username;
}

export function getSnowflakeDate(id: string): Date {
    const DISCORD_EPOCH = BigInt(1420070400000);
    return new Date(Number((BigInt(id) >> BigInt(22)) + DISCORD_EPOCH));
}

const CDN = "https://cdn.discordapp.com";

export interface ImageOptions {

    size?: number;

    format?: "png" | "webp" | "jpg";

    animated?: boolean;
}

function cdnImage(path: string, hash: string, { size = 4096, format = "png", animated = true }: ImageOptions = {}) {
    const ext = animated && hash.startsWith("a_") ? "gif" : format;
    return `${CDN}/${path}/${hash}.${ext}?size=${size}`;
}

export function getDefaultAvatarURL(user: Pick<User, "id" | "discriminator">): string {
    const legacy = user.discriminator && user.discriminator !== "0";
    const index = legacy ? Number(user.discriminator) % 5 : Number((BigInt(user.id) >> BigInt(22)) % BigInt(6));
    return `${CDN}/embed/avatars/${index}.png`;
}

export function getUserAvatarURL(userOrId: User | string, options: ImageOptions & { guildId?: string | null } = {}): string {
    const user = resolveUser(userOrId);
    const id = typeof userOrId === "string" ? userOrId : userOrId.id;

    if (options.guildId) {
        const memberAvatar = getMember(options.guildId, id)?.avatar;
        if (memberAvatar) return cdnImage(`guilds/${options.guildId}/users/${id}/avatars`, memberAvatar, options);
    }
    if (user?.avatar) return cdnImage(`avatars/${id}`, user.avatar, options);
    return getDefaultAvatarURL(user ?? { id, discriminator: "0" });
}

export function getUserBannerURL(userOrId: User | string, options: ImageOptions = { size: 480 }): string | null {
    const user = resolveUser(userOrId);
    return user?.banner ? cdnImage(`banners/${user.id}`, user.banner, options) : null;
}

export function getGuildIconURL(guildOrId: Guild | string, options: ImageOptions = {}): string | null {
    const guild = typeof guildOrId === "string" ? getGuild(guildOrId) : guildOrId;
    return guild?.icon ? cdnImage(`icons/${guild.id}`, guild.icon, options) : null;
}

export function getGuildBannerURL(guildOrId: Guild | string, options: ImageOptions = { size: 480 }): string | null {
    const guild = typeof guildOrId === "string" ? getGuild(guildOrId) : guildOrId;
    return guild?.banner ? cdnImage(`banners/${guild.id}`, guild.banner, options) : null;
}

export function getChannelIconURL(channelOrId: Channel | string, options: ImageOptions = {}): string | null {
    const channel = typeof channelOrId === "string" ? getChannel(channelOrId) : channelOrId;
    return channel?.icon ? cdnImage(`channel-icons/${channel.id}`, channel.icon, options) : null;
}

export function getEmojiURL(id: string, { animated = false, size = 128 }: { animated?: boolean; size?: number } = {}) {
    return `${CDN}/emojis/${id}.${animated ? "gif" : "png"}?size=${size}`;
}

export function getRoleIconURL(roleId: string, hash: string, options: ImageOptions = {}): string {
    return cdnImage(`role-icons/${roleId}`, hash, options);
}

export function getMemberBannerURL(
    guildId: string,
    userId: string,
    options: ImageOptions = { size: 480 }
): string | null {
    const banner = getMember(guildId, userId)?.banner;
    return banner ? cdnImage(`guilds/${guildId}/users/${userId}/banners`, banner, options) : null;
}

export const useUser = (id: string) => useStore(Stores.User, () => Stores.User.getUser(id), [id]);
export const useCurrentUser = () => useStore(Stores.User, () => Stores.User.getCurrentUser());
export const useGuild = (id: string) => useStore(Stores.Guild, () => Stores.Guild.getGuild(id), [id]);
export const useChannel = (id: string) => useStore(Stores.Channel, () => Stores.Channel.getChannel(id), [id]);
export const useSelectedChannelId = () => useStore(Stores.SelectedChannel, getSelectedChannelId);
export const useSelectedGuildId = () => useStore(Stores.SelectedGuild, getSelectedGuildId);
export const useMember = (guildId: string, userId: string) =>
    useStore(Stores.GuildMember, () => Stores.GuildMember.getMember(guildId, userId), [guildId, userId]);