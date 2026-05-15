import type { Setting } from '../entities/Setting'

export interface ISettingsRepository {
  findAll(): Promise<Setting[]>
  update(key: string, value: string): Promise<void>
}
