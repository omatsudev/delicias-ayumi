import type { IOrderRepository } from '@/lib/domain/interfaces/IOrderRepository'
import type { IProductRepository } from '@/lib/domain/interfaces/IProductRepository'
import type { ICashEntryRepository } from '@/lib/domain/interfaces/ICashEntryRepository'
import type { Order } from '@/lib/domain/entities/Order'
import type { CashEntry } from '@/lib/domain/entities/CashEntry'
import type { Product } from '@/lib/domain/entities/Product'

export interface DashboardData {
  orders: Order[]
  products: Product[]
  cashEntries: CashEntry[]
}

export class GetDashboardDataUseCase {
  constructor(
    private readonly orders: IOrderRepository,
    private readonly products: IProductRepository,
    private readonly cashEntries: ICashEntryRepository,
  ) {}

  async execute(): Promise<DashboardData> {
    const [orders, products, cashEntries] = await Promise.all([
      this.orders.findAll(),
      this.products.findAll(),
      this.cashEntries.findAll(),
    ])

    return { orders, products, cashEntries }
  }
}
