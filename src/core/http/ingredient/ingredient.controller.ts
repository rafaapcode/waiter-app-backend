import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
