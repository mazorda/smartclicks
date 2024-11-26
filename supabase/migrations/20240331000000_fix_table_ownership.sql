-- Change table ownership to postgres
alter table public.domain_audits owner to postgres;

-- Ensure RLS is enabled
alter table public.domain_audits enable row level security;

-- Drop existing policies
drop policy if exists "Enable anonymous domain audit views" on public.domain_audits;
drop policy if exists "Enable anonymous domain audit creation" on public.domain_audits;
drop policy if exists "enable_anonymous_read" on public.domain_audits;
drop policy if exists "enable_anonymous_insert" on public.domain_audits;
drop policy if exists "enable_anonymous_update" on public.domain_audits;

-- Create comprehensive policies for anonymous access
create policy "enable_anonymous_read"
on public.domain_audits for select
to anon
using (true);

create policy "enable_anonymous_insert"
on public.domain_audits for insert
to anon
with check (true);

create policy "enable_anonymous_update"
on public.domain_audits for update
to anon
using (true)
with check (true);

-- Reset permissions
revoke all on public.domain_audits from public;
revoke all on public.domain_audits from anon;
revoke all on public.domain_audits from authenticated;

-- Grant specific permissions
grant usage on schema public to anon;
grant all on public.domain_audits to anon;
grant usage, select on all sequences in schema public to anon;
grant execute on function gen_random_uuid() to anon;

-- Grant permissions to authenticated users as well
grant usage on schema public to authenticated;
grant all on public.domain_audits to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant execute on function gen_random_uuid() to authenticated;
