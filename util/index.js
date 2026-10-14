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

function createMeta(manifest, pluginName, version, cversion) {
    const sanitize = value => String(value).replace(/\r?\n/g, " ").replace(/\*\//g, "* /");
    const lines = [];

    for (const field of ["name", "author", "version", "description", "icon"]) {
        const value = manifest[field];
        if (typeof value === "string" && value.trim()) {
            lines.push(` * @${field} ${sanitize(value.trim())}`);
        }
    }

    // for (const entry of manifest.changelog ?? []) {
    //     const details = [entry.title, ...entry.items].filter(Boolean).join("; ");
    //     lines.push(` * @changelog ${sanitize(`${entry.version}: ${details}`)}`);
    // }

    lines.push(` * @source https://github.com/zrodevkaan/BDPlugins/tree/main/Plugins/${pluginName}/${pluginName}.plugin.js`);
    lines.push(" * @invite t3zMgv7Nvb");
    lines.push(` * @stable ${version}`);
    lines.push(` * @canary ${cversion}`);

    return ["/**", ...lines, " */"].join("\n");
}

module.exports = {
    createMeta,
    fetchLatestWorkingVersion
};
