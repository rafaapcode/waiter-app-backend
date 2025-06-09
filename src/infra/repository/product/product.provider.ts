import { Connection } from 'mongoose';
import { CONSTANTS } from '../../../constants';
import { ProductSchema } from '../../schemas/product.schema';

export const productProviders = [
  {
    provide: CONSTANTS.PRODUCT_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model('Product', ProductSchema),
    inject: [CONSTANTS.DATABASE_CONNECTION],
  },
];
