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
import { CurrentUser } from '@shared/decorators/getCurrentUser.decorator';
import { IsPublic } from '@shared/decorators/isPublic';
import { Roles } from '@shared/decorators/role.decorator';
import { ResponseInterceptor } from '@shared/interceptor/response-interceptor';
import { ResponseInterceptorArray } from '@shared/interceptor/response-interceptor-array';
import { JwtPayload } from '@shared/types/express';
import { Role } from '../authentication/roles/role.enum';
import { ChangeOrderDto, CreateOrderDto } from './dto/Input.dto';
import {
  OutPutCreateOrdersDto,
  OutPutHistoryOrderDto,
  OutPutListOrdersDto,
  OutPutMessageDto,
} from './dto/OutPut.dto';
import { OrderEntity } from './entity/order.entity';
import { OrderService } from './services/order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('history/:orgId/:page')
  @Roles(Role.ADMIN, Role.WAITER)
  @UseInterceptors(new ResponseInterceptor(OutPutHistoryOrderDto))
  async historyOfOrders(
    @CurrentUser() user: JwtPayload,
    @Param() params: { page: string; orgId: string },
  ): Promise<OutPutHistoryOrderDto> {
    const { orgId, page } = params;
    const pageParsed = parseInt(page);
    const orders = await this.orderService.historyPage(
      user.id,
      orgId,
      pageParsed,
    );
    return {
      total_pages: orders.total_pages,
      history: OrderEntity.toHistoryOrder(orders.orders),
    };
  }

  @Get('history/filter/:orgId/:page')
  @Roles(Role.ADMIN, Role.WAITER)
  @UseInterceptors(new ResponseInterceptor(OutPutHistoryOrderDto))
  async historyOfOrdersFiltered(
    @CurrentUser() user: JwtPayload,
    @Param() params: { page: string; orgId: string },
    @Query() filters: { to: Date; from: Date },
  ): Promise<OutPutHistoryOrderDto> {
    if (!filters.to || !filters.from) {
      throw new BadRequestException('Os filtros de data são obrigatórios');
    }
    const { orgId, page } = params;
    const pageParsed = parseInt(page);
    const orders = await this.orderService.historyFilterPage(
      user.id,
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
    @CurrentUser() user: JwtPayload,
    @Param('orgId') orgId: string,
  ): Promise<OutPutListOrdersDto> {
    const orders = await this.orderService.listOrders(user.id, orgId);
    return OrderEntity.httpListOrdersResponse(orders);
  }

  @Post('')
  @IsPublic()
  @UseInterceptors(new ResponseInterceptor(OutPutCreateOrdersDto))
  async createOrder(
    @Body() orderData: CreateOrderDto,
  ): Promise<OutPutCreateOrdersDto> {
    const order = OrderEntity.newOrder(orderData);
    const orderCreated = await this.orderService.createOrder(order);
    return orderCreated.httpCreateResponse();
  }

  @Patch('/:orgId/:orderId')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async changeStatusOrder(
    @CurrentUser() user: JwtPayload,
    @Param() params: { orgId: string; orderId: string },
    @Body() newStatus: ChangeOrderDto,
  ): Promise<OutPutMessageDto> {
    const { orderId, orgId } = params;
    await this.orderService.changeOrderStatus(
      user.id,
      orgId,
      orderId,
      newStatus,
    );
    return {
      message: 'Pedido atualizado com sucesso !',
    };
  }

  @Delete('/:orgId/:orderId')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async deleteOrder(
    @CurrentUser() user: JwtPayload,
    @Param() params: { orgId: string; orderId: string },
  ): Promise<OutPutMessageDto> {
    const { orderId, orgId } = params;
    await this.orderService.deleteOrder(user.id, orgId, orderId);
    return {
      message: 'Ordem deletada com sucesso !',
    };
  }

  @Delete('history/:orgId/:orderId')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async deleteHistoryOrder(
    @CurrentUser() user: JwtPayload,
    @Param() params: { orgId: string; orderId: string },
  ): Promise<OutPutMessageDto> {
    const { orderId, orgId } = params;
    await this.orderService.deleteHistoryOrder(user.id, orgId, orderId);
    return {
      message: 'Registro deletado com sucesso !',
    };
  }

  @Patch('/restart/:orgId')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async restartDay(
    @CurrentUser() user: JwtPayload,
    @Param('orgId') orgId: string,
  ): Promise<OutPutMessageDto> {
    await this.orderService.restartDay(user.id, orgId);
    return {
      message: 'Dia reiniciado com sucesso !',
    };
  }
}
