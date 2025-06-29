import { ProductEntity } from '@core/http/product/entity/Product.entity';
import { Document, Schema } from 'mongoose';
import { Category } from './Category.type';
import { Org } from './Org.type';

export type CategoriePropertie =
  | Schema.Types.ObjectId
  | Category
  | { _id: Schema.Types.ObjectId; name: string; icon: string };
export type OrgPropertie = Schema.Types.ObjectId | Org;
export type IngredientsProperties =
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

export type ListProductEntityType = ProductEntity<
  {
    _id: string;
    name: string;
    icon: string;
  },
  {
    _id: string;
    name: string;
    icon: string;
  }[],
  OrgPropertie
>;
