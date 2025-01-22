import { Document, Schema } from 'mongoose';

export enum STATUS {
  WAITING = 'WAITING',
  IN_PRODUCTION = 'IN_PRODUCTION',
  DONE = 'DONE',
}

export interface Order extends Document {
  readonly table: string;
  readonly status: STATUS;
  readonly createdAt: Date;
  readonly products: { product: Schema.Types.ObjectId; quantity: number }[];
}

export type ProductsOrder = {
  product: Schema.Types.ObjectId;
  quantity: number;
};
