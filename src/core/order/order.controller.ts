import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptor/response-interceptor';
import { ChangeOrderDto } from './dto/ChangeOrder.dto';
import { CreateOrderDTO } from './dto/CreateOrder.dto';
import {
  createOrderSchemaResponse,
  ResponseCreateOrderDTO,
} from './dto/response-create-orders.dto';
import {
  deleteOrderSchemaResponse,
  ResponseDeleteOrderDTO,
} from './dto/response-delete-orders.dto';
import {
  listOrdersSchemaResponse,
  ResponseListOrdersDTO,
} from './dto/response-list-orders.dto';
import {
  ResponseUpdateOrderDTO,
  updateOrderSchemaResponse,
} from './dto/response-update-status-orders.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('')
  @UseInterceptors(new ResponseInterceptor(listOrdersSchemaResponse))
  async listOrders(): Promise<ResponseListOrdersDTO> {
    const orders = await this.orderService.listOrders();
    return orders.map((order) => ({
      _id: order.id,
      createdAt: order.createdAt,
      table: order.table,
      status: order.status,
      products: order.products,
    }));
  }

  @Post('')
  @UseInterceptors(new ResponseInterceptor(createOrderSchemaResponse))
  async createOrder(
    @Body() orderData: CreateOrderDTO,
  ): Promise<ResponseCreateOrderDTO> {
    const orderCreated = await this.orderService.createOrder(orderData);
    return {
      table: orderCreated.table,
      status: orderCreated.status,
      products: orderCreated.products,
    };
  }

  @Patch('/:orderId')
  @UseInterceptors(new ResponseInterceptor(updateOrderSchemaResponse))
  async changeStatusOrder(
    @Param('orderId') orderId: string,
    @Body() newStatus: ChangeOrderDto,
  ): Promise<ResponseUpdateOrderDTO> {
    const orderUpdated = await this.orderService.changeOrderStatus(
      orderId,
      newStatus,
    );
    return {
      _id: orderUpdated.id,
      table: orderUpdated.table,
      status: orderUpdated.status,
      products: orderUpdated.products,
    };
  }

  @Delete('/:orderId')
  @UseInterceptors(new ResponseInterceptor(deleteOrderSchemaResponse))
  async deleteOrder(
    @Param('orderId') orderId: string,
  ): Promise<ResponseDeleteOrderDTO> {
    await this.orderService.deleteOrder(orderId);
    return {
      message: 'Ordem deletada com sucesso !',
    };
  }
}
