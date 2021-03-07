const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = (env) => {
  return merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    performance: { hints: 'warning' },
    devServer: {
      inline: true,
      proxy: [
        {
          context: ['/content', '/etc.clientlibs'],
          target: 'http://localhost:4502',
        },
      ],
      writeToDisk: false,
      liveReload: true,
    },
    plugins: [
      new BrowserSyncPlugin({
        host: 'localhost',
        port: '3000',
        proxy: 'http://localhost:8080',
        open: false,
        files: [
          {
            match: ['./dist/clientlib-site/**/*.js'],
          },
        ],
        snippetOptions: {
          rule: {
            match: /<\/head>/i,
            fn: function (snippet, match) {
              return (
                '<link rel="stylesheet" type="text/css" href="/clientlib-site/css/site.css"/>' +
                '<script src="/clientlib-site/js/site.js" defer/>' +
                snippet +
                match
              );
            },
          },
        },
        notify: true,
      }),
    ],
  });
};
