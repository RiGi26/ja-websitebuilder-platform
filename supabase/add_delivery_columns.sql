-- Lapis A: Delivered URL & credentials untuk hero card "Website Live" di /track
-- Apply via Supabase Dashboard → SQL Editor
-- Idempotent: aman di-run berulang kali

alter table public.orders
  add column if not exists delivered_url text,
  add column if not exists delivered_credentials text;

notify pgrst, 'reload schema';
