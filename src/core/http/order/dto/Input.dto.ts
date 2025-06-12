import { STATUS } from '@shared/types/Order.type';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class OrderDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  product: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Nome da mesa deve ter ao menos 1 caractere' })
  table: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  org: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDto)
  products: OrderDto[];
}

export class ChangeOrderDto {
  @IsEnum(STATUS)
  @IsNotEmpty()
  status: STATUS;
}
