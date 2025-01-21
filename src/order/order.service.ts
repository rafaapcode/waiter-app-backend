import { Injectable } from '@nestjs/common';
import { OrderRepository } from 'src/repository/order/order.service';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}
}
