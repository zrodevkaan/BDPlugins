import { build } from "esbuild";
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

const pluginFolders = await readdir(srcDir, { withFileTypes: true });
const buildPromises = [];

const args = String(process.argv);
let bdist = args.includes("--bdist");

/*const screwJSXRuntime = {
    name: "screw-jsx-runtime",
    setup(build) {
        build.onResolve({ filter: /^react\/jsx-runtime$/ }, args => ({
            path: args.path,
            namespace: "jsx-shim",
        }));

        build.onLoad({ filter: , namespace: "jsx-shim" }, () => ({
            contents: `
                const jsxRuntime = BdApi.Webpack.getByKeys('jsx');
                export const jsx = jsxRuntime.jsx;
                export const jsxs = jsxRuntime.jsxs;
                export const Fragment = BdApi.React.Fragment;
            `,
            loader: "js",
        }));
    },
};*/

for (const dirent of pluginFolders) {
    if (!dirent.isDirectory()) continue;

    const pluginName = dirent.name;
    if (pluginName.endsWith('.ignore')) continue; // VX EasterEgg

    const entryFile = path.join(srcDir, pluginName, "index.tsx");

    let fileContents;
    try {
        fileContents = await fs.promises.readFile(entryFile, "utf-8");
    } catch (ex) {
        continue;
    }

    const outFile = !bdist
        ? path.join(distDir, pluginName, `${pluginName}.plugin.js`)
        : path.join(os.homedir(), 'AppData', 'Roaming', "BetterDiscord", "plugins", `${pluginName}.plugin.js`);

    const pluginPath = path.join(distDir, pluginName);
    fs.mkdirSync(pluginPath, { recursive: true });

    buildPromises.push(
        build({
            entryPoints: [entryFile],
            bundle: false,
            format: "cjs",
            outfile: outFile,
            banner: {
                js: extractMeta(fileContents),
            },
            loader: {
                ".js": "jsx",
                ".css": "css"
            },
            jsxFactory: "BdApi.React.createElement",
            jsxFragment: "BdApi.React.Fragment",
            // plugins: [screwJSXRuntime],
        })
    );
}

await Promise.all(buildPromises);
