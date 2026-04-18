import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsService } from './brands.service';
import { CatalogResolver } from './catalog.resolver';
import { CategoriesService } from './categories.service';
import { Brand } from './entities/brand.entity';
import { Category } from './entities/category.entity';
import { OrderItem } from './entities/order-item.entity';
import { ShopOrder } from './entities/order.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductTag } from './entities/product-tag.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Product } from './entities/product.entity';
import { Tag } from './entities/tag.entity';
import { OrdersService } from './orders.service';
import { ProductGraphResolver } from './product-graph.resolver';
import { ProductsService } from './products.service';
import { TagsService } from './tags.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Brand,
      Product,
      ProductImage,
      ProductVariant,
      Tag,
      ProductTag,
      ShopOrder,
      OrderItem,
    ]),
  ],
  providers: [
    CategoriesService,
    BrandsService,
    ProductsService,
    TagsService,
    OrdersService,
    CatalogResolver,
    ProductGraphResolver,
  ],
})
export class CatalogModule {}
