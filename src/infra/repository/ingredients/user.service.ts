import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateIngredientDTO } from 'src/core/http/ingredient/dto/createIngredient.dto';
import { Ingredient, IngredientType } from 'src/types/Ingredient.type';
import { CONSTANTS } from '../../../constants';

@Injectable()
export class IngredientRepository {
  constructor(
    @Inject(CONSTANTS.INGREDIENTS_PROVIDER)
    private ingredientModel: Model<Ingredient>,
  ) {}

  async createIngredient(dataIngredient: CreateIngredientDTO): Promise<{
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
    ingredients: CreateIngredientDTO[],
  ): Promise<{ status: boolean }> {
    try {
      await this.ingredientModel.insertMany(ingredients);

      return { status: true };
    } catch (error: any) {
      console.log(error.message);
      return { status: false };
    }
  }
}
