function extractMeta(fileContents) {
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
    jsdocHeader += " */";

    return jsdocHeader;
}

module.exports = {
    extractMeta
};
