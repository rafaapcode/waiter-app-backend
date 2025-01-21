import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CONSTANTS } from 'src/constants';
import { Order } from 'src/types/Order.type';

@Injectable()
export class OrderRepository {
  constructor(
    @Inject(CONSTANTS.ORDER_PROVIDER)
    private orderModel: Model<Order>,
  ) {}
}
