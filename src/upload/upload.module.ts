import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CabinetUploadController } from './cabinet-upload.controller';

@Module({
  imports: [AuthModule],
  controllers: [CabinetUploadController],
  providers: [JwtAuthGuard, RolesGuard],
})
export class UploadModule {}
