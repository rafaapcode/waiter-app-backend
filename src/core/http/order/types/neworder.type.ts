export interface INewOrder {
  table: string;
  products: {
    product?: string;
    quantity?: number;
    price?: number;
    discount?: boolean;
  }[];
}
