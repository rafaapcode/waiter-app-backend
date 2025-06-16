import { OrderGateway } from '@core/websocket/gateway/gateway';
import { OrderRepository } from '@infra/repository/order/order.repository';
import { OrgRepository } from '@infra/repository/org/org.repository';
import { ProductRepository } from '@infra/repository/product/product.repository';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HistoryOrdersType, ListOrderType } from '@shared/types/Order.type';
import { ProductType } from '@shared/types/Product.type';
import { VerifyOrgOwnershipService } from '../org/services/verifyOrgOwnership.service';
import { ChangeOrderDto } from './dto/Input.dto';
import { OrderEntity } from './entity/order.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly orgRepository: OrgRepository,
    private readonly orderWs: OrderGateway,
    private readonly orgVerifyOwnershipService: VerifyOrgOwnershipService,
  ) {}

  async changeOrderStatus(
    orderId: string,
    newStatus: ChangeOrderDto,
  ): Promise<void> {
    const orderExists = await this.orderRepository.orderExists(orderId);

    if (!orderExists) {
      throw new NotFoundException('Pedido não encontrado!');
    }

    await this.orderRepository.changeOrderStatus(orderId, newStatus);
  }

  async createOrder(
    createOrderData: OrderEntity<string, string>,
  ): Promise<OrderEntity<ProductType, string>> {
    await this.orgRepository.orgExists(createOrderData.org);

    const productsIds = createOrderData.products.map(
      (product) => product.product,
    );

    const allProductsExists =
      await this.productRepository.allProductsExists(productsIds);

    const order = await this.orderRepository.createOrder(
      createOrderData.toCreate(allProductsExists),
    );
    if (!order) {
      throw new InternalServerErrorException('Erro ao criar novo pedidod');
    }

    this.orderWs.server.emit('orders@new', order);

    return order;
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    const orderDeleted = await this.orderRepository.deleteOrder(orderId);
    if (!orderDeleted) {
      throw new NotFoundException('Pedido não encontrado!');
    }

    return orderDeleted;
  }

  async listOrders(
    userid: string,
    orgId: string,
  ): Promise<OrderEntity<ListOrderType>[]> {
    await this.orgVerifyOwnershipService.verify(userid, orgId);
    await this.orgRepository.orgExists(orgId);
    const orders = await this.orderRepository.listOrders(orgId);
    if (!orders) {
      throw new InternalServerErrorException('Erro ao listar os pedidos');
    }

    if (orders.length === 0) {
      throw new HttpException(null, 204);
    }

    return orders;
  }

  async restartDay(userid: string, orgId: string): Promise<boolean> {
    await this.orgVerifyOwnershipService.verify(userid, orgId);

    await this.orgRepository.orgExists(orgId);
    const orders = await this.orderRepository.restartDay(orgId);

    if (orders) {
      this.orderWs.server.emit('orders@restart_day');
    }

    return orders;
  }

  async historyPage(
    userid: string,
    orgId: string,
    page: number,
  ): Promise<{
    total_pages: number;
    orders: OrderEntity<HistoryOrdersType, string>[];
  }> {
    await this.orgVerifyOwnershipService.verify(userid, orgId);
    await this.orgRepository.orgExists(orgId);
    const { total_pages, orders } = await this.orderRepository.historyOfOrders(
      orgId,
      page,
    );

    if (orders && orders.length === 0) {
      throw new NotFoundException('Nenhum pedido encontrado!');
    }

    if (!orders) {
      throw new NotFoundException('Nenhum pedido encontrado!');
    }
    return { total_pages, orders };
  }

  async historyFilterPage(
    userid: string,
    orgId: string,
    filters: { to: Date; from: Date },
    page: number,
  ): Promise<{
    total_pages: number;
    orders: OrderEntity<HistoryOrdersType, string>[];
  }> {
    await this.orgVerifyOwnershipService.verify(userid, orgId);
    await this.orgRepository.orgExists(orgId);
    const { total_pages, orders } =
      await this.orderRepository.historyOfOrdersWithFilters(
        orgId,
        filters,
        page,
      );

    if (orders && orders.length === 0) {
      throw new NotFoundException('Nenhum pedido encontrado!');
    }

    if (!orders) {
      throw new NotFoundException('Nenhum pedido encontrado!');
    }

    return { total_pages, orders };
  }

  async deleteHistoryOrder(orderId: string): Promise<boolean> {
    const orders = await this.orderRepository.deleteOrderHistory(orderId);
    return orders;
  }
}
