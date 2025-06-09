import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';
import { Envs } from 'src/shared/config/env';
import { CONSTANTS } from '../../constants';

export const databaseProviders: Provider[] = [
  {
    provide: CONSTANTS.DATABASE_CONNECTION,
    useFactory: (configService: ConfigService): Promise<typeof mongoose> => {
      const url = configService.getOrThrow(Envs.DATABASE_URI);
      return mongoose.connect(url);
    },
    inject: [ConfigService],
  },
];
