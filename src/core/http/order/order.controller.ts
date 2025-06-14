import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from '@shared/interceptor/response-interceptor';
import { ResponseInterceptorArray } from '@shared/interceptor/response-interceptor-array';
import { Roles } from '../authentication/decorators/role.decorator';
import { UserGuard } from '../authentication/guard/userAuth.guard';
import { Role } from '../authentication/roles/role.enum';
import { ChangeOrderDto, CreateOrderDto } from './dto/Input.dto';
import {
  OutPutCreateOrdersDto,
  OutPutHistoryOrderDto,
  OutPutListOrdersDto,
  OutPutMessageDto,
} from './dto/OutPut.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('history/:page/:orgId')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN, Role.WAITER)
  @UseInterceptors(new ResponseInterceptor(OutPutHistoryOrderDto))
  async historyOfOrders(
    @Param() params: { page: string; orgId: string },
  ): Promise<OutPutHistoryOrderDto> {
    const { orgId, page } = params;
    const pageParsed = parseInt(page);
    const orders = await this.orderService.historyPage(orgId, pageParsed);
    return orders;
  }

  @Get('history/filter/:page/:orgId')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN, Role.WAITER)
  @UseInterceptors(new ResponseInterceptor(OutPutHistoryOrderDto))
  async historyOfOrdersFiltered(
    @Param() params: { page: string; orgId: string },
    @Query() filters: { to: Date; from: Date },
  ): Promise<OutPutHistoryOrderDto> {
    if (!filters.to || !filters.from) {
      throw new BadRequestException('Os filtros de data são obrigatórios');
    }
    const { orgId, page } = params;
    const pageParsed = parseInt(page);
    const orders = await this.orderService.historyFilterPage(
      orgId,
      {
        from: new Date(filters.from),
        to: new Date(filters.to),
      },
      pageParsed,
    );
    return orders;
  }

  @Get(':orgId')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN, Role.WAITER)
  @UseInterceptors(new ResponseInterceptorArray(OutPutListOrdersDto, 'orders'))
  async listOrders(
    @Param('orgId') orgId: string,
  ): Promise<OutPutListOrdersDto> {
    const orders = await this.orderService.listOrders(orgId);
    return {
      orders: orders.map((order) => ({
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
  @UseInterceptors(new ResponseInterceptor(OutPutCreateOrdersDto))
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
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async changeStatusOrder(
    @Param('orderId') orderId: string,
    @Body() newStatus: ChangeOrderDto,
  ): Promise<OutPutMessageDto> {
    await this.orderService.changeOrderStatus(orderId, newStatus);
    return {
      message: 'Pedido atualizado com sucesso !',
    };
  }

  @Delete('/:orderId')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
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
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async deleteHistoryOrder(
    @Param('orderId') orderId: string,
  ): Promise<OutPutMessageDto> {
    await this.orderService.deleteHistoryOrder(orderId);
    return {
      message: 'Registro deletado com sucesso !',
    };
  }

  @Patch('/restart/:orgId')
  @HttpCode(200)
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async restartDay(@Param('orgId') orgId: string): Promise<OutPutMessageDto> {
    await this.orderService.restartDay(orgId);
    return {
      message: 'Dia reiniciado com sucesso !',
    };
  }
}
