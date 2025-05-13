import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptor/response-interceptor';
import { Roles } from '../authentication/decorators/role.decorator';
import { UserGuard } from '../authentication/guard/userAuth.guard';
import { Role } from '../authentication/roles/role.enum';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import { EditCategoryDto } from './dto/EditCategory.dto';
import {
  createCategorySchemaResponse,
  ResponseCreateCategoryResponse,
} from './dto/response-create-category.dto';
import {
  deleteCategorySchemaResponse,
  ResponseDeleteCategoryResponse,
} from './dto/response-delete-category.dto';
import {
  editCategorySchemaResponse,
  ResponseEditCategoryResponse,
} from './dto/response-edite-category.dto';
import {
  listCategorySchemaResponse,
  ResponseListCategoryResponse,
} from './dto/response-list-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/categories/:page')
  @UseGuards(UserGuard)
  @UseInterceptors(new ResponseInterceptor(listCategorySchemaResponse))
  async listCategories(
    @Param('page', ParseIntPipe) page: number,
  ): Promise<ResponseListCategoryResponse> {
    const { total_pages, categories } =
      await this.categoryService.listCategory(page);
    return {
      total_pages,
      categories: categories.map((cat) => ({
        _id: cat.id,
        name: cat.name,
        icon: cat.icon,
      })),
    };
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

  @Put('/categories/:id')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(editCategorySchemaResponse))
  async editCategory(
    @Param('id') id: string,
    @Body() editData: EditCategoryDto,
  ): Promise<ResponseEditCategoryResponse> {
    const categoryEdited = await this.categoryService.editCategory(
      id,
      editData,
    );

    return {
      message: categoryEdited
        ? 'Categoria editada com sucesso !'
        : 'Não foi possível editar a categoria',
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
