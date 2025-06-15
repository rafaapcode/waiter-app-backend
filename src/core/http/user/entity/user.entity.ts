import { UserRoles, UserType } from '@shared/types/User.type';
import {
  CreateUserDto,
  UpdateCurrentUserDto,
  UpdateUserDto,
} from '../dto/Input.dto';
import {
  OutPutCreateUserDto,
  OutPutGetAllUsersDto,
  OutPutGetCurrentUserDto,
  OutPutGetUserDto,
  OutPutUpdateCurrentUserDto,
  OutPutUpdateUserDto,
} from '../dto/OutPut.dto';

export class UserEntity {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRoles,
    public readonly _id?: string,
  ) {}

  static toUpdateCurrentUser(data: UpdateCurrentUserDto): UpdateCurrentUserDto {
    return {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.new_password && { new_password: data.new_password }),
      ...(data.current_password && { current_password: data.current_password }),
      ...(data.confirm_password && { confirm_password: data.confirm_password }),
    };
  }

  static toUpdateUser(data: UpdateUserDto): UpdateUserDto {
    return {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.password && { password: data.password }),
      ...(data.role && { role: data.role }),
    };
  }

  static newUser(data: CreateUserDto): UserEntity {
    return new UserEntity(data.name, data.email, data.password, data.role);
  }

  static toEntity(data: UserType): UserEntity {
    return new UserEntity(
      data.name,
      data.email,
      data.password,
      data.role,
      data._id,
    );
  }

  toCreate(): CreateUserDto {
    return {
      email: this.email,
      name: this.name,
      role: this.role,
      password: this.password,
    };
  }

  httpCreateResponse(): OutPutCreateUserDto {
    return {
      email: this.email,
      name: this.name,
      role: this.role,
      id: this._id,
    };
  }

  httpUpdateCurrentUserResponse(
    access_token?: string,
  ): OutPutUpdateCurrentUserDto {
    return {
      email: this.email,
      name: this.name,
      role: this.role,
      id: this._id,
      access_token,
    };
  }

  httpUpdateUserResponse(): OutPutUpdateUserDto {
    return {
      email: this.email,
      name: this.name,
      role: this.role,
      id: this._id,
    };
  }

  httpGetCurrentUserResponse(): OutPutGetCurrentUserDto {
    return {
      email: this.email,
      name: this.name,
    };
  }

  httpGetUserResponse(): OutPutGetUserDto {
    return {
      email: this.email,
      name: this.name,
      id: this._id,
      role: this.role,
    };
  }

  static httpGetAllUsersResponse(
    total_pages: number,
    users: UserEntity[],
  ): OutPutGetAllUsersDto {
    return {
      total_pages,
      users: users.map((u) => ({
        email: u.email,
        name: u.name,
        id: u._id,
        role: u.role,
      })),
    };
  }
}
