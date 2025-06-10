import { Provider } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { env } from 'src/shared/config/env';
import { CONSTANTS } from '../../constants';

export const databaseProviders: Provider[] = [
  {
    provide: CONSTANTS.DATABASE_CONNECTION,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(env.DATABASE_URI),
  },
];
