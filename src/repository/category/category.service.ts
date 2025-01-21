import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CONSTANTS } from 'src/constants';
import { Category } from 'src/types/Category.type';

@Injectable()
export class CategoryRepository {
  constructor(
    @Inject(CONSTANTS.CATEGORY_PROVIDER)
    private categoryModel: Model<Category>,
  ) {}
}
