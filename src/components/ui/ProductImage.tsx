import { cn } from "../../lib/utils";
import type { ProductCategory } from "../../domain/types";

interface ProductImageProps {
  imageUrl?: string | null;
  name: string;
  category: ProductCategory;
  swatch?: string[];
  className?: string;
  aspectRatio?: "4/3" | "1/1";
}

export function ProductImage({
  imageUrl,
  name,
  category,
  swatch = [],
  className,
  aspectRatio = "4/3",
}: ProductImageProps) {
  const aspect = aspectRatio === "4/3" ? "aspect-[4/3]" : "aspect-square";

  if (imageUrl) {
    return (
      <div className={cn("overflow-hidden rounded-xl", aspect, className)}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  const [c1 = "#f4a261", c2 = "#a0522d", c3 = "#fff3d6"] = swatch;

  return (
    <div
      className={cn("overflow-hidden rounded-xl flex items-end justify-center relative", aspect, className)}
      style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c3} 60%, ${c2} 100%)` }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
        <span className="text-white/80 text-3xl">
          {category === "Bolos" ? "🎂" : category === "Tortas" ? "🥧" : "🥧"}
        </span>
        <span
          className="text-center text-sm font-medium leading-snug px-2"
          style={{ color: "rgba(255,255,255,0.9)", textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
        >
          {name}
        </span>
      </div>
    </div>
  );
}
