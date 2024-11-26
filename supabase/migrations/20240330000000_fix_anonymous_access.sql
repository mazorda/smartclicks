-- Drop all existing policies
drop policy if exists "Enable anonymous domain audit views" on public.domain_audits;
drop policy if exists "Enable anonymous domain audit creation" on public.domain_audits;
drop policy if exists "anon_update_policy" on public.domain_audits;
drop policy if exists "anon_insert_policy" on public.domain_audits;
drop policy if exists "anon_select_policy" on public.domain_audits;

-- Create simple, permissive policies for anonymous users
create policy "enable_anonymous_read" on public.domain_audits
for select to anon using (true);

create policy "enable_anonymous_insert" on public.domain_audits
for insert to anon with check (true);

create policy "enable_anonymous_update" on public.domain_audits
for update to anon using (true) with check (true);

-- Ensure RLS is enabled
alter table public.domain_audits enable row level security;

-- Reset and grant full permissions to anonymous users
revoke all on public.domain_audits from public;
revoke all on public.domain_audits from anon;
revoke all on public.domain_audits from authenticated;

grant all on public.domain_audits to anon;
grant usage on schema public to anon;
grant usage, select on all sequences in schema public to anon;

-- Add helpful comments
comment on policy "enable_anonymous_read" on public.domain_audits is 
'Allows anonymous users to read all domain audits';

comment on policy "enable_anonymous_insert" on public.domain_audits is 
'Allows anonymous users to create domain audits';

comment on policy "enable_anonymous_update" on public.domain_audits is 
'Allows anonymous users to update domain audits';
