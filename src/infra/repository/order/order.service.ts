import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { getTodayRange } from 'src/utils/getTodayrange';
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
      const order = (await this.orderModel.create(createOrdeData)).populate(
        'products.product',
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

  async deleteOrder(orderId: string): Promise<boolean> {
    try {
      const orderToDeleted = await this.orderModel.findByIdAndUpdate(orderId, {
        deletedAt: new Date(),
      });
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
        .find({ deletedAt: null })
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

  async restartDay(): Promise<boolean> {
    try {
      const { start, end } = getTodayRange();

      const orders = await this.orderModel.updateMany(
        {
          $and: [
            { createdAt: { $gte: start, $lte: end } },
            { deletedAt: null },
          ],
        },
        { deletedAt: new Date() },
      );

      if (orders.matchedCount === 0) {
        throw new NotFoundException('Nenhum pedido encontrado no dia de hoje.');
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

  async historyOfOrders(page?: number): Promise<Order[]> {
    try {
      const pageNumber = page && page !== 0 ? page : 1;
      const limit = 5;
      const skip = (pageNumber - 1) * limit;

      const orders = await this.orderModel
        .find()
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'products.product',
          select: '_id name imageUrl price discount priceInDiscount category',
          populate: {
            path: 'category',
            select: 'name icon',
          },
        })
        .sort({ createdAt: -1 });

      if (!orders) {
        throw new NotFoundException('Nenhum pedido encontrado');
      }
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

  async deleteOrderHistory(orderId: string): Promise<boolean> {
    try {
      const orders = await this.orderModel.findByIdAndDelete(orderId);

      if (!orders) {
        throw new NotFoundException('Nenhum pedido encontrado');
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
}
