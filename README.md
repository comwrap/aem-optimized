# aem-optimized

Version 2! All new, all shiny, all vite!
Allows for HMR and other features, tested directly against your production publisher with real content. This package is intended to develop directly against authored content instead of dummy content. All features like HMR are first class citizins thanks to the power of vite.
This package requires vite as a peer-dependency.
At the moment glob imports in sass are not supported. So make sure that `@import './**/*.scss'` is replaced with proper imports referencing the files directly.

AEM-Optimized utilizes the vite.config.js, so all configurations can be made in one file!

## How to use

1. install package: npm i -D aem-optimized
2. create a new config-file named `vite.config.js` and define a aemOptimized object with the following attributes: `host`, `clientlibs`,`port`, `headers`, `entry`.
   The host-entry can be any target, so even your production environment's publisher.
3. run script: npx aem-optimized
4. Change some css values, save and watch the changes happen without a page refresh

## Sample Configs

```
// vite.config.js
import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
const path = require("path");

const headers = {
    authorization: 'Basic YWRtaW46YWRtaW4=',
};
const port = 3000;
const entry = "/src/main/webpack/site/main.js";
const target = "http://localhost:4502";
const clientlibs = ["clientlib-site"];
const proxies = generateProxies(clientlibs, entry);
export default defineConfig({
    aemOptimized: {
        host: target,
        headers: {
            ...headers,
        },
        clientlibs,
        entry,
        port,
    },
    server: {
        proxy: {
            ...proxies,
        },
    },
    css: {
        postcss: {
            plugins: [autoprefixer],
        },
    },
});

function generateProxies(clibs, entryPoint) {
    const libs = clibs.map((lib) => [
        `^((?!${lib}.*.(js|css)|html|${entryPoint.split("/").pop()}|@|/${
            entry.split("/")[1]
        }/|node_modules).)*$`,
        {
            target,
            changeOrigin: true,
            secure: true,
            headers: {
                ...headers,
            },
        },
    ]);

    return Object.fromEntries(libs);
}

```
