import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

class verifyIngredientsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Nome é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

class manyIngredientsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Nome é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

class createIngredientDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Nome é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsOptional()
  @IsMongoId()
  _id?: string;
}

class getAllIngredientsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Nome é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsOptional()
  @IsMongoId()
  _id?: string;
}

export class OutPutCreateManyIngredientsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => manyIngredientsDto)
  data: manyIngredientsDto[];
}

export class OutPutCreateIngredientDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @Type(() => createIngredientDto)
  @IsOptional()
  data?: createIngredientDto;
}

export class OutPutGetAllIngredientsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => getAllIngredientsDto)
  data: getAllIngredientsDto[];
}

export class OutPutVerifyIngredientsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => verifyIngredientsDto)
  data: verifyIngredientsDto[];
}
