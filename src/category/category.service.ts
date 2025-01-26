import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from 'src/repository/category/category.service';
import { Category } from 'src/types/Category.type';
import { validateSchema } from 'src/utils/validateSchema';
import {
  CreateCategoryDto,
  createCategorySchema,
} from './dto/CreateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    try {
      // Validate Data
      const validateData = validateSchema(createCategorySchema, data);
      if (!validateData.success) {
        throw new BadRequestException(validateData.error.errors);
      }

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
      const categories = await this.categoryRepository.listCategory();
      return categories;
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
      const categorydeleted =
        await this.categoryRepository.deleteCategory(categoryId);
      if (!categorydeleted) {
        throw new NotFoundException('Categoria não existe');
      }
      return true;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
