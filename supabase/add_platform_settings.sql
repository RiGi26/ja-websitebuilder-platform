-- Platform-level settings (singleton key-value). Service-role-only (RLS aktif,
-- tanpa policy) — sama pola dengan page_versions & security_events. Dipakai untuk
-- menyimpan mode Midtrans platform (sandbox|production) supaya bisa di-switch dari
-- /admin tanpa redeploy.
create table if not exists public.platform_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

alter table public.platform_settings enable row level security;

comment on table public.platform_settings is
  'Setelan tingkat platform (key-value singleton). Service-role-only. Mis. midtrans_mode = sandbox|production untuk switch endpoint Midtrans dari UI tanpa redeploy.';

-- Default mode Midtrans = production (keputusan owner 2026-06-14): nol perubahan
-- perilaku saat rilis karena deploy produksi sudah memakai key production.
insert into public.platform_settings (key, value)
values ('midtrans_mode', 'production')
on conflict (key) do nothing;
