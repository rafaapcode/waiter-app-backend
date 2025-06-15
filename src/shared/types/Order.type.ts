import { Document, Schema } from 'mongoose';
import { CategoryType } from './Category.type';
import { Org } from './Org.type';
import { Product, ProductType } from './Product.type';

export enum STATUS {
  WAITING = 'WAITING',
  IN_PRODUCTION = 'IN_PRODUCTION',
  DONE = 'DONE',
}

type OrgPropertie = Schema.Types.ObjectId | Org;
type ProductPropertie = Schema.Types.ObjectId | Product;

export interface Order<TOrg = OrgPropertie, TProduct = ProductPropertie>
  extends Document {
  readonly table: string;
  readonly status: STATUS;
  readonly createdAt: Date;
  readonly deletedAt?: Date;
  readonly products: {
    product: TProduct;
    quantity: number;
    price: number;
    discount: boolean;
  }[];
  readonly org: TOrg;
}

export type ProductsOrder<TProduct = Schema.Types.ObjectId> = {
  product: TProduct;
  quantity: number;
  price: number;
  discount: boolean;
};

export type HistoryOrder = {
  id: string;
  table: string;
  data: Date;
  name: string;
  category: string;
  totalPrice: string;
  itens: {
    imageUrl: string;
    quantity: number;
    name: string;
    price: number;
    discount: boolean;
    id: string;
  }[];
};

export type OrderType<TProduct = ProductPropertie> = {
  id: string;
  table: string;
  status: STATUS;
  createdAt: Date;
  deletedAt?: Date;
  products: {
    product: TProduct;
    quantity: number;
    price: number;
    discount: boolean;
  }[];
};

export type ListOrderType = Pick<
  ProductType,
  '_id' | 'name' | 'description' | 'imageUrl' | 'category'
>;

export type HistoryOrdersType = Pick<
  ProductType<Pick<CategoryType, 'name' | 'icon'>>,
  '_id' | 'name' | 'imageUrl' | 'category'
>;
