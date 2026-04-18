import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from '../users/user-role.enum';
import { AuthService } from './auth.service';
import {
  CurrentUser,
  type AuthUser,
} from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import {
  AdminPingResult,
  AuthPayload,
  AuthUserType,
} from './graphql/auth.types';
import { LoginInput } from './graphql/login.input';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    const result = await this.authService.login({
      email: input.email,
      password: input.password,
    });
    return {
      accessToken: result.access_token,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
    };
  }

  @Query(() => AuthUserType)
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUser): AuthUserType {
    return user;
  }

  @Query(() => AdminPingResult)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  adminPing(): AdminPingResult {
    return { ok: true, scope: 'superadmin' };
  }
}
