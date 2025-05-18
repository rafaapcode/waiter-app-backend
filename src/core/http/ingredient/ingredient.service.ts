import { BadRequestException, Injectable } from '@nestjs/common';
import { IngredientRepository } from 'src/infra/repository/ingredients/user.service';
import { IngredientType } from 'src/types/Ingredient.type';
import { validateSchema } from 'src/utils/validateSchema';
import {
  CreateIngredientDTO,
  createIngredientSchema,
} from './dto/createIngredient.dto';
import { createManyIngredientSchema } from './dto/createManyIngredients.dto';

@Injectable()
export class IngredientService {
  constructor(private readonly ingredientRepository: IngredientRepository) {}

  async createIngredient(
    data: CreateIngredientDTO,
  ): Promise<{ message: string; data?: IngredientType }> {
    const isValidSchema = validateSchema(createIngredientSchema, data);

    if (!isValidSchema.success) {
      const errorMessages = isValidSchema.error.errors.map(
        (msgs) => msgs.message,
      );
      throw new BadRequestException(errorMessages.join(' , '));
    }

    return await this.ingredientRepository.createIngredient(data);
  }

  async getAllIngredients(): Promise<{ data: IngredientType[] }> {
    return await this.ingredientRepository.getAllIngredients();
  }

  async verifyIngredients(
    ingredients: string[],
  ): Promise<{ data: { id: string; name: string }[] }> {
    return await this.ingredientRepository.verfifyIngredients(ingredients);
  }

  async createManyIngredients(
    ingredients: CreateIngredientDTO[],
  ): Promise<{ status: boolean }> {
    const verifyIngredientsData =
      createManyIngredientSchema.safeParse(ingredients);

    if (!verifyIngredientsData.success) {
      throw new BadRequestException('Ingredients incorretos');
    }

    return await this.ingredientRepository.createMany(ingredients);
  }
}
