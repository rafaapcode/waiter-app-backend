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
import { UserType } from 'src/types/User.type';
import { validateSchema } from 'src/utils/validateSchema';
import { verifyPassword } from 'src/utils/verifyPassword';
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

  async signInUser({
    email,
    password,
  }: LoginUserDTO): Promise<{ access_token: string; role: string }> {
    const isValidPayload = validateSchema(loginUserSchema, { email, password });

    if (!isValidPayload.success) {
      throw new BadRequestException(isValidPayload.error.errors);
    }

    const user = await this.userRepo.userExists(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new NotFoundException('Invalid password');
    }

    const token = this.generateToken(user.email, user.role);

    return { access_token: token, role: user.role };
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
    id: string,
    data: UpdateCurrentUserDTO,
  ): Promise<Omit<UserType, 'password'>> {
    const isValidPayload = updateCurrentUserSchema.safeParse(data);

    if (!isValidPayload.success) {
      throw new BadRequestException(
        isValidPayload.error.errors.map((e) => e.message).join(' , '),
      );
    }

    const newUser = await this.userRepo.updateUser(id, data);

    return newUser;
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    await this.userRepo.deleteUser(id);

    return { message: 'User deleted successfully' };
  }

  async getUser(id: string): Promise<Omit<UserType, 'password'>> {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    return await this.userRepo.getUser(id);
  }

  async getUserByEmail(
    email: string,
  ): Promise<{ name: string; email: string }> {
    if (!email) {
      throw new BadRequestException('User Email is required');
    }

    return await this.userRepo.getUserByEmail(email);
  }

  async getAllUsers(
    page: number,
  ): Promise<{ total_pages: number; users: Omit<UserType, 'password'>[] }> {
    const users = await this.userRepo.getAllUser(page);
    return users;
  }

  private generateToken(email: string, role: string): string {
    try {
      return this.jwtService.sign(
        { email, role },
        {
          expiresIn: '1d',
          secret: this.configService.getOrThrow('JWT_SECRET'),
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  verifyToken(token: string): { email: string; role: Role } {
    try {
      const isTokenValid = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
      });
      if (!isTokenValid) {
        return null;
      }
      return isTokenValid as { email: string; role: Role };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
