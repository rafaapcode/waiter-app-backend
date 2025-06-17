import {
  ChangeOrderDto,
  CreateOrderInternalDto,
} from '@core/http/order/dto/Input.dto';
import { OrderEntity } from '@core/http/order/entity/order.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  HistoryOrdersType,
  ListOrderType,
  Order,
} from '@shared/types/Order.type';
import { ProductType } from '@shared/types/Product.type';
import { getTodayRange } from '@shared/utils/getTodayrange';
import { endOfDay, subHours } from 'date-fns';
import { Model } from 'mongoose';
import { CONSTANTS } from '../../../constants';

@Injectable()
export class OrderRepository {
  constructor(
    @Inject(CONSTANTS.ORDER_PROVIDER)
    private orderModel: Model<Order>,
  ) {}

  async changeOrderStatus(
    orderId: string,
    newStatus: ChangeOrderDto,
  ): Promise<void> {
    await this.orderModel.findByIdAndUpdate(
      orderId,
      { status: newStatus.status },
      { new: true },
    );
  }

  async createOrder(
    newOrder: CreateOrderInternalDto,
  ): Promise<OrderEntity<ProductType, string>> {
    const order = (await this.orderModel.create(newOrder)).populate(
      'products.product',
    );

    const orderCreated = await order;
    return OrderEntity.toEntity<ProductType, string>({
      id: orderCreated.id,
      createdAt: orderCreated.createdAt,
      status: orderCreated.status,
      table: orderCreated.table,
      deletedAt: orderCreated.deletedAt,
      products: orderCreated.products.map((p) => {
        const productTyped = p.product as ProductType;
        return {
          discount: p.discount,
          price: p.price,
          product: productTyped,
          quantity: p.quantity,
        };
      }),
    });
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    const orderToDeleted = await this.orderModel.findByIdAndUpdate(orderId, {
      deletedAt: new Date(),
    });
    if (!orderToDeleted) {
      return false;
    }
    return true;
  }

  async listOrders(orgId: string): Promise<OrderEntity<ListOrderType>[]> {
    const orders = await this.orderModel
      .find({ deletedAt: null, org: orgId })
      .sort({ createdAt: -1 })
      .populate('products.product', '_id name description imageUrl category')
      .select('_id table status products createdAt');

    return orders.map((order) => {
      return OrderEntity.toEntity({
        id: order.id,
        createdAt: order.createdAt,
        status: order.status,
        table: order.table,
        products: order.products.map((p) => {
          const product = p.product as Pick<
            ProductType,
            '_id' | 'name' | 'description' | 'imageUrl' | 'category'
          >;

          return {
            product,
            quantity: p.quantity,
            price: p.price,
            discount: p.discount,
          };
        }),
      });
    });
  }

  async restartDay(orgId: string): Promise<boolean> {
    const { start, end } = getTodayRange();

    const orders = await this.orderModel.updateMany(
      {
        $and: [
          { createdAt: { $gte: start, $lte: end } },
          { deletedAt: null, org: orgId },
        ],
      },
      { deletedAt: new Date() },
    );

    if (orders.matchedCount === 0) {
      throw new NotFoundException('Nenhum pedido encontrado no dia de hoje.');
    }

    return true;
  }

  async historyOfOrders(
    orgId: string,
    page?: number,
  ): Promise<{
    total_pages: number;
    orders: OrderEntity<HistoryOrdersType, string>[];
  }> {
    const pageNumber = page && page !== 0 ? page : 1;
    const limit = 6;
    const skip = (pageNumber - 1) * limit;

    const countDocs = await this.orderModel.countDocuments();

    const ordersResult = await this.orderModel
      .find({ org: orgId })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'products.product',
        select: '_id name imageUrl category',
        populate: {
          path: 'category',
          select: 'name icon',
        },
      })
      .sort({ createdAt: -1 });

    if (!ordersResult) {
      throw new NotFoundException('Nenhum pedido encontrado');
    }

    const orders = ordersResult.map((order) => {
      return OrderEntity.toEntity({
        id: order.id,
        table: order.table,
        status: order.status,
        createdAt: order.createdAt,
        deletedAt: order.deletedAt,
        products: order.products.map((p) => {
          const product = p.product as HistoryOrdersType;

          return {
            quantity: p.quantity,
            price: p.price,
            discount: p.discount,
            product: product,
          };
        }),
      });
    });

    return { total_pages: Math.ceil(countDocs / limit), orders };
  }

  async historyOfOrdersWithFilters(
    orgId: string,
    filters: { to: Date; from: Date },
    page?: number,
  ): Promise<{
    total_pages: number;
    orders: OrderEntity<HistoryOrdersType, string>[];
  }> {
    const pageNumber = page && page !== 0 ? page : 1;
    const limit = 6;
    const skip = (pageNumber - 1) * limit;

    const countDocs = await this.orderModel.countDocuments({
      org: orgId,
      createdAt: {
        $gte: filters.from,
        $lte: subHours(endOfDay(filters.to), 3),
      },
    });

    const ordersResult = await this.orderModel
      .find({
        org: orgId,
        createdAt: {
          $gte: filters.from,
          $lte: subHours(endOfDay(filters.to), 3),
        },
      })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'products.product',
        select: '_id name imageUrl category',
        populate: {
          path: 'category',
          select: 'name icon',
        },
      })
      .sort({ createdAt: -1 });

    if (!ordersResult) {
      throw new NotFoundException('Nenhum pedido encontrado');
    }

    const orders = ordersResult.map((order) => {
      return OrderEntity.toEntity({
        id: order.id,
        table: order.table,
        status: order.status,
        createdAt: order.createdAt,
        deletedAt: order.deletedAt,
        products: order.products.map((p) => {
          const product = p.product as HistoryOrdersType;

          return {
            quantity: p.quantity,
            price: p.price,
            discount: p.discount,
            product: product,
          };
        }),
      });
    });
    return { total_pages: Math.ceil(countDocs / limit), orders };
  }

  async deleteOrderHistory(orderId: string): Promise<boolean> {
    const orders = await this.orderModel.findByIdAndDelete(orderId);

    if (!orders) {
      throw new NotFoundException('Nenhum pedido encontrado');
    }

    return true;
  }

  async productIsBeingUsed(productId: string): Promise<boolean> {
    const productIsBeingUsed = await this.orderModel.findOne({
      'products.product': productId,
      deletedAt: null,
    });

    if (productIsBeingUsed) {
      return true;
    }

    return false;
  }

  async deleteAllOrdersOfOrg(orgId: string): Promise<boolean> {
    await this.orderModel.deleteMany({
      org: orgId,
    });

    return true;
  }

  async orderExists(orderId: string): Promise<boolean> {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      return false;
    }

    return true;
  }

  async verifyOrderOwnership(orderId: string, orgId: string): Promise<boolean> {
    const order = await this.orderModel.findOne({
      _id: orderId,
      org: orgId,
    });

    if (!order) {
      return false;
    }

    return true;
  }
}
