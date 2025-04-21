import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CategoryModule } from './core/http/category/category.module';
import { OrderModule } from './core/http/order/order.module';
import { ProductModule } from './core/http/product/product.module';
import { GatewayModule } from './core/websocket/gateway/gateway.module';
import { DatabaseModule } from './infra/database/database.module';
import { RepositoryModule } from './infra/repository/repository.module';
import { UserModule } from './core/http/user/user.module';
import { WaiterModule } from './core/http/waiter/waiter.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CategoryModule,
    ProductModule,
    OrderModule,
    RepositoryModule,
    GatewayModule,
    UserModule,
    WaiterModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
