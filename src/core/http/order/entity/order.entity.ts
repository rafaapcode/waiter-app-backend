import { NotFoundException } from '@nestjs/common';
import { Category } from '@shared/types/Category.type';
import {
  HistoryOrder,
  HistoryOrdersType,
  ListOrderType,
  OrderType,
  STATUS,
} from '@shared/types/Order.type';
import { Org } from '@shared/types/Org.type';
import { Product, ProductType } from '@shared/types/Product.type';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { Schema } from 'mongoose';
import { CreateOrderDto, CreateOrderInternalDto } from '../dto/Input.dto';
import { OutPutCreateOrdersDto, OutPutListOrdersDto } from '../dto/OutPut.dto';

export class OrderEntity<
  TProduct = Schema.Types.ObjectId | Product,
  TOrg = Schema.Types.ObjectId | Org,
> {
  constructor(
    public readonly table: string,
    public readonly createdAt: Date,
    public readonly products: {
      product: TProduct | string;
      quantity: number;
      price: number;
      discount: boolean;
    }[],
    public readonly deletedAt?: Date,
    public readonly status?: STATUS,
    public readonly id?: string,
    public readonly org?: TOrg,
  ) {}

  static newOrder(data: CreateOrderDto): OrderEntity<string, string> {
    return new OrderEntity(
      data.table,
      new Date(),
      data.products.map((p) => ({
        discount: false,
        price: 0,
        product: p.product,
        quantity: p.quantity,
      })),
      undefined,
      STATUS.WAITING,
      undefined,
      data.org,
    );
  }

  static toEntity<TP = string, TO = string>(
    data: OrderType<TP>,
  ): OrderEntity<TP, TO> {
    return new OrderEntity<TP, TO>(
      data.table,
      data.createdAt,
      data.products.map((p) => ({
        product: p.product,
        quantity: p.quantity,
        discount: p.discount,
        price: p.price,
      })),
      data.deletedAt,
      STATUS.WAITING,
      data.id,
    );
  }

  toCreate(products: ProductType<string, string>[]): CreateOrderInternalDto {
    for (const productInfo of products) {
      const { _id, price, priceInDiscount, discount } = productInfo;
      const orderProducts = this.products
        .filter((p) => p.product === _id)
        .map((p) => ({
          ...p,
          price: discount ? priceInDiscount : price,
          discount,
        }));

      this.products.push(...orderProducts);
    }
    return {
      org: this.org as string,
      products: this.products.map((p) => ({
        ...p,
        product: p.product as string,
      })),
      table: this.table,
    };
  }

  httpCreateResponse(): OutPutCreateOrdersDto {
    return {
      _id: this.id,
      table: this.table,
      status: this.status,
      products: this.products,
    };
  }

  static httpListOrdersResponse(
    orders: OrderEntity<ListOrderType>[],
  ): OutPutListOrdersDto {
    return {
      orders: orders.map((order) => ({
        _id: order.id,
        createdAt: order.createdAt,
        table: order.table,
        status: order.status,
        products: order.products,
      })),
    };
  }

  static toHistoryOrder(
    orders: OrderEntity<HistoryOrdersType, string>[],
  ): HistoryOrder[] {
    const formatOrders: HistoryOrder[] = orders.map((order) => {
      if (!order) throw new NotFoundException('Pedido não encontrado !');
      const filteredProducts = order.products.filter((p) => p.product);

      if (
        !order.products ||
        order.products.length === 0 ||
        filteredProducts.length === 0
      ) {
        return {
          id: order.id,
          table: order.table,
          data: order.createdAt,
          totalPrice: formatCurrency(0),
          name: 'Nome não identificado',
          category: 'Categoria não identificada',
          itens: [],
        };
      }
      const namesAndPrice = order.products.reduce(
        (acc, product) => {
          const productInfo = product.product as Product;
          if (!productInfo.id) {
            return acc;
          }
          acc.name += productInfo.name + ', ';
          acc.totalPrice += product.price * product.quantity;

          return acc;
        },
        { name: '', totalPrice: 0 },
      );

      const itens = order.products.map((product) => {
        const productInfo = product.product as Product;
        return {
          imageUrl: productInfo.imageUrl,
          quantity: product.quantity,
          name: productInfo.name,
          price: product.price,
          discount: product.discount,
          id: productInfo.id,
        };
      });

      const product = filteredProducts[0].product as Product;
      const category = product.category as Category;
      return {
        id: order.id,
        table: order.table,
        data: order.createdAt,
        totalPrice: formatCurrency(namesAndPrice.totalPrice),
        name: namesAndPrice.name,
        category: category ? `${category.icon} ${category.name}`.trim() : '',
        itens,
      };
    });
    return formatOrders;
  }
}
