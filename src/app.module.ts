import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthenticationModule } from './core/http/authentication/authentication.module';
import { CategoryModule } from './core/http/category/category.module';
import { IngredientModule } from './core/http/ingredient/ingredient.module';
import { OrderModule } from './core/http/order/order.module';
import { OrgModule } from './core/http/org/org.module';
import { ProductModule } from './core/http/product/product.module';
import { UserModule } from './core/http/user/user.module';
import { GatewayModule } from './core/websocket/gateway/gateway.module';
import { DatabaseModule } from './infra/database/database.module';
import { RepositoryModule } from './infra/repository/repository.module';

@Module({
  imports: [
    DatabaseModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    RepositoryModule,
    GatewayModule,
    UserModule,
    IngredientModule,
    OrgModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
