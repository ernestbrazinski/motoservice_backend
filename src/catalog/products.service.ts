import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,
  ) {}

  async findAll(filters?: {
    categorySlug?: string;
    brandSlug?: string;
    limit?: number;
  }): Promise<Product[]> {
    const take = Math.min(filters?.limit ?? 50, 500);
    const qb = this.productsRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.brand', 'brand')
      .leftJoinAndSelect('p.category', 'category')
      .leftJoinAndSelect('p.images', 'images')
      .leftJoinAndSelect('p.variants', 'variants')
      .orderBy('p.id', 'DESC')
      .take(take);

    if (filters?.categorySlug) {
      qb.andWhere('category.slug = :cslug', {
        cslug: filters.categorySlug,
      });
    }
    if (filters?.brandSlug) {
      qb.andWhere('brand.slug = :bslug', { bslug: filters.brandSlug });
    }

    return qb.getMany();
  }

  findBySlug(slug: string): Promise<Product | null> {
    return this.productsRepository.findOne({
      where: { slug },
      relations: [
        'brand',
        'category',
        'images',
        'variants',
      ],
    });
  }

  findById(id: number): Promise<Product | null> {
    return this.productsRepository.findOne({ where: { id } });
  }

  async create(data: {
    title: string;
    slug: string;
    description?: string | null;
    price: string;
    currency: string;
    brandId?: number | null;
    categoryId?: number | null;
  }): Promise<Product> {
    const row = this.productsRepository.create({
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      price: data.price,
      currency: data.currency,
      brandId: data.brandId ?? null,
      categoryId: data.categoryId ?? null,
    });
    return this.productsRepository.save(row);
  }

  async update(
    id: number,
    data: {
      title: string;
      slug: string;
      description?: string | null;
      price: string;
      currency: string;
      brandId?: number | null;
      categoryId?: number | null;
    },
  ): Promise<Product> {
    const row = await this.findById(id);
    if (!row) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    row.title = data.title;
    row.slug = data.slug;
    row.description = data.description ?? null;
    row.price = data.price;
    row.currency = data.currency;
    row.brandId = data.brandId ?? null;
    row.categoryId = data.categoryId ?? null;
    return this.productsRepository.save(row);
  }

  async addImage(
    productId: number,
    url: string,
    isMain: boolean,
  ): Promise<ProductImage> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }
    const trimmed = url.trim();
    if (isMain) {
      await this.productImagesRepository.update(
        { productId },
        { isMain: false },
      );
    }
    const row = this.productImagesRepository.create({
      productId,
      url: trimmed,
      isMain,
    });
    return this.productImagesRepository.save(row);
  }
}
