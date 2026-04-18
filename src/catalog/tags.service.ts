import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductTag } from './entities/product-tag.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
    @InjectRepository(ProductTag)
    private readonly productTagRepository: Repository<ProductTag>,
  ) {}

  findAll(): Promise<Tag[]> {
    return this.tagsRepository.find({ order: { name: 'ASC' } });
  }

  async create(name: string): Promise<Tag> {
    const row = this.tagsRepository.create({ name });
    return this.tagsRepository.save(row);
  }

  async linkToProduct(productId: number, tagId: number): Promise<void> {
    await this.productTagRepository
      .createQueryBuilder()
      .insert()
      .into(ProductTag)
      .values({ productId, tagId })
      .orIgnore()
      .execute();
  }
}
