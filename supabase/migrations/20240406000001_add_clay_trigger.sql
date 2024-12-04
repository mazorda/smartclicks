/*
This migration adds a trigger to automatically extract Clay.com data
from the clay_data JSONB column into dedicated columns.

The trigger handles:
- Both lowercase and uppercase field names from Clay
- Type conversion (text, integer, numeric)
- Nested JSON structures (SEMRush, competitors)
- Null safety with COALESCE
*/

-- Create the trigger function
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
    
    -- Basic company info - handle both cases
    NEW.company_name = COALESCE(
      NEW.clay_data->>'company_name',
      NEW.clay_data->>'Company Name'
    );
    NEW.linkedin_url = COALESCE(
      NEW.clay_data->>'linkedin_url',
      NEW.clay_data->>'Linkedin Url'
    );
    NEW.country = COALESCE(
      NEW.clay_data->>'country',
      NEW.clay_data->>'Country'
    );
    NEW.city_locality = COALESCE(
      NEW.clay_data->>'city_locality',
      NEW.clay_data->>'City Locality'
    );
    NEW.founded_year = COALESCE(
      (NEW.clay_data->>'founded_year')::integer,
      (NEW.clay_data->>'Founded')::integer
    );
    NEW.company_description = COALESCE(
      NEW.clay_data->>'description',
      NEW.clay_data->>'Description'
    );
    NEW.specialties = COALESCE(
      NEW.clay_data->'specialties',
      NEW.clay_data->'Specialties'
    );
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

-- Create the trigger
DROP TRIGGER IF EXISTS extract_clay_data_trigger ON public.domain_audits;
CREATE TRIGGER extract_clay_data_trigger
  BEFORE INSERT OR UPDATE OF clay_data
  ON public.domain_audits
  FOR EACH ROW
  EXECUTE FUNCTION public.extract_clay_data();
