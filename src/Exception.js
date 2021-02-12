export default class Exception extends Error {
  static NAME = 'Exception';

  constructor(message) {
    super(message);
    this.name = Exception.NAME;
  }

  static isException = error => error.name === Exception.NAME;
}
