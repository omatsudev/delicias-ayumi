import type { IOrderRepository } from '@/lib/domain/interfaces/IOrderRepository'
import type { Order, CreateOrderInput } from '@/lib/domain/entities/Order'

export class PlaceOrderUseCase {
  constructor(private readonly orders: IOrderRepository) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    return this.orders.create(input)
  }
}
