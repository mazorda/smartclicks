-- First, drop any existing policies to avoid conflicts
drop policy if exists "Enable users to view own submissions" on public.domain_audits;
drop policy if exists "Enable anonymous domain audit views" on public.domain_audits;
drop policy if exists "Enable anonymous domain audit creation" on public.domain_audits;

-- Ensure RLS is enabled
alter table public.domain_audits enable row level security;

-- Grant schema usage to anonymous users
grant usage on schema public to anon;

-- Grant table permissions to anonymous users
grant all privileges on public.domain_audits to anon;

-- Grant sequence permissions
grant usage, select on all sequences in schema public to anon;

-- Create policies with explicit permissions
create policy "Enable anonymous domain audit views"
on public.domain_audits
for select
to anon
using (true);

create policy "Enable anonymous domain audit creation"
on public.domain_audits
for insert
to anon
with check (true);

-- Grant specific column permissions
grant select, insert (
    domain,
    status,
    enrichment_status,
    clay_data,
    metadata,
    user_id,
    r1_gads_health_score,
    r1_health_score_analysis,
    r1_landing_pages,
    r1_analysis,
    r1_bounce_rate,
    r1_traffic_rank,
    r1_avg_time_on_site,
    r1_total_visits,
    r1_paid_visits,
    r1_organic_visits
) on public.domain_audits to anon;

-- Ensure public schema is accessible
grant usage on schema public to public;

-- Additional permissions for functions
grant execute on function gen_random_uuid() to anon;

-- Ensure the table is accessible in the public schema
alter table if exists public.domain_audits set schema public;

-- Reset ownership to ensure proper permissions
alter table public.domain_audits owner to authenticated;

-- Allow public access to the table
grant all privileges on public.domain_audits to public;

-- Explicitly enable inserts for anonymous users
create policy "Enable insert for anon"
on public.domain_audits
for insert
to anon
with check (true);

-- Add a catch-all select policy
create policy "Enable read access for all users"
on public.domain_audits
for select
using (true);
