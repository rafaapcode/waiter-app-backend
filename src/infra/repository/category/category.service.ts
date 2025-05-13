import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { EditCategoryDto } from 'src/core/http/category/dto/EditCategory.dto';
import { CONSTANTS } from '../../../constants';
import { CreateCategoryDto } from '../../../core/http/category/dto/CreateCategory.dto';
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

  async listCategory(
    page: number,
  ): Promise<{ total_pages: number; categories: Category[] }> {
    try {
      const pageNumber = page && page !== 0 ? page : 1;
      const limit = 6;
      const skip = (pageNumber - 1) * limit;

      const countDocs = await this.categoryModel.countDocuments();

      const categories = await this.categoryModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      return { total_pages: Math.ceil(countDocs / limit), categories };
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

  async editCategory(id: string, data: EditCategoryDto): Promise<boolean> {
    try {
      const category = await this.categoryModel.findByIdAndUpdate(id, {
        ...(data.icon && { icon: data.icon }),
        ...(data.name && { name: data.name }),
      });

      if (!category) {
        throw new NotFoundException('Categoria não encontrada');
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
