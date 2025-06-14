import {
  CreateCategoryDto,
  EditCategoryDto,
} from '@core/http/category/dto/Input.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '@shared/types/Category.type';
import { Model } from 'mongoose';
import { CONSTANTS } from '../../../constants';

@Injectable()
export class CategoryRepository {
  constructor(
    @Inject(CONSTANTS.CATEGORY_PROVIDER)
    private categoryModel: Model<Category>,
  ) {}

  async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    const categorie = await this.categoryModel.create({
      ...categoryData,
      icon: categoryData.icon || '',
    });

    return categorie;
  }

  async listCategory(orgId: string): Promise<Category[]> {
    const categories = await this.categoryModel.find({ org: orgId });

    return categories;
  }

  async findCategoryByName(name: string, orgId: string): Promise<boolean> {
    const category = await this.categoryModel.findOne({ name, org: orgId });

    if (!category) {
      return false;
    }

    return true;
  }

  async editCategory(id: string, data: EditCategoryDto): Promise<boolean> {
    const category = await this.categoryModel.findByIdAndUpdate(id, {
      ...(data.icon && { icon: data.icon }),
      ...(data.name && { name: data.name }),
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return true;
  }

  async deleteCategory(categoryId: string): Promise<boolean> {
    const categoryDeleted =
      await this.categoryModel.findByIdAndDelete(categoryId);

    if (!categoryDeleted) {
      return false;
    }
    return true;
  }

  async deleteAllCategoryOfOrg(orgId: string): Promise<boolean> {
    await this.categoryModel.deleteMany({
      org: orgId,
    });

    return true;
  }
}
