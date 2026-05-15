import type { ProductCategory } from '@/lib/domain/enums/ProductCategory'

export interface Product {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly category: ProductCategory
  readonly description: string
  readonly sizeLabel: string
  readonly priceCents: number
  readonly costCents: number
  readonly stock: number
  readonly active: boolean
  readonly tags: string[]
  readonly swatch: string[]
  readonly imageUrl: string | null
  readonly galleryUrls: string[]
  readonly createdAt: string
  readonly updatedAt: string
}

export interface CreateProductInput {
  slug: string
  name: string
  category: ProductCategory
  description: string
  sizeLabel: string
  priceCents: number
  costCents: number
  stock: number
  active: boolean
  tags: string[]
  swatch: string[]
  imageUrl?: string | null
  galleryUrls?: string[]
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string
}
