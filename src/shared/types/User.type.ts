import { Document } from 'mongoose';

export enum UserRoles {
  CLIENT = 'CLIENT',
  WAITER = 'WAITER',
  ADMIN = 'ADMIN',
}

export interface User extends Document {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: UserRoles;
}
export type UserType = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role?: UserRoles;
};
