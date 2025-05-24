import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserType } from 'src/types/User.type';
import { CONSTANTS } from '../../../constants';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(CONSTANTS.USER_PROVIDER)
    private userModel: Model<User>,
  ) {}

  async createUser(user: UserType): Promise<Omit<UserType, 'password'>> {
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
        role: newUser.role,
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
    user: Partial<UserType>,
  ): Promise<Omit<UserType, 'password'>> {
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
        role: newuser.role,
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

  async updateCurrentUser(
    email: string,
    user: Partial<{ name: string; email: string; new_password: string }>,
  ): Promise<Omit<UserType, 'password'>> {
    try {
      const userId = await this.userModel.findOne({ email });

      if (!userId) {
        throw new NotFoundException('User not found');
      }

      const newuser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          ...(user.email && { email: user.email }),
          ...(user.name && { name: user.name }),
          ...(user.new_password && { password: user.new_password }),
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
        role: newuser.role,
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

  async getUser(userId: string): Promise<Omit<UserType, 'password'>> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        _id: user._id as string,
        name: user.name,
        email: user.email,
        role: user.role,
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

  async getUserByEmail(
    userEmail: string,
  ): Promise<{ name: string; email: string }> {
    try {
      const user = await this.userModel.findOne({ email: userEmail });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
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

  async getAllUser(
    page: number,
  ): Promise<{ total_pages: number; users: Omit<UserType, 'password'>[] }> {
    try {
      const pageNumber = page && page !== 0 ? page : 1;
      const limit = 6;
      const skip = (pageNumber - 1) * limit;

      const countDocs = await this.userModel.countDocuments();

      const user = await this.userModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      if (user.length === 0 || !user) {
        throw new NotFoundException('Users not found');
      }

      return {
        total_pages: Math.ceil(countDocs / limit),
        users: user.map((u) => ({
          _id: u._id.toString(),
          name: u.name,
          email: u.email,
          role: u.role,
        })),
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

  async userExists(email: string): Promise<UserType> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
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
