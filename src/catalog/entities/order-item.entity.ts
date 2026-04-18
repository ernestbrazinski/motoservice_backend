import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';
import { ShopOrder } from './order.entity';

@ObjectType('OrderItem')
@Entity('order_items')
export class OrderItem {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id' })
  orderId: number;

  @ManyToOne(() => ShopOrder, (o) => o.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: ShopOrder;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'product_id', type: 'int', nullable: true })
  productId: number | null;

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product | null;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'variant_id', type: 'int', nullable: true })
  variantId: number | null;

  @ManyToOne(() => ProductVariant, { nullable: true })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant | null;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  quantity: number | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  price: string | null;
}
