import { CategorySchema } from '@infra/schemas/category.schema';
import { Connection } from 'mongoose';
import { CONSTANTS } from '../../../constants';

export const categoryProviders = [
  {
    provide: CONSTANTS.CATEGORY_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model('Category', CategorySchema),
    inject: [CONSTANTS.DATABASE_CONNECTION],
  },
];
