import { Connection } from 'mongoose';
import { WaiterSchema } from 'src/schemas/waiter.schema';
import { CONSTANTS } from '../../../constants';

export const waiterProvider = [
  {
    provide: CONSTANTS.WAITER_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model('Waiter', WaiterSchema),
    inject: [CONSTANTS.DATABASE_CONNECTION],
  },
];
