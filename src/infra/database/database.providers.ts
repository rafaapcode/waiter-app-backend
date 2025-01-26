import * as mongoose from 'mongoose';
import { CONSTANTS } from '../../constants';

export const databaseProviders = [
  {
    provide: CONSTANTS.DATABASE_CONNECTION,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(process.env.DATABASE_URI),
  },
];
