import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Brand } from '../../catalog/entities/brand.entity';
import { MileageUnit } from '../mileage-unit.enum';
import { MotorcycleListingImage } from './motorcycle-listing-image.entity';

@ObjectType()
@Entity('motorcycle_listings')
export class MotorcycleListing {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ name: 'brand_id' })
  brandId: number;

  @Field(() => Brand)
  @ManyToOne(() => Brand, { eager: false })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Field(() => String)
  @Column({ type: 'text' })
  model: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  year: number;

  /** Engine displacement in cubic centimeters (cc). */
  @Field(() => Int)
  @Column({ name: 'displacement_cc', type: 'int' })
  displacementCc: number;

  /** Odometer reading: value in `mileageUnit` (km or miles). */
  @Field(() => Int)
  @Column({ type: 'int' })
  mileage: number;

  @Field(() => MileageUnit)
  @Column({
    name: 'mileage_unit',
    type: 'enum',
    enum: MileageUnit,
    default: MileageUnit.KM,
  })
  mileageUnit: MileageUnit;

  @Field(() => String)
  @Column({ type: 'text', unique: true })
  vin: string;

  @Field(() => String)
  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: string;

  @Field(() => String)
  @Column()
  currency: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => [MotorcycleListingImage])
  @OneToMany(() => MotorcycleListingImage, (img) => img.listing, {
    cascade: true,
  })
  images: MotorcycleListingImage[];
}
