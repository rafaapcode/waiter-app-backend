import { Document } from 'mongoose';

export interface Ingredient extends Document {
  readonly name: string;
  readonly icon: string;
}
export type IngredientType = {
  id: string;
  name: string;
  icon: string;
};
