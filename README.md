# aem-optimized

===
Creates a new webpack-config that allows you to proxy with HMR enabled the author instance locally running on port 4502. This allows rapid development for scss and js without the need of a browser refresh or a local deployment. Stop prototyping in browser and start directly in code.

## How to use

1. install package: npm i -D aem-optimized
2. run script: npx aem-optimized init
3. add run-command to package.json "proxy": "NODE_ENV=dev webpack-dev-server --hot --config ./webpack.proxy.js"
4. uninstall package: npm remove aem-optimized
