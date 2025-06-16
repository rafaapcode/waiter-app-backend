import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '@shared/decorators/getCurrentUser.decorator';
import { Roles } from '@shared/decorators/role.decorator';
import { ResponseInterceptor } from '@shared/interceptor/response-interceptor';
import { ResponseInterceptorArray } from '@shared/interceptor/response-interceptor-array';
import { JwtPayload } from '@shared/types/express';
import { Role } from '../authentication/roles/role.enum';
import { CategoryService } from './category.service';
import { CreateCategoryDto, EditCategoryDto } from './dto/Input.dto';
import {
  OutPutCreateCategoryDto,
  OutPutListCategoryDto,
  OutPutMessageDto,
} from './dto/OutPut.dto';
import { CategoryEntity } from './entity/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/categories/:orgId')
  @UseInterceptors(
    new ResponseInterceptorArray(OutPutListCategoryDto, 'categories'),
  )
  async listCategories(
    @CurrentUser() user: JwtPayload,
    @Param('orgId') orgId: string,
  ): Promise<OutPutListCategoryDto> {
    const categories = await this.categoryService.listCategory(user.id, orgId);

    return {
      categories: CategoryEntity.httpListResponse(categories),
    };
  }

  @Post('/categories')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutCreateCategoryDto))
  async createCategory(
    @Body() categoryData: CreateCategoryDto,
  ): Promise<OutPutCreateCategoryDto> {
    const category = CategoryEntity.newCategory(categoryData);
    const categoryCreated = await this.categoryService.createCategory(category);

    return categoryCreated.httpCreateResponse();
  }

  @Put('/categories/:id')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async editCategory(
    @Param('id') id: string,
    @Body() editData: EditCategoryDto,
  ): Promise<OutPutMessageDto> {
    const category = CategoryEntity.toUpdate(editData);
    const categoryEdited = await this.categoryService.editCategory(
      id,
      category,
    );

    return {
      message: categoryEdited
        ? 'Categoria editada com sucesso !'
        : 'Não foi possível editar a categoria',
    };
  }

  @Delete('/:categoryId/:orgId')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async deleteCategory(
    @CurrentUser() user: JwtPayload,
    @Param() params: { categoryId: string; orgId: string },
  ): Promise<OutPutMessageDto> {
    const { categoryId, orgId } = params;
    await this.categoryService.deleteCategory(user.id, orgId, categoryId);
    return {
      message: 'Categoria deletada com sucesso !',
    };
  }
}
