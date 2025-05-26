import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptor/response-interceptor';
import { CreateIngredientDTO } from './dto/createIngredient.dto';
import {
  createManyIngredientSchemaResponse,
  ResponseCreateManyIngredients,
} from './dto/response-create-many-ingredients';
import {
  createIngredientSchemaResponse,
  ResponseCreateIngredient,
} from './dto/response-created-ingredients';
import {
  getAllIngredientsSchemaResponse,
  ResponseGetAllIngredients,
} from './dto/response-get-all-ingredients';
import {
  ResponseVerifyIngredients,
  verifyIngredientSchemaResponse,
} from './dto/response-verify-ingredients';
import { IngredientService } from './ingredient.service';

@Controller('ingredient')
export class IngredientController {
  constructor(private ingredientsService: IngredientService) {}

  @Get()
  @UseInterceptors(new ResponseInterceptor(getAllIngredientsSchemaResponse))
  async getAll(): Promise<ResponseGetAllIngredients> {
    return await this.ingredientsService.getAllIngredients();
  }

  @Post()
  @UseInterceptors(new ResponseInterceptor(createIngredientSchemaResponse))
  async createIngredient(
    @Body() data: CreateIngredientDTO,
  ): Promise<ResponseCreateIngredient> {
    return await this.ingredientsService.createIngredient(data);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new ResponseInterceptor(verifyIngredientSchemaResponse))
  async verifyIngredients(
    @Body() data: { ingredients: string[] },
  ): Promise<ResponseVerifyIngredients> {
    return await this.ingredientsService.verifyIngredients(data.ingredients);
  }

  @Post('create-many')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(new ResponseInterceptor(createManyIngredientSchemaResponse))
  async createManyIngredients(
    @Body() data: CreateIngredientDTO[],
  ): Promise<ResponseCreateManyIngredients> {
    const response = await this.ingredientsService.createManyIngredients(data);

    if (response.data.length === 0) {
      throw new BadRequestException('Erro ao criar os ingredientes');
    }

    return response;
  }
}
