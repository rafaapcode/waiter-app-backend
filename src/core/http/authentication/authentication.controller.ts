import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/shared/interceptor/response-interceptor';
import { AuthenticationService } from './authentication.service';
import { LoginUserDTO } from './dto/LoginUser.dto';
import {
  loginUserSchemaRes,
  ResponseLoginUserDTO,
} from './dto/response-login-user';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new ResponseInterceptor(loginUserSchemaRes))
  async login(
    @Body() userPayload: LoginUserDTO,
  ): Promise<ResponseLoginUserDTO> {
    const data = await this.authenticationService.signInUser(userPayload);

    return data;
  }
}
