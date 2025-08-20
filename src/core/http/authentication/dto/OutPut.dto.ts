import { UserRoles } from '@shared/types/User.type';
import {
  IsEmail,
  IsEnum,
  IsJWT,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class OutputUserDto {
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  access_token: string;

  @IsString()
  @IsNotEmpty()
  @IsJWT()
  refresh_token: string;

  @IsNotEmpty()
  @IsEnum(UserRoles)
  role: UserRoles;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

export class OutPutRefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  refresh_token: string;

  @IsString()
  @IsNotEmpty()
  @IsJWT()
  access_token: string;
}
