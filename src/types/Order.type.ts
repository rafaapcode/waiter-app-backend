import { Document, Schema } from 'mongoose';

enum STATUS {
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
