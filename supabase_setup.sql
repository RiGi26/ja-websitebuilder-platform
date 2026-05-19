-- Tabel untuk menyimpan data prospek/pesanan (Leads)
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Info Client
  client_type text,
  nama_usaha text,
  nama_perusahaan text,
  nama_pic text,
  jabatan text,
  nomor_wa text not null,
  email text,
  industri text,
  
  -- Info Pesanan
  template_id text,
  referensi_manual text,
  selected_addons text[],
  
  -- Pricing
  total_estimasi numeric not null,
  total_maintenance numeric not null,
  
  -- Tracking
  status text default 'pending'
);

-- Atur keamanan (RLS)
-- Aktifkan RLS
alter table public.orders enable row level security;

-- Izinkan siapa saja untuk Insert data (Klien dari web publik)
create policy "Enable insert for anonymous users" on public.orders
  for insert
  to anon
  with check (true);

-- Hanya Izinkan Admin (Service Role / Auth User) untuk melihat/mengubah
create policy "Enable read access for authenticated users" on public.orders
  for select
  to authenticated
  using (true);

create policy "Enable update for authenticated users" on public.orders
  for update
  to authenticated
  using (true);
