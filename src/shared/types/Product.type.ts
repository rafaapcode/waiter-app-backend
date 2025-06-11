import { Document, Schema } from 'mongoose';
import { Category } from './Category.type';
import { Org } from './Org.type';

type CategoriePropertie =
  | Schema.Types.ObjectId
  | Category
  | { _id: Schema.Types.ObjectId; name: string; icon: string };
type OrgPropertie = Schema.Types.ObjectId | Org;
type IngredientsProperties =
  | Schema.Types.ObjectId[]
  | { _id: Schema.Types.ObjectId; name: string; icon: string }[];

export interface Product<
  TCat = CategoriePropertie,
  TOrg = OrgPropertie,
  TIng = IngredientsProperties,
> extends Document {
  readonly name: string;
  readonly description: string;
  readonly imageUrl: string;
  readonly price: number;
  readonly ingredients: TIng;
  readonly category: TCat;
  readonly discount: boolean;
  readonly priceInDiscount: number;
  readonly org: TOrg;
}

export type ProductType<
  TCat = Schema.Types.ObjectId,
  TIng = Schema.Types.ObjectId,
> = {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  ingredients: TIng[];
  category: TCat;
  discount: boolean;
  priceInDiscount: number;
};
