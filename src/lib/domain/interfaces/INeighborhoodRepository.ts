import type { Neighborhood } from '@/lib/domain/entities/Neighborhood'

export interface INeighborhoodRepository {
  findAll(): Promise<Neighborhood[]>
}
