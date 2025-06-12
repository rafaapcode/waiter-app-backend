import { Type } from 'class-transformer';
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
  ValidateNested,
} from 'class-validator';

export class OutPutMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}

class ingredientsDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  icon: string;
}

class categoryDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  icon: string;
}

export class OutPutCreateProductDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @IsString({ message: 'Nome é obrigatório' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(3, {
    message: 'Nome é obrigatório e deve ter ao menos 3 caracteres',
  })
  name: string;

  @IsString({ message: 'Descrição é obrigatório' })
  @IsNotEmpty({ message: 'Descrição é obrigatório' })
  @MinLength(10, {
    message: 'Descrição é obrigatório e deve ter ao menos 10 caracteres',
  })
  description: string;

  @IsString({ message: 'ImageUrl é obrigatório' })
  @IsNotEmpty({ message: 'ImageUrl é obrigatório' })
  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
    },
    { message: 'URL inválida' },
  )
  imageUrl: string;

  @IsNumber({}, { message: 'Preço é obrigatório' })
  @IsNotEmpty({ message: 'Preço é obrigatório' })
  price: number;

  @IsArray({ message: 'ingredients deve ser um array' })
  @IsMongoId({ each: true })
  ingredients: string[];

  @IsString()
  @IsNotEmpty({ message: 'category é obrigatório' })
  @IsMongoId()
  category: string;

  @IsBoolean({ message: 'discount deve ser um boolean' })
  discount: boolean;

  @IsNumber({}, { message: 'priceInDiscount deve ser um número' })
  @IsOptional()
  priceInDiscount?: number;
}

export class OutPutGetProductDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @IsString({ message: 'Nome é obrigatório' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(3, {
    message: 'Nome é obrigatório e deve ter ao menos 3 caracteres',
  })
  name: string;

  @IsString({ message: 'Descrição é obrigatório' })
  @IsNotEmpty({ message: 'Descrição é obrigatório' })
  @MinLength(10, {
    message: 'Descrição é obrigatório e deve ter ao menos 10 caracteres',
  })
  description: string;

  @IsString({ message: 'ImageUrl é obrigatório' })
  @IsNotEmpty({ message: 'ImageUrl é obrigatório' })
  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
    },
    { message: 'URL inválida' },
  )
  imageUrl: string;

  @IsNumber({}, { message: 'Preço é obrigatório' })
  @IsNotEmpty({ message: 'Preço é obrigatório' })
  price: number;

  @IsArray({ message: 'ingredients deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => ingredientsDto)
  ingredients: ingredientsDto[];

  @IsNotEmpty({ message: 'category é obrigatório' })
  @Type(() => categoryDto)
  category: categoryDto;

  @IsBoolean({ message: 'discount deve ser um boolean' })
  discount: boolean;

  @IsNumber({}, { message: 'priceInDiscount deve ser um número' })
  @IsOptional()
  priceInDiscount?: number;
}

class listProductDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @IsString({ message: 'Nome é obrigatório' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(3, {
    message: 'Nome é obrigatório e deve ter ao menos 3 caracteres',
  })
  name: string;

  @IsString({ message: 'Descrição é obrigatório' })
  @IsNotEmpty({ message: 'Descrição é obrigatório' })
  @MinLength(10, {
    message: 'Descrição é obrigatório e deve ter ao menos 10 caracteres',
  })
  description: string;

  @IsString({ message: 'ImageUrl é obrigatório' })
  @IsNotEmpty({ message: 'ImageUrl é obrigatório' })
  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
    },
    { message: 'URL inválida' },
  )
  imageUrl: string;

  @IsNumber({}, { message: 'Preço é obrigatório' })
  @IsNotEmpty({ message: 'Preço é obrigatório' })
  price: number;

  @IsArray({ message: 'ingredients deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => ingredientsDto)
  ingredients: ingredientsDto[];

  @IsNotEmpty({ message: 'category é obrigatório' })
  @Type(() => categoryDto)
  category: categoryDto;

  @IsBoolean({ message: 'discount deve ser um boolean' })
  discount: boolean;

  @IsNumber({}, { message: 'priceInDiscount deve ser um número' })
  @IsOptional()
  priceInDiscount?: number;
}

class listProductByCategorieDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @IsString({ message: 'Nome é obrigatório' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(3, {
    message: 'Nome é obrigatório e deve ter ao menos 3 caracteres',
  })
  name: string;

  @IsString({ message: 'Descrição é obrigatório' })
  @IsNotEmpty({ message: 'Descrição é obrigatório' })
  @MinLength(10, {
    message: 'Descrição é obrigatório e deve ter ao menos 10 caracteres',
  })
  description: string;

  @IsString({ message: 'ImageUrl é obrigatório' })
  @IsNotEmpty({ message: 'ImageUrl é obrigatório' })
  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
    },
    { message: 'URL inválida' },
  )
  imageUrl: string;

  @IsNumber({}, { message: 'Preço é obrigatório' })
  @IsNotEmpty({ message: 'Preço é obrigatório' })
  price: number;

  @IsArray({ message: 'ingredients deve ser um array' })
  @IsMongoId({ each: true })
  ingredients: string[];

  @IsNotEmpty({ message: 'category é obrigatório' })
  @IsMongoId()
  category: string;

  @IsBoolean({ message: 'discount deve ser um boolean' })
  discount: boolean;

  @IsNumber({}, { message: 'priceInDiscount deve ser um número' })
  @IsOptional()
  priceInDiscount?: number;
}

class listDiscountProductDto extends listProductByCategorieDto {}

export class OutPutListProductDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => listProductDto)
  products: listProductDto[];
}

export class OutPutListProductByCategorieDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => listProductByCategorieDto)
  products: listProductByCategorieDto[];
}

export class OutPutDiscountProductDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => listDiscountProductDto)
  products: listDiscountProductDto[];
}
