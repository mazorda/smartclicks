-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create domain_audits table
create table if not exists public.domain_audits (
    id uuid default uuid_generate_v4() primary key,
    domain text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
    enrichment_status text default 'pending' check (enrichment_status in ('pending', 'processing', 'completed', 'failed')),
    clay_data jsonb,
    user_id uuid references auth.users(id),
    metadata jsonb default '{}'::jsonb
);

-- Create indexes
create index if not exists domain_audits_domain_idx on public.domain_audits (domain);
create index if not exists domain_audits_status_idx on public.domain_audits (status);
create index if not exists domain_audits_user_id_idx on public.domain_audits (user_id);
create index if not exists domain_audits_created_at_idx on public.domain_audits (created_at desc);

-- Create updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger update_domain_audits_updated_at
    before update on public.domain_audits
    for each row
    execute function update_updated_at_column();

-- Enable RLS
alter table public.domain_audits enable row level security;

-- Create policies
-- Allow anonymous inserts
create policy "Enable anonymous inserts" on public.domain_audits
    for insert
    with check (true);

-- Allow users to view their own submissions
create policy "Enable users to view own submissions" on public.domain_audits
    for select
    using (
        auth.uid() = user_id
    );

-- Allow admins to view all submissions
create policy "Enable admin access to all submissions" on public.domain_audits
    for all
    using (
        auth.jwt() ->> 'role' = 'admin'
    );

-- Add comment to table
comment on table public.domain_audits is 'Stores domain audit submissions and their status';
