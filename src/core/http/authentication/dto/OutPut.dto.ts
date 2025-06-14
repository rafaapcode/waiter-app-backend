import { UserRoles } from '@shared/types/User.type';
import {
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
