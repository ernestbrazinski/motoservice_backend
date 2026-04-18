import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
  ) {}

  findAll(): Promise<Brand[]> {
    return this.brandsRepository.find({ order: { name: 'ASC' } });
  }

  findBySlug(slug: string): Promise<Brand | null> {
    return this.brandsRepository.findOne({
      where: { slug },
      relations: ['products'],
    });
  }

  async create(data: {
    name: string;
    slug: string;
    logoUrl?: string | null;
  }): Promise<Brand> {
    const row = this.brandsRepository.create({
      name: data.name,
      slug: data.slug,
      logoUrl: data.logoUrl ?? null,
    });
    return this.brandsRepository.save(row);
  }
}
