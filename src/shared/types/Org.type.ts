import { Document, Schema } from 'mongoose';
import { User } from './User.type';

type UserPropertie = Schema.Types.ObjectId | User;

export interface Org<TUser = UserPropertie> extends Document {
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
  readonly user: TUser;
}

export type OrgType<TUser = string> = {
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
  user: TUser;
};
