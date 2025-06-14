import { UserRepository } from '@infra/repository/user/user.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from '@shared/config/env';
import { UserRoles } from '@shared/types/User.type';
import { verifyPassword } from '@shared/utils/verifyPassword';
import { SignInUserDto } from './dto/Input.dto';
import { Role } from './roles/role.enum';

@Injectable()
export class AuthenticationService {
  constructor(
    private userRepo: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signInUser({ email, password }: SignInUserDto): Promise<{
    access_token: string;
    role: UserRoles;
    id: string;
  }> {
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

  async generateToken(
    id: string,
    email: string,
    role: string,
  ): Promise<string> {
    return await this.jwtService.signAsync(
      { id, email, role },
      {
        expiresIn: '1d',
        secret: env.JWT_SECRET,
      },
    );
  }

  async verifyToken(
    token: string,
  ): Promise<{ id: string; email: string; role: Role }> {
    try {
      const isTokenValid = await this.jwtService.verifyAsync(token, {
        secret: env.JWT_SECRET,
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
