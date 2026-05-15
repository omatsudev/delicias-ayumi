import type { SupabaseClient } from '@supabase/supabase-js'
import type { ISettingsRepository } from '@/lib/domain/interfaces/ISettingsRepository'
import type { Setting } from '@/lib/domain/entities/Setting'

type DbRow = {
  key: string
  value: string
  label: string
  group_name: string
}

function toEntity(row: DbRow): Setting {
  return {
    key: row.key,
    value: row.value,
    label: row.label,
    groupName: row.group_name,
  }
}

export class SupabaseSettingsRepository implements ISettingsRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findAll(): Promise<Setting[]> {
    const { data, error } = await this.supabase
      .from('ayumi_settings')
      .select('*')
      .order('group_name')
      .order('key')
    if (error) throw error
    return (data as DbRow[]).map(toEntity)
  }

  async update(key: string, value: string): Promise<void> {
    const { error } = await this.supabase
      .from('ayumi_settings')
      .update({ value })
      .eq('key', key)
    if (error) throw error
  }
}
