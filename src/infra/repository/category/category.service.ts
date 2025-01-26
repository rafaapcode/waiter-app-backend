import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CONSTANTS } from '../../../constants';
import { CreateCategoryDto } from '../../../core/category/dto/CreateCategory.dto';
import { Category } from '../../../types/Category.type';

@Injectable()
export class CategoryRepository {
  constructor(
    @Inject(CONSTANTS.CATEGORY_PROVIDER)
    private categoryModel: Model<Category>,
  ) {}

  async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    try {
      const categorie = await this.categoryModel.create({
        ...categoryData,
        icon: categoryData.icon || '',
      });

      return categorie;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async listCategory(): Promise<Category[]> {
    try {
      const categorie = await this.categoryModel.find();
      return categorie;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(error.message);
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
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const categoryDeleted =
        await this.categoryModel.findByIdAndDelete(categoryId);

      if (!categoryDeleted) {
        return false;
      }
      return true;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
