import { Document } from 'mongoose';

export interface User extends Document {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: 'CLIENT' | 'WAITER' | 'ADMIN';
}
export type UserType = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role?: 'CLIENT' | 'WAITER' | 'ADMIN';
};
