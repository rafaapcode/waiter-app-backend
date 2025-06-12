import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'Nome é obrigatório e deve ter ao menos 3 caracteres',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, {
    message: 'Descrição é obrigatório e deve ter ao menos 10 caracteres',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
    },
    { message: 'URL inválida' },
  )
  imageUrl: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsArray()
  @IsMongoId({ each: true })
  ingredients: string[];

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  category: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  org: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  priceInDiscount: number;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  discount: boolean;
}
