import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CONSTANTS } from 'src/constants';
import { Category } from 'src/types/Category.type';

@Injectable()
export class CategoryRepository {
  constructor(
    @Inject(CONSTANTS.CATEGORY_PROVIDER)
    private categoryModel: Model<Category>,
  ) {}

  async createCategory(icon: string, name: string): Promise<Category> {
    try {
      const categorie = await this.categoryModel.create({ icon, name });

      return categorie;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async listCategory(): Promise<Category[]> {
    try {
      const categorie = await this.categoryModel.find();
      return categorie;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findCategoryByName(name: string): Promise<boolean> {
    try {
      const category = await this.categoryModel.findOne({ name });

      if (!category) {
        return false;
      }

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
