import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user-role.enum';

@Injectable()
export class BootstrapAdminService implements OnModuleInit {
  private readonly logger = new Logger(BootstrapAdminService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const existingUsers = await this.usersRepository.count();
    if (existingUsers > 0) {
      return;
    }

    const email = this.configService.get<string>('BOOTSTRAP_ADMIN_EMAIL');
    const password = this.configService.get<string>('BOOTSTRAP_ADMIN_PASSWORD');

    if (!email?.trim() || !password) {
      this.logger.warn(
        'Bootstrap admin skipped: database has no users but BOOTSTRAP_ADMIN_EMAIL or BOOTSTRAP_ADMIN_PASSWORD is not set',
      );
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await this.usersRepository.save(
      this.usersRepository.create({
        email: email.trim().toLowerCase(),
        passwordHash,
        role: UserRole.SUPERADMIN,
      }),
    );

    this.logger.log(
      `Bootstrap admin user created (${email.trim().toLowerCase()})`,
    );
  }
}
