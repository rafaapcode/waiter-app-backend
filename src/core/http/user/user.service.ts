import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/infra/repository/user/user.service';
import { UserType } from 'src/shared/types/User.type';
import { verifyPassword } from 'src/shared/utils/verifyPassword';
import { AuthenticationService } from '../authentication/authentication.service';
import { CreateUserDto, UpdateUserDto } from './dto/Input.dto';
import {
  UpdateCurrentUserDTO,
  updateCurrentUserSchema,
} from './dto/UpdateCurrentUser.dto';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private authService: AuthenticationService,
  ) {}

  async create({
    email,
    password,
    name,
    role,
  }: CreateUserDto): Promise<Omit<UserType, 'password'>> {
    const newUser = await this.userRepo.createUser({
      email,
      password,
      name,
      role,
    });

    return newUser;
  }

  async updateUser(
    id: string,
    data: UpdateUserDto,
  ): Promise<Omit<UserType, 'password'>> {
    const newUser = await this.userRepo.updateUser(id, data);

    return newUser;
  }

  async updateCurrentUser(
    email: string,
    data: UpdateCurrentUserDTO,
  ): Promise<{ access_token?: string } & Omit<UserType, 'password'>> {
    const isValidPayload = updateCurrentUserSchema.safeParse({
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.new_password && { new_password: data.new_password }),
      ...(data.confirm_password && { confirm_password: data.confirm_password }),
    });

    if (!isValidPayload.success) {
      throw new BadRequestException(
        isValidPayload.error.errors.map((e) => e.message).join('\n'),
      );
    }

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
      return { ...newUser, access_token: token };
    }

    return newUser;
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('Id do usuário é obrigatório');
    }

    await this.userRepo.deleteUser(id);

    return { message: 'Usuário deletado com sucesso !' };
  }

  async getUser(id: string): Promise<Omit<UserType, 'password'>> {
    if (!id) {
      throw new BadRequestException('ID do usuário é obrigatório');
    }

    return await this.userRepo.getUser(id);
  }

  async getUserByEmail(
    email: string,
  ): Promise<{ name: string; email: string }> {
    if (!email) {
      throw new BadRequestException('Email do usuário é obrigatório');
    }

    return await this.userRepo.getUserByEmail(email);
  }

  async getAllUsers(
    userId: string,
    page: number,
  ): Promise<{ total_pages: number; users: Omit<UserType, 'password'>[] }> {
    const users = await this.userRepo.getAllUser(userId, page);
    return users;
  }
}
