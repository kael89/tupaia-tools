import chalk from 'chalk';
import fs from 'fs';

import { toArray } from '../utils';

export default class Script {
  db = null;

  constructor(db) {
    this.db = db;
  }

  logList = items => {
    items.forEach(innerItemInput => {
      const innerItems = toArray(innerItemInput);
      this.log(`* ${innerItems[0]}`);
      innerItems.slice(1).forEach(item => {
        this.log(`  ${item}`);
      });
    });
  };

  logHeader = header => {
    this.log(header);
    this.log('-'.repeat(header.length));
  };

  log = (msg = '') => {
    console.log(msg);
  };

  logSuccess = msg => {
    console.warn(chalk.green(msg));
  };

  logWarn = msg => {
    console.warn(chalk.yellow(msg));
  };

  readFile = path => fs.readFileSync(path, { encoding: 'utf-8' });

  readJsonFile = path => JSON.parse(this.readFile(path));
}
