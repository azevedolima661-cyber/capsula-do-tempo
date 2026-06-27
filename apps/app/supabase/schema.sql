-- Cápsula do Tempo — schema do produto
-- Rode este script no SQL Editor do seu projeto Supabase.

create extension if not exists "pgcrypto";

-- Perfil básico do usuário (espelha auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text,
  email text,
  criado_em timestamptz not null default now()
);

create table if not exists capsulas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
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

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete set null,
  email text not null,
  status text not null default 'pending' check (status in ('paid', 'pending')),
  payment_type text not null default 'lifetime',
  access_until timestamptz,
  criado_em timestamptz not null default now()
);

create index if not exists capsulas_user_id_idx on capsulas (user_id);
create index if not exists capsulas_slug_idx on capsulas (slug);
create index if not exists capsulas_data_abertura_idx on capsulas (data_abertura);
create index if not exists memorias_capsula_id_idx on memorias (capsula_id);
create index if not exists payments_email_idx on payments (email);

-- RLS
alter table profiles enable row level security;
alter table capsulas enable row level security;
alter table memorias enable row level security;
alter table payments enable row level security;

create policy "Usuário vê o próprio perfil" on profiles
  for select using (auth.uid() = id);
create policy "Usuário atualiza o próprio perfil" on profiles
  for update using (auth.uid() = id);
create policy "Usuário cria o próprio perfil" on profiles
  for insert with check (auth.uid() = id);

-- Cápsulas: o painel sempre usa o client admin (service role) no servidor,
-- então não depende de RLS para o dono ler/escrever. Esta policy de select
-- público existe só para que os EXISTS(...) das policies de memorias e
-- storage.objects (avaliadas com o role anon do convidado) consigam ver a
-- linha da cápsula — os dados aqui não são sensíveis (o link já é o que dá
-- acesso ao álbum).
create policy "Qualquer um pode ver cápsulas pelo link" on capsulas
  for select using (true);

create policy "Dono cria cápsulas" on capsulas
  for insert with check (auth.uid() = user_id);
create policy "Dono atualiza suas cápsulas" on capsulas
  for update using (auth.uid() = user_id);
create policy "Dono apaga suas cápsulas" on capsulas
  for delete using (auth.uid() = user_id);

-- Memórias: o dono sempre vê; convidados só veem se o dono ligou allow_guest_view.
create policy "Dono vê memórias das suas cápsulas" on memorias
  for select using (
    exists (select 1 from capsulas c where c.id = capsula_id and c.user_id = auth.uid())
  );
create policy "Convidados veem memórias se o dono permitir" on memorias
  for select using (
    exists (select 1 from capsulas c where c.id = capsula_id and c.allow_guest_view = true)
  );

-- Convidados podem enviar memórias quando o álbum aceita envios:
-- "momento_agora" nunca trava, "capsula_tempo" só aceita enquanto está 'fechada'
-- (período de coleta, antes da data de abertura).
create policy "Convidados enviam memórias enquanto o álbum aceita envios" on memorias
  for insert with check (
    exists (
      select 1 from capsulas c
      where c.id = capsula_id
      and (c.modalidade = 'momento_agora' or c.status = 'fechada')
    )
  );

create policy "Dono apaga memórias das suas cápsulas" on memorias
  for delete using (
    exists (select 1 from capsulas c where c.id = capsula_id and c.user_id = auth.uid())
  );

-- Payments: cada um só vê o próprio registro (consultado por e-mail antes do
-- cadastro, então a leitura por e-mail também é feita pelo client admin
-- no servidor durante o fluxo de cadastro).
create policy "Usuário vê seus pagamentos" on payments
  for select using (auth.uid() = user_id);

-- Storage: bucket privado para capas e memórias das cápsulas
insert into storage.buckets (id, name, public)
values ('capsulas', 'capsulas', false)
on conflict (id) do nothing;

create policy "Dono lê arquivos da própria cápsula"
  on storage.objects for select
  using (
    bucket_id = 'capsulas'
    and exists (
      select 1 from capsulas c
      where c.id::text = (storage.foldername(name))[1]
      and c.user_id = auth.uid()
    )
  );

create policy "Convidados leem arquivos se o dono permitir"
  on storage.objects for select
  using (
    bucket_id = 'capsulas'
    and exists (
      select 1 from capsulas c
      where c.id::text = (storage.foldername(name))[1]
      and c.allow_guest_view = true
    )
  );

create policy "Convidados enviam arquivos enquanto o álbum aceita envios"
  on storage.objects for insert
  with check (
    bucket_id = 'capsulas'
    and exists (
      select 1 from capsulas c
      where c.id::text = (storage.foldername(name))[1]
      and (c.modalidade = 'momento_agora' or c.status = 'fechada' or c.user_id = auth.uid())
    )
  );

create policy "Dono apaga arquivos da própria cápsula"
  on storage.objects for delete
  using (
    bucket_id = 'capsulas'
    and exists (
      select 1 from capsulas c
      where c.id::text = (storage.foldername(name))[1]
      and c.user_id = auth.uid()
    )
  );
