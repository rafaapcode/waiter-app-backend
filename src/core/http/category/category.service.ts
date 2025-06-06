import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from 'src/infra/repository/product/product.service';
import { CategoryRepository } from '../../../infra/repository/category/category.service';
import { Category } from '../../../types/Category.type';
import { validateSchema } from '../../../utils/validateSchema';
import {
  CreateCategoryDto,
  createCategorySchema,
} from './dto/CreateCategory.dto';
import { EditCategoryDto } from './dto/EditCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    try {
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

      if (categories.length === 0) {
        throw new HttpException(null, 204);
      }

      return categories;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof HttpException) {
        throw new HttpException(error.getResponse(), error.getStatus());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async editCategory(id: string, data: EditCategoryDto): Promise<boolean> {
    try {
      const categories = await this.categoryRepository.editCategory(id, data);

      return categories;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof HttpException) {
        throw new HttpException(error.getResponse(), error.getStatus());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const categoryIsBeingUsed =
        await this.productRepository.categoryIsBeingUsed(categoryId);

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
