import { Category } from '@shared/types/Category.type';
import { Ingredient } from '@shared/types/Ingredient.type';
import { Org } from '@shared/types/Org.type';
import { Schema } from 'mongoose';

export class ProductEntity<
  TCat = Schema.Types.ObjectId | Category,
  TIng = Schema.Types.ObjectId | Ingredient,
  TOrg = Schema.Types.ObjectId | Org,
> {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly imageUrl: string,
    public readonly price: number,
    public readonly ingredients: TIng,
    public readonly category: TCat,
    public readonly discount: boolean,
    public readonly priceInDiscount: number,
    public readonly org: TOrg,
  ) {}
}
