import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Org } from 'src/types/Org.type';
import { CONSTANTS } from '../../../constants';

@Injectable()
export class OrgRepository {
  constructor(
    @Inject(CONSTANTS.ORG_PROVIDER)
    private userModel: Model<Org>,
  ) {}
}
