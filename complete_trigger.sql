-- Create the complete trigger function with all fields
CREATE OR REPLACE FUNCTION public.extract_clay_data()
RETURNS TRIGGER AS $$
DECLARE
  semrush jsonb;
  competitors jsonb;
BEGIN
  -- Only update if we have clay_data
  IF NEW.clay_data IS NOT NULL THEN
    -- Store nested objects for easier access
    semrush := NEW.clay_data->'SEMRush Analytics';
    competitors := NEW.clay_data->'competitors';
    
    -- Basic company info
    NEW.company_name = NEW.clay_data->>'company_name';
    NEW.linkedin_url = NEW.clay_data->>'linkedin_url';
    NEW.country = NEW.clay_data->>'country';
    NEW.city_locality = NEW.clay_data->>'city_locality';
    NEW.founded_year = (NEW.clay_data->>'founded_year')::integer;
    NEW.company_description = NEW.clay_data->>'description';
    NEW.specialties = NEW.clay_data->'specialties';
    NEW.linkedin_follower_count = (NEW.clay_data->>'follower_count')::integer;

    -- SEMRush data
    IF semrush IS NOT NULL THEN
      NEW.semrush_total_visits = (semrush->>'total_visits')::integer;
      NEW.semrush_traffic_rank = (semrush->>'traffic_rank')::integer;
      NEW.semrush_bounce_rate = (semrush->>'bounce_rate')::numeric;
      NEW.semrush_pages_per_visit = (semrush->>'pages_per_visit')::numeric;
      NEW.semrush_time_on_site = (semrush->>'time_on_site')::numeric;
      NEW.semrush_paid_visits = (semrush->>'paid_visits')::integer;
      NEW.semrush_organic_visits = (semrush->>'organic_visits')::integer;
      NEW.semrush_direct_visits = (semrush->>'direct_visits')::integer;
      NEW.semrush_social_visits = (semrush->>'social_visits')::integer;
      NEW.semrush_mobile_traffic_share = (semrush->>'mobile_traffic_share')::numeric;
      NEW.semrush_mobile_bounce_rate = (semrush->>'mobile_bounce_rate')::numeric;
    END IF;
    
    -- Competitor data
    IF competitors IS NOT NULL AND jsonb_array_length(competitors) >= 1 THEN
      NEW.competitor_1_domain = competitors->0->>'domain';
      NEW.competitor_1_monthly_gads_traffic = (competitors->0->>'monthlyTraffic')::integer;
      NEW.competitor_1_monthly_adwords_cost = (competitors->0->>'monthlyAdwordsCostInUSD')::numeric;
      
      IF jsonb_array_length(competitors) >= 2 THEN
        NEW.competitor_2_domain = competitors->1->>'domain';
        NEW.competitor_2_monthly_gads_traffic = (competitors->1->>'monthlyTraffic')::integer;
        NEW.competitor_2_monthly_adwords_cost = (competitors->1->>'monthlyAdwordsCostInUSD')::numeric;
      END IF;
    END IF;
    
    -- SimilarWeb data
    IF NEW.clay_data->'SimilarWeb' IS NOT NULL THEN
      NEW.similarweb_visits = (NEW.clay_data->'SimilarWeb'->>'total_visits')::integer;
    END IF;

    RAISE NOTICE 'Data extracted for domain: %, company: %', NEW.domain, NEW.company_name;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- No need to recreate the trigger as it's already in place
-- Test the updated function
UPDATE public.domain_audits 
SET clay_data = clay_data 
WHERE domain = 'tesla.com'
RETURNING 
  domain,
  company_name,
  country,
  city_locality,
  founded_year,
  semrush_total_visits,
  competitor_1_domain,
  competitor_1_monthly_gads_traffic,
  semrush_bounce_rate,
  semrush_mobile_traffic_share;
