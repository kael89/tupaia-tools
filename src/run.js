import Database from './Database';
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
    return () => {
      scripts.help();
      process.exit(1);
    };
  }
  return scripts[scriptName];
};
