-- Remove r1_* columns from domain_audits table
ALTER TABLE domain_audits
  DROP COLUMN IF EXISTS r1_gads_health_score,
  DROP COLUMN IF EXISTS r1_health_score_analysis,
  DROP COLUMN IF EXISTS r1_landing_pages,
  DROP COLUMN IF EXISTS r1_analysis,
  DROP COLUMN IF EXISTS r1_bounce_rate,
  DROP COLUMN IF EXISTS r1_traffic_rank,
  DROP COLUMN IF EXISTS r1_avg_time_on_site,
  DROP COLUMN IF EXISTS r1_total_visits,
  DROP COLUMN IF EXISTS r1_paid_visits,
  DROP COLUMN IF EXISTS r1_organic_visits,
  DROP COLUMN IF EXISTS r1_company_size,
  DROP COLUMN IF EXISTS r1_company_industry,
  DROP COLUMN IF EXISTS r1_company_logo_url,
  DROP COLUMN IF EXISTS r1_competitor_domain,
  DROP COLUMN IF EXISTS r1_competitor_gads_cost;
