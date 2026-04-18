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
@Entity('product_variants')
export class ProductVariant {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product, (p) => p.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  size: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  color: string | null;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  stock: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', unique: true, nullable: true })
  sku: string | null;
}
