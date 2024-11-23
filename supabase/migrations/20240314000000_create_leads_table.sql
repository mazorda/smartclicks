-- Create leads table
create table if not exists public.leads (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    email text not null unique,
    source text default 'ebook'::text,
    status text default 'new'::text check (status in ('new', 'contacted', 'qualified', 'converted')),
    metadata jsonb default '{}'::jsonb
);

-- Enable RLS
alter table public.leads enable row level security;

-- Create policies
create policy "Enable read access for authenticated users" on public.leads
    for select using (auth.role() = 'authenticated');

create policy "Enable insert access for all users" on public.leads
    for insert with check (true);

-- Create indexes
create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_created_at_idx on public.leads (created_at desc);