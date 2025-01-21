import { Connection } from 'mongoose';
import { CONSTANTS } from 'src/constants';
import { CategorySchema } from 'src/schemas/category.schema';

export const categoryProviders = [
  {
    provide: CONSTANTS.CATEGORY_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model('Category', CategorySchema),
    inject: [CONSTANTS.DATABASE_CONNECTION],
  },
];
