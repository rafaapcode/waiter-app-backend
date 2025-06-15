import { UserEntity } from '@core/http/user/entity/user.entity';
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

  async createUser(user: UserEntity): Promise<UserEntity> {
    const userExists = await this.userModel.findOne({ email: user.email });
    if (userExists) {
      throw new BadRequestException('Usuário já existe');
    }
    const newUser = await this.userModel.create(user.toCreate());
    return new UserEntity(
      newUser.name,
      newUser.email,
      newUser.password,
      newUser.role,
      newUser.id,
    );
  }

  async updateUser(
    userId: string,
    user: Partial<UserType>,
  ): Promise<UserEntity> {
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

    return UserEntity.toEntity({
      email: newuser.email,
      name: newuser.name,
      password: newuser.password,
      role: newuser.role,
      _id: newuser.id,
    });
  }

  async updateCurrentUser(
    email: string,
    user: Partial<{ name: string; email: string; new_password: string }>,
  ): Promise<UserEntity> {
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

    return UserEntity.toEntity({
      email: newuser.email,
      name: newuser.name,
      password: newuser.password,
      role: newuser.role,
      _id: newuser.id,
    });
  }

  async deleteUser(userId: string): Promise<boolean> {
    const userDeleted = await this.userModel.findByIdAndDelete(userId);
    if (!userDeleted) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return true;
  }

  async getUser(userId: string): Promise<UserEntity> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return UserEntity.toEntity({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.password,
    });
  }

  async getUserByEmail(userEmail: string): Promise<UserEntity> {
    const user = await this.userModel.findOne({ email: userEmail });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return UserEntity.toEntity({
      email: user.email,
      name: user.name,
      password: user.password,
      _id: user.id,
      role: user.role,
    });
  }

  async getAllUser(
    userId: string,
    page: number,
  ): Promise<{ total_pages: number; users: UserEntity[] }> {
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
      users: user.map((u) =>
        UserEntity.toEntity({
          email: u.email,
          name: u.name,
          password: u.password,
          _id: u.id,
          role: u.role,
        }),
      ),
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
