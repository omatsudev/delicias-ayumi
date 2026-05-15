import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import type { Product } from "../../domain/types";
import { ProductImage } from "../ui/ProductImage";
import { Tag } from "../ui/Tag";
import { Button } from "../ui/Button";
import { brl } from "../../lib/utils";
import { useCartStore } from "../../store/cart";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const isOutOfStock = product.stock === 0;

  return (
    <div
      className="group rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      style={{
        background: "oklch(var(--c-surface))",
        borderColor: "oklch(var(--c-line-soft))",
      }}
    >
      <Link to={`/produto/${product.slug}`} className="block relative">
        <ProductImage
          imageUrl={product.image_url}
          name={product.name}
          category={product.category}
          swatch={product.swatch}
          aspectRatio="4/3"
          className="rounded-none"
        />
        {product.tags[0] && (
          <div className="absolute top-3 left-3">
            <Tag tone="primary">{product.tags[0]}</Tag>
          </div>
        )}
        {isOutOfStock && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.35)" }}
          >
            <Tag tone="neutral" className="bg-white/90 text-gray-700 text-sm px-4 py-1.5">
              Esgotado
            </Tag>
          </div>
        )}
      </Link>

      <div className="p-4">
        <Link to={`/produto/${product.slug}`}>
          <h3
            className="font-display text-[22px] font-semibold leading-snug mb-1 hover:text-[oklch(var(--c-primary))] transition-colors"
            style={{ color: "oklch(var(--c-fg))" }}
          >
            {product.name}
          </h3>
        </Link>
        <p className="text-[13.5px] mb-3" style={{ color: "oklch(var(--c-fg-soft))" }}>
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-3">
          <span
            className="font-display text-2xl font-semibold"
            style={{ color: "oklch(var(--c-fg))" }}
          >
            {brl(product.price_cents)}
          </span>
          <Button
            size="sm"
            variant="primary"
            disabled={isOutOfStock}
            onClick={() => addItem(product)}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <Plus size={14} />
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
}
