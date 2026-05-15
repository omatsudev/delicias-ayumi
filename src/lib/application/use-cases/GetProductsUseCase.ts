import type { IProductRepository } from '@/lib/domain/interfaces/IProductRepository'
import type { Product } from '@/lib/domain/entities/Product'
import type { ProductCategory } from '@/lib/domain/enums/ProductCategory'

export class GetProductsUseCase {
  constructor(private readonly products: IProductRepository) {}

  async execute(category?: ProductCategory): Promise<Product[]> {
    return this.products.findAll(category)
  }
}
