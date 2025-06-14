import { IngredientRepository } from '@infra/repository/ingredients/ingredients.repository';
import { ConflictException, Injectable } from '@nestjs/common';
import { IngredientType } from '@shared/types/Ingredient.type';
import { CreateIngredientDto, CreateManyIngredientDto } from './dto/Input.dto';

@Injectable()
export class IngredientService {
  constructor(private readonly ingredientRepository: IngredientRepository) {}

  async createIngredient(
    data: CreateIngredientDto,
  ): Promise<{ data: IngredientType }> {
    const ingredientExist = await this.ingredientRepository.ingredientExist(
      data.name,
    );

    if (ingredientExist) {
      throw new ConflictException('Ingrediente já existed');
    }

    return await this.ingredientRepository.createIngredient(data);
  }

  async getAllIngredients(): Promise<{ data: IngredientType[] }> {
    return await this.ingredientRepository.getAllIngredients();
  }

  async verifyIngredients(
    ingredients: string[],
  ): Promise<{ data: Pick<IngredientType, 'id' | 'name'>[] }> {
    return await this.ingredientRepository.verfifyIngredients(ingredients);
  }

  async createManyIngredients(ingredients: CreateManyIngredientDto): Promise<{
    data: Pick<IngredientType, 'id' | 'name'>[];
  }> {
    const ingredientsThatAlreadyExists =
      await this.ingredientRepository.verfifyIngredients(
        ingredients.ingredients.map((ing) => ing.name),
      );

    if (
      ingredientsThatAlreadyExists.data.length ===
      ingredients.ingredients.length
    ) {
      throw new ConflictException('Todos os ingredientes já existem');
    }

    const ingredientsAlreadyExists = new Set(
      ingredientsThatAlreadyExists.data.map((ing) => ing.name),
    );
    const ingredientsToBeAdd = new Set(
      ingredients.ingredients.map((ing) => ing.name),
    );

    const ingredientsToAdd = Array.from(
      ingredientsToBeAdd.difference(ingredientsAlreadyExists),
    );

    if (ingredientsToAdd.length === 0) {
      throw new ConflictException('Todos os ingredientes já existem');
    }

    return await this.ingredientRepository.createMany({
      ingredients: ingredients.ingredients.filter((ing) =>
        ingredientsToAdd.includes(ing.name),
      ),
    });
  }
}
