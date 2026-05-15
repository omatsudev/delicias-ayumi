import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { ProductImage } from '@/components/ui/ProductImage'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { brl } from '@/lib/utils'

export function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCartStore()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto mb-4" style={{ color: 'oklch(var(--c-fg-muted))' }} />
        <h2 className="font-display text-3xl font-semibold mb-2" style={{ color: 'oklch(var(--c-fg))' }}>
          Sua sacola está vazia
        </h2>
        <p className="text-sm mb-6" style={{ color: 'oklch(var(--c-fg-soft))' }}>
          Adicione produtos do nosso cardápio para começar.
        </p>
        <Link to="/#menu">
          <Button variant="primary" size="lg">Ver cardápio</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
      <Link
        to="/#menu"
        className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity"
        style={{ color: 'oklch(var(--c-fg-soft))' }}
      >
        <ArrowLeft size={16} />
        Continuar comprando
      </Link>

      <h1 className="font-display text-4xl font-semibold mb-8" style={{ color: 'oklch(var(--c-fg))' }}>
        Minha sacola
      </h1>

      <div className="grid md:grid-cols-[1.5fr_1fr] gap-8 items-start">
        <div className="flex flex-col gap-4">
          {items.map(({ product, qty }) => (
            <Card key={product.id} className="p-4 flex gap-4 items-center">
              <Link to={`/produto/${product.slug}`} className="shrink-0">
                <ProductImage
                  imageUrl={product.imageUrl}
                  name={product.name}
                  category={product.category}
                  swatch={product.swatch}
                  aspectRatio="1/1"
                  className="w-24 h-24 rounded-xl"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/produto/${product.slug}`}>
                  <p
                    className="font-semibold text-sm hover:text-[oklch(var(--c-primary))] transition-colors"
                    style={{ color: 'oklch(var(--c-fg))' }}
                  >
                    {product.name}
                  </p>
                </Link>
                <p className="text-xs mt-0.5" style={{ color: 'oklch(var(--c-fg-muted))' }}>
                  {product.sizeLabel}
                </p>
                <p className="font-display text-lg font-semibold mt-1" style={{ color: 'oklch(var(--c-fg))' }}>
                  {brl(product.priceCents * qty)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className="flex items-center rounded-lg border overflow-hidden"
                  style={{ borderColor: 'oklch(var(--c-line))' }}
                >
                  <button
                    onClick={() => updateQty(product.id, qty - 1)}
                    className="p-2 hover:bg-[oklch(var(--c-surface-2))] transition-colors"
                    aria-label="Diminuir"
                  >
                    <Minus size={12} style={{ color: 'oklch(var(--c-fg))' }} />
                  </button>
                  <span className="px-3 text-sm font-semibold" style={{ color: 'oklch(var(--c-fg))' }}>
                    {qty}
                  </span>
                  <button
                    onClick={() => updateQty(product.id, qty + 1)}
                    className="p-2 hover:bg-[oklch(var(--c-surface-2))] transition-colors"
                    aria-label="Aumentar"
                  >
                    <Plus size={12} style={{ color: 'oklch(var(--c-fg))' }} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(product.id)}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  aria-label="Remover item"
                >
                  <Trash2 size={14} style={{ color: 'oklch(var(--c-danger))' }} />
                </button>
              </div>
            </Card>
          ))}
        </div>

        <div className="md:sticky md:top-24">
          <Card className="p-5">
            <h2 className="font-semibold mb-4" style={{ color: 'oklch(var(--c-fg))' }}>
              Resumo do pedido
            </h2>
            <div className="flex flex-col gap-3 mb-4">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span style={{ color: 'oklch(var(--c-fg-soft))' }}>
                    {product.name} × {qty}
                  </span>
                  <span style={{ color: 'oklch(var(--c-fg))' }}>
                    {brl(product.priceCents * qty)}
                  </span>
                </div>
              ))}
              <div
                className="border-t pt-3 flex justify-between font-semibold"
                style={{ borderColor: 'oklch(var(--c-line-soft))' }}
              >
                <span style={{ color: 'oklch(var(--c-fg-soft))' }}>Subtotal</span>
                <span className="font-display text-xl" style={{ color: 'oklch(var(--c-fg))' }}>
                  {brl(subtotal())}
                </span>
              </div>
              <p className="text-xs" style={{ color: 'oklch(var(--c-fg-muted))' }}>
                Taxa de entrega calculada no checkout
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => navigate('/checkout')}
            >
              Finalizar pedido
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
