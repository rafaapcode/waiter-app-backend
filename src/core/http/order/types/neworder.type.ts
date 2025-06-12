export interface INewOrder {
  table: string;
  org: string;
  products: {
    product?: string;
    quantity?: number;
    price?: number;
    discount?: boolean;
  }[];
}
