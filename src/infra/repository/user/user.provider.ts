import { Connection } from 'mongoose';
import { CONSTANTS } from '../../../constants';
import { UserSchema } from '../../schemas/user.schema';

export const userProvider = [
  {
    provide: CONSTANTS.USER_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: [CONSTANTS.DATABASE_CONNECTION],
  },
];
