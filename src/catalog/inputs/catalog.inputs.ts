import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  @IsString()
  @MinLength(1)
  name: string;

  @Field(() => String)
  @IsString()
  @MinLength(1)
  slug: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  parentId?: number | null;
}

@InputType()
export class CreateBrandInput {
  @Field(() => String)
  @IsString()
  @MinLength(1)
  name: string;

  @Field(() => String)
  @IsString()
  @MinLength(1)
  slug: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  logoUrl?: string | null;
}

@InputType()
export class CreateProductInput {
  @Field(() => String)
  @IsString()
  @MinLength(1)
  title: string;

  @Field(() => String)
  @IsString()
  @MinLength(1)
  slug: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @Field(() => String)
  @IsString()
  @MinLength(1)
  price: string;

  @Field(() => String)
  @IsString()
  @MinLength(1)
  currency: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  brandId?: number | null;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  categoryId?: number | null;
}

@InputType()
export class AddProductImageInput {
  @Field(() => Int)
  @IsInt()
  productId: number;

  @Field(() => String)
  @IsString()
  @MinLength(1)
  url: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isMain?: boolean | null;
}

@InputType()
export class CreateTagInput {
  @Field(() => String)
  @IsString()
  @MinLength(1)
  name: string;
}

@InputType()
export class CreateOrderItemInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  productId?: number | null;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  variantId?: number | null;

  @Field(() => Int)
  @Min(1)
  quantity: number;

  @Field(() => String)
  @IsString()
  @MinLength(1)
  price: string;
}

@InputType()
export class CreateOrderInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  customerName?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  customerEmail?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  customerPhone?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  status?: string | null;

  @Field(() => [CreateOrderItemInput])
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemInput)
  items: CreateOrderItemInput[];
}
