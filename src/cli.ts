#!/usr/bin/env node

import {unzip} from './index';

if (process.argv.length != 4) {
  console.error('Usage: unzip-url url-of-zip target-dir');
  process.exit(0);
}

unzip(process.argv[2], process.argv[3]);
