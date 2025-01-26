import { Connection } from 'mongoose';
import { CONSTANTS } from '../../../constants';
import { OrderSchema } from '../../../schemas/order.schema';

export const orderProviders = [
  {
    provide: CONSTANTS.ORDER_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model('Order', OrderSchema),
    inject: [CONSTANTS.DATABASE_CONNECTION],
  },
];
