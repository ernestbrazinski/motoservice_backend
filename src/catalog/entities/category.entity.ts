import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@ObjectType()
@Entity('categories')
export class Category {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column({ unique: true })
  slug: string;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'parent_id', type: 'int', nullable: true })
  parentId: number | null;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (c) => c.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Category | null;

  @Field(() => [Category])
  @OneToMany(() => Category, (c) => c.parent)
  children: Category[];

  @OneToMany(() => Product, (p) => p.category)
  products: Product[];
}
