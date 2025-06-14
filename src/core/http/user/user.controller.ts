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
import { ResponseInterceptor } from '@shared/interceptor/response-interceptor';
import { JwtPayload } from '@shared/types/express';
import { CurrentUser } from '../authentication/decorators/getCurrentUser.decorator';
import { Roles } from '../authentication/decorators/role.decorator';
import { UserGuard } from '../authentication/guard/userAuth.guard';
import { Role } from '../authentication/roles/role.enum';
import {
  CreateUserDto,
  UpdateCurrentUserDto,
  UpdateUserDto,
} from './dto/Input.dto';
import {
  OutPutCreateUserDto,
  OutPutGetAllUsersDto,
  OutPutGetCurrentUserDto,
  OutPutGetUserDto,
  OutPutMessageDto,
  OutPutUpdateCurrentUserDto,
  OutPutUpdateUserDto,
} from './dto/OutPut.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutCreateUserDto))
  async createUser(
    @Body() userPayload: CreateUserDto,
  ): Promise<OutPutCreateUserDto> {
    return await this.userService.create(userPayload);
  }

  @Put('current')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutUpdateCurrentUserDto))
  async updateCurrentUser(
    @CurrentUser() user: JwtPayload,
    @Body() userPayload: UpdateCurrentUserDto,
  ): Promise<OutPutUpdateCurrentUserDto> {
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
  @UseInterceptors(new ResponseInterceptor(OutPutUpdateUserDto))
  async updateUser(
    @Param('id') id: string,
    @Body() userPayload: UpdateUserDto,
  ): Promise<OutPutUpdateUserDto> {
    if (!id) {
      throw new BadRequestException('ID do usuário é obrigatório');
    }

    return await this.userService.updateUser(id, userPayload);
  }

  @Delete(':id')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutMessageDto))
  async deleteUser(@Param('id') id: string): Promise<OutPutMessageDto> {
    if (!id) {
      throw new BadRequestException('ID do usuário é obrigatório');
    }

    return await this.userService.deleteUser(id);
  }

  @Get('all/:page')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutGetAllUsersDto))
  async getAllUser(
    @CurrentUser() user: JwtPayload,
    @Param('page', ParseIntPipe) page: number,
  ): Promise<OutPutGetAllUsersDto> {
    return await this.userService.getAllUsers(user.id, page);
  }

  @Get('current')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutGetCurrentUserDto))
  async getCurrentUser(
    @CurrentUser() user: JwtPayload,
  ): Promise<OutPutGetCurrentUserDto> {
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
  @UseInterceptors(new ResponseInterceptor(OutPutGetUserDto))
  async getUser(@Param('id') id: string): Promise<OutPutGetUserDto> {
    if (!id) {
      throw new BadRequestException('ID do usuário é obrigatório');
    }
    return await this.userService.getUser(id);
  }
}
