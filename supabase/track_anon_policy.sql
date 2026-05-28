-- Fix: izinkan anon read orders untuk halaman /track
-- Customer input nomor WA atau Order ID mereka sendiri — filter di query level
create policy "Enable select for anon (track page)" on public.orders
  for select
  to anon
  using (true);
