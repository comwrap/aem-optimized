# aem-optimized

Version 2! All new, all shiny, all vite!
Allows for HMR and other features, tested directly against your production publisher with real content. This package is intended to develop directly against authored content instead of dummy content. All features like HMR are first class citizins thanks to the power of vite.
This package requires as a peer-dependency 'vite'.
At the moment glob imports in sass are not supported. So make sure that `@import './**/*.scss'` is replaced with proper imports referencing the files directly.

AEM-Optimized supports a config-file at the project-root, aka. ui.frontend.

## How to use

1. install package: npm i -D aem-optimized
2. create a new config-file named `aemoptimized.config.cjs` and define `host`, `clientlibs`,`port`. `headers` are optional.
   The host-entry can be any target, so even your production environment's publisher.
3. Create a vite.config.js and adjust accordingly. A good start is the sample config listed below.
4. run script: npx aem-optimized
5. Change some css values, save and watch the changes happen without a page refresh

## Sample Configs

```
// aemoptimized.config.cjs
module.exports = {
  host: 'http://localhost:4502',
  headers: {
    authorization: 'Basic YWRtaW46YWRtaW4=',
  },
  clientlibs: ['clientlib-site'],
  port: 3001,
  entry: '/src/main/webpack/site/main.js'
};
```

```
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";

const path = require("path");

const headers = {
    authorization: 'Basic YWRtaW46YWRtaW4=',
};
const target = "http://localhost:4502";
export default defineConfig({
    server: {
        proxy: {
            "^((?!clientlib-site.*.(js|css)|html|main.js|@|/src/|node_modules).)*$": {
                target,
                changeOrigin: true,
                secure: false,
                headers: {
                    ...headers,
                },
            },
        },
    },
    plugins: [react()],
    css: {
        postcss: {
            plugins: [autoprefixer],
        },
    },
});
```
