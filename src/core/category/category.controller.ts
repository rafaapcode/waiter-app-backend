import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Category } from '../../types/Category.type';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/CreateCategory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/categories')
  async listCategories(): Promise<Category[]> {
    return await this.categoryService.listCategory();
  }

  @Post('/categories')
  async createCategory(
    @Body() categoryData: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.createCategory(categoryData);
  }

  @Delete('/:categoryId')
  async deleteCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<boolean> {
    return await this.categoryService.deleteCategory(categoryId);
  }
}
