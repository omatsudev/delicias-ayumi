import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, Clock, MapPin, MessageCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { SupabaseProductRepository } from '@/lib/infrastructure/repositories/SupabaseProductRepository'
import { GetProductBySlugUseCase } from '@/lib/application/use-cases/GetProductBySlugUseCase'
import { GetProductsUseCase } from '@/lib/application/use-cases/GetProductsUseCase'
import type { Product } from '@/lib/domain/entities/Product'
import { ProductImage } from '@/components/ui/ProductImage'
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/storefront/ProductCard'
import { brl } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

const WA_NUMBER = '5524988880000'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)

  const addItem = useCartStore((s) => s.addItem)
  const updateQty = useCartStore((s) => s.updateQty)
  const cartItems = useCartStore((s) => s.items)
  const itemInCart = cartItems.find((i) => i.product.slug === slug)

  useEffect(() => {
    if (!slug) return
    const repo = new SupabaseProductRepository(supabase)
    new GetProductBySlugUseCase(repo).execute(slug).then((data) => {
      setProduct(data)
      if (data) {
        new GetProductsUseCase(repo).execute(data.category).then((rel) =>
          setRelated(rel.filter((p) => p.id !== data.id).slice(0, 4))
        )
      }
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 animate-pulse">
        <div className="h-8 w-32 rounded mb-8" style={{ background: 'oklch(var(--c-surface-2))' }} />
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square rounded-2xl" style={{ background: 'oklch(var(--c-surface-2))' }} />
          <div className="flex flex-col gap-4">
            <div className="h-6 rounded w-1/3" style={{ background: 'oklch(var(--c-surface-2))' }} />
            <div className="h-12 rounded w-full" style={{ background: 'oklch(var(--c-surface-2))' }} />
            <div className="h-20 rounded" style={{ background: 'oklch(var(--c-surface-2))' }} />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <p className="text-lg font-display" style={{ color: 'oklch(var(--c-fg-soft))' }}>
          Produto não encontrado.
        </p>
        <Link to="/"><Button className="mt-4" variant="ghost">Voltar ao cardápio</Button></Link>
      </div>
    )
  }

  const isOutOfStock = product.stock === 0

  const handleAddToCart = () => {
    if (itemInCart) {
      updateQty(product.id, itemInCart.qty + qty)
    } else {
      for (let i = 0; i < qty; i++) addItem(product)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
      <Link
        to="/#menu"
        className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity"
        style={{ color: 'oklch(var(--c-fg-soft))' }}
      >
        <ArrowLeft size={16} />
        Voltar ao cardápio
      </Link>

      <div className="grid md:grid-cols-[1.1fr_1fr] gap-12">
        <div className="flex flex-col gap-3">
          <ProductImage
            imageUrl={product.imageUrl}
            name={product.name}
            category={product.category}
            swatch={product.swatch}
            aspectRatio="1/1"
          />
          {product.galleryUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {product.galleryUrls.slice(0, 3).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`${product.name} ${i + 1}`}
                  className="w-full aspect-square object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex gap-2 flex-wrap">
            <Tag tone="neutral">{product.category}</Tag>
            {product.tags.map((t) => (
              <Tag key={t} tone="primary">{t}</Tag>
            ))}
          </div>

          <div>
            <h1
              className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-2"
              style={{ color: 'oklch(var(--c-fg))' }}
            >
              {product.name}
            </h1>
            <p className="text-base" style={{ color: 'oklch(var(--c-fg-soft))' }}>
              {product.description}
            </p>
          </div>

          <div>
            <span className="font-display text-4xl font-semibold" style={{ color: 'oklch(var(--c-fg))' }}>
              {brl(product.priceCents)}
            </span>
            <span className="text-sm ml-2" style={{ color: 'oklch(var(--c-fg-muted))' }}>
              {product.sizeLabel}
            </span>
          </div>

          {!isOutOfStock ? (
            <div className="flex items-center gap-4">
              <div
                className="flex items-center rounded-xl border overflow-hidden"
                style={{ borderColor: 'oklch(var(--c-line))' }}
              >
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 hover:bg-[oklch(var(--c-surface-2))] transition-colors"
                  aria-label="Diminuir quantidade"
                >
                  <Minus size={14} style={{ color: 'oklch(var(--c-fg))' }} />
                </button>
                <span
                  className="px-4 py-3 text-sm font-semibold min-w-[2rem] text-center"
                  style={{ color: 'oklch(var(--c-fg))' }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-3 hover:bg-[oklch(var(--c-surface-2))] transition-colors"
                  aria-label="Aumentar quantidade"
                >
                  <Plus size={14} style={{ color: 'oklch(var(--c-fg))' }} />
                </button>
              </div>
              <Button size="lg" variant="primary" className="flex-1" onClick={handleAddToCart}>
                Adicionar à sacola · {brl(product.priceCents * qty)}
              </Button>
            </div>
          ) : (
            <div
              className="rounded-xl p-4 text-center border"
              style={{
                background: 'oklch(var(--c-surface-2))',
                borderColor: 'oklch(var(--c-line))',
                color: 'oklch(var(--c-fg-soft))',
              }}
            >
              <p className="font-medium">Produto esgotado</p>
              <p className="text-sm mt-1">Entre em contato para saber quando terá novidades.</p>
            </div>
          )}

          <a
            href={`https://wa.me/${WA_NUMBER}?text=Olá! Tenho interesse no produto: ${product.name} (${brl(product.priceCents)})`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" className="w-full">
              <MessageCircle size={16} />
              Tirar dúvidas pelo WhatsApp
            </Button>
          </a>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-4 flex flex-col gap-1" style={{ background: 'oklch(var(--c-surface-2))' }}>
              <div className="flex items-center gap-2">
                <Clock size={14} style={{ color: 'oklch(var(--c-primary))' }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'oklch(var(--c-primary))' }}>
                  Preparo
                </span>
              </div>
              <p className="text-sm font-medium" style={{ color: 'oklch(var(--c-fg))' }}>48h de antecedência</p>
              <p className="text-xs" style={{ color: 'oklch(var(--c-fg-muted))' }}>Feito sob encomenda</p>
            </div>
            <div className="rounded-xl p-4 flex flex-col gap-1" style={{ background: 'oklch(var(--c-surface-2))' }}>
              <div className="flex items-center gap-2">
                <MapPin size={14} style={{ color: 'oklch(var(--c-primary))' }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'oklch(var(--c-primary))' }}>
                  Entrega
                </span>
              </div>
              <p className="text-sm font-medium" style={{ color: 'oklch(var(--c-fg))' }}>Petrópolis/RJ</p>
              <p className="text-xs" style={{ color: 'oklch(var(--c-fg-muted))' }}>Ou retire na Mosela</p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2
            className="font-display text-3xl font-semibold mb-8"
            style={{ color: 'oklch(var(--c-fg))' }}
          >
            Da mesma categoria
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
