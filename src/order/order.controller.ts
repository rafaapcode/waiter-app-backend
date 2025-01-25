import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Order } from 'src/types/Order.type';
import { ChangeOrderDto } from './dto/ChangeOrder.dto';
import { CreateOrderDTO } from './dto/CreateOrder.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('')
  async listOrders(): Promise<Order[]> {
    return await this.orderService.listOrders();
  }

  @Post('')
  async createOrder(@Body() orderData: CreateOrderDTO): Promise<Order> {
    return await this.orderService.createOrder(orderData);
  }

  @Patch('/:orderId')
  async changeStatusOrder(
    @Param('orderId') orderId: string,
    @Body() newStatus: ChangeOrderDto,
  ): Promise<Order> {
    return await this.orderService.changeOrderStatus(orderId, newStatus);
  }

  @Delete('/:orderId')
  async deleteOrder(@Param('orderId') orderId: string): Promise<boolean> {
    return await this.orderService.deleteOrder(orderId);
  }
}
