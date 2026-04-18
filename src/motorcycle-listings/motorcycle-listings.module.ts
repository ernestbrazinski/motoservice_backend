import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MotorcycleListingImage } from './entities/motorcycle-listing-image.entity';
import { MotorcycleListing } from './entities/motorcycle-listing.entity';
import { MotorcycleListingsResolver } from './motorcycle-listings.resolver';
import { MotorcycleListingsService } from './motorcycle-listings.service';

@Module({
  imports: [TypeOrmModule.forFeature([MotorcycleListing, MotorcycleListingImage])],
  providers: [MotorcycleListingsService, MotorcycleListingsResolver],
})
export class MotorcycleListingsModule {}
