import type { DeliveryMethod } from '@/lib/domain/enums/DeliveryMethod'
import type { PaymentMethod } from '@/lib/domain/enums/PaymentMethod'
import type { OrderStatus } from '@/lib/domain/enums/OrderStatus'
import type { ProductCategory } from '@/lib/domain/enums/ProductCategory'

export interface OrderItemSnapshot {
  readonly productId: string
  readonly name: string
  readonly qty: number
  readonly unitPriceCents: number
}

export interface Order {
  readonly id: string
  readonly orderNumber: string
  readonly customerName: string
  readonly customerPhone: string
  readonly deliveryMethod: DeliveryMethod
  readonly bairro: string | null
  readonly address: string | null
  readonly cep: string | null
  readonly paymentMethod: PaymentMethod
  readonly status: OrderStatus
  readonly subtotalCents: number
  readonly feeCents: number
  readonly totalCents: number
  readonly notes: string | null
  readonly items: OrderItemSnapshot[]
  readonly createdAt: string
}

export interface OrderItem {
  readonly id: string
  readonly orderId: string
  readonly productId: string
  readonly qty: number
  readonly unitPriceCents: number
  readonly productSnapshot: {
    readonly name: string
    readonly sizeLabel: string
    readonly category: ProductCategory
  }
}

export interface CreateOrderInput {
  customerName: string
  customerPhone: string
  deliveryMethod: DeliveryMethod
  bairro?: string | null
  address?: string | null
  cep?: string | null
  paymentMethod: PaymentMethod
  subtotalCents: number
  feeCents: number
  totalCents: number
  notes?: string | null
  items: OrderItemSnapshot[]
}
