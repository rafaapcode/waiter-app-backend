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
import { VerifyOrgOwnershipService } from '../../org/services/verifyOrgOwnership.service';
import { ChangeOrderDto } from '../dto/Input.dto';
import { OrderEntity } from '../entity/order.entity';
import { VerifyOrderOwnershipService } from './validateOrderOwnership.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly orgRepository: OrgRepository,
    private readonly orderWs: OrderGateway,
    private readonly orgVerifyOwnershipService: VerifyOrgOwnershipService,
    private readonly orderVerifyOwnershipService: VerifyOrderOwnershipService,
  ) {}

  async changeOrderStatus(
    userId: string,
    orgId: string,
    orderId: string,
    newStatus: ChangeOrderDto,
  ): Promise<void> {
    await this.validateEntities({
      orderId,
      orgId,
      userId,
    });

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

  async deleteOrder(
    userId: string,
    orgId: string,
    orderId: string,
  ): Promise<boolean> {
    await this.validateEntities({
      orderId,
      orgId,
      userId,
    });

    const orderDeleted = await this.orderRepository.deleteOrder(orderId);
    if (!orderDeleted) {
      throw new NotFoundException('Pedido não encontrado!');
    }

    return orderDeleted;
  }

  async listOrders(
    userId: string,
    orgId: string,
  ): Promise<OrderEntity<ListOrderType>[]> {
    await this.validateEntities({
      orgId,
      userId,
    });

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

  async restartDay(userId: string, orgId: string): Promise<boolean> {
    await this.validateEntities({
      orgId,
      userId,
    });

    await this.orgRepository.orgExists(orgId);
    const orders = await this.orderRepository.restartDay(orgId);

    if (orders) {
      this.orderWs.server.emit('orders@restart_day');
    }

    return orders;
  }

  async historyPage(
    userId: string,
    orgId: string,
    page: number,
  ): Promise<{
    total_pages: number;
    orders: OrderEntity<HistoryOrdersType, string>[];
  }> {
    await this.validateEntities({
      orgId,
      userId,
    });

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
    userId: string,
    orgId: string,
    filters: { to: Date; from: Date },
    page: number,
  ): Promise<{
    total_pages: number;
    orders: OrderEntity<HistoryOrdersType, string>[];
  }> {
    await this.validateEntities({
      orgId,
      userId,
    });
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

  async deleteHistoryOrder(
    userId: string,
    orgId: string,
    orderId: string,
  ): Promise<boolean> {
    await this.validateEntities({
      orgId,
      userId,
      orderId,
    });
    const orders = await this.orderRepository.deleteOrderHistory(orderId);
    return orders;
  }

  private async validateEntities({
    orderId,
    orgId,
    userId,
  }: {
    userId: string;
    orgId: string;
    orderId?: string;
  }) {
    await Promise.all([
      this.orgVerifyOwnershipService.verify(userId, orgId),
      orderId && this.orderVerifyOwnershipService.verify(orgId, orderId),
    ]);
  }
}
