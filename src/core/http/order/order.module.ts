import { Module } from '@nestjs/common';
import { GatewayModule } from 'src/core/websocket/gateway/gateway.module';
import { RepositoryModule } from '../../../infra/repository/repository.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [RepositoryModule, GatewayModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
