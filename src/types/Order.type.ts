import { Document, Schema } from 'mongoose';
import { Product } from './Product.type';

export enum STATUS {
  WAITING = 'WAITING',
  IN_PRODUCTION = 'IN_PRODUCTION',
  DONE = 'DONE',
}

export interface Order extends Document {
  readonly table: string;
  readonly status: STATUS;
  readonly createdAt: Date;
  readonly deletedAt?: Date;
  readonly products: {
    product: Schema.Types.ObjectId | Product;
    quantity: number;
  }[];
}

export type ProductsOrder = {
  product: Schema.Types.ObjectId;
  quantity: number;
};
