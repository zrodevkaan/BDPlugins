import { build, context } from "esbuild";
import path from "path";
import { fileURLToPath } from "url";
import { readdir } from "fs/promises";
import * as fs from "node:fs";
import os from "os";
import { extractMeta, fetchLatestWorkingVersion } from "./util/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, "src");
const distDir = path.resolve(__dirname, "Plugins");

function parseArgs(argv) {
    const args = argv.slice(2);
    let plugin = null;

    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith("--plugin=")) {
            plugin = args[i].split("=")[1];
        } else if (args[i].startsWith("-p=")) {
            plugin = args[i].split("=")[1];
        } else if (["-p", "--plugin"].includes(args[i]) && args[i + 1]) {
            plugin = args[++i];
        }
    }

    return plugin;
}

function getBetterDiscordPath() {
    const homeDir = os.homedir();

    const paths = {
        win32: path.join(homeDir, "AppData", "Roaming", "BetterDiscord", "plugins"),
        darwin: path.join(homeDir, "Library", "Application Support", "BetterDiscord", "plugins"),
        linux: path.join(
            process.env.XDG_CONFIG_HOME || path.join(homeDir, ".config"),
            "BetterDiscord",
            "plugins"
        ),
    };

    return paths[os.platform()] || paths.win32;
}

async function getPluginFolders() {
    const entries = await readdir(srcDir, { withFileTypes: true });
    return entries.filter(dirent => dirent.isDirectory() && !dirent.name.endsWith(".ignore"));
}

const reactPlugin = {
    name: "react-plugin",
    setup(build) {
        build.onResolve({ filter: /^react$/ }, (args) => ({
            path: args.path,
            namespace: "react-ns",
        }));

        build.onLoad({ filter: /.*/, namespace: "react-ns" }, () => ({
            contents: "export default BdApi.React; export const { PureComponent } = BdApi.React;",
            loader: "js",
        }));
    },
};

const helpersAliasPlugin = {
    name: "helpers-alias",
    setup(build) {
        build.onResolve({ filter: /^@helpers$/ }, () => ({
            path: path.join(__dirname, "helpers", "index.tsx"),
        }));
    },
};

async function createBuildConfig(pluginName, version, cversion) {
    const entryFile = path.join(srcDir, pluginName, "index.tsx");

    try {
        const fileContents = await fs.promises.readFile(entryFile, "utf-8");

        await fs.promises.mkdir(path.join(distDir, pluginName), { recursive: true });

        const baseConfig = {
            entryPoints: [entryFile],
            bundle: true,
            format: "cjs",
            treeShaking: true,
            banner: { js: await extractMeta(fileContents, pluginName, version, cversion) },
            loader: {
                ".js": "jsx",
                ".jsx": "jsx",
                ".ts": "tsx",
                ".tsx": "tsx",
                ".css": "text",
            },
            resolveExtensions: [".tsx", ".ts", ".jsx", ".js"],
            jsxFactory: "BdApi.React.createElement",
            jsxFragment: "BdApi.React.Fragment",
            external: ["discord-types/*", "discord-types/other"],
            plugins: [reactPlugin, helpersAliasPlugin],
        };

        return [
            {
                ...baseConfig,
                outfile: path.join(distDir, pluginName, `${pluginName}.plugin.js`),
            },
            {
                ...baseConfig,
                outfile: path.join(getBetterDiscordPath(), `${pluginName}.plugin.js`),
            }
        ];
    } catch (error) {
        console.error(`Failed to create build config for ${pluginName}:`, error);
        return null;
    }
}

async function main() {
    const targetPlugin = parseArgs(process.argv);

    const [version, cversion] = await Promise.all([
        fetchLatestWorkingVersion("stable"),
        fetchLatestWorkingVersion("canary"),
    ]);

    const pluginFolders = await getPluginFolders();
    const configs = [];

    for (const dirent of pluginFolders) {
        if (targetPlugin && dirent.name !== targetPlugin) continue;

        const pluginConfigs = await createBuildConfig(dirent.name, version, cversion);
        if (pluginConfigs) {
            configs.push(...pluginConfigs);
        }
    }

    if (configs.length === 0) {
        if (targetPlugin) {
            console.error(`Plugin "${targetPlugin}" not found`);
        } else {
            console.error("No plugins found to build");
        }
        process.exit(1);
    }

    await Promise.all(configs.map(config => build(config)));
    console.log(`Successfully built ${configs.length / 2} plugin(s)`);
}

main().catch(error => {
    console.error("Build failed:", error);
    process.exit(1);
});