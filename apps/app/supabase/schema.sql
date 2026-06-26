-- Cápsula do Tempo — schema do produto
-- Rode este script no SQL Editor do seu projeto Supabase.
--
-- Se você já rodou uma versão anterior deste arquivo em produção, rodar tudo
-- de novo vai falhar nas linhas "create policy" (elas não têm "if not exists").
-- Nesse caso, rode antes: drop policy if exists "<nome da policy>" on <tabela>;
-- para cada policy que mudou, ou aplique apenas as colunas novas (recipient_email,
-- recipient_id, qr_settings) via "alter table" antes de recriar as policies.

create extension if not exists "pgcrypto";

-- Perfil básico do usuário (espelha auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists capsules (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  open_date date not null,
  status text not null default 'fechada' check (status in ('fechada', 'aberta')),
  notified_at timestamptz,
  recipient_email text,
  recipient_id uuid references auth.users (id) on delete set null,
  qr_settings jsonb,
  created_at timestamptz not null default now()
);

create table if not exists capsule_items (
  id uuid primary key default gen_random_uuid(),
  capsule_id uuid not null references capsules (id) on delete cascade,
  type text not null check (type in ('foto', 'video', 'carta')),
  storage_path text,
  content text,
  uploaded_by_name text,
  created_at timestamptz not null default now()
);

create index if not exists capsule_items_capsule_id_idx on capsule_items (capsule_id);
create index if not exists capsules_owner_id_idx on capsules (owner_id);
create index if not exists capsules_recipient_id_idx on capsules (recipient_id);
create index if not exists capsules_open_date_idx on capsules (open_date);

-- RLS
alter table profiles enable row level security;
alter table capsules enable row level security;
alter table capsule_items enable row level security;

create policy "Usuário vê o próprio perfil" on profiles
  for select using (auth.uid() = id);
create policy "Usuário atualiza o próprio perfil" on profiles
  for update using (auth.uid() = id);
create policy "Usuário cria o próprio perfil" on profiles
  for insert with check (auth.uid() = id);

create policy "Dono vê suas cápsulas" on capsules
  for select using (auth.uid() = owner_id or auth.uid() = recipient_id);
create policy "Dono cria cápsulas" on capsules
  for insert with check (auth.uid() = owner_id);
create policy "Dono atualiza suas cápsulas" on capsules
  for update using (auth.uid() = owner_id or auth.uid() = recipient_id);
create policy "Dono apaga suas cápsulas" on capsules
  for delete using (auth.uid() = owner_id or auth.uid() = recipient_id);

-- Itens: dono e destinatário (cápsula presenteada) veem tudo da própria cápsula
create policy "Dono vê itens da própria cápsula" on capsule_items
  for select using (
    exists (
      select 1 from capsules c
      where c.id = capsule_id and (c.owner_id = auth.uid() or c.recipient_id = auth.uid())
    )
  );

-- Convidados (sem login) podem inserir itens em qualquer cápsula ainda fechada —
-- a página pública de contribuição usa essa policy. O link só é compartilhado
-- pelo dono (via QR Code), então isso funciona como "secret by URL".
create policy "Qualquer um pode contribuir com cápsula fechada" on capsule_items
  for insert with check (
    exists (select 1 from capsules c where c.id = capsule_id and c.status = 'fechada')
  );

create policy "Dono apaga itens da própria cápsula" on capsule_items
  for delete using (
    exists (
      select 1 from capsules c
      where c.id = capsule_id and (c.owner_id = auth.uid() or c.recipient_id = auth.uid())
    )
  );

-- Storage: bucket privado para as mídias das cápsulas
insert into storage.buckets (id, name, public)
values ('capsulas', 'capsulas', false)
on conflict (id) do nothing;

create policy "Dono lê arquivos da própria cápsula"
  on storage.objects for select
  using (
    bucket_id = 'capsulas'
    and exists (
      select 1 from capsules c
      where c.id::text = (storage.foldername(name))[1]
      and (c.owner_id = auth.uid() or c.recipient_id = auth.uid())
    )
  );

create policy "Qualquer um envia arquivo para cápsula fechada"
  on storage.objects for insert
  with check (
    bucket_id = 'capsulas'
    and exists (
      select 1 from capsules c
      where c.id::text = (storage.foldername(name))[1]
      and c.status = 'fechada'
    )
  );
