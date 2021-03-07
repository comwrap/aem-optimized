# aem-optimized

This package is meant for newly created projects with aem archetype.
It allows you to proxy the author instance locally running on port 4502 with HMR enabled. This allows rapid development for scss and js without the need of a browser refresh or a local deployment.

## How to use

1. install package: npm i -D aem-optimized
2. run script: npx aem-optimized init
3. add run-command to package.json "proxy": "NODE_ENV=dev webpack-dev-server --hot --config ./webpack.proxy.js"
4. uninstall package: npm remove aem-optimized
