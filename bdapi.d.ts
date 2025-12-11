/**
 * BetterDiscord API Type Definitions
 * 
 * Comprehensive type definitions for BdApi - the public API for BetterDiscord plugins and themes
 */

import type {ComponentType, Context, FunctionComponent, ReactElement, ReactNode, RefObject} from "react";
import type {Fiber} from "react-reconciler";

declare global {
    const BdApi: BdApiConstructor;
}

// ============================================================================
// Main BdApi Interface
// ============================================================================

interface BdApiConstructor {
    new(pluginName: string): BdApiInstance;
    
    // Static properties
    Patcher: PatcherStatic;
    Data: DataStatic;
    DOM: DOMStatic;
    Logger: LoggerStatic;
    Commands: CommandAPIStatic;
    React: typeof React;
    ReactDOM: typeof ReactDOM;
    version: string;
    
    // Static namespaces
    Plugins: AddonAPI;
    Themes: AddonAPI;
    Webpack: WebpackAPI;
    UI: UIAPI;
    ReactUtils: ReactUtilsAPI;
    Utils: UtilsAPI;
    ContextMenu: ContextMenuAPI;
    Components: ComponentsAPI;
    Net: {fetch: typeof fetch;};
}

interface BdApiInstance {
    // Instance properties
    Patcher: PatcherInstance;
    Data: DataInstance;
    DOM: DOMInstance;
    Logger: LoggerInstance;
    Commands: CommandAPIInstance;
    React: typeof React;
    ReactDOM: typeof ReactDOM;
    version: string;
    
    // Instance getters (non-bound namespaces)
    readonly Plugins: AddonAPI;
    readonly Themes: AddonAPI;
    readonly Webpack: WebpackAPI;
    readonly Utils: UtilsAPI;
    readonly UI: UIAPI;
    readonly ReactUtils: ReactUtilsAPI;
    readonly ContextMenu: ContextMenuAPI;
    readonly Components: ComponentsAPI;
    Net: {fetch: typeof fetch;};
}

// ============================================================================
// Patcher API
// ============================================================================

interface PatcherStatic {
    before<M extends object, K extends keyof M & string>(
        caller: string,
        moduleToPatch: M,
        functionName: K,
        callback: M[K] extends (...args: any[]) => any ? BeforeCallback<M[K]> : never
    ): (() => void) | null;
    
    instead<M extends object, K extends keyof M & string>(
        caller: string,
        moduleToPatch: M,
        functionName: K,
        callback: M[K] extends (...args: any[]) => any ? InsteadCallback<M[K]> : never
    ): (() => void) | null;
    
    after<M extends object, K extends keyof M & string>(
        caller: string,
        moduleToPatch: M,
        functionName: K,
        callback: M[K] extends (...args: any[]) => any ? AfterCallback<M[K]> : never
    ): (() => void) | null;
    
    getPatchesByCaller(caller: string): ChildPatch[];
    unpatchAll(caller: string): void;
}

interface PatcherInstance {
    before<M extends object, K extends keyof M & string>(
        moduleToPatch: M,
        functionName: K,
        callback: M[K] extends (...args: any[]) => any ? BeforeCallback<M[K]> : never
    ): (() => void) | null;
    
    instead<M extends object, K extends keyof M & string>(
        moduleToPatch: M,
        functionName: K,
        callback: M[K] extends (...args: any[]) => any ? InsteadCallback<M[K]> : never
    ): (() => void) | null;
    
    after<M extends object, K extends keyof M & string>(
        moduleToPatch: M,
        functionName: K,
        callback: M[K] extends (...args: any[]) => any ? AfterCallback<M[K]> : never
    ): (() => void) | null;
    
    getPatchesByCaller(): ChildPatch[];
    unpatchAll(): void;
}

type BeforeCallback<F extends (...args: any[]) => any> = (
    thisObject: ThisParameterType<F>,
    args: Parameters<F>
) => void;

type InsteadCallback<F extends (...args: any[]) => any> = (
    thisObject: ThisParameterType<F>,
    args: Parameters<F>,
    originalFunction: F
) => ReturnType<F> | void;

type AfterCallback<F extends (...args: any[]) => any> = (
    thisObject: ThisParameterType<F>,
    args: Parameters<F>,
    returnValue: ReturnType<F>
) => ReturnType<F> | void;

interface ChildPatch {
    caller: string;
    type: "before" | "instead" | "after";
    id: number;
    callback: (...args: any[]) => any;
    unpatch: () => void;
}

// ============================================================================
// Data API
// ============================================================================

interface DataStatic {
    save<T>(pluginName: string, key: string, data: T): void;
    load<T>(pluginName: string, key: string): T;
    delete(pluginName: string, key: string): void;
    recache(pluginName: string): Promise<boolean>;
}

interface DataInstance {
    save<T>(key: string, data: T): void;
    load<T>(key: string): T;
    delete(key: string): void;
    recache(): Promise<boolean>;
}

// ============================================================================
// DOM API
// ============================================================================

interface DOMStatic {
    readonly screenWidth: number;
    readonly screenHeight: number;
    
    addStyle(id: string, css: string): void;
    removeStyle(id: string): void;
    onRemoved(node: HTMLElement, callback: () => void): void;
    onAdded(selector: string, callback: (node: HTMLElement) => void): void;
    animate(update: (progress: number) => void, duration: number, options?: AnimateOptions): void;
    createElement<K extends keyof HTMLElementTagNameMap>(
        tag: K,
        options?: CreateElementOptions,
        ...children: Array<Node | string>
    ): HTMLElementTagNameMap[K];
    parseHTML(html: string, fragment?: false): HTMLElement | NodeListOf<ChildNode>;
    parseHTML(html: string, fragment: true): DocumentFragment;
}

interface DOMInstance {
    readonly screenWidth: number;
    readonly screenHeight: number;
    
    addStyle(css: string): void;
    addStyle(id: string, css: string): void;
    removeStyle(): void;
    removeStyle(id: string): void;
    onRemoved(node: HTMLElement, callback: () => void): void;
    onAdded(selector: string, callback: (node: HTMLElement) => void): void;
    animate(update: (progress: number) => void, duration: number, options?: AnimateOptions): void;
    createElement<K extends keyof HTMLElementTagNameMap>(
        tag: K,
        options?: CreateElementOptions,
        ...children: Array<Node | string>
    ): HTMLElementTagNameMap[K];
    parseHTML(html: string, fragment?: false): HTMLElement | NodeListOf<ChildNode>;
    parseHTML(html: string, fragment: true): DocumentFragment;
}

interface AnimateOptions {
    timing?: (timeFraction: number) => number;
}

interface CreateElementOptions {
    className?: string;
    id?: string;
    target?: HTMLElement;
    [key: string]: any;
}

// ============================================================================
// Webpack API
// ============================================================================

interface WebpackAPI {
    modules: Record<PropertyKey, WebpackModule>;
    Stores: Record<string, any>;
    Filters: WebpackFilters;
    
    getModule<T = any>(filter: WebpackFilter, options?: WebpackOptions): T | undefined;
    getModules<T extends any[] = any[]>(filter: WebpackFilter, options?: WebpackOptions): T;
    getWithKey<T = any>(filter: ExportedOnlyFilter, options?: WithKeyOptions): [T, string] | undefined;
    getBulk<T extends any[] = any[]>(...queries: BulkQuery[]): T;
    waitForModule<T = any>(filter: WebpackFilter, options?: LazyOptions): Promise<T>;
    
    getByRegex<T = any>(regex: RegExp, options?: WebpackOptions): T | undefined;
    getAllByRegex<T extends any[] = any[]>(regex: RegExp, options?: WebpackOptions): T;
    
    getByKeys<T = any>(...keys: [...string[], WebpackOptions?]): T | undefined;
    getAllByKeys<T extends any[] = any[]>(...keys: [...string[], WebpackOptions?]): T;
    
    getByPrototypeKeys<T = any>(...keys: [...string[], WebpackOptions?]): T | undefined;
    getAllByPrototypeKeys<T extends any[] = any[]>(...keys: [...string[], WebpackOptions?]): T;
    
    getByStrings<T = any>(...strings: [...string[], WebpackOptions?]): T | undefined;
    getAllByStrings<T extends any[] = any[]>(...strings: [...string[], WebpackOptions?]): T;
    
    getBySource<T = any>(...searches: [...Array<string | RegExp>, WebpackOptions?]): T | undefined;
    getAllBySource<T extends any[] = any[]>(...searches: [...Array<string | RegExp>, WebpackOptions?]): T;
    
    getMangled<T extends object>(filter: WebpackFilter | string | RegExp, mangled: Record<keyof T, WebpackFilter>, options?: WebpackOptions): T | undefined;
    
    getStore(name: string): any;
}

interface WebpackFilters {
    byKeys(...keys: string[]): WebpackFilter;
    byPrototypeKeys(...keys: string[]): WebpackFilter;
    byRegex(regex: RegExp): WebpackFilter;
    bySource(...searches: Array<string | RegExp>): WebpackFilter;
    byStrings(...strings: string[]): WebpackFilter;
    byDisplayName(name: string): WebpackFilter;
    byStoreName(name: string): WebpackFilter;
    combine(...filters: WebpackFilter[]): WebpackFilter;
}

type WebpackFilter = (exported: any, module: WebpackModule, id: PropertyKey) => boolean;
type ExportedOnlyFilter = (exported: any) => boolean;

interface WebpackOptions {
    searchExports?: boolean;
    defaultExport?: boolean;
    searchDefault?: boolean;
    raw?: boolean;
    first?: boolean;
}

interface WithKeyOptions extends WebpackOptions {
    target?: any;
}

interface LazyOptions extends WebpackOptions {
    signal?: AbortSignal;
}

interface BulkQuery extends WebpackOptions {
    filter: WebpackFilter;
    all?: boolean;
    map?: Record<string, ExportedOnlyFilter>;
}

interface WebpackModule<T = any> {
    id: PropertyKey;
    exports: T;
    loaded: boolean;
}

// ============================================================================
// UI API
// ============================================================================

interface UIAPI {
    alert(title: string, content: string | ReactElement | Array<string | ReactElement>): void;
    
    showConfirmationModal(
        title: string,
        content: string | ReactElement | Array<string | ReactElement>,
        options?: ConfirmationModalOptions
    ): string;
    
    showChangelogModal(options: ChangelogOptions): string;
    showInviteModal(inviteCode: string): void;
    
    showToast(content: string, options?: ToastOptions): void;
    showNotice(content: string | Node, options?: NoticeOptions): () => void;
    showNotification(notification: NotificationOptions): void;
    
    createTooltip(node: HTMLElement, content: string | HTMLElement, options?: TooltipOptions): Tooltip;
    
    openDialog(options: DialogOptions): Promise<DialogResult>;
    
    buildSettingItem(setting: SettingConfig): ReactElement;
}

interface ConfirmationModalOptions {
    danger?: boolean;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    onClose?: () => void;
}

interface ChangelogOptions {
    title: string;
    subtitle: string;
    blurb?: string;
    banner?: string;
    video?: string;
    poster?: string;
    footer?: string | ReactElement | Array<string | ReactElement>;
    changes?: Array<{
        title: string;
        type: "fixed" | "added" | "progress" | "improved";
        items: string[];
        blurb?: string;
    }>;
}

interface ToastOptions {
    type?: "" | "info" | "success" | "danger" | "error" | "warning" | "warn";
    icon?: boolean;
    timeout?: number;
    forceShow?: boolean;
}

interface NoticeOptions {
    type?: "info" | "error" | "warning" | "success";
    buttons?: Array<{label: string; onClick: () => void;}>;
    timeout?: number;
}

interface NotificationOptions {
    title: string;
    content: string;
    type?: "info" | "success" | "warning" | "error";
    duration?: number;
    icon?: ReactElement | null;
    actions?: Array<{text: string; onClick: () => void;}>;
}

interface TooltipOptions {
    style?: "primary" | "info" | "success" | "warn" | "danger";
    side?: "top" | "right" | "bottom" | "left";
    preventFlip?: boolean;
    disabled?: boolean;
}

interface Tooltip {
    show(): void;
    hide(): void;
    destroy(): void;
}

interface DialogOptions {
    mode?: "open" | "save";
    defaultPath?: string;
    filters?: Array<{name: string; extensions: string[];}>;
    title?: string;
    message?: string;
    showOverwriteConfirmation?: boolean;
    showHiddenFiles?: boolean;
    promptToCreate?: boolean;
    openDirectory?: boolean;
    openFile?: boolean;
    multiSelections?: boolean;
    modal?: boolean;
}

interface DialogResult {
    cancelled: boolean;
    filePath?: string;
    filePaths?: string[];
}

interface SettingConfig {
    type: SettingType;
    id: string;
    name?: string;
    note?: string;
    value: any;
    onChange?: (value: any) => void;
    disabled?: boolean;
    inline?: boolean;
    children?: ReactElement;
    [key: string]: any;
}

type SettingType = "dropdown" | "number" | "switch" | "text" | "slider" | "radio" | "keybind" | "color" | "custom";

// ============================================================================
// ReactUtils API
// ============================================================================

interface ReactUtilsAPI {
    rootInstance: any;
    
    getInternalInstance(node: HTMLElement): Fiber | null;
    getOwnerInstance(node: HTMLElement | undefined, options?: GetOwnerInstanceOptions): any | null;
    wrapElement(element: HTMLElement | HTMLElement[]): ComponentType;
    wrapInHooks<P extends object>(
        functionComponent: FunctionComponent<P>,
        customPatches?: Partial<ReactHooks>
    ): FunctionComponent<P>;
}

interface GetOwnerInstanceOptions {
    include?: string[];
    exclude?: string[];
    filter?: (owner: any) => boolean;
}

interface ReactHooks {
    use<T>(usable: PromiseLike<T> | Context<T>): T;
    useMemo<T>(factory: () => T): T;
    useState<T>(initial: T | (() => T)): [T, (value: T) => void];
    useReducer<T>(reducer: (state: T, action: any) => T, initial: T): [T, (action: any) => void];
    useRef<T>(value?: T): RefObject<T>;
    useCallback<T extends (...args: any[]) => any>(callback: T): T;
    useContext<T>(context: Context<T>): T;
    readContext<T>(context: Context<T>): T;
    useEffect(effect: () => void | (() => void), deps?: any[]): void;
    useLayoutEffect(effect: () => void | (() => void), deps?: any[]): void;
    useImperativeHandle<T>(ref: RefObject<T>, createHandle: () => T, deps?: any[]): void;
    useTransition(): [boolean, (callback: () => void) => void];
    useInsertionEffect(effect: () => void | (() => void), deps?: any[]): void;
    useDebugValue<T>(value: T, formatter?: (value: T) => any): void;
    useDeferredValue<T>(value: T): T;
    useSyncExternalStore<T>(subscribe: (callback: () => void) => () => void, getSnapshot: () => T): T;
    useId(): string;
}

// ============================================================================
// Utils API
// ============================================================================

interface UtilsAPI {
    findInTree<T = any>(
        tree: any,
        searchFilter: (item: any) => boolean,
        options?: FindInTreeOptions
    ): T | undefined;
    
    forceLoad(id: string | number): Promise<any>;
    
    extend<T extends object>(extendee: T, ...extenders: Partial<T>[]): T;
    
    debounce<T extends (...args: any[]) => any>(executor: T, delay: number): T;
    
    escapeHTML(html: string): string;
    
    className(...args: any[]): string;
    
    getNestedValue<T = any>(object: any, path: string): T;
    
    semverCompare(currentVersion: string, newVersion: string): -1 | 0 | 1;
}

interface FindInTreeOptions {
    walkable?: string[] | null;
    ignore?: string[];
}

// ============================================================================
// AddonAPI
// ============================================================================

interface AddonAPI {
    readonly folder: string;
    
    isEnabled(idOrFile: string): boolean;
    enable(idOrFile: string): void;
    disable(idOrFile: string): void;
    toggle(idOrFile: string): void;
    reload(idOrFile: string): void;
    get(idOrFile: string): any;
    getAll(): any[];
}

// ============================================================================
// ContextMenu API
// ============================================================================

interface ContextMenuAPI {
    open(event: MouseEvent, menuComponent: (onClose: () => void) => ReactElement): void;
    close(): void;
    patch(navId: string, callback: (returnValue: any, props: any) => void): () => void;
    unpatch(navId: string, callback: (returnValue: any, props: any) => void): void;
}

// ============================================================================
// Components API
// ============================================================================

interface ComponentsAPI {
    readonly Tooltip: any;
    readonly ColorInput: ComponentType<any>;
    readonly DropdownInput: ComponentType<any>;
    readonly SettingItem: ComponentType<any>;
    readonly KeybindInput: ComponentType<any>;
    readonly NumberInput: ComponentType<any>;
    readonly RadioInput: ComponentType<any>;
    readonly SearchInput: ComponentType<any>;
    readonly SliderInput: ComponentType<any>;
    readonly SwitchInput: ComponentType<any>;
    readonly TextInput: ComponentType<any>;
    readonly SettingGroup: ComponentType<any>;
    readonly ErrorBoundary: ComponentType<any>;
    readonly Text: ComponentType<any>;
    readonly Flex: ComponentType<any>;
    readonly Button: ComponentType<any>;
    readonly Spinner: ComponentType<any>;
}

// ============================================================================
// CommandAPI
// ============================================================================

interface CommandAPIStatic {
    Types: {
        OptionTypes: typeof OptionTypes;
        CommandTypes: typeof CommandTypes;
        InputTypes: typeof InputTypes;
        MessageEmbedTypes: typeof MessageEmbedTypes;
    };
    
    register(caller: string, command: Command): (() => void) | undefined;
    unregister(caller: string, commandId: string): void;
    unregisterAll(caller: string): void;
    getCommandsByCaller(caller: string): Command[];
}

interface CommandAPIInstance {
    Types: {
        OptionTypes: typeof OptionTypes;
        CommandTypes: typeof CommandTypes;
        InputTypes: typeof InputTypes;
        MessageEmbedTypes: typeof MessageEmbedTypes;
    };
    
    register(command: Command): (() => void) | undefined;
    unregister(commandId: string): void;
    unregisterAll(): void;
    getCommandsByCaller(caller: string): Command[];
}

interface Command {
    id: string;
    name: string;
    description?: string;
    execute: (...args: any[]) => void | Promise<void>;
    options?: CommandOption[];
}

interface CommandOption {
    name: string;
    description: string;
    type: number;
    required?: boolean;
    choices?: Array<{name: string; value: string | number;}>;
}

declare enum OptionTypes {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
}

declare enum CommandTypes {
    CHAT = 1,
    USER = 2,
    MESSAGE = 3,
}

declare enum InputTypes {
    BUILT_IN = 0,
    BUILT_IN_TEXT = 1,
    BUILT_IN_INTEGRATION = 2,
    BOT = 3,
    PLACEHOLDER = 4,
}

declare enum MessageEmbedTypes {
    RICH = "rich",
    IMAGE = "image",
    VIDEO = "video",
    GIFV = "gifv",
    ARTICLE = "article",
    LINK = "link",
}

// ============================================================================
// Logger API
// ============================================================================

interface LoggerStatic {
    log(module: string, ...message: any[]): void;
    warn(module: string, ...message: any[]): void;
    error(module: string, ...message: any[]): void;
    err(module: string, ...message: any[]): void;
    info(module: string, ...message: any[]): void;
    debug(module: string, ...message: any[]): void;
    stacktrace(module: string, message: string, error: Error): void;
}

interface LoggerInstance {
    log(...message: any[]): void;
    warn(...message: any[]): void;
    error(...message: any[]): void;
    err(...message: any[]): void;
    info(...message: any[]): void;
    debug(...message: any[]): void;
    stacktrace(message: string, error: Error): void;
}

// ============================================================================
// Export
// ============================================================================

export {
    BdApiConstructor,
    BdApiInstance,
    PatcherStatic,
    PatcherInstance,
    DataStatic,
    DataInstance,
    DOMStatic,
    DOMInstance,
    WebpackAPI,
    UIAPI,
    ReactUtilsAPI,
    UtilsAPI,
    AddonAPI,
    ContextMenuAPI,
    ComponentsAPI,
    CommandAPIStatic,
    CommandAPIInstance,
    LoggerStatic,
    LoggerInstance,
};
