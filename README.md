# aem-optimized

This package is meant for newly created projects with aem archetype.
It allows you to proxy the author instance locally running on port 4502 with HMR enabled. This allows rapid development for scss and js without the need of a browser refresh or a local deployment.

## How to use

1. install package: npm i -D aem-optimized
2. run script: npx aem-optimized init
3. add run-command to package.json "proxy": "NODE_ENV=dev webpack-dev-server --hot --config ./webpack.proxy.js"
4. start the server with "npm run proxy". This will start an local server on port 8080.
   Now view a page on your local sdk as published and switch out the port.
   eg: change http://localhost:4502/content/mysite/us/en.html?wcmmode=disabled to http://localhost:8080/content/mysite/us/en.html?wcmmode=disabled
5. Change some css values, save and watch the changes happen without a page refresh
6. uninstall package: npm remove aem-optimized

## configuration

- by default the port 8080 will be used. This can be a conflict if you have a dispatcher running which could use the same port. If you want or need to change the port you can specify a different port in webpack.proxy.js.

## Known issues

- if you enable '/' as proxy path the edit-mode has issues. E.g. no images are draggable to components, component policies cannot be changed. So see this as experimental.
  To allow '/', open webpack.proxy.js and add '/' to the context-array.
