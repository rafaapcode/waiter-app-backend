import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CONSTANTS } from '../../../constants';
import { ChangeOrderDto } from '../../../core/http/order/dto/ChangeOrder.dto';
import { CreateOrderDTO } from '../../../core/http/order/dto/CreateOrder.dto';
import { Order } from '../../../types/Order.type';

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
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async createOrder(createOrdeData: CreateOrderDTO): Promise<Order> {
    try {
      const order = await this.orderModel.create(createOrdeData);
      return order;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    try {
      const orderToDeleted = await this.orderModel.findByIdAndDelete(orderId);
      if (!orderToDeleted) {
        return false;
      }
      return true;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async listOrders(): Promise<Order[]> {
    try {
      const orders = await this.orderModel
        .find()
        .sort({ createdAt: -1 })
        .populate(
          'products.product',
          '_id name description imageUrl price category discount priceInDiscount',
        )
        .select('_id table status products createdAt');

      return orders;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
