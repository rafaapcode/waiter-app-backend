import { Connection } from 'mongoose';
import { CONSTANTS } from 'src/constants';
import { OrderSchema } from 'src/schemas/order.schema';

export const orderProviders = [
  {
    provide: CONSTANTS.ORDER_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model('Order', OrderSchema),
    inject: [CONSTANTS.DATABASE_CONNECTION],
  },
];
