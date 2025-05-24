import { Request } from 'express';
import { Role } from 'src/core/http/authentication/roles/role.enum';

export interface JwtPayload {
  email: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
