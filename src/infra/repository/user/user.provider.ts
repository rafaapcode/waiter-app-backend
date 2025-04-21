import { Connection } from 'mongoose';
import { CONSTANTS } from '../../../constants';
import { AdminSchema } from '../../../schemas/admin.schema';

export const userProvider = [
  {
    provide: CONSTANTS.USER_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model('UserAdmin', AdminSchema),
    inject: [CONSTANTS.DATABASE_CONNECTION],
  },
];
