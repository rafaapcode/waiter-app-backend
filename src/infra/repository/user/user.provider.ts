import { UserSchema } from '@infra/schemas/user.schema';
import { Connection } from 'mongoose';
import { CONSTANTS } from '../../../constants';

export const userProvider = [
  {
    provide: CONSTANTS.USER_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: [CONSTANTS.DATABASE_CONNECTION],
  },
];
