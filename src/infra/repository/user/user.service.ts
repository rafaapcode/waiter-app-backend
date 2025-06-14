import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserType } from '@shared/types/User.type';
import { Model } from 'mongoose';
import { CONSTANTS } from '../../../constants';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(CONSTANTS.USER_PROVIDER)
    private userModel: Model<User>,
  ) {}

  async createUser(user: UserType): Promise<Omit<UserType, 'password'>> {
    const userExists = await this.userModel.findOne({ email: user.email });
    if (userExists) {
      throw new BadRequestException('Usuário já existe');
    }
    const newUser = await this.userModel.create(user);
    return {
      _id: newUser._id as string,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
  }

  async updateUser(
    userId: string,
    user: Partial<UserType>,
  ): Promise<Omit<UserType, 'password'>> {
    const newuser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        ...user,
      },
      { new: true, lean: true },
    );

    if (!newuser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      _id: newuser._id as string,
      name: newuser.name,
      email: newuser.email,
      role: newuser.role,
    };
  }

  async updateCurrentUser(
    email: string,
    user: Partial<{ name: string; email: string; new_password: string }>,
  ): Promise<Omit<UserType, 'password'>> {
    const userId = await this.userModel.findOne({ email });

    if (!userId) {
      throw new NotFoundException('Usuário não encontrado');
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
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      _id: newuser._id as string,
      name: newuser.name,
      email: newuser.email,
      role: newuser.role,
    };
  }

  async deleteUser(userId: string): Promise<boolean> {
    const userDeleted = await this.userModel.findByIdAndDelete(userId);
    if (!userDeleted) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return true;
  }

  async getUser(userId: string): Promise<Omit<UserType, 'password'>> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return {
      _id: user._id as string,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async getUserByEmail(
    userEmail: string,
  ): Promise<Pick<UserType, 'name' | 'email'>> {
    const user = await this.userModel.findOne({ email: userEmail });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return {
      name: user.name,
      email: user.email,
    };
  }

  async getAllUser(
    userId: string,
    page: number,
  ): Promise<{ total_pages: number; users: Omit<UserType, 'password'>[] }> {
    const pageNumber = page && page !== 0 ? page : 1;
    const limit = 6;
    const skip = (pageNumber - 1) * limit;

    const countDocs = await this.userModel
      .find({ id: { $ne: userId } })
      .countDocuments();

    const user = await this.userModel
      .find({ _id: { $ne: userId } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (user.length === 0 || !user) {
      throw new NotFoundException('Usuário não encontrado');
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
  }

  async userExists(email: string): Promise<UserType> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    };
  }
}
