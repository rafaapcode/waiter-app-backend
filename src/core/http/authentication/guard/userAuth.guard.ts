import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthenticatedRequest } from 'src/types/express';
import { UserService } from '../../user/user.service';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Role } from '../roles/role.enum';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<AuthenticatedRequest>();

    const requiredRole = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRole && requiredRole.includes(Role.CLIENT)) {
      return true;
    }

    const token = req.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('Token is Required');
    }

    const [, authToken] = token.split(' ');
    if (!authToken) {
      throw new UnauthorizedException('Token is Required');
    }

    const userData = this.userService.verifyToken(authToken);
    if (!userData) {
      throw new UnauthorizedException('Token invalid');
    }
    if (!requiredRole) {
      return true;
    }
    if (!userData.role) {
      throw new UnauthorizedException('Sem permissão para acesso !');
    }
    const hasPermission = requiredRole.some((role) => role === userData.role);
    if (!hasPermission) {
      throw new UnauthorizedException('Sem permissão para acesso !');
    }
    req.user = userData;
    return true;
  }
}
