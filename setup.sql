-- First, ensure we start fresh
drop table if exists public.domain_audits;

-- Create domain_audits table
create table public.domain_audits (
    id uuid default gen_random_uuid() primary key,
    domain text not null,
    status text default 'pending',
    enrichment_status text default 'pending',
    clay_data jsonb,
    metadata jsonb default '{}'::jsonb,
    user_id uuid references auth.users(id),
    r1_gads_health_score numeric,
    r1_health_score_analysis text,
    r1_landing_pages jsonb,
    r1_analysis text,
    r1_bounce_rate numeric,
    r1_traffic_rank numeric,
    r1_avg_time_on_site numeric,
    r1_total_visits numeric,
    r1_paid_visits numeric,
    r1_organic_visits numeric,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Make user_id nullable
alter table public.domain_audits alter column user_id drop not null;

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
drop trigger if exists set_updated_at on public.domain_audits;
create trigger set_updated_at
    before update on public.domain_audits
    for each row
    execute function public.handle_updated_at();

-- Create index on domain for faster lookups
create index if not exists domain_audits_domain_idx on public.domain_audits(domain);

-- Reset ownership and enable RLS
alter table public.domain_audits owner to postgres;
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
