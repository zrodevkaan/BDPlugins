/**
 * @name Signal
 * @author Kaan
 * @version 1.0.1
 * @description doggy sucks ;p
 */

const {Webpack, Data, Utils, Components} = new BdApi('Signal');

const [settings, setSettings] = Utils.createSignal(Data.load('settings') || [{
    id: 'dick',
    value: 'what?'
}, {id: 'dick2', value: true}], {equals: false});

const SettingsComp = () => {
    const staticSettings = settings();
    return staticSettings.map(x => {
        return <input
            type={'checkbox'}
            checked={x.value}
            onChange={(newValue) => {
                x.value = newValue.currentTarget.checked;
                setSettings(settings());
            }}
        />
    });
}

export default class Signal {
    start() {

    }

    stop() {
    }

    getSettingsPanel() {
        return <SettingsComp/>
    }
}