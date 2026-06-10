-- =============================================================
-- add_referral_system.sql — Program Mitra (referral/affiliate)
-- Apply AFTER: supabase_setup.sql, add_payment_columns.sql,
--              add_hardening.sql (needs orders + set_updated_at()).
--
-- Tables:
--   referrers         — invite-only partners (admin-created), auth via
--                       Supabase Auth (user_id), commission/discount %
--   referral_codes    — shareable codes (one default per referrer)
--   referral_earnings — commission ledger, one row per order
--                       (order_id UNIQUE = idempotency anchor: Midtrans
--                       retries webhooks, insert must be conflict-safe)
--   referral_payouts  — manual bank-transfer payout requests
-- Orders gain: referral_code / referrer_id / referral_discount.
--
-- Lifecycle: pending (DP paid) → confirmed (lunas / full-upfront)
--            → paid (payout). void on cancellation.
-- Writes are service-role only (no write policies). Referrers get
-- SELECT-own as defense-in-depth; /mitra reads via service role.
-- =============================================================

-- 1. referrers ------------------------------------------------
create table if not exists public.referrers (
  id                     uuid not null default gen_random_uuid() primary key,
  user_id                uuid unique references auth.users (id) on delete set null,
  nama                   text not null,
  email                  text not null,
  nomor_wa               text not null,
  commission_percent     numeric not null default 10,
  buyer_discount_percent numeric not null default 5,
  bank_name              text,
  bank_account_number    text,
  bank_account_name      text,
  status                 text not null default 'active'
    constraint chk_referrer_status check (status in ('active', 'suspended')),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

drop trigger if exists trg_referrers_updated on public.referrers;
create trigger trg_referrers_updated
  before update on public.referrers
  for each row execute function public.set_updated_at();

-- 2. referral_codes -------------------------------------------
create table if not exists public.referral_codes (
  id          uuid not null default gen_random_uuid() primary key,
  referrer_id uuid not null references public.referrers (id) on delete cascade,
  code        text not null unique
    constraint chk_code_format check (code ~ '^[A-Z0-9]{4,16}$'),
  status      text not null default 'active'
    constraint chk_code_status check (status in ('active', 'disabled')),
  created_at  timestamptz not null default now()
);

create index if not exists idx_referral_codes_referrer
  on public.referral_codes (referrer_id);

-- 3. referral_earnings ----------------------------------------
create table if not exists public.referral_earnings (
  id                 uuid not null default gen_random_uuid() primary key,
  referrer_id        uuid not null references public.referrers (id) on delete cascade,
  order_id           uuid not null unique references public.orders (id) on delete cascade,
  order_total        numeric not null,
  commission_percent numeric not null,
  amount             numeric not null,
  status             text not null default 'pending'
    constraint chk_earning_status check (status in ('pending', 'confirmed', 'paid', 'void')),
  confirmed_at       timestamptz,
  payout_id          uuid,
  created_at         timestamptz not null default now()
);

create index if not exists idx_referral_earnings_referrer
  on public.referral_earnings (referrer_id, status);

-- 4. referral_payouts -----------------------------------------
create table if not exists public.referral_payouts (
  id                 uuid not null default gen_random_uuid() primary key,
  referrer_id        uuid not null references public.referrers (id) on delete cascade,
  amount             numeric not null,
  status             text not null default 'requested'
    constraint chk_payout_status check (status in ('requested', 'paid', 'rejected')),
  bank_snapshot      jsonb not null default '{}'::jsonb,
  requested_at       timestamptz not null default now(),
  paid_at            timestamptz,
  transfer_proof_url text,
  admin_note         text
);

create index if not exists idx_referral_payouts_referrer
  on public.referral_payouts (referrer_id, status);

alter table public.referral_earnings
  drop constraint if exists referral_earnings_payout_fk;
alter table public.referral_earnings
  add constraint referral_earnings_payout_fk
  foreign key (payout_id) references public.referral_payouts (id) on delete set null;

-- 5. orders: attribution columns ------------------------------
alter table public.orders
  add column if not exists referral_code     text,
  add column if not exists referrer_id       uuid references public.referrers (id) on delete set null,
  add column if not exists referral_discount numeric not null default 0;

create index if not exists idx_orders_referrer_id
  on public.orders (referrer_id);

-- 6. RLS -------------------------------------------------------
alter table public.referrers         enable row level security;
alter table public.referral_codes    enable row level security;
alter table public.referral_earnings enable row level security;
alter table public.referral_payouts  enable row level security;

drop policy if exists "referrer_select_self" on public.referrers;
create policy "referrer_select_self" on public.referrers
  for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "referrer_select_own_codes" on public.referral_codes;
create policy "referrer_select_own_codes" on public.referral_codes
  for select to authenticated
  using (exists (
    select 1 from public.referrers r
    where r.id = referrer_id and r.user_id = (select auth.uid())
  ));

drop policy if exists "referrer_select_own_earnings" on public.referral_earnings;
create policy "referrer_select_own_earnings" on public.referral_earnings
  for select to authenticated
  using (exists (
    select 1 from public.referrers r
    where r.id = referrer_id and r.user_id = (select auth.uid())
  ));

drop policy if exists "referrer_select_own_payouts" on public.referral_payouts;
create policy "referrer_select_own_payouts" on public.referral_payouts
  for select to authenticated
  using (exists (
    select 1 from public.referrers r
    where r.id = referrer_id and r.user_id = (select auth.uid())
  ));

-- 7. Tighten anon order insert (was add_hardening.sql) ---------
-- Anon (upgrade flow) must not self-assign attribution/discount;
-- referral orders are inserted server-side via service role.
drop policy if exists "anon_insert_lead" on public.orders;
create policy "anon_insert_lead" on public.orders
  for insert to anon
  with check (
    coalesce(payment_status, 'unpaid') = 'unpaid'
    and coalesce(status, 'pending') in ('pending', 'pending_payment')
    and midtrans_order_id is null
    and dp_amount is null
    and delivered_url is null
    and delivered_credentials is null
    and coalesce(progress_step, 1) between 1 and 5
    and referrer_id is null
    and coalesce(referral_discount, 0) = 0
  );
