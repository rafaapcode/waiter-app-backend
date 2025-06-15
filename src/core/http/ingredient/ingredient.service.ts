import { IngredientRepository } from '@infra/repository/ingredients/ingredients.repository';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateManyIngredientDto } from './dto/Input.dto';
import { IngredientEntity } from './entity/ingredient.entity';

@Injectable()
export class IngredientService {
  constructor(private readonly ingredientRepository: IngredientRepository) {}

  async createIngredient(data: IngredientEntity): Promise<IngredientEntity> {
    const ingredientExist = await this.ingredientRepository.ingredientExist(
      data.name,
    );

    if (ingredientExist) {
      throw new ConflictException('Ingrediente já existed');
    }

    return await this.ingredientRepository.createIngredient(data);
  }

  async getAllIngredients(): Promise<IngredientEntity[]> {
    return await this.ingredientRepository.getAllIngredients();
  }

  async verifyIngredients(ingredients: string[]): Promise<IngredientEntity[]> {
    const ings =
      await this.ingredientRepository.verfifyIngredients(ingredients);
    if (ings.length === 0) {
      throw new NotFoundException('Ingredientes não existem');
    }
    return ings;
  }

  async createManyIngredients(
    ingredients: CreateManyIngredientDto,
  ): Promise<IngredientEntity[]> {
    const ingredientsThatAlreadyExists =
      await this.ingredientRepository.verfifyIngredients(
        ingredients.ingredients.map((ing) => ing.name),
      );

    if (
      ingredientsThatAlreadyExists.length === ingredients.ingredients.length
    ) {
      throw new ConflictException('Todos os ingredientes já existem');
    }

    const ingredientsAlreadyExists = new Set(
      ingredientsThatAlreadyExists.map((ing) => ing.name),
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
