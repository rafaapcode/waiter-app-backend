import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateNested,
} from 'class-validator';

export class OutPutMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}

class location {
  @IsString()
  @Length(5)
  @IsOptional()
  type?: string;

  @IsArray({ message: 'coordinates deve ser um array' })
  @IsNumber(
    {},
    { each: true, message: 'coordinates deve conter apenas números' },
  )
  @ArrayMaxSize(2, { message: 'coordinates deve ter exatamente 2 elementos' })
  @IsOptional()
  coordinates?: [number, number];
}

class orgDto {
  @IsString({ message: '_id deve ser uma string' })
  @IsOptional()
  @IsMongoId()
  _id?: string;

  @IsString({ message: 'name deve ser uma string' })
  @IsNotEmpty({ message: 'name é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'email deve ser um email válido' })
  @IsNotEmpty({ message: 'email é obrigatório' })
  email: string;

  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
    },
    { message: 'imageUrl deve ser uma URL válida' },
  )
  @IsNotEmpty({ message: 'imageUrl é obrigatório' })
  imageUrl: string;

  @IsString({ message: 'description deve ser uma string' })
  @IsNotEmpty({ message: 'description é obrigatório' })
  description: string;

  @IsString({ message: 'openHour deve ser uma string' })
  @IsNotEmpty({ message: 'openHour é obrigatório' })
  openHour: string;

  @IsString({ message: 'closeHour deve ser uma string' })
  @IsNotEmpty({ message: 'closeHour é obrigatório' })
  closeHour: string;

  @IsString({ message: 'cep deve ser uma string' })
  @IsNotEmpty({ message: 'cep é obrigatório' })
  cep: string;

  @IsString({ message: 'city deve ser uma string' })
  @IsNotEmpty({ message: 'city é obrigatório' })
  city: string;

  @IsString({ message: 'neighborhood deve ser uma string' })
  @IsNotEmpty({ message: 'neighborhood é obrigatório' })
  neighborhood: string;

  @ValidateNested()
  @Type(() => location)
  location: location;

  @IsString({ message: 'street deve ser uma string' })
  @IsNotEmpty({ message: 'street é obrigatório' })
  street: string;

  @IsString({ message: '_id deve ser uma string' })
  @IsMongoId()
  user: string;
}

export class OutPutCreateOrgDto extends orgDto {}
export class OutPutUpdateOrgDto extends PartialType(orgDto) {}
export class OutPutGetOrgDto extends orgDto {}

export class OutPutListOrgsOfUser {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => orgDto)
  orgs: orgDto[];
}
