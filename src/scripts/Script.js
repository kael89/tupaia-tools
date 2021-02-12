export default class Script {
  db = null;

  constructor(db) {
    this.db = db;
  }

  printList = items => {
    items.forEach(item => {
      this.printLine(`* ${item}`);
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
