import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CategoryRepository } from 'src/repository/category/category.service';
import { Category } from 'src/types/Category.type';
import { CreateCategoryDto } from './dto/CreateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    try {
      const categoryExist = await this.categoryRepository.findCategoryByName(
        data.name,
      );

      if (categoryExist) {
        throw new BadRequestException('Categoria já existe');
      }

      const category = await this.categoryRepository.createCategory(data);
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
