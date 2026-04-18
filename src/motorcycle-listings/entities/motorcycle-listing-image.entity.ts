import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MotorcycleListing } from './motorcycle-listing.entity';

@ObjectType()
@Entity('motorcycle_listing_images')
export class MotorcycleListingImage {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'listing_id' })
  listingId: number;

  @ManyToOne(() => MotorcycleListing, (l) => l.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listing_id' })
  listing: MotorcycleListing;

  @Field(() => String)
  @Column({ type: 'text' })
  url: string;

  @Field(() => Int)
  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @Field(() => Boolean)
  @Column({ name: 'is_main', type: 'boolean', default: false })
  isMain: boolean;
}
