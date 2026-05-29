-- Tier 1: Progress tracking columns untuk admin update + customer /track
-- Apply via Supabase Dashboard → SQL Editor
-- Idempotent: aman di-run berulang kali (semua pakai IF NOT EXISTS)

alter table public.orders
  add column if not exists progress_step integer not null default 1,
  add column if not exists progress_note text,
  add column if not exists last_updated_at timestamptz not null default now();

-- Backfill last_updated_at untuk row existing (pakai created_at sebagai nilai awal)
update public.orders
  set last_updated_at = created_at
  where last_updated_at is null;

-- Trigger reload schema cache PostgREST supaya kolom baru langsung terbaca
notify pgrst, 'reload schema';
