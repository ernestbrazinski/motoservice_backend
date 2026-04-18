import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('JwtConfig');

const DEV_FALLBACK_SECRET =
  'development-only-jwt-secret-minimum-32-characters-long';

export function resolveJwtSecret(config: ConfigService): string {
  const fromEnv = config.get<string>('JWT_SECRET')?.trim();
  if (fromEnv) {
    return fromEnv;
  }

  if (config.get<string>('NODE_ENV') === 'production') {
    throw new Error(
      'JWT_SECRET is not set. Add JWT_SECRET to your environment or .env (see .env.example).',
    );
  }

  logger.warn(
    `JWT_SECRET is missing; using a development default. Set JWT_SECRET in .env before production.`,
  );
  return DEV_FALLBACK_SECRET;
}
