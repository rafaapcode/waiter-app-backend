import { Module } from '@nestjs/common';
import { OrderGateway } from './gateway';

@Module({
  providers: [OrderGateway],
  exports: [OrderGateway],
})
export class GatewayModule {}
