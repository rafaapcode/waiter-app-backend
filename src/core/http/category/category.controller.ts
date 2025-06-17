import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '@shared/decorators/getCurrentUser.decorator';
import { Roles } from '@shared/decorators/role.decorator';
import { ResponseInterceptor } from '@shared/interceptor/response-interceptor';
import { ResponseInterceptorArray } from '@shared/interceptor/response-interceptor-array';
import { JwtPayload } from '@shared/types/express';
import { Role } from '../authentication/roles/role.enum';
import { CreateCategoryDto, EditCategoryDto } from './dto/Input.dto';
import {
  OutPutCreateCategoryDto,
  OutPutListCategoryDto,
  OutPutMessageDto,
} from './dto/OutPut.dto';
import { CategoryEntity } from './entity/category.entity';
import { CategoryService } from './services/category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/categories/:orgId')
  @UseInterceptors(
    new ResponseInterceptorArray(OutPutListCategoryDto, 'categories'),
  )
  async listCategories(
    @Param('orgId') orgId: string,
  ): Promise<OutPutListCategoryDto> {
    const categories = await this.categoryService.listCategory(orgId);

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

  @Patch('/categories/:orgId/:categoryId')
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async updateCategory(
    @CurrentUser() user: JwtPayload,
    @Param() params: { categoryId: string; orgId: string },
    @Body() editData: EditCategoryDto,
  ): Promise<OutPutMessageDto> {
    const { categoryId, orgId } = params;
    const category = CategoryEntity.toUpdate(editData);
    const categoryEdited = await this.categoryService.updateCategory(
      user.id,
      orgId,
      categoryId,
      category,
    );

    return {
      message: categoryEdited
        ? 'Categoria editada com sucesso !'
        : 'Não foi possível editar a categoria',
    };
  }

  @Delete('/:orgId/:categoryId')
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
