import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@ObjectType()
@Entity('product_images')
export class ProductImage {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product, (p) => p.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Field(() => String)
  @Column({ type: 'text' })
  url: string;

  @Field(() => Boolean)
  @Column({ name: 'is_main', type: 'boolean', default: false })
  isMain: boolean;
}
