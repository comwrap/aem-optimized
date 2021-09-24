#!/usr/bin/env node

const fs = require('fs');
const { exec } = require('child_process');

const content = require('./webpack.proxy');

async function modify(file) {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) throw err;

    console.log('modifying webpack.common.js');
    let res = data.replace(
      'MiniCssExtractPlugin.loader,',
      'devMode ? "style-loader" : MiniCssExtractPlugin.loader,'
    );
    res = res.replace(
      'module.exports = {',
      `const devMode = process.env.NODE_ENV === "dev";
module.exports = {`
    );

    fs.writeFile(file, res, 'utf8', (err, data) => {
      if (err) throw err;
    });
  });
  console.log('creating webpack.proxy.js');
  fs.writeFile('webpack.proxy.js', content, (err) => {
    if (err) throw err;

    console.log('installing dependencies...');
    console.log('npm i -D webpack-dev-server-inject-scripts local-cors-proxy');
    exec(
      'npm i -D webpack-dev-server-inject-scripts local-cors-proxy',
      (error, stdout, stderr) => {
        if (error) throw error;
        if (stderr) console.log('ERROR!:', stderr);
        console.log(stdout);
        console.log(
          'done! !manual step!\nadd following runcommand to package.json: \n "proxy": "NODE_ENV=dev webpack-dev-server --hot --config ./webpack.proxy.js & lcp --proxyUrl \'http://localhost:4502\' --port 3002 --proxyPartial \'\'"'
        );
      }
    );
  });
}

modify('./webpack.common.js');
