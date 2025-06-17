import { UserRoles } from '@shared/types/User.type';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsJWT,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class OutPutMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}

class userDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(UserRoles)
  @IsOptional()
  role?: UserRoles;

  @IsString()
  @IsOptional()
  @IsMongoId()
  id?: string;
}

export class OutPutCreateUserDto extends userDto {}
export class OutPutGetUserDto extends userDto {}
export class OutPutGetAllUsersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => userDto)
  users: userDto[];

  @IsNumber()
  total_pages: number;
}

export class OutPutGetCurrentUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @IsMongoId()
  id?: string;
}

export class OutPutUpdateCurrentUserDto extends userDto {
  @IsString()
  @IsOptional()
  @IsJWT()
  access_token?: string;
}

export class OutPutUpdateUserDto extends userDto {}
