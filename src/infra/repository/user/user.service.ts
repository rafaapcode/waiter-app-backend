import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { AdminUser, AdminUserType } from 'src/types/Adm.type';
import { CONSTANTS } from '../../../constants';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(CONSTANTS.USER_PROVIDER)
    private userModel: Model<AdminUser>,
  ) {}

  async createUser(
    user: AdminUserType,
  ): Promise<Omit<AdminUserType, 'password'>> {
    try {
      const userExists = await this.userModel.findOne({ email: user.email });
      if (userExists) {
        throw new BadRequestException('User already exists');
      }
      const newUser = await this.userModel.create(user);
      return {
        _id: newUser._id as string,
        name: newUser.name,
        email: newUser.email,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateUser(
    userId: string,
    user: Partial<AdminUserType>,
  ): Promise<Omit<AdminUserType, 'password'>> {
    try {
      const newuser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          ...user,
        },
        { new: true, lean: true },
      );

      if (!newuser) {
        throw new NotFoundException('User not found');
      }

      return {
        _id: newuser._id as string,
        name: newuser.name,
        email: newuser.email,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const userDeleted = await this.userModel.findByIdAndDelete(userId);
      if (!userDeleted) {
        throw new NotFoundException('User not found');
      }
      return true;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUser(userId: string): Promise<Omit<AdminUserType, 'password'>> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        _id: user._id as string,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllUser(): Promise<Omit<AdminUserType, 'password'>[]> {
    try {
      const user = await this.userModel.find();
      if (user.length === 0 || !user) {
        throw new NotFoundException('Users not found');
      }

      return user.map((u) => ({
        _id: u._id.toString(),
        name: u.name,
        email: u.email,
      }));
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async userExists(email: string): Promise<AdminUserType> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        ...user,
        _id: user._id as string,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
