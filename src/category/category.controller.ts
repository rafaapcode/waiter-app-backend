import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import { Category } from 'src/types/Category.type';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  createCategorySchema,
} from './dto/CreateCategory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/categories')
  async listCategories(): Promise<Category[]> {
    return await this.categoryService.listCategory();
  }

  @Post('/categories')
  @UsePipes(new ZodValidationPipe(createCategorySchema))
  async createCategory(
    @Body() categoryData: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.createCategory(categoryData);
  }
}
