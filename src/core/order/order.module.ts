import { Module } from '@nestjs/common';
import { RepositoryModule } from '../../infra/repository/repository.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [RepositoryModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
