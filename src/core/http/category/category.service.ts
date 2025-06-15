import { CategoryRepository } from '@infra/repository/category/category.repository';
import { OrgRepository } from '@infra/repository/org/org.repository';
import { ProductRepository } from '@infra/repository/product/product.repository';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EditCategoryDto } from './dto/Input.dto';
import { CategoryEntity } from './entity/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
    private readonly orgRepository: OrgRepository,
  ) {}

  async createCategory(
    data: CategoryEntity<string>,
  ): Promise<CategoryEntity<string>> {
    await this.orgRepository.orgExists(data.org);

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

  async listCategory(orgId: string): Promise<CategoryEntity<string>[]> {
    await this.orgRepository.orgExists(orgId);
    const categories = await this.categoryRepository.listCategory(orgId);
    return categories;
  }

  async editCategory(id: string, data: EditCategoryDto): Promise<boolean> {
    const categorieExist = await this.categoryRepository.findCategoryById(id);

    if (!categorieExist) {
      throw new NotFoundException('Categoria não encontrada !');
    }

    const categories = await this.categoryRepository.editCategory(id, data);

    return categories;
  }

  async deleteCategory(orgId: string, categoryId: string): Promise<boolean> {
    await this.orgRepository.orgExists(orgId);
    const categorieExist =
      await this.categoryRepository.findCategoryById(categoryId);

    if (!categorieExist) {
      throw new NotFoundException('Categoria não encontrada !');
    }

    const categoryIsBeingUsed =
      await this.productRepository.categoryIsBeingUsed(categoryId, orgId);

    if (categoryIsBeingUsed) {
      throw new BadRequestException(
        'Categoria esta sendo usada por algum PRODUTO',
      );
    }

    await this.categoryRepository.deleteCategory(categoryId);
    return true;
  }
}
