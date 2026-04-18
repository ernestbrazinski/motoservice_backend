import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from '../users/user-role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BrandsService } from './brands.service';
import { CategoriesService } from './categories.service';
import {
  AddProductImageInput,
  CreateBrandInput,
  CreateCategoryInput,
  CreateOrderInput,
  CreateProductInput,
  CreateTagInput,
} from './inputs/catalog.inputs';
import { OrdersService } from './orders.service';
import { ProductsService } from './products.service';
import { TagsService } from './tags.service';
import { Brand } from './entities/brand.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ShopOrder } from './entities/order.entity';
import { Tag } from './entities/tag.entity';

@Resolver()
export class CatalogResolver {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly brandsService: BrandsService,
    private readonly productsService: ProductsService,
    private readonly tagsService: TagsService,
    private readonly ordersService: OrdersService,
  ) {}

  @Query(() => [Category])
  categories(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Query(() => Category, { nullable: true })
  category(@Args('slug') slug: string): Promise<Category | null> {
    return this.categoriesService.findBySlug(slug);
  }

  @Query(() => [Brand])
  brands(): Promise<Brand[]> {
    return this.brandsService.findAll();
  }

  @Query(() => Brand, { nullable: true })
  brand(@Args('slug') slug: string): Promise<Brand | null> {
    return this.brandsService.findBySlug(slug);
  }

  @Query(() => [Product])
  products(
    @Args('categorySlug', { type: () => String, nullable: true })
    categorySlug?: string,
    @Args('brandSlug', { type: () => String, nullable: true })
    brandSlug?: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<Product[]> {
    return this.productsService.findAll({
      categorySlug: categorySlug ?? undefined,
      brandSlug: brandSlug ?? undefined,
      limit: limit ?? undefined,
    });
  }

  @Query(() => Product, { nullable: true })
  product(@Args('slug') slug: string): Promise<Product | null> {
    return this.productsService.findBySlug(slug);
  }

  @Query(() => [Tag])
  tags(): Promise<Tag[]> {
    return this.tagsService.findAll();
  }

  @Query(() => [ShopOrder])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  orders(): Promise<ShopOrder[]> {
    return this.ordersService.findAll();
  }

  @Query(() => ShopOrder, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  order(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ShopOrder | null> {
    return this.ordersService.findOne(id);
  }

  @Mutation(() => Category)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  createCategory(@Args('input') input: CreateCategoryInput): Promise<Category> {
    return this.categoriesService.create(input);
  }

  @Mutation(() => Brand)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  createBrand(@Args('input') input: CreateBrandInput): Promise<Brand> {
    return this.brandsService.create(input);
  }

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  createProduct(@Args('input') input: CreateProductInput): Promise<Product> {
    return this.productsService.create(input);
  }

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  updateProduct(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: CreateProductInput,
  ): Promise<Product> {
    return this.productsService.update(id, {
      title: input.title,
      slug: input.slug,
      description: input.description,
      price: input.price,
      currency: input.currency,
      brandId: input.brandId,
      categoryId: input.categoryId,
    });
  }

  @Mutation(() => ProductImage)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  addProductImage(
    @Args('input') input: AddProductImageInput,
  ): Promise<ProductImage> {
    return this.productsService.addImage(
      input.productId,
      input.url,
      input.isMain ?? false,
    );
  }

  @Mutation(() => Tag)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  createTag(@Args('input') input: CreateTagInput): Promise<Tag> {
    return this.tagsService.create(input.name);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  async linkProductTag(
    @Args('productId', { type: () => Int }) productId: number,
    @Args('tagId', { type: () => Int }) tagId: number,
  ): Promise<boolean> {
    await this.tagsService.linkToProduct(productId, tagId);
    return true;
  }

  @Mutation(() => ShopOrder)
  createOrder(@Args('input') input: CreateOrderInput): Promise<ShopOrder> {
    return this.ordersService.create({
      customerName: input.customerName ?? null,
      customerEmail: input.customerEmail ?? null,
      customerPhone: input.customerPhone ?? null,
      status: input.status ?? null,
      items: input.items.map((i) => ({
        productId: i.productId ?? null,
        variantId: i.variantId ?? null,
        quantity: i.quantity,
        price: i.price,
      })),
    });
  }
}
