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
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '@shared/decorators/role.decorator';
import { ResponseInterceptor } from '@shared/interceptor/response-interceptor';
import { ResponseInterceptorArray } from '@shared/interceptor/response-interceptor-array';
import { Role } from '../authentication/roles/role.enum';
import { ChangeOrderDto, CreateOrderDto } from './dto/Input.dto';
import {
  OutPutCreateOrdersDto,
  OutPutHistoryOrderDto,
  OutPutListOrdersDto,
  OutPutMessageDto,
} from './dto/OutPut.dto';
import { OrderEntity } from './entity/order.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('history/:page/:orgId')
  @Roles(Role.ADMIN, Role.WAITER)
  @UseInterceptors(new ResponseInterceptor(OutPutHistoryOrderDto))
  async historyOfOrders(
    @Param() params: { page: string; orgId: string },
  ): Promise<OutPutHistoryOrderDto> {
    const { orgId, page } = params;
    const pageParsed = parseInt(page);
    const orders = await this.orderService.historyPage(orgId, pageParsed);
    return {
      total_pages: orders.total_pages,
      history: OrderEntity.toHistoryOrder(orders.orders),
    };
  }

  @Get('history/filter/:page/:orgId')
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
    return {
      total_pages: orders.total_pages,
      history: OrderEntity.toHistoryOrder(orders.orders),
    };
  }

  @Get(':orgId')
  @Roles(Role.ADMIN, Role.WAITER)
  @UseInterceptors(new ResponseInterceptorArray(OutPutListOrdersDto, 'orders'))
  async listOrders(
    @Param('orgId') orgId: string,
  ): Promise<OutPutListOrdersDto> {
    const orders = await this.orderService.listOrders(orgId);
    return OrderEntity.httpListOrdersResponse(orders);
  }

  @Post('')
  @Roles(Role.ADMIN, Role.WAITER, Role.CLIENT)
  @UseInterceptors(new ResponseInterceptor(OutPutCreateOrdersDto))
  async createOrder(
    @Body() orderData: CreateOrderDto,
  ): Promise<OutPutCreateOrdersDto> {
    const order = OrderEntity.newOrder(orderData);

    const orderCreated = await this.orderService.createOrder(order);
    return orderCreated.httpCreateResponse();
  }

  @Patch('/:orderId')
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
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async restartDay(@Param('orgId') orgId: string): Promise<OutPutMessageDto> {
    await this.orderService.restartDay(orgId);
    return {
      message: 'Dia reiniciado com sucesso !',
    };
  }
}
