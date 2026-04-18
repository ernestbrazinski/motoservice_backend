import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AddMotorcycleListingImageInput,
  CreateMotorcycleListingInput,
} from './inputs/motorcycle-listing.inputs';
import { MotorcycleListingImage } from './entities/motorcycle-listing-image.entity';
import { MotorcycleListing } from './entities/motorcycle-listing.entity';
import { MileageUnit } from './mileage-unit.enum';

@Injectable()
export class MotorcycleListingsService {
  constructor(
    @InjectRepository(MotorcycleListing)
    private readonly listings: Repository<MotorcycleListing>,
    @InjectRepository(MotorcycleListingImage)
    private readonly images: Repository<MotorcycleListingImage>,
  ) {}

  async create(input: CreateMotorcycleListingInput): Promise<MotorcycleListing> {
    const row = this.listings.create({
      brandId: input.brandId,
      model: input.model,
      year: input.year,
      displacementCc: input.displacementCc,
      mileage: input.mileage,
      mileageUnit: input.mileageUnit ?? MileageUnit.KM,
      vin: input.vin,
      price: input.price,
      currency: input.currency,
      description: input.description ?? null,
    });
    const saved = await this.listings.save(row);
    const full = await this.listings.findOne({
      where: { id: saved.id },
      relations: ['brand', 'images'],
    });
    if (!full) {
      throw new NotFoundException(`Listing ${saved.id} not found after create`);
    }
    return full;
  }

  async addImage(
    input: AddMotorcycleListingImageInput,
  ): Promise<MotorcycleListingImage> {
    const listing = await this.listings.findOne({
      where: { id: input.listingId },
    });
    if (!listing) {
      throw new NotFoundException(`Listing ${input.listingId} not found`);
    }
    const img = this.images.create({
      listingId: input.listingId,
      url: input.url,
      isMain: input.isMain ?? false,
      sortOrder: input.sortOrder ?? 0,
    });
    return this.images.save(img);
  }
}
