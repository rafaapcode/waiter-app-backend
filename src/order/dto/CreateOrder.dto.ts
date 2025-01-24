import { Type } from 'class-transformer';
import { IsInt, IsString, ValidateNested } from 'class-validator';
import { Schema } from 'mongoose';
import { ProductsOrder } from './../../types/Order.type';

class ProductsOrderType {
  @IsString({ message: 'PRODUCT deve conter um ID válido' })
  product: Schema.Types.ObjectId;

  @IsInt({ message: 'Quantidade deve ser um número' })
  quantity: number;
}

export class CreateOrderDTO {
  @IsString({ message: 'Mesa é obrigatório' })
  table: string;

  @ValidateNested({ each: true, message: 'Deve ser um array de produtos' })
  @Type(() => ProductsOrderType)
  products: ProductsOrder[];
}
