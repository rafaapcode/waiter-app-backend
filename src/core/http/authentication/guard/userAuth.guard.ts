import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@shared/decorators/isPublic';
import { ROLES_KEY } from '@shared/decorators/role.decorator';
import { AuthenticatedRequest } from '@shared/types/express';
import { AuthenticationService } from '../authentication.service';
import { Role } from '../roles/role.enum';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<AuthenticatedRequest>();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRole = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRole && requiredRole.includes(Role.CLIENT)) {
      return true;
    }

    const token = req.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('Token é obrigatório');
    }

    const [, authToken] = token.split(' ');
    if (!authToken) {
      throw new UnauthorizedException('Token é obrigatório');
    }

    const userData = await this.authService.verifyToken(authToken);
    if (!userData) {
      throw new UnauthorizedException('Token inválido ou expirado');
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
    req.user = { id: userData.id, email: userData.email, role: userData.role };
    return true;
  }
}
