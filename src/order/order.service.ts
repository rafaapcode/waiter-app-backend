import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from 'src/repository/order/order.service';
import { Order } from 'src/types/Order.type';
import { ChangeOrderDTO } from './dto/ChangeOrder.dto';
import { CreateOrderDTO } from './dto/CreateOrder.dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async changeOrderStatus(
    orderId: string,
    newStatus: ChangeOrderDTO,
  ): Promise<Order> {
    try {
      const order = await this.orderRepository.changeOrderStatus(
        orderId,
        newStatus.status,
      );

      if (!order) {
        throw new NotFoundException('Pedido não encontrado!');
      }

      return order;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createOrder(createOrderData: CreateOrderDTO): Promise<Order> {
    try {
      const order = await this.orderRepository.createOrder(
        createOrderData.table,
        createOrderData.products,
      );
      if (!order) {
        throw new InternalServerErrorException('Erro ao criar novo pedidod');
      }
      return order;
    } catch (error) {
      console.log(error);
      return null;
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
      console.log(error);
      return false;
    }
  }

  async listOrders(): Promise<Order[]> {
    try {
      const orders = await this.orderRepository.listOrders();
      if (!orders) {
        throw new InternalServerErrorException('Erro ao listar os pedidos');
      }

      return orders;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
