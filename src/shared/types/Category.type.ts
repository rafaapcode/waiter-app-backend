import { Document, Schema } from 'mongoose';
import { Org } from './Org.type';

export interface Category extends Document {
  readonly name: string;
  readonly icon: string;
  readonly org: Schema.Types.ObjectId | Org;
}
