import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Roles } from '../authentication/decorators/role.decorator';
import { UserGuard } from '../authentication/guard/userAuth.guard';
import { Role } from '../authentication/roles/role.enum';
import { LoginUserDTO } from './dto/LoginUser.dto';
import { UpdateUserDTO } from './dto/UpdateUser.dto';
import { CreateUserDTO } from './dto/User.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('auth')
  @UseGuards(UserGuard)
  async isAuthenticate() {
    return { ok: true };
  }

  @Post('login')
  async login(
    @Body() userPayload: LoginUserDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const access_token = await this.userService.signInUser(userPayload);

    response.cookie('token', access_token.access_token, { signed: true });

    return response
      .status(200)
      .json({ message: 'Usuário logado com sucesso !' });
  }

  @Post('')
  async signUpUser(@Body() userPayload: CreateUserDTO) {
    return await this.userService.signUpUser(userPayload);
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

  @Get('all')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  async getAllUser() {
    return await this.userService.getAllUsers();
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
