import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

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

export class EditCategoryDto {
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Nome deve ter ao menos 2 caracteres' })
  name?: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
