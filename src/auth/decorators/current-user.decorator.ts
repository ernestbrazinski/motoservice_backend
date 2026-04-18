import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '../../users/user-role.enum';

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};

function getRequest(ctx: ExecutionContext): { user?: AuthUser } {
  if (ctx.getType<string>() === 'graphql') {
    return GqlExecutionContext.create(ctx).getContext<{
      req: { user?: AuthUser };
    }>().req;
  }
  return ctx.switchToHttp().getRequest<{ user?: AuthUser }>();
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const request = getRequest(ctx);
    const user = request.user;
    if (!user) {
      return undefined;
    }
    return data ? user[data] : user;
  },
);
