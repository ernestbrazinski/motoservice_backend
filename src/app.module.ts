import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { CatalogModule } from './catalog/catalog.module';
import {
  Brand,
  Category,
  OrderItem,
  ShopOrder,
  Product,
  ProductImage,
  ProductTag,
  ProductVariant,
  Tag,
} from './catalog/entities';
import './graphql/register-enums';
import { MotorcycleListingImage } from './motorcycle-listings/entities/motorcycle-listing-image.entity';
import { MotorcycleListing } from './motorcycle-listings/entities/motorcycle-listing.entity';
import { MotorcycleListingsModule } from './motorcycle-listings/motorcycle-listings.module';
import { UploadModule } from './upload/upload.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST', 'localhost'),
        port: Number(config.get('DATABASE_PORT', 5432)),
        username: config.get<string>('DATABASE_USER', 'motoservice'),
        password: config.get<string>('DATABASE_PASSWORD', 'motoservice'),
        database: config.get<string>('DATABASE_NAME', 'motoservice'),
        entities: [
          User,
          Category,
          Brand,
          Product,
          ProductImage,
          ProductVariant,
          Tag,
          ProductTag,
          ShopOrder,
          OrderItem,
          MotorcycleListing,
          MotorcycleListingImage,
        ],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      context: ({ req, res }: { req: unknown; res: unknown }) => ({
        req,
        res,
      }),
    }),
    UsersModule,
    BootstrapModule,
    AuthModule,
    CatalogModule,
    MotorcycleListingsModule,
    UploadModule,
  ],
})
export class AppModule {}
