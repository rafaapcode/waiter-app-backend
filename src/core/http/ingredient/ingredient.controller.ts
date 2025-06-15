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
import { ResponseInterceptor } from '@shared/interceptor/response-interceptor';
import { CreateIngredientDto, CreateManyIngredientDto } from './dto/Input.dto';
import {
  OutPutCreateIngredientDto,
  OutPutCreateManyIngredientsDto,
  OutPutGetAllIngredientsDto,
  OutPutVerifyIngredientsDto,
} from './dto/OutPut.dto';
import { IngredientEntity } from './entity/ingredient.entity';
import { IngredientService } from './ingredient.service';

@Controller('ingredient')
export class IngredientController {
  constructor(private ingredientsService: IngredientService) {}

  @Get()
  @UseInterceptors(new ResponseInterceptor(OutPutGetAllIngredientsDto))
  async getAll(): Promise<OutPutGetAllIngredientsDto> {
    const ingredients = await this.ingredientsService.getAllIngredients();
    return {
      data: IngredientEntity.httpGetAllResponse(ingredients),
    };
  }

  @Post()
  @UseInterceptors(new ResponseInterceptor(OutPutCreateIngredientDto))
  async createIngredient(
    @Body() data: CreateIngredientDto,
  ): Promise<OutPutCreateIngredientDto> {
    const newIngredient = IngredientEntity.newIngredient(data);

    const ingredient =
      await this.ingredientsService.createIngredient(newIngredient);

    return {
      data: ingredient.httpCreateResponse(),
    };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new ResponseInterceptor(OutPutVerifyIngredientsDto))
  async verifyIngredients(
    @Body() data: { ingredients: string[] },
  ): Promise<OutPutVerifyIngredientsDto> {
    const ings = await this.ingredientsService.verifyIngredients(
      data.ingredients,
    );
    return {
      data: IngredientEntity.httpVerifyResponse(ings),
    };
  }

  @Post('create-many')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(new ResponseInterceptor(OutPutCreateManyIngredientsDto))
  async createManyIngredients(
    @Body() data: CreateManyIngredientDto,
  ): Promise<OutPutCreateManyIngredientsDto> {
    const response = await this.ingredientsService.createManyIngredients(data);

    if (response.length === 0) {
      throw new BadRequestException('Erro ao criar os ingredientes');
    }

    return {
      data: IngredientEntity.httpCreateManyResponse(response),
    };
  }
}
