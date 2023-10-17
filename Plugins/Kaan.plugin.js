/**
 * @name Kaan
 * @author imafrogowo 
 * @version 1.0.0
 * @description Library needed for (some) imafrogowo plugins.
 */

const request = require('request');
const fs = require('fs');
const path = require('path');

class Kaan {
    constructor() {
        // nuh uh
    }

    start() {
        Kaan = new Kaan();
    }

    stop() {
        Kaan = undefined;
    }

    load()
    {
        Kaan ? Kaan = new Kaan() : Kaan = undefined;
    }

    async fetchPluginVersion(githubOwner, pluginName) {
        const repoURL = `https://raw.githubusercontent.com/${githubOwner}/BDPlugins/main/Plugins/${pluginName}/${pluginName}.plugin.js`;

        return new Promise((resolve, reject) => {
            request.get(repoURL, (error, response, body) => {
                if (error) {
                    reject(new Error(`Failed to fetch the latest version for ${pluginName}: ${error.message}`));
                } else if (response.statusCode === 200) {
                    const content = body.toString();
                    const match = content.match(/@version\s+(\d+\.\d+\.\d+)/);
                    if (match) {
                        const latestVersion = match[1];
                        resolve(latestVersion);
                    } else {
                        reject(new Error(`Failed to parse version from ${pluginName}.plugin.js`));
                    }
                } else {
                    reject(new Error(`Failed to fetch the latest version for ${pluginName}: ${response.statusCode} ${response.statusMessage}`));
                }
            });
        });
    }

    async isUpdateAvailable(githubOwner, pluginName, currentVersion) {
        const latestVersion = await this.fetchPluginVersion(githubOwner, pluginName);

        if (!latestVersion) {
            return false;
        }

        const currentVersionArray = currentVersion.split('.').map(Number);
        const latestVersionArray = latestVersion.split('.').map(Number);

        for (let i = 0; i < Math.min(currentVersionArray.length, latestVersionArray.length); i++) {
            if (latestVersionArray[i] > currentVersionArray[i]) {
                return true;
            } else if (latestVersionArray[i] < currentVersionArray[i]) {
                return false;
            }
        }

        return false;
    }

    async updatePlugin(githubOwner, pluginName, currentVersion) {
        if (await this.isUpdateAvailable(githubOwner, pluginName, currentVersion)) {
            const repoURL = `https://raw.githubusercontent.com/${githubOwner}/BDPlugins/main/Plugins/${pluginName}/${pluginName}.plugin.js`;
            const destination = path.join(BdApi.Plugins.folder, `${pluginName}.plugin.js`);

            request.get(repoURL, async (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    await new Promise((resolve, reject) => {
                        fs.writeFile(destination, body, 'utf8', (err) => {
                            if (err) {
                                reject(new Error(`Failed to write ${pluginName}: ${err.message}`));
                            } else {
                                console.log(`Updated ${pluginName} to the latest version.`);
                                resolve();
                            }
                        });
                    });
                } else {
                    console.error(`Failed to download ${pluginName}: ${error ? error.message : `HTTP ${response.statusCode} ${response.statusMessage}`}`);
                }
            });
        } else {
            console.log(`${pluginName} is already up to date.`);
        }
    }
}

module.exports = Kaan;
