import type { IProductRepository } from '@/lib/domain/interfaces/IProductRepository'
import type { Product } from '@/lib/domain/entities/Product'

export class GetProductBySlugUseCase {
  constructor(private readonly products: IProductRepository) {}

  async execute(slug: string): Promise<Product | null> {
    return this.products.findBySlug(slug)
  }
}
