-- Open marketplace: per-listing seller WhatsApp + per-seller ownership.
-- Applied live to project bubueeymqgyqyzelmyam (migration
-- marketplace_whatsapp_and_owner_isolation).
--
-- Each listing carries the seller's WhatsApp (shown on the public card) and a
-- created_by linking it to the auth user who posted it. RLS is tightened so an
-- admin can only mutate their OWN listings; SELECT stays public so buyers see
-- every published listing regardless of who posted it.

alter table public.properties  add column if not exists whatsapp text;
alter table public.lands       add column if not exists whatsapp text;
alter table public.properties  add column if not exists created_by uuid references auth.users(id);
alter table public.lands       add column if not exists created_by uuid references auth.users(id);
alter table public.investments add column if not exists created_by uuid references auth.users(id);

-- Backfill existing rows to the original owner so they remain editable.
update public.properties  set created_by = '3a7f9ba1-44ac-401f-896b-56231e6170ab' where created_by is null;
update public.lands       set created_by = '3a7f9ba1-44ac-401f-896b-56231e6170ab' where created_by is null;
update public.investments set created_by = '3a7f9ba1-44ac-401f-896b-56231e6170ab' where created_by is null;

-- ── properties ──
drop policy if exists "admin insert properties" on public.properties;
drop policy if exists "admin update properties" on public.properties;
drop policy if exists "admin delete properties" on public.properties;
create policy "admin insert own properties" on public.properties for insert to public
  with check (exists (select 1 from users where users.id = (select auth.uid()) and users.role = 'admin') and created_by = (select auth.uid()));
create policy "admin update own properties" on public.properties for update to public
  using (created_by = (select auth.uid())) with check (created_by = (select auth.uid()));
create policy "admin delete own properties" on public.properties for delete to public
  using (created_by = (select auth.uid()));

-- ── lands ──
drop policy if exists "admin insert lands" on public.lands;
drop policy if exists "admin update lands" on public.lands;
drop policy if exists "admin delete lands" on public.lands;
create policy "admin insert own lands" on public.lands for insert to public
  with check (exists (select 1 from users where users.id = (select auth.uid()) and users.role = 'admin') and created_by = (select auth.uid()));
create policy "admin update own lands" on public.lands for update to public
  using (created_by = (select auth.uid())) with check (created_by = (select auth.uid()));
create policy "admin delete own lands" on public.lands for delete to public
  using (created_by = (select auth.uid()));

-- ── investments ──
drop policy if exists "admin insert investments" on public.investments;
drop policy if exists "admin update investments" on public.investments;
drop policy if exists "admin delete investments" on public.investments;
create policy "admin insert own investments" on public.investments for insert to public
  with check (exists (select 1 from users where users.id = (select auth.uid()) and users.role = 'admin') and created_by = (select auth.uid()));
create policy "admin update own investments" on public.investments for update to public
  using (created_by = (select auth.uid())) with check (created_by = (select auth.uid()));
create policy "admin delete own investments" on public.investments for delete to public
  using (created_by = (select auth.uid()));
