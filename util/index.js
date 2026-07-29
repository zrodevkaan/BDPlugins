async function fetchLatestWorkingVersion(channel = "stable") {
    const baseUrls = {
        stable: "https://discord.com/app",
        canary: "https://canary.discord.com/app"
    };

    const url = baseUrls[channel];
    if (!url) throw new Error(`Unknown channel: ${channel}`);

    const res = await fetch(url);
    const text = await res.text();

    const match = text.match(/"BUILD_NUMBER":"(\d+)"/);
    return match ? match[1] : null;
}

async function extractMeta(fileContents, pluginName, version, cversion) {
    const metaInfoByName = {};

    const matches = fileContents.matchAll(/@(\w+)\s+(.*)/g);

    for (const match of matches) {
        const [, name, value] = match;
        metaInfoByName[name] = value;
    }

    let jsdocHeader = "/**\n";

    for (const [key, value] of Object.entries(metaInfoByName)) {
        jsdocHeader += ` * @${key} ${value}\n`;
    }

    jsdocHeader += ` * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/${pluginName}/${pluginName}.plugin.js\n`;
    jsdocHeader += ` * @invite t3zMgv7Nvb\n`;
    jsdocHeader += ` * @stable ${version}\n`;
    jsdocHeader += ` * @canary ${cversion}\n`;
    jsdocHeader += " */";

    return jsdocHeader;
}

module.exports = {
    extractMeta,
    fetchLatestWorkingVersion
};