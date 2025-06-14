import { ChangeOrderDto } from '@core/http/order/dto/Input.dto';
import { INewOrder } from '@core/http/order/types/neworder.type';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '@shared/types/Order.type';
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
  ): Promise<Order> {
    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      { status: newStatus.status },
      { new: true },
    );

    return order;
  }

  async createOrder(newOrder: INewOrder): Promise<Order> {
    const order = (await this.orderModel.create(newOrder)).populate(
      'products.product',
    );

    return await order;
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

  async listOrders(orgId: string): Promise<Order[]> {
    const orders = await this.orderModel
      .find({ deletedAt: null, org: orgId })
      .sort({ createdAt: -1 })
      .populate('products.product', '_id name description imageUrl category')
      .select('_id table status products createdAt');

    return orders;
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
  ): Promise<{ total_pages: number; orders: Order[] }> {
    const pageNumber = page && page !== 0 ? page : 1;
    const limit = 6;
    const skip = (pageNumber - 1) * limit;

    const countDocs = await this.orderModel.countDocuments();

    const orders = await this.orderModel
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

    if (!orders) {
      throw new NotFoundException('Nenhum pedido encontrado');
    }
    return { total_pages: Math.ceil(countDocs / limit), orders };
  }

  async historyOfOrdersWithFilters(
    orgId: string,
    filters: { to: Date; from: Date },
    page?: number,
  ): Promise<{ total_pages: number; orders: Order[] }> {
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

    const orders = await this.orderModel
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

    if (!orders) {
      throw new NotFoundException('Nenhum pedido encontrado');
    }
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
}
