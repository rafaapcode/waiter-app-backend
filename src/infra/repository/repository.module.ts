import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { categoryProviders } from './category/category.provider';
import { CategoryRepository } from './category/category.service';
import { orderProviders } from './order/order.provider';
import { OrderRepository } from './order/order.service';
import { productProviders } from './product/product.provider';
import { ProductRepository } from './product/product.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...categoryProviders,
    ...orderProviders,
    ...productProviders,
    CategoryRepository,
    OrderRepository,
    ProductRepository,
  ],
  exports: [CategoryRepository, OrderRepository, ProductRepository],
})
export class RepositoryModule {}
