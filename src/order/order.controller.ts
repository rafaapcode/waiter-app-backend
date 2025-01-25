import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import { Order } from 'src/types/Order.type';
import { ChangeOrderDto, changeOrderSchema } from './dto/ChangeOrder.dto';
import { CreateOrderDTO, createOrderSchema } from './dto/CreateOrder.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('')
  async listOrders(): Promise<Order[]> {
    return await this.orderService.listOrders();
  }

  @Post('')
  @UsePipes(new ZodValidationPipe(createOrderSchema))
  async createOrder(@Body() orderData: CreateOrderDTO): Promise<Order> {
    return await this.orderService.createOrder(orderData);
  }

  @Patch('/:orderId')
  @UsePipes(new ZodValidationPipe(changeOrderSchema))
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
