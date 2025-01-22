import { Inject, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { CONSTANTS } from 'src/constants';
import { Order, STATUS } from 'src/types/Order.type';

@Injectable()
export class OrderRepository {
  constructor(
    @Inject(CONSTANTS.ORDER_PROVIDER)
    private orderModel: Model<Order>,
  ) {}

  async changeOrderStatus(orderId: string, newStatus: STATUS): Promise<Order> {
    try {
      const order = await this.orderModel.findByIdAndUpdate(
        orderId,
        { status: newStatus },
        { new: true },
      );

      return order;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createOrder(
    table: string,
    products: { product: mongoose.Schema.Types.ObjectId; quantity: number }[],
  ): Promise<Order> {
    try {
      const order = await this.orderModel.create({ table, products });
      return order;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    try {
      await this.orderModel.findByIdAndDelete(orderId);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async listOrders(): Promise<Order[]> {
    try {
      const orders = await this.orderModel
        .find()
        .sort({ createdAt: -1 })
        .populate('products.product');

      return orders;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
