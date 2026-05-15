# Handoff — Delicias Ayumi (Petrópolis/RJ)

Site institucional + e-commerce + dashboard administrativo para a doceria
artesanal **Delicias Ayumi**, especializada em **bolos, tortas e empadões**
caseiros, com vendas inicialmente apenas para **Petrópolis/RJ**.

---

## 1. Sobre os arquivos deste pacote

Os arquivos `.html` e `.jsx` na pasta `prototype/` são **referências de design**
— protótipos em HTML/React-via-Babel criados para mostrar a aparência e o
comportamento pretendidos. **Não são código de produção** e não devem ser
copiados diretamente.

A tarefa é **reconstruir esses designs em uma codebase real**, usando frameworks
e padrões adequados para um produto comercial em produção. Veja "Stack
sugerida" abaixo.

## 2. Fidelidade

**Alta fidelidade.** Cores, tipografia, espaçamentos, hierarquia, microinterações
e copy estão finalizados. O dev deve reproduzir pixel-a-pixel usando as
ferramentas do framework escolhido.

Os placeholders de imagens dos produtos (gradientes SVG estilizados) precisam
ser substituídos por **fotos reais dos produtos** (a serem fornecidas pela
cliente).

---

## 3. Stack sugerida

Para um produto novo, sem codebase existente:

| Camada | Tecnologia | Por quê |
|---|---|---|
| Frontend | **Next.js 14 (App Router) + TypeScript** | SSR, SEO, ótima DX |
| Estilização | **Tailwind CSS + CSS variables p/ tokens** | Replica fielmente o design system do protótipo |
| Banco + Auth | **Supabase** (Postgres + Auth + Storage) | Rápido, free tier generoso, Brasil-friendly |
| Pagamentos | **Mercado Pago** (Pix + cartão) | Padrão no Brasil; Pix é essencial |
| Mensageria | **WhatsApp Business API** ou link direto `wa.me` | Atendimento humano é parte da marca |
| Imagens | **Supabase Storage** ou Cloudinary | Otimização automática |
| Deploy | **Vercel** | Integração nativa com Next.js |
| Analytics | **Plausible** ou Vercel Analytics | Privacidade-first |
| Erros | **Sentry** | Visibilidade em produção |

---

## 4. Arquitetura de telas

O protótipo tem **dois sub-aplicativos** em uma SPA. Na versão de produção,
recomendamos separar em rotas:

### Storefront público (`/`)
- `/` — Home / cardápio
- `/produto/[slug]` — Página de produto
- `/carrinho` — Sacola
- `/checkout` — Finalização
- `/pedido/[id]/confirmado` — Confirmação
- `/sobre`, `/contato` — Páginas institucionais (anchors na home no protótipo)

### Painel admin (`/admin`, autenticado)
- `/admin` — Dashboard / visão geral
- `/admin/produtos` — Lista + CRUD
- `/admin/pedidos` — Lista + status
- `/admin/caixa` — Controle financeiro
- `/admin/calculadora` — Calculadora de preço de venda

---

## 5. Design Tokens

### Cores (paleta "Ayumi" — padrão)

| Token | Valor (OKLCH) | Descrição |
|---|---|---|
| `--c-primary` | `oklch(0.62 0.22 350)` | Rosa-pink vibrante (marca) |
| `--c-primary-soft` | `oklch(0.94 0.06 350)` | Rosa muito claro (backgrounds suaves) |
| `--c-accent` | `oklch(0.7 0.14 200)` | Turquesa (acentos, sucesso) |
| `--c-accent-soft` | `oklch(0.92 0.07 200)` | Turquesa claro |
| `--c-bg` | `oklch(0.985 0.018 90)` | Creme quente (fundo) |
| `--c-surface` | `oklch(1 0.008 85)` | Branco-creme (cards) |
| `--c-surface-2` | `oklch(0.95 0.04 350)` | Rosa-creme (cards alternativos) |
| `--c-line` | `oklch(0.86 0.06 350)` | Linhas/bordas |
| `--c-line-soft` | `oklch(0.93 0.03 355)` | Linhas suaves |
| `--c-fg` | `oklch(0.28 0.06 350)` | Texto principal (vinho escuro) |
| `--c-fg-soft` | `oklch(0.46 0.06 350)` | Texto secundário |
| `--c-fg-muted` | `oklch(0.62 0.03 0)` | Texto auxiliar |
| `--c-danger` | `oklch(0.55 0.18 25)` | Erro / exclusão |
| `--c-warn` | `oklch(0.7 0.14 70)` | Aviso |

Paletas alternativas (toggle via Tweaks no protótipo): Doceria, Tropical, Serra,
Imperial, Terracota. Veja `prototype/app.jsx` para valores completos.

### Tipografia

| Uso | Família | Fallback |
|---|---|---|
| Display (títulos) | **Cormorant Garamond** | Georgia, serif |
| Script (logo, ênfases) | **Caveat** | Sacramento, cursive |
| UI / corpo | **Work Sans** | system-ui, sans-serif |
| Mono | **JetBrains Mono** | ui-monospace |

Tamanhos do display são fluidos: `clamp(46px, 6vw, 84px)` para H1 do hero.

### Espaçamento e raios

- Raios: `4 / 8 / 12 / 18 / 28 / 40 px` (`--r-xs` até `--r-2xl`)
- Padding base de cards: `20px` × `var(--space)` (densidade variável)
- Densidades: compact (0.78×), regular (1×), comfy (1.22×)

### Sombras

- `--shadow-sm`: `0 1px 2px rgba(40,30,30,0.06)`
- `--shadow-md`: `0 6px 16px -6px rgba(40,30,30,0.12)`
- `--shadow-lg`: `0 24px 48px -16px rgba(40,30,30,0.18)`

---

## 6. Modelo de dados (schema sugerido)

### `products`
```
id            uuid PK
slug          text unique
name          text
category      enum('Bolos','Tortas','Empadões')
description   text
size_label    text          -- "Serve 15 pessoas · 1,8 kg"
price_cents   integer       -- preço de venda
cost_cents    integer       -- custo (admin only)
stock         integer
active        boolean
tags          text[]        -- ["Mais pedido", "Clássico"]
swatch        jsonb         -- p/ placeholder de imagem se sem foto
image_url     text
gallery_urls  text[]
created_at    timestamptz
updated_at    timestamptz
```

### `orders`
```
id              uuid PK
order_number    text unique   -- "#2042"
customer_name   text
customer_phone  text
delivery_method enum('entrega','retirada')
bairro          text          -- só se entrega
address         text
cep             text
payment_method  enum('pix','cartao','dinheiro')
status          enum('em_producao','saiu_entrega','pronto_retirada','entregue','cancelado')
subtotal_cents  integer
fee_cents       integer
total_cents     integer
notes           text
items           jsonb         -- snapshot dos itens no momento do pedido
created_at      timestamptz
```

### `order_items` (alternativa relacional)
```
id             uuid PK
order_id       uuid FK
product_id     uuid FK
qty            integer
unit_price_cents integer
product_snapshot jsonb       -- nome, descrição etc. no momento da compra
```

### `cash_entries`
```
id          uuid PK
type        enum('in','out')
category    text             -- Vendas, Ingredientes, Embalagens, Combustível, etc.
description text
amount_cents integer
order_id    uuid FK nullable -- se for venda
created_at  timestamptz
```

### `users` (admin)
Use **Supabase Auth**. Apenas a Ayumi precisa acessar `/admin/*` no MVP — RLS
policy: permitir tudo se `auth.uid()` em tabela `admins`.

### `neighborhoods` (bairros de Petrópolis)
```
id      serial PK
name    text
fee_cents integer
km      numeric
active  boolean
```
Seed inicial (do protótipo): Centro (R$8), Quitandinha (R$10), Bingen (R$10),
Valparaíso (R$12), Corrêas (R$15), Itaipava (R$22), Cascatinha (R$12),
Mosela (R$10).

---

## 7. Telas — especificação detalhada

### 7.1. Topbar (storefront)
- **Faixa de anúncio:** rosa primário, texto branco, `12.5px`, padding `8px 16px`,
  centralizado com ícone de pin. Toggle "showAnnounce".
- **Header:** sticky top, blur backdrop, `backdrop-filter: saturate(140%) blur(12px)`,
  borda inferior `--c-line-soft`. Altura conteúdo ~72px, padding `16px 28px`.
- **Logo:** PNG circular 36px + wordmark "Delicias Ayumi" em Caveat 28px,
  cor `--c-primary`.
- **Nav:** Cardápio, Encomendas, Sobre, Contato — Work Sans 14px medium, gap 28px.
- **Botão Sacola:** background `--c-fg` (vinho escuro), texto creme, badge rosa
  com contador.

### 7.2. Hero (3 estilos selecionáveis)

**Editorial (padrão):** grid 1.05fr / 0.95fr. Esquerda: eyebrow rosa
"FEITO À MÃO EM PETRÓPOLIS" + traço, H1 em três linhas mesclando serif e cursivo,
parágrafo descritivo, 2 CTAs (primário + ghost), KPIs (5+ anos, +100 clientes,
100% naturais). Direita: imagem do produto em destaque com card flutuante de
avaliação Google.

**Split:** Background `--c-fg`, texto creme, grid de 4 imagens do produto à direita.

**Quiet:** Centralizado, sem imagem hero — apenas título + 3 imagens em grid abaixo.

### 7.3. Cardápio (`#menu`)
- Header com busca (pill 240px, ícone + input transparente) e toggle grid/lista.
- Chips de categoria (Tudo, Bolos, Tortas, Empadões) — chip ativo: fundo `--c-fg`,
  texto creme.
- Grid: `repeat(auto-fill, minmax(280px, 1fr))`, gap 24px.
- Card de produto: imagem 4:3, tag de destaque flutuante, título display 22px,
  descrição soft 13.5px, preço em display 24px, botão "Adicionar" primário sm.

### 7.4. Página do produto
- Grid 1.1fr / 1fr.
- Esquerda: imagem principal 1:1 + 3 thumbnails.
- Direita: tags, H1 48px, descrição, preço display 44px + tamanho, stepper de
  quantidade + CTA grande, 2 cards-info (preparo 48h / entrega Petrópolis),
  seção "Sobre o preparo".
- "Da mesma categoria" no rodapé.

### 7.5. Carrinho
- Grid 1.5fr / 1fr.
- Esquerda: lista de itens com imagem 100x100, nome, tamanho, stepper, remover.
- Direita (sticky top: 100): resumo com subtotal, taxa de entrega (computada por
  bairro), total em display 30px, botão CTA full.

### 7.6. Checkout
- Mesma estrutura do carrinho mas com 3 cards no lado esquerdo:
  1. **Dados** (nome, WhatsApp)
  2. **Entrega** — toggle entrega/retirada; se entrega: CEP + select de bairro
     (mostra taxa) + endereço; se retirada: card com endereço do ateliê (Mosela).
  3. **Pagamento** — 3 opções em radio-card (Pix com 5% desc / Cartão / Dinheiro)
     + textarea de observações.

### 7.7. Pedido confirmado
- Card central com ✓ verde em circle, H2, total, número do pedido, CTAs
  ("Voltar" e "Abrir WhatsApp").

### 7.8. Admin Sidebar
- Largura 240px, fundo `--c-surface`, sticky 100vh.
- Logo no topo, label "GESTÃO", 5 itens de menu (Visão geral, Produtos, Pedidos,
  Caixa, Calculadora) — item ativo: background `--c-primary-soft`, texto
  `--c-primary`.
- Card de usuário no rodapé, link "Voltar à loja".

### 7.9. Dashboard
- 4 KPI cards no topo (Stat component): Saldo de hoje, Pedidos ativos,
  Faturamento 14d, Ticket médio.
- Grid 1.5fr / 1fr:
  - Card de faturamento com gráfico de área (SVG, gradient fill, ponto final
    destacado).
  - Card "Mais vendidos" com top 4 produtos.
- Card de pedidos recentes (5 últimos) com link "Ver todos".

### 7.10. Produtos (CRUD)
- Topbar com busca + botão "Novo produto".
- Tabela: thumbnail, nome+tamanho, categoria (tag), preço, custo, margem
  (colorida por faixa: >60% accent, >40% fg, ≤40% warn), estoque (vermelho
  se <5), toggle ativo/inativo (switch custom), ações (editar/excluir).
- **Modal de formulário** (criar/editar):
  - Nome, categoria, tamanho, descrição (textarea)
  - Preço, custo, estoque
  - Card calculado: margem em display 24px
  - Seletor de paleta de imagem (10 swatches)
- **Modal de confirmação de exclusão** com botão danger.

### 7.11. Pedidos
- Tabs por status com contagem.
- Tabela: ID, cliente, bairro, itens, total, status (tag colorida), quando.

### 7.12. Controle de caixa
- 4 KPIs: Saldo hoje, Entradas hoje, Saídas hoje, Líquido semana.
- Grid 1.6fr / 1fr:
  - Gráfico de faturamento 14d.
  - Anel SVG de despesas por categoria com legendas coloridas.
- Tabela de lançamentos com ícone de entrada/saída, categoria, descrição,
  quando, valor (verde/vermelho).
- Modal "Novo lançamento": toggle entrada/saída, categoria, descrição, valor.

### 7.13. Calculadora de preço
- Grid 1.2fr / 1fr.
- **Esquerda — 3 cards de inputs:**
  1. **Ingredientes** — tabela editável (nome, qtd, unidade, R$/un, subtotal),
     botão "Adicionar". Total no rodapé do card.
  2. **Custos diretos** — embalagem, gás/energia, horas, valor/hora. Mostra
     mão de obra calculada.
  3. **Margem e taxas** — margem %, taxa de marketplace %, rendimento (un).
- **Direita (sticky) — 2 cards:**
  1. **Resultado:** card com gradient primary, "Preço sugerido" em display 64px,
     "Lucro líquido" e "Margem real".
  2. **Breakdown:** "Como chegamos lá" — listagem linha-a-linha do cálculo,
     terminando em preço final destacado.

### Fórmula do preço
```
ingredientesCost = Σ(qty × cost) por ingrediente
mãoDeObra        = hours × hourly
subtotal         = ingredientesCost + packaging + energy + mãoDeObra
perUnit          = subtotal / yield
beforeFees       = perUnit × (1 + margin / 100)
final            = beforeFees / (1 - marketplaceFee / 100)
profit           = final - perUnit - (final × marketplaceFee / 100)
marginReal       = profit / final × 100
```

---

## 8. Componentes reutilizáveis

Lista em `prototype/ui.jsx` — recriar com Tailwind + shadcn/ui ou similar:

- `Button` — variants: primary, dark, ghost, soft, link, danger | sizes: sm, md, lg | ícones via Lucide
- `Card` — base surface, hover state
- `Tag` — tones: neutral, primary, accent, danger, warn
- `Input`, `Textarea`, `Select` — labels, prefix/suffix, error/hint
- `Modal` — overlay + content card + footer
- `Stat` — KPI card com label, value display, delta, ícone
- `Logo` — imagem PNG + wordmark Caveat
- `ProductImage` — placeholder com swatch gradient + label de categoria
  (substituir pela imagem real em produção)
- `SectionTitle` — eyebrow + título display + sub
- Ícones: 30+ inline SVG no protótipo — em produção usar **lucide-react**

---

## 9. Interações e estados

- **Add to cart:** atualiza badge animado no topbar, mantém estado em zustand/context
- **Stepper de quantidade:** mínimo 1
- **Filtros de cardápio:** combinam busca + categoria
- **Toggle de ativo/inativo:** otimista, com confirmação se "vai esconder do site"
- **Excluir produto:** modal de confirmação
- **Lançamento de caixa:** atualiza KPIs imediatamente
- **Calculadora:** todos os outputs reativos aos inputs (real-time)
- **Status de pedido:** dropdown ou clique pra avançar
- **Animações:** fade-in suave (`transform: translateY(4px) → 0`) ao trocar de view,
  hover lift nos cards (`box-shadow` + `border-color`)

---

## 10. Regras de negócio

1. **Apenas Petrópolis/RJ** — validar CEP no checkout (faixa 25600–25960).
   Mostrar erro amigável se CEP fora da área.
2. **48h de antecedência** — não permitir entrega/retirada para o dia atual nem
   o seguinte. Mostrar primeiro dia disponível.
3. **Retirada:** quartas e sábados, 14h–18h, no ateliê (Mosela).
4. **Pix com 5% de desconto** — aplicar no total se método = Pix.
5. **Estoque:** decrementar ao confirmar pedido; produto com `stock = 0` aparece
   como "Esgotado" e não pode ser adicionado.
6. **Numeração de pedidos:** sequencial começando em #2042 (continuar onde o
   protótipo parou).

---

## 11. Integrações

### Mercado Pago (Pix + cartão)
- Criar conta dev: https://www.mercadopago.com.br/developers
- Usar SDK oficial `mercadopago` no backend
- Webhook para confirmar pagamento → atualizar status do pedido

### WhatsApp
- Botão "Encomendar pelo WhatsApp" → link `wa.me/5524988880000?text=...` com
  mensagem pré-formatada do pedido
- Em pedido confirmado, link adicional pra iniciar conversa

### Notificações por email
- **Resend** ou **Postmark** para confirmação de pedido pro cliente e admin

---

## 12. Considerações de produção

- **LGPD:** termo de uso + política de privacidade + opt-in de cookies
- **SEO:** meta tags por página, OG image, sitemap, schema.org Product
- **Performance:** Next.js Image, fontes via `next/font`, Lighthouse > 90
- **Acessibilidade:** contraste AA, foco visível, navegação por teclado, ARIA
  em modals
- **Responsivo:** o protótipo é desktop-first. Adaptar para mobile (single column,
  menu hamburguer, sticky bottom CTA na página de produto)

---

## 13. Arquivos do protótipo (em `prototype/`)

- `Delicias Ayumi.html` — entry HTML com tokens CSS, fontes, scripts
- `data.jsx` — dados mock (produtos, pedidos, caixa) + hook `useStore`
- `ui.jsx` — primitivos compartilhados (Button, Card, Input, ProductImage, etc.)
- `storefront.jsx` — Topbar, HomePage, ProductPage, CartPage
- `admin.jsx` — Sidebar, Dashboard, Produtos, Pedidos, Caixa, Calculadora
- `app.jsx` — view router + Tweaks panel + paletas/fontes
- `tweaks-panel.jsx` — UI dos controles de design (pode descartar em produção)
- `assets/logo-ayumi.png` — logomarca oficial (mantém-se em produção)

---

## 14. Próximos passos sugeridos

1. **MVP (4 semanas):** storefront público + checkout WhatsApp + 1 admin com CRUD
   de produtos e visualização de pedidos.
2. **V1 (+2 semanas):** integração Mercado Pago, controle de caixa, calculadora.
3. **V2:** notificações, cupons, fidelidade, multi-admin.

Boa sorte! 🍰
