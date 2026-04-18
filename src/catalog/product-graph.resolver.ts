import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Product } from './entities/product.entity';
import { Tag } from './entities/tag.entity';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductGraphResolver {
  constructor(private readonly productsService: ProductsService) {}

  @ResolveField('tags', () => [Tag])
  tags(@Parent() product: Product): Promise<Tag[]> {
    if (product.productTags?.length) {
      return Promise.resolve(
        product.productTags.map((pt) => pt.tag).filter(Boolean),
      );
    }
    return this.productsService.findTagsForProduct(product.id);
  }
}
