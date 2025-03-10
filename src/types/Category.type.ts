import { Document } from 'mongoose';

export interface Category extends Document {
  readonly name: string;
  readonly icon: string;
}
