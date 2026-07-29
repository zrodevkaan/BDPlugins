import {build, context} from "esbuild";
import path from "path";
import {fileURLToPath} from "url";
import {readdir} from "fs/promises";
import * as fs from "node:fs";
import os from "os";
import {extractMeta, fetchLatestWorkingVersion} from "./util/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, "src");
const distDir = path.resolve(__dirname, "Plugins");

function parseArgs(argv) {
    const args = argv.slice(2);
    let plugin = null;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg.startsWith("--plugin=")) plugin = arg.slice("--plugin=".length);
        else if (arg.startsWith("-p=")) plugin = arg.slice("-p=".length);
        else if (arg === "-p" || arg === "--plugin") plugin = args[i + 1] ?? null;
    }

    return {
        bdist: args.includes("--bdist"),
        watch: args.includes("--watch") || args.includes("-w"),
        doNotInject: args.includes("--doNotInject") || args.includes("-dni"),
        plugin,
    };
}

function getBetterDiscordPath() {
    const homeDir = os.homedir();

    switch (os.platform()) {
        case "win32":
            return path.join(homeDir, "AppData", "Roaming", "BetterDiscord", "plugins");
        case "darwin":
            return path.join(homeDir, "Library", "Application Support", "BetterDiscord", "plugins");
        case "linux":
            return path.join(process.env.XDG_CONFIG_HOME || path.join(homeDir, ".config"), "BetterDiscord", "plugins");
        default:
            return path.join(homeDir, "AppData", "Roaming", "BetterDiscord", "plugins");
    }
}

async function getPluginFolders(specificPlugin) {
    const entries = await readdir(srcDir, {withFileTypes: true});

    return entries.filter(dirent => {
        if (!dirent.isDirectory()) return false;
        if (dirent.name.endsWith(".ignore")) return false;
        return !(specificPlugin && dirent.name !== specificPlugin);
    });
}

const reactPlugin = {
    name: "reactPlugin",
    setup(build) {
        build.onResolve({filter: /^react$/}, args => ({
            path: args.path,
            namespace: "react-ns",
        }));
        build.onLoad({filter: /.*/, namespace: "react-ns"}, () => ({
            contents: `export default BdApi.React;export const {PureComponent} = BdApi.React;`,
            loader: "js",
        }));
    },
};

function helpersAliasPlugin() {
    return {
        name: "helpers-alias",
        setup(build) {
            build.onResolve({filter: /^@helpers$/}, () => ({
                path: path.join(__dirname, "helpers", "index.tsx"),
            }));
        },
    };
}

function buildNotifierPlugin(pluginName) {
    return {
        name: "build-notifier",
        setup(build) {
            build.onEnd(result => {
                if (result.errors.length > 0) {
                    result.errors.forEach(error => console.error(error));
                }
            });
        },
    };
}

async function createBuildConfig(pluginName, {version, cversion, bdist, doNotInject}) {
    const entryFile = path.join(srcDir, pluginName, "index.tsx");

    let fileContents;
    try {
        fileContents = await fs.promises.readFile(entryFile, "utf-8");
    } catch {
        return null;
    }

    const outFile = !bdist
        ? path.join(distDir, pluginName, `${pluginName}.plugin.js`)
        : path.join(getBetterDiscordPath(), `${pluginName}.plugin.js`);

    if (!doNotInject) {
        fs.mkdirSync(path.join(distDir, pluginName), {recursive: true});
    }

    return {
        entryPoints: [entryFile],
        bundle: true,
        format: "cjs",
        outfile: outFile,
        treeShaking: true,
        banner: {js: await extractMeta(fileContents, pluginName, version, cversion)},
        loader: {".js": "jsx", ".jsx": "jsx", ".ts": "tsx", ".tsx": "tsx", ".css": "text"},
        resolveExtensions: [".tsx", ".ts", ".jsx", ".js"],
        jsxFactory: "BdApi.React.createElement",
        jsxFragment: "BdApi.React.Fragment",
        logLevel: "silent",
        external: ["discord-types/*", "discord-types/other"],
        plugins: [reactPlugin, helpersAliasPlugin(), buildNotifierPlugin(pluginName)],
    };
}

async function main() {
    const {bdist, watch, doNotInject, plugin} = parseArgs(process.argv);

    const [version, cversion] = await Promise.all([
        fetchLatestWorkingVersion("stable"),
        fetchLatestWorkingVersion("canary"),
    ]);

    const pluginFolders = await getPluginFolders(plugin);

    if (pluginFolders.length === 0) {
        if (plugin) {
            console.error(`Error: Plugin "${plugin}" not found or is ignored`);
            process.exit(1);
        }
        return;
    }

    const configs = [];
    for (const dirent of pluginFolders) {
        const config = await createBuildConfig(dirent.name, {version, cversion, bdist, doNotInject});
        if (config) configs.push(config);
    }

    if (configs.length === 0) {
        process.exit(1);
    }

    if (watch) {
        const contexts = [];
        for (const config of configs) {
            try {
                const ctx = await context(config);
                await ctx.watch();
                contexts.push(ctx);
            } catch (error) {
                console.error("Error: Failed to create watch context:", error);
            }
        }

        if (contexts.length === 0) {
            process.exit(1);
        }

        process.on("SIGINT", async () => {
            await Promise.all(contexts.map(ctx => ctx.dispose()));
            process.exit(0);
        });
        return;
    }

    await Promise.all(configs.map(build));
}

process.on("unhandledRejection", (reason, promise) => {
    console.error("Error: Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
});

main().catch(error => {
    console.error("Error: Build process failed:", error);
    process.exit(1);
});