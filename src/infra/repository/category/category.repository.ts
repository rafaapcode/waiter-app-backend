import { EditCategoryDto } from '@core/http/category/dto/Input.dto';
import { CategoryEntity } from '@core/http/category/entity/category.entity';
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

  async createCategory(
    categoryData: CategoryEntity<string>,
  ): Promise<CategoryEntity<string>> {
    const categorie = await this.categoryModel.create(categoryData.toCreate());

    return CategoryEntity.toEntity({
      id: categorie.id,
      icon: categorie.icon,
      name: categorie.name,
      org: categorie.org.toString(),
    });
  }

  async listCategory(orgId: string): Promise<CategoryEntity<string>[]> {
    const categories = await this.categoryModel.find({ org: orgId });

    if (!categories) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return categories.map(
      (c) => new CategoryEntity(c.name, c.icon, c.org.toString(), c.id),
    );
  }

  async findCategoryByName(name: string, orgId: string): Promise<boolean> {
    const category = await this.categoryModel.findOne({ name, org: orgId });

    if (!category) {
      return false;
    }

    return true;
  }

  async findCategoryById(categoryId: string): Promise<boolean> {
    const category = await this.categoryModel.findById(categoryId);

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

  async verifyCategoryOwnership(
    orgid: string,
    categoryId: string,
  ): Promise<boolean> {
    const category = await this.categoryModel.findOne({
      _id: categoryId,
      org: orgid,
    });
    if (!category) {
      return false;
    }

    return true;
  }
}
