import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserRole } from '../users/user-role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  AddMotorcycleListingImageInput,
  CreateMotorcycleListingInput,
} from './inputs/motorcycle-listing.inputs';
import { MotorcycleListingImage } from './entities/motorcycle-listing-image.entity';
import { MotorcycleListing } from './entities/motorcycle-listing.entity';
import { MotorcycleListingsService } from './motorcycle-listings.service';

@Resolver()
export class MotorcycleListingsResolver {
  constructor(private readonly listings: MotorcycleListingsService) {}

  @Mutation(() => MotorcycleListing)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  createMotorcycleListing(
    @Args('input') input: CreateMotorcycleListingInput,
  ): Promise<MotorcycleListing> {
    return this.listings.create(input);
  }

  @Mutation(() => MotorcycleListingImage)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  addMotorcycleListingImage(
    @Args('input') input: AddMotorcycleListingImageInput,
  ): Promise<MotorcycleListingImage> {
    return this.listings.addImage(input);
  }
}
