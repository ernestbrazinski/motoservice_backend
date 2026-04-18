import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from '../../users/user-role.enum';

@ObjectType()
export class AuthUserType {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => UserRole)
  role: UserRole;
}

@ObjectType()
export class AuthPayload {
  @Field(() => String)
  accessToken: string;

  @Field(() => AuthUserType)
  user: AuthUserType;
}

@ObjectType()
export class AdminPingResult {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String)
  scope: string;
}
