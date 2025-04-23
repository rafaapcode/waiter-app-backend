import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptor/response-interceptor';
import { Roles } from '../authentication/decorators/role.decorator';
import { UserGuard } from '../authentication/guard/userAuth.guard';
import { Role } from '../authentication/roles/role.enum';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import {
  createCategorySchemaResponse,
  ResponseCreateCategoryResponse,
} from './dto/response-create-category.dto';
import {
  deleteCategorySchemaResponse,
  ResponseDeleteCategoryResponse,
} from './dto/response-delete-category.dto';
import {
  listCategorySchemaResponse,
  ResponseListCategoryResponse,
} from './dto/response-list-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/categories')
  @UseGuards(UserGuard)
  @UseInterceptors(new ResponseInterceptor(listCategorySchemaResponse))
  async listCategories(): Promise<ResponseListCategoryResponse> {
    const listOfCategories = await this.categoryService.listCategory();
    return listOfCategories.map((cat) => ({
      _id: cat.id,
      name: cat.name,
      icon: cat.icon,
    }));
  }

  @Post('/categories')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
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
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(deleteCategorySchemaResponse))
  async deleteCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<ResponseDeleteCategoryResponse> {
    await this.categoryService.deleteCategory(categoryId);
    return {
      message: 'Categoria deletada com sucesso !',
    };
  }
}
