/**
 * BetterDiscord API Type Definitions
 * Global ambient declarations — no imports required.
 */

// ==================== React Stubs ====================
// Minimal stubs so we don't need to import react/react-dom
declare namespace React {
    type ReactNode = string | number | boolean | null | undefined | ReactElement | ReactFragment | ReactPortal;
    interface ReactElement<P = any> { type: any; props: P; key: string | null; }
    interface ReactFragment {}
    interface ReactPortal extends ReactElement { children: ReactNode; }
    type FC<P = {}> = FunctionComponent<P>;
    interface FunctionComponent<P = {}> { (props: P): ReactElement | null; displayName?: string; }
    type ComponentType<P = {}> = FunctionComponent<P> | ComponentClass<P>;
    interface ComponentClass<P = {}> { new(props: P): Component<P>; displayName?: string; }
    interface Component<P = {}, S = {}> { props: P; state: S; render(): ReactNode; }
    interface MemoExoticComponent<T extends ComponentType<any>> { type: T; }
    interface ForwardRefExoticComponent<P> { $$typeof: symbol; }
    interface LazyExoticComponent<T extends ComponentType<any>> { $$typeof: symbol; }
    interface MouseEvent { preventDefault(): void; stopPropagation(): void; }
}

declare namespace ReactDOM {
    function render(element: React.ReactElement, container: Element | null): void;
    function unmountComponentAtNode(container: Element): boolean;
}

// ==================== Fiber Stub ====================
interface Fiber {
    type: any;
    stateNode: any;
    return: Fiber | null;
    child: Fiber | null;
    sibling: Fiber | null;
    memoizedProps: any;
    memoizedState: any;
    pendingProps: any;
    key: string | null;
    ref: any;
    flags: number;
    tag: number;
    [key: string]: any;
}

// ==================== Webpack Module Types ====================
/** A loose Discord module — allows property access without casting. */
type DiscordModule = Record<string, any>;

type WebpackFilter = (module: DiscordModule, id: string, require: object) => boolean;
type ExportedOnlyFilter = (exports: DiscordModule) => boolean;

interface WebpackOptions {
    searchExports?: boolean;
    searchDefault?: boolean;
    defaultExport?: boolean;
}

interface WebpackLazyOptions extends WebpackOptions {
    signal?: AbortSignal;
}

interface WebpackFilters {
    byKeys(...keys: string[]): ExportedOnlyFilter;
    byPrototypeKeys(...props: string[]): ExportedOnlyFilter;
    byRegex(regex: RegExp): ExportedOnlyFilter;
    bySource(...searches: Array<RegExp | string>): WebpackFilter;
    byStrings(...strings: string[]): ExportedOnlyFilter;
    byDisplayName(name: string): ExportedOnlyFilter;
    byStoreName(name: string): ExportedOnlyFilter;
    combine(...filters: WebpackFilter[]): WebpackFilter;
    not(filter: WebpackFilter): WebpackFilter;
    byComponentType(filter: ExportedOnlyFilter): ExportedOnlyFilter;
}

interface WebpackAPI {
    /** A Proxy that returns the module source by ID. */
    modules: Record<PropertyKey, DiscordModule>;
    /** Proxy access to Discord's Flux stores. */
    Stores: Record<string, DiscordModule>;
    /** Series of filters to be used for finding webpack modules. */
    Filters: WebpackFilters;
    /** Gets a module and a specific key from that module. */
    getWithKey(filter: ExportedOnlyFilter, options?: WebpackOptions): [DiscordModule, string | undefined] | undefined;
    /** Gets a single module by filter. */
    getModule(filter: WebpackFilter, options?: WebpackOptions): DiscordModule | undefined;
    /** Gets all modules matching filter. */
    getModules(filter: WebpackFilter, options?: WebpackOptions): DiscordModule[];
    /** Gets multiple modules in a single pass. */
    getBulk(...queries: object[]): DiscordModule[];
    /** Gets multiple modules in a single pass with keyed results. */
    getBulkKeyed(queries: Record<string, object>): Record<string, DiscordModule>;
    /** Waits for a module to be loaded and returns it. */
    waitForModule(filter: WebpackFilter, options?: WebpackLazyOptions): Promise<DiscordModule | undefined>;
    /** Gets a module by regex filter. */
    getByRegex(regex: RegExp, options?: WebpackOptions): DiscordModule | undefined;
    /** Gets all modules by regex filter. */
    getAllByRegex(regex: RegExp, options?: WebpackOptions): DiscordModule[];
    /** Gets a mangled module by filter and maps specific exports. */
    getMangled(filter: WebpackFilter | string | RegExp, mangled: Record<string, ExportedOnlyFilter>, options?: WebpackOptions): Record<string, DiscordModule>;
    /** Gets a module by prototype keys. */
    getByPrototypeKeys(...args: (string | WebpackOptions)[]): DiscordModule | undefined;
    /** Gets all modules by prototype keys. */
    getAllByPrototypeKeys(...args: (string | WebpackOptions)[]): DiscordModule[];
    /** Gets a module by property keys. */
    getByKeys(...args: (string | WebpackOptions)[]): DiscordModule | undefined;
    /** Gets all modules by property keys. */
    getAllByKeys(...args: (string | WebpackOptions)[]): DiscordModule[];
    /** Gets a module by strings in its body. */
    getByStrings(...args: (string | WebpackOptions)[]): DiscordModule | undefined;
    /** Gets all modules by strings in their body. */
    getAllByStrings(...args: (string | WebpackOptions)[]): DiscordModule[];
    /** Gets a module by source content. */
    getBySource(...args: (string | RegExp | WebpackOptions)[]): DiscordModule | undefined;
    /** Gets all modules by source content. */
    getAllBySource(...args: (string | RegExp | WebpackOptions)[]): DiscordModule[];
    /** Gets a Discord store by name. */
    getStore(name: string): DiscordModule | undefined;
    /** Gets a module by its ID. */
    getById(id: PropertyKey): DiscordModule | undefined;
}

// ==================== Patcher Types ====================
type BeforeCallback<F extends (...a: any[]) => any = (...a: any[]) => any> = (
    thisObject: object,
    args: Parameters<F>
) => void;

type InsteadCallback<F extends (...a: any[]) => any = (...a: any[]) => any> = (
    thisObject: object,
    args: Parameters<F>,
    originalFunction: F
) => ReturnType<F>;

type AfterCallback<F extends (...a: any[]) => any = (...a: any[]) => any> = (
    thisObject: object,
    args: Parameters<F>,
    returnValue: ReturnType<F>
) => ReturnType<F> | void;

interface PatcherAPI {
    before<M extends object, K extends Extract<keyof M, string>>(
        moduleToPatch: M,
        functionName: K,
        callback: M[K] extends (...a: any[]) => any ? BeforeCallback<M[K]> : never
    ): (() => void) | null;
    instead<M extends object, K extends Extract<keyof M, string>>(
        moduleToPatch: M,
        functionName: K,
        callback: M[K] extends (...a: any[]) => any ? InsteadCallback<M[K]> : never
    ): (() => void) | null;
    after<M extends object, K extends Extract<keyof M, string>>(
        moduleToPatch: M,
        functionName: K,
        callback: M[K] extends (...a: any[]) => any ? AfterCallback<M[K]> : never
    ): (() => void) | null;
    getPatchesByCaller(caller: string): object[];
    unpatchAll(caller: string): void;
}

interface PatcherAPIUnbound extends PatcherAPI {
    before<M extends object, K extends Extract<keyof M, string>>(
        caller: string,
        moduleToPatch: M,
        functionName: K,
        callback: M[K] extends (...a: any[]) => any ? BeforeCallback<M[K]> : never
    ): (() => void) | null;
    instead<M extends object, K extends Extract<keyof M, string>>(
        caller: string,
        moduleToPatch: M,
        functionName: K,
        callback: M[K] extends (...a: any[]) => any ? InsteadCallback<M[K]> : never
    ): (() => void) | null;
    after<M extends object, K extends Extract<keyof M, string>>(
        caller: string,
        moduleToPatch: M,
        functionName: K,
        callback: M[K] extends (...a: any[]) => any ? AfterCallback<M[K]> : never
    ): (() => void) | null;
}

// ==================== Data Types ====================
interface DataAPI {
    save<T>(key: string, data: T): void;
    load<T>(key: string): T;
    recache(): Promise<boolean>;
    delete(key: string): void;
}

interface DataAPIUnbound {
    save<T>(pluginName: string, key: string, data: T): void;
    load<T>(pluginName: string, key: string): T;
    recache(pluginName: string): Promise<boolean>;
    delete(pluginName: string, key: string): void;
}

// ==================== DOM Types ====================
interface DOMAPI {
    readonly screenWidth: number;
    readonly screenHeight: number;
    addStyle(id: string, css: string): void;
    removeStyle(id?: string): void;
    onRemoved(node: HTMLElement, callback: () => void): () => void;
    onAdded(selector: string, callback: (element: Element) => void): () => void;
    animate(update: (progress: number) => void, duration: number, options?: { timing?: (fraction: number) => number }): () => void;
    createElement(tag: keyof HTMLElementTagNameMap, options?: { id?: string; className?: string }, ...children: Array<Node | string>): HTMLElement;
    parseHTML(html: string, fragment?: boolean): DocumentFragment | NodeList | HTMLElement;
}

// ==================== Logger Types ====================
interface LoggerAPI {
    stacktrace(message: string, error: Error): void;
    error(...message: unknown[]): void;
    warn(...message: unknown[]): void;
    info(...message: unknown[]): void;
    debug(...message: unknown[]): void;
    log(...message: unknown[]): void;
}

interface LoggerAPIUnbound {
    stacktrace(pluginName: string, message: string, error: Error): void;
    error(pluginName: string, ...message: unknown[]): void;
    warn(pluginName: string, ...message: unknown[]): void;
    info(pluginName: string, ...message: unknown[]): void;
    debug(pluginName: string, ...message: unknown[]): void;
    log(pluginName: string, ...message: unknown[]): void;
}

// ==================== UI Types ====================
interface ToastOptions {
    type?: "" | "info" | "success" | "danger" | "error" | "warning" | "warn";
    icon?: boolean;
    timeout?: number;
    forceShow?: boolean;
}

interface NoticeOptions {
    type?: "info" | "error" | "warning" | "success";
    buttons?: Array<{ label: string; onClick: () => void }>;
    timeout?: number;
}

interface TooltipOptions {
    style?: "primary" | "info" | "success" | "warn" | "danger";
    side?: "top" | "right" | "bottom" | "left";
    preventFlip?: boolean;
    disabled?: boolean;
}

interface Notification {
    title: string;
    content?: string | React.ReactNode;
    type?: "info" | "success" | "warning" | "error";
    duration?: number;
    icon?: (() => React.ReactNode) | null;
    actions?: Array<{ label: string; onClick: () => void }>;
}

interface ChangelogChange {
    title: string;
    type: "fixed" | "added" | "progress" | "improved";
    items: string[];
    blurb?: string;
}

interface ChangelogProps {
    title: string;
    subtitle: string;
    blurb?: string;
    banner?: string;
    video?: string;
    poster?: string;
    footer?: string | React.ReactNode;
    changes?: ChangelogChange[];
}

interface SettingConfig {
    type: "dropdown" | "number" | "switch" | "text" | "slider" | "radio" | "keybind" | "color" | "custom" | "category";
    id: string;
    name: string;
    note?: string;
    value?: unknown;
    children?: React.ReactNode;
    onChange?: (value: unknown) => void;
    disabled?: boolean;
    inline?: boolean;
    shown?: boolean;
    [key: string]: unknown;
}

interface UIAPI {
    alert(title: string, content: string | React.ReactNode | Array<string | React.ReactNode>): void;
    showNotification(notification: Notification): () => void;
    createTooltip(node: HTMLElement, content: string | HTMLElement, options?: TooltipOptions): { element: HTMLElement; show(): void; hide(): void };
    showConfirmationModal(
        title: string,
        content: string | React.ReactNode | Array<string | React.ReactNode>,
        options?: {
            danger?: boolean;
            confirmText?: string;
            cancelText?: string;
            onConfirm?: () => void;
            onCancel?: () => void;
            onClose?: () => void;
        }
    ): string;
    showChangelogModal(options: ChangelogProps): string;
    showInviteModal(inviteCode: string): void;
    showToast(content: string, options?: ToastOptions): void;
    showNotice(content: string, options?: NoticeOptions): () => void;
    openDialog(options: {
        mode?: "open" | "save";
        defaultPath?: string;
        filters?: Array<{ name: string; extensions: string[] }>;
        title?: string;
        message?: string;
        showOverwriteConfirmation?: boolean;
        showHiddenFiles?: boolean;
        promptToCreate?: boolean;
        openDirectory?: boolean;
        openFile?: boolean;
        multiSelections?: boolean;
        modal?: boolean;
    }): Promise<{ cancelled: boolean; filePath?: string; filePaths?: string[] }>;
    buildSettingItem(setting: SettingConfig): React.ReactNode;
    buildSettingsPanel(props: {
        settings: SettingConfig[];
        onChange: (category: string | null, id: string, value: unknown) => void;
        onDrawerToggle?: (id: string, state: boolean) => void;
        getDrawerState?: (id: string, defaultState: boolean) => boolean;
    }): React.ReactNode;
}

// ==================== Utils Types ====================
interface UtilsAPI {
    findInTree(tree: object, searchFilter: (obj: object) => boolean, options?: { walkable?: string[] | null; ignore?: string[] }): object | undefined;
    forceLoad(id: number | string): Promise<object[]>;
    extend(extendee: object, ...extenders: object[]): object;
    debounce<T extends (...args: unknown[]) => unknown>(executor: T, delay: number): T & { cancel(): void; flush(): void };
    escapeHTML(html: string): string;
    className(...args: unknown[]): string;
    getNestedValue<R = unknown>(object: Record<string | number | symbol, unknown>, path: string): R;
    semverCompare(currentVersion: string, newVersion: string): number;
}

// ==================== ReactUtils Types ====================
interface ReactUtilsAPI {
    getInternalInstance(node: HTMLElement): Fiber | null;
    getOwnerInstance(node: HTMLElement | undefined, options?: { include?: string[]; exclude?: string[]; filter?: (owner: object) => boolean }): object | undefined | null;
    wrapElement(element: HTMLElement | HTMLElement[]): React.ComponentType;
    wrapInHooks<T extends React.FC>(
        functionComponent: T | React.MemoExoticComponent<T> | React.ForwardRefExoticComponent<T>,
        customPatches?: Partial<Record<string, object>>
    ): React.FunctionComponent<object>;
    getType<T extends React.FC>(elementType: T | React.MemoExoticComponent<T> | React.ForwardRefExoticComponent<T> | React.LazyExoticComponent<T>): T;
}

// ==================== ContextMenu Types ====================
interface MenuItemProps {
    type?: "text" | "submenu" | "toggle" | "radio" | "custom" | "separator" | "control";
    label?: string;
    id?: string;
    action?: (event?: React.MouseEvent) => void;
    onClick?: (event?: React.MouseEvent) => void;
    active?: boolean;
    checked?: boolean;
    danger?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
    render?: () => React.ReactNode;
    items?: MenuItemProps[];
    [key: string]: unknown;
}

interface ContextMenuAPI {
    patch(navId: string | RegExp, callback: (res: React.ReactElement, props: object, instance?: React.Component) => void): () => void;
    unpatch(navId: string | RegExp, callback: (res: React.ReactElement, props: object, instance?: React.Component) => void): void;
    buildItem(props: MenuItemProps): React.ReactNode;
    buildMenuChildren(setup: MenuItemProps[]): React.ReactNode[];
    buildMenu(setup: MenuItemProps[]): (props: object) => React.ReactNode;
    open(event: MouseEvent, menuComponent: React.ComponentType, config?: { position?: "right" | "left"; align?: "top" | "bottom"; onClose?: () => void }): void;
    close(): void;
    Separator: React.ComponentType;
    CheckboxItem: React.ComponentType<object>;
    RadioItem: React.ComponentType<object>;
    ControlItem: React.ComponentType<object>;
    Group: React.ComponentType<object>;
    Item: React.ComponentType<object>;
    Menu: React.ComponentType<object>;
}

// ==================== Command Types ====================
interface CommandOption {
    name: string;
    description?: string;
    required?: boolean;
    /** 3=STRING 4=INTEGER 5=BOOLEAN 6=USER 7=CHANNEL 8=ROLE 9=MENTIONABLE 10=NUMBER 11=ATTACHMENT */
    type: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
    maxLength?: number;
    minLength?: number;
    maxValue?: number;
    minValue?: number;
    choices?: Array<{ name: string; value: string | number }>;
}

interface Command {
    id: string;
    name: string;
    description?: string;
    options?: CommandOption[];
    execute(options: object[], context: { channel: object; guild?: object }): void;
    predicate?(): boolean;
}

interface CommandAPI {
    register(command: Command): (() => void) | undefined;
    unregister(id: string): void;
    unregisterAll(): void;
    getCommandsByCaller(): object[];
}

interface CommandAPIUnbound {
    register(caller: string, command: Command): (() => void) | undefined;
    unregister(caller: string, id: string): void;
    unregisterAll(caller: string): void;
    getCommandsByCaller(caller: string): object[];
}

// ==================== Addon Types ====================
interface Addon {
    added: number;
    author: string;
    authorId?: string;
    authorLink?: string;
    description: string;
    donate?: string;
    filename: string;
    format: string;
    id: string;
    invite?: string;
    modified: number;
    name: string;
    partial?: boolean;
    patreon?: string;
    size: number;
    slug: string;
    source?: string;
    version: string;
    website?: string;
}

interface AddonAPI {
    readonly folder: string;
    isEnabled(idOrFile: string): boolean;
    enable(idOrAddon: string): void;
    disable(idOrAddon: string): void;
    toggle(idOrAddon: string): void;
    reload(idOrFileOrAddon: string): void;
    get(idOrFile: string): Addon | undefined;
    getAll(): Addon[];
}

// ==================== Hooks Types ====================
interface HooksAPI {
    useForceUpdate(): () => void;
    useStateFromStores<T>(stores: object[], mapper: () => T, deps?: unknown[]): T;
    useData<T>(key: string): T;
}

interface HooksAPIUnbound {
    useForceUpdate(): () => void;
    useStateFromStores<T>(stores: object[], mapper: () => T, deps?: unknown[]): T;
    useData<T>(pluginName: string, key: string): T;
}

// ==================== Net Types ====================
interface NetAPI {
    fetch(input: string | URL | Request, init?: RequestInit & { timeout?: number; maxRedirects?: number; rejectUnauthorized?: boolean }): Promise<Response>;
}

// ==================== Components Types ====================
interface ComponentsAPI {
    readonly Tooltip: React.ComponentType<object>;
    readonly ColorInput: React.ComponentType<object>;
    readonly DropdownInput: React.ComponentType<object>;
    readonly SettingItem: React.ComponentType<object>;
    readonly KeybindInput: React.ComponentType<object>;
    readonly NumberInput: React.ComponentType<object>;
    readonly RadioInput: React.ComponentType<object>;
    readonly SearchInput: React.ComponentType<object>;
    readonly SliderInput: React.ComponentType<object>;
    readonly SwitchInput: React.ComponentType<object>;
    readonly TextInput: React.ComponentType<object>;
    readonly SettingGroup: React.ComponentType<object>;
    readonly ErrorBoundary: React.ComponentType<object>;
    readonly Text: React.ComponentType<object>;
    readonly Flex: React.ComponentType<object>;
    readonly Button: React.ComponentType<object>;
    readonly Spinner: React.ComponentType<object>;
}

// ==================== Common Modules Types ====================
interface CommonModulesAPI {
    Helpers: {
        FluxDispatch: object;
        Parser: object;
        MessageActions: object;
        CloudUpload: object;
        Moment: object;
        Hljs: object;
        Snowflake: object;
        Lodash: object;
        CssVars: object;
        Intl: object;
        Flux: object;
        Permissions: object;
        ComponentDispatch: object;
        ImageUtils: object;
        ReactSpring: object;
        Fetching: {
            fetchProfile: object;
            getUser: object;
        };
        ModalActions: {
            openModalLazy: object;
            openModal: object;
            closeModal: object;
            closeAllModals: object;
            updateModal: object;
        };
        Navigation: {
            transitionTo: object;
            replace: object;
            goBack: object;
            goForward: object;
            transitionToGuild: object;
        };
        Color: object;
        Electron: object;
    };
    Components: {
        Popout: React.ComponentType<object>;
        Clickable: React.ComponentType<object>;
        Slider: React.ComponentType<object>;
        Modal: React.ComponentType<object>;
        FormNotice: React.ComponentType<object>;
        LoadingPopout: React.ComponentType<object>;
        Progress: React.ComponentType<object>;
        Spinner: React.ComponentType<object>;
        TextArea: React.ComponentType<object>;
        CopyInput: React.ComponentType<object>;
        SearchableSelect: React.ComponentType<object>;
        Switch: React.ComponentType<object>;
        FormSwitch: React.ComponentType<object>;
        Text: React.ComponentType<object>;
        Flex: React.ComponentType<object>;
        Scroller: React.ComponentType<object>;
        ProgressCircle: React.ComponentType<object>;
        KeyCombo: React.ComponentType<object>;
        Avatar: React.ComponentType<object>;
        Slides: React.ComponentType<object>;
        AnimatedAvatar: React.ComponentType<object>;
        Button: React.ComponentType<object>;
        CalendarPicker: React.ComponentType<object>;
    };
}

// ==================== BdApi ====================
declare class BdApi {
    constructor(pluginName: string);

    Patcher: PatcherAPI;
    Data: DataAPI;
    DOM: DOMAPI;
    Logger: LoggerAPI;
    Commands: CommandAPI;
    React: typeof React;
    ReactDOM: typeof ReactDOM;
    version: string;

    get Plugins(): AddonAPI;
    get Themes(): AddonAPI;
    get Webpack(): WebpackAPI;
    get Utils(): UtilsAPI;
    get UI(): UIAPI;
    get ReactUtils(): ReactUtilsAPI;
    get ContextMenu(): ContextMenuAPI;
    get Components(): ComponentsAPI;
    get Common(): CommonModulesAPI;
    get Net(): NetAPI;
    get Hooks(): HooksAPI;

    static Plugins: AddonAPI;
    static Themes: AddonAPI;
    static Patcher: PatcherAPIUnbound;
    static Webpack: WebpackAPI;
    static Data: DataAPIUnbound;
    static UI: UIAPI;
    static ReactUtils: ReactUtilsAPI;
    static Utils: UtilsAPI;
    static DOM: DOMAPI;
    static ContextMenu: ContextMenuAPI;
    static Components: ComponentsAPI;
    static Common: CommonModulesAPI;
    static Commands: CommandAPIUnbound;
    static Net: NetAPI;
    static Logger: LoggerAPIUnbound;
    static Hooks: HooksAPIUnbound;
    static React: typeof React;
    static ReactDOM: typeof ReactDOM;
    static version: string;
}

declare global {
    const BdApi: typeof BdApi;
}

declare namespace JSX {
    type Element = React.ReactElement;
    interface ElementClass extends React.Component {}
    interface ElementAttributesProperty { props: {}; }
    interface ElementChildrenAttribute { children: {}; }
    interface IntrinsicAttributes {}
    interface IntrinsicClassAttributes<T> {}
    interface IntrinsicElements {
        // HTML
        a: any; abbr: any; address: any; area: any; article: any; aside: any; audio: any;
        b: any; base: any; bdi: any; bdo: any; blockquote: any; body: any; br: any; button: any;
        canvas: any; caption: any; cite: any; code: any; col: any; colgroup: any;
        data: any; datalist: any; dd: any; del: any; details: any; dfn: any; dialog: any; div: any; dl: any; dt: any;
        em: any; embed: any;
        fieldset: any; figcaption: any; figure: any; footer: any; form: any;
        h1: any; h2: any; h3: any; h4: any; h5: any; h6: any; head: any; header: any; hgroup: any; hr: any; html: any;
        i: any; iframe: any; img: any; input: any; ins: any;
        kbd: any;
        label: any; legend: any; li: any; link: any;
        main: any; map: any; mark: any; menu: any; meta: any; meter: any;
        nav: any; noscript: any;
        object: any; ol: any; optgroup: any; option: any; output: any;
        p: any; picture: any; pre: any; progress: any;
        q: any;
        rp: any; rt: any; ruby: any;
        s: any; samp: any; script: any; search: any; section: any; select: any; slot: any; small: any;
        source: any; span: any; strong: any; style: any; sub: any; summary: any; sup: any;
        table: any; tbody: any; td: any; template: any; textarea: any; tfoot: any; th: any; thead: any;
        time: any; title: any; tr: any; track: any;
        u: any; ul: any;
        var: any; video: any;
        wbr: any;
        // SVG
        svg: any; animate: any; circle: any; clipPath: any; defs: any; desc: any; ellipse: any;
        feBlend: any; feColorMatrix: any; feComponentTransfer: any; feComposite: any;
        feConvolveMatrix: any; feDiffuseLighting: any; feDisplacementMap: any; feDistantLight: any;
        feFlood: any; feFuncA: any; feFuncB: any; feFuncG: any; feFuncR: any; feGaussianBlur: any;
        feImage: any; feMerge: any; feMergeNode: any; feMorphology: any; feOffset: any;
        fePointLight: any; feSpecularLighting: any; feSpotLight: any; feTile: any; feTurbulence: any;
        filter: any; foreignObject: any; g: any; image: any; line: any; linearGradient: any;
        marker: any; mask: any; metadata: any; path: any; pattern: any; polygon: any; polyline: any;
        radialGradient: any; rect: any; stop: any; switch: any; symbol: any;
        text: any; textPath: any; tspan: any; use: any; view: any;
        [key: string]: any;
    }
}