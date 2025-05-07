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

export type HistoryOrder = {
  id: string;
  table: string;
  data: Date;
  name: string;
  category: string;
  totalPrice: string;
  itens: {
    imageUrl: string;
    quantity: number;
    name: string;
    price: number;
    discount: boolean;
    priceInDiscount: number;
    id: string;
  }[];
};
