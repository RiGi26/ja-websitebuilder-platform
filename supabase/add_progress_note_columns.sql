-- Tier 1: Progress note + last_updated_at untuk halaman /track customer
-- Apply via Supabase Dashboard → SQL Editor

alter table public.orders
  add column if not exists progress_note text,
  add column if not exists last_updated_at timestamptz not null default now();

-- Backfill last_updated_at untuk row existing (gunakan created_at sebagai nilai awal)
update public.orders
  set last_updated_at = created_at
  where last_updated_at is null;
