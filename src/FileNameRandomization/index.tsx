/**
 * @name FileNameRandomization
 * @author kaan
 * @version 2.1.0
 * @description Randomizes uploaded file names for enhanced privacy and organization. Users can opt for a unique random string, a Unix timestamp, or a custom format.
 */
const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const {React, Webpack, Patcher, Components, Data} = new BdApi('FileNameRandomization');
const {SettingGroup, SettingItem, SwitchInput, RadioInput, TextInput} = Components;
const {useState, useEffect} = React;

const Toolbar = Webpack.getBySource(/spoiler:!.{1,3}.spoiler/)
const ToolbarButton = Webpack.getByStrings('stopPropagation(),','onClick:','dangerous')

const FoodIcon = ({size = 24, color = "var(--interactive-icon-default)", ...props}) => {
    return React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", ...props
    }, React.createElement("path", {
        fill: color,
        fillRule: "evenodd",
        d: "m4.614 8.545l-.426 1.705H2a.75.75 0 0 0 0 1.5h20a.75.75 0 0 0 0-1.5h-2.187l-.427-1.705c-.546-2.183-.818-3.274-1.632-3.91C16.94 4 15.815 4 13.565 4h-3.13c-2.25 0-3.375 0-4.189.635c-.814.636-1.087 1.727-1.632 3.91M6.5 21a3.5 3.5 0 0 0 3.384-2.604l1.11-.555a2.25 2.25 0 0 1 2.012 0l1.11.555A3.501 3.501 0 0 0 21 17.5a3.5 3.5 0 0 0-6.91-.794l-.413-.206a3.75 3.75 0 0 0-3.354 0l-.413.206A3.501 3.501 0 0 0 3 17.5A3.5 3.5 0 0 0 6.5 21",
        clipRule: "evenodd"
    }));
};

const defaultSettings = {
    useTimestamp: false,
    prefix: '',
    suffix: '',
    randomLength: 10,
    customFormat: '{prefix}{random}{suffix}',
    preserveOriginalName: false,
    caseOption: 'mixed',
    shouldIncognito: false,
};

class SettingsStore extends BdApi.Utils.Store {
    constructor(defaults) {
        super();
        this.defaults = defaults;
        this.state = Object.keys(defaults).reduce((acc, key) => {
            acc[key] = Data.load(key) ?? defaults[key];
            return acc;
        }, {});
    }

    getAll() {
        return this.state;
    }

    get(key) {
        return this.state[key];
    }

    set(key, value) {
        this.state = {...this.state, [key]: value};
        Data.save(key, value);
        this.emitChange();
    }
}

const settingsStore = new SettingsStore(defaultSettings);

function useSettingsStore() {
    const [state, setState] = useState(settingsStore.getAll());

    useEffect(() => {
        const onChange = () => setState(settingsStore.getAll());
        settingsStore.addChangeListener(onChange);
        return () => settingsStore.removeChangeListener(onChange);
    }, []);

    return state;
}

const IncognitoButton = () => {
    const {shouldIncognito} = useSettingsStore();

    const color = shouldIncognito ? "var(--interactive-icon-default)" : 'var(--status-danger)'

    return React.createElement(ToolbarButton, {
        tooltip: shouldIncognito ? 'Randomization (Enabled)' : 'Randomization (Disabled)', color: shouldIncognito, onClick: () => {
            settingsStore.set('shouldIncognito', !shouldIncognito);
        }
    }, React.createElement(FoodIcon, {
        color
    }));
};

const caseOptions = [
    {name: 'Mixed Case', value: 'mixed', desc: 'Leave character case as generated.'},
    {name: 'Lowercase', value: 'lowercase', desc: 'Force the generated name to lowercase.'},
    {name: 'Uppercase', value: 'uppercase', desc: 'Force the generated name to uppercase.'}
];

const SettingsPanel = () => {
    const {useTimestamp, prefix, suffix, randomLength, customFormat, preserveOriginalName, caseOption} = useSettingsStore();

    const onFieldChange = (key, value) => settingsStore.set(key, value);

    return (
        <div>
            <SettingGroup name="General" collapsible={false} shown={true}>
                <SettingItem name="Use Unix Timestamp" note="Use a Unix timestamp instead of random characters." inline={true}>
                    <SwitchInput defaultValue={useTimestamp} onChange={(e) => onFieldChange('useTimestamp', e)} />
                </SettingItem>

                <SettingItem name="Preserve Original Filename" note="Include the original filename in the new name." inline={true}>
                    <SwitchInput defaultValue={preserveOriginalName} onChange={(e) => onFieldChange('preserveOriginalName', e)} />
                </SettingItem>
            </SettingGroup>

            <SettingGroup name="Formatting" collapsible={false} shown={true}>
                <SettingItem name="Case Option" note="Choose how the generated filename casing is applied.">
                    <RadioInput
                        options={caseOptions}
                        defaultValue={caseOption}
                        onChange={(e) => onFieldChange('caseOption', e)}
                    />
                </SettingItem>

                <SettingItem name="Prefix" inline={true}>
                    <TextInput defaultValue={prefix} onChange={(e) => onFieldChange('prefix', e)} />
                </SettingItem>

                <SettingItem name="Suffix" inline={true}>
                    <TextInput defaultValue={suffix} onChange={(e) => onFieldChange('suffix', e)} />
                </SettingItem>

                <SettingItem name="Random String Length" inline={true}>
                    <TextInput type="number" defaultValue={randomLength} onChange={(e) => onFieldChange('randomLength', e)} />
                </SettingItem>

                <SettingItem name="Custom Format" note="Use {prefix}, {suffix}, {timestamp}, {random}, and {original} as placeholders.">
                    <TextInput defaultValue={customFormat} onChange={(e) => onFieldChange('customFormat', e)} />
                </SettingItem>
            </SettingGroup>
        </div>
    );
};

class FileNameRandomization {

    start() {
        this.Main = Patcher.before(Webpack.getByKeys('_sendMessage'), "_sendMessage", this.handleFileUpload.bind(this));

        Patcher.after(Toolbar, 'A', (_, __, returnValue) => {
            if (returnValue?.props?.actions?.props?.children) {
                const incognitoButtonElement = React.createElement(IncognitoButton);
                returnValue.props.actions.props.children.unshift(incognitoButtonElement);
            }
        });
    }

    stop() {
        Patcher.unpatchAll();
    }

    handleFileUpload(_, args) {
        if (!settingsStore.get('shouldIncognito')) return;
        if (args[2]?.attachmentsToUpload?.length == 0) return;
        for (const file of args[2]?.attachmentsToUpload) {
            file.filename = this.generateFilename(file.filename);
        }
    }

    generateFilename(originalFilename) {
        const settings = settingsStore.getAll();

        const fileNameParts = originalFilename.split('.');

        let ext = '';
        let originalNameWithoutExt = originalFilename;

        if (fileNameParts.length > 1) {
            ext = fileNameParts.pop();
            originalNameWithoutExt = fileNameParts.join('.');

            if (ext) {
                ext = '.' + ext;
            }
        }

        let newName = settings.customFormat
            .replaceAll('{prefix}', settings.prefix)
            .replaceAll('{suffix}', settings.suffix)
            .replaceAll('{timestamp}', settings.useTimestamp ? Date.now().toString() : '')
            .replaceAll('{random}', this.generateRandomString(settings.randomLength))
            .replaceAll('{original}', settings.preserveOriginalName ? originalNameWithoutExt : '');

        newName = this.applyCaseOption(newName, settings.caseOption);

        return ext ? `${newName}${ext}` : newName;
    }

    generateRandomString(length) {
        let randomFilename = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomFilename += characters.charAt(randomIndex);
        }
        return randomFilename;
    }

    applyCaseOption(str, caseOption) {
        switch (caseOption) {
            case 'lowercase':
                return str.toLowerCase();
            case 'uppercase':
                return str.toUpperCase();
            default:
                return str;
        }
    }

    getSettingsPanel() {
        return () => <SettingsPanel />;
    }
}

module.exports = FileNameRandomization;