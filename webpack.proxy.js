`
const injectScripts = require('webpack-dev-server-inject-scripts');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

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
