import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CONSTANTS } from 'src/constants';
import { ChangeOrderDto } from 'src/order/dto/ChangeOrder.dto';
import { CreateOrderDTO } from 'src/order/dto/CreateOrder.dto';
import { Order } from 'src/types/Order.type';

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
    try {
      const order = await this.orderModel.findByIdAndUpdate(
        orderId,
        { status: newStatus.status },
        { new: true },
      );

      return order;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createOrder(createOrdeData: CreateOrderDTO): Promise<Order> {
    try {
      const order = await this.orderModel.create(createOrdeData);
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
