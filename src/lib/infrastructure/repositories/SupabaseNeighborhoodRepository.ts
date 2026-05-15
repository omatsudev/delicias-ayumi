import type { SupabaseClient } from '@supabase/supabase-js'
import type { INeighborhoodRepository } from '@/lib/domain/interfaces/INeighborhoodRepository'
import type { Neighborhood } from '@/lib/domain/entities/Neighborhood'

type DbRow = {
  id: number
  name: string
  fee_cents: number
  km: number
  active: boolean
}

function toEntity(row: DbRow): Neighborhood {
  return {
    id: row.id,
    name: row.name,
    feeCents: row.fee_cents,
    km: row.km,
    active: row.active,
  }
}

export class SupabaseNeighborhoodRepository implements INeighborhoodRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findAll(): Promise<Neighborhood[]> {
    const { data, error } = await this.supabase
      .from('ayumi_neighborhoods')
      .select('*')
      .eq('active', true)
      .order('name')

    if (error) throw error
    return (data as DbRow[]).map(toEntity)
  }
}
