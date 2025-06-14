import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MinLength,
  validateSync,
} from 'class-validator';

class Env {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  REFRESH_JWT_SECRET: string;

  @IsNumberString()
  @IsNotEmpty()
  PORT: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URI: string;
}

export const env = plainToInstance(Env, {
  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET,
  PORT: process.env.PORT,
  DATABASE_URI: process.env.DATABASE_URI,
});

const errors = validateSync(env);

if (errors.length > 0) {
  throw new Error(JSON.stringify(errors, null, 2));
}
