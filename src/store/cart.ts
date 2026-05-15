import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/lib/domain/entities/Cart'
import type { Product } from '@/lib/domain/entities/Product'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearCart: () => void
  subtotal: () => number
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(product) {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { product, qty: 1 }] }
        })
      },

      removeItem(productId) {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }))
      },

      updateQty(productId, qty) {
        if (qty <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, qty } : i
          ),
        }))
      },

      clearCart() {
        set({ items: [] })
      },

      subtotal() {
        return get().items.reduce((acc, i) => acc + i.product.priceCents * i.qty, 0)
      },

      total() {
        return get().subtotal()
      },

      itemCount() {
        return get().items.reduce((acc, i) => acc + i.qty, 0)
      },
    }),
    { name: 'delicias-ayumi:cart' }
  )
)
