import { PartialType } from '@nestjs/mapped-types';
import { UserRoles } from '@shared/types/User.type';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Email inválido' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  password: string;

  @IsEnum(UserRoles)
  @IsNotEmpty()
  role: UserRoles;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateCurrentUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Email inválido' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @IsOptional()
  current_password?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @IsOptional()
  new_password?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @IsOptional()
  confirm_password?: string;
}
