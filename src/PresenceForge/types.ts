export type Snowflake = string;

export enum ActivityType {
    PLAYING = 0,
    STREAMING = 1,
    LISTENING = 2,
    WATCHING = 3,
    CUSTOM = 4,
    COMPETING = 5,
    HANG = 6,
}

export enum StatusDisplayType {
    NAME = 0,
    STATE = 1,
    DETAILS = 2,
}

export type ActivityPlatformType =
    | "desktop"
    | "xbox"
    | "samsung"
    | "ios"
    | "android"
    | "embedded"
    | "ps4"
    | "ps5"
    | "meta_quest";

export enum ActivityFlags {
    INSTANCE = 1 << 0,
    JOIN = 1 << 1,
    SPECTATE = 1 << 2,
    JOIN_REQUEST = 1 << 3,
    SYNC = 1 << 4,
    PLAY = 1 << 5,
    PARTY_PRIVACY_FRIENDS = 1 << 6,
    PARTY_PRIVACY_VOICE_CHANNEL = 1 << 7,
    EMBEDDED = 1 << 8,
    CONTEXTLESS = 1 << 9,
}

export type HangStatusBase =
    | "chilling"
    | "gaming"
    | "focusing"
    | "brb"
    | "watching"
    | "custom";

export type HangStatusIconVariant = "illocons" | "twemoji" | "twemojimild";

export type HangStatusType = HangStatusBase | `${HangStatusBase}:${HangStatusIconVariant}`;

export type CustomStatusLabelType =
    | "listen"
    | "watch"
    | "play"
    | "question"
    | "think"
    | "love"
    | "excited"
    | "recommend";

export interface ActivityTimestamps {
    start?: string;
    end?: string;
}

export interface ActivityEmoji {
    name: string;
    id?: Snowflake;
    animated?: boolean;
}

export interface ActivityParty {
    id?: string;
    size?: [current_size: number, max_size: number];
}

export type ActivityAssetImage =
    | `mp:${string}`
    | `twitch:${string}`
    | `youtube:${string}`
    | `spotify:${string}`
    | (string & {});

export interface ActivityAssets {
    large_image?: ActivityAssetImage;
    large_text?: string;
    large_url?: string;
    small_image?: ActivityAssetImage;
    small_text?: string;
    small_url?: string;
    invite_cover_image?: ActivityAssetImage;
}

export interface ActivitySecrets {
    join?: string;
    spectate?: string;
    match?: string;
}

export interface ActivityMetadata {
    button_urls?: string[];
    artist_ids?: string[];
    album_id?: string;
    context_uri?: string;
    type?: "track" | "episode" | (string & {});
    [key: string]: unknown;
}

export interface HeadlessActivityBase {
    id: string
    name: string;
    type: ActivityType;
    application_id: Snowflake;
    platform: ActivityPlatformType;
    url?: string | null;
    supported_platforms?: ActivityPlatformType[];
    timestamps?: ActivityTimestamps;
    parent_application_id?: Snowflake;
    status_display_type?: StatusDisplayType | null;
    details?: string | null;
    details_url?: string;
    state?: string | null;
    state_url?: string;
    sync_id?: string;
    flags?: number;
    buttons?: string[];
    emoji?: ActivityEmoji | null;
    party?: ActivityParty;
    assets?: ActivityAssets;
    secrets?: ActivitySecrets;
    metadata?: ActivityMetadata;
    enabled: boolean;
}

export interface HeadlessCustomActivity extends HeadlessActivityBase {
    type: ActivityType.CUSTOM;
    name: "Custom Status";
    details?: CustomStatusLabelType | null;
}

export interface HeadlessHangActivity extends HeadlessActivityBase {
    type: ActivityType.HANG;
    name: "Hang Status";
    state?: HangStatusType | null;
    details?: string | null;
}

export interface HeadlessGenericActivity extends HeadlessActivityBase {
    type:
        | ActivityType.PLAYING
        | ActivityType.STREAMING
        | ActivityType.LISTENING
        | ActivityType.WATCHING
        | ActivityType.COMPETING;
}

export type HeadlessActivity =
    | HeadlessGenericActivity
    | HeadlessCustomActivity
    | HeadlessHangActivity;

export interface CreateHeadlessSessionParams {
    activities: [HeadlessActivity];
    token?: string;
}

export interface ReturnedActivity extends HeadlessActivityBase {
    id: string;
    created_at: string | number;
    session_id?: string | null;
}

export interface CreateHeadlessSessionResponse {
    activities: ReturnedActivity[];
    token: string;
}

export interface DeleteHeadlessSessionParams {
    token: string;
}

export const HEADLESS_SESSION_LIFETIME_MINUTES = 20;
export const REQUIRED_OAUTH2_SCOPE = "activities.write" as const;

export const HeadlessActivityLimits = {
    nameMin: 1,
    nameMax: 128,
    urlMax: 512,
    detailsMax: 128,
    detailsUrlMax: 256,
    stateMax: 128,
    stateUrlMax: 256,
    supportedPlatformsMax: 10,
    buttonsMax: 2,
    buttonUrlsMax: 2,
    partyIdMax: 128,
    assetImageMax: 313,
    assetTextMax: 128,
    assetUrlMax: 256,
    secretMax: 128,
    activitiesPerSession: 1,
} as const;

export const TYPE_LABELS: Record<number, string> = {
    [ActivityType.PLAYING]: "Playing",
    [ActivityType.STREAMING]: "Streaming",
    [ActivityType.LISTENING]: "Listening",
    [ActivityType.WATCHING]: "Watching",
    [ActivityType.COMPETING]: "Competing",
};