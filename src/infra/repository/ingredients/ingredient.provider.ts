import { Connection } from 'mongoose';
import { IngredientSchema } from 'src/schemas/ingredients.schema';
import { CONSTANTS } from '../../../constants';

export const ingredientProvider = [
  {
    provide: CONSTANTS.INGREDIENTS_PROVIDER,
    useFactory: (connection: Connection) =>
      connection.model('Ingredient', IngredientSchema),
    inject: [CONSTANTS.DATABASE_CONNECTION],
  },
];
