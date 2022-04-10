#!/usr/bin/env node
// import fs from 'fs';
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const currPath = process.cwd();
// import { createServer } from './server.js'
const createServer = require('./dist/server').default;
// import esbuild from 'esbuild';
// import { cosmiconfig } from 'cosmiconfig';
// import { createServer } from './server.js';
// const explorer = cosmiconfig('aemoptimized');
// explorer
//   .search()
//   .then((result) => {
//     console.log(result.config);
//     // result.config is the parsed configuration object.
//     // result.filepath is the path to the config file that was found.
//     // result.isEmpty is true if there was nothing to parse in the config file.
//     createServer(
//       result.config.host,
//       result.config.clientlibs,
//       result.config.port,
//       result.config.entry,
//       result.config.headers
//     );
//   })
//   .catch((error) => {
//     console.error(error);
//     // Do something constructive.
//   });
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
  .catch((e) => console.log(e));
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
