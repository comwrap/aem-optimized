#!/usr/bin/env node

import { cosmiconfig } from 'cosmiconfig';
import { createServer } from './server.js';
const explorer = cosmiconfig('aemoptimized');
explorer
  .search()
  .then((result) => {
    console.log(result.config);
    // result.config is the parsed configuration object.
    // result.filepath is the path to the config file that was found.
    // result.isEmpty is true if there was nothing to parse in the config file.
    createServer(
      result.config.host,
      result.config.clientlibs,
      result.config.port,
      result.config.entry,
      result.config.headers
    );
  })
  .catch((error) => {
    console.error(error);
    // Do something constructive.
  });
// const loaded = explorerSync.load(pathToConfig);
