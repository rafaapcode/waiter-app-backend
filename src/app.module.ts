import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CategoryModule } from './category/category.module';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { RepositoryModule } from './repository/repository.module';

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
