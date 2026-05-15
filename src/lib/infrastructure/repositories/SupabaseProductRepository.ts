import type { SupabaseClient } from '@supabase/supabase-js'
import type { IProductRepository } from '@/lib/domain/interfaces/IProductRepository'
import type { Product, CreateProductInput, UpdateProductInput } from '@/lib/domain/entities/Product'
import type { ProductCategory } from '@/lib/domain/enums/ProductCategory'

type DbRow = {
  id: string
  slug: string
  name: string
  category: string
  description: string
  size_label: string
  price_cents: number
  cost_cents: number
  stock: number
  active: boolean
  tags: string[]
  swatch: string[]
  image_url: string | null
  gallery_urls: string[]
  created_at: string
  updated_at: string
}

function toEntity(row: DbRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as ProductCategory,
    description: row.description,
    sizeLabel: row.size_label,
    priceCents: row.price_cents,
    costCents: row.cost_cents,
    stock: row.stock,
    active: row.active,
    tags: row.tags ?? [],
    swatch: row.swatch ?? [],
    imageUrl: row.image_url,
    galleryUrls: row.gallery_urls ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export class SupabaseProductRepository implements IProductRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findAll(category?: ProductCategory): Promise<Product[]> {
    let query = this.supabase
      .from('ayumi_products')
      .select('*')
      .eq('active', true)
      .order('name')

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error) throw error
    return (data as DbRow[]).map(toEntity)
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('ayumi_products')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) return null
    return toEntity(data as DbRow)
  }

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('ayumi_products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return toEntity(data as DbRow)
  }

  async create(input: CreateProductInput): Promise<Product> {
    const { data, error } = await this.supabase
      .from('ayumi_products')
      .insert({
        slug: input.slug,
        name: input.name,
        category: input.category,
        description: input.description,
        size_label: input.sizeLabel,
        price_cents: input.priceCents,
        cost_cents: input.costCents,
        stock: input.stock,
        active: input.active,
        tags: input.tags,
        swatch: input.swatch,
        image_url: input.imageUrl ?? null,
        gallery_urls: input.galleryUrls ?? [],
      })
      .select()
      .single()

    if (error) throw error
    return toEntity(data as DbRow)
  }

  async update(input: UpdateProductInput): Promise<Product> {
    const { id, ...rest } = input
    const payload: Record<string, unknown> = {}
    if (rest.slug !== undefined) payload['slug'] = rest.slug
    if (rest.name !== undefined) payload['name'] = rest.name
    if (rest.category !== undefined) payload['category'] = rest.category
    if (rest.description !== undefined) payload['description'] = rest.description
    if (rest.sizeLabel !== undefined) payload['size_label'] = rest.sizeLabel
    if (rest.priceCents !== undefined) payload['price_cents'] = rest.priceCents
    if (rest.costCents !== undefined) payload['cost_cents'] = rest.costCents
    if (rest.stock !== undefined) payload['stock'] = rest.stock
    if (rest.active !== undefined) payload['active'] = rest.active
    if (rest.tags !== undefined) payload['tags'] = rest.tags
    if (rest.swatch !== undefined) payload['swatch'] = rest.swatch
    if (rest.imageUrl !== undefined) payload['image_url'] = rest.imageUrl
    if (rest.galleryUrls !== undefined) payload['gallery_urls'] = rest.galleryUrls

    const { data, error } = await this.supabase
      .from('ayumi_products')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return toEntity(data as DbRow)
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('ayumi_products')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
