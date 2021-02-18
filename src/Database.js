import PG from 'pg';

export default class Database {
  client;

  // Operator abstraction
  op = {
    in: values => `IN (${values.map(v => `'${v}'`).join(',')})`,
    matchWord: word => `similar to '%\\m${word}\\M%'`,
  };

  query = '';

  constructor() {
    this.client = new PG.Client({
      user: process.env.DB_NAME,
      host: process.env.DB_URL,
      database: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
  }

  connect = async () => this.client.connect();

  disconnect = async () => this.client.end();

  select = query => {
    this.query = query;
    return this;
  };

  get = async (column = '') => {
    const { rows } = await this.execQuery();
    return column ? rows.map(row => row[column]) : rows;
  };

  execQuery = async () => {
    if (!this.query) {
      throw new Error('No query specified');
    }
    return this.client.query(this.query);
  };
}
