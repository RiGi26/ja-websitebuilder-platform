-- ============================================================
-- JapanArena Website Builder — Database Hardening
-- Multi-tenancy collision audit + audit trail + anon RLS hardening
-- Author: hardening session 2026-05-29
-- ============================================================
-- Apply order: jalankan SETELAH supabase/schema.sql (butuh landing_pages).
-- Bagian aktif diapply via MCP apply_migration (migration: add_hardening).
-- Bagian "DEFERRED" sengaja di-comment — butuh koordinasi app sebelum live.
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- GAP 1 — UNIQUE constraint orders.midtrans_order_id
-- ────────────────────────────────────────────────────────────
-- Webhook Midtrans lookup via midtrans_order_id. Tanpa UNIQUE, replay/
-- double-charge bisa bikin >1 row order dgn id Midtrans sama → status
-- ganda. NULL tetap diizinkan (order belum bayar belum punya id Midtrans).
-- Postgres mengizinkan banyak NULL di kolom UNIQUE, jadi aman.

alter table public.orders
  add constraint orders_midtrans_order_id_key unique (midtrans_order_id);

-- Index lama (plain btree) jadi redundan setelah ada unique index.
drop index if exists public.orders_midtrans_order_id_idx;


-- ────────────────────────────────────────────────────────────
-- GAP 3 — Tabel audit trail order_progress_logs
-- ────────────────────────────────────────────────────────────
-- Catat tiap perubahan progress_step / status / note pada order.
-- Immutable log (insert-only) untuk dispute & debugging admin flow.

create table if not exists public.order_progress_logs (
  id            uuid        not null default gen_random_uuid() primary key,
  order_id      uuid        not null
    references public.orders (id) on delete cascade,
  from_step     integer,
  to_step       integer,
  from_status   text,
  to_status     text,
  progress_note text,
  changed_by    text,        -- email/identitas admin (atau 'system'/'webhook')
  source        text        not null default 'admin',  -- admin | webhook | system
    constraint chk_progress_log_source check (
      source in ('admin', 'webhook', 'system')
    ),
  created_at    timestamptz not null default now()
);

create index if not exists idx_order_progress_logs_order_id
  on public.order_progress_logs (order_id, created_at desc);

alter table public.order_progress_logs enable row level security;

-- Admin (authenticated) boleh baca & tulis log. Anon tidak punya akses.
-- Service role (server admin action) bypass RLS otomatis.
create policy "auth_select_progress_logs" on public.order_progress_logs
  for select to authenticated using (true);
create policy "auth_insert_progress_logs" on public.order_progress_logs
  for insert to authenticated with check (true);
-- Sengaja TIDAK ada policy update/delete → log immutable dari sisi client.


-- ────────────────────────────────────────────────────────────
-- TRACKING TOKEN — hardening anon RLS halaman /track (Opsi A)
-- ────────────────────────────────────────────────────────────
-- Masalah saat ini: track_anon_policy.sql memberi anon `using (true)` =
-- anon bisa SELECT seluruh tabel orders (PII customer bocor).
-- Opsi A: tiap order punya tracking_token rahasia. URL /track membawa token,
-- anon hanya bisa lihat row yg tokennya cocok.

-- 1) Kolom token (default auto-generate utk row baru).
alter table public.orders
  add column if not exists tracking_token text
  default encode(gen_random_bytes(16), 'hex');

-- 2) Backfill row lama yg belum punya token.
update public.orders
  set tracking_token = encode(gen_random_bytes(16), 'hex')
  where tracking_token is null;

-- 3) Wajib & unik.
alter table public.orders
  alter column tracking_token set not null;
create unique index if not exists orders_tracking_token_key
  on public.orders (tracking_token);

-- ── DEFERRED (butuh perubahan app dulu) ──────────────────────
-- Mengganti policy anon `using (true)` ke token-based AKAN memutus
-- halaman /track sampai app mengirim token (mis. ?t=<token> di URL +
-- header `x-track-token`). Jangan flip sebelum app siap.
--
--   drop policy if exists "Enable select for anon (track page)" on public.orders;
--   create policy "anon_select_by_tracking_token" on public.orders
--     for select to anon
--     using (
--       tracking_token = current_setting('request.headers', true)::json ->> 'x-track-token'
--     );


-- ────────────────────────────────────────────────────────────
-- ADVISOR 0011 — immutable search_path pada helper functions
-- ────────────────────────────────────────────────────────────
-- Mencegah search_path hijack pada function yg dipakai RLS.
alter function public.get_tenant_id() set search_path = '';
alter function public.set_updated_at() set search_path = '';


-- ────────────────────────────────────────────────────────────
-- GAP 2 — DEFERRED — tenant_id + landing_page_id di orders
-- ────────────────────────────────────────────────────────────
-- Menautkan order ke tenant & landing page asal. landing_pages SUDAH ada
-- (di-deploy via schema.sql), jadi FK valid. Tetap di-comment sesuai
-- rencana: butuh backfill tenant_id 21 row existing + update insert path app.
--
--   alter table public.orders
--     add column if not exists tenant_id uuid,
--     add column if not exists landing_page_id uuid
--       references public.landing_pages (id) on delete set null;
--   create index if not exists idx_orders_tenant_id on public.orders (tenant_id);
--   create index if not exists idx_orders_landing_page_id on public.orders (landing_page_id);
--   -- Setelah backfill semua row: alter column tenant_id set not null;


-- ────────────────────────────────────────────────────────────
-- GAP 4 — DEFERRED — CHECK format slug landing_pages
-- ────────────────────────────────────────────────────────────
-- Cegah slug invalid (spasi, uppercase, leading/trailing dash).
-- Comment dulu: validasi data existing sebelum enforce.
--
--   alter table public.landing_pages
--     add constraint chk_slug_format check (
--       slug is null or slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
--     );
