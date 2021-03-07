#!/usr/bin/env node

const fs = require('fs');
const prependFile = require('prepend-file');
const { exec } = require('child_process');

const content = `
const injectScripts = require('webpack-dev-server-inject-scripts');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js')

const SOURCE_ROOT = __dirname + '/src/main/webpack';
module.exports = () => {
  return merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    performance: { hints: 'warning' },
    output: {
      publicPath: '/dist/',
    },

    devServer: {
      inline: true,
      proxy: [
        {
          bypass: function (req, res, proxyOptions) {
            if (
              req.originalUrl ===
                '/etc.clientlibs/mysite/clientlibs/clientlib-site.min.js' ||
              req.originalUrl ===
                '/etc.clientlibs/mysite/clientlibs/clientlib-site.min.css'
            ) {
              console.log('skipping');
              return '';
            }
            if (req.originalUrl.includes('resources')) {
              const ret =
                '/dist/clientlib-site' +
                req.originalUrl.slice(req.originalUrl.indexOf('/resources'));
              console.log(ret);
              return ret;
            }
          },
          context: ['/content', '/etc.clientlibs'],
          target: 'http://localhost:4502',
        },
      ],

      before: function (app, server, compiler) {
        app.use(injectScripts(compiler));
      },
      writeToDisk: false,
      liveReload: true,
    },
  });
};
`;

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
