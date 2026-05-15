import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { Product } from '@/lib/domain/entities/Product'
import { ProductImage } from '@/components/ui/ProductImage'
import { Tag } from '@/components/ui/Tag'
import { brl } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const isOutOfStock = product.stock === 0

  return (
    <div
      className="group rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col h-full"
      style={{ background: 'oklch(var(--c-surface))', borderColor: 'oklch(var(--c-line-soft))' }}
    >
      <Link to={`/produto/${product.slug}`} className="block relative">
        <ProductImage
          imageUrl={product.imageUrl}
          name={product.name}
          category={product.category}
          swatch={product.swatch}
          aspectRatio="4/3"
          className="rounded-none"
        />
        {product.tags[0] && (
          <div className="absolute top-2 left-2">
            <Tag tone="primary" className="text-[10px] px-2 py-0.5">{product.tags[0]}</Tag>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.35)' }}>
            <Tag tone="neutral" className="bg-white/90 text-gray-700 text-xs px-3 py-1">Esgotado</Tag>
          </div>
        )}
      </Link>

      <div className="p-3 md:p-4 flex flex-col flex-1">
        <Link to={`/produto/${product.slug}`}>
          <h3
            className="font-display font-semibold leading-snug mb-1 hover:text-[oklch(var(--c-primary))] transition-colors line-clamp-2"
            style={{ fontSize: 'clamp(15px, 3vw, 22px)', color: 'oklch(var(--c-fg))' }}
          >
            {product.name}
          </h3>
        </Link>
        <p className="text-sm mb-3 line-clamp-2 flex-1" style={{ color: 'oklch(var(--c-fg-soft))' }}>
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-2">
          <span className="font-display font-semibold" style={{ fontSize: 'clamp(16px, 3.5vw, 24px)', color: 'oklch(var(--c-fg))' }}>
            {brl(product.priceCents)}
          </span>
          <button
            disabled={isOutOfStock}
            onClick={() => addItem(product)}
            aria-label={`Adicionar ${product.name}`}
            className="flex items-center justify-center gap-1 rounded-xl px-2 md:px-3 py-2 text-xs font-medium transition-all disabled:opacity-50"
            style={{ background: 'oklch(var(--c-primary))', color: '#fff', minWidth: 36 }}
          >
            <Plus size={13} />
            <span className="hidden sm:inline">Adicionar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
