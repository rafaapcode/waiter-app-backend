import { CreateManyIngredientDto } from '@core/http/ingredient/dto/Input.dto';
import { IngredientEntity } from '@core/http/ingredient/entity/ingredient.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Ingredient } from '@shared/types/Ingredient.type';
import { Model } from 'mongoose';
import { CONSTANTS } from '../../../constants';

@Injectable()
export class IngredientRepository {
  constructor(
    @Inject(CONSTANTS.INGREDIENTS_PROVIDER)
    private ingredientModel: Model<Ingredient>,
  ) {}

  async createIngredient(
    dataIngredient: IngredientEntity,
  ): Promise<IngredientEntity> {
    const ingredient = await this.ingredientModel.create(
      dataIngredient.toCreate(),
    );

    return IngredientEntity.toEntity({
      icon: ingredient.icon,
      id: ingredient.id,
      name: ingredient.name,
    });
  }

  async getAllIngredients(): Promise<IngredientEntity[]> {
    const allIngredients = await this.ingredientModel.find();

    if (!allIngredients) {
      throw new NotFoundException('Nenhum ingrediente encontrado');
    }

    return allIngredients.map(
      (data) => new IngredientEntity(data.name, data.icon, data.id),
    );
  }

  async verfifyIngredients(ingredients: string[]): Promise<IngredientEntity[]> {
    const allIngredients = await this.ingredientModel.find({
      _id: { $in: ingredients },
    });

    if (!allIngredients) {
      throw new NotFoundException('Nenhum ingrediente encontrado');
    }

    return allIngredients.map(
      (ing) => new IngredientEntity(ing.name, ing.icon, ing.id),
    );
  }

  async ingredientExist(ingredientName: string): Promise<boolean> {
    const ingredients = await this.ingredientModel.findOne({
      name: ingredientName,
    });

    if (!ingredients) {
      return false;
    }

    return true;
  }

  async createMany({
    ingredients,
  }: CreateManyIngredientDto): Promise<IngredientEntity[]> {
    const ingredientsAdded = await this.ingredientModel.insertMany(ingredients);
    return ingredientsAdded.map(
      (ing) => new IngredientEntity(ing.name, ing.icon, ing.id),
    );
  }
}
