import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { IngredientType } from 'src/types/Ingredient.type';
import { CreateIngredientDTO } from './dto/createIngredient.dto';
import { IngredientService } from './ingredient.service';

@Controller('ingredient')
export class IngredientController {
  constructor(private ingredientsService: IngredientService) {}

  @Get()
  async getAll(): Promise<{ data: IngredientType[] }> {
    return await this.ingredientsService.getAllIngredients();
  }

  @Post()
  async createIngredient(
    @Body() data: CreateIngredientDTO,
  ): Promise<{ message: string; data?: IngredientType }> {
    return await this.ingredientsService.createIngredient(data);
  }

  @Post('find')
  @HttpCode(HttpStatus.OK)
  async findIngredients(
    @Body() data: string[],
  ): Promise<{ data: { id: string; name: string }[] }> {
    return await this.ingredientsService.getIngredients(data);
  }

  @Post('create-many')
  @HttpCode(HttpStatus.CREATED)
  async createManyIngredients(
    @Body() data: CreateIngredientDTO[],
  ): Promise<{ status: boolean }> {
    const response = await this.ingredientsService.createManyIngredients(data);

    if (!response.status) {
      throw new BadRequestException('Erro ao criar os ingredientes');
    }

    return response;
  }
}
