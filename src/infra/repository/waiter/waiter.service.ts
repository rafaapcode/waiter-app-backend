import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { WaiterUser } from 'src/types/Waiter.type';
import { CONSTANTS } from '../../../constants';

@Injectable()
export class WaiterRepository {
  constructor(
    @Inject(CONSTANTS.USER_PROVIDER)
    private waiterModel: Model<WaiterUser>,
  ) {}
}
