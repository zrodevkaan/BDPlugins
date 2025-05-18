/**
 * @name FileNameRandomization
 * @author kaan
 * @version 1.2.1
 * @description Randomizes uploaded file names for enhanced privacy and organization. Users can opt for a unique random string, a Unix timestamp, or a custom format.
 */

const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const {React, Webpack, Patcher, Data} = new BdApi('FileNameRandomization');
const FormItem = Webpack.getByStrings("case\"legend\"", {searchExports: true})
const {
    FormSwitch, FormTitle, TextInput, FormText, SearchableSelect
} = Webpack.getMangled(/ConfirmModal:\(\)=>.{1,3}.ConfirmModal/, {
    FormSwitch: x => x.toString?.().includes('disabledText'),
    SearchableSelect: x => x.render?.toString?.().includes(",renderCustomPill:"),
    TextInput: Webpack.Filters.byStrings(".error]:this.hasError()"),
    FormText: Webpack.Filters.byStrings(".SELECTABLE),", ".DISABLED:"),
    FormTitle: Webpack.Filters.byStrings('["defaultMargin".concat', '="h5"'),
    FormItem: Webpack.Filters.byStrings('.fieldWrapper:void 0'),
    openModal: Webpack.Filters.byStrings('onCloseRequest', 'onCloseCallback', 'onCloseCallback', 'instant', 'backdropStyle')
})
const {useState, useEffect} = React; // Added useEffect

const Toolbar = Webpack.getBySource(/spoiler:!.{1,3}.spoiler/)
const FileUploads = Webpack.getByKeys("uploadFiles")
const Margins = Webpack.getByKeys('marginBottom40', 'marginTop4');

const ToolbarButton = Webpack.getByStrings('actionBarIcon')

const FoodIcon = ({size = 24, color = "var(--interactive-normal)", ...props}) => {
    return React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", ...props
    }, React.createElement("path", {
        fill: color,
        fillRule: "evenodd",
        d: "m4.614 8.545l-.426 1.705H2a.75.75 0 0 0 0 1.5h20a.75.75 0 0 0 0-1.5h-2.187l-.427-1.705c-.546-2.183-.818-3.274-1.632-3.91C16.94 4 15.815 4 13.565 4h-3.13c-2.25 0-3.375 0-4.189.635c-.814.636-1.087 1.727-1.632 3.91M6.5 21a3.5 3.5 0 0 0 3.384-2.604l1.11-.555a2.25 2.25 0 0 1 2.012 0l1.11.555A3.501 3.501 0 0 0 21 17.5a3.5 3.5 0 0 0-6.91-.794l-.413-.206a3.75 3.75 0 0 0-3.354 0l-.413.206A3.501 3.501 0 0 0 3 17.5A3.5 3.5 0 0 0 6.5 21",
        clipRule: "evenodd"
    }));
};

const IncognitoButton = ({ pluginInstance }) => {
    const [isExempt, setIsExempt] = useState(pluginInstance.isNextUploadExempt);

    useEffect(() => {
        const updater = () => setIsExempt(pluginInstance.isNextUploadExempt);
        const unsubscribe = pluginInstance.registerUIUpdater(updater);
        return unsubscribe; // Cleanup subscription
    }, [pluginInstance]);

    const handleClick = () => {
        pluginInstance.toggleExemption();
    };

    const isRandomizationActive = !isExempt;
    const iconColor = isRandomizationActive ? "var(--interactive-normal)" : 'var(--status-danger)';
    const tooltipMessage = isRandomizationActive ? 'Randomization (Enabled)' : 'Randomization (Disabled for next upload)';

    return React.createElement(ToolbarButton, {
        tooltip: tooltipMessage,
        active: isRandomizationActive, // Or some other prop ToolbarButton uses
        onClick: handleClick
    }, React.createElement(FoodIcon, {
        color: iconColor
    }));
};

class FileNameRandomization {

    constructor() {
        this.defaultSettings = {
            useTimestamp: false,
            prefix: '',
            suffix: '',
            randomLength: 10,
            customFormat: '{prefix}{random}{suffix}',
            preserveOriginalName: false,
            caseOption: 'mixed',
        };
        this.isNextUploadExempt = false; // True if the next upload should skip randomization
        this.uiUpdateCallbacks = new Set(); // To store UI update callbacks
    }

    // Method to allow UI components to subscribe to state changes
    registerUIUpdater(callback) {
        this.uiUpdateCallbacks.add(callback);
        return () => this.uiUpdateCallbacks.delete(callback); // Return an unsubscribe function
    }

    // Method to notify subscribed UI components of a state change
    notifyUIUpdate() {
        for (const cb of this.uiUpdateCallbacks) {
            try {
                cb();
            } catch (error) {
                console.error("FileNameRandomization: Error in UI update callback:", error);
            }
        }
    }

    // Method to toggle the exemption state
    toggleExemption() {
        this.isNextUploadExempt = !this.isNextUploadExempt;
        this.notifyUIUpdate(); // Notify button to re-render
    }

    start() {
        this.Main = Patcher.before(FileUploads, "uploadFiles", this.handleFileUpload.bind(this));

        Patcher.after(Toolbar, 'Z', (_, __, returnValue) => {
            if (returnValue?.props?.actions?.props?.children) {
                // Pass the plugin instance to the button
                const incognitoButtonElement = React.createElement(IncognitoButton, { pluginInstance: this });
                returnValue.props.actions.props.children.unshift(incognitoButtonElement);
            }
        });
    }

    stop() {
        Patcher.unpatchAll();
        this.uiUpdateCallbacks.clear(); // Clear callbacks on stop
    }

    handleFileUpload(_, args) {
        // Check if the current upload should be exempt
        if (this.isNextUploadExempt) {
            this.isNextUploadExempt = false; // Reset the flag for subsequent uploads
            this.notifyUIUpdate(); // Update the button to show "Enabled" state again
            return; // Skip randomization for this upload
        }

        // Proceed with randomization if not exempt
        for (const file of args[0].uploads) {
            file.filename = this.generateFilename(file.filename);
        }
    }

    getSetting(key) {
        return Data.load(key) ?? this.defaultSettings[key];
    }

    setSetting(key, value) {
        return Data.save(key, value);
    }

    generateFilename(originalFilename) {
        const settings = Object.keys(this.defaultSettings).reduce((acc, key) => {
            acc[key] = this.getSetting(key) ?? this.defaultSettings[key];
            return acc;
        }, {});

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
        return () => {
            const [useTimestamp, setUseTimestamp] = useState(this.getSetting('useTimestamp'));
            const [prefix, setPrefix] = useState(this.getSetting('prefix') || '');
            const [suffix, setSuffix] = useState(this.getSetting('suffix') || '');
            const [randomLength, setRandomLength] = useState(this.getSetting('randomLength') || 10);
            const [customFormat, setCustomFormat] = useState(this.getSetting('customFormat') || '{prefix}{random}{suffix}');
            const [preserveOriginalName, setPreserveOriginalName] = useState(this.getSetting('preserveOriginalName'));
            const [caseOption, setCaseOption] = useState(this.getSetting('caseOption') || 'mixed');

            const onSwitch = (id, value) => {
                this.setSetting(id, value);
                if (id === 'useTimestamp') setUseTimestamp(value);
                if (id === 'preserveOriginalName') setPreserveOriginalName(value);
            };

            const onChange = (id, value) => {
                this.setSetting(id, value);
                if (id === 'prefix') setPrefix(value);
                if (id === 'suffix') setSuffix(value);
                if (id === 'customFormat') setCustomFormat(value);
            };

            const onLengthChange = (value) => {
                const val = parseInt(value, 10);
                if (!isNaN(val) && val > 0) {
                    setRandomLength(val);
                    this.setSetting('randomLength', val);
                } else if (value === '') { // Allow clearing the input
                     setRandomLength('');
                     // Optionally decide if an empty string should save as default or a specific value
                }
            };

            const onCaseOptionChange = (value) => {
                setCaseOption(value);
                this.setSetting('caseOption', value);
            };

            return React.createElement("div", {}, React.createElement(FormSwitch, {
                note: 'Use a Unix timestamp instead of random characters.',
                value: useTimestamp,
                onChange: (e) => onSwitch('useTimestamp', e),
            }, "Use Unix Timestamp"), React.createElement(FormItem, {className: Margins.marginBottom40}, React.createElement(FormTitle, null, "Case Option"), React.createElement(SearchableSelect, {
                options: [{label: 'Mixed Case', value: 'mixed'}, {
                    label: 'Lowercase',
                    value: 'lowercase'
                }, {label: 'Uppercase', value: 'uppercase'},],
                value: caseOption,
                onChange: (value) => onCaseOptionChange(value),
            })), React.createElement(FormItem, {className: Margins.marginBottom40}, React.createElement(FormTitle, null, "Prefix"), React.createElement(TextInput, {
                value: prefix, onChange: (e) => onChange('prefix', e),
            })), React.createElement(FormItem, {className: Margins.marginBottom40}, React.createElement(FormTitle, null, "Suffix"), React.createElement(TextInput, {
                value: suffix, onChange: (e) => onChange('suffix', e),
            })), React.createElement(FormItem, {className: Margins.marginBottom40}, React.createElement(FormTitle, null, "Random String Length"), React.createElement(TextInput, {
                type: 'number', value: randomLength, onChange: (e) => onLengthChange(e),
            })), React.createElement(FormItem, {className: Margins.marginBottom40}, React.createElement(FormTitle, null, "Custom Format"), React.createElement(FormText, {}, "Use {prefix}, {suffix}, {timestamp}, {random}, and {original} as placeholders."), React.createElement(TextInput, {
                value: customFormat, onChange: (e) => onChange('customFormat', e),
            })), React.createElement(FormSwitch, {
                note: 'Include the original filename in the new name.',
                value: preserveOriginalName,
                onChange: (e) => onSwitch('preserveOriginalName', e),
            }, "Preserve Original Filename"));
        };
    }
}

module.exports = FileNameRandomization;