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
import { ResponseInterceptorArray } from '@shared/interceptor/response-interceptor-array';
import { ResponseInterceptorNew } from '@shared/interceptor/response-interceptor-new';
import { Roles } from '../authentication/decorators/role.decorator';
import { UserGuard } from '../authentication/guard/userAuth.guard';
import { Role } from '../authentication/roles/role.enum';
import { CategoryService } from './category.service';
import { CreateCategoryDto, EditCategoryDto } from './dto/Input.dto';
import {
  OutPutCreateCategoryDto,
  OutPutListCategoryDto,
  OutPutMessageDto,
} from './dto/OutPut.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/categories/:orgId')
  @UseGuards(UserGuard)
  @UseInterceptors(
    new ResponseInterceptorArray(OutPutListCategoryDto, 'categories'),
  )
  async listCategories(
    @Param('orgId') orgId: string,
  ): Promise<OutPutListCategoryDto> {
    const categories = await this.categoryService.listCategory(orgId);

    return {
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
  @UseInterceptors(new ResponseInterceptorNew(OutPutCreateCategoryDto))
  async createCategory(
    @Body() categoryData: CreateCategoryDto,
  ): Promise<OutPutCreateCategoryDto> {
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
  @UseInterceptors(new ResponseInterceptorNew(OutPutMessageDto))
  async editCategory(
    @Param('id') id: string,
    @Body() editData: EditCategoryDto,
  ): Promise<OutPutMessageDto> {
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
  @UseInterceptors(new ResponseInterceptorNew(OutPutMessageDto))
  async deleteCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<OutPutMessageDto> {
    await this.categoryService.deleteCategory(categoryId);
    return {
      message: 'Categoria deletada com sucesso !',
    };
  }
}
