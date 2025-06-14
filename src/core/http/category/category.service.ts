import { CategoryRepository } from '@infra/repository/category/category.service';
import { ProductRepository } from '@infra/repository/product/product.service';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '@shared/types/Category.type';
import { CreateCategoryDto, EditCategoryDto } from './dto/Input.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    const categoryExist = await this.categoryRepository.findCategoryByName(
      data.name,
      data.org,
    );

    if (categoryExist) {
      throw new BadRequestException('Categoria já existe');
    }

    const category = await this.categoryRepository.createCategory(data);
    if (!category) {
      throw new InternalServerErrorException('Erro ao criar nova categoria');
    }
    return category;
  }

  async listCategory(orgId: string): Promise<Category[]> {
    const categories = await this.categoryRepository.listCategory(orgId);

    if (categories.length === 0) {
      throw new HttpException(null, 204);
    }

    return categories;
  }

  async editCategory(id: string, data: EditCategoryDto): Promise<boolean> {
    const categories = await this.categoryRepository.editCategory(id, data);

    return categories;
  }

  async deleteCategory(orgId: string, categoryId: string): Promise<boolean> {
    const categoryIsBeingUsed =
      await this.productRepository.categoryIsBeingUsed(categoryId, orgId);

    if (categoryIsBeingUsed) {
      throw new BadRequestException(
        'Categoria esta sendo usada por algum PRODUTO',
      );
    }

    const categorydeleted =
      await this.categoryRepository.deleteCategory(categoryId);
    if (!categorydeleted) {
      throw new NotFoundException('Categoria não existe');
    }
    return true;
  }
}
