import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { categoryProviders } from './category/category.provider';
import { CategoryRepository } from './category/category.service';
import { orderProviders } from './order/order.provider';
import { OrderRepository } from './order/order.service';
import { productProviders } from './product/product.provider';
import { ProductRepository } from './product/product.service';
import { userProvider } from './user/user.provider';
import { UserRepository } from './user/user.service';
import { waiterProvider } from './waiter/waiter.provider';
import { WaiterRepository } from './waiter/waiter.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...categoryProviders,
    ...orderProviders,
    ...productProviders,
    ...userProvider,
    ...waiterProvider,
    CategoryRepository,
    OrderRepository,
    ProductRepository,
    UserRepository,
    WaiterRepository,
  ],
  exports: [
    CategoryRepository,
    OrderRepository,
    ProductRepository,
    UserRepository,
    WaiterRepository,
  ],
})
export class RepositoryModule {}
