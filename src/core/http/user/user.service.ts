import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/infra/repository/user/user.service';
import { Envs } from 'src/shared/config/env';
import { UserType } from 'src/shared/types/User.type';
import { validateSchema } from 'src/shared/utils/validateSchema';
import { verifyPassword } from 'src/shared/utils/verifyPassword';
import { Role } from '../authentication/roles/role.enum';
import { LoginUserDTO, loginUserSchema } from './dto/LoginUser.dto';
import {
  UpdateCurrentUserDTO,
  updateCurrentUserSchema,
} from './dto/UpdateCurrentUser.dto';
import { UpdateUserDTO, updateUserSchema } from './dto/UpdateUser.dto';
import { CreateUserDTO, createUserSchema } from './dto/User.dto';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signInUser({ email, password }: LoginUserDTO): Promise<{
    access_token: string;
    role: string;
    id: string;
  }> {
    const isValidPayload = validateSchema(loginUserSchema, { email, password });

    if (!isValidPayload.success) {
      throw new BadRequestException(isValidPayload.error.errors);
    }

    const user = await this.userRepo.userExists(email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new NotFoundException('Senha inválida');
    }

    const token = await this.generateToken(user._id, user.email, user.role);

    return { access_token: token, role: user.role, id: user._id };
  }

  async signUpUser({
    email,
    password,
    name,
    role,
  }: CreateUserDTO): Promise<Omit<UserType, 'password'>> {
    const isValidPayload = validateSchema(createUserSchema, {
      email,
      password,
      name,
      role,
    });

    if (!isValidPayload.success) {
      throw new BadRequestException(isValidPayload.error.errors);
    }

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
    data: UpdateUserDTO,
  ): Promise<Omit<UserType, 'password'>> {
    const isValidPayload = validateSchema(updateUserSchema, data);

    if (!isValidPayload.success) {
      throw new BadRequestException(isValidPayload.error.errors);
    }

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
      const token = await this.generateToken(
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
    page: number,
  ): Promise<{ total_pages: number; users: Omit<UserType, 'password'>[] }> {
    const users = await this.userRepo.getAllUser(page);
    return users;
  }

  private async generateToken(
    id: string,
    email: string,
    role: string,
  ): Promise<string> {
    try {
      return await this.jwtService.signAsync(
        { id, email, role },
        {
          expiresIn: '1d',
          secret: this.configService.getOrThrow(Envs.JWT_SECRET),
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async verifyToken(
    token: string,
  ): Promise<{ id: string; email: string; role: Role }> {
    try {
      const isTokenValid = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow(Envs.JWT_SECRET),
      });
      if (!isTokenValid) {
        return null;
      }
      return isTokenValid as { id: string; email: string; role: Role };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
