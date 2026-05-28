-- ============================================================
-- JapanArena Corp — Website Builder Platform
-- Schema: Multi-tenant Landing Page Builder (JSONB Architecture)
-- ============================================================

create extension if not exists pg_trgm;

-- ──────────────────────────────────────────────────────────
-- Helper: ambil tenant_id dari JWT custom claim
-- Konsisten dengan pola ja-clinic & ja-lms
-- ──────────────────────────────────────────────────────────
create or replace function public.get_tenant_id()
returns uuid language sql stable as $$
  select nullif(
    (auth.jwt() -> 'app_metadata' ->> 'tenant_id'), ''
  )::uuid;
$$;

-- ──────────────────────────────────────────────────────────
-- Helper: auto-update kolom updated_at
-- ──────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ──────────────────────────────────────────────────────────
-- Table: landing_pages
-- ──────────────────────────────────────────────────────────
create table if not exists public.landing_pages (
  id            uuid        not null default gen_random_uuid() primary key,
  tenant_id     uuid        not null,
  nama_website  text        not null,
  slug          text        unique,
  domain_custom text        unique,
  tipe_industri text        not null,
    constraint chk_tipe_industri check (
      tipe_industri in (
        'sekolah', 'toko_online', 'corporate', 'klinik', 'travel',
        'restaurant', 'personal', 'blog', 'jastip', 'custom'
      )
    ),
  status        text        not null default 'draft',
    constraint chk_status check (
      status in ('draft', 'published', 'suspended', 'archived')
    ),
  data_konten   jsonb       not null default '{}',
  konfigurasi   jsonb       not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Indexes: landing_pages
create index if not exists idx_landing_pages_tenant_id
  on public.landing_pages (tenant_id);

create index if not exists idx_landing_pages_tipe_status
  on public.landing_pages (tipe_industri, status);

create index if not exists idx_landing_pages_data_konten_gin
  on public.landing_pages using gin (data_konten jsonb_path_ops);

create index if not exists idx_landing_pages_konfigurasi_gin
  on public.landing_pages using gin (konfigurasi jsonb_path_ops);

create index if not exists idx_landing_pages_slug
  on public.landing_pages (slug)
  where slug is not null;

-- Trigger: updated_at
create trigger trg_landing_pages_updated_at
  before update on public.landing_pages
  for each row execute function public.set_updated_at();

-- ──────────────────────────────────────────────────────────
-- Table: page_sections
-- ──────────────────────────────────────────────────────────
create table if not exists public.page_sections (
  id            uuid        not null default gen_random_uuid() primary key,
  page_id       uuid        not null
    references public.landing_pages (id) on delete cascade,
  tenant_id     uuid        not null,
  urutan        integer     not null default 0,
  tipe_komponen text        not null,
    constraint chk_tipe_komponen check (
      tipe_komponen in (
        'hero_banner', 'about', 'features', 'pricing_table', 'gallery',
        'testimonials', 'team', 'cta', 'contact_form', 'faq', 'stats',
        'blog_list', 'product_list', 'video_embed', 'map_embed',
        'social_feed', 'custom_html'
      )
    ),
  is_visible    boolean     not null default true,
  isi_komponen  jsonb       not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint uq_page_section_urutan unique (page_id, urutan)
);

-- Indexes: page_sections
create index if not exists idx_page_sections_page_id_urutan
  on public.page_sections (page_id, urutan);

create index if not exists idx_page_sections_tenant_id
  on public.page_sections (tenant_id);

create index if not exists idx_page_sections_isi_komponen_gin
  on public.page_sections using gin (isi_komponen jsonb_path_ops);

-- Trigger: updated_at
create trigger trg_page_sections_updated_at
  before update on public.page_sections
  for each row execute function public.set_updated_at();

-- ──────────────────────────────────────────────────────────
-- RLS: landing_pages
-- ──────────────────────────────────────────────────────────
alter table public.landing_pages enable row level security;

-- Tenant hanya bisa akses halaman miliknya
create policy "tenant_select_own_pages" on public.landing_pages
  for select using (tenant_id = public.get_tenant_id());

create policy "tenant_insert_own_pages" on public.landing_pages
  for insert with check (tenant_id = public.get_tenant_id());

create policy "tenant_update_own_pages" on public.landing_pages
  for update using (tenant_id = public.get_tenant_id());

create policy "tenant_delete_own_pages" on public.landing_pages
  for delete using (tenant_id = public.get_tenant_id());

-- Visitor publik bisa baca halaman yang sudah published (tanpa auth)
create policy "public_read_published_pages" on public.landing_pages
  for select using (status = 'published');

-- ──────────────────────────────────────────────────────────
-- RLS: page_sections
-- ──────────────────────────────────────────────────────────
alter table public.page_sections enable row level security;

create policy "tenant_select_own_sections" on public.page_sections
  for select using (tenant_id = public.get_tenant_id());

create policy "tenant_insert_own_sections" on public.page_sections
  for insert with check (tenant_id = public.get_tenant_id());

create policy "tenant_update_own_sections" on public.page_sections
  for update using (tenant_id = public.get_tenant_id());

create policy "tenant_delete_own_sections" on public.page_sections
  for delete using (tenant_id = public.get_tenant_id());

-- Visitor publik bisa baca sections dari halaman yang published
create policy "public_read_published_sections" on public.page_sections
  for select using (
    exists (
      select 1 from public.landing_pages lp
      where lp.id = page_sections.page_id
        and lp.status = 'published'
    )
  );
