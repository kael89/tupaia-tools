#!/usr/bin/node

import dotenv from 'dotenv';

import Exception from './Exception';
import run from './run';

const StatusCode = {
  SUCCESS: 0,
  ERROR: 1,
};

dotenv.config();

run()
  .then(() => {
    console.log('then');
    process.exit(StatusCode.SUCCESS);
  })
  .catch(error => {
    if (Exception.isException(error)) {
      console.error(`Error: ${error.message}`);
    } else {
      // Show the stack trace
      console.log(error);
    }
    process.exit(StatusCode.ERROR);
  });
