import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { AdminUser } from 'src/types/Adm.type';
import { CONSTANTS } from '../../../constants';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(CONSTANTS.USER_PROVIDER)
    private userModel: Model<AdminUser>,
  ) {}
}
