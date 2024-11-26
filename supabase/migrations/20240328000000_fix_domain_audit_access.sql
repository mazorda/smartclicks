-- Reset existing policies
drop policy if exists "dev_anon_insert_policy" on public.domain_audits;
drop policy if exists "dev_anon_select_policy" on public.domain_audits;
drop policy if exists "dev_auth_all_policy" on public.domain_audits;

-- Ensure RLS is enabled
alter table public.domain_audits enable row level security;

-- Allow anonymous users to create and view domain audits
create policy "anon_insert_policy"
on public.domain_audits
for insert
to anon
with check (true);

create policy "anon_select_policy"
on public.domain_audits
for select
to anon
using (true);

-- Allow anonymous users to update records they created (where user_id is null)
create policy "anon_update_policy"
on public.domain_audits
for update
to anon
using (user_id is null)
with check (user_id is null);

-- Authenticated users have full access to their own records
create policy "auth_all_policy"
on public.domain_audits
for all
to authenticated
using (
    user_id = auth.uid() or user_id is null
)
with check (
    user_id = auth.uid() or user_id is null
);

-- Grant basic permissions
grant usage on schema public to anon, authenticated;
grant all on public.domain_audits to authenticated;
grant select, insert, update on public.domain_audits to anon;

-- Grant sequence permissions
grant usage, select on all sequences in schema public to anon, authenticated;

-- Comment on policies
comment on policy "anon_insert_policy" on public.domain_audits is 
'Allows anonymous users to create domain audit records';

comment on policy "anon_select_policy" on public.domain_audits is 
'Allows anonymous users to view domain audit records';

comment on policy "anon_update_policy" on public.domain_audits is 
'Allows anonymous users to update records they created (where user_id is null)';

comment on policy "auth_all_policy" on public.domain_audits is 
'Allows authenticated users full access to their own records and anonymous records';
