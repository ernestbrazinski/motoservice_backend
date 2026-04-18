import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '../../users/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { AuthUser } from '../decorators/current-user.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  private getRequest(context: ExecutionContext): { user?: AuthUser } {
    if (context.getType<string>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext<{
        req: { user?: AuthUser };
      }>().req;
    }
    return context.switchToHttp().getRequest<{ user?: AuthUser }>();
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) {
      return true;
    }
    const user = this.getRequest(context).user;
    if (!user) {
      throw new ForbiddenException();
    }
    if (!roles.includes(user.role)) {
      throw new ForbiddenException();
    }
    return true;
  }
}
