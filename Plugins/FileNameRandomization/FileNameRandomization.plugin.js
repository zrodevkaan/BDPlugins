/**
 * @name FileNameRandomization
 * @author kaan
 * @version 1.0.6
 * @description The ability to randomize the fileName when uploading any file. \nsomefile.txt = dsfDFHJhd4u4r.txt or somefile.txt = 1685709600000.txt (with Unix timestamp)
 */
const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const { FormSwitch } = BdApi.Webpack.getByKeys('FormSwitch');
const React = BdApi.React;
const { useState, useEffect } = React;

module.exports = class FileNameRandomization {
    start() {
        this.Main = BdApi.Patcher.after(
            "FileNameRandomizationPatch",
            BdApi.Webpack.getByKeys("uploadFiles"),
            "uploadFiles",
            (a, b, c) => {
                for (const File of b[0].uploads) {
                    File.filename = this.generateFilename(File.filename);
                }
            }
        );
    }

    stop() {
        this.Main?.();
    }

    getSetting(id) {
        const settings = BdApi.Data.load("FileNameRandomization", "settings") || {};
        return settings[id];
    }

    setSetting(id, value)
    {
        return BdApi.Data.save("FileNameRandomization", "settings",
            {[id]: value}
        )
    }

    generateFilename(originalFilename) {
        const splitStuff = originalFilename.split(".");
        const fileExt = splitStuff[splitStuff.length - 1];

        if (this.getSetting('useTimestamp')) {
            return `${Date.now()}.${fileExt}`;
        } else {
            let randomFilename = "";
            for (let i = 0; i < originalFilename.length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                randomFilename += characters.charAt(randomIndex);
            }
            return `${randomFilename}.${fileExt}`;
        }
    }

    getSettingsPanel() {
        const SettingsPanel = () => {
            const [useTimestamp, setUseTimestamp] = useState(this.getSetting('useTimestamp'));

            const onSwitch = (id, value) => {
                setUseTimestamp(value);
                this.setSetting(id, value);
            };

            return React.createElement(
                "div",
                {},
                React.createElement(FormSwitch, {
                    note: 'Instead of random characters you can use a unix timestamp signalling when the file was uploaded.', // ecraig wanted this
                    // so whoever wanted it also, thank ecraig
                    value: useTimestamp,
                    onChange: (e) => onSwitch('useTimestamp',e),
                }, 'Unix Timestamp FileName')
            );
        };

        return React.createElement(SettingsPanel.bind(this));
    }

}
