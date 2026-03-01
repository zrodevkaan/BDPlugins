import { build, context } from "esbuild";
import path from "path";
import { fileURLToPath } from "url";
import { readdir } from "fs/promises";
import * as fs from "node:fs";
import { extractMeta } from "./util/index.js";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, "src");
const distDir = path.resolve(__dirname, "./Plugins");

const args = process.argv.slice(2);
const bdist = args.includes("--bdist");
const watch = args.includes("--watch") || args.includes("-w");
const doNotInject = args.includes("--doNotInject") || args.includes("-dni");
const pluginArg = args.find(arg => arg.startsWith("--plugin="));
const specificPlugin = pluginArg ? pluginArg.split("=")[1] : null;

console.log(`Build mode: ${bdist ? "BetterDiscord directory" : "local dist"}`);
if (watch) console.log("Watch mode enabled");
if (specificPlugin) console.log(`Building specific plugin: ${specificPlugin}`);

function getBetterDiscordPath() {
    const homeDir = os.homedir();
    const platform = os.platform();

    switch (platform) {
        case 'win32':
            return path.join(homeDir, 'AppData', 'Roaming', 'BetterDiscord', 'plugins');
        case 'darwin': // macOS
            return path.join(homeDir, 'Library', 'Application Support', 'BetterDiscord', 'plugins');
        case 'linux':
            const xdgConfigHome = process.env.XDG_CONFIG_HOME || path.join(homeDir, '.config');
            return path.join(xdgConfigHome, 'BetterDiscord', 'plugins');
        default:
            return path.join(homeDir, 'AppData', 'Roaming', 'BetterDiscord', 'plugins');
    }
}

async function getPluginFolders() {
    const pluginFolders = await readdir(srcDir, { withFileTypes: true });
    return pluginFolders.filter(dirent => {
        if (!dirent.isDirectory()) return false;
        if (dirent.name.endsWith('.ignore')) return false;
        return !(specificPlugin && dirent.name !== specificPlugin);
    });
}

let reactPlugin = {
    name: 'reactPlugin',
    setup(build) {
        build.onResolve({ filter: /^react$/ }, args => ({
            path: args.path,
            namespace: 'react-ns',
        }))
        build.onLoad({ filter: /.*/, namespace: 'react-ns' }, () => ({
            contents: `export default BdApi.React;export const {PureComponent} = BdApi.React;`,
            loader: 'js',
        }))
    },
}

async function createBuildConfig(pluginName) {
    const entryFile = path.join(srcDir, pluginName, "index.tsx");

    let fileContents;
    try {
        fileContents = await fs.promises.readFile(entryFile, "utf-8");
    } catch (ex) {
        console.warn(`Warning: Could not read entry file for ${pluginName}: ${ex.message}`);
        return null;
    }

    const outFile = !bdist
        ? path.join(distDir, pluginName, `${pluginName}.plugin.js`)
        : path.join(getBetterDiscordPath(), `${pluginName}.plugin.js`);

    if (!doNotInject)
    {
        const pluginPath = path.join(distDir, pluginName);
        fs.mkdirSync(pluginPath, { recursive: true });
    }

    return {
        entryPoints: [entryFile],
        bundle: true,
        format: "cjs",
        outfile: outFile,
        banner: {
            js: extractMeta(fileContents, pluginName),
        },
        loader: {
            ".js": "jsx",
            ".jsx": "jsx",
            ".ts": "tsx",
            ".tsx": "tsx",
            ".css": "text"
        },
        resolveExtensions: ['.tsx', '.ts', '.jsx', '.js'],
        jsxFactory: "BdApi.React.createElement",
        jsxFragment: "BdApi.React.Fragment",
        logLevel: "info",
        external: ['discord-types/*', 'discord-types/other'],
        plugins: [reactPlugin, {
            name: "build-notifier",
            setup(build) {
                build.onEnd((result) => {
                    if (result.errors.length === 0) {
                        console.log(`Successfully built ${pluginName}`);
                    } else {
                        console.log(`Build failed for ${pluginName}`);
                        result.errors.forEach(error => {
                            console.error(error);
                        });
                    }
                });
            }
        }]
    };
}

async function buildPlugins() {
    const pluginFolders = await getPluginFolders();

    if (pluginFolders.length === 0) {
        if (specificPlugin) {
            console.error(`Error: Plugin "${specificPlugin}" not found or is ignored`);
            process.exit(1);
        } else {
            console.log("No plugins found to build");
            return;
        }
    }

    if (watch) {
        const contexts = [];

        for (const dirent of pluginFolders) {
            const config = await createBuildConfig(dirent.name);
            if (!config) continue;

            try {
                const ctx = await context(config);
                contexts.push(ctx);
                await ctx.watch();
                console.log(`Watching ${dirent.name}...`);
            } catch (error) {
                console.error(`Error: Failed to create watch context for ${dirent.name}:`, error);
            }
        }

        if (contexts.length > 0) {
            console.log(`\nWatching ${contexts.length} plugin(s). Press Ctrl+C to stop.`);

            process.on('SIGINT', async () => {
                console.log('\nShutting down watchers...');
                await Promise.all(contexts.map(ctx => ctx.dispose()));
                process.exit(0);
            });
        } else {
            console.log("No valid plugins found to watch");
            process.exit(1);
        }
    } else {
        const buildPromises = [];

        for (const dirent of pluginFolders) {
            const config = await createBuildConfig(dirent.name);
            if (config) {
                buildPromises.push(build(config));
            }
        }

        if (buildPromises.length > 0) {
            console.log(`Building ${buildPromises.length} plugin(s)...`);
            await Promise.all(buildPromises);
            console.log("All builds completed successfully");
        } else {
            console.log("No valid plugins found to build");
        }
    }
}

process.on('unhandledRejection', (reason, promise) => {
    console.error('Error: Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

buildPlugins().catch(error => {
    console.error('Error: Build process failed:', error);
    process.exit(1);
});