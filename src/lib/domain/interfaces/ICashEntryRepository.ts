import type { CashEntry, CreateCashEntryInput } from '@/lib/domain/entities/CashEntry'

export interface ICashEntryRepository {
  findAll(): Promise<CashEntry[]>
  create(input: CreateCashEntryInput): Promise<CashEntry>
  remove(id: string): Promise<void>
}
