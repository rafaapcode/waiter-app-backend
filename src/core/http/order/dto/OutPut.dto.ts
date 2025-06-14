import { STATUS } from '@shared/types/Order.type';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';

export class OutPutMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}

class itemDto {
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'imageUrl deve ser uma URL válida' },
  )
  @IsNotEmpty({ message: 'imageUrl é obrigatório' })
  imageUrl: string;

  @IsNumber({}, { message: 'quantity deve ser um número' })
  @Min(1, { message: 'quantity deve ser maior que 0' })
  quantity: number;

  @IsString({ message: 'name deve ser uma string' })
  @IsNotEmpty({ message: 'name é obrigatório' })
  name: string;

  @IsNumber({}, { message: 'price deve ser um número' })
  @Min(0, { message: 'price deve ser maior ou igual a 0' })
  price: number;

  @IsBoolean({ message: 'discount deve ser um boolean' })
  discount: boolean;

  @IsString({ message: 'id deve ser uma string' })
  @IsNotEmpty({ message: 'id é obrigatório' })
  @IsMongoId()
  id: string;
}

class historyOrderResponse {
  @IsString({ message: 'id deve ser uma string' })
  @IsNotEmpty({ message: 'id é obrigatório' })
  @IsMongoId()
  id: string;

  @IsString({ message: 'table deve ser uma string' })
  @IsNotEmpty({ message: 'table é obrigatório' })
  table: string;

  @IsDate({ message: 'data deve ser uma data válida' })
  @Type(() => Date)
  data: Date;

  @IsString({ message: 'name deve ser uma string' })
  @IsNotEmpty({ message: 'name é obrigatório' })
  name: string;

  @IsString({ message: 'category deve ser uma string' })
  @IsNotEmpty({ message: 'category é obrigatório' })
  category: string;

  @IsString({ message: 'totalPrice deve ser uma string' })
  @IsNotEmpty({ message: 'totalPrice é obrigatório' })
  totalPrice: string;

  @IsArray({ message: 'itens deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => itemDto)
  itens: itemDto[];
}

export class OutPutHistoryOrderDto {
  @IsNumber()
  @IsPositive()
  total_pages: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => historyOrderResponse)
  history: historyOrderResponse[];
}

export class OutPutCreateOrdersDto {
  @IsString({ message: '_id deve ser uma string' })
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @IsString()
  @IsNotEmpty()
  table: string;

  @IsNotEmpty()
  @IsEnum(STATUS)
  status: STATUS;

  @IsArray()
  products: any[];
}

class listOrdersDto {
  @IsString({ message: '_id deve ser uma string' })
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @IsString({ message: 'table deve ser uma string' })
  @IsNotEmpty({ message: 'table é obrigatório' })
  table: string;

  @IsEnum(STATUS)
  status: STATUS;

  @IsArray({ message: 'products deve ser um array' })
  products: any[];

  @IsDate({ message: 'createdAt deve ser uma data válida' })
  @Type(() => Date)
  createdAt: Date;
}

export class OutPutListOrdersDto {
  @Type(() => listOrdersDto)
  orders: listOrdersDto[];
}
