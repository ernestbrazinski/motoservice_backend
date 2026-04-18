import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Brand } from './brand.entity';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
import { ProductTag } from './product-tag.entity';
import { ProductVariant } from './product-variant.entity';

@ObjectType()
@Entity('products')
export class Product {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column({ unique: true })
  slug: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  /** Stored as NUMERIC in Postgres; exposed as string for decimal safety. */
  @Field(() => String)
  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: string;

  @Field(() => String)
  @Column()
  currency: string;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'brand_id', type: 'int', nullable: true })
  brandId: number | null;

  @Field(() => Brand, { nullable: true })
  @ManyToOne(() => Brand, (b) => b.products, { nullable: true })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand | null;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'category_id', type: 'int', nullable: true })
  categoryId: number | null;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (c) => c.products, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  @Field(() => [ProductImage])
  @OneToMany(() => ProductImage, (img) => img.product, { cascade: true })
  images: ProductImage[];

  @Field(() => [ProductVariant])
  @OneToMany(() => ProductVariant, (v) => v.product, { cascade: true })
  variants: ProductVariant[];

  @OneToMany(() => ProductTag, (pt) => pt.product)
  productTags: ProductTag[];

  @Field(() => Date)
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
