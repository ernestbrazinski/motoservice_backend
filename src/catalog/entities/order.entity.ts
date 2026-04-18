import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';

@ObjectType('Order')
@Entity('orders')
export class ShopOrder {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: true })
  @Column({ name: 'customer_name', type: 'text', nullable: true })
  customerName: string | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'customer_email', type: 'text', nullable: true })
  customerEmail: string | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'customer_phone', type: 'text', nullable: true })
  customerPhone: string | null;

  @Field(() => String, { nullable: true })
  @Column({
    name: 'total_price',
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  totalPrice: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  status: string | null;

  @Field(() => Date)
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, (i) => i.order, { cascade: true })
  items: OrderItem[];
}
