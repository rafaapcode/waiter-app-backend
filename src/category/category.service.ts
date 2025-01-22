import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CategoryRepository } from 'src/repository/category/category.service';
import { Category } from 'src/types/Category.type';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(name: string, icon: string): Promise<Category> {
    try {
      // TODO: Validação dos dados recebidos
      // TODO: Verificar se a categoria já não existe
      const category = await this.categoryRepository.createCategory(icon, name);
      if (!category) {
        throw new InternalServerErrorException('Erro ao criar nova categoria');
      }
      return category;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async listCategory(): Promise<Category[]> {
    try {
      const categories = await this.categoryRepository.listCategory();
      return categories;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
