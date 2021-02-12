import { toArray } from '../utils';

export default class Script {
  db = null;

  constructor(db) {
    this.db = db;
  }

  printList = items => {
    items.forEach(innerItemInput => {
      const innerItems = toArray(innerItemInput);
      this.printLine(`* ${innerItems[0]}`);
      innerItems.slice(1).forEach(item => {
        this.printLine(`  ${item}`);
      });
    });
  };

  printHeader = header => {
    this.printLine(header);
    this.printLine('-'.repeat(header.length));
  };

  printLine = (line = '') => {
    console.log(line);
  };
}
