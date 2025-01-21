import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CONSTANTS } from 'src/constants';
import { Product } from 'src/types/Product.type';

@Injectable()
export class ProductRepository {
  constructor(
    @Inject(CONSTANTS.PRODUCT_PROVIDER)
    private productModel: Model<Product>,
  ) {}
}
