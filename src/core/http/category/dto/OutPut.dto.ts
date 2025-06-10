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

export class OutPutMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}

class listCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Nome é obrigatório' })
  name: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  _id: string;
}

export class OutPutListCategoryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => listCategoryDto)
  categories: listCategoryDto[];
}

export class OutPutCreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Nome é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  icon: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  _id: string;
}
