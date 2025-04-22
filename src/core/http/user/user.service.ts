import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/infra/repository/user/user.service';
import { UserType } from 'src/types/User.type';
import { validateSchema } from 'src/utils/validateSchema';
import { verifyPassword } from 'src/utils/verifyPassword';
import { LoginUserDTO, loginUserSchema } from './dto/LoginUser.dto';
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
  }: LoginUserDTO): Promise<{ access_token: string }> {
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

    return { access_token: token };
  }

  async signUpUser({
    email,
    password,
    name,
  }: CreateUserDTO): Promise<Omit<UserType, 'password'>> {
    const isValidPayload = validateSchema(createUserSchema, {
      email,
      password,
      name,
    });

    if (!isValidPayload.success) {
      throw new BadRequestException(isValidPayload.error.errors);
    }

    const newUser = await this.userRepo.createUser({ email, password, name });

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

  async getAllUsers(): Promise<Omit<UserType, 'password'>[]> {
    const users = await this.userRepo.getAllUser();
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
}
