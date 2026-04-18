import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@ObjectType()
@Entity('brands')
export class Brand {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column({ unique: true })
  slug: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'logo_url', type: 'text', nullable: true })
  logoUrl: string | null;

  @OneToMany(() => Product, (p) => p.brand)
  products: Product[];
}
