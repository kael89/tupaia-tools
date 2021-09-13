import chalk from 'chalk';
import fs from 'fs';

import { toArray } from '../utils';

export default class Script {
  /**
   * @protected
   *
   * Override in subclasses to specify a help text for the scritp
   */
  help = '';

  db = null;

  constructor(db) {
    this.db = db;
  }

  /**
   * @abstract
   * @returns {Promise}
   */
  run = () => {
    throw new Error(`Subclasses of Script must implement the "run" method`);
  };

  runScript = async () => {
    if (this.help) {
      this.logInfo(toArray(this.help).join('\n'));
      this.log();
    }
    await this.run();
  };

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
    this.logSuccess(header);
    this.logSuccess('-'.repeat(header.length));
  };

  log = (msg = '') => {
    console.log(msg);
  };

  logSuccess = msg => {
    console.log(chalk.green(msg));
  };

  logWarn = msg => {
    console.warn(chalk.yellow(msg));
  };

  logInfo = msg => {
    console.warn(chalk.cyan(msg));
  };

  readFile = path => fs.readFileSync(path, { encoding: 'utf-8' });

  readJsonFile = path => JSON.parse(this.readFile(path));
}
