import type { Order, CreateOrderInput } from '@/lib/domain/entities/Order'
import type { OrderStatus } from '@/lib/domain/enums/OrderStatus'

export interface IOrderRepository {
  findAll(): Promise<Order[]>
  findById(id: string): Promise<Order | null>
  findByOrderNumber(orderNumber: string): Promise<Order | null>
  create(input: CreateOrderInput): Promise<Order>
  updateStatus(id: string, status: OrderStatus): Promise<Order>
}
