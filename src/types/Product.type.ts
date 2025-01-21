import { Document, Schema } from 'mongoose';

export interface Product extends Document {
  readonly name: string;
  readonly description: string;
  readonly imageUrl: string;
  readonly price: number;
  readonly ingredients: { name: string; icon: string }[];
  readonly category: Schema.Types.ObjectId;
}
