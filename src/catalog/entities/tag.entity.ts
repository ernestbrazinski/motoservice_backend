import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductTag } from './product-tag.entity';

@ObjectType()
@Entity('tags')
export class Tag {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @OneToMany(() => ProductTag, (pt) => pt.tag)
  productTags: ProductTag[];
}
