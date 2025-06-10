import {
  CreateIngredientDto,
  CreateManyIngredientDto,
} from '@core/http/ingredient/dto/Input.dto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Ingredient, IngredientType } from '@shared/types/Ingredient.type';
import { Model } from 'mongoose';
import { CONSTANTS } from '../../../constants';

@Injectable()
export class IngredientRepository {
  constructor(
    @Inject(CONSTANTS.INGREDIENTS_PROVIDER)
    private ingredientModel: Model<Ingredient>,
  ) {}

  async createIngredient(dataIngredient: CreateIngredientDto): Promise<{
    message: string;
    data?: IngredientType;
  }> {
    const ingredientAlreadyExists = await this.ingredientModel.findOne({
      name: dataIngredient.name,
    });

    if (ingredientAlreadyExists) {
      throw new BadRequestException('Ingrediente já existe');
    }

    const ingredient = await this.ingredientModel.create(dataIngredient);

    return {
      message: 'Ingredient criado com sucesso !',
      data: {
        _id: ingredient.id,
        name: ingredient.name,
        icon: ingredient.icon,
      },
    };
  }

  async getAllIngredients(): Promise<{ data: IngredientType[] }> {
    const allIngredients = await this.ingredientModel.find();

    return {
      data: allIngredients.map((data) => ({
        _id: data.id,
        name: data.name,
        icon: data.icon,
      })),
    };
  }

  async verfifyIngredients(
    ingredients: string[],
  ): Promise<{ data: { id: string; name: string }[] }> {
    const allIngredients = await this.ingredientModel.find({
      name: { $in: ingredients },
    });

    return {
      data: allIngredients.map((ing) => ({
        id: ing.id,
        name: ing.name,
      })),
    };
  }

  async createMany(
    ingredients: CreateManyIngredientDto,
  ): Promise<{ data: { name: string; id: string }[] }> {
    try {
      const ingredientsAdded =
        await this.ingredientModel.insertMany(ingredients);
      return {
        data: ingredientsAdded.map((ing) => ({ id: ing.id, name: ing.name })),
      };
    } catch (error: any) {
      console.log(error.message);
      return { data: [] };
    }
  }
}
