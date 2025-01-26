import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptor/response-interceptor';
import { Category } from '../../types/Category.type';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import {
  createCategorySchemaResponse,
  ResponseCreateCategoryResponse,
} from './dto/response-create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/categories')
  async listCategories(): Promise<Category[]> {
    return await this.categoryService.listCategory();
  }

  @Post('/categories')
  @UseInterceptors(new ResponseInterceptor(createCategorySchemaResponse))
  async createCategory(
    @Body() categoryData: CreateCategoryDto,
  ): Promise<ResponseCreateCategoryResponse> {
    const categoryCreated =
      await this.categoryService.createCategory(categoryData);

    return {
      name: categoryCreated.name,
      icon: categoryCreated.icon,
      _id: categoryCreated.id,
    };
  }

  @Delete('/:categoryId')
  async deleteCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<boolean> {
    return await this.categoryService.deleteCategory(categoryId);
  }
}
