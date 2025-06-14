import { OrderGateway } from '@core/websocket/gateway/gateway';
import { OrderRepository } from '@infra/repository/order/order.repository';
import { ProductRepository } from '@infra/repository/product/product.service';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '@shared/types/Category.type';
import {
  HistoryOrder,
  HistoryOrdersType,
  ListOrderType,
  OrderType,
} from '@shared/types/Order.type';
import { Product, ProductType } from '@shared/types/Product.type';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { ChangeOrderDto, CreateOrderDto } from './dto/Input.dto';
import { INewOrder } from './types/neworder.type';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly orderWs: OrderGateway,
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
    createOrderData: CreateOrderDto,
  ): Promise<OrderType<ProductType>> {
    const productsIds = createOrderData.products.map(
      (product) => product.product,
    );

    const allProductsExists =
      await this.productRepository.allProductsExists(productsIds);

    const newOrder: INewOrder = {
      table: createOrderData.table,
      products: [],
      org: createOrderData.org,
    };

    for (const productInfo of allProductsExists) {
      const { id, price, priceInDiscount, discount } = productInfo;
      const orderProducts = createOrderData.products
        .filter((p) => p.product === id)
        .map((p) => ({
          ...p,
          price: discount ? priceInDiscount : price,
          discount,
        }));

      newOrder.products.push(...orderProducts);
    }

    const order = await this.orderRepository.createOrder(newOrder);
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

  async listOrders(orgId: string): Promise<ListOrderType[]> {
    const orders = await this.orderRepository.listOrders(orgId);
    if (!orders) {
      throw new InternalServerErrorException('Erro ao listar os pedidos');
    }

    if (orders.length === 0) {
      throw new HttpException(null, 204);
    }

    return orders;
  }

  async restartDay(orgId: string): Promise<boolean> {
    const orders = await this.orderRepository.restartDay(orgId);

    if (orders) {
      this.orderWs.server.emit('orders@restart_day');
    }

    return orders;
  }

  async historyPage(
    orgId: string,
    page: number,
  ): Promise<{ total_pages: number; history: HistoryOrder[] }> {
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
    return { total_pages, history: this.toHistoryOrder(orders) };
  }

  async historyFilterPage(
    orgId: string,
    filters: { to: Date; from: Date },
    page: number,
  ): Promise<{ total_pages: number; history: HistoryOrder[] }> {
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

    return { total_pages, history: this.toHistoryOrder(orders) };
  }

  async deleteHistoryOrder(oderId: string): Promise<boolean> {
    const orders = await this.orderRepository.deleteOrderHistory(oderId);
    return orders;
  }

  private toHistoryOrder(orders: HistoryOrdersType[]): HistoryOrder[] {
    const formatOrders: HistoryOrder[] = orders.map((order) => {
      if (!order) throw new NotFoundException('Pedido não encontrado !');
      const filteredProducts = order.products.filter((p) => p.product);

      if (
        !order.products ||
        order.products.length === 0 ||
        filteredProducts.length === 0
      ) {
        return {
          id: order.id,
          table: order.table,
          data: order.createdAt,
          totalPrice: formatCurrency(0),
          name: 'Nome não identificado',
          category: 'Categoria não identificada',
          itens: [],
        };
      }
      const namesAndPrice = order.products.reduce(
        (acc, product) => {
          const productInfo = product.product as Product;
          if (!productInfo.id) {
            return acc;
          }
          acc.name += productInfo.name + ', ';
          acc.totalPrice += product.price * product.quantity;

          return acc;
        },
        { name: '', totalPrice: 0 },
      );

      const itens = order.products.map((product) => {
        const productInfo = product.product as Product;
        return {
          imageUrl: productInfo.imageUrl,
          quantity: product.quantity,
          name: productInfo.name,
          price: product.price,
          discount: product.discount,
          id: productInfo.id,
        };
      });

      const product = filteredProducts[0].product as Product;
      const category = product.category as Category;
      return {
        id: order.id,
        table: order.table,
        data: order.createdAt,
        totalPrice: formatCurrency(namesAndPrice.totalPrice),
        name: namesAndPrice.name,
        category: category ? `${category.icon} ${category.name}`.trim() : '',
        itens,
      };
    });
    return formatOrders;
  }
}
