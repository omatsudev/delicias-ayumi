import { useState, useEffect, useRef } from 'react'
import { Search, MessageCircle, Leaf, Truck, Package } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { supabase } from '@/lib/supabase'
import { SupabaseProductRepository } from '@/lib/infrastructure/repositories/SupabaseProductRepository'
import { GetProductsUseCase } from '@/lib/application/use-cases/GetProductsUseCase'
import type { Product } from '@/lib/domain/entities/Product'
import type { ProductCategory } from '@/lib/domain/enums/ProductCategory'
import { ProductCard } from '@/components/storefront/ProductCard'
import { Button } from '@/components/ui/Button'

const CATEGORIES: ('Tudo' | ProductCategory)[] = ['Tudo', 'Bolos', 'Tortas', 'Empadões']

function HeroEditorial({ onShopClick, waNumber, paragraph }: {
  onShopClick: () => void
  waNumber: string
  paragraph: string
}) {
  return (
    <section className="py-8 md:py-24 px-5 md:px-12 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-10 md:gap-12 items-center">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: 'oklch(var(--c-primary))' }}
            >
              FEITO À MÃO EM PETRÓPOLIS
            </span>
            <div className="flex-1 h-px max-w-12" style={{ background: 'oklch(var(--c-primary))' }} />
          </div>

          <h1
            className="font-display leading-[0.98]"
            style={{ fontSize: 'clamp(30px, 9vw, 84px)', fontWeight: 500, letterSpacing: '-0.025em' }}
          >
            Bolos, tortas
            <br />
            <em
              className="font-script not-italic"
              style={{
                color: 'oklch(var(--c-primary))',
                fontWeight: 700,
                display: 'inline-block',
                transform: 'rotate(-2deg)',
                transformOrigin: 'left center',
                lineHeight: 0.9,
                padding: '0.1em 0',
              }}
            >
              e empadões
            </em>
            <br />
            <span style={{ color: 'oklch(var(--c-fg-soft))' }}>de família.</span>
          </h1>

          <p className="text-base md:text-lg max-w-lg leading-relaxed" style={{ color: 'oklch(var(--c-fg-soft))' }}>
            {paragraph}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" variant="primary" onClick={onShopClick} className="w-full sm:w-auto">
              Ver cardápio
            </Button>
            <a
              href={`https://wa.me/${waNumber}?text=Olá! Gostaria de fazer uma encomenda.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="lg" variant="ghost" className="w-full">
                <MessageCircle size={18} />
                Encomendar pelo WhatsApp
              </Button>
            </a>
          </div>

          <div className="flex gap-6 sm:gap-8 pt-2 flex-wrap">
            {[
              { value: '5+', label: 'anos no forno', color: 'oklch(var(--c-primary))' },
              { value: '+100', label: 'clientes em Petrópolis', color: 'oklch(var(--c-accent))' },
              { value: '100%', label: 'ingredientes naturais', color: 'oklch(var(--c-primary))' },
            ].map((kpi) => (
              <div key={kpi.label} className="flex flex-col">
                <span className="font-display text-2xl font-semibold" style={{ color: kpi.color }}>
                  {kpi.value}
                </span>
                <span className="text-xs" style={{ color: 'oklch(var(--c-fg-muted))' }}>
                  {kpi.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero image — hidden on mobile */}
        <div className="relative hidden md:block" style={{ aspectRatio: '4/5' }}>
          <div
            className="absolute inset-0 rounded-[40px]"
            style={{
              background: 'oklch(var(--c-primary-soft))',
              transform: 'rotate(-2.5deg) translate(10px, 10px)',
            }}
          />
          <div className="absolute inset-0 rounded-[40px] overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80"
              alt="Delicias Ayumi"
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="absolute -bottom-4 -left-4 rounded-2xl shadow-lg p-4 flex items-center gap-3"
            style={{ background: 'oklch(var(--c-surface))' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'oklch(var(--c-accent-soft))', color: 'oklch(var(--c-accent))' }}
            >
              ★
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'oklch(var(--c-fg))' }}>
                4.9 · 312 avaliações
              </p>
              <p className="text-xs" style={{ color: 'oklch(var(--c-fg-muted))' }}>
                Google · Instagram
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustBand() {
  return (
    <section className="border-y" style={{ borderColor: 'oklch(var(--c-line-soft))', background: 'oklch(var(--c-surface))' }}>
      <div className="max-w-7xl mx-auto px-5 md:px-12 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Leaf size={16} />, title: 'Sem conservantes', sub: 'Ingredientes frescos' },
          { icon: <Truck size={16} />, title: 'Entrega em Petrópolis', sub: 'Quarta e sábado' },
          { icon: <Package size={16} />, title: 'Retirada no ateliê', sub: 'Corrêas · sem taxa' },
          { icon: <MessageCircle size={16} />, title: 'Atendimento humano', sub: 'WhatsApp direto' },
        ].map((item) => (
          <div key={item.title} className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'oklch(var(--c-bg))', color: 'oklch(var(--c-primary))' }}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight" style={{ color: 'oklch(var(--c-fg))' }}>
                {item.title}
              </p>
              <p className="text-xs" style={{ color: 'oklch(var(--c-fg-muted))' }}>
                {item.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function EncomendaSection() {
  return (
    <section id="encomendas" className="border-y" style={{ borderColor: 'oklch(var(--c-line-soft))', background: 'oklch(var(--c-surface))' }}>
      <div className="max-w-7xl mx-auto px-5 md:px-12 py-10 md:py-20">
        <div className="mb-8 md:text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'oklch(var(--c-primary))' }}>
            COMO FUNCIONA
          </p>
          <h2 className="text-h2-fluid font-display font-semibold" style={{ color: 'oklch(var(--c-fg))' }}>
            Da nossa cozinha pra sua mesa
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { n: '01', t: 'Escolha', d: 'Monte sua encomenda com pelo menos 48h de antecedência.' },
            { n: '02', t: 'Pague', d: '50% de sinal ao confirmar. Restante na entrega. Pix, cartão ou dinheiro.' },
            { n: '03', t: 'Preparamos', d: 'Tudo feito do zero no nosso ateliê.' },
            { n: '04', t: 'Chega aí', d: 'Entrega em Petrópolis ou retirada no ateliê.' },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-2xl p-4 md:p-6 border"
              style={{ background: 'oklch(var(--c-bg))', borderColor: 'oklch(var(--c-line-soft))' }}
            >
              <div
                className="font-display text-3xl md:text-4xl font-semibold leading-none mb-3"
                style={{ color: 'oklch(var(--c-primary))', letterSpacing: '-0.02em' }}
              >
                {s.n}
              </div>
              <h4 className="font-display text-lg md:text-xl font-semibold mb-1.5" style={{ color: 'oklch(var(--c-fg))' }}>
                {s.t}
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(var(--c-fg-soft))' }}>
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  const settings = useSettings()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<'Tudo' | ProductCategory>('Tudo')
  const menuRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const repo = new SupabaseProductRepository(supabase)
    new GetProductsUseCase(repo).execute()
      .then(setProducts)
      .catch((err) => console.error('Erro ao carregar produtos:', err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === 'Tudo' || p.category === activeCategory
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const scrollToMenu = () => menuRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <HeroEditorial
        onShopClick={scrollToMenu}
        waNumber={settings['contato.whatsapp']}
        paragraph={settings['hero.paragrafo']}
      />

      <TrustBand />

      {/* Cardápio */}
      <section ref={menuRef} id="menu" className="py-10 md:py-16 px-5 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 md:gap-4 mb-5 md:mb-6">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'oklch(var(--c-primary))' }}>
              CARDÁPIO
            </p>
            <h2 className="text-h2-fluid font-display font-semibold" style={{ color: 'oklch(var(--c-fg))' }}>
              O que está saindo do forno
            </h2>
            <p className="text-xs md:text-sm mt-1" style={{ color: 'oklch(var(--c-fg-muted))' }}>
              Encomendas com 48h de antecedência. Preços por unidade inteira.
            </p>
          </div>
          <div
            className="flex items-center gap-2 rounded-full border px-4 py-2.5 w-full sm:w-56 shrink-0"
            style={{ borderColor: 'oklch(var(--c-line))', background: 'oklch(var(--c-surface))' }}
          >
            <Search size={13} style={{ color: 'oklch(var(--c-fg-muted))' }} />
            <input
              type="text"
              placeholder="Buscar…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent flex-1 text-sm outline-none placeholder:text-[oklch(var(--c-fg-muted))]"
              style={{ color: 'oklch(var(--c-fg))' }}
            />
          </div>
        </div>

        {/* Category chips — horizontal scroll on mobile */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 whitespace-nowrap shrink-0"
              style={
                activeCategory === cat
                  ? { background: 'oklch(var(--c-fg))', color: 'oklch(var(--c-bg))' }
                  : { background: 'oklch(var(--c-surface))', color: 'oklch(var(--c-fg-soft))', border: '1px solid oklch(var(--c-line))' }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: 'oklch(var(--c-surface-2))' }}>
                <div className="aspect-[4/3]" />
                <div className="p-3 flex flex-col gap-2">
                  <div className="h-4 rounded w-3/4" style={{ background: 'oklch(var(--c-line))' }} />
                  <div className="h-3 rounded w-full" style={{ background: 'oklch(var(--c-line-soft))' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg font-display" style={{ color: 'oklch(var(--c-fg-soft))' }}>Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((p) => (
              <div key={p.id} className="animate-fade-up">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      <EncomendaSection />

      {/* Sobre */}
      <section id="sobre" className="py-10 md:py-20 px-5 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-[1fr_1.1fr] gap-8 md:gap-16 items-center">
          <div
            className="aspect-[5/6] rounded-[32px] overflow-hidden hidden md:block"
            style={{ background: 'oklch(var(--c-surface-2))' }}
          >
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80"
              alt="Ayumi no ateliê"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(var(--c-primary))' }}>
              QUEM FAZ
            </p>
            <h2
              className="font-display font-semibold mb-4 leading-tight"
              style={{ fontSize: 'clamp(26px, 5vw, 48px)', color: 'oklch(var(--c-fg))' }}
            >
              {settings['sobre.titulo']}
            </h2>
            <p className="text-base md:text-lg leading-relaxed mb-6" style={{ color: 'oklch(var(--c-fg-soft))' }}>
              {settings['sobre.texto']}
            </p>
            <div className="flex flex-row flex-wrap gap-3">
              <a className="inline-flex" href={`https://instagram.com/${settings['contato.instagram']}`} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost">@{settings['contato.instagram']}</Button>
              </a>
              <a className="inline-flex" href={`https://wa.me/${settings['contato.whatsapp']}`} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost">
                  <MessageCircle size={16} />
                  {settings['contato.whatsapp'].replace(/^55(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
