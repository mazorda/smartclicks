-- Add SEMrush data columns
alter table public.domain_audits 
add column if not exists semrush_traffic_rank numeric,
add column if not exists semrush_bounce_rate numeric,
add column if not exists semrush_time_on_site numeric,
add column if not exists semrush_total_visits numeric,
add column if not exists semrush_paid_visits numeric,
add column if not exists semrush_organic_visits numeric,
add column if not exists semrush_direct_visits numeric,
add column if not exists semrush_social_visits numeric,
add column if not exists semrush_mobile_traffic_share numeric,
add column if not exists semrush_mobile_bounce_rate numeric,
add column if not exists semrush_pages_per_visit numeric,
add column if not exists competitor_1_domain text,
add column if not exists competitor_1_monthly_gads_traffic numeric,
add column if not exists competitor_1_monthly_adwords_cost numeric,
add column if not exists competitor_2_domain text,
add column if not exists competitor_2_monthly_gads_traffic numeric,
add column if not exists competitor_2_monthly_adwords_cost numeric;

-- Add company info columns
alter table public.domain_audits
add column if not exists linkedin_url text,
add column if not exists company_name text,
add column if not exists country text,
add column if not exists city_locality text,
add column if not exists founded_year numeric,
add column if not exists company_description text,
add column if not exists specialties text[],
add column if not exists linkedin_follower_count numeric;
