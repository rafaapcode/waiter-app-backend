import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/infra/repository/repository.module';
import { WaiterController } from './waiter.controller';
import { WaiterService } from './waiter.service';

@Module({
  imports: [RepositoryModule],
  providers: [WaiterService],
  controllers: [WaiterController],
})
export class WaiterModule {}
