-- Cápsula do Tempo — schema do produto
-- Rode este script no SQL Editor do seu projeto Supabase.
--
-- Importante: este app NÃO tem login seguro nem pagamento. A liberação de
-- acesso acontece fora do app (a pessoa já comprou em outro lugar). Dentro do
-- app o e-mail é só uma "porta de entrada" pra identificar a sessão — não é
-- autenticação. Por isso as políticas de RLS abaixo são intencionalmente
-- abertas: o escopo por e-mail é feito no app (filtro owner_email), não no banco.

create extension if not exists "pgcrypto";

create table if not exists capsulas (
  id uuid primary key default gen_random_uuid(),
  owner_email text not null,
  nome text not null,
  slug text not null unique,
  modalidade text not null check (modalidade in ('momento_agora', 'capsula_tempo')),
  prazo_anos int check (prazo_anos in (1, 2, 5)),
  data_evento timestamptz,
  data_abertura timestamptz,
  capa_url text,
  nome_responsavel text,
  allow_guest_view boolean not null default false,
  status text not null default 'ativa' check (status in ('ativa', 'fechada', 'aberta')),
  expirado boolean not null default false,
  event_date_change_count int not null default 0,
  criado_em timestamptz not null default now()
);

create table if not exists memorias (
  id uuid primary key default gen_random_uuid(),
  capsula_id uuid not null references capsulas (id) on delete cascade,
  arquivo_url text not null,
  nome_convidado text,
  tipo text not null check (tipo in ('foto', 'video')),
  enviado_em timestamptz not null default now()
);

create index if not exists capsulas_owner_email_idx on capsulas (owner_email);
create index if not exists capsulas_slug_idx on capsulas (slug);
create index if not exists capsulas_data_abertura_idx on capsulas (data_abertura);
create index if not exists memorias_capsula_id_idx on memorias (capsula_id);

-- RLS habilitada, mas com acesso liberado (ver nota no topo: não há autenticação
-- dentro do app; o controle de quem entrou é feito por e-mail no front-end).
alter table capsulas enable row level security;
alter table memorias enable row level security;

create policy "Acesso liberado a capsulas" on capsulas
  for all using (true) with check (true);

create policy "Acesso liberado a memorias" on memorias
  for all using (true) with check (true);

-- Storage: bucket privado para capas e memórias das cápsulas. As URLs são
-- geradas como signed URLs pelo servidor; o acesso fica liberado pelas políticas
-- abaixo (mesma lógica: sem login, controle feito no app).
insert into storage.buckets (id, name, public)
values ('capsulas', 'capsulas', false)
on conflict (id) do nothing;

create policy "Acesso liberado de leitura no storage"
  on storage.objects for select
  using (bucket_id = 'capsulas');

create policy "Acesso liberado de envio no storage"
  on storage.objects for insert
  with check (bucket_id = 'capsulas');

create policy "Acesso liberado de remoção no storage"
  on storage.objects for delete
  using (bucket_id = 'capsulas');
