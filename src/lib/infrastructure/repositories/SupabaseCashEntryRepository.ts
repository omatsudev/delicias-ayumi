import type { SupabaseClient } from '@supabase/supabase-js'
import type { ICashEntryRepository } from '@/lib/domain/interfaces/ICashEntryRepository'
import type { CashEntry, CreateCashEntryInput } from '@/lib/domain/entities/CashEntry'
import type { CashEntryType } from '@/lib/domain/enums/CashEntryType'

type DbRow = {
  id: string
  type: string
  category: string
  description: string
  amount_cents: number
  order_id: string | null
  created_at: string
}

function toEntity(row: DbRow): CashEntry {
  return {
    id: row.id,
    type: row.type as CashEntryType,
    category: row.category,
    description: row.description,
    amountCents: row.amount_cents,
    orderId: row.order_id,
    createdAt: row.created_at,
  }
}

export class SupabaseCashEntryRepository implements ICashEntryRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findAll(): Promise<CashEntry[]> {
    const { data, error } = await this.supabase
      .from('ayumi_cash_entries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data as DbRow[]).map(toEntity)
  }

  async create(input: CreateCashEntryInput): Promise<CashEntry> {
    const { data, error } = await this.supabase
      .from('ayumi_cash_entries')
      .insert({
        type: input.type,
        category: input.category,
        description: input.description,
        amount_cents: input.amountCents,
        order_id: input.orderId ?? null,
      })
      .select()
      .single()

    if (error) throw error
    return toEntity(data as DbRow)
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('ayumi_cash_entries')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
