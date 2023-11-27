import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { debugInfo, debugError } from './debuggers';
import { getEnv } from './utils';

dotenv.config();

const MONGO_URL = getEnv({ name: 'MONGO_URL' });

export const connectionOptions: mongoose.ConnectOptions = {
  family: 4
};

mongoose.connection
  .on('connected', () => {
    debugInfo(`Connected to the database: ${MONGO_URL}`);
  })
  .on('disconnected', () => {
    debugInfo(`Disconnected from the database: ${MONGO_URL}`);

    process.exit(1);
  })
  .on('error', error => {
    debugError(`Database connection error: ${MONGO_URL} ${error}`);

    process.exit(1);
  });

export const connect = (URL?: string) => {
  return mongoose.connect(URL || MONGO_URL, connectionOptions);
};

export function disconnect() {
  return mongoose.connection.close();
}
