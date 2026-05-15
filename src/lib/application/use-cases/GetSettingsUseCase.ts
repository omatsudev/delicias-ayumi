import type { ISettingsRepository } from '@/lib/domain/interfaces/ISettingsRepository'
import type { Setting } from '@/lib/domain/entities/Setting'

export class GetSettingsUseCase {
  constructor(private readonly repo: ISettingsRepository) {}

  async execute(): Promise<Setting[]> {
    return this.repo.findAll()
  }
}
