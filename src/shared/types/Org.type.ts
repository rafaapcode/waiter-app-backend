import { Document, Schema } from 'mongoose';
import { User } from './User.type';

export interface Org extends Document {
  readonly name: string;
  readonly imageUrl: string;
  readonly email: string;
  readonly description: string;
  readonly openHour: string;
  readonly closeHour: string;
  readonly cep: string;
  readonly city: string;
  readonly neighborhood: string;
  readonly street: string;
  readonly location: {
    type?: 'Point';
    coordinates?: [number, number];
  };
  readonly user: Schema.Types.ObjectId | User;
}

export type OrgType<Tuser = string> = {
  _id?: string;
  name: string;
  email: string;
  imageUrl: string;
  description: string;
  openHour: string;
  closeHour: string;
  cep: string;
  city: string;
  neighborhood: string;
  street: string;
  location: {
    type?: 'Point';
    coordinates?: [number, number];
  };
  user: Tuser;
};
