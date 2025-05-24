import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtPayload } from 'src/types/express';
import { CurrentUser } from '../authentication/decorators/getCurrentUser.decorator';
import { Roles } from '../authentication/decorators/role.decorator';
import { UserGuard } from '../authentication/guard/userAuth.guard';
import { Role } from '../authentication/roles/role.enum';
import { LoginUserDTO } from './dto/LoginUser.dto';
import { UpdateCurrentUserDTO } from './dto/UpdateCurrentUser.dto';
import { UpdateUserDTO } from './dto/UpdateUser.dto';
import { CreateUserDTO } from './dto/User.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() userPayload: LoginUserDTO) {
    const data = await this.userService.signInUser(userPayload);

    return data;
  }

  @Post('')
  async signUpUser(@Body() userPayload: CreateUserDTO) {
    return await this.userService.signUpUser(userPayload);
  }

  @Put('current')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  async updateCurrentUser(
    @CurrentUser() user: JwtPayload,
    @Body() userPayload: UpdateCurrentUserDTO,
  ) {
    if (!user) {
      throw new InternalServerErrorException('User not found in request');
    }

    return await this.userService.updateCurrentUser(user.email, userPayload);
  }

  @Put(':id')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  async updateUser(
    @Param('id') id: string,
    @Body() userPayload: UpdateUserDTO,
  ) {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    return await this.userService.updateUser(id, userPayload);
  }

  @Delete(':id')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  async deleteUser(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    return await this.userService.deleteUser(id);
  }

  @Get('all/:page')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  async getAllUser(@Param('page', ParseIntPipe) page: number) {
    return await this.userService.getAllUsers(page);
  }

  @Get('current')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  async getCurrentUser(
    @CurrentUser() user: JwtPayload,
  ): Promise<{ name: string; email: string }> {
    if (!user) {
      throw new InternalServerErrorException('User not found in the request');
    }
    return await this.userService.getUserByEmail(user.email);
  }

  @Get(':id')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  async getUser(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    return await this.userService.getUser(id);
  }
}
