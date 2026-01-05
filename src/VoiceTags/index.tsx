/**
 * @name VoiceTags
 * @description Displays if someone is in your current voice channel.
 * @author Kaan
 * @version 1.0.0
 */
import type {MessageJSON} from "discord-types/general";

const {Webpack, Hooks, Utils, Patcher, DOM, Components, Data} = new BdApi("VoiceTags")
const {Stores} = Webpack
const {SortedVoiceStateStore, SelectedChannelStore, UserStore, ChannelStore} = Stores;
import css from './index.css?raw';

const MessageHeader = Webpack.getModule(Webpack.Filters.byStrings('decorations', 'withMentionPrefix'), {raw: true}).exports

const SVG = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
    <path fill="currentColor"
          d="M8 24q-.425 0-.712-.288T7 23t.288-.712T8 22t.713.288T9 23t-.288.713T8 24m4 0q-.425 0-.712-.288T11 23t.288-.712T12 22t.713.288T13 23t-.288.713T12 24m4 0q-.425 0-.712-.288T15 23t.288-.712T16 22t.713.288T17 23t-.288.713T16 24m-4-10q-1.25 0-2.125-.875T9 11V5q0-1.25.875-2.125T12 2t2.125.875T15 5v6q0 1.25-.875 2.125T12 14m-1 6v-2.1q-2.3-.3-3.937-1.925t-1.988-3.95q-.05-.425.225-.725T6 11t.713.288T7.1 12q.35 1.75 1.738 2.875T12 16q1.8 0 3.175-1.137T16.9 12q.1-.425.388-.712T18 11t.7.3t.225.725q-.35 2.275-1.975 3.925T13 17.9V20q0 .425-.288.713T12 21t-.712-.288T11 20"/>
</svg>

function BotHeader({text}) {
    return (
        <span className={'top-badge'}>
            <span className={'badge-holder'}>
                <SVG/>
                {text}
            </span>
        </span>
    );
}

const DataStore = new Proxy({}, {
    get: (target, key) => {
        return Data.load(key);
    },
    set: (_, key, value) => {
        Data.save(key, value);
        return true;
    },
    deleteProperty: (_, key) => {
        Data.delete(key);
        return true;
    }
});

const VoiceSettingStore = new class VoiceSettingStore extends Utils.Store {
    private text: string = DataStore.text || "In Voice"

    setText(string: string) {
        this.text = string
        DataStore.text = this.text
        this.emitChange()
    }

    getText() {
        return this.text
    }
}

function BotTagInVoice({message}: {message: MessageJSON}) {
    const selectedChannel = Hooks.useStateFromStores([SelectedChannelStore], () => SelectedChannelStore.getVoiceChannelId())
    const client = Hooks.useStateFromStores([UserStore], () => UserStore.getCurrentUser())
    const channel = Hooks.useStateFromStores([ChannelStore], () => SelectedChannelStore.getVoiceChannelId() ? ChannelStore.getChannel(selectedChannel) : null)
    const voiceStates = Hooks.useStateFromStores([SortedVoiceStateStore], () => channel ? SortedVoiceStateStore.getVoiceStatesForChannel(channel) : {})
    const updatedText = Hooks.useStateFromStores([VoiceSettingStore], () => VoiceSettingStore.getText())

    if (!selectedChannel) return null;
    if (client.id === message.author.id) return null;

    const values = Object.values(voiceStates)

    return values.findIndex(x => x.user?.id === message.author.id) !== -1 && <BotHeader text={updatedText}/>
}

export default class {
    start() {
        DOM.addStyle('VoiceTags', css)
        Patcher.after(MessageHeader, 'Z', (a, [props], res) => {
            try {
                const d = props.decorations = props.decorations || []
                const targets = Array.isArray(d) ? [d] : [d[0] ||= [], d[1] ||= []]
                targets.forEach(arr => arr.unshift(<BotTagInVoice {...props} />))
            } catch(e) {}
        })
    }

    getSettingsPanel() {
        return () => {
            return <div>
                <Components.Text size={"bd-text-16"}>{"Set Voice Text"}</Components.Text>
                <Components.TextInput value={VoiceSettingStore.getText()} onChange={(e) => VoiceSettingStore.setText(e)}></Components.TextInput>
            </div>
        }
    }

    stop() {
        Patcher.unpatchAll()
        DOM.removeStyle('VoiceTags')
    }
}