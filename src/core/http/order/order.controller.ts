import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptorArray } from '@shared/interceptor/response-interceptor-array';
import { ResponseInterceptorNew } from '@shared/interceptor/response-interceptor-new';
import { Roles } from '../authentication/decorators/role.decorator';
import { UserGuard } from '../authentication/guard/userAuth.guard';
import { Role } from '../authentication/roles/role.enum';
import { ChangeOrderDto, CreateOrderDto } from './dto/Input.dto';
import {
  OutPutCreateOrdersDto,
  OutPutHistoryOrderDto,
  OutPutListOrdersDto,
  OutPutMessageDto,
  OutPutUpdateOrderDto,
} from './dto/OutPut.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('history/:page')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN, Role.WAITER)
  @UseInterceptors(new ResponseInterceptorNew(OutPutHistoryOrderDto))
  async historyOfOrders(
    @Param('page', ParseIntPipe) page: number,
  ): Promise<OutPutHistoryOrderDto> {
    const orders = await this.orderService.historyPage(page);
    return orders;
  }

  @Get('history/filter/:page')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN, Role.WAITER)
  @UseInterceptors(new ResponseInterceptorNew(OutPutHistoryOrderDto))
  async historyOfOrdersFiltered(
    @Param('page', ParseIntPipe) page: number,
    @Query() filters: { to: Date; from: Date },
  ): Promise<OutPutHistoryOrderDto> {
    if (!filters.to || !filters.from) {
      throw new BadRequestException('Os filtros de data são obrigatórios');
    }
    const orders = await this.orderService.historyFilterPage(
      {
        from: new Date(filters.from),
        to: new Date(filters.to),
      },
      page,
    );
    return orders;
  }

  @Get('')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN, Role.WAITER)
  @UseInterceptors(new ResponseInterceptorArray(OutPutListOrdersDto, 'orders'))
  async listOrders(): Promise<OutPutListOrdersDto> {
    const orders = await this.orderService.listOrders();
    return {
      orders: orders.map((order) => ({
        _id: order.id,
        createdAt: order.createdAt,
        table: order.table,
        status: order.status,
        products: order.products,
      })),
    };
  }

  @Post('')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN, Role.WAITER, Role.CLIENT)
  @UseInterceptors(new ResponseInterceptorNew(OutPutCreateOrdersDto))
  async createOrder(
    @Body() orderData: CreateOrderDto,
  ): Promise<OutPutCreateOrdersDto> {
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
  @UseInterceptors(new ResponseInterceptorNew(OutPutUpdateOrderDto))
  async changeStatusOrder(
    @Param('orderId') orderId: string,
    @Body() newStatus: ChangeOrderDto,
  ): Promise<OutPutUpdateOrderDto> {
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
  @UseInterceptors(new ResponseInterceptorNew(OutPutMessageDto))
  async deleteOrder(
    @Param('orderId') orderId: string,
  ): Promise<OutPutMessageDto> {
    await this.orderService.deleteOrder(orderId);
    return {
      message: 'Ordem deletada com sucesso !',
    };
  }

  @Delete('history/:orderId')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptorNew(OutPutMessageDto))
  async deleteHistoryOrder(
    @Param('orderId') orderId: string,
  ): Promise<OutPutMessageDto> {
    await this.orderService.deleteHistoryOrder(orderId);
    return {
      message: 'Registro deletado com sucesso !',
    };
  }

  @Patch('')
  @HttpCode(200)
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptorNew(OutPutMessageDto))
  async restartDay(): Promise<OutPutMessageDto> {
    await this.orderService.restartDay();
    return {
      message: 'Dia reiniciado com sucesso !',
    };
  }
}
