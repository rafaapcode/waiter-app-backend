import { Body, Controller, Get, Post } from '@nestjs/common';
import { Category } from 'src/types/Category.type';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/categories')
  async listCategories(): Promise<Category[]> {
    return await this.categoryService.listCategory();
  }

  @Post('/categories')
  async createCategory(
    @Body() categoryData: { name: string; icon: string },
  ): Promise<Category> {
    return await this.categoryService.createCategory(
      categoryData.name,
      categoryData.icon,
    );
  }
}
