module.exports = `const injectScripts = require('webpack-dev-server-inject-scripts');
const merge = require('webpack-merge');
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
      port: 8080,
      proxy: [
        {
          bypass: function (req, res, proxyOptions) {
            // Skip clientlib-site files
            if (req.originalUrl.startsWith('/etc.clientlibs/')) {
              //check for clientlibs

              if (req.originalUrl.match(/clientlib-site.*.min/g)) {
                return '';
              }

              //check for additional resources
              if (req.originalUrl.includes('resources')) {
                const ret =
                  '/dist/clientlib-site' +
                  req.originalUrl.split('/resources')[1];
                return ret;
              }
            }

            if (
              req.originalUrl.includes('resources') &&
              req.originalUrl.startsWith('/content/')
            ) {
              const ret =
                '/dist/clientlib-site' +
                req.originalUrl.slice(req.originalUrl.indexOf('/resources'));
              return ret;
            }
            if (req.originalUrl.startsWith('/resources')) {
              return (
                '/dist/clientlib-site' + req.originalUrl.split('/resources')[1]
              );
            }
          },
          context: ['/content', '/etc.clientlibs', '/libs', '/'],
          target: 'http://localhost:3002',
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
