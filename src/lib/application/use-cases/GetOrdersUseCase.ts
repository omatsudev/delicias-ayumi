import type { IOrderRepository } from '@/lib/domain/interfaces/IOrderRepository'
import type { Order } from '@/lib/domain/entities/Order'

export class GetOrdersUseCase {
  constructor(private readonly orders: IOrderRepository) {}

  async execute(): Promise<Order[]> {
    return this.orders.findAll()
  }
}
