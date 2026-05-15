-- ── Enums ────────────────────────────────────────────────────────
create type product_category as enum ('Bolos', 'Tortas', 'Empadões');
create type delivery_method  as enum ('entrega', 'retirada');
create type payment_method   as enum ('pix', 'cartao', 'dinheiro');
create type order_status     as enum (
  'em_producao', 'saiu_entrega', 'pronto_retirada', 'entregue', 'cancelado'
);
create type cash_entry_type  as enum ('in', 'out');

-- ── Tabelas ───────────────────────────────────────────────────────

create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  category     product_category not null,
  description  text not null default '',
  size_label   text not null default '',
  price_cents  integer not null default 0,
  cost_cents   integer not null default 0,
  stock        integer not null default 0,
  active       boolean not null default true,
  tags         text[] not null default '{}',
  swatch       jsonb not null default '[]',
  image_url    text,
  gallery_urls text[] not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists neighborhoods (
  id        serial primary key,
  name      text not null,
  fee_cents integer not null,
  km        numeric not null,
  active    boolean not null default true
);

create table if not exists orders (
  id              uuid primary key default gen_random_uuid(),
  order_number    text unique not null,
  customer_name   text not null,
  customer_phone  text not null,
  delivery_method delivery_method not null,
  bairro          text,
  address         text,
  cep             text,
  payment_method  payment_method not null,
  status          order_status not null default 'em_producao',
  subtotal_cents  integer not null default 0,
  fee_cents       integer not null default 0,
  total_cents     integer not null default 0,
  notes           text,
  items           jsonb not null default '[]',
  created_at      timestamptz not null default now()
);

create table if not exists order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references orders(id) on delete cascade,
  product_id        uuid not null references products(id),
  qty               integer not null,
  unit_price_cents  integer not null,
  product_snapshot  jsonb not null default '{}'
);

create table if not exists cash_entries (
  id           uuid primary key default gen_random_uuid(),
  type         cash_entry_type not null,
  category     text not null,
  description  text not null default '',
  amount_cents integer not null,
  order_id     uuid references orders(id),
  created_at   timestamptz not null default now()
);

create table if not exists admins (
  id      uuid primary key references auth.users(id) on delete cascade,
  email   text not null
);

-- ── updated_at trigger ────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on products
  for each row execute procedure set_updated_at();

-- ── Sequência de pedidos (começando em #2042) ─────────────────────
create sequence if not exists order_seq start 2042;

-- ── Row Level Security ────────────────────────────────────────────
alter table products      enable row level security;
alter table neighborhoods enable row level security;
alter table orders        enable row level security;
alter table order_items   enable row level security;
alter table cash_entries  enable row level security;
alter table admins        enable row level security;

-- products: leitura pública (apenas ativos); escrita só admin
create policy "products_read_public" on products
  for select using (active = true);

create policy "products_admin_all" on products
  for all using (
    auth.uid() in (select id from admins)
  );

-- neighborhoods: leitura pública
create policy "neighborhoods_read_public" on neighborhoods
  for select using (active = true);

create policy "neighborhoods_admin_all" on neighborhoods
  for all using (
    auth.uid() in (select id from admins)
  );

-- orders: insert público (para criar pedidos); leitura/update só admin
create policy "orders_insert_public" on orders
  for insert with check (true);

create policy "orders_admin_all" on orders
  for all using (
    auth.uid() in (select id from admins)
  );

-- order_items: insert público junto com pedido
create policy "order_items_insert_public" on order_items
  for insert with check (true);

create policy "order_items_admin_all" on order_items
  for all using (
    auth.uid() in (select id from admins)
  );

-- cash_entries: só admin
create policy "cash_entries_admin_all" on cash_entries
  for all using (
    auth.uid() in (select id from admins)
  );

-- admins: só o próprio usuário pode ver
create policy "admins_self" on admins
  for select using (auth.uid() = id);

-- ── Seeds ─────────────────────────────────────────────────────────

-- Bairros de Petrópolis
insert into neighborhoods (name, fee_cents, km) values
  ('Centro',      800,  2),
  ('Quitandinha', 1000, 4),
  ('Bingen',      1000, 4),
  ('Valparaíso',  1200, 6),
  ('Corrêas',     1500, 9),
  ('Itaipava',    2200, 18),
  ('Cascatinha',  1200, 6),
  ('Mosela',      1000, 5);

-- Produtos
insert into products (slug, name, category, description, size_label, price_cents, cost_cents, stock, active, tags, swatch) values
(
  'bolo-cenoura-brigadeiro',
  'Bolo de Cenoura com Brigadeiro',
  'Bolos',
  'Bolo fofinho com cobertura cremosa de brigadeiro feita à colher.',
  'Serve 15–20 pessoas · 1,8 kg',
  8900, 2840, 12, true,
  array['Mais pedido', 'Clássico'],
  '["#f4a261", "#a0522d", "#fff3d6"]'
),
(
  'bolo-prestigio',
  'Bolo Prestígio',
  'Bolos',
  'Massa de chocolate, recheio de coco gelado e ganache.',
  'Serve 20–25 pessoas · 2,2 kg',
  11500, 4270, 6, true,
  array['Festa'],
  '["#3a1f12", "#f8eede", "#d4af7a"]'
),
(
  'torta-mousse-limao',
  'Torta Mousse de Limão',
  'Tortas',
  'Base crocante, mousse aerada de limão siciliano, merengue maçaricado.',
  'Aro 24 · 12 fatias',
  9500, 3120, 8, true,
  array['Refrescante'],
  '["#f9e98a", "#9ad36a", "#fffae0"]'
),
(
  'torta-frutas-vermelhas',
  'Torta de Frutas Vermelhas',
  'Tortas',
  'Creme de baunilha, frutas frescas da serra, geleia natural.',
  'Aro 26 · 14 fatias',
  12500, 4850, 5, true,
  array['Sazonal'],
  '["#d62246", "#f7c8c8", "#fff5e8"]'
),
(
  'empadao-frango-caipira',
  'Empadão de Frango Caipira',
  'Empadões',
  'Massa amanteigada, recheio cremoso com requeijão e palmito.',
  'Serve 8–10 · 1,4 kg',
  7800, 2680, 18, true,
  array['Mais pedido'],
  '["#f4c95d", "#c47628", "#fff1c6"]'
),
(
  'empadao-palmito',
  'Empadão de Palmito',
  'Empadões',
  'Recheio de palmito pupunha refogado com azeitona e ervas.',
  'Serve 8–10 · 1,4 kg',
  8200, 2950, 9, true,
  array['Vegetariano'],
  '["#d4e09b", "#6a994e", "#f0f7da"]'
),
(
  'bolo-red-velvet',
  'Bolo Red Velvet',
  'Bolos',
  'Massa aveludada vermelha com cream cheese levinho e crocante.',
  'Serve 20 pessoas · 2,0 kg',
  13800, 5100, 4, true,
  array['Especial'],
  '["#c1121f", "#f8edeb", "#ffe0e0"]'
),
(
  'torta-maracuja',
  'Torta de Maracujá',
  'Tortas',
  'Mousse cremoso de maracujá com calda natural e base de biscoito.',
  'Aro 22 · 10 fatias',
  8800, 2900, 10, true,
  array['Tropical'],
  '["#f4a261", "#ffe066", "#fff8e1"]'
);
