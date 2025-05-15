import { BadRequestException, Injectable } from '@nestjs/common';
import { IngredientRepository } from 'src/infra/repository/ingredients/user.service';
import { IngredientType } from 'src/types/Ingredient.type';
import { validateSchema } from 'src/utils/validateSchema';
import {
  CreateIngredientDTO,
  createIngredientSchema,
} from './dto/createIngredient.dto';

@Injectable()
export class IngredientService {
  constructor(private readonly ingredientRepository: IngredientRepository) {}

  async createIngredient(
    data: CreateIngredientDTO,
  ): Promise<{ message: string; data?: IngredientType }> {
    const isValidSchema = validateSchema(createIngredientSchema, data);

    if (!isValidSchema.success) {
      throw new BadRequestException(isValidSchema.error.errors);
    }

    return await this.ingredientRepository.createIngredient(data);
  }

  async getAllIngredients(): Promise<{ data: IngredientType[] }> {
    return await this.ingredientRepository.getAllIngredients();
  }
}
