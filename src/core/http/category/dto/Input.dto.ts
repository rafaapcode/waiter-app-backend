import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Nome deve ter ao menos 2 caracteres' })
  name: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  org: string;
}

export class EditCategoryDto extends PartialType(CreateCategoryDto) {}
