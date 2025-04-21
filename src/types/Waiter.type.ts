import { Document } from 'mongoose';

export interface WaiterUser extends Document {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}
export type WaiterUserType = {
  name: string;
  email: string;
  password: string;
};
