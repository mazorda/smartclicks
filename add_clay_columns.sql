-- Add new columns for Clay company data
ALTER TABLE public.domain_audits
ADD COLUMN IF NOT EXISTS linkedin_url text,
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS city_locality text,
ADD COLUMN IF NOT EXISTS founded_year integer,
ADD COLUMN IF NOT EXISTS company_description text,
ADD COLUMN IF NOT EXISTS specialties jsonb,
ADD COLUMN IF NOT EXISTS linkedin_follower_count integer,

-- Add SEMRush competitor columns
ADD COLUMN IF NOT EXISTS competitor_1_domain text,
ADD COLUMN IF NOT EXISTS competitor_1_monthly_gads_traffic integer,
ADD COLUMN IF NOT EXISTS competitor_1_monthly_adwords_cost numeric,
ADD COLUMN IF NOT EXISTS competitor_2_domain text,
ADD COLUMN IF NOT EXISTS competitor_2_monthly_gads_traffic integer,
ADD COLUMN IF NOT EXISTS competitor_2_monthly_adwords_cost numeric,

-- Add SEMRush traffic metrics
ADD COLUMN IF NOT EXISTS semrush_total_visits integer,
ADD COLUMN IF NOT EXISTS semrush_traffic_rank integer,
ADD COLUMN IF NOT EXISTS semrush_bounce_rate numeric,
ADD COLUMN IF NOT EXISTS semrush_pages_per_visit numeric,
ADD COLUMN IF NOT EXISTS semrush_time_on_site numeric,
ADD COLUMN IF NOT EXISTS semrush_paid_visits integer,
ADD COLUMN IF NOT EXISTS semrush_organic_visits integer,
ADD COLUMN IF NOT EXISTS semrush_direct_visits integer,
ADD COLUMN IF NOT EXISTS semrush_social_visits integer,
ADD COLUMN IF NOT EXISTS semrush_mobile_traffic_share numeric,
ADD COLUMN IF NOT EXISTS semrush_mobile_bounce_rate numeric,
ADD COLUMN IF NOT EXISTS similarweb_visits integer;

-- Add comments for documentation
COMMENT ON COLUMN public.domain_audits.linkedin_url IS 'Company LinkedIn profile URL';
COMMENT ON COLUMN public.domain_audits.company_name IS 'Official company name';
COMMENT ON COLUMN public.domain_audits.country IS 'Company headquarters country';
COMMENT ON COLUMN public.domain_audits.city_locality IS 'Company city and state/region';
COMMENT ON COLUMN public.domain_audits.founded_year IS 'Year company was founded';
COMMENT ON COLUMN public.domain_audits.company_description IS 'Company description from LinkedIn';
COMMENT ON COLUMN public.domain_audits.specialties IS 'Company specialties/tags as JSONB array';
COMMENT ON COLUMN public.domain_audits.linkedin_follower_count IS 'LinkedIn follower count';

COMMENT ON COLUMN public.domain_audits.competitor_1_domain IS 'Primary competitor domain';
COMMENT ON COLUMN public.domain_audits.competitor_1_monthly_gads_traffic IS 'Primary competitor monthly Google Ads traffic';
COMMENT ON COLUMN public.domain_audits.competitor_1_monthly_adwords_cost IS 'Primary competitor monthly Google Ads spend in USD';
COMMENT ON COLUMN public.domain_audits.competitor_2_domain IS 'Secondary competitor domain';
COMMENT ON COLUMN public.domain_audits.competitor_2_monthly_gads_traffic IS 'Secondary competitor monthly Google Ads traffic';
COMMENT ON COLUMN public.domain_audits.competitor_2_monthly_adwords_cost IS 'Secondary competitor monthly Google Ads spend in USD';

COMMENT ON COLUMN public.domain_audits.semrush_total_visits IS 'Total monthly visits from SEMRush';
COMMENT ON COLUMN public.domain_audits.semrush_traffic_rank IS 'SEMRush traffic rank';
COMMENT ON COLUMN public.domain_audits.semrush_bounce_rate IS 'Average bounce rate percentage';
COMMENT ON COLUMN public.domain_audits.semrush_pages_per_visit IS 'Average pages viewed per visit';
COMMENT ON COLUMN public.domain_audits.semrush_time_on_site IS 'Average time on site in seconds';
COMMENT ON COLUMN public.domain_audits.semrush_paid_visits IS 'Monthly paid traffic visits';
COMMENT ON COLUMN public.domain_audits.semrush_organic_visits IS 'Monthly organic search visits';
COMMENT ON COLUMN public.domain_audits.semrush_direct_visits IS 'Monthly direct visits';
COMMENT ON COLUMN public.domain_audits.semrush_social_visits IS 'Monthly social media visits';
COMMENT ON COLUMN public.domain_audits.semrush_mobile_traffic_share IS 'Mobile traffic percentage';
COMMENT ON COLUMN public.domain_audits.semrush_mobile_bounce_rate IS 'Mobile bounce rate percentage';
COMMENT ON COLUMN public.domain_audits.similarweb_visits IS 'Total monthly visits from SimilarWeb';
