import { ChangeOrderDto } from '@core/http/order/dto/ChangeOrder.dto';
import { INewOrder } from '@core/http/order/types/neworder.type';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async createOrder(newOrder: INewOrder): Promise<Order> {
    try {
      const order = (await this.orderModel.create(newOrder)).populate(
        'products.product',
      );

      return await order;
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
        .populate('products.product', '_id name description imageUrl category')
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

  async historyOfOrders(
    page?: number,
  ): Promise<{ total_pages: number; orders: Order[] }> {
    try {
      const pageNumber = page && page !== 0 ? page : 1;
      const limit = 6;
      const skip = (pageNumber - 1) * limit;

      const countDocs = await this.orderModel.countDocuments();

      const orders = await this.orderModel
        .find()
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

  async historyOfOrdersWithFilters(
    filters: { to: Date; from: Date },
    page?: number,
  ): Promise<{ total_pages: number; orders: Order[] }> {
    try {
      const pageNumber = page && page !== 0 ? page : 1;
      const limit = 6;
      const skip = (pageNumber - 1) * limit;

      const countDocs = await this.orderModel.countDocuments({
        createdAt: {
          $gte: filters.from,
          $lte: subHours(endOfDay(filters.to), 3),
        },
      });

      const orders = await this.orderModel
        .find({
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
    try {
      await this.orderModel.deleteMany({
        org: orgId,
      });

      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
}
