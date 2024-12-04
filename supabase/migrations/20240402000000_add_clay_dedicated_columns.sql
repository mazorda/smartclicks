-- Add new columns for Clay company data
ALTER TABLE public.domain_audits
ADD COLUMN IF NOT EXISTS r1_company_size text,
ADD COLUMN IF NOT EXISTS r1_company_industry text,
ADD COLUMN IF NOT EXISTS r1_company_logo_url text,
ADD COLUMN IF NOT EXISTS r1_competitor_domain text,
ADD COLUMN IF NOT EXISTS r1_competitor_gads_cost numeric;

-- Add comment explaining the columns
COMMENT ON TABLE public.domain_audits IS 'Stores domain audit data including Clay enrichment fields';
COMMENT ON COLUMN public.domain_audits.r1_company_size IS 'Company size from Clay enrichment';
COMMENT ON COLUMN public.domain_audits.r1_company_industry IS 'Company industry from Clay enrichment';
COMMENT ON COLUMN public.domain_audits.r1_company_logo_url IS 'Company logo URL from Clay enrichment';
COMMENT ON COLUMN public.domain_audits.r1_competitor_domain IS 'Main competitor domain from Clay analysis';
COMMENT ON COLUMN public.domain_audits.r1_competitor_gads_cost IS 'Competitor monthly Google Ads spend in USD';
