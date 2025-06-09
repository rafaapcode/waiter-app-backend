import {
  IsArray,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateOrgDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @IsOptional()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: 'A descrição da organização deve ter no minimo 4 caracteres',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: 'O horário de abertura deve ter no mínimo 4 caracteres',
  })
  @MaxLength(6, {
    message: 'O horário de abertura deve ter no máximo 6 caracteres',
  })
  openHour: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: 'O horário de fechamento deve ter no mínimo 4 caracteres',
  })
  @MaxLength(6, {
    message: 'O horário de fechamento deve ter no máximo 6 caracteres',
  })
  closeHour: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'O CEP deve ter no mínimo 8 caracteres',
  })
  @MaxLength(9, {
    message: 'O CEP deve ter no máximo 9 caracteres',
  })
  cep: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'A cidade deve ter no mínimo 3 caracteres',
  })
  city: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'O bairro deve ter no mínimo 3 caracteres',
  })
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'O rua deve ter no mínimo 3 caracteres',
  })
  street: string;

  @IsArray()
  @IsNotEmpty()
  location: number[];

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  user: string;
}
