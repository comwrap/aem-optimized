#!/usr/bin/env node

const fs = require('fs');
const prependFile = require('prepend-file');
const { exec } = require('child_process');

const content = require('./webpack.proxy');

async function modify(file) {
  console.log('modifying webpack.common.js');
  await prependFile(file, 'const devMode = process.env.NODE_ENV === "dev";');
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) throw err;

    const res = data.replace(
      'MiniCssExtractPlugin.loader,',
      'devMode ? "style-loader" : MiniCssExtractPlugin.loader,'
    );

    fs.writeFile(file, res, 'utf8', (err, data) => {
      if (err) throw err;
    });
  });
  console.log('creating file');
  fs.writeFile('webpack.proxy.js', content, (err) => {
    if (err) throw err;

    console.log('installing dependencies...');
    exec(
      'npm i -D webpack-dev-server-inject-scripts',
      (error, stdout, stderr) => {
        console.log(stdout);
        console.log(
          'done! !manual step!\nadd following runcommand to package.json: \n "proxy": "NODE_ENV=dev webpack-dev-server --hot --config ./webpack.proxy.js"'
        );
      }
    );
  });
}

modify('./webpack.common.js');
