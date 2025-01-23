import { Test, TestingModule } from '@nestjs/testing';
import { OrderRepository } from 'src/repository/order/order.service';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let order: OrderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService, OrderRepository],
    }).compile();

    service = module.get<OrderService>(OrderService);
    order = module.get<OrderRepository>(OrderRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should orde be defined', () => {
    expect(order).toBeDefined();
  });
});
