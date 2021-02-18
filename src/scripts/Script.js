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

  log = (line = '') => {
    console.log(line);
  };
}
