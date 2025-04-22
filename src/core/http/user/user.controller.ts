import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { LoginUserDTO } from './dto/LoginUser.dto';
import { UpdateUserDTO } from './dto/UpdateUser.dto';
import { CreateUserDTO } from './dto/User.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  async login(@Body() userPayload: LoginUserDTO) {
    return await this.userService.signInUser(userPayload);
  }

  @Post('')
  async signUpUser(@Body() userPayload: CreateUserDTO) {
    return await this.userService.signUpUser(userPayload);
  }

  @Put(':id')
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
  async deleteUser(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    return await this.userService.deleteUser(id);
  }

  @Get('all')
  async getAllUser() {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    return await this.userService.getUser(id);
  }
}
