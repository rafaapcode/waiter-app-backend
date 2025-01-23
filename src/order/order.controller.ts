import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Order, STATUS } from 'src/types/Order.type';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('')
  async listOrders(): Promise<Order[]> {
    return await this.orderService.listOrders();
  }

  @Post('')
  async createOrder(@Body() orderData: any): Promise<Order> {
    return await this.orderService.createOrder(
      orderData.table,
      orderData.products,
    );
  }

  @Patch('/:orderId')
  async changeStatusOrder(
    @Param('orderId') orderId: string,
    @Body() newStatus: STATUS,
  ): Promise<Order> {
    return await this.orderService.changeOrderStatus(orderId, newStatus);
  }

  @Delete('/:orderId')
  async deleteOrder(@Param('orderId') orderId: string): Promise<boolean> {
    return await this.orderService.deleteOrder(orderId);
  }
}
