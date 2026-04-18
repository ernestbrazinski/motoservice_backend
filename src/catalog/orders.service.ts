import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { ShopOrder } from './entities/order.entity';

export type CreateOrderLineInput = {
  productId?: number | null;
  variantId?: number | null;
  quantity: number;
  price: string;
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(ShopOrder)
    private readonly ordersRepository: Repository<ShopOrder>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
  ) {}

  findAll(): Promise<ShopOrder[]> {
    return this.ordersRepository.find({
      relations: ['items', 'items.product', 'items.variant'],
      order: { id: 'DESC' },
    });
  }

  findOne(id: number): Promise<ShopOrder | null> {
    return this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'items.variant'],
    });
  }

  async create(data: {
    customerName?: string | null;
    customerEmail?: string | null;
    customerPhone?: string | null;
    status?: string | null;
    items: CreateOrderLineInput[];
  }): Promise<ShopOrder> {
    const total = data.items.reduce(
      (acc, line) => acc + Number(line.price) * line.quantity,
      0,
    );

    const order = this.ordersRepository.create({
      customerName: data.customerName ?? null,
      customerEmail: data.customerEmail ?? null,
      customerPhone: data.customerPhone ?? null,
      status: data.status ?? 'pending',
      totalPrice: total.toFixed(2),
    });
    const saved = await this.ordersRepository.save(order);

    const lines = data.items.map((line) =>
      this.orderItemsRepository.create({
        orderId: saved.id,
        productId: line.productId ?? null,
        variantId: line.variantId ?? null,
        quantity: line.quantity,
        price: line.price,
      }),
    );
    await this.orderItemsRepository.save(lines);

    return (
      (await this.ordersRepository.findOne({
        where: { id: saved.id },
        relations: ['items', 'items.product', 'items.variant'],
      })) ?? saved
    );
  }
}
