import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CategoryModule } from './core/category/category.module';
import { OrderModule } from './core/order/order.module';
import { ProductModule } from './core/product/product.module';
import { DatabaseModule } from './infra/database/database.module';
import { RepositoryModule } from './infra/repository/repository.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CategoryModule,
    ProductModule,
    OrderModule,
    RepositoryModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
