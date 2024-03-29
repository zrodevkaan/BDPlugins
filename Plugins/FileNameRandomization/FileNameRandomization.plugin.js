/**
 * @name FileNameRandomization
 * @author kaan
 * @version 1.0.5
 * @description somefile.txt = dsfDFHJhd4u4r.txt
 */

const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

module.exports = class FileNameRandomization {
    start() {
        this.Main = BdApi.Patcher.after("FileNameRandomizationPatch", BdApi.Webpack.getByKeys("uploadFiles"), "uploadFiles", (a, b, c) => {
            for (const File of b[0].uploads) {
                const NoNoFileName = this.generateRandomFilename(File.filename);
                File.filename = NoNoFileName;
            }
        });
    }

    stop() {
        // this will never change but still
        this.Main?.();
    }

    generateRandomFilename(originalFilename) {
        const splitStuff = originalFilename.split('.'); // something.exe -> ['something', 'exe']
        const fileExt = splitStuff[splitStuff.length - 1] // hi there file ext. :)
        let randomFilename = '';
        for (let i = 0; i < originalFilename.length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomFilename += characters.charAt(randomIndex);
        }
        return `${randomFilename}.${fileExt}`
    }
}
