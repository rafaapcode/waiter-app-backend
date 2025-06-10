import { ProductSchema } from '@infra/schemas/product.schema';
import { Connection } from 'mongoose';
import { CONSTANTS } from '../../../constants';

export const productProviders = [
  {
    provide: CONSTANTS.PRODUCT_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model('Product', ProductSchema),
    inject: [CONSTANTS.DATABASE_CONNECTION],
  },
];
