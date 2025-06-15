import { IngredientType } from '@shared/types/Ingredient.type';
import { CreateIngredientDto } from '../dto/Input.dto';
import {
  OutPutCreateIngredientDto,
  OutPutCreateManyIngredientsDto,
  OutPutGetAllIngredientsDto,
  OutPutVerifyIngredientsDto,
} from '../dto/OutPut.dto';

export class IngredientEntity {
  constructor(
    public readonly name: string,
    public readonly icon: string,
    public readonly _id?: string,
  ) {}

  static newIngredient(data: CreateIngredientDto): IngredientEntity {
    return new IngredientEntity(data.name, data.icon);
  }

  static toEntity(data: IngredientType): IngredientEntity {
    return new IngredientEntity(data.name, data.icon, data.id);
  }

  toCreate(): CreateIngredientDto {
    return {
      name: this.name,
      icon: this.icon,
    };
  }

  httpCreateResponse(): OutPutCreateIngredientDto['data'] {
    return {
      icon: this.icon,
      name: this.name,
      _id: this._id,
    };
  }

  static httpGetAllResponse(
    ingredients: IngredientEntity[],
  ): OutPutGetAllIngredientsDto['data'] {
    return ingredients.map((data) => ({
      id: data._id,
      name: data.name,
      icon: data.icon,
    }));
  }

  static httpVerifyResponse(
    ingredients: IngredientEntity[],
  ): OutPutVerifyIngredientsDto['data'] {
    return ingredients.map((data) => ({
      id: data._id,
      name: data.name,
    }));
  }

  static httpCreateManyResponse(
    ingredients: IngredientEntity[],
  ): OutPutCreateManyIngredientsDto['data'] {
    return ingredients.map((data) => ({
      id: data._id,
      name: data.name,
    }));
  }
}
