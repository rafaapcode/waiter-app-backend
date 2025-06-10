import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from '@shared/interceptor/response-interceptor';
import { Roles } from '../authentication/decorators/role.decorator';
import { UserGuard } from '../authentication/guard/userAuth.guard';
import { Role } from '../authentication/roles/role.enum';
import { CategoryService } from './category.service';
import { CreateCategoryDto, EditCategoryDto } from './dto/Input.dto';
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

  @Get('/categories')
  @UseGuards(UserGuard)
  @UseInterceptors(new ResponseInterceptor(listCategorySchemaResponse))
  async listCategories(): Promise<ResponseListCategoryResponse> {
    const categories = await this.categoryService.listCategory();

    return categories.map((cat) => ({
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
