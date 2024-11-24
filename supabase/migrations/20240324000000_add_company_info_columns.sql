-- Add new columns for company information
alter table public.domain_audits 
add column if not exists r1_company_size text,
add column if not exists r1_company_industry text,
add column if not exists r1_company_logo_url text,
add column if not exists r1_competitor_domain text,
add column if not exists r1_competitor_gads_cost numeric;
