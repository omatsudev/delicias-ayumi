import type { INeighborhoodRepository } from '@/lib/domain/interfaces/INeighborhoodRepository'
import type { Neighborhood } from '@/lib/domain/entities/Neighborhood'

export class GetNeighborhoodsUseCase {
  constructor(private readonly neighborhoods: INeighborhoodRepository) {}

  async execute(): Promise<Neighborhood[]> {
    return this.neighborhoods.findAll()
  }
}
