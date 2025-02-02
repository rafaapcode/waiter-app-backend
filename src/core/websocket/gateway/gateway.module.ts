import { Module } from '@nestjs/common';
import { OrderGateway } from './gateway';

@Module({
  providers: [OrderGateway],
})
export class GatewayModule {}
