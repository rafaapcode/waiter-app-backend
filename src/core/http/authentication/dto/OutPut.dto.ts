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

  @IsNotEmpty()
  @IsEnum(UserRoles)
  role: UserRoles;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
