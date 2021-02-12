import Database from './Database';
import Exception from './Exception';
import scripts from './scripts';

export default async () => {
  const db = new Database();

  try {
    await db.connect();
    const script = getScript();
    await script(db);
  } finally {
    await db.disconnect();
  }
};

const getScript = () => {
  const [, , scriptName] = process.argv;
  if (!(scriptName in scripts)) {
    throw new Exception(`Unknown script: '${scriptName}'`);
  }
  return scripts[scriptName];
};
