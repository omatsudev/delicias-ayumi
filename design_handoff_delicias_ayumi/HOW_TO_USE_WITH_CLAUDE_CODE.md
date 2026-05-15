# Como usar este pacote no Claude Code (VSCode)

Sequência de prompts prontos pra colar. Faça **um por vez**, esperando o Claude
terminar cada etapa, revisando o resultado e fazendo commit antes de seguir.

---

## Preparação (manual, antes de abrir o Claude Code)

1. **Instale o Claude Code:** https://claude.com/product/claude-code
2. **Crie uma pasta de projeto vazia** no seu computador:
   ```bash
   mkdir delicias-ayumi-site
   cd delicias-ayumi-site
   git init
   ```
3. **Descompacte este pacote dentro da pasta**, ficando assim:
   ```
   delicias-ayumi-site/
   ├── design_handoff_delicias_ayumi/
   │   ├── README.md
   │   ├── HOW_TO_USE_WITH_CLAUDE_CODE.md   ← este arquivo
   │   └── prototype/
   │       └── ... (arquivos do protótipo)
   └── (resto vazio — Claude vai preencher)
   ```
4. **Crie contas que o Claude precisará** (Claude não cria por você):
   - [Supabase](https://supabase.com) — banco de dados (free tier)
   - [Mercado Pago Developers](https://www.mercadopago.com.br/developers) — Pix/cartão
   - [Vercel](https://vercel.com) — hospedagem (free tier)
   - [Registro.br](https://registro.br) — domínio `deliciasayumi.com.br`
5. **Abra a pasta no VSCode** e abra o Claude Code (Cmd/Ctrl+L)

---

## PROMPT 1 — Reconhecimento e plano

Cole o prompt abaixo no Claude Code:

```
Estou na pasta de um projeto novo. Há uma pasta "design_handoff_delicias_ayumi/" 
com um README.md detalhado e uma subpasta prototype/ com os arquivos do design 
em HTML/JSX.

Leia o README e os arquivos do protótipo. Depois:

1. Resuma o que entendeu do projeto em um parágrafo.
2. Liste os principais pontos de atenção e decisões técnicas que precisaremos 
   tomar.
3. Proponha um plano de implementação em fases (MVP → V1 → V2).
4. NÃO escreva código ainda. Quero confirmar o plano antes.
```

Revise o plano. Pergunte, ajuste, refine.

---

## PROMPT 2 — Scaffold do projeto

```
Ótimo. Vamos começar a Fase 1 (MVP).

1. Inicialize um projeto Next.js 14 com TypeScript, App Router, Tailwind CSS 
   e ESLint na raiz desta pasta (não dentro de subpasta).
2. Configure os design tokens do README como CSS variables em globals.css, 
   incluindo a paleta "Ayumi" como default e as alternativas comentadas.
3. Configure as fontes Cormorant Garamond, Caveat, Work Sans e JetBrains Mono 
   via next/font/google.
4. Copie assets/logo-ayumi.png do prototype para public/.
5. Crie um README.md inicial na raiz explicando como rodar o projeto.
6. Commit como "chore: scaffold Next.js + design tokens".

Pause depois disso pra eu rodar npm run dev e ver.
```

Rode `npm run dev` e veja se sobe.

---

## PROMPT 3 — Schema do banco

```
Vamos configurar o Supabase.

1. Me guie pra criar uma conta e um projeto novo no Supabase (passo a passo 
   manual — não tente fazer pra mim).
2. Quando eu te der as credenciais (URL + anon key + service role), crie 
   .env.local e adicione ao .gitignore.
3. Crie um arquivo supabase/migrations/0001_init.sql com o schema descrito 
   no README seção 6 (products, orders, cash_entries, neighborhoods).
4. Inclua os seeds: 8 produtos do prototype/data.jsx (campo SEED_PRODUCTS) e 
   8 bairros do array PETRO_BAIRROS.
5. Configure Row Level Security: leitura pública em products e neighborhoods 
   (apenas active=true); escrita só com role authenticated.
6. Crie src/lib/supabase.ts com cliente tipado.

Antes de rodar, me mostre o SQL pra eu revisar.
```

---

## PROMPT 4 — Storefront público

```
Implemente as rotas públicas do storefront, replicando pixel-a-pixel o design 
do protótipo (hero editorial — você pode olhar HeroEditorial em 
prototype/storefront.jsx).

Rotas a criar:
- / (home) com hero + grid de produtos vindo do Supabase
- /produto/[slug]
- /carrinho (estado no client com zustand)
- /checkout
- /pedido/[id]/confirmado

Use componentes shadcn/ui como base; customize com nossas CSS variables.
Substitua o placeholder ProductImage por <Image> do next/image (apontando 
para o campo image_url do produto; quando vazio, mostra um placeholder cinza 
com o nome).

Não implemente pagamento ainda — no botão "Confirmar pedido", apenas 
crie a order no banco e redirecione pra /pedido/[id]/confirmado.

Commit como "feat: storefront público com checkout sem pagamento".
```

---

## PROMPT 5 — Painel admin

```
Implemente o admin em /admin/*. 

- Use Supabase Auth (email + senha). Crie uma seed para admin@deliciasayumi.com.br.
- Middleware do Next.js que redireciona pra /admin/login se não logado.
- Replique:
  • Sidebar (Logo + 5 itens)
  • Dashboard com KPIs reais (queries no Supabase), gráfico de área SVG do 
    faturamento dos últimos 14 dias, top produtos
  • Produtos com CRUD completo (modal de criar/editar como no prototype/admin.jsx)
  • Pedidos com filtros por status
  • Caixa com lançamentos e anel de despesas
  • Calculadora de preço (lógica pura no frontend — fórmula está no README §7.13)

Não esqueça as confirmações modais de exclusão.

Commit como "feat: painel admin completo".
```

---

## PROMPT 6 — Mercado Pago

```
Integre pagamento via Pix e cartão usando Mercado Pago.

1. Me guie pra obter access_token de produção e de teste.
2. Adicione ao .env.local.
3. No checkout, ao confirmar:
   - Se método=Pix: gere QR Code via API do MP, mostre na tela de confirmação 
     com timer de 30min
   - Se cartão: redirecione pra Checkout Pro
   - Se dinheiro: mantém o fluxo atual
4. Crie endpoint /api/webhooks/mercadopago que recebe notificações e atualiza 
   o status do pedido.
5. Adicione logs (console.log no MVP; Sentry depois).

Use o ambiente de TESTE primeiro. Não vá pra produção sem eu testar.

Commit como "feat: integração Mercado Pago (Pix + cartão)".
```

---

## PROMPT 7 — Validações e regras de negócio

```
Implemente as regras de negócio descritas no README §10:

1. Validação de CEP de Petrópolis (faixa 25600–25960) no checkout
2. Desconto de 5% no Pix
3. Bloqueio de entrega/retirada para o dia atual e seguinte (48h)
4. Esgotado quando stock=0
5. Numeração sequencial de pedidos começando em #2042

Adicione testes unitários (vitest) para as funções de cálculo (taxa de entrega, 
desconto Pix, fórmula da calculadora).

Commit como "feat: regras de negócio + testes".
```

---

## PROMPT 8 — WhatsApp + notificações

```
1. Adicione o botão "Encomendar pelo WhatsApp" no hero — gera link wa.me/55... 
   sem pedido específico.
2. Na confirmação do pedido, botão "Confirmar pelo WhatsApp" que abre conversa 
   com resumo do pedido pré-preenchido.
3. Configure Resend pra disparar:
   - Email de confirmação pro cliente
   - Email pro admin notificando novo pedido
4. Use React Email para os templates.

Commit como "feat: WhatsApp + emails transacionais".
```

---

## PROMPT 9 — Polimento + responsividade

```
1. Audite a responsividade — o protótipo é desktop-first. Mobile precisa de:
   - Menu hamburguer no topbar
   - Cards full-width
   - Sticky CTA no bottom na página de produto
2. Adicione skeletons em todas as listas (produtos, pedidos, caixa)
3. Adicione meta tags Open Graph + favicon + manifest
4. Configure schema.org Product nos produtos
5. Verifique acessibilidade: foco visível, ARIA em modais, contraste

Commit como "polish: responsivo + SEO + a11y".
```

---

## PROMPT 10 — Deploy

```
1. Me guie pra:
   - Subir o projeto pro GitHub
   - Conectar com Vercel
   - Adicionar todas as env vars na Vercel
   - Apontar o domínio deliciasayumi.com.br (configuração no Registro.br)
2. Configure preview deploys e o domínio de produção.
3. Adicione um README de produção explicando como atualizar produtos, ver 
   pedidos, fazer backup do Supabase.
```

---

## Dicas de uso

- **Faça commits pequenos** — depois de cada prompt, revise as mudanças
  (`git diff`) antes de aceitar tudo.
- **Quando algo der errado**, peça pro Claude reverter:
  *"Reverta o último commit e tente outra abordagem"*
- **Use `/clear`** entre fases pra limpar o contexto e economizar tokens.
- **Sempre revise código relacionado a pagamento** — Claude erra em
  integrações complexas. Teste no ambiente sandbox antes de produção.
- **Não pule a fase de testar localmente** — não suba pra Vercel um build
  que você nunca rodou.

---

## Se travar

Se o Claude ficar em loop ou produzir código quebrado:

1. `/clear` pra limpar o contexto
2. Cole novamente o prompt + o erro específico
3. Se persistir, divida o prompt em pedaços menores
4. Pra problemas de integração externa (Mercado Pago, Supabase), peça pra ele
   ler a documentação oficial via WebFetch

Boa sorte! 🍰
