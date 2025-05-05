import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptor/response-interceptor';
import { HistoryOrder } from 'src/types/Order.type';
import { Roles } from '../authentication/decorators/role.decorator';
import { UserGuard } from '../authentication/guard/userAuth.guard';
import { Role } from '../authentication/roles/role.enum';
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
import { historyOrderSchema } from './dto/response-history-orders.dto';
import {
  listOrdersSchemaResponse,
  ResponseListOrdersDTO,
} from './dto/response-list-orders.dto';
import { restartOrderSchemaResponse } from './dto/response-restart-orders.dto';
import {
  ResponseUpdateOrderDTO,
  updateOrderSchemaResponse,
} from './dto/response-update-status-orders.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':page')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN, Role.WAITER)
  @UseInterceptors(new ResponseInterceptor(historyOrderSchema))
  async historyOfOrders(
    @Param('page', ParseIntPipe) page: number,
  ): Promise<HistoryOrder[]> {
    const orders = await this.orderService.historyPage(page);
    return orders;
  }

  @Get('')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN, Role.WAITER)
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
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN, Role.WAITER, Role.CLIENT)
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
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
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
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(deleteOrderSchemaResponse))
  async deleteOrder(
    @Param('orderId') orderId: string,
  ): Promise<ResponseDeleteOrderDTO> {
    await this.orderService.deleteOrder(orderId);
    return {
      message: 'Ordem deletada com sucesso !',
    };
  }

  @Patch('')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(restartOrderSchemaResponse))
  async restartDay(): Promise<ResponseDeleteOrderDTO> {
    await this.orderService.restartDay();
    return {
      message: 'Dia reiniciado com sucesso !',
    };
  }
}
