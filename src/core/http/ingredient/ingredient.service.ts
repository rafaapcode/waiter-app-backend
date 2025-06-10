import { Injectable } from '@nestjs/common';
import { IngredientRepository } from 'src/infra/repository/ingredients/user.service';
import { IngredientType } from 'src/shared/types/Ingredient.type';
import { CreateIngredientDto, CreateManyIngredientDto } from './dto/Input.dto';

@Injectable()
export class IngredientService {
  constructor(private readonly ingredientRepository: IngredientRepository) {}

  async createIngredient(
    data: CreateIngredientDto,
  ): Promise<{ message: string; data?: IngredientType }> {
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

  async createManyIngredients({
    ingredients,
  }: CreateManyIngredientDto): Promise<{
    data: { name: string; id: string }[];
  }> {
    return await this.ingredientRepository.createMany(ingredients);
  }
}
