import { Document, Schema } from 'mongoose';
import { User } from './User.type';

export interface Org extends Document {
  readonly name: string;
  readonly imageUrl: string;
  readonly email: string;
  readonly descricao: string;
  readonly info: {
    abertura: string;
    fechamento: string;
  };
  readonly user: Schema.Types.ObjectId | User;
}

export type OrgType = {
  _id?: string;
  name: string;
  email: string;
  imageUrl: string;
  descricao: string;
  info: {
    abertura: string;
    fechamento: string;
  };
  user: Schema.Types.ObjectId | User;
};
