create table if not exists public.demo_contents (
  slug text primary key,
  content jsonb not null,
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by text
);

create index if not exists demo_contents_updated_at_idx
  on public.demo_contents (updated_at desc);

alter table public.demo_contents enable row level security;
