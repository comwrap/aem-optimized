#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const createServer = require('./dist/server').default;

const pathToConfig = process.cwd() + '/vite.config.js';
const processedConfig = path.join(
  process.cwd(),
  'node_modules',
  '.aemoptimized',
  'vite.config.js'
);

esbuild
  .build({
    format: 'cjs',
    entryPoints: [pathToConfig],
    outdir: './node_modules/.aemoptimized',
  })
  .then(() => {
    if (fs.existsSync(processedConfig)) {
      const config = require(processedConfig).default;
      console.log(config.aemOptimized);
      createServer(
        config.aemOptimized.host,
        config.aemOptimized.clientlibs,
        config.aemOptimized.port,
        config.aemOptimized.entry,
        config.aemOptimized.headers,
        config.aemOptimized.wcmmode
      );
    }
  })
  .catch((e) => console.log(e));
