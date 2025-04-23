import { Document, Schema } from 'mongoose';
import { Category } from './Category.type';

export interface Product extends Document {
  readonly name: string;
  readonly description: string;
  readonly imageUrl: string;
  readonly price: number;
  readonly ingredients: { name: string; icon: string }[];
  readonly category: Schema.Types.ObjectId | Category;
  readonly discount: boolean;
  readonly priceInDiscount: number;
}

export type ProductType = {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  ingredients: { name: string; icon: string }[];
  category: Schema.Types.ObjectId;
  discount: boolean;
  priceInDiscount: number;
};
