import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OrderGateway } from 'src/core/websocket/gateway/gateway';
import { Category } from 'src/types/Category.type';
import { Product } from 'src/types/Product.type';
import { formatCurrency } from 'src/utils/formatCurrency';
import { OrderRepository } from '../../../infra/repository/order/order.service';
import { HistoryOrder, Order } from '../../../types/Order.type';
import { validateSchema } from '../../../utils/validateSchema';
import { ChangeOrderDto, changeOrderSchema } from './dto/ChangeOrder.dto';
import { CreateOrderDTO, createOrderSchema } from './dto/CreateOrder.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderWs: OrderGateway,
  ) {}

  async changeOrderStatus(
    orderId: string,
    newStatus: ChangeOrderDto,
  ): Promise<Order> {
    try {
      const validateStatus = validateSchema(changeOrderSchema, newStatus);

      if (!validateStatus.success) {
        throw new BadRequestException(validateStatus.error.errors);
      }

      const order = await this.orderRepository.changeOrderStatus(
        orderId,
        newStatus,
      );

      if (!order) {
        throw new NotFoundException('Pedido não encontrado!');
      }

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

  async createOrder(createOrderData: CreateOrderDTO): Promise<Order> {
    try {
      const validateData = validateSchema(createOrderSchema, createOrderData);
      if (!validateData.success) {
        throw new BadGatewayException(validateData.error.errors);
      }

      const order = await this.orderRepository.createOrder(createOrderData);
      if (!order) {
        throw new InternalServerErrorException('Erro ao criar novo pedidod');
      }

      this.orderWs.server.emit('orders@new', order);

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
      const orderDeleted = await this.orderRepository.deleteOrder(orderId);
      if (!orderDeleted) {
        throw new NotFoundException('Pedido não encontrado!');
      }

      return orderDeleted;
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
      const orders = await this.orderRepository.listOrders();
      if (!orders) {
        throw new InternalServerErrorException('Erro ao listar os pedidos');
      }

      if (orders.length === 0) {
        throw new HttpException(null, 204);
      }

      return orders;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof HttpException) {
        throw new HttpException(error.getResponse(), error.getStatus());
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
      const orders = await this.orderRepository.restartDay();

      if (orders) {
        this.orderWs.server.emit('orders@restart_day');
      }

      return orders;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof HttpException) {
        throw new HttpException(error.getResponse(), error.getStatus());
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

  async historyPage(
    page: number,
  ): Promise<{ total_pages: number; history: HistoryOrder[] }> {
    try {
      const { total_pages, orders } =
        await this.orderRepository.historyOfOrders(page);

      if (orders && orders.length === 0) {
        throw new NotFoundException('Nenhum pedido encontrado!');
      }

      if (!orders) {
        throw new NotFoundException('Nenhum pedido encontrado!');
      }
      return { total_pages, history: this.toHistoryOrder(orders) };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof HttpException) {
        throw new HttpException(error.getResponse(), error.getStatus());
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

  async historyFilterPage(
    filters: { to: Date; from: Date },
    page: number,
  ): Promise<{ total_pages: number; history: HistoryOrder[] }> {
    try {
      const { total_pages, orders } =
        await this.orderRepository.historyOfOrdersWithFilters(filters, page);

      if (orders && orders.length === 0) {
        throw new NotFoundException('Nenhum pedido encontrado!');
      }

      if (!orders) {
        throw new NotFoundException('Nenhum pedido encontrado!');
      }

      return { total_pages, history: this.toHistoryOrder(orders) };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof HttpException) {
        throw new HttpException(error.getResponse(), error.getStatus());
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

  async deleteHistoryOrder(oderId: string): Promise<boolean> {
    try {
      const orders = await this.orderRepository.deleteOrderHistory(oderId);
      return orders;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof HttpException) {
        throw new HttpException(error.getResponse(), error.getStatus());
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

  private toHistoryOrder(orders: Order[]): HistoryOrder[] {
    const formatOrders: HistoryOrder[] = orders.map((order) => {
      if (!order) throw new NotFoundException('Pedido não encontrado !');
      const filteredProducts = order.products.filter((p) => p.product);

      if (
        !order.products ||
        order.products.length === 0 ||
        filteredProducts.length === 0
      ) {
        return {
          id: order._id.toString(),
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
          acc.totalPrice +=
            (productInfo.discount
              ? productInfo.priceInDiscount
              : productInfo.price) * product.quantity;

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
          price: productInfo.discount
            ? productInfo.priceInDiscount
            : productInfo.price,
          discount: productInfo.discount,
          priceInDiscount: productInfo.priceInDiscount,
          id: productInfo.id,
        };
      });

      const product = filteredProducts[0].product as Product;
      const category = product.category as Category;
      return {
        id: order._id.toString(),
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
