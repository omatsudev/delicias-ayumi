# Delicias Ayumi

Site + e-commerce + painel admin para a doceria artesanal **Delicias Ayumi** (Petrópolis/RJ).

## Stack

- **Frontend:** Vite + React + TypeScript
- **Estilização:** Tailwind CSS + CSS variables (design tokens)
- **Backend/Auth:** Supabase (Postgres + Auth + Storage)
- **Deploy:** Cloudflare Pages

## Começar

```bash
npm install
cp .env.local .env.local   # já existe — edite com suas credenciais
npm run dev
```

## Variáveis de ambiente

Crie um projeto no [Supabase](https://supabase.com) e preencha o `.env.local`:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

## Banco de dados

Execute a migration no SQL Editor do Supabase:

```bash
# Copie o conteúdo de supabase/migrations/0001_init.sql e execute no Supabase
```

Após rodar a migration, crie um usuário admin em Authentication > Users no Supabase Dashboard (ex: `admin@deliciasayumi.com.br`) e insira o UUID na tabela `admins`.

## Deploy (Cloudflare Pages)

```bash
npm run build
# Suba a pasta dist/ para Cloudflare Pages ou conecte o repositório
```

O `wrangler.toml` já está configurado com `pages_build_output_dir = "dist"`.

## Rotas

### Storefront público
- `/` — Home + cardápio
- `/produto/:slug` — Página do produto
- `/carrinho` — Sacola
- `/checkout` — Finalização
- `/pedido/:id/confirmado` — Confirmação

### Admin (requer login)
- `/admin/login` — Login
- `/admin/dashboard` — Visão geral
- `/admin/produtos` — CRUD de produtos
- `/admin/pedidos` — Gestão de pedidos
- `/admin/caixa` — Controle financeiro
- `/admin/calculadora` — Calculadora de preço
