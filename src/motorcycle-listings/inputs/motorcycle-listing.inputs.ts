import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { MileageUnit } from '../mileage-unit.enum';

@InputType()
export class CreateMotorcycleListingInput {
  @Field(() => Int)
  @IsInt()
  brandId: number;

  @Field(() => String)
  @IsString()
  @MinLength(1)
  model: string;

  @Field(() => Int)
  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  mileage: number;

  @Field(() => MileageUnit, { nullable: true })
  @IsOptional()
  mileageUnit?: MileageUnit;

  @Field(() => String)
  @IsString()
  @MinLength(5)
  @MaxLength(32)
  vin: string;

  @Field(() => String)
  @IsString()
  @MinLength(1)
  price: string;

  @Field(() => String)
  @IsString()
  @MinLength(1)
  currency: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;
}

@InputType()
export class UpdateMotorcycleListingInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  brandId?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  model?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  year?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  mileage?: number;

  @Field(() => MileageUnit, { nullable: true })
  @IsOptional()
  mileageUnit?: MileageUnit;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(32)
  vin?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  price?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string | null;
}

@InputType()
export class AddMotorcycleListingImageInput {
  @Field(() => Int)
  @IsInt()
  listingId: number;

  @Field(() => String)
  @IsString()
  @MinLength(1)
  url: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isMain?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
