/**
 * @name FileNameRandomization
 * @author kaan
 * @version 1.1.7
 * @description Randomizes uploaded file names for enhanced privacy and organization. Users can opt for a unique random string, a Unix timestamp, or a custom format.
 */

const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const { React, Webpack, Patcher, Data } = BdApi;
const { FormSwitch, FormItem, FormTitle, TextInput, FormText, SearchableSelect } = Webpack.getByKeys('FormSwitch', 'FormItem', 'FormTitle', 'Select');
const { useState } = React;

const Margins = Webpack.getByKeys('marginBottom40', 'marginTop4');

class FileNameRandomization {

    constructor()
    {
        this.defaultSettings = {
            useTimestamp: false,
            prefix: '',
            suffix: '',
            randomLength: 10,
            customFormat: '{prefix}{random}{suffix}',
            preserveOriginalName: false,
            caseOption: 'mixed',
        };
    }

    start() {
        this.Main = Patcher.before(
            "FileNameRandomization",
            Webpack.getByKeys("uploadFiles"),
            "uploadFiles",
            this.handleFileUpload.bind(this)
        );
    }

    stop() {
        this.Main?.();
    }

    handleFileUpload(_, args) {
        for (const file of args[0].uploads) {
            file.filename = this.generateFilename(file.filename);
        }
    }

    getSetting(key) {
        return Data.load("FileNameRandomization", key) ?? false;
    }

    setSetting(key, value) {
        return Data.save("FileNameRandomization", key, value);
    }

    generateFilename(originalFilename) {
        const settings = Object.keys(this.defaultSettings).reduce((acc, key) => {
            acc[key] = this.getSetting(key) ?? this.defaultSettings[key];
            return acc;
        }, {});        
    
        console.log(settings)

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
            case 'lowercase': return str.toLowerCase();
            case 'uppercase': return str.toUpperCase();
            default: return str;
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
                setRandomLength(value);
                this.setSetting('randomLength', value);
            };

            const onCaseOptionChange = (value) => {
                setCaseOption(value);
                this.setSetting('caseOption', value);
            };

            return React.createElement(
                "div",
                {},
                React.createElement(FormSwitch, {
                    note: 'Use a Unix timestamp instead of random characters.',
                    value: useTimestamp,
                    onChange: (e) => onSwitch('useTimestamp', e),
                }, "Use Unix Timestamp"),
                React.createElement(FormItem, { className: Margins.marginBottom40 },
                    React.createElement(FormTitle, null, "Case Option"),
                    React.createElement(SearchableSelect, {
                        options: [
                            { label: 'Mixed Case', value: 'mixed' },
                            { label: 'Lowercase', value: 'lowercase' },
                            { label: 'Uppercase', value: 'uppercase' },
                        ],
                        value: caseOption,
                        onChange: (value) => onCaseOptionChange(value),
                    })
                ),
                React.createElement(FormItem, { className: Margins.marginBottom40 },
                    React.createElement(FormTitle, null, "Prefix"),
                    React.createElement(TextInput, {
                        value: prefix,
                        onChange: (e) => onChange('prefix', e),
                    })
                ),
                React.createElement(FormItem, { className: Margins.marginBottom40 },
                    React.createElement(FormTitle, null, "Suffix"),
                    React.createElement(TextInput, {
                        value: suffix,
                        onChange: (e) => onChange('suffix', e),
                    })
                ),
                React.createElement(FormItem, { className: Margins.marginBottom40 },
                    React.createElement(FormTitle, null, "Random String Length"),
                    React.createElement(TextInput, {
                        type: 'number',
                        value: randomLength,
                        onChange: (e) => onLengthChange(e),
                    })
                ),
                React.createElement(FormItem, { className: Margins.marginBottom40 },
                    React.createElement(FormTitle, null, "Custom Format"),
                    React.createElement(FormText, {}, "Use {prefix}, {suffix}, {timestamp}, {random}, and {original} as placeholders."),
                    React.createElement(TextInput, {
                        value: customFormat,
                        onChange: (e) => onChange('customFormat', e),
                    })
                ),
                React.createElement(FormSwitch, {
                    note: 'Include the original filename in the new name.',
                    value: preserveOriginalName,
                    onChange: (e) => onSwitch('preserveOriginalName', e),
                }, "Preserve Original Filename")
            );
        };
    }
}

module.exports = FileNameRandomization;
