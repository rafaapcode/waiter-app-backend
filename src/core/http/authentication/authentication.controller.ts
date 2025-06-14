import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from '@shared/interceptor/response-interceptor';
import { AuthenticationService } from './authentication.service';
import { SignInUserDto } from './dto/Input.dto';
import { OutputUserDto } from './dto/OutPut.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new ResponseInterceptor(OutputUserDto))
  async login(@Body() signInUser: SignInUserDto): Promise<OutputUserDto> {
    const data = await this.authenticationService.signInUser(signInUser);

    return data;
  }
}
