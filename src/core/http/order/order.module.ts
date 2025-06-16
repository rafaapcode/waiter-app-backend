import { GatewayModule } from '@core/websocket/gateway/gateway.module';
import { RepositoryModule } from '@infra/repository/repository.module';
import { Module } from '@nestjs/common';
import { OrgModule } from '../org/org.module';
import { UserModule } from '../user/user.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [RepositoryModule, GatewayModule, UserModule, OrgModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
