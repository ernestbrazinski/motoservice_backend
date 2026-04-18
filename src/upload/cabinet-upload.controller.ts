import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import type { Express } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/user-role.enum';

function uploadDir(): string {
  return join(process.cwd(), 'public', 'upload');
}

function ensureUploadDir(): void {
  const d = uploadDir();
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
}

function safeExt(mime: string): string {
  const m: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };
  return m[mime.toLowerCase()] ?? '.bin';
}

@Controller()
export class CabinetUploadController {
  @Post('cabinet/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          ensureUploadDir();
          cb(null, uploadDir());
        },
        filename: (_req, file, cb) => {
          cb(null, `${randomUUID()}${safeExt(file.mimetype)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!/^image\/(jpeg|png|webp|gif)$/i.test(file.mimetype)) {
          cb(new BadRequestException('Only JPEG, PNG, WebP, GIF'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File): { url: string } {
    if (!file?.filename) {
      throw new BadRequestException('No file');
    }
    return { url: `/upload/${file.filename}` };
  }
}
