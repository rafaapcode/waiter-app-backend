import { Document } from 'mongoose';

export interface AdminUser extends Document {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}
export type AdminUserType = {
  name: string;
  email: string;
  password: string;
};
