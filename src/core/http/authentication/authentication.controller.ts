import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptorNew } from '@shared/interceptor/response-interceptor-new';
import { AuthenticationService } from './authentication.service';
import { SignInUserDto } from './dto/Input.dto';
import { OutputUserDto } from './dto/OutPut.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new ResponseInterceptorNew(OutputUserDto))
  async login(@Body() signInUser: SignInUserDto): Promise<OutputUserDto> {
    const data = await this.authenticationService.signInUser(signInUser);

    return {
      role: data.role,
      id: '1313133131313',
      access_token: '131313131313',
    };
  }
}
