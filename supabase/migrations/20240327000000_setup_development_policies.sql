-- Reset existing policies
drop policy if exists "Allow anonymous audit creation" on public.domain_audits;
drop policy if exists "Allow anonymous audit views" on public.domain_audits;
drop policy if exists "Allow updates" on public.domain_audits;
drop policy if exists "Allow anonymous inserts" on public.domain_audits;
drop policy if exists "Allow anonymous reads" on public.domain_audits;

-- Ensure RLS is enabled
alter table public.domain_audits enable row level security;

-- Development Policies for domain_audits

-- Anonymous users can create initial audits
create policy "dev_anon_insert_policy"
on public.domain_audits
for insert
to anon
with check (
    -- Only allow setting basic fields for anonymous users
    user_id is null
    and status = 'pending'
);

-- Anonymous users can view their recent submissions (last 24 hours)
create policy "dev_anon_select_policy"
on public.domain_audits
for select
to anon
using (
    user_id is null
    and created_at > current_timestamp - interval '24 hours'
);

-- Authenticated users have full access to their own records
create policy "dev_auth_all_policy"
on public.domain_audits
for all
to authenticated
using (
    -- Users can only access their own records
    user_id = auth.uid()
)
with check (
    -- Users can only modify their own records
    user_id = auth.uid()
);

-- Grant basic permissions
grant usage on schema public to anon, authenticated;
grant select, insert on public.domain_audits to anon;
grant all on public.domain_audits to authenticated;

-- Grant sequence permissions
grant usage, select on all sequences in schema public to authenticated;

-- Comment on policies
comment on policy "dev_anon_insert_policy" on public.domain_audits is 
'Development policy: Allows anonymous users to create initial audit requests';

comment on policy "dev_anon_select_policy" on public.domain_audits is 
'Development policy: Allows anonymous users to view their recent submissions';

comment on policy "dev_auth_all_policy" on public.domain_audits is 
'Development policy: Allows authenticated users full access to their own records';

-- Add security note
comment on table public.domain_audits is 
'Domain audit records with development RLS policies. TODO: Implement stricter policies for production.';
