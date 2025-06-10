import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/shared/interceptor/response-interceptor';
import { JwtPayload } from 'src/shared/types/express';
import { CurrentUser } from '../authentication/decorators/getCurrentUser.decorator';
import { Roles } from '../authentication/decorators/role.decorator';
import { UserGuard } from '../authentication/guard/userAuth.guard';
import { Role } from '../authentication/roles/role.enum';
import { CreateUserDto, UpdateUserDto } from './dto/Input.dto';
import { ResponseCreateUserDTO } from './dto/response-create-user';
import {
  deleteUserSchemaRes,
  ResponseDeleteUserDTO,
} from './dto/response-delete-user';
import { getUserSchemaRes, ResponseGetUserDTO } from './dto/response-get-user';
import {
  getAllUsersSchemaRes,
  ResponseGetAllUsersDTO,
} from './dto/response-getall-users';
import {
  getCurrentUserSchemaRes,
  ResponseGetCurrentUserDTO,
} from './dto/response-getcurrent-user';
import {
  ResponseUpdateCurrentUserDTO,
  updateCurrentUserSchemaRes,
} from './dto/response-update-current-user';
import {
  ResponseUpdateUserDTO,
  updateUserSchemaRes,
} from './dto/response-update-user';
import { UpdateCurrentUserDTO } from './dto/UpdateCurrentUser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  async createUser(
    @Body() userPayload: CreateUserDto,
  ): Promise<ResponseCreateUserDTO> {
    return await this.userService.create(userPayload);
  }

  @Put('current')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(updateCurrentUserSchemaRes))
  async updateCurrentUser(
    @CurrentUser() user: JwtPayload,
    @Body() userPayload: UpdateCurrentUserDTO,
  ): Promise<ResponseUpdateCurrentUserDTO> {
    if (!user) {
      throw new InternalServerErrorException(
        'Usuário não encontrado na requisição',
      );
    }

    return await this.userService.updateCurrentUser(user.email, userPayload);
  }

  @Put(':id')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(updateUserSchemaRes))
  async updateUser(
    @Param('id') id: string,
    @Body() userPayload: UpdateUserDto,
  ): Promise<ResponseUpdateUserDTO> {
    if (!id) {
      throw new BadRequestException('ID do usuário é obrigatório');
    }

    return await this.userService.updateUser(id, userPayload);
  }

  @Delete(':id')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(deleteUserSchemaRes))
  async deleteUser(@Param('id') id: string): Promise<ResponseDeleteUserDTO> {
    if (!id) {
      throw new BadRequestException('ID do usuário é obrigatório');
    }

    return await this.userService.deleteUser(id);
  }

  @Get('all/:page')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(getAllUsersSchemaRes))
  async getAllUser(
    @CurrentUser() user: JwtPayload,
    @Param('page', ParseIntPipe) page: number,
  ): Promise<ResponseGetAllUsersDTO> {
    return await this.userService.getAllUsers(user.id, page);
  }

  @Get('current')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(getCurrentUserSchemaRes))
  async getCurrentUser(
    @CurrentUser() user: JwtPayload,
  ): Promise<ResponseGetCurrentUserDTO> {
    if (!user) {
      throw new InternalServerErrorException(
        'Usuário não encontrado na requisição',
      );
    }
    return await this.userService.getUserByEmail(user.email);
  }

  @Get(':id')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(getUserSchemaRes))
  async getUser(@Param('id') id: string): Promise<ResponseGetUserDTO> {
    if (!id) {
      throw new BadRequestException('ID do usuário é obrigatório');
    }

    return await this.userService.getUser(id);
  }
}
