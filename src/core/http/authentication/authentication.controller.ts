import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IsPublic } from '@shared/decorators/isPublic';
import { ResponseInterceptor } from '@shared/interceptor/response-interceptor';
import { AuthenticationService } from './authentication.service';
import { RefreshTokenDto, SignInUserDto } from './dto/Input.dto';
import { OutPutRefreshTokenDto, OutputUserDto } from './dto/OutPut.dto';

@IsPublic()
@Throttle({ default: { limit: 5, ttl: 15 * 60 * 1000 } })
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

  @Post('refresh_token')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new ResponseInterceptor(OutPutRefreshTokenDto))
  async refreshToken(
    @Body() refreshtoken: RefreshTokenDto,
  ): Promise<OutPutRefreshTokenDto> {
    const data = await this.authenticationService.refreshToken(refreshtoken);

    return data;
  }
}
