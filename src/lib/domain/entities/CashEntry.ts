import type { CashEntryType } from '@/lib/domain/enums/CashEntryType'

export interface CashEntry {
  readonly id: string
  readonly type: CashEntryType
  readonly category: string
  readonly description: string
  readonly amountCents: number
  readonly orderId: string | null
  readonly createdAt: string
}

export interface CreateCashEntryInput {
  type: CashEntryType
  category: string
  description: string
  amountCents: number
  orderId?: string | null
}
