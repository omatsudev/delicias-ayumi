import type { Product, CreateProductInput, UpdateProductInput } from '@/lib/domain/entities/Product'
import type { ProductCategory } from '@/lib/domain/enums/ProductCategory'

export interface IProductRepository {
  findAll(category?: ProductCategory): Promise<Product[]>
  findBySlug(slug: string): Promise<Product | null>
  findById(id: string): Promise<Product | null>
  create(input: CreateProductInput): Promise<Product>
  update(input: UpdateProductInput): Promise<Product>
  remove(id: string): Promise<void>
}
