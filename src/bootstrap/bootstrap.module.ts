import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { BootstrapAdminService } from './bootstrap-admin.service';

@Module({
  imports: [UsersModule],
  providers: [BootstrapAdminService],
})
export class BootstrapModule {}
