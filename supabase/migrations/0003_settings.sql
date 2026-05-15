create table if not exists ayumi_settings (
  key        text primary key,
  value      text not null default '',
  label      text not null default '',
  group_name text not null default 'Geral'
);

alter table ayumi_settings enable row level security;

create policy "anon_select" on ayumi_settings
  for select to anon using (true);

create policy "auth_all" on ayumi_settings
  for all to authenticated using (true) with check (true);

insert into ayumi_settings (key, value, label, group_name) values
  ('contato.whatsapp',  '5524988880000',                                                     'Número WhatsApp (só dígitos)',        'Contato'),
  ('contato.email',     'oi@deliciasayumi.com.br',                                           'E-mail de contato',                   'Contato'),
  ('contato.instagram', 'delicias_ayumi',                                                    'Instagram (sem @)',                   'Contato'),
  ('contato.endereco',  'R. Antônio Manoel de França, 187 Casa B · Corrêas, Petrópolis/RJ', 'Endereço completo',                   'Contato'),
  ('announce.texto',    'Entregamos em toda Petrópolis · Retirada em Corrêas ♡',             'Faixa de anúncio (topo do site)',     'Site'),
  ('hero.paragrafo',    'Receitas que atravessaram três gerações, preparadas no nosso ateliê em Corrêas. Encomende para sua mesa ou retire conosco.', 'Parágrafo do hero', 'Site'),
  ('sobre.titulo',      'A receita é da minha avó. O ateliê é meu.',                         'Título da seção Sobre',               'Site'),
  ('sobre.texto',       'Sou a Ayumi. Há alguns anos, transformei a cozinha de casa em ateliê e nunca mais parei. Cada bolo sai daqui assinado por mim — e provado três vezes antes de te entregar.', 'Texto da seção Sobre', 'Site')
on conflict (key) do nothing;
