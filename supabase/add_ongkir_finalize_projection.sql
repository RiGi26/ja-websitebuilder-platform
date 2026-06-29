-- Model B — "operator finalisasi ongkir" (BAKSO_PORTAL_CONTRACT.md §4.3 ekstensi finansial).
-- Tambah kolom finansial + instruksi bayar + status ongkir ke order_projection supaya
-- halaman lacak bisa menampilkan TOTAL FINAL + rekening setelah operator set ongkir, dan
-- sync ingest bisa memicu notif WA `total_final`. Additive & nullable → order lama + Bakso
-- (JP) tak terpengaruh: ongkir_status default 'n/a' = perilaku lama (instruksi langsung).
--
-- APPLIED to WB Supabase (chjgijlwhozeevrvhejt) via MCP migration `add_ongkir_finalize_projection`.

alter table public.order_projection
  add column if not exists subtotal        numeric,
  add column if not exists ongkir          numeric,
  add column if not exists instruksi_bayar jsonb,
  add column if not exists ongkir_status   text not null default 'n/a',
  add column if not exists wa_total_sent_at timestamptz;

-- ongkir_status: 'n/a' (JP/legacy — tak pakai alur ongkir-pending) · 'pending' (ID, ongkir
-- belum di-set operator) · 'set' (ongkir sudah final). Guard nilai.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'order_projection_ongkir_status_chk'
  ) then
    alter table public.order_projection
      add constraint order_projection_ongkir_status_chk
      check (ongkir_status in ('n/a', 'pending', 'set'));
  end if;
end $$;
