import { useState, useEffect } from "react";
import { Search, MessageCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import type { Product, ProductCategory } from "../../domain/types";
import { ProductCard } from "../../components/storefront/ProductCard";
import { Button } from "../../components/ui/Button";

const CATEGORIES: ("Tudo" | ProductCategory)[] = ["Tudo", "Bolos", "Tortas", "Empadões"];
const WA_NUMBER = "5524988880000";

function HeroEditorial({ onShopClick }: { onShopClick: () => void }) {

  return (
    <section
      className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto"
      style={{ color: "oklch(var(--c-fg))" }}
    >
      <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        {/* Esquerda */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "oklch(var(--c-primary))" }}
            >
              FEITO À MÃO EM PETRÓPOLIS
            </span>
            <div
              className="flex-1 h-px max-w-12"
              style={{ background: "oklch(var(--c-primary))" }}
            />
          </div>

          <h1 className="text-h1-fluid font-display font-semibold leading-[1.05]">
            Sabores que{" "}
            <em className="font-script not-italic" style={{ color: "oklch(var(--c-primary))" }}>
              encantam
            </em>{" "}
            e histórias que
            <br className="hidden md:block" /> nutrem a alma
          </h1>

          <p className="text-base md:text-lg max-w-lg" style={{ color: "oklch(var(--c-fg-soft))" }}>
            Bolos, tortas e empadões artesanais feitos com ingredientes selecionados da serra.
            Cada encomenda é preparada com carinho para o seu momento especial.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" variant="primary" onClick={onShopClick}>
              Ver cardápio
            </Button>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=Olá! Gostaria de fazer uma encomenda.`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="ghost">
                <MessageCircle size={18} />
                Encomendar pelo WhatsApp
              </Button>
            </a>
          </div>

          <div className="flex gap-8 pt-2">
            {[
              { value: "5+", label: "Anos de experiência" },
              { value: "+100", label: "Clientes satisfeitos" },
              { value: "100%", label: "Ingredientes naturais" },
            ].map((kpi) => (
              <div key={kpi.label} className="flex flex-col">
                <span
                  className="font-display text-2xl font-semibold"
                  style={{ color: "oklch(var(--c-primary))" }}
                >
                  {kpi.value}
                </span>
                <span className="text-xs" style={{ color: "oklch(var(--c-fg-muted))" }}>
                  {kpi.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Direita */}
        <div className="relative hidden md:block">
          <div
            className="aspect-square rounded-[40px] flex items-center justify-center"
            style={{ background: "oklch(var(--c-surface-2))" }}
          >
            <div className="text-center p-12">
              <p
                className="font-script text-5xl mb-4"
                style={{ color: "oklch(var(--c-primary))" }}
              >
                Delicias Ayumi
              </p>
              <p className="text-sm" style={{ color: "oklch(var(--c-fg-soft))" }}>
                Adicione fotos reais dos produtos aqui
              </p>
            </div>
          </div>

          {/* Card flutuante */}
          <div
            className="absolute -bottom-4 -left-4 rounded-2xl shadow-lg p-4 flex items-center gap-3"
            style={{ background: "oklch(var(--c-surface))" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-base"
              style={{ background: "oklch(var(--c-accent))" }}
            >
              ★
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "oklch(var(--c-fg))" }}>
                4,9 no Google
              </p>
              <p className="text-xs" style={{ color: "oklch(var(--c-fg-muted))" }}>
                +47 avaliações
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"Tudo" | ProductCategory>("Tudo");

  useEffect(() => {
    supabase
      .from("ayumi_products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProducts(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === "Tudo" || p.category === activeCategory;
    const matchesSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <HeroEditorial onShopClick={scrollToMenu} />

      {/* Seção cardápio */}
      <section id="menu" className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Header da seção */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-1"
              style={{ color: "oklch(var(--c-primary))" }}
            >
              NOSSO CARDÁPIO
            </p>
            <h2 className="text-h2-fluid font-display font-semibold" style={{ color: "oklch(var(--c-fg))" }}>
              Feito com amor
            </h2>
          </div>

          {/* Busca */}
          <div
            className="flex items-center gap-2 rounded-full border px-4 py-2 w-full sm:w-60"
            style={{
              borderColor: "oklch(var(--c-line))",
              background: "oklch(var(--c-surface))",
            }}
          >
            <Search size={14} style={{ color: "oklch(var(--c-fg-muted))" }} />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent flex-1 text-sm outline-none placeholder:text-[oklch(var(--c-fg-muted))]"
              style={{ color: "oklch(var(--c-fg))" }}
            />
          </div>
        </div>

        {/* Filtros de categoria */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150"
              style={
                activeCategory === cat
                  ? {
                      background: "oklch(var(--c-fg))",
                      color: "oklch(var(--c-bg))",
                    }
                  : {
                      background: "oklch(var(--c-surface))",
                      color: "oklch(var(--c-fg-soft))",
                      border: "1px solid oklch(var(--c-line))",
                    }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de produtos */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden animate-pulse"
                style={{ background: "oklch(var(--c-surface-2))" }}
              >
                <div className="aspect-[4/3]" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-5 rounded w-3/4" style={{ background: "oklch(var(--c-line))" }} />
                  <div className="h-3 rounded w-full" style={{ background: "oklch(var(--c-line-soft))" }} />
                  <div className="h-3 rounded w-2/3" style={{ background: "oklch(var(--c-line-soft))" }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg font-display" style={{ color: "oklch(var(--c-fg-soft))" }}>
              Nenhum produto encontrado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <div key={p.id} className="animate-fade-up">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Seção sobre */}
      <section
        id="sobre"
        className="py-20 px-6 md:px-12"
        style={{ background: "oklch(var(--c-surface-2))" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "oklch(var(--c-primary))" }}
          >
            NOSSA HISTÓRIA
          </p>
          <h2
            className="text-h2-fluid font-display font-semibold mb-6"
            style={{ color: "oklch(var(--c-fg))" }}
          >
            Sabores que contam histórias
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "oklch(var(--c-fg-soft))" }}>
            Nascida em Petrópolis/RJ, a Delicias Ayumi nasceu do amor pela confeitaria artesanal.
            Cada receita carrega memórias afetivas e ingredientes cuidadosamente selecionados da
            nossa querida Serra Fluminense. Trabalhamos com encomendas para garantir que cada
            produto chegue fresco e perfeito para o seu momento especial.
          </p>
        </div>
      </section>

      {/* Seção contato/CTA */}
      <section id="contato" className="py-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: "oklch(var(--c-primary))" }}
        >
          VAMOS CONVERSAR
        </p>
        <h2
          className="text-h2-fluid font-display font-semibold mb-4"
          style={{ color: "oklch(var(--c-fg))" }}
        >
          Faça sua encomenda
        </h2>
        <p className="text-lg mb-8 max-w-lg mx-auto" style={{ color: "oklch(var(--c-fg-soft))" }}>
          Entre em contato pelo WhatsApp ou faça seu pedido diretamente pelo site.
          Atendemos pedidos com 48h de antecedência.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href={`https://wa.me/${WA_NUMBER}?text=Olá! Gostaria de fazer uma encomenda.`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="primary">
              <MessageCircle size={18} />
              WhatsApp
            </Button>
          </a>
          <Button size="lg" variant="ghost" onClick={scrollToMenu}>
            Ver cardápio
          </Button>
        </div>
      </section>
    </>
  );
}
