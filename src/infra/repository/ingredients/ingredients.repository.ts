import {
  CreateIngredientDto,
  CreateManyIngredientDto,
} from '@core/http/ingredient/dto/Input.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Ingredient, IngredientType } from '@shared/types/Ingredient.type';
import { Model } from 'mongoose';
import { CONSTANTS } from '../../../constants';

@Injectable()
export class IngredientRepository {
  constructor(
    @Inject(CONSTANTS.INGREDIENTS_PROVIDER)
    private ingredientModel: Model<Ingredient>,
  ) {}

  async createIngredient(
    dataIngredient: CreateIngredientDto,
  ): Promise<{ data: IngredientType }> {
    const ingredient = await this.ingredientModel.create(dataIngredient);

    return {
      data: {
        id: ingredient.id,
        name: ingredient.name,
        icon: ingredient.icon,
      },
    };
  }

  async getAllIngredients(): Promise<{ data: IngredientType[] }> {
    const allIngredients = await this.ingredientModel.find();

    if (!allIngredients) {
      throw new NotFoundException('Nenhum ingrediente encontrado');
    }

    return {
      data: allIngredients.map((data) => ({
        id: data.id,
        name: data.name,
        icon: data.icon,
      })),
    };
  }

  async verfifyIngredients(
    ingredients: string[],
  ): Promise<{ data: Pick<IngredientType, 'id' | 'name'>[] }> {
    const allIngredients = await this.ingredientModel.find({
      name: { $in: ingredients },
    });

    if (!allIngredients) {
      throw new NotFoundException('Nenhum ingrediente encontrado');
    }

    return {
      data: allIngredients.map((ing) => ({
        id: ing.id,
        name: ing.name,
      })),
    };
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

  async createMany({ ingredients }: CreateManyIngredientDto): Promise<{
    data: Pick<IngredientType, 'id' | 'name'>[];
  }> {
    const ingredientsAdded = await this.ingredientModel.insertMany(ingredients);
    return {
      data: ingredientsAdded.map((ing) => ({ id: ing.id, name: ing.name })),
    };
  }
}
