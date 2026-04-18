import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: ['parent', 'children'],
      order: { id: 'ASC' },
    });
  }

  findBySlug(slug: string): Promise<Category | null> {
    return this.categoriesRepository.findOne({
      where: { slug },
      relations: ['parent', 'children', 'products', 'products.brand'],
    });
  }

  async create(data: {
    name: string;
    slug: string;
    parentId?: number | null;
  }): Promise<Category> {
    const row = this.categoriesRepository.create({
      name: data.name,
      slug: data.slug,
      parentId: data.parentId ?? null,
    });
    return this.categoriesRepository.save(row);
  }
}
