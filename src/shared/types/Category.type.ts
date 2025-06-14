import { Document, Schema } from 'mongoose';
import { Org } from './Org.type';

type OrgPropertie = Schema.Types.ObjectId | Org;

export interface Category<TOrg = OrgPropertie> extends Document {
  readonly name: string;
  readonly icon: string;
  readonly org: TOrg;
}

export interface CategoryType<TOrg = OrgPropertie> {
  id: string;
  name: string;
  icon: string;
  org: TOrg;
}
