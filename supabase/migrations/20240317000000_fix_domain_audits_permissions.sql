-- First, ensure we start fresh with permissions
drop policy if exists "Enable anonymous domain audit views" on public.domain_audits;
drop policy if exists "Enable anonymous domain audit creation" on public.domain_audits;
drop policy if exists "Enable insert for anon" on public.domain_audits;
drop policy if exists "Enable read access for all users" on public.domain_audits;

-- Reset ownership to postgres to ensure proper permission hierarchy
alter table public.domain_audits owner to postgres;

-- Enable RLS
alter table public.domain_audits enable row level security;

-- Grant basic permissions
grant usage on schema public to anon, authenticated;
grant all on public.domain_audits to anon, authenticated;

-- Create simplified policies that explicitly allow anonymous operations
create policy "Allow anonymous inserts"
on public.domain_audits for insert
to anon, authenticated
with check (true);

create policy "Allow anonymous reads"
on public.domain_audits for select
to anon, authenticated
using (true);

-- Grant sequence permissions
grant usage, select on all sequences in schema public to anon, authenticated;

-- Ensure function access
grant execute on function gen_random_uuid() to anon, authenticated;
