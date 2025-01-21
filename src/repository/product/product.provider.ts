import { Connection } from 'mongoose';
import { CONSTANTS } from 'src/constants';
import { ProductSchema } from 'src/schemas/product.schema';

export const productProviders = [
  {
    provide: CONSTANTS.PRODUCT_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model('Product', ProductSchema),
    inject: [CONSTANTS.DATABASE_CONNECTION],
  },
];
