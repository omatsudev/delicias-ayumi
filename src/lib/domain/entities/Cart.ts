import type { Product } from '@/lib/domain/entities/Product'

export interface CartItem {
  readonly product: Product
  readonly qty: number
}
