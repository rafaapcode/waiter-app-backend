import { UserRepository } from '@infra/repository/user/user.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyPassword } from '@shared/utils/verifyPassword';
import { AuthenticationService } from '../authentication/authentication.service';
import { UpdateCurrentUserDto, UpdateUserDto } from './dto/Input.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private authService: AuthenticationService,
  ) {}

  async create(user: UserEntity): Promise<UserEntity> {
    const newUser = await this.userRepo.createUser(user);

    return newUser;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<UserEntity> {
    const newUser = await this.userRepo.updateUser(id, data);

    return newUser;
  }

  async updateCurrentUser(
    email: string,
    data: UpdateCurrentUserDto,
  ): Promise<{ user: UserEntity; token?: string }> {
    if (data.new_password) {
      if (!data.current_password) {
        throw new BadRequestException(
          'Senha atual é obrigatório para a mudança da senha',
        );
      }

      const user = await this.userRepo.userExists(email);

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const isValidPassword = await verifyPassword(
        data.current_password,
        user.password,
      );

      if (!isValidPassword) {
        throw new UnauthorizedException('Senha atual inválida');
      }
    }

    const newUser = await this.userRepo.updateCurrentUser(email, {
      name: data.name,
      email: data.email,
      new_password: data.new_password,
    });

    if (data.email) {
      const token = await this.authService.generateToken(
        newUser._id,
        newUser.email,
        newUser.role,
      );
      return { user: newUser, token: token };
    }

    return { user: newUser };
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('Id do usuário é obrigatório');
    }

    await this.userRepo.deleteUser(id);

    return { message: 'Usuário deletado com sucesso !' };
  }

  async getUser(id: string): Promise<UserEntity> {
    if (!id) {
      throw new BadRequestException('ID do usuário é obrigatório');
    }

    return await this.userRepo.getUser(id);
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    if (!email) {
      throw new BadRequestException('Email do usuário é obrigatório');
    }

    return await this.userRepo.getUserByEmail(email);
  }

  async getAllUsers(
    userId: string,
    page: number,
  ): Promise<{ total_pages: number; users: UserEntity[] }> {
    const users = await this.userRepo.getAllUser(userId, page);
    return users;
  }
}
