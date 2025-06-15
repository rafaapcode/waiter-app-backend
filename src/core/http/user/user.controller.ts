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
import { UserEntity } from './entity/user.entity';
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
    const userEntity = UserEntity.newUser(userPayload);
    const response = await this.userService.create(userEntity);
    return response.httpCreateResponse();
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

    const userEntitie = UserEntity.toUpdateCurrentUser(userPayload);
    const { user: userCreated, token } =
      await this.userService.updateCurrentUser(user.email, userEntitie);

    return userCreated.httpUpdateCurrentUserResponse(token);
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

    const userEntitie = UserEntity.toUpdateUser(userPayload);
    const user = await this.userService.updateUser(id, userEntitie);

    return user.httpUpdateUserResponse();
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
    const users = await this.userService.getAllUsers(user.id, page);
    return UserEntity.httpGetAllUsersResponse(users.total_pages, users.users);
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

    const foundUser = await this.userService.getUserByEmail(user.email);

    return foundUser.httpGetCurrentUserResponse();
  }

  @Get(':id')
  @UseGuards(UserGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(new ResponseInterceptor(OutPutGetUserDto))
  async getUser(@Param('id') id: string): Promise<OutPutGetUserDto> {
    if (!id) {
      throw new BadRequestException('ID do usuário é obrigatório');
    }

    const user = await this.userService.getUser(id);
    return user.httpGetUserResponse();
  }
}
