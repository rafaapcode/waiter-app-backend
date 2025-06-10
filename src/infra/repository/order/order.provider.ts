import { OrderSchema } from '@infra/schemas/order.schema';
import { Connection } from 'mongoose';
import { CONSTANTS } from '../../../constants';

export const orderProviders = [
  {
    provide: CONSTANTS.ORDER_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model('Order', OrderSchema),
    inject: [CONSTANTS.DATABASE_CONNECTION],
  },
];
